import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import test from "node:test";
import { initializeWebTelemetry } from "../src/data/webTelemetry.mjs";
import { buildFounderDashboardSpec, provisionFounderDashboard } from "../scripts/posthog/provision-dashboard.mjs";
import { loadEdgeFunction } from "./helpers/edge-function.mjs";

const VALID_VISITOR_ID = "11111111-1111-4111-8111-111111111111";
const VALID_INSTALL_ID = "22222222-2222-4222-8222-222222222222";
const EXTENSION_ID = "pfngjkakgncabcfjdknjacpnbidjlldm";

function createMockDom({
  url = "https://privacyblur.co/",
  referrer = "",
  lang = "en",
  storage = new Map(),
  sessionStore = new Map(),
} = {}) {
  const sentRequests = [];
  const listeners = new Map();
  let cookieJar = "";

  const makeStorage = (backing) => ({
    getItem: (k) => (backing.has(k) ? backing.get(k) : null),
    setItem: (k, v) => { backing.set(k, String(v)); },
  });

  const parsed = new URL(url);
  const win = {
    location: {
      href: parsed.href,
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
    },
    localStorage: makeStorage(storage),
    sessionStorage: makeStorage(sessionStore),
    crypto: webcrypto,
    fetch: async (endpoint, init) => {
      sentRequests.push({ endpoint, body: JSON.parse(init.body) });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    },
  };

  const doc = {
    defaultView: win,
    referrer,
    documentElement: { lang },
    get cookie() { return cookieJar; },
    set cookie(entry) {
      const [pair] = String(entry).split(";");
      const [k, v] = pair.split("=");
      const map = new Map(
        cookieJar
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => s.split("=")),
      );
      map.set(k.trim(), v ?? "");
      cookieJar = [...map.entries()].map(([ck, cv]) => `${ck}=${cv}`).join("; ");
    },
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener: (type, fn) => {
      listeners.set(type, (listeners.get(type) || []).filter((item) => item !== fn));
    },
  };
  doc.ownerDocument = doc;

  const navigate = (nextUrl, nextLang = lang) => {
    const next = new URL(nextUrl);
    win.location.href = next.href;
    win.location.pathname = next.pathname;
    win.location.search = next.search;
    win.location.hash = next.hash;
    doc.documentElement.lang = nextLang;
  };

  return { doc, win, storage, sessionStore, sentRequests, listeners, navigate };
}

test("webTelemetry preserves paid ad first-touch across extension install and paywall navigation", () => {
  const dom = createMockDom({
    url: "https://privacyblur.co/?utm_source=google_ads&utm_medium=cpc&utm_campaign=crm_demo&gclid=test123",
  });

  initializeWebTelemetry(dom.doc);
  assert.equal(dom.sentRequests.length, 1);
  assert.equal(dom.sentRequests[0].body.event, "site_landing_viewed");
  assert.equal(dom.sentRequests[0].body.first_touch.utm_source, "google_ads");
  assert.equal(dom.sentRequests[0].body.first_touch.click_id_type, "gclid");
  assert.equal(dom.sentRequests[0].body.install_id, undefined);

  const visitorId = dom.sentRequests[0].body.visitor_id;

  // Extension opens /welcome/ with internal utm_source=extension_install + install_id
  dom.navigate(
    `https://privacyblur.co/welcome/?utm_source=extension_install&install_id=${VALID_INSTALL_ID}&v=2.7.2`,
  );
  initializeWebTelemetry(dom.doc);

  assert.equal(dom.sentRequests.length, 2);
  const welcomeEvent = dom.sentRequests[1].body;
  assert.equal(welcomeEvent.event, "welcome_viewed");
  assert.equal(welcomeEvent.from_extension_install, true);
  assert.equal(welcomeEvent.visitor_id, visitorId);
  assert.equal(welcomeEvent.install_id, VALID_INSTALL_ID);
  assert.equal(welcomeEvent.stitch, true);
  assert.equal(welcomeEvent.version, "2.7.2");
  // Paid ad attribution MUST NOT be overwritten by utm_source=extension_install
  assert.equal(welcomeEvent.first_touch.utm_source, "google_ads");
  assert.equal(welcomeEvent.first_touch.utm_campaign, "crm_demo");

  // Later paywall visit remembers install_id and does not repeat stitch alias
  dom.navigate(
    `https://privacyblur.co/paywall/?source=extension&feature=role-sales&extension_id=${EXTENSION_ID}#activation_token=secret`,
  );
  initializeWebTelemetry(dom.doc);

  assert.equal(dom.sentRequests.length, 3);
  const paywallEvent = dom.sentRequests[2].body;
  assert.equal(paywallEvent.event, "paywall_viewed");
  assert.equal(paywallEvent.feature, "role-sales");
  assert.equal(paywallEvent.install_id, VALID_INSTALL_ID);
  assert.equal(paywallEvent.stitch, undefined);
  assert.equal(JSON.stringify(paywallEvent).includes("secret"), false);
});

