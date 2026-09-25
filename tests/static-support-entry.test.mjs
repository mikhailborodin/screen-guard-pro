import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

test("build keeps the support entry interactive before prerendering the homepage", async () => {
  const [script, packageJson] = await Promise.all([
    readFile(new URL("../scripts/generate-support-entry.mjs", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(script, /copyFile\(source, destination\)/);
  assert.match(packageJson, /generate-support-entry\.mjs && node scripts\/generate-seo-pages\.mjs/);
});
