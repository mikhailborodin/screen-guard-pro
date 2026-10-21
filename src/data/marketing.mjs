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

const demoStatusByLocale = {
  en: { original: '⚠️ PII Exposed', blur: '🔒 Local Mask Active' },
  de: { original: '⚠️ Personenbezogene Daten sichtbar', blur: '🔒 Lokale Maske aktiv' },
  es: { original: '⚠️ Datos personales expuestos', blur: '🔒 Máscara local activa' },
  'pt-br': { original: '⚠️ Dados pessoais expostos', blur: '🔒 Máscara local ativa' },
  fr: { original: '⚠️ Données personnelles exposées', blur: '🔒 Masque local actif' },
  it: { original: '⚠️ Dati personali esposti', blur: '🔒 Maschera locale attiva' },
  nl: { original: '⚠️ Persoonsgegevens zichtbaar', blur: '🔒 Lokaal masker actief' },
  pl: { original: '⚠️ Dane osobowe odsłonięte', blur: '🔒 Lokalna maska aktywna' },
  ru: { original: '⚠️ Персональные данные открыты', blur: '🔒 Локальная маска активна' },
  tr: { original: '⚠️ Kişisel veriler açıkta', blur: '🔒 Yerel maske etkin' },
  ja: { original: '⚠️ 個人情報が露出しています', blur: '🔒 ローカルマスク有効' },
  ko: { original: '⚠️ 개인정보 노출됨', blur: '🔒 로컬 마스크 활성화됨' },
  'zh-cn': { original: '⚠️ 敏感数据已暴露', blur: '🔒 本地遮罩已激活' },
  'zh-tw': { original: '⚠️ 敏感資料已外露', blur: '🔒 本機遮罩已啟用' },
  hi: { original: '⚠️ संवेदनशील डेटा खुला है', blur: '🔒 लोकल मास्क सक्रिय' },
  id: { original: '⚠️ Data pribadi terekspos', blur: '🔒 Masker lokal aktif' },
};

export const demoHtml = (locale = 'en') => {
  const h = getCopy(locale).hero;
  const st = demoStatusByLocale[locale] || demoStatusByLocale.en;
  const rows = demoRows.map(([label, original, replacement], idx) => [h.demoLabels?.[idx] || label, original, replacement]);
  return `<div id="interactive-demo" class="m-demo" data-demo-mode="replace" data-status-original="${escapeHtml(st.original)}" data-status-blur="${escapeHtml(st.blur)}" data-status-replace="${escapeHtml(h.statusReplaced)}">
  <div class="m-browser"><span aria-hidden="true">● ● ●</span><span>⌑ secure-bank.com/dashboard</span></div>
  <div class="m-tabs" role="group" aria-label="Dashboard privacy mode">
    <button type="button" data-mode="original" aria-pressed="false">${escapeHtml(h.tabOriginal)}</button>
    <button type="button" data-mode="blur" aria-pressed="false">${escapeHtml(h.tabBlur)}</button>
    <button type="button" data-mode="replace" aria-pressed="true">${escapeHtml(h.tabReplace)} <small>${escapeHtml(h.tabReplaceSub)}</small></button>
  </div>
  <div class="m-dashboard"><div class="m-dashboard-heading"><div><small>${escapeHtml(h.dashboardKicker)}</small><div class="m-dashboard-title">${escapeHtml(h.dashboardTitle)}</div></div><span class="m-avatar" aria-hidden="true">SC</span></div>
  <div class="m-demo-status" role="status">${escapeHtml(h.statusReplaced)}</div>
  <dl>${rows.map(([label, original, replacement]) => `<div class="m-data-row"><dt>${escapeHtml(label)}</dt><dd data-original="${original}" data-replacement="${replacement}">${replacement}</dd></div>`).join('')}</dl>
  <p class="m-note">${escapeHtml(h.demoNote)}</p></div></div>`;
};

