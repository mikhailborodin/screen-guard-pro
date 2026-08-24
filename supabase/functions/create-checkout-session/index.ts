import Stripe from "npm:stripe@22.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CheckoutRequest = {
  feature?: string;
  source?: string;
  extensionId?: string;
  billingInterval?: string;
  successUrl?: string;
  cancelUrl?: string;
};

type BillingInterval = "month" | "year";

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...init?.headers,
    },
  });

const requiredString = (value: unknown, field: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }

  return value.trim();
};

const requiredBillingInterval = (value: unknown): BillingInterval => {
  if (value !== "month" && value !== "year") {
    throw new Error("billingInterval must be month or year");
  }

  return value;
};

const randomLetters = (length: number) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
};

const createActivationToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
};

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const activationSuccessUrl = (rawUrl: string, activationToken: string) => {
  const url = new URL(rawUrl);
  url.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  url.hash = new URLSearchParams({ activation_token: activationToken }).toString();

  return url.toString().replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const monthlyPriceId = Deno.env.get("STRIPE_MONTHLY_PRICE_ID") ?? Deno.env.get("STRIPE_PRICE_ID");
    const yearlyPriceId = Deno.env.get("STRIPE_YEARLY_PRICE_ID");

    if (!stripeSecretKey || !monthlyPriceId || !yearlyPriceId) {
      return json({ error: "Stripe billing is not configured" }, { status: 500 });
    }

    const body = (await req.json()) as CheckoutRequest;
    const feature = requiredString(body.feature, "feature");
    const source = requiredString(body.source, "source");
    const extensionId = requiredString(body.extensionId, "extensionId");
    const billingInterval = requiredBillingInterval(body.billingInterval);
    const successUrl = requiredString(body.successUrl, "successUrl");
    const cancelUrl = requiredString(body.cancelUrl, "cancelUrl");

    if (feature !== "smart-auto-blur") {
      return json({ error: "Unsupported feature" }, { status: 400 });
    }

    if (!/^[a-p]{32}$/.test(extensionId)) {
      return json({ error: "Invalid extensionId" }, { status: 400 });
    }

    const activationToken = createActivationToken();
    const activationTokenHash = await sha256Hex(activationToken);
    const priceId = billingInterval === "year" ? yearlyPriceId : monthlyPriceId;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-07-29.dahlia" });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: activationSuccessUrl(successUrl, activationToken),
      cancel_url: cancelUrl,
      client_reference_id: extensionId,
      allow_promotion_codes: true,
      integration_identifier: `privacyblur_web_${randomLetters(8)}`,
      metadata: {
        feature,
        source,
        extensionId,
        billingInterval,
        activationTokenHash,
      },
      subscription_data: {
        metadata: {
          feature,
          source,
          extensionId,
          billingInterval,
          activationTokenHash,
        },
      },
    });

    return json({ url: session.url });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to create checkout session" }, { status: 400 });
  }
});
