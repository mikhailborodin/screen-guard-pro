import { escapeHtml } from './conversion.mjs';
import { getCopy } from './locales.mjs';

export const homeFaqs = getCopy('en').faq.items;
export const getHomeFaqs = (locale = 'en') => getCopy(locale).faq.items;
export function faqsForPage(page) {
  if (!page) return homeFaqs;
  const slug = page.path.split('/').filter(Boolean).at(-1);
  const specific = {
    'sales-demos-crm': {question:'Can I use replacement in HubSpot, Salesforce, or Pipedrive demos?', answer:'Use a local Pro scenario for visible names, emails, and phones, then adjust matching rules for your CRM. Test navigation and scrolling before presenting. Replacement is a local presentation view, not a database update; avoid editing or submitting production forms during the demo.'},
    'developers-api-keys': {question:'Can the Chrome extension hide secrets in my native terminal or code editor?', answer:'It protects browser-visible text, including web editors and dashboards. It cannot inspect a native terminal or desktop editor. Use the macOS app’s manual overlays for those windows, and custom Pro patterns for browser-visible secret formats that built-in masks do not cover.'},
    'stripe-fintech-dashboards': {question:'Does replacing a balance change my Stripe ledger or transactions?', answer:'No. Replacement changes visible browser text locally for a presentation. It does not change stored balances or transactions. Configure custom amount rules, review the preview, and do not submit synthetic values in production forms.'},
    'loom-blur-alternative': {question:'Do I need a paid Loom plan to use Screen Privacy Blur?', answer:'No. Manual browser blur and saved layouts are available free independently of your recording tool. Smart Auto-Blur and Auto-Replace require Screen Privacy Blur Pro. Loom’s own blur eligibility is controlled by Loom.'},
    'blurweb-alternative': {question:'Do I need a license key to start manual blur?', answer:'No. Install Screen Privacy Blur and use manual overlays, exact element selection, and saved layouts without a license key. Automatic masks and synthetic replacements are optional paid upgrades. Compare current paid terms on BlurWeb’s pricing page.'},
    'zeroblur-alternative': {question:'What can I add beyond manual browser blur?', answer:'Screen Privacy Blur Pro adds local masks and realistic demo replacements to the free manual overlay workflow. Configure rules for your own pages and review their effect before sharing.'},
    'contextblur-alternative': {question:'What should I compare besides element selection?', answer:'Compare saved layouts, custom sensitive-data patterns, and whether you need a readable synthetic demo scenario. ContextBlur documents local masking; Screen Privacy Blur Pro also offers reusable replacement scenarios and editable source matching rules.'},
    'safe-screen-share': {question:'How does Screen Privacy Blur compare to Safe Screen Share extensions?', answer:'Screen Privacy Blur runs locally in a Manifest V3 Chrome Side Panel with free manual element and area blur, per-website saved layouts, and optional Pro masks and realistic synthetic data replacement for live demos.'},
    'datablur': {question:'How is Screen Privacy Blur different from DataBlur?', answer:'Screen Privacy Blur combines free click-to-blur DOM selection and saved site layouts with local regex pattern detection and one-click Live Data Replacement so dashboards stay clean and readable during sales calls.'},
    'privacy-blu': {question:'Why switch to Screen Privacy Blur for Chrome screen sharing?', answer:'Screen Privacy Blur offers persistent per-domain layouts, Chrome Side Panel controls, hotkeys, local PII pattern masks, and synthetic data replacement with zero page content ever uploaded.'},
    'google-meet': {question:'Does Screen Privacy Blur stay active when presenting in Google Meet?', answer:'Yes. Saved per-website layouts apply automatically on each domain, and active overlays stay locked to DOM elements as you scroll or present in a shared Chrome tab or window.'},
    'zoom': {question:'Can Zoom attendees see the original data underneath the blur or replacement?', answer:'No. Because Screen Privacy Blur modifies or masks the rendered DOM inside Chrome before Zoom captures the frame, remote participants and recordings only see the blurred or replaced view.'},
    'loom-recording': {question:'Can I blur or replace sensitive data on the free Loom plan?', answer:'Yes. Screen Privacy Blur works inside Chrome before Loom captures your tab or screen, so you get free manual blur and saved layouts regardless of your Loom subscription tier.'},
    'hide-api-keys': {question:'Does Smart Auto-Blur detect live API keys and tokens automatically?', answer:'Yes. Screen Privacy Blur Pro includes built-in local pattern masks for common API keys, tokens, emails, and cards, plus custom regex/mask rules for internal secret formats.'},
    'screen-sharing': {question:'What is the fastest way to hide sensitive data right before a screen share?', answer:'Pin Screen Privacy Blur in your Chrome toolbar, open the Side Panel, and toggle saved site rules, Smart Auto-Blur masks, or Live Data Replacement in one click before starting your share.'},
    'microsoft-teams': {question:'Does Screen Privacy Blur work with Microsoft Teams desktop and web screen sharing?', answer:'Yes. When Microsoft Teams shares your protected Chrome tab, browser window, or entire display, the blur overlays and synthetic data replacements rendered inside Chrome are what attendees see.'},
    'obs-streaming': {question:'Will Screen Privacy Blur overlays appear in OBS Window Capture and Display Capture?', answer:'Yes. Overlays and DOM data replacements are rendered directly inside the browser viewport, so OBS Studio captures the protected view with zero extra CPU/GPU filter overhead.'},
  };
  const first = specific[slug] || {question:`How do I prepare ${page.eyebrow.toLowerCase()} protection before sharing?`, answer:`Open the browser page you plan to present, protect sensitive fields with manual blur or a Pro scenario, and review the exact navigation and scrolling path. Save the layout for the next session. ${page.description}`};
  return [first, homeFaqs[0], homeFaqs[1], homeFaqs[2], ...(page.group === 'Compare' || page.group === 'Alternatives' ? [homeFaqs[3]] : [homeFaqs[4]])];
}
export const faqSchema = (faqs) => ({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(({question,answer}) => ({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))});
export const faqHtml = (faqs, locale = 'en') => {
  const f = getCopy(locale).faq;
  const list = faqs ?? f.items;
  return `<section class="m-section m-wrap" id="faq"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(f.kicker)}</span><h2>${escapeHtml(f.title)}</h2></div><div class="m-faq">${list.map(({question,answer}) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div><p class="m-note">${f.noteHtml}</p></section>`;
};
