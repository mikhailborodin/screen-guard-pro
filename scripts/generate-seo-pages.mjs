import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { extensionUrl, seoPages, siteUrl } from "../src/data/seoContent.mjs";
import { getCopy, getLocaleMeta, localeList, localizedPath, nonDefaultLocales } from "../src/data/locales.mjs";
import { heroTitle, heroDescription, heroHtml, featuresHtml, comparisonHtml, comparisonTableHtml, pricingHtml, trustHtml, stepsHtml, macDesktopHtml, finalCtaHtml, resourceLinksHtml, welcomeHtml, initializeDemo, compatibilityHtml, reviewsHtml } from "../src/data/marketing.mjs";
import { marketingStyles } from "../src/data/marketingStyles.mjs";

import { installActionsHtml, attributeInstallLinks, initializeConversion } from "../src/data/conversion.mjs";
import { faqHtml, faqSchema, faqsForPage, getHomeFaqs } from "../src/data/faq.mjs";
import { uninstallHtml, initializeRetention } from "../src/data/retention.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, "dist");
const measurementId = "G-PE695ZZE0F";
const contentUpdatedAt = "2026-10-21";
const localizedPublicPaths = nonDefaultLocales.flatMap((l) => [
  localizedPath("/", l.code),
  localizedPath("/welcome/", l.code),
]);
const publicPaths = [
  "/",
  "/welcome/",
  "/compare/",
  "/use-cases/",
  "/alternatives/",
  ...seoPages.map((page) => page.path),
  ...localizedPublicPaths,
];

