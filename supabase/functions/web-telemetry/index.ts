// First-party PostHog ingestion proxy for privacyblur.co.
// Enforces a strict event/property allowlist, strips client IP/GeoIP,
// and stitches anonymous pre-install visitors (visitor_id) to extension install_id.

const builtInAllowedOrigins = new Set([
  "https://privacyblur.co",
  "https://www.privacyblur.co",
  "https://mikhailborodin.github.io",
]);

const allowedEvents = new Set([
  "site_landing_viewed",
  "install_cta_clicked",
  "welcome_viewed",
  "paywall_viewed",
  "checkout_started",
  "checkout_completed_view",
  "checkout_cancelled_view",
  "extension_uninstalled",
  "uninstall_feedback_submitted",
]);

const allowedFeatures = new Set([
  "smart-auto-blur",
  "role-sales",
  "role-fintech",
  "role-dev",
  "auto-replace",
  "data-replacement",
]);

const allowedIntervals = new Set(["month", "year", "lifetime"]);
const allowedTargets = new Set(["chrome", "macos"]);
const allowedReasons = new Set(["website", "pattern", "free", "finished"]);
const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const pathRe = /^\/[A-Za-z0-9/_-]{0,159}$/;
const versionRe = /^\d{1,5}(?:\.\d{1,5}){1,3}$/;
const localeRe = /^[a-z]{2,3}(?:[-_][a-z0-9]{2,8}){0,3}$/i;

function isAllowedOrigin(origin: string) {
  if (builtInAllowedOrigins.has(origin)) return true;
  const extra = (Deno.env.get("WEB_TELEMETRY_ALLOWED_ORIGINS") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return extra.includes(origin);
}

function cleanString(value: unknown, maxLength = 120): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[^\w./:@+-]/g, "").slice(0, maxLength);
}

