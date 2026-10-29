#!/usr/bin/env node
/**
 * Idempotently creates or updates the "Founder 5 Metrics — Screen Privacy Blur"
 * pinned dashboard and its insights via the PostHog REST API.
 *
 * Usage:
 *   POSTHOG_PERSONAL_API_KEY=phx_... \
 *   POSTHOG_PROJECT_ID=12345 \
 *   POSTHOG_APP_HOST=https://eu.posthog.com \
 *   node scripts/posthog/provision-dashboard.mjs
 */

export const DASHBOARD_NAME = "Founder 5 Metrics — Screen Privacy Blur";

export const HOGQL_REVENUE_RETENTION = `
WITH canceled_subs AS (
  SELECT
    properties.subscription_id AS subscription_id,
    min(toStartOfMonth(timestamp)) AS canceled_month
  FROM events
  WHERE event = 'subscription_canceled'
    AND properties.subscription_id IS NOT NULL
  GROUP BY subscription_id
),
full_refunds AS (
  SELECT DISTINCT properties.invoice_id AS invoice_id
  FROM events
  WHERE event = 'invoice_refunded'
    AND properties.full_refund = true
    AND properties.invoice_id IS NOT NULL
),
customer_monthly_mrr AS (
  SELECT
    addMonths(toStartOfMonth(e.timestamp), month_offset) AS mrr_month,
    e.properties.stripe_customer_id AS customer_id,
    sum(toFloat(e.properties.mrr_usd)) AS mrr_usd
  FROM events AS e
  ARRAY JOIN range(0, if(e.properties.billing_interval = 'year', 12, 1)) AS month_offset
  LEFT JOIN canceled_subs AS cs
    ON cs.subscription_id = e.properties.subscription_id
  WHERE e.event = 'invoice_paid'
    AND e.properties.billing_interval IN ('month', 'year')
    AND toFloat(e.properties.mrr_usd) > 0
    AND e.properties.invoice_id NOT IN (SELECT invoice_id FROM full_refunds)
    AND (
      cs.canceled_month IS NULL
      OR addMonths(toStartOfMonth(e.timestamp), month_offset) < cs.canceled_month
    )
  GROUP BY mrr_month, customer_id
),
cohort_pairs AS (
  SELECT
    addMonths(prev.mrr_month, 1) AS eval_month,
    prev.customer_id AS customer_id,
    prev.mrr_usd AS prev_mrr_usd,
    coalesce(curr.mrr_usd, 0) AS curr_mrr_usd,
    least(coalesce(curr.mrr_usd, 0), prev.mrr_usd) AS retained_gross_mrr_usd
  FROM customer_monthly_mrr AS prev
  LEFT JOIN customer_monthly_mrr AS curr
    ON curr.customer_id = prev.customer_id
   AND curr.mrr_month = addMonths(prev.mrr_month, 1)
  WHERE prev.mrr_usd > 0
)
SELECT
  eval_month AS month,
  count() AS prev_paying_customers,
  countIf(curr_mrr_usd > 0) AS retained_customers,
  round(sum(prev_mrr_usd), 2) AS prev_cohort_mrr_usd,
  round(sum(curr_mrr_usd), 2) AS curr_cohort_mrr_usd,
  round(100.0 * sum(retained_gross_mrr_usd) / nullIf(sum(prev_mrr_usd), 0), 2) AS grr_pct,
  round(100.0 * sum(curr_mrr_usd) / nullIf(sum(prev_mrr_usd), 0), 2) AS nrr_pct
FROM cohort_pairs
WHERE eval_month <= toStartOfMonth(now())
GROUP BY month
ORDER BY month DESC
LIMIT 12
`.trim();