export const heroHtml = (locale = 'en') => {
  const h = getCopy(locale).hero;
  const homePath = localizedPath('/', locale);
  return `<section class="m-hero m-wrap"><div><a class="m-badge" href="${reviewsUrl}">${escapeHtml(h.badge)}</a><h1>${escapeHtml(h.title)}</h1><p class="m-lead">${escapeHtml(h.description)}</p><div class="m-actions">${installActionsHtml(homePath, 'hero')}<a class="m-button m-secondary" href="#interactive-demo">${escapeHtml(h.tryDemo)}</a></div><p class="m-note">${escapeHtml(h.note)} — ${escapeHtml(h.title)}.</p><a class="m-text-link" href="https://www.youtube.com/watch?v=g2E4lR6M8Zc" data-video-open target="_blank" rel="noopener noreferrer">${escapeHtml(h.watchDemo)}</a><p class="m-note">${escapeHtml(h.macNotePrefix)} <a href="/downloads/ScreenPrivacyBlurMac.dmg" data-install="macos" download>${escapeHtml(h.macDownload)}</a></p></div>${demoHtml(locale)}<dialog class="m-video-modal" data-video-modal aria-label="45s product demo"><div class="m-video-shell"><div class="m-video-bar"><strong>${escapeHtml(h.videoModalTitle)}</strong><button type="button" class="m-button m-secondary" data-video-close>${escapeHtml(h.closeModal)}</button></div><div class="m-video-frame" data-video-frame></div></div></dialog></section>`;
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
  return `<section class="m-section m-wrap" id="blur-vs-replace"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(c.kicker)}</span><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.subtitle)}</p></div><div class="m-grid"><article class="m-card"><span class="m-kicker">${escapeHtml(c.card1Kicker)}</span><div class="m-card-title">${escapeHtml(c.card1Title)}</div><div class="m-comparison-row"><span>${escapeHtml(c.card1EmailLabel)}</span><span class="m-blurred" aria-label="Blurred customer email">sarah.connor@acme-corp.io</span></div><div class="m-comparison-row"><span>${escapeHtml(c.card1BalanceLabel)}</span><span class="m-blurred" aria-label="Blurred balance">$124,589.00</span></div><p>${escapeHtml(c.card1Body)}</p></article><article class="m-card m-highlight"><span class="m-kicker">${escapeHtml(c.card2Kicker)}</span><div class="m-card-title">${escapeHtml(c.card2Title)}</div><div class="m-comparison-row"><span>${escapeHtml(c.card1EmailLabel)}</span><span>demo.user@example-company.com</span></div><div class="m-comparison-row"><span>${escapeHtml(c.card1BalanceLabel)}</span><span>$45,000.00</span></div><p>${escapeHtml(c.card2Body)}</p></article></div>${modeMatrixHtml(locale)}<details class="m-safety" open><summary>${escapeHtml(c.safetyQuestion)}</summary><p>${escapeHtml(c.safetyP1)}</p><p>${escapeHtml(c.safetyP2)}</p></details></section>`;
};

export const pricingHtml = (locale = 'en') => {
  const p = getCopy(locale).pricing;
  const homePath = localizedPath('/', locale);
  return `<section class="m-section m-wrap" id="pricing"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(p.kicker)}</span><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.subtitle)}</p></div><div class="m-grid"><article class="m-card m-plan"><div class="m-card-title">${escapeHtml(p.freeTitle)}</div><p class="m-price">$0 <small>${escapeHtml(p.freePriceSub)}</small></p><p class="m-note">${escapeHtml(p.freeNote)}</p>${bullets(p.freeBullets)}${installActionsHtml(homePath, 'pricing', p.freeCta)}</article><article class="m-card m-highlight m-plan"><span class="m-kicker">${escapeHtml(p.proKicker)}</span><div class="m-card-title">${escapeHtml(p.proTitle)}</div><p class="m-price">$4 <small>${escapeHtml(p.proPriceSub)}</small></p><p class="m-note">${escapeHtml(p.proNote)}</p>${bullets(p.proBullets)}${installActionsHtml(homePath, 'pricing', p.proCta)}</article></div></section>`;
};

