import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import ts from "typescript";

export async function loadEdgeFunction(name, stripe, env = {}, extraGlobals = {}) {
  const source = await readFile(new URL(`../../supabase/functions/${name}/index.ts`, import.meta.url), "utf8");
  let handler;
  class Stripe {
    constructor() { return stripe; }
    static errors = { StripeInvalidRequestError: class extends Error {} };
  }
  const context = vm.createContext({
    Stripe,
    Request,
    Response,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    AbortSignal,
    Uint8Array,
    crypto: webcrypto,
    btoa,
    atob,
    fetch: extraGlobals.fetch ?? globalThis.fetch,
    Deno: {
      env: { get: (key) => ({ STRIPE_SECRET_KEY: "sk_test_mock", ...env })[key] },
      serve: (callback) => { handler = callback; },
    },
    ...extraGlobals,
  });
  const { outputText } = ts.transpileModule(source.replace(/^import Stripe[^\n]+\n/, ""), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  });
  vm.runInContext(outputText, context);
  return handler;
}

export async function* searchResults(values) { yield* values; }
