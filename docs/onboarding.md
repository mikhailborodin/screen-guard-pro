# Welcome-page integration

The website build emits `/welcome/index.html`, served at `https://privacyblur.co/welcome/`.
It contains the pinning guide and a real HTML table of fictional customer values. The table is static and remains usable without the website's JavaScript; testing actual blur or replacement requires the installed extension and the appropriate tier.

## Extension release follow-up

The extension is maintained separately in `/Users/mike/src/screen-privacy-blur`.
Its current `background.js` installation listener initializes preferences but does not open a welcome tab.
After this website is published, update that listener to open `https://privacyblur.co/welcome/` only when `details.reason === 'install'`. Preserve existing preference initialization behavior and avoid opening onboarding on updates or browser startup.

Validate using a fresh extension installation, pin the extension, and exercise manual element selection, automatic masks, and replacement scenarios against the table. This website change does not publish or modify the extension.

## Website verification

- `npm test` builds and checks static output, canonical metadata, sitemap coverage, structured data, and existing billing/support behavior.
- `npx tsc --noEmit -p tsconfig.app.json` checks React routes and components.
- `npm run lint` checks source formatting and lint rules.
- `npm run preview -- --host 127.0.0.1 --port 4173` serves the production output for browser checks.
- Homepage and welcome markup are shared by React and the static generator in `src/data/marketing.mjs`; styles live in `src/data/marketingStyles.mjs`.
- Comparison and use-case content lives in `src/data/upgradeSeoPages.mjs`, included by the existing SEO content registry.

## Phase 6 retention and attribution

After publishing the website, change the separate extension's uninstall URL to `https://privacyblur.co/uninstall` (replace the current Google Forms URL). The website route is emitted statically as `/uninstall/index.html` and uses `noindex,follow`.

The optional survey queues GA4 events using the existing website analytics property:

- `uninstall_feedback`: `reason` is `website`, `pattern`, `free`, or `finished`.
- `uninstall_website_feedback`: sends only `website_domain` from a separately submitted optional URL. Paths, query strings, fragments, and URL credentials are not sent; credential-bearing URLs are rejected.

Delivery depends on website analytics being available and can be blocked by the visitor's browser. No feedback email, support conversation, new backend endpoint, free Pro trial, or entitlement is created. Survey selections show free manual-feature tips and a reinstall link.

All install CTAs use `src/data/conversion.mjs`: source `privacyblur_site`, medium `landing`, a path-based campaign (`home` for `/`), and placement-specific content. Review links stay pointed at the reviews page. Mobile copy/share preserves these parameters. Chromium detection is a compatibility hint, not an extension-installation check; unsupported desktop browsers are invited to install in a Chromium browser.

FAQ markup and FAQPage JSON-LD share the same data in `src/data/faq.mjs`. Native details/summary controls work without JavaScript. Structured data does not guarantee a Google FAQ rich result.

Social preview source is the existing vector asset `public/social-preview.svg`, updated to 1200×630 and rendered to `public/social-preview.png`. Both files are versioned. Route metadata points to the PNG for social crawler compatibility.
