import Stripe from "npm:stripe@22.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-extension-id",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...corsHeaders, ...init?.headers },
  });

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "Method not allowed" }, { status: 405 });

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) return json({ error: "Stripe billing is not configured" }, { status: 500 });

    const url = new URL(req.url);
    const extensionId = url.searchParams.get("extension_id")?.trim();
    const activationToken = (req.headers.get("Authorization") ?? "").match(/^Bearer\s+([A-Za-z0-9_-]{32,128})$/)?.[1];
    if (!extensionId || !/^[a-p]{32}$/.test(extensionId)) {
      return json({ active: false, status: "missing_extension_id" });
    }
    if (!activationToken) return json({ active: false, status: "missing_activation_token" }, { status: 401 });

    const activationTokenHash = await sha256Hex(activationToken);
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-07-29.dahlia" });
    const isOwned = (metadata: Stripe.Metadata | null) =>
      metadata?.extensionId === extensionId && metadata?.activationTokenHash === activationTokenHash &&
      metadata?.feature === "smart-auto-blur";

    const hasLifetimePayment = async (paymentIntentId: string) => {
      // Retrieve current state: search results can lag behind refunds/disputes.
      const payment = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge"] });
      const charge = payment.latest_charge;
      return isOwned(payment.metadata) && payment.metadata.billingInterval === "lifetime" &&
        payment.status === "succeeded" && payment.currency === "usd" && payment.amount === 5900 &&
        payment.amount_received === 5900 && typeof charge === "object" && charge !== null &&
        charge.paid && charge.status === "succeeded" && !charge.refunded && charge.amount_refunded === 0 && !charge.disputed;
    };
    const lifetimeAccess = () => json({ active: true, status: "active", plan: "lifetime", expiresAt: null });

    // Verify the redirect directly, before Stripe Search has indexed the purchase.
    // A session ID alone is never enough: the secret token must match as well.
    const sessionId = url.searchParams.get("session_id");
    if (sessionId && /^cs_(?:live|test)_[A-Za-z0-9]+$/.test(sessionId)) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (isOwned(session.metadata) && session.client_reference_id === extensionId && session.status === "complete") {
          if (session.mode === "payment" && session.payment_status === "paid" && typeof session.payment_intent === "string" &&
              await hasLifetimePayment(session.payment_intent)) return lifetimeAccess();
          if (session.mode === "subscription" && typeof session.subscription === "string") {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            if (isOwned(subscription.metadata) && subscription.status === "active") {
              return json({ active: true, status: "active", plan: subscription.metadata.billingInterval });
            }
          }
        }
      } catch (error) {
        if (!(error instanceof Stripe.errors.StripeInvalidRequestError) || error.code !== "resource_missing") throw error;
      }
    }

    // No date cutoff: lifetime access stays eligible on every future check.
    const ownershipQuery = `metadata["extensionId"]:"${extensionId}" AND metadata["activationTokenHash"]:"${activationTokenHash}"`;
    for await (const payment of stripe.paymentIntents.search({
      query: `${ownershipQuery} AND metadata["billingInterval"]:"lifetime" AND status:"succeeded"`, limit: 100,
    })) {
      if (await hasLifetimePayment(payment.id)) return lifetimeAccess();
    }
    for await (const candidate of stripe.subscriptions.search({ query: `${ownershipQuery} AND status:"active"`, limit: 100 })) {
      const subscription = await stripe.subscriptions.retrieve(candidate.id);
      if (isOwned(subscription.metadata) && subscription.status === "active") {
        return json({ active: true, status: "active", plan: subscription.metadata.billingInterval });
      }
    }
    return json({ active: false, status: "inactive" });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to check Pro access" }, { status: 400 });
  }
});
