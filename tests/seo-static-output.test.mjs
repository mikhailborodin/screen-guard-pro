import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteUrl = "https://privacyblur.co";
const publicPaths = [
  "/",
  "/use-cases/",
  "/alternatives/",
  "/privacy-policy/",
  "/terms/",
  "/data-collection/",
  "/permissions/",
  "/use-cases/screen-sharing/",
  "/use-cases/google-meet/",
  "/use-cases/zoom/",
  "/use-cases/loom-recording/",
  "/use-cases/hide-api-keys/",
  "/alternatives/safe-screen-share/",
  "/alternatives/datablur/",
  "/alternatives/privacy-blu/",
];

const outputPath = (path) => join(root, "dist", path === "/" ? "index.html" : path.slice(1), path === "/" ? "" : "index.html");

test("production build emits crawlable canonical HTML for every sitemap URL", async () => {
  await execFileAsync("npm", ["run", "build"], { cwd: root });

  const sitemap = await readFile(join(root, "dist/sitemap.xml"), "utf8");
  const documents = await Promise.all(
    publicPaths.map(async (path) => ({ path, html: await readFile(outputPath(path), "utf8") }))
  );

  for (const { path, html } of documents) {
    assert.match(sitemap, new RegExp(`<loc>${siteUrl}${path}</loc>`));
    assert.match(html, new RegExp(`<link rel="canonical" href="${siteUrl}${path.replaceAll("/", "\\/")}"`));
    assert.equal((html.match(/<h1/g) ?? []).length, 1, `${path} should have one H1`);
    assert.ok(html.length > 2_000, `${path} should contain meaningful static HTML`);
  }

  const home = documents.find(({ path }) => path === "/").html;
  assert.match(home, /SoftwareApplication/);
  assert.match(home, /Blur sensitive information before screen sharing/);
  assert.match(home, /Watch demo/);
  assert.doesNotMatch(home, /<script type="module" crossorigin src="\/assets\//);
  assert.doesNotMatch(home, /<link rel="stylesheet" crossorigin href="\/assets\//);
  assert.match(home, /analyticsEvents = \["pointerdown"/);
  assert.doesNotMatch(home, /<script async src="https:\/\/www\.googletagmanager\.com/);

  const support = await readFile(join(root, "dist/support/index.html"), "utf8");
  assert.match(support, /<script type="module" crossorigin src="\/assets\//);
});

test("transactional application pages are not indexable", async () => {
  for (const path of ["/paywall/", "/payment-success/", "/payment-cancelled/"]) {
    const html = await readFile(outputPath(path), "utf8");
    assert.match(html, /<meta name="robots" content="noindex,nofollow" \/>/);
  }
});
