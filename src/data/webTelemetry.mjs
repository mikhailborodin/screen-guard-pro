export const ALLOWED_PAYWALL_FEATURES = [
  "smart-auto-blur",
  "role-sales",
  "role-fintech",
  "role-dev",
  "auto-replace",
  "data-replacement",
];

// Self-contained so static SEO/Welcome/Uninstall HTML can embed this without loading React.
export function initializeWebTelemetry(root = document, customEndpoint) {
  const doc = root?.ownerDocument || root;
  const win = doc?.defaultView || (typeof window !== "undefined" ? window : undefined);
  if (!win || !doc) return () => {};

  const ENDPOINT = customEndpoint || "https://rqwssmxjpphxngrncjfb.supabase.co/functions/v1/web-telemetry";
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const VERSION_RE = /^\d{1,5}(?:\.\d{1,5}){1,3}$/;
  const FEATURES = new Set([
    "smart-auto-blur",
    "role-sales",
    "role-fintech",
    "role-dev",
    "auto-replace",
    "data-replacement",
  ]);
  const INTERNAL_SOURCES = new Set(["extension_install", "extension_uninstall"]);
  const LOCALES = new Set([
    "de", "es", "pt-br", "fr", "it", "nl", "pl", "ru", "tr", "ja", "ko", "zh-cn", "zh-tw", "hi", "id",
  ]);

  const clean = (val, max = 120) => {
    if (typeof val !== "string") return "";
    return val.replace(/[^\w./:@+-]/g, "").slice(0, max);
  };

  const readCookie = (name) => {
    try {
      const prefix = `${name}=`;
      const hit = (doc.cookie || "")
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(prefix));
      return hit ? decodeURIComponent(hit.slice(prefix.length)) : "";
    } catch {
      return "";
    }
  };

  const writeCookie = (name, value, maxAgeSeconds) => {
    try {
      const secure = win.location?.protocol === "https:" ? "; Secure" : "";
      doc.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
    } catch {
      // Ignore cookie write failures in restricted browsing modes.
    }
  };

  const readStore = (key) => {
    try {
      return win.localStorage?.getItem(key) || readCookie(key);
    } catch {
      return readCookie(key);
    }
  };

  const writeStore = (key, value, maxAgeSeconds = 2592000) => {
    try {
      win.localStorage?.setItem(key, value);
    } catch {
      // Ignore storage quota / privacy mode errors.
    }
    writeCookie(key, value, maxAgeSeconds);
  };

  const makeUuidV4 = () => {
    if (win.crypto?.randomUUID) return win.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    if (win.crypto?.getRandomValues) {
      win.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  const getVisitorId = () => {
    const existing = readStore("pb_vid");
    if (UUID_RE.test(existing)) return existing;
    const created = makeUuidV4();
    writeStore("pb_vid", created, 31536000);
    return created;
  };

  const normalizePathname = (rawPath) => {
    const safe = clean(rawPath || "/", 150) || "/";
    const withSlash = safe.startsWith("/") ? safe : `/${safe}`;
    return withSlash === "/" ? "/" : `${withSlash.replace(/\/+$/, "")}/`;
  };

  const stripLocale = (pathname) => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 0 && LOCALES.has(parts[0].toLowerCase())) {
      const rest = parts.slice(1).join("/");
      return rest ? `/${rest}/` : "/";
    }
    return pathname;
  };

  const detectClickIdType = (params) => {
    for (const [param, source] of [
      ["gclid", "google_ads"],
      ["gbraid", "google_ads"],
      ["wbraid", "google_ads"],
      ["msclkid", "bing_ads"],
      ["fbclid", "meta_ads"],
      ["ttclid", "tiktok_ads"],
      ["twclid", "x_ads"],
    ]) {
      if (params.get(param)) return { click_id_type: param, inferred_source: source };
    }
    return { click_id_type: "", inferred_source: "" };
  };

  const captureAttribution = () => {
    const params = new URLSearchParams(win.location?.search || "");
    const rawInstallId = (params.get("install_id") || "").trim();
    if (UUID_RE.test(rawInstallId)) {
      writeStore("pb_iid", rawInstallId, 31536000);
    }
    const rawVersion = (params.get("v") || "").trim();
    if (VERSION_RE.test(rawVersion)) {
      writeStore("pb_ver", rawVersion, 31536000);
    }

    const rawUtmSource = clean(params.get("utm_source") || "", 80);
    const isInternalFlow = INTERNAL_SOURCES.has(rawUtmSource);
    const { click_id_type, inferred_source } = detectClickIdType(params);
    const effectiveUtmSource = !isInternalFlow ? (rawUtmSource || inferred_source) : "";
    const hasMarketingTouch = Boolean(effectiveUtmSource || click_id_type);

    let saved = null;
    try {
      const rawSaved = readStore("pb_ft");
      if (rawSaved) saved = JSON.parse(rawSaved);
    } catch {
      saved = null;
    }

    const shouldWriteFirstTouch =
      !saved || (saved.utm_source === "direct" && hasMarketingTouch);

    if (shouldWriteFirstTouch && !isInternalFlow) {
      let referrerHost = "";
      try {
        if (doc.referrer) {
          const refUrl = new URL(doc.referrer);
          if (refUrl.hostname && refUrl.hostname !== win.location?.hostname) {
            referrerHost = clean(refUrl.hostname, 100);
          }
        }
      } catch {
        referrerHost = "";
      }

      const inferredFromReferrer = referrerHost ? `referral_${referrerHost}` : "direct";
      const nextFirstTouch = {
        utm_source: effectiveUtmSource || inferredFromReferrer,
        utm_medium: clean(params.get("utm_medium") || (inferred_source ? "cpc" : referrerHost ? "referral" : ""), 80),
        utm_campaign: clean(params.get("utm_campaign") || "", 100),
        utm_content: clean(params.get("utm_content") || "", 100),
        click_id_type,
        referrer_host: referrerHost,
        landing_path: normalizePathname(win.location?.pathname || "/"),
      };
      writeStore("pb_ft", JSON.stringify(nextFirstTouch), 2592000);
      saved = nextFirstTouch;
    }

    const rawFeature = (params.get("paywall_feature") || params.get("feature") || "").trim();
    const paywallFeature = FEATURES.has(rawFeature) ? rawFeature : "smart-auto-blur";
    const storedInstallId = readStore("pb_iid");
    const storedVersion = readStore("pb_ver");

    return {
      visitorId: getVisitorId(),
      installId: UUID_RE.test(storedInstallId) ? storedInstallId : "",
      version: VERSION_RE.test(storedVersion) ? storedVersion : "",
      firstTouch: saved,
      paywallFeature,
      rawUtmSource,
    };
  };

  const state = win.__pbTelemetryState || {
    routeKeys: new Set(),
    boundRoots: new WeakSet(),
    lastClickKey: "",
    lastClickAt: 0,
  };
  win.__pbTelemetryState = state;

  const track = (event, extra = {}) => {
    if (event === "install_cta_clicked") {
      const clickKey = `${extra.target || ""}:${extra.placement || ""}`;
      const now = Date.now();
      if (state.lastClickKey === clickKey && now - state.lastClickAt < 300) return;
      state.lastClickKey = clickKey;
      state.lastClickAt = now;
    }
    const attr = captureAttribution();
    const pathname = normalizePathname(win.location?.pathname || "/");
    const locale = clean(doc.documentElement?.lang || "en", 16) || "en";
    const stitchedKey = attr.installId ? `pb_stitched_${attr.installId}` : "";
    const needsStitch = Boolean(stitchedKey && readStore(stitchedKey) !== "1");

    const payload = {
      event,
      visitor_id: attr.visitorId,
      path: pathname,
      locale,
      ...(attr.installId ? { install_id: attr.installId } : {}),
      ...(needsStitch ? { stitch: true } : {}),
      ...(attr.version ? { version: attr.version } : {}),
      ...(attr.firstTouch ? { first_touch: attr.firstTouch } : {}),
      ...extra,
    };

    if (needsStitch) {
      writeStore(stitchedKey, "1", 31536000);
    }

    if (typeof win.fetch === "function") {
      win.fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: "omit",
      }).catch(() => {});
    }
  };

  win.__pbTelemetry = {
    track,
    getAttribution: captureAttribution,
  };

  // Automatic route-view tracking (deduplicated per route + search state)
  const attr = captureAttribution();
  const pathname = normalizePathname(win.location?.pathname || "/");
  const baseRoute = stripLocale(pathname);
  const routeKey = `${pathname}|${attr.paywallFeature}|${attr.installId}`;

  if (!state.routeKeys.has(routeKey)) {
    state.routeKeys.add(routeKey);
    if (baseRoute === "/welcome/") {
      track("welcome_viewed", {
        from_extension_install: attr.rawUtmSource === "extension_install",
      });
    } else if (baseRoute === "/uninstall/") {
      track("extension_uninstalled");
    } else if (baseRoute === "/paywall/") {
      track("paywall_viewed", { feature: attr.paywallFeature });
    } else if (baseRoute === "/payment-cancelled/") {
      track("checkout_cancelled_view", { feature: attr.paywallFeature });
    } else if (baseRoute !== "/payment-success/") {
      let alreadyLanded = false;
      try {
        alreadyLanded = win.sessionStorage?.getItem("pb_session_landed") === "1";
        win.sessionStorage?.setItem("pb_session_landed", "1");
      } catch {
        alreadyLanded = false;
      }
      if (!alreadyLanded) {
        track("site_landing_viewed");
      }
    }
  }

  if (state.boundRoots.has(root)) {
    return () => {};
  }
  state.boundRoots.add(root);

  const onClick = (ev) => {
    const targetEl = ev.target && typeof ev.target.closest === "function"
      ? ev.target.closest("a[data-install], a[data-placement]")
      : null;
    if (!targetEl) return;
    const href = targetEl.getAttribute("href") || "";
    const isMac = targetEl.dataset?.install === "macos" || href.endsWith(".dmg");
    const isCws = href.includes("chromewebstore.google.com/detail/");
    if (!isMac && !isCws) return;
    const placement = clean(targetEl.dataset?.placement || "hero", 40) || "hero";
    track("install_cta_clicked", {
      target: isMac ? "macos" : "chrome",
      placement,
    });
  };

  const onSurveyChange = (ev) => {
    const input = ev.target;
    if (!input || input.name !== "uninstall-reason") return;
    const reason = input.value;
    if (!["website", "pattern", "free", "finished"].includes(reason)) return;
    track("uninstall_feedback_submitted", { reason });
  };

  root.addEventListener("click", onClick);
  root.addEventListener("change", onSurveyChange);

  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("change", onSurveyChange);
    state.boundRoots.delete(root);
  };
}

export function getWebAttribution() {
  if (typeof window === "undefined") {
    return {
      visitorId: "",
      installId: "",
      version: "",
      firstTouch: null,
      paywallFeature: "smart-auto-blur",
    };
  }
  if (!window.__pbTelemetry) {
    initializeWebTelemetry(document);
  }
  return window.__pbTelemetry?.getAttribution?.() ?? {
    visitorId: "",
    installId: "",
    version: "",
    firstTouch: null,
    paywallFeature: "smart-auto-blur",
  };
}

export function trackWebEvent(event, extra = {}) {
  if (typeof window === "undefined") return;
  if (!window.__pbTelemetry) {
    initializeWebTelemetry(document);
  }
  window.__pbTelemetry?.track?.(event, extra);
}
