export const upgradeSeoPages = [
  {
    path: '/compare/blurweb-alternative/', group: 'Compare', eyebrow: 'BlurWeb alternative',
    title: 'Screen Privacy Blur vs. BlurWeb',
    seoTitle: 'BlurWeb Alternative & Comparison | Screen Privacy Blur',
    description: 'Compare browser blur workflows: start with free manual protection, then add local masks and Live Data Replacement for polished demos.',
    sections: [
      {title: 'A free starting point without a license key', body: 'Screen Privacy Blur includes unlimited manual overlays, exact element selection, customization, and saved layouts in its free tier. Install and start protecting a tab without a license key for manual blur.'},
      {title: 'Readable synthetic demo data', body: 'Pro can replace customer emails, phones, names, and custom values locally. Use replacement when your audience needs to follow a realistic CRM workflow without seeing real identities.'},
      {title: 'Compare the workflow you need', body: 'BlurWeb offers paid browser licenses and cross-device sync. Screen Privacy Blur focuses on a free manual tier plus paid local detection and demo replacement. Check the linked vendor pricing for current terms.'},
    ], bullets: ['Free manual blur', 'Local pattern masks in Pro', 'Live Data Replacement in Pro', 'Per-site saved layouts'],
    sources: [{label: 'BlurWeb pricing', url: 'https://www.blurweb.app/pricing'}],
  },
  {
    path: '/compare/zeroblur-alternative/', group: 'Compare', eyebrow: 'ZeroBlur alternative',
    title: 'A Manifest V3 alternative to ZeroBlur',
    seoTitle: 'Manifest V3 ZeroBlur Alternative | Screen Privacy Blur',
    description: 'Looking beyond manual blur? Screen Privacy Blur combines browser overlays with local auto-detection and synthetic demo data.',
    sections: [
      {title: 'Start with the familiar manual workflow', body: 'Select exact page elements or draw adjustable rectangles. Set blur intensity and save the layout per website before your next call.'},
      {title: 'Add local automation', body: 'Smart Auto Blur Pro uses local masks for emails, phone numbers, cards, SSNs, API keys, and custom patterns. Review the visible page after applying a profile.'},
      {title: 'Choose readable replacements', body: 'Data Replacement Pro swaps visible private values with fictional demo identities. Screen Privacy Blur uses Manifest V3 and runs detection and replacement on your device.'},
    ], bullets: ['Manifest V3 architecture', 'Free manual overlays', 'Pro auto-detection', 'Pro synthetic demo data'],
  },
  {
    path: '/compare/loom-blur-alternative/', group: 'Compare', eyebrow: 'Loom blur alternative',
    title: 'A browser-wide alternative to Loom blur',
    seoTitle: 'Browser-Wide Loom Redaction Tool | Screen Privacy Blur',
    description: 'Protect browser content before Zoom, Meet, Teams, Loom, and OBS sharing with free manual blur and optional Pro automation.',
    sections: [
      {title: 'Protect the source browser tab', body: 'Screen Privacy Blur changes what appears on your browser page before the call or recording. Share that protected tab or browser window in Zoom, Meet, Teams, Loom, or OBS. Browser protection does not cover other desktop apps.'},
      {title: 'Free manual protection outside a recording plan', body: 'Loom’s documentation currently lists blur for Creators and Admins on Business, Business + AI, or Enterprise plans. Screen Privacy Blur provides manual browser overlays free, with automatic masks and replacement as Pro upgrades.'},
      {title: 'Keep live demos readable', body: 'Use local synthetic replacements for customer contact data instead of covering every field with a blur block. The page remains readable while your real account stays unchanged.'},
    ], bullets: ['Free manual browser blur', 'Works before calls and recordings', 'Optional Pro replacement', 'Review before sharing'],
    sources: [{label: 'Loom blur documentation', url: 'https://support.atlassian.com/loom/docs/blur-sensitive-information'}],
  },
  {
    path: '/compare/contextblur-alternative/', group: 'Compare', eyebrow: 'ContextBlur alternative',
    title: 'Screen Privacy Blur vs. ContextBlur',
    seoTitle: 'ContextBlur Alternative & Guide | Screen Privacy Blur',
    description: 'Compare element blur, local pattern masks, saved layouts, and synthetic data replacement for live browser presentations.',
    sections: [
      {title: 'Element selection and saved layouts', body: 'ContextBlur documents exact element targeting and saved CSS selectors. Screen Privacy Blur also offers exact element selection, draggable overlays, and per-website layouts in its free tier.'},
      {title: 'Local detection for sensitive patterns', body: 'ContextBlur documents local regex masking for common sensitive data. Screen Privacy Blur Pro provides local masks for emails, phones, cards, SSNs, API keys, and custom rules. Choose patterns that match your own dashboard.'},
      {title: 'A clean synthetic demo workflow', body: 'Screen Privacy Blur Data Replacement Pro adds fictional identities, reusable scenarios, and editable matching rules so your CRM stays readable during a walkthrough. Test the scenario on your actual page before a live presentation.'},
    ], bullets: ['Exact element blur', 'Per-site layouts', 'Custom masks in Pro', 'Reusable replacement scenarios in Pro'],
    sources: [{label: 'ContextBlur features', url: 'https://contextblur.app/features'}],
  },
  {
    path: '/use-cases/sales-demos-crm/', group: 'Use cases', eyebrow: 'Sales demos & CRM',
    title: 'Replace customer data during live CRM demos',
    seoTitle: 'Replace Data in Live CRM Demos | Screen Privacy Blur',
    description: 'Present HubSpot, Salesforce, or Pipedrive workflows with fictional emails and phones instead of real customer identities.',
    sections: [
      {title: 'Set up a demo scenario', body: 'Open the CRM page you plan to share. In Data Replacement Pro, choose fictional names, emails, and phone numbers, then edit source matching rules for the fields on that page.'},
      {title: 'Keep the story readable', body: 'Replacement happens in the visible DOM locally. Viewers can follow a sales workflow with realistic contacts while the account’s stored customer records remain unchanged.'},
      {title: 'Walk the exact demo path', body: 'Preview navigation, scrolling, in-app tabs, and repeated contacts. Use manual blur for unsupported areas. Review your own CRM setup rather than assuming every embedded widget or custom field will match.'},
    ], bullets: ['Fictional customer identities', 'Readable contact tables', 'Custom matching rules', 'Save per-domain privacy layouts'],
  },
  {
    path: '/use-cases/developers-api-keys/', group: 'Use cases', eyebrow: 'Developers & API keys',
    title: 'Hide API keys during screen sharing and coding streams',
    seoTitle: 'Hide API Keys on Coding Streams | Screen Privacy Blur',
    description: 'Use local masks and manual blur to protect visible tokens, .env secrets, and AWS or GitHub keys in browser dashboards.',
    sections: [
      {title: 'Protect browser-visible secrets', body: 'Before sharing, open the console, repository page, or browser-based editor. Use Smart Auto Blur Pro API key masks and custom rules for the secret formats your team uses.'},
      {title: 'Cover the fields that patterns miss', body: 'Select an exact DOM element or draw a manual overlay for custom token fields and browser-visible .env text. The Chrome extension cannot protect a native terminal or desktop editor; use the macOS app’s manual overlays for those windows.'},
      {title: 'Preview before streaming', body: 'Scroll through the debugging path and verify each value is obscured. Pattern matching is local but cannot guarantee every secret format is found. If an actual credential is exposed, rotate it through its provider.'},
    ], bullets: ['Local API key masks', 'Custom token patterns', 'Manual element selection', 'Browser-based coding walkthroughs'],
  },
  {
    path: '/use-cases/stripe-fintech-dashboards/', group: 'Use cases', eyebrow: 'Stripe & financial dashboards',
    title: 'Hide balances and customer PII in financial dashboards',
    seoTitle: 'Hide Balances in Stripe & Fintech | Screen Privacy Blur',
    description: 'Prepare Stripe and fintech browser dashboards for presentations with manual blur, local masks, and synthetic demo values.',
    sections: [
      {title: 'Decide what the audience needs to see', body: 'Identify balances, revenue figures, email addresses, phone numbers, and account details. Blur fields that are irrelevant to the story and replace supported values when a realistic example helps.'},
      {title: 'Configure local replacement rules', body: 'Use Data Replacement Pro scenarios and editable matching rules for visible customer identities and custom amounts. Match your dashboard’s currency and number formatting, then review the rendered result.'},
      {title: 'Protect the full walkthrough', body: 'Save the per-website layout, open the side panel, and test scrolling and detail views. Replacement affects visible browser content, not transactions or the stored ledger. Do not submit synthetic values into production forms.'},
    ], bullets: ['Blur account balances', 'Replace visible contact details', 'Custom amount rules', 'Per-site layouts for repeat demos'],
  },
  {
    path: '/use-cases/microsoft-teams/', group: 'Use cases', eyebrow: 'Microsoft Teams',
    title: 'Blur sensitive data in Microsoft Teams screen sharing',
    seoTitle: 'Hide Sensitive Data in MS Teams | Screen Privacy Blur',
    description: 'Hide customer emails, balances, and internal fields in Chrome before sharing your screen or browser window in Microsoft Teams.',
    sections: [
      {title: 'Prepare your browser tab before joining Teams', body: 'Open the web dashboard, CRM, or admin console in Chrome and apply manual blur overlays, local PII pattern masks, or Live Data Replacement before starting your Microsoft Teams screen share.'},
      {title: 'Consistent protection across tabs and windows', body: 'Because Screen Privacy Blur modifies the rendered page locally inside Chrome, Teams participants and meeting recordings only see your blurred or replaced view when you share that browser tab or window.'},
      {title: 'Save layouts for recurring enterprise meetings', body: 'Pin your privacy rules per domain so internal portals, Azure dashboards, and CRM tables load with protection ready before your next Microsoft Teams call.'},
    ], bullets: ['Works with Teams tab & window sharing', 'Saved per-domain layouts', 'Local PII auto-blur in Pro', 'Clean mock data replacement in Pro'],
  },
  {
    path: '/use-cases/obs-streaming/', group: 'Use cases', eyebrow: 'OBS Studio & streaming',
    title: 'Hide API keys and PII in OBS Studio & live streams',
    seoTitle: 'Hide Secrets in OBS Studio Streams | Screen Privacy Blur',
    description: 'Protect browser tabs captured in OBS Studio, Twitch, or YouTube coding streams with local blur overlays, regex masks, and mock data.',
    sections: [
      {title: 'Stream browser workflows without leaking secrets', body: 'When OBS Studio captures a Chrome window or display, any accidental reveal of an API token, customer email, or billing balance is broadcast live. Use Screen Privacy Blur to mask sensitive DOM elements beforehand.'},
      {title: 'Dev / Streamer preset and custom token masks', body: 'Enable Smart Auto-Blur Pro masks for API keys, bearer tokens, emails, and cards, or lock manual frosted-glass overlays onto specific dashboard panels so they stay hidden as you scroll.'},
      {title: 'Combine browser and macOS desktop overlays', body: 'Use the Chrome extension for web consoles (AWS, Stripe, GitHub, Vercel) and pair it with the macOS desktop app to place click-through blur regions over native terminals or code editors.'},
    ], bullets: ['Built for OBS Window & Display Capture', 'Local API key & token detection', 'Click-to-blur DOM locking', 'Zero performance lag on stream'],
  },
];
