import { escapeHtml, installActionsHtml } from './conversion.mjs';
import { getCopy, localizedPath } from './locales.mjs';

export const uninstallReasons = getCopy('en').uninstall.reasons;
export const uninstallHtml = (locale = 'en') => {
  const u = getCopy(locale).uninstall;
  const pagePath = localizedPath('/uninstall/', locale);
  return `<section class="m-section m-wrap m-uninstall"><span class="m-kicker">${escapeHtml(u.kicker)}</span><h1 class="m-welcome-title">${escapeHtml(u.title)}</h1><p class="m-lead">${escapeHtml(u.lead)}</p><fieldset class="m-survey" data-uninstall-survey><legend>${escapeHtml(u.legend)}</legend>${u.reasons.map(([value,label]) => `<label><input type="radio" name="uninstall-reason" value="${value}" /><span>${escapeHtml(label)}</span></label>`).join('')}</fieldset><p class="m-note">${escapeHtml(u.surveyNote)}</p><div data-retention-tip class="m-card m-highlight" hidden></div><form data-website-feedback class="m-card" hidden><label for="feedback-website">${u.websiteLabelHtml}</label><input id="feedback-website" type="url" placeholder="https://example.com" inputmode="url" /><p class="m-note">${escapeHtml(u.websiteNote)}</p><button class="m-button m-secondary" type="submit">${escapeHtml(u.websiteSubmit)}</button><p class="m-note" role="status" data-website-status></p></form><p role="status" data-survey-status class="m-note"></p><noscript><p>To send feedback, enable JavaScript or <a href="/support/">contact support</a>. You can still reinstall below.</p></noscript><div class="m-section"><h2>${escapeHtml(u.reinstallHeading)}</h2><p>${escapeHtml(u.reinstallBody)}</p>${installActionsHtml(pagePath, 'footer', u.reinstallCta)}<a class="m-text-link" href="/support/">${escapeHtml(u.supportLink)}</a></div></section>`;
};

export const googleFormId = '1FAIpQLSeYws5UVyHCfAjEe8coUn1r2lgWEj_4x8Q0P6vrQBqjuK2_Mg';
export const googleFormResponseUrl = `https://docs.google.com/forms/d/e/${googleFormId}/formResponse`;
export const googleFormViewUrl = `https://docs.google.com/forms/d/e/${googleFormId}/viewform`;

// Sends responses directly to the Google Form (entry.878820941 & entry.1014820536) and GA4.
export function initializeRetention(root = document) {
  const survey = root.querySelector('[data-uninstall-survey]');
  if (!survey) return () => {};
  const win = root.ownerDocument?.defaultView || window;
  const tip = root.querySelector('[data-retention-tip]');
  const websiteForm = root.querySelector('[data-website-feedback]');
  let lastReason;
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYws5UVyHCfAjEe8coUn1r2lgWEj_4x8Q0P6vrQBqjuK2_Mg/formResponse';
  const googleFormReasonMap = {
    website: "Blurring didn't work as expected",
    pattern: 'It was missing a feature I needed',
    free: "The Pro features or price didn't work for me",
    finished: 'I no longer need it',
  };
  const submitGoogleForm = (reason, detail = '') => {
    const mapped = googleFormReasonMap[reason] || "Blurring didn't work as expected";
    const body = new URLSearchParams({
      'entry.878820941': mapped,
      'entry.1014820536': detail || `[${reason}] via ${win.location.pathname}`,
      fvv: '1',
    });
    if (typeof win.fetch === 'function') {
      win.fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        keepalive: true,
      }).catch(() => {});
    }
  };
  const track = (name, params) => {
    win.dataLayer = win.dataLayer || [];
    if (!win.gtag) win.gtag = function() { win.dataLayer.push(arguments); };
    win.gtag('event', name, {...params, page_location:win.location.origin + win.location.pathname, transport_type:'beacon'});
  };
  const onChange = (event) => {
    if (event.target.name !== 'uninstall-reason') return;
    const reason = event.target.value;
    if (!['website','pattern','free','finished'].includes(reason)) return;
    websiteForm.hidden = reason !== 'website';
    tip.hidden = false;
    // Fixed copy only; user input is never inserted into HTML.
    const tips = {
      website:'Try exact element selection or a manual overlay on that page. Both are free. The side panel can help you review active rules. You can also share the website domain below.',
      pattern:'Pro supports custom mask/pattern rules for internal dashboards. If a pattern is missing, contact support with a fictional example of the format you need.',
      free:'Manual blur is free forever: draw unlimited overlays, select exact elements, adjust glass effects, and save layouts per website. Automatic masks and replacement are optional paid Pro features.',
      finished:'Thanks for using us for your demo. Your next recording can start with free manual overlays and a saved layout. Save the reinstall link below for later.',
    };
    tip.textContent = tips[reason];
    if (lastReason !== reason) {
      track('uninstall_feedback', {reason});
      submitGoogleForm(reason);
    }
    lastReason = reason;
    root.querySelector('[data-survey-status]').textContent = 'Thanks for telling us. Your feedback helps us improve.';
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const input = websiteForm.querySelector('input');
    const status = websiteForm.querySelector('[data-website-status]');
    try {
      const url = new URL(input.value);
      if (!['http:','https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error('Invalid website');
      track('uninstall_website_feedback', {reason:'website', website_domain:url.hostname});
      submitGoogleForm(lastReason || 'website', `Website domain: ${url.hostname} (${win.location.pathname})`);
      status.textContent = 'Thanks — only the website domain was included.';
      input.value = '';
    } catch {
      status.textContent = 'Enter a website address beginning with https://, or leave it blank.';
      input.focus();
    }
  };
  survey.addEventListener('change', onChange);
  websiteForm.addEventListener('submit', onSubmit);
  return () => { survey.removeEventListener('change', onChange); websiteForm.removeEventListener('submit', onSubmit); };
}
