import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { loadEdgeFunction, searchResults } from "./helpers/edge-function.mjs";

const extensionId = "a".repeat(32);
const token = "test-activation-token-".repeat(2);
const metadata = { extensionId, activationTokenHash: createHash("sha256").update(token).digest("hex"), feature: "smart-auto-blur", billingInterval: "lifetime" };
const charge = { paid: true, status: "succeeded", refunded: false, amount_refunded: 0, disputed: false };
const payment = { id: "pi_paid", created: 946684800, status: "succeeded", currency: "usd", amount: 5900, amount_received: 5900, metadata, latest_charge: charge };
const session = { id: "cs_test_paid", client_reference_id: extensionId, metadata, status: "complete", mode: "payment", payment_status: "paid", payment_intent: "pi_paid" };
const request = (query = "", auth = token) => new Request(`https://example.test/status?extension_id=${extensionId}${query}`, { headers: auth ? { Authorization: `Bearer ${auth}` } : {} });

function mockStripe({ currentPayment = payment, payments = [payment], currentSession = session, subscription } = {}) {
  return {
    checkout: { sessions: { retrieve: async () => currentSession } },
    paymentIntents: {
      search: ({ query }) => {
        assert.ok(query.includes(metadata.activationTokenHash));
        return searchResults(payments);
      },
      retrieve: async () => currentPayment,
    },
    subscriptions: {
      search: () => searchResults(subscription ? [subscription] : []),
      retrieve: async () => subscription,
    },
  };
}

test("a successful lifetime payment grants permanent access without an active subscription", async () => {
  const handler = await loadEdgeFunction("subscription-status", mockStripe());
  assert.deepEqual(await (await handler(request())).json(), { active: true, status: "active", plan: "lifetime", expiresAt: null });
});

test("success redirect verifies payment immediately without relying on the search index", async () => {
  const handler = await loadEdgeFunction("subscription-status", mockStripe({ payments: [] }));
  assert.equal((await (await handler(request("&session_id=cs_test_paid"))).json()).active, true);
});

for (const [name, changes] of Object.entries({
  pending: { status: "processing" }, unpaid: { amount_received: 0 }, wrongAmount: { amount: 500 },
  wrongCurrency: { currency: "eur" }, missingCharge: { latest_charge: null },
  refunded: { latest_charge: { ...charge, refunded: true, amount_refunded: 5900 } },
  partialRefund: { latest_charge: { ...charge, amount_refunded: 100 } },
  disputed: { latest_charge: { ...charge, disputed: true } },
  wrongToken: { metadata: { ...metadata, activationTokenHash: "wrong" } },
  wrongExtension: { metadata: { ...metadata, extensionId: "b".repeat(32) } },
  wrongFeature: { metadata: { ...metadata, feature: "unrelated" } },
  wrongPlan: { metadata: { ...metadata, billingInterval: "month" } },
})) {
  test(`${name} payment cannot grant lifetime Pro even with stale successful search results`, async () => {
    const handler = await loadEdgeFunction("subscription-status", mockStripe({ currentPayment: { ...payment, ...changes } }));
    assert.equal((await (await handler(request("&session_id=cs_test_paid"))).json()).active, false);
  });
}

test("missing token and malformed extension never reach Stripe", async () => {
  const handler = await loadEdgeFunction("subscription-status", {});
  assert.equal((await handler(request("", ""))).status, 401);
  assert.equal((await (await handler(new Request("https://example.test/status?extension_id=bad"))).json()).active, false);
});

test("session ID cannot bypass token ownership", async () => {
  const handler = await loadEdgeFunction("subscription-status", mockStripe({ payments: [], currentSession: { ...session, metadata: { ...metadata, activationTokenHash: "wrong" } } }));
  assert.equal((await (await handler(request("&session_id=cs_test_paid"))).json()).active, false);
});

for (const interval of ["month", "year"]) {
  test(`${interval} subscriptions remain active with the existing secret token`, async () => {
    const subscription = { id: "sub_active", status: "active", metadata: { ...metadata, billingInterval: interval } };
    const handler = await loadEdgeFunction("subscription-status", mockStripe({ payments: [], subscription }));
    assert.deepEqual(await (await handler(request())).json(), { active: true, status: "active", plan: interval });
  });
}

test("current canceled subscription does not grant access from a stale search result", async () => {
  const stripe = mockStripe({ payments: [], subscription: { id: "sub_old", status: "canceled", metadata } });
  const handler = await loadEdgeFunction("subscription-status", stripe);
  assert.equal((await (await handler(request())).json()).active, false);
});

test("extension preflight supports its X-Extension-Id header", async () => {
  const handler = await loadEdgeFunction("subscription-status", {});
  const response = await handler(new Request("https://example.test/status", { method: "OPTIONS" }));
  assert.match(response.headers.get("access-control-allow-headers"), /x-extension-id/);
});