export const trustHtml = (locale = 'en') => {
  const t = getCopy(locale).trust;
  return `<section class="m-section m-wrap" id="privacy"><div class="m-card"><span class="m-kicker">${escapeHtml(t.kicker)}</span><h2>${escapeHtml(t.title)}</h2><div class="m-grid m-three"><article><div class="m-card-title">${escapeHtml(t.items[0][0])}</div><p>${escapeHtml(t.items[0][1])}</p></article><article><div class="m-card-title">${escapeHtml(t.items[1][0])}</div><p>${escapeHtml(t.items[1][1])}</p></article><article><div class="m-card-title">${escapeHtml(t.items[2][0])}</div><p>${escapeHtml(t.items[2][1])}</p><a href="/permissions/">${escapeHtml(t.permissionsLink)}</a></article></div></div></section>`;
};

export const stepsHtml = (locale = 'en') => {
  const s = getCopy(locale).steps;
  const welcomeUrl = localizedPath('/welcome/', locale);
  return `<section class="m-section m-wrap" id="how-it-works"><div class="m-section-heading"><h2>${escapeHtml(s.title)}</h2></div><div class="m-grid m-three">${s.items.map(([kicker, title, desc]) => `<article class="m-card"><span class="m-kicker">${escapeHtml(kicker)}</span><div class="m-card-title">${escapeHtml(title)}</div><p>${escapeHtml(desc)}</p></article>`).join('')}</div><div class="m-actions"><a class="m-button m-secondary" href="${welcomeUrl}">${escapeHtml(s.sandboxCta)}</a></div></section>`;
};

export const macDesktopHtml = (locale = 'en') => {
  const m = getCopy(locale).macDesktop;
  return `<section class="m-section m-wrap" id="mac-desktop"><div class="m-card"><span class="m-kicker">${escapeHtml(m.kicker)}</span><h2>${escapeHtml(m.title)}</h2><p>${escapeHtml(m.description)}</p><div class="m-grid m-three">${m.cards.map(([title, desc]) => `<article class="m-card"><div class="m-card-title">${escapeHtml(title)}</div><p>${escapeHtml(desc)}</p></article>`).join('')}</div><div class="m-actions"><a class="m-button" href="/downloads/ScreenPrivacyBlurMac.dmg" data-install="macos" data-placement="mac_section" download>${escapeHtml(m.downloadCta)}</a><span class="m-note">${escapeHtml(m.note)}</span></div></div></section>`;
};

export const finalCtaHtml = (path = '/', locale = localeFromPath(path)) => {
  const c = getCopy(locale).finalCta;
  return `<section class="m-section m-wrap" id="cta"><div class="m-card m-highlight m-cta-box"><h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.description)}</p><div class="m-cta-actions">${installActionsHtml(path, 'footer')}</div><p class="m-note">${escapeHtml(c.note)}</p></div></section>`;
};

export const resourceLinksHtml = () => `<nav class="m-resource-links" aria-label="Comparisons and use cases">${seoPages.filter(p => p.group !== 'Trust').map(p => `<a href="${p.path}">${p.title}</a>`).join('')}</nav>`;
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

