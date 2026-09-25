import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const siteUrl = "https://privacyblur.co";
const sitemapPaths = [
  "/",
  "/privacy-policy",
  "/terms",
  "/support",
  "/data-collection",
  "/permissions",
  "/use-cases/screen-sharing",
  "/use-cases/google-meet",
  "/use-cases/zoom",
  "/use-cases/loom-recording",
  "/use-cases/hide-api-keys",
  "/alternatives/safe-screen-share",
  "/alternatives/datablur",
  "/alternatives/privacy-blu",
];
const staticFallbackPaths = sitemapPaths.filter((path) => path !== "/" && path !== "/support");

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

test("hero Watch Demo button opens the YouTube demo in a modal", async () => {
  const hero = await read("src/components/Hero.tsx");

  assert.match(hero, /DialogTrigger asChild/);
  assert.match(hero, /DialogTitle className="sr-only"/);
  assert.match(hero, /https:\/\/www\.youtube\.com\/embed\/pLqxd8KaClQ/);
  assert.match(hero, /title="Screen Privacy Blur demo"/);
  assert.doesNotMatch(hero, /demoUrl[\s\S]*target="_blank"/);
});

test("hero mentions the macOS desktop app", async () => {
  const hero = await read("src/components/Hero.tsx");

  assert.match(hero, /Chrome Extension \+ macOS App/);
  assert.match(hero, /Download DMG/);
  assert.match(hero, /\/downloads\/ScreenPrivacyBlurMac\.dmg/);
  assert.match(hero, /browser tabs and desktop apps/);
});

test("install and download buttons send GA4 custom events", async () => {
  const [analytics, hero, cta, desktopApp, growthPage] = await Promise.all([
    read("src/lib/analytics.ts"),
    read("src/components/Hero.tsx"),
    read("src/components/CTA.tsx"),
    read("src/components/MacDesktopApp.tsx"),
    read("src/pages/GrowthPage.tsx"),
  ]);

  assert.match(analytics, /install_chrome_click/);
  assert.match(analytics, /download_macos_click/);
  assert.match(analytics, /target_url: targetUrl/);
  assert.match(analytics, /transport_type: "beacon"/);

  assert.match(hero, /trackInstallClick\(\{ target: "chrome", placement: "hero", targetUrl: extensionUrl \}\)/);
  assert.match(hero, /trackInstallClick\(\{ target: "macos", placement: "hero", targetUrl: macDownloadUrl \}\)/);
  assert.match(cta, /trackInstallClick\(\{ target: "chrome", placement: "cta", targetUrl: extensionUrl \}\)/);
  assert.match(desktopApp, /trackInstallClick\(\{ target: "macos", placement: "mac_section", targetUrl: macDownloadUrl \}\)/);
  assert.match(growthPage, /trackInstallClick\(\{ target: "chrome", placement: "growth_page", targetUrl: extensionUrl \}\)/);
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
  assert.match(footer, /to="\/privacy-policy"/);
  assert.match(footer, /to="\/terms"/);
  assert.match(footer, /to="\/data-collection"/);
  assert.match(footer, /to="\/permissions"/);
});

test("growth pages are routed explicitly", async () => {
  const app = await read("src/App.tsx");

  for (const path of sitemapPaths.filter((path) => path !== "/")) {
    assert.match(app, new RegExp(`path="${path.replaceAll("/", "\\/")}"`));
  }
});

test("sitemap and robots expose growth pages", async () => {
  const [sitemap, robots] = await Promise.all([read("public/sitemap.xml"), read("public/robots.txt")]);

  for (const path of sitemapPaths) {
    assert.match(sitemap, new RegExp(`<loc>${siteUrl}${path}</loc>`));
  }
  assert.match(robots, new RegExp(`Sitemap: ${siteUrl}/sitemap\\.xml`));
});

test("sitemap routes have static GitHub Pages fallbacks", async () => {
  for (const path of staticFallbackPaths) {
    const html = await read(`public${path}/index.html`);

    assert.match(html, /Screen Privacy Blur/);
    assert.match(html, /G-PE695ZZE0F/);
    assert.match(html, /install_chrome_click/);
    assert.match(html, /window\.trackInstallClick\(this\.href\)/);
    assert.doesNotMatch(html, /sessionStorage\.setItem/);
  }
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
