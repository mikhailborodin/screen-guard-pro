import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { loadEdgeFunction } from "./helpers/edge-function.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("checkout keeps dynamic payment methods", async () => {
  const source = await read("supabase/functions/create-checkout-session/index.ts");

  assert.doesNotMatch(source, /payment_method_types/);
});

test("checkout maps monthly and yearly choices to server-controlled Stripe prices", async () => {
  const [checkoutSource, billingSource] = await Promise.all([
    read("supabase/functions/create-checkout-session/index.ts"),
    read("src/lib/billing.ts"),
  ]);

  assert.match(checkoutSource, /STRIPE_MONTHLY_PRICE_ID/);
  assert.match(checkoutSource, /STRIPE_YEARLY_PRICE_ID/);
  assert.match(checkoutSource, /billingInterval === "year" \? yearlyPriceId : monthlyPriceId/);
  assert.match(checkoutSource, /value !== "month" && value !== "year"/);
  assert.match(checkoutSource, /subscription_data: \{ metadata \}/);
  assert.match(billingSource, /billingInterval,/);
});

test("paywall offers $5 monthly, $48 yearly and $59 lifetime Pro", async () => {
  const source = await read("src/pages/Paywall.tsx");

  assert.match(source, /price: "\$5"/);
  assert.match(source, /price: "\$48"/);
  assert.match(source, /Save 20%/);
  assert.match(source, /price: "\$59"/);
  assert.match(source, /Pay once\. Pro forever\. No renewal/);
  assert.match(source, /All plans unlock every Smart Auto Blur Pro feature/);
});

const extensionId = "a".repeat(32);
const body = {
  feature: "smart-auto-blur", source: "extension", extensionId,
  successUrl: `https://privacyblur.co/payment-success?extension_id=${extensionId}`,
  cancelUrl: `https://privacyblur.co/payment-cancelled?extension_id=${extensionId}`,
};
const request = (values) => new Request("https://example.test/checkout", { method: "POST", body: JSON.stringify({ ...body, ...values }) });
const config = { STRIPE_MONTHLY_PRICE_ID: "price_month", STRIPE_YEARLY_PRICE_ID: "price_year" };

for (const interval of ["month", "year", "lifetime"]) {
  test(`${interval} checkout uses correct mode, price and secret-bound metadata`, async () => {
    let params;
    const handler = await loadEdgeFunction("create-checkout-session", {
      checkout: { sessions: { create: async (input) => { params = input; return { url: "https://checkout.stripe.com/test" }; } } },
    }, config);
    const response = await handler(request({ billingInterval: interval, amount: 1, priceId: "attacker-price" }));
    assert.equal(response.status, 200);
    assert.equal(params.mode, interval === "lifetime" ? "payment" : "subscription");
    assert.equal(params.client_reference_id, extensionId);
    assert.equal(params.allow_promotion_codes, interval !== "lifetime");
    assert.match(params.integration_identifier, /^privacyblur_web_[a-z]{8}$/);
    assert.match(params.success_url, /session_id=\{CHECKOUT_SESSION_ID\}/);
    const token = new URLSearchParams(new URL(params.success_url).hash.slice(1)).get("activation_token");
    assert.match(token, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(params.metadata.activationTokenHash, createHash("sha256").update(token).digest("hex"));
    assert.equal(params.metadata.billingInterval, interval);
    assert.equal(params.metadata.feature, "smart-auto-blur");
    if (interval === "lifetime") {
      const price = params.line_items[0].price_data;
      assert.equal(price.unit_amount, 5900);
      assert.equal(price.currency, "usd");
      assert.equal(price.recurring, undefined);
      assert.equal(params.subscription_data, undefined);
      assert.deepEqual(params.payment_intent_data.metadata, params.metadata);
      assert.equal(params.adaptive_pricing.enabled, false);
    } else {
      assert.equal(params.line_items[0].price, config[interval === "year" ? "STRIPE_YEARLY_PRICE_ID" : "STRIPE_MONTHLY_PRICE_ID"]);
      assert.equal(params.payment_intent_data, undefined);
      assert.deepEqual(params.subscription_data.metadata, params.metadata);
    }
  });
}

test("invalid plan and extension are rejected before Stripe is called", async () => {
  const handler = await loadEdgeFunction("create-checkout-session", {}, config);
  for (const values of [{}, { billingInterval: "free" }, { billingInterval: "lifetime", extensionId: 'x" OR status:"active' }]) {
    assert.equal((await handler(request(values))).status, 400);
  }
});

test("lifetime is independent of recurring price configuration", async () => {
  const handler = await loadEdgeFunction("create-checkout-session", { checkout: { sessions: { create: async () => ({ url: "https://checkout.stripe.com/test" }) } } });
  assert.equal((await handler(request({ billingInterval: "lifetime" }))).status, 200);
  assert.equal((await handler(request({ billingInterval: "year" }))).status, 500);
});
