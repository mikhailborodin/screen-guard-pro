import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { faqsForPage, getHomeFaqs, homeFaqs } from "../src/data/faq.mjs";
import { campaignForPath } from "../src/data/conversion.mjs";
import { getCopy, localeFromPath, localeList, localizedPath, nonDefaultLocales, stripLocalePrefix } from "../src/data/locales.mjs";
import { seoPages } from "../src/data/seoContent.mjs";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteUrl = "https://privacyblur.co";
const localizedPublicPaths = nonDefaultLocales.flatMap(l => [
  localizedPath("/", l.code),
  localizedPath("/welcome/", l.code),
]);
const publicPaths = [
  "/",
  "/welcome/",
  "/compare/",
  "/use-cases/",
  "/alternatives/",
  ...seoPages.map(page => page.path),
  ...localizedPublicPaths,
];

const outputPath = (path) => join(root, "dist", path === "/" ? "index.html" : path.slice(1), path === "/" ? "" : "index.html");

test("production build emits crawlable canonical HTML for every sitemap URL", async () => {
  await execFileAsync("npm", ["run", "build"], { cwd: root });

  const sitemap = await readFile(join(root, "dist/sitemap.xml"), "utf8");
  const documents = await Promise.all(
    publicPaths.map(async (path) => ({ path, html: await readFile(outputPath(path), "utf8") }))
  );

  for (const { path, html } of documents) {
    const locale = localeFromPath(path);
    const basePath = stripLocalePrefix(path);
    assert.match(sitemap, new RegExp(`<loc>${siteUrl}${path}</loc>`));
    assert.match(html, new RegExp(`<link rel="canonical" href="${siteUrl}${path.replaceAll("/", "\\/")}"`));
    assert.equal((html.match(/<h1/g) ?? []).length, 1, `${path} should have one H1`);
    assert.ok(html.length > 2_000, `${path} should contain meaningful static HTML`);
    for (const name of ['og:title', 'og:description', 'og:image', 'og:image:alt']) {
      assert.ok(html.includes(`property="${name}" content="`), `${path} needs ${name}`);
    }
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    for (const match of html.matchAll(/<a\b[^>]*href="(https:\/\/chromewebstore.google.com[^" ]+)"/g)) {
      const url = new URL(match[1].replaceAll('&amp;', '&'));
      if (url.pathname.endsWith('/reviews')) continue;
      assert.equal(url.searchParams.get('utm_source'), 'privacyblur_site', `${path} needs source attribution`);
      assert.equal(url.searchParams.get('utm_medium'), 'landing');
      assert.equal(url.searchParams.get('utm_campaign'), campaignForPath(path));
      assert.ok(['hero','navbar','pricing','comparison_table','footer'].includes(url.searchParams.get('utm_content')));
    }
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(match => JSON.parse(match[1]));
    const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
    const page = seoPages.find(page => page.path === path);
    const expectedFaqs = basePath === '/' ? getHomeFaqs(locale) : page && (path.startsWith('/compare/') || path.startsWith('/use-cases/')) ? faqsForPage(page) : null;
    if (expectedFaqs) {
      assert.deepEqual(faq.mainEntity.map(entity => [entity.name, entity.acceptedAnswer.text]), expectedFaqs.map(item => [item.question, item.answer]));
      for (const {question,answer} of expectedFaqs) {
        const escape = text => text.replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
        assert.ok(html.includes(`<summary>${escape(question)}</summary><p>${escape(answer)}</p>`), `${path} FAQ must be visible and match schema`);
      }
    } else assert.equal(faq, undefined);

  }

  const home = documents.find(({ path }) => path === "/").html;
  assert.match(home, /SoftwareApplication/);
  assert.match(home, /Auto-Blur or Replace Sensitive Data Before You Share Your Screen/);
  assert.match(home, /Watch 45s Demo/);
  assert.doesNotMatch(home, /<script type="module" crossorigin src="\/assets\//);
  assert.doesNotMatch(home, /<link rel="stylesheet" crossorigin href="\/assets\//);
  assert.match(home, /analyticsEvents = \["pointerdown"/);
  assert.doesNotMatch(home, /<script async src="https:\/\/www\.googletagmanager\.com/);

  const schema = JSON.parse(home.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
  assert.equal(schema.aggregateRating.ratingValue, "4.9");
  assert.equal(schema.aggregateRating.ratingCount, "8");
  assert.equal(schema.operatingSystem, "Chrome, Edge, Brave, Chromium");
  assert.equal(schema.offers.price, "0");
  for (const path of publicPaths.filter(path => path.startsWith("/compare/") || ["sales-demos-crm", "developers-api-keys", "stripe-fintech-dashboards"].some(slug => path.includes(slug)))) {
    assert.ok(home.includes(`href="${path}"`), `${path} should be linked from the homepage`);
  }
  assert.match(home, /id="pricing"/);
  assert.match(home, /data-demo-mode="replace"/);
  assert.match(home, /Verifiable Local Architecture/);
  assert.doesNotMatch(home, /Open Source/);
  assert.match(home, /Compatible with your browser • Free install in 2 clicks • No signup required/);
  assert.match(home, /Copy Desktop Install Link/);
  assert.match(home, /Share \/ Save for Desktop/);
  assert.match(home, /Is Auto-Replace safe for live production CRMs and forms\?/);
  assert.match(home, /Protects your screen across/);
  for (const platform of ["Zoom", "Google Meet", "Loom", "Microsoft Teams", "OBS Studio", "Stripe", "HubSpot", "AWS Console"]) {
    assert.ok(home.includes(platform), `Homepage compatibility strip should list ${platform}`);
  }
  assert.match(home, /4\.9 \/ 5\.0/);
  assert.equal((home.match(/class="m-card m-review"/g) ?? []).length, 3, "Wall of Love should display 3 user review cards");
  for (const reviewer of ["Kate Litlonn", "EMILIANO CHEHIN", "Karina Noa"]) {
    assert.ok(home.includes(reviewer), `Wall of Love should include review by ${reviewer}`);
  }
  assert.match(home, /\$4 <small>\/ mo · billed yearly \(\$48\/yr\)<\/small>/);
  assert.match(home, /\$59 one-time Lifetime access/);
  assert.match(home, /data-video-modal/);
  assert.match(home, /Compare Manual Blur vs\. Smart Auto-Blur by Mask vs\. Live Data Replacement/);
  assert.match(home, /Manual Overlay Blur/);
  assert.match(home, /Window Attachment/);
  assert.match(home, /Start Protecting Your Privacy Today/);
  assert.match(home, /class="m-lang-menu"/);
  assert.match(home, /class="m-lang-footer"/);
  assert.match(home, /hreflang="x-default" href="https:\/\/privacyblur\.co\/"/);

  for (const l of localeList) {
    const locHomePath = localizedPath("/", l.code);
    const locHomeHtml = documents.find(({ path }) => path === locHomePath).html;
    assert.match(locHomeHtml, new RegExp(`<html lang="${l.hreflang}">`), `${locHomePath} should declare lang="${l.hreflang}"`);
    assert.ok(locHomeHtml.includes(getCopy(l.code).hero.title), `${locHomePath} should render localized hero title`);
    assert.match(home, new RegExp(`hreflang="${l.hreflang}" href="https://privacyblur\\.co${locHomePath}"`));

    const locUninstallPath = localizedPath("/uninstall/", l.code);
    const locUninstallHtml = await readFile(outputPath(locUninstallPath), "utf8");
    assert.match(locUninstallHtml, /content="noindex,follow"/);
    assert.match(locUninstallHtml, /data-uninstall-survey/);
    assert.ok(locUninstallHtml.includes(getCopy(l.code).uninstall.title), `${locUninstallPath} should render localized uninstall heading`);
    assert.doesNotMatch(sitemap, new RegExp(`<loc>${siteUrl}${locUninstallPath}</loc>`));
  }

  const welcome = documents.find(({ path }) => path === "/welcome/").html;
  assert.match(welcome, /<table/);
  assert.match(welcome, /4242 4242 4242 4242/);
  assert.match(welcome, /Pin the extension/);
  assert.match(welcome, /SaaS Sales Demo \(CRM\)/);
  assert.match(welcome, /FinTech \/ Stripe Mode/);
  assert.match(welcome, /Dev \/ Streamer Mode/);
  assert.doesNotMatch(welcome, /<script type="module"/);
  const robots = await readFile(join(root, "dist/robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/privacyblur\.co\/sitemap\.xml/);

  const uninstall = await readFile(join(root, "dist/uninstall/index.html"), "utf8");
  assert.match(uninstall, /content="noindex,follow"/);
  assert.match(uninstall, /data-uninstall-survey/);
  assert.match(uninstall, /Reinstall from Chrome Web Store/);
  for (const reason of [
    "Auto-blur or replacement didn't work on my specific website",
    "I needed a specific mask/pattern that wasn't included",
    "I was looking for a 100% free auto-blur solution",
    "Just finished a one-time demo/recording",
  ]) {
    assert.ok(uninstall.includes(reason), `/uninstall should include survey option: ${reason}`);
  }
  assert.doesNotMatch(sitemap, /<loc>[^<]*uninstall/);
  const social = await readFile(join(root, "dist/social-preview.png"));
  assert.equal(social.readUInt32BE(16), 1200);
  assert.equal(social.readUInt32BE(20), 630);
  const support = await readFile(join(root, "dist/support/index.html"), "utf8");
  assert.match(support, /<script type="module" crossorigin src="\/assets\//);
});

test("transactional application pages are not indexable", async () => {
  for (const path of ["/paywall/", "/payment-success/", "/payment-cancelled/"]) {
    const html = await readFile(outputPath(path), "utf8");
    assert.match(html, /<meta name="robots" content="noindex,nofollow" \/>/);
  }
});