function sanitizeFirstTouch(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const obj = raw as Record<string, unknown>;
  const utm_source = cleanString(obj.utm_source, 80);
  const utm_medium = cleanString(obj.utm_medium, 80);
  const utm_campaign = cleanString(obj.utm_campaign, 100);
  const utm_content = cleanString(obj.utm_content, 100);
  const click_id_type = cleanString(obj.click_id_type, 32);
  const referrer_host = cleanString(obj.referrer_host, 100);
  const rawLanding = typeof obj.landing_path === "string" ? obj.landing_path.trim() : "";
  const landing_path = pathRe.test(rawLanding) ? rawLanding : "";

  if (!utm_source && !utm_medium && !utm_campaign && !click_id_type && !referrer_host && !landing_path) {
    return null;
  }

  return {
    ...(utm_source ? { utm_source } : {}),
    ...(utm_medium ? { utm_medium } : {}),
    ...(utm_campaign ? { utm_campaign } : {}),
    ...(utm_content ? { utm_content } : {}),
    ...(click_id_type ? { click_id_type } : {}),
    ...(referrer_host ? { referrer_host } : {}),
    ...(landing_path ? { landing_path } : {}),
  };
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  const allowed = isAllowedOrigin(origin);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    ...(allowed ? { "Access-Control-Allow-Origin": origin } : {}),
  };
  const reply = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), { status, headers });

  if (!allowed) return reply(403, { error: "Origin is not allowed." });
  if (request.method === "OPTIONS") return reply(200, { ok: true });
  if (request.method !== "POST") return reply(405, { error: "Method not allowed." });

  const reader = request.body?.getReader();
  if (!reader) return reply(400, { error: "Missing body." });

  let rawText = "";
  let totalBytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > 4096) {
      await reader.cancel();
      return reply(413, { error: "Request is too long." });
    }
    rawText += decoder.decode(value, { stream: true });
  }
  rawText += decoder.decode();

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawText);
  } catch {
    return reply(400, { error: "Invalid JSON." });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return reply(400, { error: "Invalid payload." });
  }

  const event = typeof payload.event === "string" ? payload.event : "";
  const visitorId = typeof payload.visitor_id === "string" ? payload.visitor_id : "";
  const installId = typeof payload.install_id === "string" ? payload.install_id : "";
  const path = typeof payload.path === "string" ? payload.path : "";
  const locale = typeof payload.locale === "string" ? payload.locale : "en";
  const version = typeof payload.version === "string" ? payload.version : "";
  const stitch = payload.stitch === true;

  if (
    !allowedEvents.has(event) ||
    !uuidRe.test(visitorId) ||
    (installId !== "" && !uuidRe.test(installId)) ||
    !pathRe.test(path) ||
    !localeRe.test(locale) ||
    (version !== "" && !versionRe.test(version))
  ) {
    return reply(400, { error: "Invalid payload." });
  }

  const eventSpecific: Record<string, unknown> = {};
  if (payload.feature !== undefined) {
    if (typeof payload.feature !== "string" || !allowedFeatures.has(payload.feature)) {
      return reply(400, { error: "Invalid feature." });
    }
    eventSpecific.feature = payload.feature;
  }
  if (payload.billing_interval !== undefined) {
    if (typeof payload.billing_interval !== "string" || !allowedIntervals.has(payload.billing_interval)) {
      return reply(400, { error: "Invalid billing_interval." });
    }
    eventSpecific.billing_interval = payload.billing_interval;
  }
  if (payload.target !== undefined) {
    if (typeof payload.target !== "string" || !allowedTargets.has(payload.target)) {
      return reply(400, { error: "Invalid target." });
    }
    eventSpecific.target = payload.target;
  }
  if (payload.placement !== undefined) {
    const placement = cleanString(payload.placement, 40);
    if (!placement) return reply(400, { error: "Invalid placement." });
    eventSpecific.placement = placement;
  }
  if (payload.reason !== undefined) {
    if (typeof payload.reason !== "string" || !allowedReasons.has(payload.reason)) {
      return reply(400, { error: "Invalid reason." });
    }
    eventSpecific.reason = payload.reason;
  }
  if (payload.from_extension_install !== undefined) {
    if (typeof payload.from_extension_install !== "boolean") {
      return reply(400, { error: "Invalid from_extension_install." });
    }
    eventSpecific.from_extension_install = payload.from_extension_install;
  }

  const apiKey = Deno.env.get("POSTHOG_PROJECT_API_KEY");
  const host = Deno.env.get("POSTHOG_HOST") || "";
  if (!apiKey || !["https://eu.i.posthog.com", "https://us.i.posthog.com"].includes(host)) {
    return reply(503, { error: "Telemetry is not configured." });
  }

  const firstTouch = sanitizeFirstTouch(payload.first_touch);
  const distinctId = installId || visitorId;
  const setOnceProps: Record<string, string> = {};
  if (firstTouch) {
    if (firstTouch.utm_source) setOnceProps.initial_utm_source = firstTouch.utm_source;
    if (firstTouch.utm_medium) setOnceProps.initial_utm_medium = firstTouch.utm_medium;
    if (firstTouch.utm_campaign) setOnceProps.initial_utm_campaign = firstTouch.utm_campaign;
    if (firstTouch.utm_content) setOnceProps.initial_utm_content = firstTouch.utm_content;
    if (firstTouch.click_id_type) setOnceProps.initial_click_id_type = firstTouch.click_id_type;
    if (firstTouch.referrer_host) setOnceProps.initial_referrer_host = firstTouch.referrer_host;
    if (firstTouch.landing_path) setOnceProps.initial_landing_path = firstTouch.landing_path;
  }

  const setProps: Record<string, string> = { site_locale: locale };
  if (installId) setProps.install_id = installId;
  if (version) setProps.extension_version = version;

  const batch: Array<Record<string, unknown>> = [];

  if (stitch && installId && installId !== visitorId) {
    batch.push({
      event: "$create_alias",
      properties: {
        distinct_id: installId,
        alias: visitorId,
        "$ip": null,
        "$geoip_disable": true,
      },
    });
  }

  batch.push({
    event,
    properties: {
      distinct_id: distinctId,
      visitor_id: visitorId,
      ...(installId ? { install_id: installId } : {}),
      path,
      locale,
      ...(version ? { version } : {}),
      ...(firstTouch ?? {}),
      ...eventSpecific,
      ...(Object.keys(setOnceProps).length > 0 ? { "$set_once": setOnceProps } : {}),
      "$set": setProps,
      "$ip": null,
      "$geoip_disable": true,
    },
  });

  try {
    const response = await fetch(`${host}/batch/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, batch }),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? reply(200, { ok: true }) : reply(502, { error: "Could not capture event." });
  } catch {
    return reply(502, { error: "Could not capture event." });
  }
});
