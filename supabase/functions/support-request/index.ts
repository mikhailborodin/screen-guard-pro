type SupportRequest = {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  company?: string;
  pageUrl?: string;
  userAgent?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200, origin = "") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
      ...corsHeaders,
    },
  });

const allowedOrigins = () =>
  (Deno.env.get("SUPPORT_ALLOWED_ORIGINS") || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin: string) => {
  const origins = allowedOrigins();
  return origins.length === 0 || origins.includes(origin);
};

const normalize = (value: unknown) => String(value ?? "").trim();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const chatwootRequest = async (path: string, body: Record<string, unknown>, authToken = "") => {
  const baseUrl = Deno.env.get("CHATWOOT_BASE_URL")?.replace(/\/$/, "");
  const websiteToken = Deno.env.get("CHATWOOT_WEBSITE_TOKEN");

  if (!baseUrl || !websiteToken) {
    throw new Error("Chatwoot is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}?website_token=${websiteToken}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { "X-Auth-Token": authToken } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Chatwoot request failed with status ${response.status}`);
  }

  return response.json();
};

const createConversation = async (payload: {
  name: string;
  email: string;
  topic: string;
  message: string;
  pageUrl: string;
  userAgent: string;
}) => {
  const config = await chatwootRequest("/api/v1/widget/config", {});
  const authToken = config.website_channel_config?.auth_token;

  if (!authToken) {
    throw new Error("Chatwoot did not return a widget auth token.");
  }

  const content = [
    `Topic: ${payload.topic}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.pageUrl ? `Page: ${payload.pageUrl}` : "",
    payload.userAgent ? `User-Agent: ${payload.userAgent}` : "",
    "",
    payload.message,
  ].filter(Boolean).join("\n");

  const conversation = await chatwootRequest("/api/v1/widget/conversations", {
    contact: {
      name: payload.name,
      email: payload.email,
      custom_attributes: {
        product: "Screen Guard Pro",
        source: "support_page",
        page_url: payload.pageUrl,
      },
    },
    custom_attributes: {
      product: "Screen Guard Pro",
      source: "support_page",
      topic: payload.topic,
      page_url: payload.pageUrl,
    },
    message: {
      content,
      referer_url: payload.pageUrl,
      timestamp: Math.floor(Date.now() / 1000),
    },
  }, authToken);

  const conversationId = conversation.id || conversation.conversation?.id;
  if (!conversationId) {
    throw new Error("Chatwoot did not return a conversation id.");
  }

  return { conversationId };
};

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";

  if (request.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) {
      return json({ error: "Origin is not allowed." }, 403, origin);
    }

    return json({ ok: true }, 200, origin);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405, origin);
  }

  if (!isAllowedOrigin(origin)) {
    return json({ error: "Origin is not allowed." }, 403, origin);
  }

  let payload: SupportRequest;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400, origin);
  }

  if (normalize(payload.company)) {
    return json({ ok: true }, 200, origin);
  }

  const name = normalize(payload.name);
  const email = normalize(payload.email);
  const topic = normalize(payload.topic);
  const message = normalize(payload.message);
  const pageUrl = normalize(payload.pageUrl);
  const userAgent = normalize(payload.userAgent);

  if (!name || !email || !topic || !message) {
    return json({ error: "Required fields are missing." }, 400, origin);
  }

  if (!isValidEmail(email)) {
    return json({ error: "Email is invalid." }, 400, origin);
  }

  if (name.length > 120 || email.length > 254 || topic.length > 120 || message.length > 5000) {
    return json({ error: "Request is too long." }, 400, origin);
  }

  try {
    const result = await createConversation({ name, email, topic, message, pageUrl, userAgent });
    return json({ ok: true, ...result }, 200, origin);
  } catch (error) {
    console.error("support request failed", error);
    return json({ error: "Could not send support request." }, 502, origin);
  }
});
