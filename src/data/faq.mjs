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
  };
  const first = specific[slug] || {question:`How do I prepare ${page.eyebrow.toLowerCase()} protection before sharing?`, answer:`Open the browser page you plan to present, protect sensitive fields with manual blur or a Pro scenario, and review the exact navigation and scrolling path. Save the layout for the next session. ${page.description}`};
  return [first, homeFaqs[0], homeFaqs[1], homeFaqs[2], ...(page.group === 'Compare' ? [homeFaqs[3]] : [homeFaqs[4]])];
}
export const faqSchema = (faqs) => ({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(({question,answer}) => ({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))});
export const faqHtml = (faqs, locale = 'en') => {
  const f = getCopy(locale).faq;
  const list = faqs ?? f.items;
  return `<section class="m-section m-wrap" id="faq"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(f.kicker)}</span><h2>${escapeHtml(f.title)}</h2></div><div class="m-faq">${list.map(({question,answer}) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div><p class="m-note">${f.noteHtml}</p></section>`;
};
