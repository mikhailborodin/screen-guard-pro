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
const conversionMessagesByLocale = {
  en: {
    mobileCaption: 'Save this link and install on your desktop browser. No signup required.',
    nonChromiumCaption: 'Install on desktop Chrome, Brave, Edge, Arc, or another Chromium browser.',
    copiedStatus: 'Link copied! Open it on your desktop browser',
    copyFallbackStatus: 'Copy the link below and open it on your desktop browser.',
    sharedStatus: 'Shared! Open the link on your desktop browser.',
  },
  de: {
    mobileCaption: 'Speichern Sie diesen Link für Ihren Desktop-Browser. Keine Anmeldung erforderlich.',
    nonChromiumCaption: 'Installieren Sie die Erweiterung auf dem Desktop in Chrome, Brave, Edge oder Arc.',
    copiedStatus: 'Link kopiert! Öffnen Sie ihn im Desktop-Browser',
    copyFallbackStatus: 'Kopieren Sie den Link unten und öffnen Sie ihn im Desktop-Browser.',
    sharedStatus: 'Geteilt! Öffnen Sie den Link in Ihrem Desktop-Browser.',
  },
  es: {
    mobileCaption: 'Guarda este enlace e instálalo en tu navegador de escritorio. Sin registro.',
    nonChromiumCaption: 'Instálalo en Chrome, Brave, Edge, Arc u otro navegador Chromium de escritorio.',
    copiedStatus: '¡Enlace copiado! Ábrelo en tu navegador de escritorio',
    copyFallbackStatus: 'Copia el enlace de abajo y ábrelo en tu navegador de escritorio.',
    sharedStatus: '¡Compartido! Abre el enlace en tu navegador de escritorio.',
  },
  'pt-br': {
    mobileCaption: 'Salve este link e instale no navegador do computador. Sem cadastro.',
    nonChromiumCaption: 'Instale no Chrome, Brave, Edge, Arc ou outro navegador Chromium no computador.',
    copiedStatus: 'Link copiado! Abra no navegador do seu computador',
    copyFallbackStatus: 'Copie o link abaixo e abra no navegador do seu computador.',
    sharedStatus: 'Compartilhado! Abra o link no navegador do seu computador.',
  },
  fr: {
    mobileCaption: 'Enregistrez ce lien pour l’installer sur votre navigateur de bureau. Sans inscription.',
    nonChromiumCaption: 'Installez sur Chrome, Brave, Edge, Arc ou un autre navigateur Chromium sur ordinateur.',
    copiedStatus: 'Lien copié ! Ouvrez-le sur votre ordinateur',
    copyFallbackStatus: 'Copiez le lien ci-dessous et ouvrez-le sur votre ordinateur.',
    sharedStatus: 'Partagé ! Ouvrez le lien sur votre navigateur de bureau.',
  },
  it: {
    mobileCaption: 'Salva questo link e installalo sul browser del computer. Nessuna registrazione.',
    nonChromiumCaption: 'Installa su Chrome, Brave, Edge, Arc o un altro browser Chromium per desktop.',
    copiedStatus: 'Link copiato! Aprilo sul browser del computer',
    copyFallbackStatus: 'Copia il link qui sotto e aprilo sul browser del computer.',
    sharedStatus: 'Condiviso! Apri il link sul browser del computer.',
  },
  nl: {
    mobileCaption: 'Bewaar deze link en installeer op uw desktopbrowser. Geen account nodig.',
    nonChromiumCaption: 'Installeer op desktop in Chrome, Brave, Edge, Arc of een andere Chromium-browser.',
    copiedStatus: 'Link gekopieerd! Open deze op uw desktopbrowser',
    copyFallbackStatus: 'Kopieer de onderstaande link en open deze op uw desktopbrowser.',
    sharedStatus: 'Gedeeld! Open de link op uw desktopbrowser.',
  },
  pl: {
    mobileCaption: 'Zapisz ten link i zainstaluj w przeglądarce na komputerze. Bez rejestracji.',
    nonChromiumCaption: 'Zainstaluj na komputerze w przeglądarce Chrome, Brave, Edge lub Arc.',
    copiedStatus: 'Link skopiowany! Otwórz go na komputerze',
    copyFallbackStatus: 'Skopiuj poniższy link i otwórz go w przeglądarce na komputerze.',
    sharedStatus: 'Udostępniono! Otwórz link w przeglądarce na komputerze.',
  },
  ru: {
    mobileCaption: 'Сохраните ссылку и установите расширение в браузере на компьютере. Без регистрации.',
    nonChromiumCaption: 'Установите на компьютере в Chrome, Brave, Edge, Arc или другом Chromium-браузере.',
    copiedStatus: 'Ссылка скопирована! Откройте её на компьютере',
    copyFallbackStatus: 'Скопируйте ссылку ниже и откройте её в браузере на компьютере.',
    sharedStatus: 'Отправлено! Откройте ссылку в браузере на компьютере.',
  },
  tr: {
    mobileCaption: 'Bu bağlantıyı kaydedin ve masaüstü tarayıcınıza kurun. Kayıt gerekmez.',
    nonChromiumCaption: 'Masaüstünde Chrome, Brave, Edge, Arc veya başka bir Chromium tarayıcısına kurun.',
    copiedStatus: 'Bağlantı kopyalandı! Masaüstü tarayıcınızda açın',
    copyFallbackStatus: 'Aşağıdaki bağlantıyı kopyalayın ve masaüstü tarayıcınızda açın.',
    sharedStatus: 'Paylaşıldı! Bağlantıyı masaüstü tarayıcınızda açın.',
  },
  ja: {
    mobileCaption: 'このリンクを保存し、PCのブラウザからインストールしてください（登録不要）。',
    nonChromiumCaption: 'PC版の Chrome、Brave、Edge、Arc などの Chromium ブラウザでインストールしてください。',
    copiedStatus: 'リンクをコピーしました！PCのブラウザで開いてください',
    copyFallbackStatus: '以下のリンクをコピーして、PCのブラウザで開いてください。',
    sharedStatus: '共有しました！PCのブラウザでリンクを開いてください。',
  },
  ko: {
    mobileCaption: '이 링크를 저장한 뒤 데스크톱 브라우저에서 설치하세요. 가입이 필요 없습니다.',
    nonChromiumCaption: '데스크톱 Chrome, Brave, Edge, Arc 등 Chromium 브라우저에서 설치하세요.',
    copiedStatus: '링크가 복사되었습니다! 데스크톱 브라우저에서 여세요',
    copyFallbackStatus: '아래 링크를 복사하여 데스크톱 브라우저에서 여세요.',
    sharedStatus: '공유됨! 데스크톱 브라우저에서 링크를 여세요.',
  },
  'zh-cn': {
    mobileCaption: '保存此链接并在电脑浏览器上安装。无需注册。',
    nonChromiumCaption: '请在电脑端 Chrome、Brave、Edge、Arc 或其他 Chromium 浏览器上安装。',
    copiedStatus: '链接已复制！请在电脑浏览器中打开',
    copyFallbackStatus: '请复制下方链接并在电脑浏览器中打开。',
    sharedStatus: '已分享！请在电脑浏览器中打开该链接。',
  },
  'zh-tw': {
    mobileCaption: '儲存此連結並在電腦瀏覽器上安裝。免註冊。',
    nonChromiumCaption: '請在電腦版 Chrome、Brave、Edge、Arc 或其他 Chromium 瀏覽器上安裝。',
    copiedStatus: '連結已複製！請在電腦瀏覽器中開啟',
    copyFallbackStatus: '請複製下方連結並在電腦瀏覽器中開啟。',
    sharedStatus: '已分享！請在電腦瀏覽器中開啟此連結。',
  },
  hi: {
    mobileCaption: 'इस लिंक को सेव करें और अपने डेस्कटॉप ब्राउज़र पर इंस्टॉल करें। साइनअप की आवश्यकता नहीं।',
    nonChromiumCaption: 'डेस्कटॉप Chrome, Brave, Edge, Arc या किसी अन्य Chromium ब्राउज़र पर इंस्टॉल करें।',
    copiedStatus: 'लिंक कॉपी हो गया! इसे अपने डेस्कटॉप ब्राउज़र पर खोलें',
    copyFallbackStatus: 'नीचे दिया गया लिंक कॉपी करें और अपने डेस्कटॉप ब्राउज़र पर खोलें।',
    sharedStatus: 'शेयर किया गया! अपने डेस्कटॉप ब्राउज़र पर लिंक खोलें।',
  },
  id: {
    mobileCaption: 'Simpan tautan ini dan instal di browser desktop Anda. Tanpa daftar.',
    nonChromiumCaption: 'Instal di Chrome, Brave, Edge, Arc, atau browser Chromium desktop lainnya.',
    copiedStatus: 'Tautan disalin! Buka di browser desktop Anda',
    copyFallbackStatus: 'Salin tautan di bawah dan buka di browser desktop Anda.',
    sharedStatus: 'Dibagikan! Buka tautan di browser desktop Anda.',
  },
};