test("web-telemetry Edge Function enforces origin/schema and sends PostHog alias + IP-stripped batch", async () => {
  const capturedBatches = [];
  const handler = await loadEdgeFunction(
    "web-telemetry",
    {},
    {
      POSTHOG_PROJECT_API_KEY: "phc_test_key",
      POSTHOG_HOST: "https://eu.i.posthog.com",
    },
    {
      fetch: async (url, init) => {
        capturedBatches.push({ url, body: JSON.parse(init.body) });
        return new Response(JSON.stringify({ status: 1 }), { status: 200 });
      },
    },
  );

  // Disallowed origin rejected
  const badOriginRes = await handler(
    new Request("https://example.test/web-telemetry", {
      method: "POST",
      headers: { origin: "https://evil.example", "content-type": "application/json" },
      body: JSON.stringify({ event: "site_landing_viewed", visitor_id: VALID_VISITOR_ID, path: "/" }),
    }),
  );
  assert.equal(badOriginRes.status, 403);

  // Valid stitched welcome_viewed event
  const okRes = await handler(
    new Request("https://example.test/web-telemetry", {
      method: "POST",
      headers: { origin: "https://privacyblur.co", "content-type": "application/json" },
      body: JSON.stringify({
        event: "welcome_viewed",
        visitor_id: VALID_VISITOR_ID,
        install_id: VALID_INSTALL_ID,
        stitch: true,
        path: "/welcome/",
        locale: "en",
        version: "2.7.2",
        from_extension_install: true,
        first_touch: {
          utm_source: "google_ads",
          utm_medium: "cpc",
          utm_campaign: "q4_launch",
          click_id_type: "gclid",
          landing_path: "/",
        },
      }),
    }),
  );
  assert.equal(okRes.status, 200);
  assert.equal(capturedBatches.length, 1);
  assert.equal(capturedBatches[0].url, "https://eu.i.posthog.com/batch/");

  const { api_key, batch } = capturedBatches[0].body;
  assert.equal(api_key, "phc_test_key");
  assert.equal(batch.length, 2);
  assert.equal(batch[0].event, "$create_alias");
  assert.equal(batch[0].properties.distinct_id, VALID_INSTALL_ID);
  assert.equal(batch[0].properties.alias, VALID_VISITOR_ID);
  assert.equal(batch[0].properties.$ip, null);

  assert.equal(batch[1].event, "welcome_viewed");
  assert.equal(batch[1].properties.distinct_id, VALID_INSTALL_ID);
  assert.equal(batch[1].properties.$ip, null);
  assert.equal(batch[1].properties.$geoip_disable, true);
  assert.equal(batch[1].properties.$set_once.initial_utm_source, "google_ads");
  assert.equal(batch[1].properties.$set.extension_version, "2.7.2");
});

