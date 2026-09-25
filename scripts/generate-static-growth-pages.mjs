import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(root, "public");
const siteUrl = "https://privacyblur.co";
const measurementId = "G-PE695ZZE0F";
const extensionUrl =
  "https://chromewebstore.google.com/detail/pfngjkakgncabcfjdknjacpnbidjlldm?utm_source=item-share-cb";

const pages = [
  {
    path: "/privacy-policy",
    eyebrow: "Privacy Policy",
    title: "Privacy Policy for Screen Privacy Blur",
    description:
      "Screen Privacy Blur is designed to protect what is visible on your screen without collecting screen content, browsing activity, or personal files.",
  },
  {
    path: "/terms",
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    description:
      "Terms for using Screen Privacy Blur, including free manual blur and optional Smart Auto Blur Pro.",
  },
  {
    path: "/data-collection",
    eyebrow: "Data Collection",
    title: "What Screen Privacy Blur collects",
    description:
      "The core extension is local-first and does not upload screen content, page text, screenshots, recordings, passwords, or API keys.",
  },
  {
    path: "/permissions",
    eyebrow: "Permissions",
    title: "Why Screen Privacy Blur needs browser permissions",
    description:
      "Browser permissions let Screen Privacy Blur place local blur overlays and remember your preferences.",
  },
  {
    path: "/use-cases/screen-sharing",
    eyebrow: "Use case",
    title: "Screen sharing without exposing sensitive data",
    description:
      "Use Screen Privacy Blur before sales calls, investor updates, onboarding sessions, and live debugging.",
  },
  {
    path: "/use-cases/google-meet",
    eyebrow: "Use case",
    title: "Blur sensitive information in Google Meet",
    description:
      "Prepare blur overlays before presenting browser tabs, dashboards, inboxes, and internal tools in Google Meet.",
  },
  {
    path: "/use-cases/zoom",
    eyebrow: "Use case",
    title: "Screen privacy for Zoom demos",
    description:
      "Cover sensitive browser fields before sharing a window or tab during Zoom calls and recordings.",
  },
  {
    path: "/use-cases/loom-recording",
    eyebrow: "Use case",
    title: "Hide private details before Loom recordings",
    description:
      "Record product walkthroughs, bug reports, and async updates with fewer accidental leaks.",
  },
  {
    path: "/use-cases/hide-api-keys",
    eyebrow: "Use case",
    title: "Hide API keys during live debugging",
    description:
      "Blur credentials, tokens, emails, and customer IDs before sharing docs, consoles, dashboards, or admin tools.",
  },
  {
    path: "/alternatives/safe-screen-share",
    eyebrow: "Alternative",
    title: "Safe screen share alternative",
    description:
      "A lightweight Chrome extension for practical blur overlays before sharing a browser screen.",
  },
  {
    path: "/alternatives/datablur",
    eyebrow: "Alternative",
    title: "DataBlur alternative for browser screen sharing",
    description:
      "A Chrome-focused way to blur sensitive browser content before demos, calls, and recordings.",
  },
  {
    path: "/alternatives/privacy-blu",
    eyebrow: "Alternative",
    title: "Privacy Blur alternative for Chrome",
    description:
      "Blur sensitive areas directly in the browser before sharing your screen with a team, customer, or audience.",
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const render = ({ path, eyebrow, title, description }) => `<!doctype html>
<html lang="en">
  <head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      gtag('js', new Date());
      gtag('config', '${measurementId}');
      window.trackInstallClick = function trackInstallClick(targetUrl) {
        window.gtag('event', 'install_chrome_click', {
          event_category: 'install',
          event_label: 'growth_page',
          placement: 'growth_page',
          platform: 'chrome',
          target_url: targetUrl,
          transport_type: 'beacon'
        });
      };
    </script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | Screen Privacy Blur</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${siteUrl}${path}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${siteUrl}${path}" />
    <meta property="og:image" content="${siteUrl}/social-preview.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${siteUrl}/social-preview.png" />
    <style>
      :root {
        color-scheme: dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #061211;
        color: #f4fffc;
      }
      * { box-sizing: border-box; }
      body {
        min-height: 100vh;
        margin: 0;
        background:
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
          radial-gradient(circle at 80% 5%, rgba(54, 245, 198, 0.16), transparent 32%),
          #061211;
        background-size: 64px 64px, 64px 64px, auto, auto;
      }
      main {
        width: min(960px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 56px 0;
      }
      a { color: #6ee7d0; }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 72px;
        color: #dffdf7;
        text-decoration: none;
        font-weight: 700;
      }
      .mark {
        display: grid;
        height: 38px;
        width: 38px;
        place-items: center;
        border-radius: 12px;
        background: rgba(54, 245, 198, 0.18);
        color: #6ee7d0;
      }
      .eyebrow {
        display: inline-flex;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 999px;
        padding: 8px 14px;
        color: #9fbcb6;
        background: rgba(255,255,255,0.04);
        font-size: 14px;
      }
      h1 {
        max-width: 820px;
        margin: 28px 0 20px;
        font-size: clamp(42px, 8vw, 76px);
        line-height: 0.96;
        letter-spacing: 0;
      }
      p {
        max-width: 720px;
        color: #acc5c0;
        font-size: 20px;
        line-height: 1.65;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-top: 34px;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 52px;
        border-radius: 14px;
        padding: 0 22px;
        background: #6ee7d0;
        color: #031514;
        font-weight: 800;
        text-decoration: none;
      }
      .link {
        display: inline-flex;
        align-items: center;
        min-height: 52px;
        color: #dffdf7;
        text-decoration: none;
      }
      footer {
        margin-top: 88px;
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        color: #78938d;
        font-size: 14px;
      }
      footer a { color: #9fbcb6; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <a class="brand" href="/">
        <span class="mark">◇</span>
        <span>Screen Privacy Blur</span>
      </a>
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
      <div class="actions">
        <a class="button" href="${extensionUrl}" onclick="window.trackInstallClick(this.href)">Add to Chrome - Free</a>
        <a class="link" href="/support">Contact support</a>
      </div>
      <footer>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms">Terms</a>
        <a href="/data-collection">Data Collection</a>
        <a href="/permissions">Permissions</a>
        <a href="/support">Support</a>
      </footer>
    </main>
  </body>
</html>
`;

for (const page of pages) {
  const target = join(publicDir, page.path, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(page));
}
