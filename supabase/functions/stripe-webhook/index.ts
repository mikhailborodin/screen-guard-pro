import Stripe from "npm:stripe@22.4.0";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const toUsd = (cents: number) => Math.round(cents) / 100;

const idOf = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof (value as { id?: unknown }).id === "string") {
    return (value as { id: string }).id;
  }
  return "";
};

const extractBalanceFeeCents = (charge: unknown): number => {
  if (!charge || typeof charge !== "object") return 0;
  const bt = (charge as { balance_transaction?: unknown }).balance_transaction;
  if (bt && typeof bt === "object" && typeof (bt as { fee?: unknown }).fee === "number") {
    return (bt as { fee: number }).fee;
  }
  return 0;
};

async function resolveStripeFeeCents(
  stripe: Stripe,
  opts: { charge?: unknown; paymentIntent?: unknown },
): Promise<number> {
  const inlineFee = extractBalanceFeeCents(opts.charge);
  if (inlineFee > 0) return inlineFee;

  const chargeId = idOf(opts.charge);
  if (chargeId && stripe.charges?.retrieve) {
    try {
      const charge = await stripe.charges.retrieve(chargeId, { expand: ["balance_transaction"] });
      return extractBalanceFeeCents(charge);
    } catch {
      return 0;
    }
  }

  const piId = idOf(opts.paymentIntent);
  if (piId && stripe.paymentIntents?.retrieve) {
    try {
      const pi = await stripe.paymentIntents.retrieve(piId, { expand: ["latest_charge.balance_transaction"] });
      return extractBalanceFeeCents(pi.latest_charge);
    } catch {
      return 0;
    }
  }

  return 0;
}

function extractAttributionProps(metadata: Record<string, string | undefined>) {
  const installId = metadata.installId && uuidRe.test(metadata.installId) ? metadata.installId : "";
  const utmSource = metadata.utmSource || "direct_or_cws";
  return {
    installId,
    props: {
      ...(installId ? { install_id: installId } : {}),
      ...(metadata.extensionId ? { extension_id: metadata.extensionId } : {}),
      paywall_feature: metadata.paywallFeature || "smart-auto-blur",
      utm_source: utmSource,
      ...(metadata.utmMedium ? { utm_medium: metadata.utmMedium } : {}),
      ...(metadata.utmCampaign ? { utm_campaign: metadata.utmCampaign } : {}),
      ...(metadata.utmContent ? { utm_content: metadata.utmContent } : {}),
      ...(metadata.clickIdType ? { click_id_type: metadata.clickIdType } : {}),
      ...(metadata.referrerHost ? { referrer_host: metadata.referrerHost } : {}),
      ...(metadata.landingPath ? { landing_path: metadata.landingPath } : {}),
    },
    setOnce: {
      ...(metadata.utmSource ? { initial_utm_source: metadata.utmSource } : {}),
      ...(metadata.utmMedium ? { initial_utm_medium: metadata.utmMedium } : {}),
      ...(metadata.utmCampaign ? { initial_utm_campaign: metadata.utmCampaign } : {}),
      ...(metadata.utmContent ? { initial_utm_content: metadata.utmContent } : {}),
      ...(metadata.clickIdType ? { initial_click_id_type: metadata.clickIdType } : {}),
      ...(metadata.referrerHost ? { initial_referrer_host: metadata.referrerHost } : {}),
      ...(metadata.landingPath ? { initial_landing_path: metadata.landingPath } : {}),
    },
  };
}

