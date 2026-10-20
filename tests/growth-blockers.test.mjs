import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const siteUrl = "https://privacyblur.co";
const sitemapPaths = [
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

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("public copy uses Screen Privacy Blur consistently", async () => {
  const files = await Promise.all([
    read("index.html"),
    read("src/pages/Paywall.tsx"),
    read("src/pages/PaymentSuccess.tsx"),
    read("src/pages/Support.tsx"),
    read("public/404.html"),
  ]);

  for (const content of files) {
    assert.doesNotMatch(content, /Screen Guard Pro/);
  }
});

test("landing page does not overstate social proof", async () => {
  const cta = await read("src/components/CTA.tsx");

  assert.doesNotMatch(cta, /Join thousands/i);
  assert.match(cta, /Protect your screen before your next demo, call, or recording\./);
});

test("hero offers the requested video and interactive preview", async () => {
  const { heroHtml, heroInstallUrl } = await import("../src/data/marketing.mjs");
  const hero = heroHtml();
  assert.match(hero, /https:\/\/www\.youtube\.com\/watch\?v=g2E4lR6M8Zc/);
  assert.match(hero, /href="#interactive-demo"/);
  assert.match(hero, /Add to Chrome — It's Free/);
  const url = new URL(heroInstallUrl);
  assert.equal(url.searchParams.get("utm_source"), "privacyblur_site");
  assert.equal(url.searchParams.get("utm_medium"), "landing");
});

test("hero retains the macOS desktop download", async () => {
  const { heroHtml } = await import("../src/data/marketing.mjs");
  assert.match(heroHtml(), /Download DMG for macOS/);
  assert.match(heroHtml(), /\/downloads\/ScreenPrivacyBlurMac\.dmg/);
  assert.match(heroHtml(), /browser tabs and desktop apps/);
});

test("install and download buttons send GA4 custom events", async () => {
  const [analytics, hero, cta, desktopApp, growthPage] = await Promise.all([
    read("src/lib/analytics.ts"),
    read("src/components/MarketingSection.tsx"),
    read("src/components/CTA.tsx"),
    read("src/components/MacDesktopApp.tsx"),
    read("src/pages/GrowthPage.tsx"),
  ]);

  assert.match(analytics, /install_chrome_click/);
  assert.match(analytics, /download_macos_click/);
  assert.match(analytics, /target_url: targetUrl/);
  assert.match(analytics, /transport_type: "beacon"/);

  assert.match(hero, /trackInstallClick/);
  assert.match(hero, /link.dataset.install === 'macos'/);
  assert.match(hero, /targetUrl: link.href/);
  assert.match(cta, /installActionsHtml\(pathname, "footer"\)/);
  assert.match(desktopApp, /trackInstallClick\(\{ target: "macos", placement: "mac_section", targetUrl: macDownloadUrl \}\)/);
  assert.match(growthPage, /installActionsHtml\(pathname/);
});

test("homepage includes a macOS desktop app section", async () => {
  const [index, desktopApp] = await Promise.all([
    read("src/pages/Index.tsx"),
    read("src/components/MacDesktopApp.tsx"),
  ]);

  assert.match(index, /import \{ MacDesktopApp \} from "@\/components\/MacDesktopApp";/);
  assert.match(index, /<section id="mac-desktop">/);
  assert.match(index, /<MacDesktopApp \/>/);
  assert.match(desktopApp, /macOS desktop app/);
  assert.match(desktopApp, /Overlay Blur/);
  assert.match(desktopApp, /Attach overlays to a visible app window/);
  assert.match(desktopApp, /\/downloads\/ScreenPrivacyBlurMac\.dmg/);
});

test("footer links point to real pages", async () => {
  const footer = await read("src/components/Footer.tsx");

  assert.doesNotMatch(footer, /href="#"/);
  assert.match(footer, /to="\/use-cases\/"/);
  assert.match(footer, /to="\/alternatives\/"/);
  assert.match(footer, /to="\/privacy-policy\/"/);
  assert.match(footer, /to="\/terms\/"/);
  assert.match(footer, /to="\/data-collection\/"/);
  assert.match(footer, /to="\/permissions\/"/);
});

test("growth pages use a shared content source and explicit routes", async () => {
  const [app, content] = await Promise.all([read("src/App.tsx"), read("src/data/seoContent.mjs")]);

  assert.match(app, /growthPagesByPath/);
  assert.match(app, /<GrowthHub group="Use cases"/);
  assert.match(app, /<GrowthHub group="Alternatives"/);
  for (const path of sitemapPaths.filter((path) => path.split("/").filter(Boolean).length > 1)) {
    assert.match(content, new RegExp(`path: "${path.replaceAll("/", "\\/")}"`));
  }
});

test("sitemap and robots expose growth pages", async () => {
  const [sitemap, robots] = await Promise.all([read("public/sitemap.xml"), read("public/robots.txt")]);

  for (const path of sitemapPaths) {
    assert.match(sitemap, new RegExp(`<loc>${siteUrl}${path}</loc>`));
  }
  assert.match(robots, new RegExp(`Sitemap: ${siteUrl}/sitemap\\.xml`));
});

test("support route stays on the React form instead of a static fallback", async () => {
  await assert.rejects(() => read("public/support/index.html"), { code: "ENOENT" });
});

test("social preview image replaces placeholder OG image", async () => {
  const index = await read("index.html");

  assert.doesNotMatch(index, /placeholder\.svg/);
  assert.match(index, /https:\/\/privacyblur\.co\/social-preview\.png/);
  const image = await stat(new URL("../public/social-preview.png", import.meta.url));
  assert.ok(image.size > 10_000, "social preview image should be a real asset");
});
