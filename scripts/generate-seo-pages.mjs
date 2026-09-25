import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { extensionUrl, seoPages, siteUrl } from "../src/data/seoContent.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, "dist");
const measurementId = "G-PE695ZZE0F";
const contentUpdatedAt = "2026-07-28";
const publicPaths = ["/", "/use-cases/", "/alternatives/", ...seoPages.map((page) => page.path)];

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const asJsonLd = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const outputPath = (path) => join(distDir, path.replace(/^\//, ""), "index.html");
const absoluteUrl = (path) => `${siteUrl}${path}`;

const sharedStyles = `
  :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #061211; color: #f4fffc; }
  * { box-sizing: border-box; }
  body { min-height: 100vh; margin: 0; background: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px), radial-gradient(circle at 80% 5%, rgba(54, 245, 198, 0.16), transparent 32%), #061211; background-size: 64px 64px, 64px 64px, auto, auto; }
  a { color: #8ff7df; }
  .shell { width: min(1120px, calc(100vw - 32px)); margin: 0 auto; padding: 48px 0 64px; }
  .nav, .footer { display: flex; gap: 16px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
  .brand { color: #e8fffa; font-weight: 800; text-decoration: none; }
  .nav-links, .footer-links { display: flex; flex-wrap: wrap; gap: 16px; font-size: 14px; }
  .nav-links a, .footer-links a { color: #b7d6d0; text-decoration: none; }
  .eyebrow { display: inline-flex; margin-top: 56px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; padding: 8px 14px; color: #9fe8d8; background: rgba(54,245,198,0.08); font-size: 14px; font-weight: 700; }
  h1 { max-width: 900px; margin: 24px 0 18px; font-size: clamp(42px, 7vw, 76px); line-height: .98; letter-spacing: -.03em; }
  h2 { margin: 0; font-size: 24px; }
  p { color: #b8d1cc; font-size: 18px; line-height: 1.65; }
  .lead { max-width: 760px; font-size: 21px; }
  .actions { display: flex; flex-wrap: wrap; gap: 14px; margin: 32px 0 52px; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 50px; border-radius: 14px; padding: 0 20px; background: #73edd4; color: #04201b; font-weight: 800; text-decoration: none; }
  .button.secondary { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.16); color: #e8fffa; }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .card { border: 1px solid rgba(255,255,255,.12); border-radius: 18px; padding: 24px; background: rgba(8, 31, 28, .72); }
  .card p { margin-bottom: 0; font-size: 16px; }
  .card a { color: inherit; text-decoration: none; }
  .bullets { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 20px 0 48px; padding: 0; list-style: none; }
  .bullets li { border: 1px solid rgba(115,237,212,.22); border-radius: 12px; padding: 14px; color: #dffdf7; background: rgba(115,237,212,.06); }
  .how { margin: 48px 0; padding: 28px; border-radius: 18px; background: rgba(115,237,212,.07); }
  .how ol { color: #dffdf7; line-height: 1.8; }
  .footer { border-top: 1px solid rgba(255,255,255,.12); padding-top: 28px; color: #91aaa5; font-size: 14px; }
  @media (max-width: 720px) { .shell { padding-top: 28px; } .eyebrow { margin-top: 36px; } .grid, .bullets { grid-template-columns: 1fr; } }
`;

const analytics = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>window.dataLayer = window.dataLayer || []; window.gtag = function gtag(){ window.dataLayer.push(arguments); }; window.gtag("js", new Date()); window.gtag("config", "${measurementId}");</script>`;

const deferredAnalytics = `
    <script>
      let analyticsStarted = false;
      const analyticsEvents = ["pointerdown", "keydown", "scroll", "touchstart"];
      const startAnalytics = () => {
        if (analyticsStarted) return;
        analyticsStarted = true;
        analyticsEvents.forEach((eventName) => window.removeEventListener(eventName, startAnalytics));
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag(){ window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", "${measurementId}");
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=${measurementId}";
        document.head.appendChild(script);
      };
      analyticsEvents.forEach((eventName) => window.addEventListener(eventName, startAnalytics, { passive: true }));
    </script>`;

const footer = () => `
  <footer class="footer">
    <span>© 2026 Screen Privacy Blur</span>
    <nav class="footer-links" aria-label="Footer">
      <a href="/use-cases/">Use cases</a>
      <a href="/alternatives/">Alternatives</a>
      <a href="/privacy-policy/">Privacy</a>
      <a href="/permissions/">Permissions</a>
      <a href="/support/">Support</a>
    </nav>
  </footer>`;

const navigation = () => `
  <nav class="nav" aria-label="Primary">
    <a class="brand" href="/">Screen Privacy Blur</a>
    <div class="nav-links">
      <a href="/use-cases/">Use cases</a>
      <a href="/alternatives/">Alternatives</a>
      <a href="/permissions/">Privacy</a>
      <a href="${extensionUrl}">Add to Chrome</a>
    </div>
  </nav>`;

const document = ({ title, description, path, body, jsonLd = [], appAssets = "", analyticsScript = analytics, robots = "index,follow" }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${robots}" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${absoluteUrl(path)}" />
    <link rel="icon" type="image/png" href="/app-icon.png" sizes="128x128" />
    <link rel="apple-touch-icon" href="/app-icon.png" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${absoluteUrl(path)}" />
    <meta property="og:image" content="${siteUrl}/social-preview.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${siteUrl}/social-preview.png" />
    <style>${sharedStyles}</style>
    ${analyticsScript}
    ${jsonLd.map((entry) => `<script type="application/ld+json">${asJsonLd(entry)}</script>`).join("\n    ")}
    ${appAssets}
  </head>
  <body>${body}</body>
</html>`;

const breadcrumb = (page) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Screen Privacy Blur", item: siteUrl },
    ...(page.group === "Trust"
      ? []
      : [{ "@type": "ListItem", position: 2, name: page.group, item: absoluteUrl(`/${page.group.toLowerCase().replaceAll(" ", "-")}/`) }]),
    { "@type": "ListItem", position: page.group === "Trust" ? 2 : 3, name: page.title, item: absoluteUrl(page.path) },
  ],
});

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Screen Privacy Blur",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Chrome, macOS",
  description:
    "Local-first blur overlays for hiding sensitive information during browser screen sharing, demos, calls, and recordings.",
  downloadUrl: extensionUrl,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const relatedPages = (page) =>
  seoPages
    .filter((candidate) => candidate.path !== page.path && candidate.group === page.group)
    .slice(0, 3);