export function installActionsHtml(path = '/', placement = 'hero', label) {
  const locale = localeFromPath(path);
  const copy = getCopy(locale).conversion;
  const msg = conversionMessagesByLocale[locale] || conversionMessagesByLocale.en;
  const ctaLabel = label ?? copy.addToChromeFree;
  return `<div class="m-install-controls" data-install-controls data-browser-caption-default="${escapeHtml(copy.browserCaption)}" data-caption-mobile="${escapeHtml(msg.mobileCaption)}" data-caption-non-chromium="${escapeHtml(msg.nonChromiumCaption)}" data-status-copied="${escapeHtml(msg.copiedStatus)}" data-status-copy-fallback="${escapeHtml(msg.copyFallbackStatus)}" data-status-shared="${escapeHtml(msg.sharedStatus)}">
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
      const mobileCaption = control.dataset.captionMobile || 'Save this link and install on your desktop browser. No signup required.';
      const nonChromiumCaption = control.dataset.captionNonChromium || 'Install on desktop Chrome, Brave, Edge, Arc, or another Chromium browser.';
      control.querySelector('[data-browser-caption]').textContent = mobile ? mobileCaption : chromium ? defaultCaption : nonChromiumCaption;
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
      status.textContent = control.dataset.statusCopied || 'Link copied! Open it on your desktop browser';
    } catch {
      const fallback = control.querySelector('.m-manual-copy');
      fallback.hidden = false;
      const input = fallback.querySelector('input');
      input.value = url;
      input.focus();
      input.select();
      status.textContent = control.dataset.statusCopyFallback || 'Copy the link below and open it on your desktop browser.';
    }
  };
  const onClick = async (event) => {
    const button = event.target.closest('[data-copy-desktop], [data-share-desktop]');
    if (!button || !root.contains(button)) return;
    const control = button.closest('[data-install-controls]');
    if (button.hasAttribute('data-copy-desktop') || typeof nav.share !== 'function') { await copy(control); return; }
    try {
      await nav.share({title:'Screen Privacy Blur — install on desktop', text:'Save this desktop install link for your next screen share.', url:control.querySelector('[data-desktop-install]').href});
      control.querySelector('[data-install-status]').textContent = control.dataset.statusShared || 'Shared! Open the link on your desktop browser.';
    } catch (error) {
      if (error.name !== 'AbortError') await copy(control);
    }
  };
  root.addEventListener('click', onClick);
  return () => { media.removeEventListener('change', update); root.removeEventListener('click', onClick); };
}
