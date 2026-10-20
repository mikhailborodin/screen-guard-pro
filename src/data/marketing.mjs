import { escapeHtml, installActionsHtml, installUrl, reviewsUrl } from './conversion.mjs';
import { getCopy, localeFromPath, localizedPath } from './locales.mjs';
import { seoPages } from './seoContent.mjs';

export const heroTitle = 'Auto-Blur or Replace Sensitive Data Before You Share Your Screen';
export const heroDescription = 'Protect emails, phone numbers, API keys, and financial data on Zoom, Meet, and Loom. Blur elements manually, auto-detect sensitive patterns by mask, or swap real customer PII with clean mock data in one click.';
export const heroInstallUrl = installUrl('/', 'hero');
export const demoRows = [
  ['Customer Email', 'sarah.connor@acme-corp.io', 'demo.user@example-company.com'],
  ['Phone Number', '+1 (415) 890-4321', '+1 (555) 019-2834'],
  ['API Secret Key', 'sk_live_98a7f6d5e4c3b2a1', 'sk_test_••••••••••••••••'],
  ['Account Balance', '$124,589.00', '$45,000.00'],
];
export const features = getCopy('en').featuresSection.items;
export const freeFeatures = getCopy('en').pricing.freeBullets;
export const proFeatures = getCopy('en').pricing.proBullets;
const bullets = (items) => `<ul class="m-checks">${items.map(item => `<li><span aria-hidden="true">✓</span>${escapeHtml(item)}</li>`).join('')}</ul>`;

export const demoHtml = (locale = 'en') => {
  const h = getCopy(locale).hero;
  const rows = demoRows.map(([label, original, replacement], idx) => [h.demoLabels?.[idx] || label, original, replacement]);
  return `<div id="interactive-demo" class="m-demo" data-demo-mode="replace">
  <div class="m-browser"><span aria-hidden="true">● ● ●</span><span>⌑ secure-bank.com/dashboard</span></div>
  <div class="m-tabs" role="group" aria-label="Dashboard privacy mode">
    <button type="button" data-mode="original" aria-pressed="false">${escapeHtml(h.tabOriginal)}</button>
    <button type="button" data-mode="blur" aria-pressed="false">${escapeHtml(h.tabBlur)}</button>
    <button type="button" data-mode="replace" aria-pressed="true">${escapeHtml(h.tabReplace)} <small>${escapeHtml(h.tabReplaceSub)}</small></button>
  </div>
  <div class="m-dashboard"><div class="m-dashboard-heading"><div><small>${escapeHtml(h.dashboardKicker)}</small><h2>${escapeHtml(h.dashboardTitle)}</h2></div><span class="m-avatar" aria-hidden="true">SC</span></div>
  <div class="m-demo-status" role="status">${escapeHtml(h.statusReplaced)}</div>
  <dl>${rows.map(([label, original, replacement]) => `<div class="m-data-row"><dt>${escapeHtml(label)}</dt><dd data-original="${original}" data-replacement="${replacement}">${replacement}</dd></div>`).join('')}</dl>
  <p class="m-note">${escapeHtml(h.demoNote)}</p></div></div>`;
};

export const heroHtml = (locale = 'en') => {
  const h = getCopy(locale).hero;
  const homePath = localizedPath('/', locale);
  return `<section class="m-hero m-wrap"><div><a class="m-badge" href="${reviewsUrl}">${escapeHtml(h.badge)}</a><h1>${escapeHtml(h.title)}</h1><p class="m-lead">${escapeHtml(h.description)}</p><div class="m-actions">${installActionsHtml(homePath, 'hero')}<a class="m-button m-secondary" href="#interactive-demo">${escapeHtml(h.tryDemo)}</a></div><p class="m-note">${escapeHtml(h.note)}</p><a class="m-text-link" href="https://www.youtube.com/watch?v=g2E4lR6M8Zc" data-video-open target="_blank" rel="noopener noreferrer">${escapeHtml(h.watchDemo)}</a><p class="m-note">${escapeHtml(h.macNotePrefix)} <a href="/downloads/ScreenPrivacyBlurMac.dmg" data-install="macos" download>${escapeHtml(h.macDownload)}</a></p></div>${demoHtml(locale)}<dialog class="m-video-modal" data-video-modal aria-label="45s product demo"><div class="m-video-shell"><div class="m-video-bar"><strong>${escapeHtml(h.videoModalTitle)}</strong><button type="button" class="m-button m-secondary" data-video-close>${escapeHtml(h.closeModal)}</button></div><div class="m-video-frame" data-video-frame></div></div></dialog></section>`;
};