const welcomeGuideByLocale = {
  en: 'This interactive sandbox lets you test Screen Privacy Blur in 10 seconds before joining a live Zoom, Google Meet, Microsoft Teams, or Loom call. Switch between Original, Smart Auto-Blur, and Auto-Replace modes, or filter by role presets to verify how customer emails, phone numbers, credit cards, API keys, and revenue balances are protected locally inside Chrome.',
  de: 'In dieser interaktiven Datenschutz-Sandbox können Sie Screen Privacy Blur in 10 Sekunden testen, bevor Sie Ihren Bildschirm in Zoom, Google Meet, Microsoft Teams oder Loom teilen. Wechseln Sie zwischen Original, Smart Auto-Blur und Auto-Replace oder wählen Sie ein Rollenprofil für CRM-, FinTech- und Entwickler-Workflows.',
  es: '¡Bienvenido! Este sandbox interactivo de privacidad te permite probar Screen Privacy Blur aquí mismo en 10 segundos antes de compartir pantalla en Zoom, Google Meet, Microsoft Teams o Loom. Alterna entre los modos Original, Smart Auto-Blur y Auto-Replace para verificar cómo se protegen localmente los correos, teléfonos, tarjetas y claves API.',
  'pt-br': 'Bem-vindo! Este sandbox interativo de privacidade permite que você teste o Screen Privacy Blur aqui mesmo em 10 segundos antes de compartilhar sua tela no Zoom, Google Meet, Microsoft Teams ou Loom. Alterne entre os modos Original, Smart Auto-Blur e Auto-Replace para ocultar ou substituir e-mails, telefones, cartões e chaves de API localmente.',
  fr: 'Bienvenue ! Ce bac à sable interactif de confidentialité vous permet de tester Screen Privacy Blur ici en 10 secondes avant de partager votre écran sur Zoom, Google Meet, Microsoft Teams ou Loom. Testez-le avec les modes Original, Smart Auto-Blur et Auto-Replace pour masquer ou remplacer localement vos e-mails, téléphones et clés API.',
  it: 'Benvenuto! Questa sandbox interattiva ti permette di testare Screen Privacy Blur: provalo qui in 10 secondi prima di condividere lo schermo su Zoom, Google Meet, Microsoft Teams o Loom. Confronta le modalità Originale, Smart Auto-Blur e Auto-Replace su dati clienti, carte di credito, chiavi API e saldi direttamente nel browser.',
  nl: 'Welkom! Met deze interactieve sandbox kunt u Screen Privacy Blur hier in 10 seconden testen voordat u uw scherm deelt in Zoom, Google Meet, Microsoft Teams of Loom. Schakel tussen Origineel, Smart Auto-Blur en Auto-Replace om te zien hoe e-mailadressen, telefoonnummers, API-sleutels en saldi lokaal in uw browser worden afgeschermd.',
  pl: 'Witamy! Ta interaktywna piaskownica prywatności pozwala przetestować Screen Privacy Blur tutaj w 10 sekund przed udostępnieniem ekranu na Zoom, Google Meet, Microsoft Teams lub Loom. Przełączaj między trybami Oryginał, Smart Auto-Blur oraz Auto-Replace, aby sprawdzić lokalne ukrywanie i podmianę adresów e-mail, telefonów oraz kluczy API.',
  ru: 'Добро пожаловать! Эта интерактивная песочница приватности позволяет протестировать Screen Privacy Blur прямо здесь за 10 секунд перед демонстрацией экрана в Zoom, Google Meet, Microsoft Teams или Loom. Переключайтесь между режимами «Оригинал», Smart Auto-Blur и «Автозамена», чтобы проверить локальную защиту email, телефонов и API-ключей.',
  tr: 'Screen Privacy Blur’a Hoş Geldiniz! Bu etkileşimli gizlilik sandbox’ı, Zoom, Google Meet, Microsoft Teams veya Loom’da ekran paylaşmadan önce uzantıyı hemen burada 10 saniyede test etmenizi sağlar. E-postaların, telefonların, kartların ve API anahtarlarının yerel olarak nasıl korunduğunu görmek için modlar arasında geçiş yapın.',
  ja: 'Screen Privacy Blurへようこそ！このインタラクティブなプライバシーサンドボックスでは、Zoom、Google Meet、Microsoft Teams、Loomで画面共有や録画を始める前に、ここで10秒でテストできます。上部のボタンから「オリジナル」「スマート自動ぼかし」「自動置換」の各モードや職種別プリセットを切り替えて、顧客のメールアドレス、電話番号、クレジットカード番号、APIキー、売上残高がブラウザ内でローカルに保護される様子を今すぐ確認してください。',
  ko: 'Screen Privacy Blur에 오신 것을 환영합니다! 이 인터랙티브 프라이버시 샌드박스에서는 Zoom, Google Meet, Microsoft Teams, Loom에서 화면을 공유하거나 녹화하기 전에 여기서 10초 만에 테스트해 보세요. 원본, 스마트 자동 블러, 자동 대체 모드와 직무별 프리셋을 클릭하여 고객 이메일, 전화번호, 테스트 신용카드, API 키, 매출 데이터가 브라우저 내부에서 안전하게 보호되는지 직접 확인할 수 있습니다.',
  'zh-cn': '欢迎使用 Screen Privacy Blur！在这个交互式隐私测试沙盒中，只需 10 秒即可在此页面直接测试扩展程序的所有保护模式，然后再在 Zoom、Google Meet、Microsoft Teams 或 Loom 中共享屏幕。点击下方的原始画面、智能自动模糊或自动替换按钮，并切换销售 CRM、金融科技或开发者预设，即可实时预览客户邮箱、电话号码、测试银行卡、API 密钥和账户余额在浏览器本地的脱敏与仿真数据替换效果。',
  'zh-tw': '歡迎使用 Screen Privacy Blur！在這個互動式隱私沙盒中，在這裡花 10 秒立即測試所有保護模式，然後再於 Zoom、Google Meet、Microsoft Teams 或 Loom 分享螢幕。透過切換原始畫面、智慧自動模糊與自動替換模式，以及銷售 CRM、金融科技與開發者角色預設，您可以直接在瀏覽器本機預覽客戶信箱、電話號碼、測試信用卡、API 金鑰與營收數據的遮蔽與模擬資料替換效果。',
  hi: 'Screen Privacy Blur में आपका स्वागत है! इस इंटरैक्टिव गोपनीयता सैंडबॉक्स में आप Zoom, Google Meet, Microsoft Teams या Loom पर स्क्रीन साझा करने से पहले यहाँ 10 सेकंड में इसका परीक्षण करें। ओरिजिनल, Smart Auto-Blur और Auto-Replace मोड पर क्लिक करके देखें कि ईमेल, फ़ोन नंबर, कार्ड और API कुंजियाँ ब्राउज़र में लोकल रूप से कैसे सुरक्षित रहती हैं।',
  id: 'Selamat datang di Screen Privacy Blur! Sandbox privasi interaktif ini memungkinkan Anda uji langsung di sini dalam 10 detik sebelum membagikan layar di Zoom, Google Meet, Microsoft Teams, atau Loom. Beralih antara mode Asli, Smart Auto-Blur, dan Auto-Replace untuk melihat perlindungan lokal pada email, nomor telepon, kartu kredit, dan kunci API.',
};