test("create-checkout-session forwards installId, paywallFeature and attribution while preserving subscription-status ownership contract", async () => {
  let stripeSessionParams;
  const handler = await loadEdgeFunction(
    "create-checkout-session",
    {
      checkout: {
        sessions: {
          create: async (input) => {
            stripeSessionParams = input;
            return { url: "https://checkout.stripe.com/test" };
          },
        },
      },
    },
    { STRIPE_MONTHLY_PRICE_ID: "price_m", STRIPE_YEARLY_PRICE_ID: "price_y" },
  );

  const res = await handler(
    new Request("https://example.test/checkout", {
      method: "POST",
      body: JSON.stringify({
        feature: "smart-auto-blur",
        source: "extension",
        extensionId: EXTENSION_ID,
        billingInterval: "year",
        installId: VALID_INSTALL_ID,
        paywallFeature: "role-sales",
        attribution: {
          utm_source: "google_ads",
          utm_medium: "cpc",
          utm_campaign: "sales_crm",
          landing_path: "/",
        },
        successUrl: `https://privacyblur.co/payment-success/?extension_id=${EXTENSION_ID}`,
        cancelUrl: `https://privacyblur.co/payment-cancelled/?extension_id=${EXTENSION_ID}`,
      }),
    }),
  );

  assert.equal(res.status, 200);
  assert.equal(stripeSessionParams.client_reference_id, EXTENSION_ID);
  assert.equal(stripeSessionParams.metadata.feature, "smart-auto-blur");
  assert.equal(stripeSessionParams.metadata.installId, VALID_INSTALL_ID);
  assert.equal(stripeSessionParams.metadata.paywallFeature, "role-sales");
  assert.equal(stripeSessionParams.metadata.utmSource, "google_ads");
  assert.equal(stripeSessionParams.metadata.utmCampaign, "sales_crm");
  assert.deepEqual(stripeSessionParams.subscription_data.metadata, stripeSessionParams.metadata);

  // Reject malformed installId or unsupported paywallFeature
  const badInstall = await handler(
    new Request("https://example.test/checkout", {
      method: "POST",
      body: JSON.stringify({
        feature: "smart-auto-blur",
        source: "extension",
        extensionId: EXTENSION_ID,
        billingInterval: "month",
        installId: "not-a-uuid",
        successUrl: "https://privacyblur.co/payment-success/",
        cancelUrl: "https://privacyblur.co/payment-cancelled/",
      }),
    }),
  );
  assert.equal(badInstall.status, 400);
});

test("stripe-webhook verifies signature and emits accurate MRR, Net Cash, Lifetime and Refund events to PostHog", async () => {
  const posthogCaptures = [];
  let nextEvent;

  const mockStripe = {
    webhooks: {
      constructEventAsync: async (_body, sig, secret) => {
        if (sig !== "valid_sig" || secret !== "whsec_test") {
          throw new Error("Bad signature");
        }
        return nextEvent;
      },
    },
    charges: {
      retrieve: async () => ({ balance_transaction: { fee: 169 } }),
    },
    paymentIntents: {
      retrieve: async () => ({
        id: "pi_life_1",
        latest_charge: { balance_transaction: { fee: 201 } },
      }),
    },
  };

  const handler = await loadEdgeFunction(
    "stripe-webhook",
    mockStripe,
    {
      STRIPE_WEBHOOK_SECRET: "whsec_test",
      POSTHOG_PROJECT_API_KEY: "phc_test_key",
      POSTHOG_HOST: "https://eu.i.posthog.com",
    },
    {
      fetch: async (url, init) => {
        posthogCaptures.push({ url, body: JSON.parse(init.body) });
        return new Response(JSON.stringify({ status: 1 }), { status: 200 });
      },
    },
  );

  // 1. Invalid signature -> 400
  const invalidSigRes = await handler(
    new Request("https://example.test/stripe-webhook", {
      method: "POST",
      headers: { "stripe-signature": "bad_sig" },
      body: "{}",
    }),
  );
  assert.equal(invalidSigRes.status, 400);

  // 2. Annual subscription invoice.paid ($48 gross -> $4.00 MRR, $1.69 fee -> $46.31 net cash)
  nextEvent = {
    id: "evt_inv_1",
    type: "invoice.paid",
    created: 1761740000,
    data: {
      object: {
        id: "in_annual_1",
        customer: "cus_123",
        subscription: "sub_123",
        charge: "ch_123",
        amount_paid: 4800,
        tax: 0,
        currency: "usd",
        billing_reason: "subscription_create",
        parent: {
          subscription_details: {
            subscription: "sub_123",
            metadata: {
              feature: "smart-auto-blur",
              billingInterval: "year",
              installId: VALID_INSTALL_ID,
              paywallFeature: "role-fintech",
              utmSource: "google_ads",
            },
          },
        },
      },
    },
  };

  const annualRes = await handler(
    new Request("https://example.test/stripe-webhook", {
      method: "POST",
      headers: { "stripe-signature": "valid_sig" },
      body: JSON.stringify(nextEvent),
    }),
  );
  assert.equal(annualRes.status, 200);
  assert.equal(posthogCaptures.length, 1);
  const annualProps = posthogCaptures[0].body.properties;
  assert.equal(posthogCaptures[0].body.event, "invoice_paid");
  assert.equal(annualProps.distinct_id, VALID_INSTALL_ID);
  assert.equal(annualProps.$insert_id, "stripe_invoice_paid_in_annual_1");
  assert.equal(annualProps.gross_amount_usd, 48);
  assert.equal(annualProps.stripe_fee_usd, 1.69);
  assert.equal(annualProps.net_cash_usd, 46.31);
  assert.equal(annualProps.mrr_usd, 4);
  assert.equal(annualProps.is_first_payment, true);
  assert.equal(annualProps.paywall_feature, "role-fintech");
  assert.equal(annualProps.utm_source, "google_ads");

  // 3. Lifetime checkout.session.completed ($59 gross -> $0 MRR, $2.01 fee -> $56.99 net cash)
  nextEvent = {
    id: "evt_life_1",
    type: "checkout.session.completed",
    created: 1761740100,
    data: {
      object: {
        id: "cs_life_1",
        mode: "payment",
        payment_status: "paid",
        customer: "cus_life_1",
        payment_intent: "pi_life_1",
        amount_total: 5900,
        total_details: { amount_tax: 0 },
        currency: "usd",
        metadata: {
          feature: "smart-auto-blur",
          billingInterval: "lifetime",
          installId: VALID_INSTALL_ID,
          paywallFeature: "data-replacement",
          utmSource: "cws_organic",
        },
      },
    },
  };

  const lifeRes = await handler(
    new Request("https://example.test/stripe-webhook", {
      method: "POST",
      headers: { "stripe-signature": "valid_sig" },
      body: JSON.stringify(nextEvent),
    }),
  );
  assert.equal(lifeRes.status, 200);
  assert.equal(posthogCaptures.length, 2);
  const lifeProps = posthogCaptures[1].body.properties;
  assert.equal(lifeProps.billing_interval, "lifetime");
  assert.equal(lifeProps.mrr_usd, 0);
  assert.equal(lifeProps.net_cash_usd, 56.99);
  assert.equal(lifeProps.is_first_payment, true);

  // 4. Incremental partial refund (charge.refunded)
  nextEvent = {
    id: "evt_ref_1",
    type: "charge.refunded",
    created: 1761740200,
    data: {
      previous_attributes: { amount_refunded: 1000 },
      object: {
        id: "ch_ref_1",
        customer: "cus_123",
        amount_refunded: 2500,
        refunded: false,
        metadata: {
          feature: "smart-auto-blur",
          billingInterval: "year",
          installId: VALID_INSTALL_ID,
          utmSource: "google_ads",
        },
      },
    },
  };

  const refundRes = await handler(
    new Request("https://example.test/stripe-webhook", {
      method: "POST",
      headers: { "stripe-signature": "valid_sig" },
      body: JSON.stringify(nextEvent),
    }),
  );
  assert.equal(refundRes.status, 200);
  assert.equal(posthogCaptures.length, 3);
  assert.equal(posthogCaptures[2].body.event, "invoice_refunded");
  assert.equal(posthogCaptures[2].body.properties.refunded_usd, 15);
  assert.equal(posthogCaptures[2].body.properties.total_refunded_usd, 25);
});