export const featuresHtml = (locale = 'en') => {
  const f = getCopy(locale).featuresSection;
  return `<section class="m-section m-wrap" id="features"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(f.kicker)}</span><h2>${escapeHtml(f.title)}</h2><p>${escapeHtml(f.subtitle)}</p></div><div class="m-grid m-three">${f.items.map(([icon,title,description]) => `<article class="m-card"><span class="m-icon" aria-hidden="true">${icon}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></article>`).join('')}</div></section>`;
};

export const modeMatrixHtml = (locale = 'en') => {
  const c = getCopy(locale).comparison;
  return `<div class="m-table-scroll m-matrix" tabindex="0" role="region" aria-label="Comparison of protection modes"><table class="m-table"><caption>${escapeHtml(c.matrixCaption)}</caption><thead><tr>${c.matrixHeaders.map(th => `<th scope="col">${escapeHtml(th)}</th>`).join('')}</tr></thead><tbody>${c.matrixRows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
};

export const comparisonHtml = (locale = 'en') => {
  const c = getCopy(locale).comparison;
  return `<section class="m-section m-wrap" id="blur-vs-replace"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(c.kicker)}</span><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.subtitle)}</p></div><div class="m-grid"><article class="m-card"><span class="m-kicker">${escapeHtml(c.card1Kicker)}</span><h3>${escapeHtml(c.card1Title)}</h3><div class="m-comparison-row"><span>${escapeHtml(c.card1EmailLabel)}</span><span class="m-blurred" aria-label="Blurred customer email">sarah.connor@acme-corp.io</span></div><div class="m-comparison-row"><span>${escapeHtml(c.card1BalanceLabel)}</span><span class="m-blurred" aria-label="Blurred balance">$124,589.00</span></div><p>${escapeHtml(c.card1Body)}</p></article><article class="m-card m-highlight"><span class="m-kicker">${escapeHtml(c.card2Kicker)}</span><h3>${escapeHtml(c.card2Title)}</h3><div class="m-comparison-row"><span>${escapeHtml(c.card1EmailLabel)}</span><span>demo.user@example-company.com</span></div><div class="m-comparison-row"><span>${escapeHtml(c.card1BalanceLabel)}</span><span>$45,000.00</span></div><p>${escapeHtml(c.card2Body)}</p></article></div>${modeMatrixHtml(locale)}<details class="m-safety" open><summary>${escapeHtml(c.safetyQuestion)}</summary><p>${escapeHtml(c.safetyP1)}</p><p>${escapeHtml(c.safetyP2)}</p></details></section>`;
};

export const pricingHtml = (locale = 'en') => {
  const p = getCopy(locale).pricing;
  const homePath = localizedPath('/', locale);
  return `<section class="m-section m-wrap" id="pricing"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(p.kicker)}</span><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.subtitle)}</p></div><div class="m-grid"><article class="m-card m-plan"><h3>${escapeHtml(p.freeTitle)}</h3><p class="m-price">$0 <small>${escapeHtml(p.freePriceSub)}</small></p><p class="m-note">${escapeHtml(p.freeNote)}</p>${bullets(p.freeBullets)}${installActionsHtml(homePath, 'pricing', p.freeCta)}</article><article class="m-card m-highlight m-plan"><span class="m-kicker">${escapeHtml(p.proKicker)}</span><h3>${escapeHtml(p.proTitle)}</h3><p class="m-price">$4 <small>${escapeHtml(p.proPriceSub)}</small></p><p class="m-note">${escapeHtml(p.proNote)}</p>${bullets(p.proBullets)}${installActionsHtml(homePath, 'pricing', p.proCta)}</article></div></section>`;
};

export const trustHtml = (locale = 'en') => {
  const t = getCopy(locale).trust;
  return `<section class="m-section m-wrap" id="privacy"><div class="m-card"><span class="m-kicker">${escapeHtml(t.kicker)}</span><h2>${escapeHtml(t.title)}</h2><div class="m-grid m-three"><article><h3>${escapeHtml(t.items[0][0])}</h3><p>${escapeHtml(t.items[0][1])}</p></article><article><h3>${escapeHtml(t.items[1][0])}</h3><p>${escapeHtml(t.items[1][1])}</p></article><article><h3>${escapeHtml(t.items[2][0])}</h3><p>${escapeHtml(t.items[2][1])}</p><a href="/permissions/">${escapeHtml(t.permissionsLink)}</a></article></div></div></section>`;
};

export const stepsHtml = (locale = 'en') => {
  const s = getCopy(locale).steps;
  const welcomeUrl = localizedPath('/welcome/', locale);
  return `<section class="m-section m-wrap" id="how-it-works"><div class="m-section-heading"><h2>${escapeHtml(s.title)}</h2></div><div class="m-grid m-three">${s.items.map(([kicker, title, desc]) => `<article class="m-card"><span class="m-kicker">${escapeHtml(kicker)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p></article>`).join('')}</div><div class="m-actions"><a class="m-button m-secondary" href="${welcomeUrl}">${escapeHtml(s.sandboxCta)}</a></div></section>`;
};

export const macDesktopHtml = (locale = 'en') => {
  const m = getCopy(locale).macDesktop;
  return `<section class="m-section m-wrap" id="mac-desktop"><div class="m-card"><span class="m-kicker">${escapeHtml(m.kicker)}</span><h2>${escapeHtml(m.title)}</h2><p>${escapeHtml(m.description)}</p><div class="m-grid m-three">${m.cards.map(([title, desc]) => `<article class="m-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p></article>`).join('')}</div><div class="m-actions"><a class="m-button" href="/downloads/ScreenPrivacyBlurMac.dmg" data-install="macos" data-placement="mac_section" download>${escapeHtml(m.downloadCta)}</a><span class="m-note">${escapeHtml(m.note)}</span></div></div></section>`;
};

export const finalCtaHtml = (path = '/', locale = localeFromPath(path)) => {
  const c = getCopy(locale).finalCta;
  return `<section class="m-section m-wrap" id="cta"><div class="m-card m-highlight m-cta-box"><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.description)}</p><div class="m-cta-actions">${installActionsHtml(path, 'footer')}</div><p class="m-note">${escapeHtml(c.note)}</p></div></section>`;
};

export const resourceLinksHtml = () => `<nav class="m-resource-links" aria-label="Comparisons and use cases">${seoPages.filter(p => p.group === 'Compare' || ['sales-demos-crm','developers-api-keys','stripe-fintech-dashboards'].some(slug => p.path.includes(slug))).map(p => `<a href="${p.path}">${p.title}</a>`).join('')}</nav>`;
export const welcomeRows = [
  [
    ['Sarah Connor', 'Maya Lin (Acme Demo)'],
    ['sarah.connor@acme-corp.io', 'maya.lin@example-corp.com'],
    ['+1 (415) 890-4321', '+1 (555) 019-2834'],
    ['4242 4242 4242 4242', '•••• •••• •••• 4242'],
    ['sk_live_98a7f6d5e4c3b2a1', 'sk_test_demo_••••••••••••'],
    ['$124,589.00', '$45,000.00'],
  ],
  [
    ['Alex Morgan', 'Jordan Taylor (Sample Co)'],
    ['alex.morgan@example.com', 'jordan.taylor@demo-client.io'],
    ['+1 (212) 555-0148', '+1 (555) 014-8820'],
    ['5555 5555 5555 4444', '•••• •••• •••• 4444'],
    ['sk_test_demo_sandbox_0123456789', 'sk_test_sandbox_••••••••'],
    ['$28,450.00', '$18,500.00'],
  ],
  [
    ['Jamie Rivera', 'Samira Patel (Northwind)'],
    ['jamie.rivera@example.org', 'samira.patel@northwind.example'],
    ['+44 7700 900123', '+44 1632 960123'],
    ['4000 0000 0000 0002', '•••• •••• •••• 0002'],
    ['api_key_demo_only_9876543210', 'pk_demo_only_••••••••••••'],
    ['$9,750.00', '$12,000.00'],
  ],
];
export const welcomeHtml = (locale = 'en') => {
  const copy = getCopy(locale);
  const w = copy.welcome;
  const h = copy.hero;
  const welcomePath = localizedPath('/welcome/', locale);
  const pricingPath = `${localizedPath('/', locale)}#pricing`;
  return `<section class="m-section m-wrap" data-sandbox data-demo-mode="original" data-role-preset="all"><span class="m-kicker">${escapeHtml(w.kicker)}</span><h1 class="m-welcome-title">${escapeHtml(w.title)}</h1><p class="m-lead">${escapeHtml(w.lead)}</p><div class="m-grid"><article class="m-card"><h2>${escapeHtml(w.step1Title)}</h2><div class="m-toolbar" role="img" aria-label="Chrome toolbar: click the puzzle piece Extensions icon, find Screen Privacy Blur, and click Pin"><div>Chrome toolbar <span>☆ &nbsp; 🧩 ← Click Extensions</span></div><div class="m-extension-menu"><strong>Extensions</strong><div>◇ Screen Privacy Blur <span>📌 Pin →</span></div></div></div><p>${w.step1BodyHtml}</p></article><article class="m-card"><h2>${escapeHtml(w.step2Title)}</h2><ol class="m-instructions">${w.step2ItemsHtml.map(item => `<li>${item}</li>`).join('')}</ol><p class="m-note">${escapeHtml(w.step2Note)}</p></article></div><section class="m-section"><h2>${escapeHtml(w.tableHeading)}</h2><p>${escapeHtml(w.tableSub)}</p><div class="m-sandbox-controls"><div class="m-tabs" role="group" aria-label="Sandbox privacy mode"><button type="button" data-mode="original" aria-pressed="true">${escapeHtml(h.tabOriginal)}</button><button type="button" data-mode="blur" aria-pressed="false">${escapeHtml(h.tabBlur)}</button><button type="button" data-mode="replace" aria-pressed="false">${escapeHtml(h.tabReplace)} <small>${escapeHtml(h.tabReplaceSub)}</small></button></div><div class="m-preset-bar" role="group" aria-label="Role preset scenario"><span class="m-note">${escapeHtml(w.presetLabel)}</span><button type="button" class="m-preset-chip" data-preset="all" aria-pressed="true">${escapeHtml(w.presetAll)}</button><button type="button" class="m-preset-chip" data-preset="sales" aria-pressed="false">${escapeHtml(w.presetSales)}</button><button type="button" class="m-preset-chip" data-preset="fintech" aria-pressed="false">${escapeHtml(w.presetFintech)}</button><button type="button" class="m-preset-chip" data-preset="dev" aria-pressed="false">${escapeHtml(w.presetDev)}</button></div><div class="m-demo-status" role="status">${escapeHtml(w.statusInitial)}</div></div><div class="m-table-scroll" tabindex="0" role="region" aria-label="Sandbox customer data"><table class="m-table"><caption>${escapeHtml(w.tableCaption)}</caption><thead><tr>${w.tableHeaders.map(th => `<th scope="col">${escapeHtml(th)}</th>`).join('')}</tr></thead><tbody>${welcomeRows.map(row => {
    const fields = ['sales', 'sales', 'sales', 'fintech', 'dev', 'fintech'];
    return `<tr>${row.map(([orig, repl], idx) => `<td data-field="${fields[idx]}" data-original="${orig}" data-replacement="${repl}">${orig}</td>`).join('')}</tr>`;
  }).join('')}</tbody></table></div></section><div class="m-actions">${installActionsHtml(welcomePath, 'hero', copy.pricing.freeCta)}<a class="m-button m-secondary" href="${pricingPath}">${escapeHtml(w.explorePricing)}</a><a class="m-text-link" href="/support/">${escapeHtml(w.contactSupport)}</a></div></section>`;
};

