export const siteUrl = "https://privacyblur.co";

export const extensionUrl =
  "https://chromewebstore.google.com/detail/pfngjkakgncabcfjdknjacpnbidjlldm?utm_source=item-share-cb";

export const seoPages = [
  {
    path: "/privacy-policy/",
    group: "Trust",
    eyebrow: "Privacy Policy",
    title: "Privacy Policy for Screen Privacy Blur",
    description:
      "Learn how Screen Privacy Blur protects screen privacy without collecting screen content, browsing activity, or personal files.",
    sections: [
      {
        title: "What we collect",
        body:
          "The extension does not collect, transmit, sell, or store your screen content, page content, browsing history, screenshots, recordings, passwords, API keys, or form fields.",
      },
      {
        title: "How blur works",
        body:
          "Manual blur and Smart Auto Blur run locally in your browser. Blur rules are applied on-device before you share your screen, join a call, or record a walkthrough.",
      },
      {
        title: "Support and billing",
        body:
          "If you contact support or purchase Pro, the information you submit for that workflow is handled only to respond to your request, complete checkout, or verify subscription status.",
      },
    ],
    bullets: [
      "No screen recording or screenshot upload",
      "No sale of personal information",
      "No behavioral ad profiling",
      "Support messages are used only for support follow-up",
    ],
  },
  {
    path: "/terms/",
    group: "Trust",
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    description:
      "Terms for using Screen Privacy Blur, including free manual blur features and an optional Smart Auto Blur Pro subscription.",
    sections: [
      {
        title: "Use of the extension",
        body:
          "You may use Screen Privacy Blur to obscure sensitive information during screen sharing, calls, demos, and recordings. Review your screen before sharing confidential material.",
      },
      {
        title: "Pro subscription",
        body:
          "Smart Auto Blur Pro is an optional paid feature that helps identify common sensitive field types. It is a convenience layer, not a guarantee that every sensitive item will be hidden.",
      },
      {
        title: "Availability",
        body:
          "The extension is provided as-is. We may improve, modify, or discontinue features, while local privacy-preserving processing remains a core product constraint.",
      },
    ],
    bullets: [
      "Use the extension only for lawful purposes",
      "Verify your screen before sharing confidential material",
      "Do not rely on automation as your only security control",
      "Contact support for billing or product questions",
    ],
  },
  {
    path: "/data-collection/",
    group: "Trust",
    eyebrow: "Data Collection",
    title: "What Screen Privacy Blur collects",
    description:
      "Screen Privacy Blur is local-first: it does not upload screen content, page text, screenshots, recordings, passwords, or API keys.",
    sections: [
      {
        title: "Screen content",
        body:
          "Screen Privacy Blur does not send your screen, page text, form values, DOM content, screenshots, or recordings to our servers.",
      },
      {
        title: "Website analytics",
        body:
          "The marketing site may use Google Analytics to understand aggregate page visits. This does not give the extension access to your screen content.",
      },
      {
        title: "Support requests",
        body:
          "When you submit the support form, we receive the name, email, topic, message, page URL, and browser user agent you submit so we can reply.",
      },
    ],
    bullets: [
      "Extension blur processing stays in the browser",
      "Support form data is intentionally submitted by the user",
      "Billing status checks are limited to subscription verification",
      "Marketing analytics are separate from extension screen protection",
    ],
  },
  {
    path: "/permissions/",
    group: "Trust",
    eyebrow: "Permissions",
    title: "Why Screen Privacy Blur needs browser permissions",
    description:
      "Understand how Screen Privacy Blur uses browser permissions for local blur overlays, saved preferences, billing, and support.",
    sections: [
      {
        title: "Page access",
        body:
          "The extension needs page access to place blur overlays on top of sensitive areas. That access is used locally for the current browsing experience.",
      },
      {
        title: "Storage",
        body:
          "Local storage may be used to remember your blur preferences, saved areas, and Pro status so you do not have to configure the same setup repeatedly.",
      },
      {
        title: "Network calls",
        body:
          "The extension may contact billing or support endpoints for Pro checkout and subscription verification. It does not upload screen content for blur processing.",
      },
    ],
    bullets: [
      "Permissions support overlays and preferences",
      "Blur processing does not require uploading page content",
      "Saved preferences stay scoped to the extension experience",
      "Billing calls are separate from screen data",
    ],
  },
  {
    path: "/use-cases/screen-sharing/",
    group: "Use cases",
    eyebrow: "Use case",
    title: "Screen sharing without exposing sensitive data",
    description:
      "Use Screen Privacy Blur before sales calls, investor updates, onboarding sessions, or live debugging where private information can appear unexpectedly.",
    sections: [
      {
        title: "Before the call",
        body:
          "Mark areas that often contain customer names, internal URLs, metrics, tokens, or private notes before you start presenting. Keep the product workflow visible while those details remain unreadable.",
      },
      {
        title: "During the call",
        body:
          "Keep the blur overlay visible while switching tabs or walking through a workflow, so an unexpected notification, customer record, or private sidebar is less likely to be exposed.",
      },
    ],
    bullets: ["Protect demos", "Hide private tabs", "Reduce recording cleanup", "Keep context visible without exposing details"],
  },
  {
    path: "/use-cases/google-meet/",
    group: "Use cases",
    eyebrow: "Use case",
    title: "Blur sensitive information in Google Meet",
    description:
      "Blur dashboards, inboxes, internal tools, and private fields before sharing a Chrome tab in Google Meet.",
    sections: [
      {
        title: "Meet-ready setup",
        body:
          "Prepare overlays for the areas you share most often: sidebars, user records, notification panels, address bars, account menus, and internal metrics.",
      },
      {
        title: "Works with tab sharing",
        body:
          "Because blur runs in the browser, it is useful when presenting a Chrome tab in Meet or recording a meeting recap. Build the blur layout before joining, then keep the walkthrough moving.",
      },
    ],
    bullets: ["Useful for demos", "Useful for support calls", "Useful for team reviews", "Works with Chromium browsers"],
  },
  {
    path: "/use-cases/zoom/",
    group: "Use cases",
    eyebrow: "Use case",
    title: "Screen privacy for Zoom demos",
    description:
      "Cover sensitive browser fields before sharing a browser window or tab during Zoom calls, customer demos, and recordings.",
    sections: [
      {
        title: "Demo safer",
        body:
          "Blur predictable areas like account menus, customer tables, private notes, internal IDs, and billing details. You can explain the workflow without revealing a real customer record.",
      },
      {
        title: "Record cleaner walkthroughs",
        body:
          "When you record Zoom sessions, blur overlays reduce the amount of sensitive information that needs editing afterward and make a reusable product walkthrough easier to publish.",
      },
    ],
    bullets: ["Customer demos", "Internal reviews", "Training sessions", "Recorded walkthroughs"],
  },
  {
    path: "/use-cases/loom-recording/",
    group: "Use cases",
    eyebrow: "Use case",
    title: "Hide private details before Loom recordings",
    description:
      "Record product walkthroughs, bug reports, and async updates with fewer accidental leaks in browser-based workflows.",
    sections: [
      {
        title: "Before recording",
        body:
          "Add blur to names, account IDs, emails, API keys, or private roadmap notes that can appear during a walkthrough. This lets viewers follow your steps without exposing the value underneath.",
      },
      {
        title: "After recording",
        body:
          "A clean recording means less manual editing and fewer retakes when you need to share a link quickly with a customer, teammate, or support contact.",
      },
    ],
    bullets: ["Product walkthroughs", "Bug reports", "Async updates", "Founder demos"],
  },
  {
    path: "/use-cases/hide-api-keys/",
    group: "Use cases",
    eyebrow: "Use case",
    title: "Hide API keys during live debugging",
    description:
      "Blur API keys, tokens, emails, and customer IDs before sharing docs, consoles, dashboards, or internal admin tools.",
    sections: [
      {
        title: "Protect secrets",
        body:
          "Use manual blur for known token areas and Smart Auto Blur Pro for common sensitive field patterns where automation can help. Revoke exposed credentials promptly if a secret was ever displayed.",
      },
      {
        title: "Keep the workflow visible",
        body:
          "The viewer can still follow your debugging steps while the specific key, token, email, or account field remains unreadable. That preserves technical context without publishing the secret.",
      },
    ],
    bullets: ["API keys", "Access tokens", "Emails", "Customer IDs"],
  },
  {
    path: "/alternatives/safe-screen-share/",
    group: "Alternatives",
    eyebrow: "Alternative",
    title: "Safe screen share alternative",
    description:
      "A lightweight Chrome extension for practical local blur overlays before sharing a browser screen in a demo, call, or recording.",
    sections: [
      {
        title: "Why choose Screen Privacy Blur",
        body:
          "It focuses on fast browser-based privacy controls instead of full video editing, desktop capture suites, or post-production workflows. Create an overlay, place it where you need it, and present.",
      },
      {
        title: "Best fit",
        body:
          "Use it when you want to keep presenting in Chrome while hiding predictable sensitive areas from calls and recordings. It is especially useful for live demos, support sessions, and internal walkthroughs.",
      },
    ],
    bullets: ["Chrome-first", "Local blur", "Quick setup", "Manual and Pro workflows"],
  },
  {
    path: "/alternatives/datablur/",
    group: "Alternatives",
    eyebrow: "Alternative",
    title: "DataBlur alternative for browser screen sharing",
    description:
      "A Chrome-focused way to blur sensitive browser content before a demo, call, or recording without adding a post-production step.",
    sections: [
      {
        title: "Focused on live browser work",
        body:
          "Screen Privacy Blur is built around browser overlays and screen-sharing moments rather than broad data-redaction pipelines. The aim is to keep a live workflow understandable while specific private fields stay obscured.",
      },
      {
        title: "Privacy-first positioning",
        body:
          "The product emphasizes local processing and clear privacy explanations for teams that present sensitive browser-based tools to customers, colleagues, or public audiences.",
      },
    ],
    bullets: ["For demos", "For recordings", "For founders", "For remote teams"],
  },
  {
    path: "/alternatives/privacy-blu/",
    group: "Alternatives",
    eyebrow: "Alternative",
    title: "Privacy Blur alternative for Chrome",
    description:
      "Screen Privacy Blur helps founders, creators, and remote teams blur sensitive areas directly in Chrome before sharing their screen.",
    sections: [
      {
        title: "Simple by design",
        body:
          "Choose visible blur controls, local processing, and support pages that explain what data is and is not collected. The free manual overlay workflow is designed for fast preparation before a live share.",
      },
      {
        title: "Where it helps",
        body:
          "Use it for Google Meet, Zoom, Loom, customer demos, internal reviews, and live debugging sessions when a browser tab contains information that should not be recorded or shared.",
      },
    ],
    bullets: ["Browser overlays", "Local processing", "Clear permissions", "Free manual blur"],
  },
];

export const pageByPath = Object.fromEntries(
  seoPages.flatMap((page) => [
    [page.path, page],
    [page.path.slice(0, -1), page],
  ])
);