test("PostHog Founder 5 Metrics provisioner builds valid spec and updates insights idempotently", async () => {
  const spec = buildFounderDashboardSpec();
  assert.equal(spec.pinned, true);
  assert.equal(spec.insights.length, 6);

  const calls = [];
  const summary = await provisionFounderDashboard({
    apiKey: "phx_test",
    projectId: "99",
    appHost: "https://eu.posthog.com",
    fetchImpl: async (url, init = {}) => {
      calls.push({ url, method: init.method || "GET" });
      if (url.includes("/dashboards/?")) {
        return new Response(JSON.stringify({ results: [] }), { status: 200 });
      }
      if (url.endsWith("/dashboards/") && init.method === "POST") {
        return new Response(JSON.stringify({ id: 42, name: spec.name }), { status: 201 });
      }
      if (url.includes("/insights/?")) {
        return new Response(
          JSON.stringify({ results: [{ id: 101, name: spec.insights[0].name, deleted: false }] }),
          { status: 200 },
        );
      }
      if (url.endsWith("/insights/101/") && init.method === "PATCH") {
        return new Response(JSON.stringify({ id: 101 }), { status: 200 });
      }
      if (url.endsWith("/insights/") && init.method === "POST") {
        return new Response(JSON.stringify({ id: 200 + calls.length }), { status: 201 });
      }
      throw new Error(`Unexpected URL ${url}`);
    },
  });

  assert.equal(summary.dashboardId, 42);
  assert.equal(summary.dashboardUrl, "https://eu.posthog.com/project/99/dashboard/42");
  assert.equal(summary.insights[0].action, "updated");
  assert.equal(summary.insights.filter((i) => i.action === "created").length, 5);
});