export const welcomeHtml = (locale = 'en') => {
  const copy = getCopy(locale);
  const w = copy.welcome;
  const h = copy.hero;
  const st = demoStatusByLocale[locale] || demoStatusByLocale.en;
  const welcomePath = localizedPath('/welcome/', locale);
  const pricingPath = `${localizedPath('/', locale)}#pricing`;
  const extraGuide = welcomeGuideByLocale[locale] || welcomeGuideByLocale.en;
  return `<section class="m-section m-wrap" data-sandbox data-demo-mode="original" data-role-preset="all" data-status-original="${escapeHtml(st.original)}" data-status-blur="${escapeHtml(st.blur)}" data-status-replace="${escapeHtml(h.statusReplaced)}"><span class="m-kicker">${escapeHtml(w.kicker)}</span><h1 class="m-welcome-title">${escapeHtml(w.title)}</h1><p class="m-lead">${escapeHtml(w.lead)} ${escapeHtml(extraGuide)}</p><div class="m-grid"><article class="m-card"><h2>${escapeHtml(w.step1Title)}</h2><div class="m-toolbar" role="img" aria-label="Chrome toolbar: click the puzzle piece Extensions icon, find Screen Privacy Blur, and click Pin"><div>Chrome toolbar <span>☆ &nbsp; 🧩 ← Click Extensions</span></div><div class="m-extension-menu"><strong>Extensions</strong><div><span style="display:inline-flex;align-items:center;gap:6px"><img src="/app-icon.png?v=20261021" width="16" height="16" alt="Screen Privacy Blur extension icon" style="border-radius:4px" /> Screen Privacy Blur</span> <span>📌 Pin →</span></div></div></div><p>${w.step1BodyHtml}</p></article><article class="m-card"><h2>${escapeHtml(w.step2Title)}</h2><ol class="m-instructions">${w.step2ItemsHtml.map(item => `<li>${item}</li>`).join('')}</ol><p class="m-note">${escapeHtml(w.step2Note)} — ${escapeHtml(w.title)} (${escapeHtml(w.metaTitle)}).</p></article></div><section class="m-section"><h2>${escapeHtml(w.tableHeading)}</h2><p>${escapeHtml(w.tableSub)}</p><div class="m-sandbox-controls"><div class="m-tabs" role="group" aria-label="Sandbox privacy mode"><button type="button" data-mode="original" aria-pressed="true">${escapeHtml(h.tabOriginal)}</button><button type="button" data-mode="blur" aria-pressed="false">${escapeHtml(h.tabBlur)}</button><button type="button" data-mode="replace" aria-pressed="false">${escapeHtml(h.tabReplace)} <small>${escapeHtml(h.tabReplaceSub)}</small></button></div><div class="m-preset-bar" role="group" aria-label="Role preset scenario"><span class="m-note">${escapeHtml(w.presetLabel)}</span><button type="button" class="m-preset-chip" data-preset="all" aria-pressed="true">${escapeHtml(w.presetAll)}</button><button type="button" class="m-preset-chip" data-preset="sales" aria-pressed="false">${escapeHtml(w.presetSales)}</button><button type="button" class="m-preset-chip" data-preset="fintech" aria-pressed="false">${escapeHtml(w.presetFintech)}</button><button type="button" class="m-preset-chip" data-preset="dev" aria-pressed="false">${escapeHtml(w.presetDev)}</button></div><div class="m-demo-status" role="status">${escapeHtml(w.statusInitial)}</div></div><div class="m-table-scroll" tabindex="0" role="region" aria-label="Sandbox customer data"><table class="m-table"><caption>${escapeHtml(w.tableCaption)}</caption><thead><tr>${w.tableHeaders.map(th => `<th scope="col">${escapeHtml(th)}</th>`).join('')}</tr></thead><tbody>${welcomeRows.map(row => {
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
        const activePresetBtn = preset !== 'all' ? demo.querySelector(`[data-preset="${preset}"]`) : null;
        const presetLabel = activePresetBtn ? ` (${activePresetBtn.textContent.trim()})` : '';
        const textOriginal = demo.dataset.statusOriginal || '⚠️ PII Exposed';
        const textBlur = demo.dataset.statusBlur || '🔒 Local Mask Active';
        const textReplace = demo.dataset.statusReplace || '✨ Replaced with Mock Data — UI stays clean!';
        status.textContent = mode === 'original' ? textOriginal : mode === 'blur' ? `${textBlur}${presetLabel}` : `${textReplace}${presetLabel}`;
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

const localizedReviewsByLocale = {
  en: [
    '“Excellent extension! Screen Privacy Blur makes it incredibly easy to protect sensitive information during screen sharing and presentations. Simple, lightweight, and works exactly as expected.”',
    '“I use that all the time when I’m sharing my screen, and it’s honestly could be a lifesaver. It’s very easy to turn on, and in a couple of seconds you can hide anything you don’t want others to see”',
    '“It\'s a great tool, but I would like to see automatically blurred confidential blocks”',
  ],
  de: [
    '„Ausgezeichnete Erweiterung! Screen Privacy Blur macht es unglaublich einfach, sensible Daten bei Bildschirmfreigaben und Präsentationen zu schützen. Leichtgewichtig und zuverlässig.“',
    '„Ich nutze es jedes Mal beim Teilen meines Bildschirms – ein echter Lebensretter. In wenigen Sekunden lässt sich alles ausblenden, was andere nicht sehen sollen.“',
    '„Großartiges Tool, ich wünschte mir noch automatisch unkenntlich gemachte vertrauliche Blöcke.“',
  ],
  es: [
    '«¡Excelente extensión! Screen Privacy Blur hace que sea muy fácil proteger información sensible al compartir pantalla y en presentaciones. Ligera y funciona como se espera.»',
    '«La uso todo el tiempo cuando comparto mi pantalla; es un salvavidas. En un par de segundos puedes ocultar cualquier dato que no quieras mostrar.»',
    '«Es una gran herramienta, y me encantaría ver bloques confidenciales difuminados automáticamente.»',
  ],
  'pt-br': [
    '“Excelente extensão! O Screen Privacy Blur torna muito fácil proteger informações confidenciais durante o compartilhamento de tela e apresentações. Simples e leve.”',
    '“Uso o tempo todo quando estou compartilhando minha tela. É muito fácil de ativar e em poucos segundos você oculta qualquer dado privado.”',
    '“É uma ótima ferramenta, e gostaria de ver blocos confidenciais desfocados automaticamente.”',
  ],
  fr: [
    '« Excellente extension ! Screen Privacy Blur permet de protéger très facilement les informations sensibles lors du partage d’écran et des présentations. Simple et légère. »',
    '« Je l’utilise tout le temps quand je partage mon écran. En quelques secondes, on peut masquer tout ce que les autres ne doivent pas voir. »',
    '« Très bon outil, j’aimerais voir le floutage automatique des blocs confidentiels. »',
  ],
  it: [
    '«Estensione eccellente! Screen Privacy Blur rende semplicissimo proteggere i dati sensibili durante la condivisione dello schermo e le presentazioni. Leggera e affidabile.»',
    '«La uso sempre quando condivido lo schermo: una vera salvezza. In pochi secondi nascondi tutto ciò che non vuoi mostrare agli altri.»',
    '«Ottimo strumento, mi piacerebbe vedere i blocchi riservati offuscati automaticamente.»',
  ],
  nl: [
    '“Uitstekende extensie! Screen Privacy Blur maakt het heel eenvoudig om gevoelige informatie te beschermen tijdens schermdelen en presentaties. Simpel en lichtgewicht.”',
    '“Ik gebruik het altijd wanneer ik mijn scherm deel. Binnen een paar seconden verberg je alles wat anderen niet mogen zien.”',
    '“Geweldige tool, ik zou graag automatisch vervaagde vertrouwelijke blokken zien.”',
  ],
  pl: [
    '„Doskonałe rozszerzenie! Screen Privacy Blur niezwykle ułatwia ochronę wrażliwych informacji podczas udostępniania ekranu i prezentacji. Proste i lekkie.”',
    '„Używam go za każdym razem, gdy udostępniam ekran. W kilka sekund można ukryć wszystko, czego inni nie powinni widzieć.”',
    '„Świetne narzędzie, chciałabym zobaczyć automatyczne rozmywanie poufnych bloków.”',
  ],
  ru: [
    '«Отличное расширение! Screen Privacy Blur позволяет легко защитить конфиденциальную информацию во время демонстрации экрана и презентаций. Простое и легкое.»',
    '«Постоянно использую при показе экрана — настоящая выручалочка. За пару секунд можно скрыть всё, что не должны видеть другие.»',
    '«Отличный инструмент, хотелось бы также видеть автоматическое размытие конфиденциальных блоков.»',
  ],
  tr: [
    '“Mükemmel uzantı! Screen Privacy Blur, ekran paylaşımı ve sunumlar sırasında hassas bilgileri korumayı inanılmaz derecede kolaylaştırıyor. Basit ve hafif.”',
    '“Ekranımı her paylaştığımda kullanıyorum, gerçekten hayat kurtarıcı. Birkaç saniye içinde başkalarının görmesini istemediğiniz her şeyi gizleyebilirsiniz.”',
    '“Harika bir araç, gizli blokların otomatik olarak bulanıklaştırıldığını da görmek isterim.”',
  ],
  ja: [
    '「素晴らしい拡張機能です！Screen Privacy Blurのおかげで、画面共有やプレゼン中に機密情報を簡単に保護できます。シンプルで軽量です。」',
    '「画面共有のたびに使っています。数秒で見せたくない情報をすぐに隠せるので本当に助かっています。」',
    '「とても便利なツールです。機密ブロックの自動ぼかし機能もあると嬉しいです。」',
  ],
  ko: [
    '“훌륭한 확장 프로그램입니다! Screen Privacy Blur 덕분에 화면 공유와 프레젠테이션 중에 민감한 정보를 매우 쉽게 보호할 수 있습니다.”',
    '“화면을 공유할 때마다 항상 사용합니다. 단 몇 초 만에 다른 사람에게 보이고 싶지 않은 모든 항목을 숨길 수 있습니다.”',
    '“정말 좋은 도구이며, 기밀 블록을 자동으로 블러 처리하는 기능도 있으면 좋겠습니다.”',
  ],
  'zh-cn': [
    '“非常棒的扩展！Screen Privacy Blur 让在屏幕共享和演示期间保护敏感信息变得极其简单。轻量且高效。”',
    '“每次共享屏幕时我都会用它，简直是救星。只需几秒钟就能隐藏任何不想让别人看到的内容。”',
    '“很好用的工具，希望能看到自动模糊机密区块的功能。”',
  ],
  'zh-tw': [
    '「非常棒的擴充功能！Screen Privacy Blur 讓在螢幕分享與簡報時保護敏感資訊變得極為簡單。輕量且穩定。」',
    '「每次分享螢幕時我都會使用它。只要幾秒鐘就能隱藏任何不想讓別人看到的內容。」',
    '「很實用的工具，希望能看到自動模糊機密區塊的功能。」',
  ],
  hi: [
    '“शानदार एक्सटेंशन! Screen Privacy Blur स्क्रीन शेयरिंग और प्रेजेंटेशन के दौरान संवेदनशील जानकारी को सुरक्षित करना बेहद आसान बनाता है।”',
    '“मैं अपनी स्क्रीन साझा करते समय हमेशा इसका उपयोग करता हूँ। कुछ ही सेकंड में आप किसी भी निजी जानकारी को छुपा सकते हैं।”',
    '“यह एक बेहतरीन टूल है, और ऑटोमैटिक ब्लर फीचर इसे और भी उपयोगी बनाता है।”',
  ],
  id: [
    '“Ekstensi luar biasa! Screen Privacy Blur memudahkan perlindungan informasi sensitif saat berbagi layar dan presentasi. Sederhana dan ringan.”',
    '“Saya selalu menggunakannya saat berbagi layar. Hanya dalam beberapa detik Anda dapat menyembunyikan data apa pun.”',
    '“Alat yang hebat, senang melihat fitur blur otomatis untuk blok rahasia.”',
  ],
};

// Verbatim excerpts verified against Chrome Web Store reviews on October 13, 2026.
export const reviewsHtml = (locale = 'en') => {
  const r = getCopy(locale).reviews;
  const quotes = localizedReviewsByLocale[locale] || localizedReviewsByLocale.en;
  return `<section class="m-section m-wrap" id="reviews"><div class="m-section-heading"><span class="m-kicker">${escapeHtml(r.kicker)}</span><h2>${escapeHtml(r.title)}</h2><a class="m-rating" href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${r.ratingBadge}</a></div><div class="m-grid m-three"><figure class="m-card m-review"><blockquote>${escapeHtml(quotes[0])}</blockquote><figcaption><strong>Kate Litlonn</strong><span>June 11, 2026 · Chrome Web Store</span><a href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.readReview)}</a></figcaption></figure><figure class="m-card m-review"><blockquote>${escapeHtml(quotes[1])}</blockquote><figcaption><strong>EMILIANO CHEHIN</strong><span>December 17, 2025 · Chrome Web Store</span><a href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.readReview)}</a></figcaption></figure><figure class="m-card m-review"><blockquote>${escapeHtml(quotes[2])}</blockquote><figcaption><strong>Karina Noa</strong><span>December 22, 2025 · Chrome Web Store · Inspired Smart Auto-Blur Pro</span><a href="${reviewsUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.readReview)}</a></figcaption></figure></div><p class="m-note">${escapeHtml(r.note)}</p></section>`;
};
