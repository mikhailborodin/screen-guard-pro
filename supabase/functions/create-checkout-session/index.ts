const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CheckoutRequest = {
  feature?: string;
  source?: string;
  extensionId?: string;
  successUrl?: string;
  cancelUrl?: string;
};

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripePriceId = Deno.env.get("STRIPE_PRICE_ID");

    if (!stripeSecretKey || !stripePriceId) {
      return json({ error: "Stripe billing is not configured" }, { status: 500 });
    }

    const body = (await req.json()) as CheckoutRequest;
    const feature = requiredString(body.feature, "feature");
    const source = requiredString(body.source, "source");
    const extensionId = requiredString(body.extensionId, "extensionId");
    const successUrl = requiredString(body.successUrl, "successUrl");
    const cancelUrl = requiredString(body.cancelUrl, "cancelUrl");

    if (feature !== "smart-auto-blur") {
      return json({ error: "Unsupported feature" }, { status: 400 });
    }

    const params = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": stripePriceId,
      "line_items[0][quantity]": "1",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: extensionId,
      "metadata[feature]": feature,
      "metadata[source]": source,
      "metadata[extensionId]": extensionId,
      "subscription_data[metadata][feature]": feature,
      "subscription_data[metadata][source]": source,
      "subscription_data[metadata][extensionId]": extensionId,
    });

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const stripeBody = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return json(
        { error: stripeBody?.error?.message ?? "Unable to create checkout session" },
        { status: stripeResponse.status },
      );
    }

    return json({ url: stripeBody.url });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to create checkout session" }, { status: 400 });
  }
});
