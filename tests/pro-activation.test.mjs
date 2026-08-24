import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("checkout binds a secret activation token to the Stripe subscription", async () => {
  const checkout = await read("supabase/functions/create-checkout-session/index.ts");

  assert.match(checkout, /createActivationToken/);
  assert.match(checkout, /activationTokenHash/);
  assert.match(checkout, /subscription_data/);
  assert.match(checkout, /activation_token/);
  assert.doesNotMatch(checkout, /metadata:\s*\{[^}]*activationToken,/s);
});

test("subscription status requires the matching bearer token", async () => {
  const status = await read("supabase/functions/subscription-status/index.ts");

  assert.match(status, /Authorization/);
  assert.match(status, /missing_activation_token/);
  assert.match(status, /metadata\["activationTokenHash"\]/);
  assert.match(status, /sha256Hex\(activationToken\)/);
});

test("payment success verifies Pro and activates the installed extension", async () => {
  const [billing, page] = await Promise.all([
    read("src/lib/billing.ts"),
    read("src/pages/PaymentSuccess.tsx"),
  ]);

  assert.match(billing, /Authorization: `Bearer \$\{activationToken\}`/);
  assert.match(billing, /action: "screenGuardProSubscription"/);
  assert.match(billing, /active: true/);
  assert.match(page, /activateExtension\(extensionId, activationToken\)/);
  assert.match(page, /useEffect/);
});