const renderPage = (page) => {
  const related = relatedPages(page);
  const content = `
    <main class="shell">
      ${navigation()}
      <span class="eyebrow">${escapeHtml(page.eyebrow)}</span>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="lead">${escapeHtml(page.description)}</p>
      <div class="actions"><a class="button" href="${extensionUrl}">Add to Chrome — Free</a><a class="button secondary" href="/support/">Contact support</a></div>
      <section class="grid" aria-label="Details">
        ${page.sections
          .map(
            (section) => `<article class="card"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></article>`
          )
          .join("")}
      </section>
      <ul class="bullets">${page.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
      <section class="how"><h2>How to prepare before sharing</h2><ol><li>Open the browser tab or desktop context you plan to present.</li><li>Place blur overlays over the private fields that can appear during the walkthrough.</li><li>Review the visible area, then start the call or recording.</li></ol></section>
      ${related.length ? `<section><h2>Related resources</h2><div class="grid">${related.map((item) => `<article class="card"><a href="${item.path}"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></a></article>`).join("")}</div></section>` : ""}
      ${footer()}
    </main>`;

  return document({
    title: `${page.title} | Screen Privacy Blur`,
    description: page.description,
    path: page.path,
    body: content,
    jsonLd: [breadcrumb(page)],
  });
};

const renderHub = ({ path, group, title, description }) => {
  const pages = seoPages.filter((page) => page.group === group);
  return document({
    title: `${title} | Screen Privacy Blur`,
    description,
    path,
    body: `<main class="shell">${navigation()}<span class="eyebrow">Screen Privacy Blur</span><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p><section class="grid">${pages.map((page) => `<article class="card"><a href="${page.path}"><p>${escapeHtml(page.eyebrow)}</p><h2>${escapeHtml(page.title)}</h2><p>${escapeHtml(page.description)}</p></a></article>`).join("")}</section>${footer()}</main>`,
  });
};