async function capturePostHog(
  host: string,
  apiKey: string,
  event: string,
  distinctId: string,
  insertId: string,
  timestampIso: string,
  properties: Record<string, unknown>,
) {
  const response = await fetch(`${host}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      event,
      timestamp: timestampIso,
      properties: {
        distinct_id: distinctId,
        "$insert_id": insertId,
        "$ip": null,
        "$geoip_disable": true,
        ...properties,
      },
    }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    throw new Error(`PostHog capture failed with status ${response.status}`);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const posthogKey = Deno.env.get("POSTHOG_PROJECT_API_KEY");
  const posthogHost = Deno.env.get("POSTHOG_HOST") || "";

  if (
    !stripeSecretKey ||
    !webhookSecret ||
    !posthogKey ||
    !["https://eu.i.posthog.com", "https://us.i.posthog.com"].includes(posthogHost)
  ) {
    return json({ error: "Webhook service is not configured" }, 503);
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return json({ error: "Missing stripe-signature header" }, 400);
  }

  const reader = req.body?.getReader();
  if (!reader) return json({ error: "Missing body" }, 400);
  let rawBody = "";
  let totalBytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > 262144) {
      await reader.cancel();
      return json({ error: "Payload too large" }, 413);
    }
    rawBody += decoder.decode(value, { stream: true });
  }
  rawBody += decoder.decode();

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-07-29.dahlia" });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch {
    return json({ error: "Invalid Stripe webhook signature" }, 400);
  }

  try {
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Record<string, unknown>;
      const grossCents = typeof invoice.amount_paid === "number" ? invoice.amount_paid : 0;
      if (grossCents <= 0) {
        return json({ ok: true, ignored: "zero_amount_invoice" });
      }

      const parentSubDetails = (invoice.parent as { subscription_details?: { subscription?: unknown; metadata?: Record<string, string> } } | undefined)?.subscription_details;
      const legacySubDetails = invoice.subscription_details as { metadata?: Record<string, string> } | undefined;
      const subscriptionId = idOf(invoice.subscription) || idOf(parentSubDetails?.subscription);

      let metadata: Record<string, string | undefined> = {
        ...(parentSubDetails?.metadata ?? legacySubDetails?.metadata ?? {}),
      };
      if (!metadata.feature && subscriptionId && stripe.subscriptions?.retrieve) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        metadata = { ...(sub.metadata ?? {}) };
      }

      if (metadata.feature !== "smart-auto-blur") {
        return json({ ok: true, ignored: "unrelated_product" });
      }

      const billingInterval = metadata.billingInterval === "year" ? "year" : "month";
      const taxCents = typeof invoice.tax === "number"
        ? invoice.tax
        : Array.isArray(invoice.total_taxes)
          ? (invoice.total_taxes as Array<{ amount?: number }>).reduce((sum, t) => sum + (t.amount ?? 0), 0)
          : 0;
      const feeCents = await resolveStripeFeeCents(stripe, {
        charge: invoice.charge,
        paymentIntent: invoice.payment_intent,
      });
      const subtotalExTaxCents = Math.max(0, grossCents - taxCents);
      const netCashCents = grossCents - taxCents - feeCents;
      const mrrCents = billingInterval === "year"
        ? Math.round(subtotalExTaxCents / 12)
        : subtotalExTaxCents;

      const customerId = idOf(invoice.customer) || subscriptionId || String(invoice.id || event.id);
      const { installId, props, setOnce } = extractAttributionProps(metadata);
      const distinctId = installId || customerId;
      const paidUnix =
        (invoice.status_transitions as { paid_at?: number } | undefined)?.paid_at ??
        (typeof invoice.created === "number" ? invoice.created : event.created);
      const timestampIso = new Date(paidUnix * 1000).toISOString();
      const billingReason = typeof invoice.billing_reason === "string" ? invoice.billing_reason : "";
      const isFirstPayment = billingReason === "subscription_create" || billingReason === "manual";

      await capturePostHog(
        posthogHost,
        posthogKey,
        "invoice_paid",
        distinctId,
        `stripe_invoice_paid_${String(invoice.id || event.id)}`,
        timestampIso,
        {
          stripe_customer_id: customerId,
          ...(subscriptionId ? { subscription_id: subscriptionId } : {}),
          invoice_id: String(invoice.id || ""),
          billing_interval: billingInterval,
          billing_reason: billingReason,
          is_first_payment: isFirstPayment,
          currency: typeof invoice.currency === "string" ? invoice.currency : "usd",
          gross_amount_usd: toUsd(grossCents),
          tax_usd: toUsd(taxCents),
          stripe_fee_usd: toUsd(feeCents),
          net_cash_usd: toUsd(netCashCents),
          mrr_usd: toUsd(mrrCents),
          ...props,
          "$set": {
            is_pro: true,
            billing_interval: billingInterval,
            stripe_customer_id: customerId,
          },
          "$set_once": {
            ...setOnce,
            first_paid_at: timestampIso,
          },
        },
      );

      return json({ ok: true, captured: "invoice_paid" });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Record<string, unknown>;
      const metadata = (session.metadata ?? {}) as Record<string, string | undefined>;
      if (
        session.mode !== "payment" ||
        session.payment_status !== "paid" ||
        metadata.feature !== "smart-auto-blur" ||
        metadata.billingInterval !== "lifetime"
      ) {
        return json({ ok: true, ignored: "non_lifetime_checkout" });
      }

      const paymentIntentId = idOf(session.payment_intent);
      const grossCents = typeof session.amount_total === "number" ? session.amount_total : 5900;
      const taxCents =
        (session.total_details as { amount_tax?: number } | undefined)?.amount_tax ?? 0;
      const feeCents = await resolveStripeFeeCents(stripe, { paymentIntent: paymentIntentId });
      const netCashCents = grossCents - taxCents - feeCents;
      const customerId = idOf(session.customer) || paymentIntentId || String(session.id || event.id);
      const { installId, props, setOnce } = extractAttributionProps(metadata);
      const distinctId = installId || customerId;
      const createdUnix = typeof session.created === "number" ? session.created : event.created;
      const timestampIso = new Date(createdUnix * 1000).toISOString();

      await capturePostHog(
        posthogHost,
        posthogKey,
        "invoice_paid",
        distinctId,
        `stripe_lifetime_paid_${paymentIntentId || String(session.id || event.id)}`,
        timestampIso,
        {
          stripe_customer_id: customerId,
          ...(paymentIntentId ? { payment_intent_id: paymentIntentId } : {}),
          invoice_id: paymentIntentId || String(session.id || ""),
          billing_interval: "lifetime",
          billing_reason: "lifetime_purchase",
          is_first_payment: true,
          currency: typeof session.currency === "string" ? session.currency : "usd",
          gross_amount_usd: toUsd(grossCents),
          tax_usd: toUsd(taxCents),
          stripe_fee_usd: toUsd(feeCents),
          net_cash_usd: toUsd(netCashCents),
          mrr_usd: 0,
          ...props,
          "$set": {
            is_pro: true,
            billing_interval: "lifetime",
            stripe_customer_id: customerId,
          },
          "$set_once": {
            ...setOnce,
            first_paid_at: timestampIso,
          },
        },
      );

      return json({ ok: true, captured: "invoice_paid_lifetime" });
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Record<string, unknown>;
      let metadata = (charge.metadata ?? {}) as Record<string, string | undefined>;
      const paymentIntentId = idOf(charge.payment_intent);
      if (!metadata.feature && paymentIntentId && stripe.paymentIntents?.retrieve) {
        const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
        metadata = (pi.metadata ?? {}) as Record<string, string | undefined>;
      }
      const invoiceId = idOf(charge.invoice);
      if (!metadata.feature && invoiceId && stripe.invoices?.retrieve) {
        const inv = await stripe.invoices.retrieve(invoiceId) as unknown as Record<string, unknown>;
        const subId = idOf(inv.subscription) || idOf((inv.parent as { subscription_details?: { subscription?: unknown } } | undefined)?.subscription_details?.subscription);
        if (subId && stripe.subscriptions?.retrieve) {
          const sub = await stripe.subscriptions.retrieve(subId);
          metadata = (sub.metadata ?? {}) as Record<string, string | undefined>;
        }
      }

      if (metadata.feature !== "smart-auto-blur") {
        return json({ ok: true, ignored: "unrelated_product" });
      }

      const totalRefunded = typeof charge.amount_refunded === "number" ? charge.amount_refunded : 0;
      const prevRefunded =
        (event.data.previous_attributes as { amount_refunded?: number } | undefined)?.amount_refunded ?? 0;
      const refundDeltaCents = Math.max(0, totalRefunded - prevRefunded) || totalRefunded;
      if (refundDeltaCents <= 0) {
        return json({ ok: true, ignored: "zero_refund" });
      }

      const customerId = idOf(charge.customer) || paymentIntentId || String(charge.id || event.id);
      const { installId, props } = extractAttributionProps(metadata);
      const distinctId = installId || customerId;
      const timestampIso = new Date(event.created * 1000).toISOString();

      await capturePostHog(
        posthogHost,
        posthogKey,
        "invoice_refunded",
        distinctId,
        `stripe_refund_${event.id}`,
        timestampIso,
        {
          stripe_customer_id: customerId,
          charge_id: String(charge.id || ""),
          ...(invoiceId ? { invoice_id: invoiceId } : {}),
          billing_interval: metadata.billingInterval || "month",
          refunded_usd: toUsd(refundDeltaCents),
          total_refunded_usd: toUsd(totalRefunded),
          full_refund: charge.refunded === true,
          is_dispute: false,
          ...props,
          ...(charge.refunded === true && metadata.billingInterval === "lifetime"
            ? { "$set": { is_pro: false } }
            : {}),
        },
      );

      return json({ ok: true, captured: "invoice_refunded" });
    }

    if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as Record<string, unknown>;
      const chargeId = idOf(dispute.charge);
      let charge: Record<string, unknown> | null =
        dispute.charge && typeof dispute.charge === "object"
          ? (dispute.charge as Record<string, unknown>)
          : null;
      if (!charge && chargeId && stripe.charges?.retrieve) {
        charge = await stripe.charges.retrieve(chargeId) as unknown as Record<string, unknown>;
      }
      const metadata = ((charge?.metadata ?? dispute.metadata) ?? {}) as Record<string, string | undefined>;
      if (metadata.feature !== "smart-auto-blur") {
        return json({ ok: true, ignored: "unrelated_product" });
      }

      const disputedCents = typeof dispute.amount === "number" ? dispute.amount : 0;
      const customerId = idOf(charge?.customer) || chargeId || String(dispute.id || event.id);
      const { installId, props } = extractAttributionProps(metadata);
      const distinctId = installId || customerId;
      const timestampIso = new Date(event.created * 1000).toISOString();

      await capturePostHog(
        posthogHost,
        posthogKey,
        "invoice_refunded",
        distinctId,
        `stripe_dispute_${String(dispute.id || event.id)}`,
        timestampIso,
        {
          stripe_customer_id: customerId,
          ...(chargeId ? { charge_id: chargeId } : {}),
          billing_interval: metadata.billingInterval || "month",
          refunded_usd: toUsd(disputedCents),
          total_refunded_usd: toUsd(disputedCents),
          full_refund: true,
          is_dispute: true,
          ...props,
          "$set": { is_pro: false },
        },
      );

      return json({ ok: true, captured: "dispute_created" });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Record<string, unknown>;
      const metadata = (subscription.metadata ?? {}) as Record<string, string | undefined>;
      if (metadata.feature !== "smart-auto-blur") {
        return json({ ok: true, ignored: "unrelated_product" });
      }

      const customerId = idOf(subscription.customer) || String(subscription.id || event.id);
      const { installId, props } = extractAttributionProps(metadata);
      const distinctId = installId || customerId;
      const canceledUnix =
        typeof subscription.canceled_at === "number" ? subscription.canceled_at : event.created;
      const timestampIso = new Date(canceledUnix * 1000).toISOString();

      await capturePostHog(
        posthogHost,
        posthogKey,
        "subscription_canceled",
        distinctId,
        `stripe_sub_del_${String(subscription.id || event.id)}`,
        timestampIso,
        {
          stripe_customer_id: customerId,
          subscription_id: String(subscription.id || ""),
          billing_interval: metadata.billingInterval || "month",
          ...props,
          "$set": { is_pro: false },
        },
      );

      return json({ ok: true, captured: "subscription_canceled" });
    }

    return json({ ok: true, ignored: event.type });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      502,
    );
  }
});
