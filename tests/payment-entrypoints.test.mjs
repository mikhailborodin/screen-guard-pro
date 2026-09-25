import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const publishedStaticRoutes = [
  "alternatives/datablur",
  "alternatives/privacy-blu",
  "alternatives/safe-screen-share",
  "data-collection",
  "permissions",
  "privacy-policy",
  "terms",
  "use-cases/google-meet",
  "use-cases/hide-api-keys",
  "use-cases/loom-recording",
  "use-cases/screen-sharing",
  "use-cases/zoom",
];

test("build preserves every published Pages route", async () => {
  execFileSync("npm", ["run", "build"], { cwd: root, stdio: "pipe" });

  const home = await readFile(join(dist, "index.html"), "utf8");
  const script = home.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)?.[1];
  const stylesheet = home.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/)?.[1];
  assert.ok(script);
  assert.ok(stylesheet);
  assert.match(home, /<div id="root"><\/div>/);
  assert.match(home, /gtag\('config', 'G-PE695ZZE0F'\)/);

  for (const route of publishedStaticRoutes) {
    const page = await readFile(join(dist, route, "index.html"), "utf8");
    assert.match(page, /<!doctype html>/i, route);
  }

  for (const route of ["paywall", "payment-success", "payment-cancelled"]) {
    const page = await readFile(join(dist, route, "index.html"), "utf8");
    assert.match(page, /<meta name="robots" content="noindex,nofollow" \/>/);
    assert.ok(page.includes(`<link rel="canonical" href="https://privacyblur.co/${route}/" />`));
    assert.ok(page.includes(`src="${script}"`));
    assert.ok(page.includes(`href="${stylesheet}"`));
    assert.match(page, /<div id="root"><main class="shell">/);
    assert.match(page, /gtag\("config", "G-PE695ZZE0F"\)/);
  }

  for (const asset of ["404.html", "CNAME", "app-icon.png", "favicon.ico", "robots.txt", "sitemap.xml", "social-preview.png", "social-preview.svg"]) {
    assert.ok((await readFile(join(dist, asset))).length > 0, asset);
  }
});
