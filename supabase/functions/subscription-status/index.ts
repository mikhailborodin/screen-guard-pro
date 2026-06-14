const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      return json({ error: "Stripe billing is not configured" }, { status: 500 });
    }

    const url = new URL(req.url);
    const extensionId = url.searchParams.get("extension_id")?.trim();

    if (!extensionId) {
      return json({ active: false, status: "missing_extension_id" });
    }

    const params = new URLSearchParams({
      query: `metadata["extensionId"]:"${extensionId}" AND status:"active"`,
      limit: "1",
    });

    const stripeResponse = await fetch(`https://api.stripe.com/v1/subscriptions/search?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
      },
    });

    const stripeBody = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return json(
        { error: stripeBody?.error?.message ?? "Unable to check subscription status" },
        { status: stripeResponse.status },
      );
    }

    const subscription = Array.isArray(stripeBody.data) ? stripeBody.data[0] : undefined;

    return json({
      active: Boolean(subscription),
      status: subscription?.status ?? "inactive",
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to check subscription status" }, { status: 400 });
  }
});