const escapeHtml = (value) =>
  String(value)
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
  .brand { display: inline-flex; align-items: center; gap: 10px; color: #e8fffa; font-weight: 800; text-decoration: none; }
  .brand-icon { width: 28px; height: 28px; border-radius: 7px; display: block; }
  .nav-links, .footer-links { display: flex; flex-wrap: wrap; gap: 16px; font-size: 14px; align-items: center; }
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

const languageMenuHtml = (locale = "en", basePath = "/") => {
  const n = getCopy(locale).nav;
  const switchBase = ["/", "/welcome/", "/uninstall/"].includes(basePath) ? basePath : "/";
  return `<details class="m-lang-menu"><summary aria-label="${escapeHtml(n.languageLabel)}">🌐 ${escapeHtml(locale.toUpperCase())}</summary><div class="m-lang-list">${localeList
    .map(
      (item) =>
        `<a href="${localizedPath(switchBase, item.code)}" hreflang="${item.hreflang}"${item.code === locale ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`
    )
    .join("")}</div></details>`;
};

const languageFooterHtml = (locale = "en", basePath = "/") => {
  const n = getCopy(locale).nav;
  const switchBase = ["/", "/welcome/", "/uninstall/"].includes(basePath) ? basePath : "/";
  return `<nav class="m-lang-footer" aria-label="${escapeHtml(n.languageLabel)}">${localeList
    .map(
      (item) =>
        `<a href="${localizedPath(switchBase, item.code)}" hreflang="${item.hreflang}"${item.code === locale ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`
    )
    .join("")}</nav>`;
};

const footer = (locale = "en", basePath = "/") => {
  const n = getCopy(locale).nav;
  const homePath = localizedPath("/", locale);
  const welcomePath = localizedPath("/welcome/", locale);
  return `
  <footer class="footer">
    <a class="brand" href="${homePath}"><img class="brand-icon" src="/app-icon.png?v=20261021" width="24" height="24" alt="" /><span>${escapeHtml(n.rights)}</span></a>
    <nav class="footer-links" aria-label="Footer">
      <a data-placement="footer" href="${extensionUrl}">${escapeHtml(n.addToChromeFree)}</a>
      <a href="${homePath}#pricing">${escapeHtml(n.pricing)}</a>
      <a href="/compare/">${escapeHtml(n.compare)}</a>
      <a href="${welcomePath}">${escapeHtml(n.welcomeSandbox)}</a>
      <a href="/use-cases/">${escapeHtml(n.useCases)}</a>
      <a href="/alternatives/">${escapeHtml(n.alternatives)}</a>
      <a href="/privacy-policy/">${escapeHtml(n.privacy)}</a>
      <a href="/permissions/">Permissions</a>
      <a href="/support/">${escapeHtml(n.support)}</a>
    </nav>
    ${resourceLinksHtml()}
    ${languageFooterHtml(locale, basePath)}
  </footer>`;
};

const navigation = (locale = "en", basePath = "/") => {
  const n = getCopy(locale).nav;
  const homePath = localizedPath("/", locale);
  return `
  <nav class="nav" aria-label="Primary">
    <a class="brand" href="${homePath}"><img class="brand-icon" src="/app-icon.png?v=20261021" width="28" height="28" alt="" /><span>Screen Privacy Blur</span></a>
    <div class="nav-links">
      <a href="${homePath}#pricing">${escapeHtml(n.pricing)}</a>
      <a href="/compare/">${escapeHtml(n.compare)}</a>
      <a href="${homePath}#features">${escapeHtml(n.features)}</a>
      <a href="${homePath}#how-it-works">${escapeHtml(n.howItWorks)}</a>
      <a href="${homePath}#privacy">${escapeHtml(n.privacy)}</a>
      <a href="/support/">${escapeHtml(n.support)}</a>
      <a data-placement="navbar" href="${extensionUrl}">${escapeHtml(n.addToChrome)}</a>
      ${languageMenuHtml(locale, basePath)}
    </div>
  </nav>`;
};

const hreflangLinksHtml = (alternateBasePath) => {
  if (!alternateBasePath) return "";
  const links = localeList.map(
    (item) => `<link rel="alternate" hreflang="${item.hreflang}" href="${absoluteUrl(localizedPath(alternateBasePath, item.code))}" />`
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${absoluteUrl(localizedPath(alternateBasePath, "en"))}" />`);
  return `\n    ${links.join("\n    ")}`;
};

const document = ({
  title,
  description,
  path,
  body,
  jsonLd = [],
  appAssets = "",
  analyticsScript = analytics,
  robots = "index,follow",
  locale = "en",
  alternateBasePath = null,
}) => `<!doctype html>
<html lang="${getLocaleMeta(locale).hreflang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${robots}" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${absoluteUrl(path)}" />${hreflangLinksHtml(alternateBasePath)}
    <link rel="icon" type="image/png" href="/app-icon.png?v=20261021" sizes="128x128" />
    <link rel="apple-touch-icon" href="/app-icon.png?v=20261021" />
    <link rel="shortcut icon" href="/favicon.ico?v=20261021" sizes="any" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${absoluteUrl(path)}" />
    <meta property="og:image" content="${siteUrl}/social-preview.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Before: leaked customer PII. After: readable, auto-replaced demo data in Screen Privacy Blur." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${siteUrl}/social-preview.png" />
    <meta name="twitter:image:alt" content="Before: leaked customer PII. After: auto-replaced demo data." />
    <style>${sharedStyles}${marketingStyles}
body{background:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px),radial-gradient(circle at 80% 5%,#2dd4bf12,transparent 35%),#080f1c;background-size:64px 64px,64px 64px,auto,auto}.home-nav{padding-top:24px}.home-nav .nav{padding:16px 20px;background:#172136cc;border:1px solid #ffffff16;border-radius:16px}.home-footer{padding-block:32px 48px}.home-nav+main .m-hero{padding-top:72px}@media(max-width:600px){.home-nav+main .m-hero{padding-top:36px}}.m-hero h1{max-width:none}.m-demo .m-dashboard h2{font-size:21px}html{scroll-behavior:smooth}section[id]{scroll-margin-top:24px}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style>
    ${analyticsScript}
    ${jsonLd.map((entry) => `<script type="application/ld+json">${asJsonLd(entry)}</script>`).join("\n    ")}
    ${appAssets}
  </head>
  <body>${attributeInstallLinks(body, path)}${appAssets ? "" : `<script>(${initializeConversion.toString()})();</script>`}</body>
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
  operatingSystem: "Chrome, Edge, Brave, Chromium",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "8" },
  description:
    "Local browser blur, automatic pattern detection, and synthetic data replacement for calls and demos.",
  downloadUrl: extensionUrl,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const relatedPages = (page) =>
  seoPages
    .filter((candidate) => candidate.path !== page.path && candidate.group === page.group)
    .slice(0, 3);

const renderPage = (page) => {
  const related = relatedPages(page);
  const faqs = page.path.startsWith("/use-cases/") || page.path.startsWith("/compare/") ? faqsForPage(page) : [];
  const content = `
    <main class="shell">
      ${navigation("en", page.path)}
      <span class="eyebrow">${escapeHtml(page.eyebrow)}</span>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="lead">${escapeHtml(page.description)}</p>
      <div class="actions">${installActionsHtml(page.path, page.group === "Compare" ? "comparison_table" : "hero", "Add to Chrome — Free")}<a class="button secondary" href="/support/">Contact support</a></div>
      <section class="grid" aria-label="Details">
        ${page.sections
          .map(
            (section) => `<article class="card"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></article>`
          )
          .join("")}
      </section>
      <ul class="bullets">${page.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
      ${page.sources?.length ? `<aside><p>Sources checked October 13, 2026: ${page.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a>`).join(" · ")}</p></aside>` : ""}
      <section class="how"><h2>How to prepare before sharing</h2><ol><li>Open the browser tab or desktop context you plan to present.</li><li>Place blur overlays over the private fields that can appear during the walkthrough.</li><li>Review the visible area, then start the call or recording.</li></ol></section>
      ${faqs.length ? comparisonTableHtml(page) : ""}
      ${related.length ? `<section><h2>Related resources</h2><div class="grid">${related.map((item) => `<article class="card"><a href="${item.path}"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></a></article>`).join("")}</div></section>` : ""}
      ${faqs.length ? faqHtml(faqs) : ""}
      ${footer("en", page.path)}
    </main>`;

  return document({
    title: `${page.title} | Screen Privacy Blur`,
    description: page.description,
    path: page.path,
    body: content,
    jsonLd: [breadcrumb(page), ...(faqs.length ? [faqSchema(faqs)] : [])],
  });
};

const renderHub = ({ path, group, title, description }) => {
  const pages = seoPages.filter((page) => page.group === group);
  return document({
    title: `${title} | Screen Privacy Blur`,
    description,
    path,
    body: `<main class="shell">${navigation("en", path)}<span class="eyebrow">Screen Privacy Blur</span><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p><div class="actions">${installActionsHtml(path, "hero", "Add to Chrome — Free")}</div><section class="grid">${pages.map((page) => `<article class="card"><a href="${page.path}"><p>${escapeHtml(page.eyebrow)}</p><h2>${escapeHtml(page.title)}</h2><p>${escapeHtml(page.description)}</p></a></article>`).join("")}</section>${footer("en", path)}</main>`,
  });
};

const renderHome = (locale = "en") => {
  const copy = getCopy(locale);
  const path = localizedPath("/", locale);
  const faqs = getHomeFaqs(locale);
  return document({
    title: `${copy.hero.title} | Screen Privacy Blur`,
    description: copy.hero.description,
    path,
    locale,
    alternateBasePath: "/",
    analyticsScript: deferredAnalytics,
    jsonLd: [productSchema, faqSchema(faqs)],
    body: `<header class="m-wrap home-nav">${navigation(locale, "/")}</header><main>${heroHtml(locale)}${compatibilityHtml(locale)}${comparisonHtml(locale)}${featuresHtml(locale)}${pricingHtml(locale)}${macDesktopHtml(locale)}${stepsHtml(locale)}${trustHtml(locale)}${reviewsHtml(locale)}${faqHtml(faqs, locale)}${finalCtaHtml(path, locale)}</main><div class="m-wrap home-footer">${footer(locale, "/")}</div><script>(${initializeDemo.toString()})();
  document.querySelectorAll('a[data-install], a[data-placement]').forEach(link => link.addEventListener('click', () => {
    if (typeof window.gtag === 'function') window.gtag('event', link.dataset.install === 'macos' ? 'download_macos_click' : 'install_chrome_click', {placement:link.dataset.placement || 'hero', target_url:link.href, transport_type:'beacon'});
  }));</script>`,
  });
};

const renderWelcome = (locale = "en") => {
  const w = getCopy(locale).welcome;
  const path = localizedPath("/welcome/", locale);
  return document({
    title: w.metaTitle,
    description: w.metaDescription,
    path,
    locale,
    alternateBasePath: "/welcome/",
    analyticsScript: deferredAnalytics,
    body: `<header class="m-wrap home-nav">${navigation(locale, "/welcome/")}</header><main>${welcomeHtml(locale)}</main><div class="m-wrap home-footer">${footer(locale, "/welcome/")}</div><script>(${initializeDemo.toString()})();</script>`,
  });
};

const renderUninstall = (locale = "en") => {
  const u = getCopy(locale).uninstall;
  const path = localizedPath("/uninstall/", locale);
  return document({
    title: u.metaTitle,
    description: u.metaDescription,
    path,
    locale,
    alternateBasePath: "/uninstall/",
    robots: "noindex,follow",
    analyticsScript: deferredAnalytics,
    body: `<header class="m-wrap home-nav">${navigation(locale, "/uninstall/")}</header><main>${uninstallHtml(locale)}</main><div class="m-wrap home-footer">${footer(locale, "/uninstall/")}</div><script>(${initializeRetention.toString()})();</script>`,
  });
};

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
  writeFile(join(distDir, "index.html"), renderHome("en")),
  (async () => { const target = outputPath("/uninstall/"); await mkdir(dirname(target), { recursive: true }); await writeFile(target, renderUninstall("en")); })(),
  (async () => { const target = outputPath("/welcome/"); await mkdir(dirname(target), { recursive: true }); await writeFile(target, renderWelcome("en")); })(),
  ...nonDefaultLocales.flatMap((l) => [
    (async () => {
      const target = outputPath(localizedPath("/", l.code));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, renderHome(l.code));
    })(),
    (async () => {
      const target = outputPath(localizedPath("/welcome/", l.code));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, renderWelcome(l.code));
    })(),
    (async () => {
      const target = outputPath(localizedPath("/uninstall/", l.code));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, renderUninstall(l.code));
    })(),
  ]),
  (async () => {
    const target = outputPath("/support/");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, appShell
      .replace(/<title>[^<]*<\/title>/, '<title>Support | Screen Privacy Blur</title>')
      .replaceAll('content="https://privacyblur.co/"', 'content="https://privacyblur.co/support/"')
      .replace('href="https://privacyblur.co/"', 'href="https://privacyblur.co/support/"')
      .replace(/(<meta property="og:title" content=")[^"]+/, '$1Support | Screen Privacy Blur')
      .replace(/(<meta name="twitter:title" content=")[^"]+/, '$1Support | Screen Privacy Blur'));

  })(),
  ...seoPages.map(async (page) => {
    const target = outputPath(page.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, renderPage(page));
  }),
  ...[
    { path: "/compare/", group: "Compare", title: "Compare browser privacy tools", description: "Compare local blur, automation, and synthetic demo data workflows." },
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
  writeFile(join(distDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`),
  writeFile(
    join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths
      .map((path) => `  <url><loc>${absoluteUrl(path)}</loc><lastmod>${contentUpdatedAt}</lastmod></url>`)
      .join("\n")}\n</urlset>\n`
  ),
  writeFile(
    join(root, "public", "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths
      .map((path) => `  <url><loc>${absoluteUrl(path)}</loc><lastmod>${contentUpdatedAt}</lastmod></url>`)
      .join("\n")}\n</urlset>\n`
  ),
]);
