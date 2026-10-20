import { getCopy, getLocaleMeta, localeFromPath } from './locales.mjs';

export const storeUrl = 'https://chromewebstore.google.com/detail/screen-privacy-blur/pfngjkakgncabcfjdknjacpnbidjlldm';
export const reviewsUrl = `${storeUrl}/reviews`;
export const campaignForPath = (path = '/') => path.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home';
export function installUrl(path = '/', placement = 'hero') {
  const locale = localeFromPath(path);
  const meta = getLocaleMeta(locale);
  const url = new URL(storeUrl);
  const params = {
    utm_source: 'privacyblur_site',
    utm_medium: 'landing',
    utm_campaign: campaignForPath(path),
    utm_content: placement,
    ...(locale !== 'en' ? { hl: meta.cwsHl } : {}),
  };
  url.search = new URLSearchParams(params).toString();
  return url.href;
}
export const escapeHtml = (value) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function installActionsHtml(path = '/', placement = 'hero', label) {
  const copy = getCopy(localeFromPath(path)).conversion;
  const ctaLabel = label ?? copy.addToChromeFree;
  return `<div class="m-install-controls" data-install-controls data-browser-caption-default="${escapeHtml(copy.browserCaption)}">
    <a class="m-button" data-desktop-install data-install="chrome" data-placement="${placement}" href="${escapeHtml(installUrl(path, placement))}" target="_blank" rel="noopener noreferrer">${escapeHtml(ctaLabel)}</a>
    <div class="m-mobile-actions"><button type="button" class="m-button" data-copy-desktop>${escapeHtml(copy.copyDesktop)}</button><button type="button" class="m-button m-secondary" data-share-desktop>${escapeHtml(copy.shareDesktop)}</button></div>
    <p class="m-note" data-browser-caption>${escapeHtml(copy.browserCaption)}</p>
    <p class="m-action-status m-note" role="status" aria-live="polite" data-install-status></p>
    <label class="m-manual-copy" hidden>${escapeHtml(copy.desktopInstallLinkLabel)} <input readonly aria-label="${escapeHtml(copy.desktopInstallLinkLabel)}" /></label>
  </div>`;
}
export function attributeInstallLinks(html, path) {
  return html.replace(/<a\b[^>]*\bhref="https:\/\/chromewebstore\.google\.com\/detail\/[^"\s]+"[^>]*>/g, tag => {
    if (/\/reviews(?:[?"/])/.test(tag)) return tag;
    const placement = tag.match(/data-placement="([^"]+)"/)?.[1] || (tag.includes('data-install="macos"') ? 'footer' : tag.includes('data-install="hero"') ? 'hero' : 'navbar');
    return tag.replace(/href="[^"]+"/, `href="${escapeHtml(installUrl(path, placement))}"`);
  });
}

// Self-contained so the static build can embed this without loading React.
export function initializeConversion(root = document) {
  const win = root.ownerDocument?.defaultView || window;
  const nav = win.navigator;
  const media = win.matchMedia('(max-width: 767px)');
  const controls = [...root.querySelectorAll('[data-install-controls]')];
  try {
    const incoming = new URLSearchParams(win.location?.search || '');
    const src = incoming.get('utm_source') || incoming.get('ref_source');
    const med = incoming.get('utm_medium');
    const cmp = incoming.get('utm_campaign');
    if (src) win.sessionStorage?.setItem('privacyblur:utm_source', src);
    if (med) win.sessionStorage?.setItem('privacyblur:utm_medium', med);
    if (cmp) win.sessionStorage?.setItem('privacyblur:utm_campaign', cmp);
    const savedSrc = src || win.sessionStorage?.getItem('privacyblur:utm_source');
    const savedCmp = cmp || win.sessionStorage?.getItem('privacyblur:utm_campaign');
    if (savedSrc) {
      root.querySelectorAll('a[data-desktop-install]').forEach(link => {
        const u = new URL(link.href);
        u.searchParams.set('utm_term', savedCmp ? `${savedSrc}_${savedCmp}` : savedSrc);
        link.href = u.href;
      });
    }
  } catch { /* ignore storage/URL errors */ }
  const update = () => {
    const mobile = media.matches || /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
    const docEl = (root.ownerDocument || document).documentElement;
    const isArc = Boolean(docEl && win.getComputedStyle?.(docEl)?.getPropertyValue('--arc-palette-title'));
    const chromium = !!nav.brave || isArc || /Chrome\/|Chromium\/|Edg\/|Arc\//i.test(nav.userAgent) || nav.userAgentData?.brands?.some(item => /Chromium|Google Chrome|Microsoft Edge|Brave|Arc/i.test(item.brand));
    controls.forEach(control => {
      control.dataset.mobile = String(mobile);
      const defaultCaption = control.dataset.browserCaptionDefault || 'Compatible with your browser • Free install in 2 clicks • No signup required';
      control.querySelector('[data-browser-caption]').textContent = mobile ? 'Save this link and install on your desktop browser. No signup required.' : chromium ? defaultCaption : 'Install on desktop Chrome, Brave, Edge, Arc, or another Chromium browser.';
    });
  };
  update();
  media.addEventListener('change', update);
  const copy = async (control) => {
    const url = control.querySelector('[data-desktop-install]').href;
    const status = control.querySelector('[data-install-status]');
    try {
      if (!nav.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await nav.clipboard.writeText(url);
      control.querySelector('.m-manual-copy').hidden = true;
      status.textContent = 'Link copied! Open it on your desktop browser';
    } catch {
      const fallback = control.querySelector('.m-manual-copy');
      fallback.hidden = false;
      const input = fallback.querySelector('input');
      input.value = url;
      input.focus();
      input.select();
      status.textContent = 'Copy the link below and open it on your desktop browser.';
    }
  };
  const onClick = async (event) => {
    const button = event.target.closest('[data-copy-desktop], [data-share-desktop]');
    if (!button || !root.contains(button)) return;
    const control = button.closest('[data-install-controls]');
    if (button.hasAttribute('data-copy-desktop') || typeof nav.share !== 'function') { await copy(control); return; }
    try {
      await nav.share({title:'Screen Privacy Blur — install on desktop', text:'Save this desktop install link for your next screen share.', url:control.querySelector('[data-desktop-install]').href});
      control.querySelector('[data-install-status]').textContent = 'Shared! Open the link on your desktop browser.';
    } catch (error) {
      if (error.name !== 'AbortError') await copy(control);
    }
  };
  root.addEventListener('click', onClick);
  return () => { media.removeEventListener('change', update); root.removeEventListener('click', onClick); };
}