const renderHome = () =>
  document({
    title: "Screen Privacy Blur | Blur Sensitive Information During Screen Sharing",
    description:
      "Blur sensitive data in Chrome and on macOS before screen sharing, demos, calls, and recordings. Local-first privacy overlays for tabs and desktop apps.",
    path: "/",
    analyticsScript: deferredAnalytics,
    jsonLd: [productSchema],
    body: `<main class="shell">${navigation()}<span class="eyebrow">Privacy-first Chrome extension and macOS app</span><h1>Blur sensitive information before screen sharing.</h1><p class="lead">Screen Privacy Blur helps you hide customer data, messages, API keys, notifications, and private browser fields before a live demo, call, recording, or support session.</p><div class="actions"><a class="button" href="${extensionUrl}">Add to Chrome — Free</a><a class="button secondary" href="/downloads/ScreenPrivacyBlurMac.dmg" download>Download macOS app</a><a class="button secondary" href="https://www.youtube.com/watch?v=pLqxd8KaClQ" target="_blank" rel="noopener noreferrer">Watch demo</a></div><section class="grid"><article class="card"><h2>For demos and calls</h2><p>Prepare adjustable blur overlays before sharing a dashboard, inbox, admin tool, or internal workspace with a customer or team.</p></article><article class="card"><h2>Local-first privacy</h2><p>Manual overlays and sensitive-field detection run locally, so the product does not need to upload your visible screen content.</p></article><article class="card"><h2>For recordings</h2><p>Hide predictable private details before recording a Loom, Zoom walkthrough, tutorial, or bug report to reduce retakes and editing.</p></article><article class="card"><h2>Browser and desktop</h2><p>Use the Chrome extension for browser tabs or the macOS app for adjustable Overlay Blur regions over desktop apps and windows.</p></article></section><section class="how"><h2>Start protecting your screen in seconds</h2><ol><li>Install Screen Privacy Blur in Chrome or download the macOS app.</li><li>Place an overlay over the sensitive area you expect to show.</li><li>Start sharing with the workflow visible and the private detail obscured.</li></ol></section><section><h2>Explore practical screen privacy workflows</h2><div class="grid"><article class="card"><a href="/use-cases/"><h3>Use cases for Google Meet, Zoom, Loom, and live debugging</h3><p>Learn how to prepare specific workflows for a screen share or recording.</p></a></article><article class="card"><a href="/alternatives/"><h3>Browser privacy alternatives</h3><p>Compare browser-first workflows for demos, calls, and recordings.</p></a></article></div></section>${footer()}</main>`,
  });

const renderNoindexApp = (path, appAssets) =>
  document({
    title: "Screen Privacy Blur",
    description: "Screen Privacy Blur application page.",
    path,
    robots: "noindex,nofollow",
    appAssets,
    body: `<div id="root"><main class="shell"><p>Loading Screen Privacy Blur…</p></main></div>`,
  });

const appShell = await readFile(join(distDir, "index.html"), "utf8");
const appAssets = appShell
  .match(/<script type="module" crossorigin src="[^"]+"><\/script>|<link rel="stylesheet" crossorigin href="[^"]+">/g)
  ?.join("\n    ");

if (!appAssets) {
  throw new Error("Could not locate Vite application assets in dist/index.html");
}

await Promise.all([
  writeFile(join(distDir, "index.html"), renderHome()),
  (async () => {
    const target = outputPath("/support/");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, appShell);
  })(),
  ...seoPages.map(async (page) => {
    const target = outputPath(page.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, renderPage(page));
  }),
  ...[
    {
      path: "/use-cases/",
      group: "Use cases",
      title: "Screen privacy use cases",
      description: "Practical ways to hide sensitive browser and desktop information before a live screen share or recording.",
    },
    {
      path: "/alternatives/",
      group: "Alternatives",
      title: "Screen Privacy Blur alternatives",
      description: "Compare browser-first privacy workflows for demos, calls, recordings, and remote collaboration.",
    },
  ].map(async (hub) => {
    const target = outputPath(hub.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, renderHub(hub));
  }),
  ...["/paywall/", "/payment-success/", "/payment-cancelled/"].map(async (path) => {
    const target = outputPath(path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, renderNoindexApp(path, appAssets));
  }),
  writeFile(
    join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths
      .map((path) => `  <url><loc>${absoluteUrl(path)}</loc><lastmod>${contentUpdatedAt}</lastmod></url>`)
      .join("\n")}\n</urlset>\n`
  ),
]);