export const comparisonTableHtml = (page, locale = 'en') => {
  const isCompare = page?.group === 'Compare';
  const competitorName = page?.eyebrow?.replace(/\s+alternative$/i, '') || 'Typical Blur Extension';
  return `<section class="m-section"><h2>${isCompare ? `How Screen Privacy Blur compares to ${competitorName}` : 'Compare protection modes for this workflow'}</h2>${modeMatrixHtml(locale)}</section>`;
};

// Shared by the static production page and the React development view.
export function initializeDemo(root = document) {
  const win = root.ownerDocument?.defaultView || window;
  const cleanups = [];
  root.querySelectorAll('[data-demo-mode]').forEach(demo => {
    const buttons = [...demo.querySelectorAll('[data-mode]')];
    const presetButtons = [...demo.querySelectorAll('[data-preset]')];
    const applyState = (mode, preset = demo.dataset.rolePreset || 'all') => {
      demo.dataset.demoMode = mode;
      demo.dataset.rolePreset = preset;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.mode === mode)));
      presetButtons.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.preset === preset)));
      demo.querySelectorAll('[data-original]').forEach(value => {
        const matchesPreset = preset === 'all' || !value.dataset.field || value.dataset.field === preset;
        const activeMode = matchesPreset ? mode : 'original';
        value.textContent = activeMode === 'replace' ? value.dataset.replacement : value.dataset.original;
        value.classList.toggle('m-blurred', activeMode === 'blur');
        if (activeMode === 'blur') value.setAttribute('aria-label', 'Sensitive value blurred');
        else value.removeAttribute('aria-label');
      });
      const status = demo.querySelector('[role="status"]');
      if (status) {
        const presetLabel = preset === 'sales' ? ' (SaaS Sales Demo preset)' : preset === 'fintech' ? ' (FinTech / Stripe preset)' : preset === 'dev' ? ' (Dev / Streamer preset)' : '';
        status.textContent = mode === 'original' ? '⚠️ PII Exposed' : mode === 'blur' ? `🔒 Local Mask Active${presetLabel}` : `✨ Replaced with Mock Data — UI stays clean!${presetLabel}`;
      }
    };
    let timer = null;
    const stopCycle = () => {
      if (timer) {
        win.clearInterval(timer);
        timer = null;
      }
    };
    if (demo.id === 'interactive-demo' && !win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      const order = ['replace', 'original', 'blur'];
      timer = win.setInterval(() => {
        const next = order[(order.indexOf(demo.dataset.demoMode) + 1) % order.length];
        applyState(next);
      }, 3500);
    }
    const onClick = (event) => {
      const modeBtn = event.target.closest('[data-mode]');
      if (modeBtn && demo.contains(modeBtn)) {
        stopCycle();
        applyState(modeBtn.dataset.mode, demo.dataset.rolePreset || 'all');
        return;
      }
      const presetBtn = event.target.closest('[data-preset]');
      if (presetBtn && demo.contains(presetBtn)) {
        stopCycle();
        const nextMode = demo.dataset.demoMode === 'original' ? 'replace' : demo.dataset.demoMode;
        applyState(nextMode, presetBtn.dataset.preset);
      }
    };
    demo.addEventListener('click', onClick);
    cleanups.push(() => {
      stopCycle();
      demo.removeEventListener('click', onClick);
    });
  });

  const modal = root.querySelector('[data-video-modal]');
  const openBtn = root.querySelector('[data-video-open]');
  if (modal && openBtn && typeof modal.showModal === 'function') {
    const frame = modal.querySelector('[data-video-frame]');
    const close = () => {
      if (frame) frame.innerHTML = '';
      if (modal.open) modal.close();
    };
    const onOpen = (event) => {
      event.preventDefault();
      if (frame) {
        frame.innerHTML = '<iframe src="/tutorial-player.html" title="Screen Privacy Blur 45s Demo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>';
      }
      modal.showModal();
    };
    const onModalClick = (event) => {
      if (event.target === modal || event.target.closest('[data-video-close]')) close();
    };
    openBtn.addEventListener('click', onOpen);
    modal.addEventListener('click', onModalClick);
    modal.addEventListener('close', close);
    cleanups.push(() => {
      openBtn.removeEventListener('click', onOpen);
      modal.removeEventListener('click', onModalClick);
      modal.removeEventListener('close', close);
    });
  }

  return () => cleanups.forEach(fn => fn());
}