export const HOGQL_LTV_30D = `
WITH first_payments AS (
  SELECT
    properties.stripe_customer_id AS customer_id,
    min(timestamp) AS first_paid_at,
    argMin(properties.billing_interval, timestamp) AS initial_interval,
    argMin(coalesce(properties.utm_source, 'direct_or_cws'), timestamp) AS utm_source
  FROM events
  WHERE event = 'invoice_paid'
    AND properties.stripe_customer_id IS NOT NULL
  GROUP BY customer_id
),
cash_30d AS (
  SELECT
    fp.customer_id AS customer_id,
    toStartOfMonth(fp.first_paid_at) AS cohort_month,
    fp.initial_interval AS initial_interval,
    fp.utm_source AS utm_source,
    fp.first_paid_at <= now() - INTERVAL 30 DAY AS is_mature_30d,
    sumIf(
      toFloat(e.properties.net_cash_usd),
      e.event = 'invoice_paid'
    ) - sumIf(
      toFloat(e.properties.refunded_usd),
      e.event = 'invoice_refunded'
    ) AS net_ltv_30d_usd
  FROM first_payments AS fp
  INNER JOIN events AS e
    ON e.properties.stripe_customer_id = fp.customer_id
   AND e.event IN ('invoice_paid', 'invoice_refunded')
   AND e.timestamp >= fp.first_paid_at
   AND e.timestamp < fp.first_paid_at + INTERVAL 30 DAY
  GROUP BY fp.customer_id, cohort_month, fp.initial_interval, fp.utm_source, is_mature_30d
)
SELECT
  cohort_month,
  count() AS new_paying_total,
  countIf(is_mature_30d) AS mature_30d_customers,
  round(avgIf(net_ltv_30d_usd, is_mature_30d), 2) AS net_ltv_30d_all_usd,
  round(avgIf(net_ltv_30d_usd, is_mature_30d AND initial_interval = 'month'), 2) AS net_ltv_30d_monthly_usd,
  round(avgIf(net_ltv_30d_usd, is_mature_30d AND initial_interval = 'year'), 2) AS net_ltv_30d_yearly_usd,
  round(avgIf(net_ltv_30d_usd, is_mature_30d AND initial_interval = 'lifetime'), 2) AS net_ltv_30d_lifetime_usd
FROM cash_30d
GROUP BY cohort_month
ORDER BY cohort_month DESC
LIMIT 12
`.trim();

export const HOGQL_CAC_BY_MONTH = `
-- Update monthly_ad_spend tuples (YYYY-MM-01, utm_source, spend_usd) or replace with a PostHog Data Warehouse table.
WITH monthly_ad_spend AS (
  SELECT
    toDate(tupleElement(row, 1)) AS spend_month,
    tupleElement(row, 2) AS utm_source,
    toFloat(tupleElement(row, 3)) AS spend_usd
  FROM (
    SELECT arrayJoin([
      ('2026-10-01', 'google_ads', 0.0)
    ]) AS row
  )
),
first_buyers AS (
  SELECT
    properties.stripe_customer_id AS customer_id,
    toStartOfMonth(min(timestamp)) AS acq_month,
    argMin(coalesce(properties.utm_source, 'direct_or_cws'), timestamp) AS utm_source
  FROM events
  WHERE event = 'invoice_paid'
    AND properties.stripe_customer_id IS NOT NULL
  GROUP BY customer_id
),
spend_totals AS (
  SELECT spend_month, sum(spend_usd) AS total_spend_usd
  FROM monthly_ad_spend
  GROUP BY spend_month
)
SELECT
  fb.acq_month AS month,
  count() AS new_paying_customers,
  countIf(ms.spend_usd > 0) AS paid_channel_customers,
  round(coalesce(max(st.total_spend_usd), 0), 2) AS ad_spend_usd,
  round(coalesce(max(st.total_spend_usd), 0) / nullIf(count(), 0), 2) AS blended_cac_usd,
  round(coalesce(max(st.total_spend_usd), 0) / nullIf(countIf(ms.spend_usd > 0), 0), 2) AS paid_cac_usd
FROM first_buyers AS fb
LEFT JOIN spend_totals AS st
  ON st.spend_month = fb.acq_month
LEFT JOIN monthly_ad_spend AS ms
  ON ms.spend_month = fb.acq_month
 AND ms.utm_source = fb.utm_source
GROUP BY month
ORDER BY month DESC
LIMIT 12
`.trim();

