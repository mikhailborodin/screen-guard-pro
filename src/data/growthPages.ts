export type GrowthPage = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  bullets: string[];
};

export const pageByPath: Record<string, GrowthPage> = {
  "/privacy-policy": {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy for Screen Privacy Blur",
    description:
      "Screen Privacy Blur is designed to protect what is visible on your screen without collecting screen content, browsing activity, or personal files.",
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
  "/terms": {
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    description:
      "These terms explain how you may use Screen Privacy Blur, including the free manual blur features and optional Pro subscription.",
    sections: [
      {
        title: "Use of the extension",
        body:
          "You may use Screen Privacy Blur to obscure sensitive information during screen sharing, calls, demos, and recordings. You are responsible for reviewing your screen before sharing it.",
      },
      {
        title: "Pro subscription",
        body:
          "Smart Auto Blur Pro is an optional paid feature that helps identify common sensitive field types. It is a convenience layer, not a guarantee that every sensitive item will be hidden.",
      },
      {
        title: "Availability",
        body:
          "The extension is provided as-is. We may improve, modify, or discontinue features, but privacy-preserving local processing remains a core product constraint.",
      },
    ],
    bullets: [
      "Use the extension only for lawful purposes",
      "Verify your screen before sharing confidential material",
      "Do not rely on automation as your only security control",
      "Contact support for billing or product questions",
    ],
  },
  "/data-collection": {
    eyebrow: "Data Collection",
    title: "What Screen Privacy Blur collects",
    description:
      "The core extension is intentionally local-first. Its job is to hide information on your screen, not to send that information elsewhere.",
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
  "/permissions": {
    eyebrow: "Permissions",
    title: "Why Screen Privacy Blur needs browser permissions",
    description:
      "Browser permissions let the extension place blur overlays where you ask for them and keep those overlays available during real screen sharing workflows.",
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
  "/use-cases/screen-sharing": {
    eyebrow: "Use case",
    title: "Screen sharing without exposing sensitive data",
    description:
      "Use Screen Privacy Blur before sales calls, investor updates, onboarding sessions, or live debugging where private information can appear unexpectedly.",
    sections: [
      {
        title: "Before the call",
        body:
          "Mark areas that often contain customer names, internal URLs, metrics, tokens, or private notes before you start presenting.",
      },
      {
        title: "During the call",
        body:
          "Keep the blur overlay visible while switching tabs or walking through a workflow, so accidental exposure is less likely.",
      },
    ],
    bullets: ["Protect demos", "Hide private tabs", "Reduce recording cleanup", "Keep context visible without exposing details"],
  },
  "/use-cases/google-meet": {
    eyebrow: "Use case",
    title: "Blur sensitive information in Google Meet",
    description:
      "Google Meet makes screen sharing fast, but dashboards, inboxes, and internal tools often include private details. Blur them before you present.",
    sections: [
      {
        title: "Meet-ready setup",
        body:
          "Prepare overlays for the areas you share most often: sidebars, user records, notification panels, and address bars.",
      },
      {
        title: "Works with tab sharing",
        body:
          "Because blur runs in the browser, it is useful when presenting a Chrome tab in Meet or recording a meeting recap.",
      },
    ],
    bullets: ["Useful for demos", "Useful for support calls", "Useful for team reviews", "Works with Chromium browsers"],
  },
  "/use-cases/zoom": {
    eyebrow: "Use case",
    title: "Screen privacy for Zoom demos",
    description:
      "Screen Privacy Blur helps you cover sensitive fields before sharing a browser window or tab during Zoom calls.",
    sections: [
      {
        title: "Demo safer",
        body:
          "Blur predictable areas like account menus, customer tables, private notes, internal IDs, and billing details.",
      },
      {
        title: "Record cleaner walkthroughs",
        body:
          "When you record Zoom sessions, blur overlays reduce the amount of sensitive information that needs editing afterward.",
      },
    ],
    bullets: ["Customer demos", "Internal reviews", "Training sessions", "Recorded walkthroughs"],
  },
  "/use-cases/loom-recording": {
    eyebrow: "Use case",
    title: "Hide private details before Loom recordings",
    description:
      "Record product walkthroughs, bug reports, and async updates with fewer accidental leaks in browser-based workflows.",
    sections: [
      {
        title: "Before recording",
        body:
          "Add blur to names, account IDs, emails, API keys, or private roadmap notes that can appear during a walkthrough.",
      },
      {
        title: "After recording",
        body:
          "A clean recording means less manual editing and fewer retakes when you need to share a link quickly.",
      },
    ],
    bullets: ["Product walkthroughs", "Bug reports", "Async updates", "Founder demos"],
  },
  "/use-cases/hide-api-keys": {
    eyebrow: "Use case",
    title: "Hide API keys during live debugging",
    description:
      "When docs, consoles, dashboards, or internal admin tools show tokens and credentials, blur the sensitive area before you share.",
    sections: [
      {
        title: "Protect secrets",
        body:
          "Use manual blur for known token areas and Smart Auto Blur Pro for common sensitive field patterns where automation can help.",
      },
      {
        title: "Keep the workflow visible",
        body:
          "The viewer can still follow your steps while the specific key, token, email, or account field remains unreadable.",
      },
    ],
    bullets: ["API keys", "Access tokens", "Emails", "Customer IDs"],
  },
  "/alternatives/safe-screen-share": {
    eyebrow: "Alternative",
    title: "Safe screen share alternative",
    description:
      "Screen Privacy Blur is a lightweight browser extension for people who need practical blur overlays before sharing a screen.",
    sections: [
      {
        title: "Why choose it",
        body:
          "It focuses on fast browser-based privacy controls instead of full video editing, desktop capture suites, or post-production workflows.",
      },
      {
        title: "Best fit",
        body:
          "Use it when you want to keep presenting in Chrome while hiding predictable sensitive areas from calls and recordings.",
      },
    ],
    bullets: ["Chrome-first", "Local blur", "Quick setup", "Manual and Pro workflows"],
  },
  "/alternatives/datablur": {
    eyebrow: "Alternative",
    title: "DataBlur alternative for browser screen sharing",
    description:
      "If you need a Chrome-focused way to blur sensitive browser content before a demo or recording, Screen Privacy Blur keeps the workflow simple.",
    sections: [
      {
        title: "Focused on live browser work",
        body:
          "Screen Privacy Blur is built around browser overlays and screen sharing moments rather than broad data redaction pipelines.",
      },
      {
        title: "Privacy-first positioning",
        body:
          "The product emphasizes local processing and clear privacy explanations for teams that present sensitive browser-based tools.",
      },
    ],
    bullets: ["For demos", "For recordings", "For founders", "For remote teams"],
  },
  "/alternatives/privacy-blu": {
    eyebrow: "Alternative",
    title: "Privacy Blur alternative for Chrome",
    description:
      "Screen Privacy Blur helps founders, creators, and remote teams blur sensitive areas directly in the browser before sharing their screen.",
    sections: [
      {
        title: "Simple by design",
        body:
          "Choose visible blur controls, local processing, and support pages that explain what data is and is not collected.",
      },
      {
        title: "Where it helps",
        body:
          "Use it for Google Meet, Zoom, Loom, customer demos, internal reviews, and live debugging sessions.",
      },
    ],
    bullets: ["Browser overlays", "SEO-ready privacy pages", "Clear permissions", "Free manual blur"],
  },
};