export const compatibilityHtml = (locale = 'en') => {
  const c = getCopy(locale).compatibility;
  return `<section class="m-wrap m-compatibility" aria-label="Platform compatibility"><p>${escapeHtml(c.heading)}</p><div>Zoom <span>•</span> Google Meet <span>•</span> Loom <span>•</span> Microsoft Teams <span>•</span> OBS Studio <span>•</span> Stripe <span>•</span> HubSpot <span>•</span> AWS Console</div><p class="m-note">${escapeHtml(c.note)}</p></section>`;
};
// Verbatim excerpts verified against Chrome Web Store reviews on October 13, 2026.
export const reviewsHtml = (locale = 'en') => {
  const r = getCopy(locale).reviews;
  return `<section class="m-section m-wrap" id="reviews"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(r.kicker)}</span><h2>${escapeHtml(r.title)}</h2><a class="m-rating" href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${r.ratingBadge}</a></div><div class="m-grid m-three"><figure class="m-card m-review"><blockquote>“Excellent extension! Screen Privacy Blur makes it incredibly easy to protect sensitive information during screen sharing and presentations. Simple, lightweight, and works exactly as expected.”</blockquote><figcaption><strong>Kate Litlonn</strong><span>June 11, 2026 · Chrome Web Store</span><a href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.readReview)}</a></figcaption></figure><figure class="m-card m-review"><blockquote>“I use that all the time when I’m sharing my screen, and it’s honestly could be a lifesaver. It’s very easy to turn on, and in a couple of seconds you can hide anything you don’t want others to see”</blockquote><figcaption><strong>EMILIANO CHEHIN</strong><span>December 17, 2025 · Chrome Web Store</span><a href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.readReview)}</a></figcaption></figure><figure class="m-card m-review"><blockquote>“It's a great tool, but I would like to see automatically blurred confidential blocks”</blockquote><figcaption><strong>Karina Noa</strong><span>December 22, 2025 · Chrome Web Store · Inspired Smart Auto-Blur Pro</span><a href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.readReview)}</a></figcaption></figure></div><p class="m-note">${escapeHtml(r.note)}</p></section>`;
};