export function buildFounderDashboardSpec() {
  return {
    name: DASHBOARD_NAME,
    description:
      "Core 5 SaaS metrics for Screen Privacy Blur: Revenue Retention (GRR/NRR), 30d Conversion Funnel, Paid vs Blended CAC, Net LTV 30d, and DAU/WAU/MAU Stickiness.",
    pinned: true,
    insights: [
      {
        name: "1. Revenue Retention (GRR & NRR by MRR)",
        description: "Monthly cohort MRR retention across recurring plans (< 50% GRR = leaky bucket).",
        query: {
          kind: "DataTableNode",
          source: {
            kind: "HogQLQuery",
            query: HOGQL_REVENUE_RETENTION,
          },
        },
      },
      {
        name: "2. Conversion to Paid (30d Cohort Funnel by UTM Source)",
        description: "Install -> Paywall Viewed -> Invoice Paid within 30 days, broken down by first-touch UTM source.",
        query: {
          kind: "InsightVizNode",
          source: {
            kind: "FunnelsQuery",
            dateRange: { date_from: "-90d" },
            funnelWindowInterval: 30,
            funnelWindowIntervalUnit: "day",
            series: [
              { kind: "EventsNode", event: "extension_installed", name: "Extension Installed" },
              { kind: "EventsNode", event: "paywall_viewed", name: "Paywall Viewed" },
              { kind: "EventsNode", event: "invoice_paid", name: "Paid Pro" },
            ],
            breakdownFilter: {
              breakdown_type: "person",
              breakdown: "initial_utm_source",
            },
          },
        },
      },
      {
        name: "3. Paid CAC vs Blended CAC (Monthly)",
        description: "Separates paid channel CAC from organic Chrome Web Store blended CAC.",
        query: {
          kind: "DataTableNode",
          source: {
            kind: "HogQLQuery",
            query: HOGQL_CAC_BY_MONTH,
          },
        },
      },
      {
        name: "4. Net LTV 30d (After Stripe Fees, Taxes & Refunds)",
        description: "Net cash per paying customer in days 0..30 (All plans vs Monthly-only vs Yearly vs Lifetime).",
        query: {
          kind: "DataTableNode",
          source: {
            kind: "HogQLQuery",
            query: HOGQL_LTV_30D,
          },
        },
      },
      {
        name: "5a. Active Users: DAU / WAU / MAU",
        description: "Intentional privacy protection usage (excludes passive background browser launches).",
        query: {
          kind: "InsightVizNode",
          source: {
            kind: "TrendsQuery",
            dateRange: { date_from: "-30d" },
            series: [
              { kind: "EventsNode", event: "extension_active_day", math: "dau", name: "DAU" },
              { kind: "EventsNode", event: "extension_active_day", math: "weekly_active", name: "WAU (7d)" },
              { kind: "EventsNode", event: "extension_active_day", math: "monthly_active", name: "MAU (30d)" },
            ],
          },
        },
      },
      {
        name: "5b. Stickiness Ratio: DAU / MAU (%)",
        description: "Daily stickiness percentage (A / B * 100). B2B weekday benchmark: 20-35%.",
        query: {
          kind: "InsightVizNode",
          source: {
            kind: "TrendsQuery",
            dateRange: { date_from: "-30d" },
            series: [
              { kind: "EventsNode", event: "extension_active_day", math: "dau", name: "DAU" },
              { kind: "EventsNode", event: "extension_active_day", math: "monthly_active", name: "MAU" },
            ],
            trendsFilter: {
              formula: "(A / B) * 100",
            },
          },
        },
      },
    ],
  };
}

export async function provisionFounderDashboard({
  apiKey,
  projectId,
  appHost = "https://eu.posthog.com",
  fetchImpl = fetch,
}) {
  const cleanHost = appHost.replace(/\/+$/, "");
  if (!apiKey || !projectId) {
    throw new Error("POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID are required.");
  }
  if (!["https://eu.posthog.com", "https://us.posthog.com"].includes(cleanHost)) {
    throw new Error("POSTHOG_APP_HOST must be https://eu.posthog.com or https://us.posthog.com.");
  }

  const api = async (path, method = "GET", body) => {
    const response = await fetchImpl(`${cleanHost}/api/projects/${projectId}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`PostHog API ${method} ${path} failed (${response.status}): ${detail}`);
    }
    return response.json();
  };

  const spec = buildFounderDashboardSpec();
  const dashboardsResp = await api("/dashboards/?limit=100");
  const existingList = Array.isArray(dashboardsResp.results) ? dashboardsResp.results : [];
  let dashboard = existingList.find((d) => d.name === spec.name && !d.deleted);

  if (!dashboard) {
    dashboard = await api("/dashboards/", "POST", {
      name: spec.name,
      description: spec.description,
      pinned: spec.pinned,
    });
  }

  const insightsResp = await api(`/insights/?dashboards=${encodeURIComponent(JSON.stringify([dashboard.id]))}&limit=100`);
  const existingInsights = Array.isArray(insightsResp.results) ? insightsResp.results : [];
  const results = [];

  for (const item of spec.insights) {
    const found = existingInsights.find((ins) => ins.name === item.name && !ins.deleted);
    if (found) {
      const updated = await api(`/insights/${found.id}/`, "PATCH", {
        name: item.name,
        description: item.description,
        query: item.query,
        dashboards: [dashboard.id],
      });
      results.push({ id: updated.id, name: item.name, action: "updated" });
    } else {
      const created = await api("/insights/", "POST", {
        name: item.name,
        description: item.description,
        query: item.query,
        dashboards: [dashboard.id],
      });
      results.push({ id: created.id, name: item.name, action: "created" });
    }
  }

  return {
    dashboardId: dashboard.id,
    dashboardUrl: `${cleanHost}/project/${projectId}/dashboard/${dashboard.id}`,
    insights: results,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  provisionFounderDashboard({
    apiKey: process.env.POSTHOG_PERSONAL_API_KEY,
    projectId: process.env.POSTHOG_PROJECT_ID,
    appHost: process.env.POSTHOG_APP_HOST || "https://eu.posthog.com",
  })
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
