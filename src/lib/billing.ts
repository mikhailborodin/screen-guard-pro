const SUPABASE_URL = "https://rqwssmxjpphxngrncjfb.supabase.co";
const SITE_URL = "https://privacyblur.co";
const SUPABASE_AUTH_STORAGE_KEY = "sb-rqwssmxjpphxngrncjfb-auth-token";

export const PRO_FEATURE = "smart-auto-blur";
export const EXTENSION_SOURCE = "extension";
export type BillingInterval = "month" | "year" | "lifetime";

type CheckoutSessionResponse = {
  url?: string;
  error?: string;
  message?: string;
};

type SubscriptionStatusResponse = {
  plan?: BillingInterval;
  active?: boolean;
  subscribed?: boolean;
  status?: string;
  subscription?: {
    active?: boolean;
    status?: string;
  };
};

export type CheckoutParams = {
  extensionId: string;
  billingInterval: BillingInterval;
};

export type SubscriptionStatus = {
  active: boolean;
  plan?: BillingInterval;
};

const endpoint = (path: string) => `${SUPABASE_URL}/functions/v1/${path}`;

const getSupabaseAccessToken = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const rawToken = window.localStorage.getItem(SUPABASE_AUTH_STORAGE_KEY);
  if (!rawToken) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawToken) as {
      access_token?: string;
      currentSession?: { access_token?: string };
    };

    return parsed.access_token ?? parsed.currentSession?.access_token;
  } catch {
    return undefined;
  }
};

const authHeaders = () => {
  const accessToken = getSupabaseAccessToken();

  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const requireOk = async (response: Response) => {
  if (response.ok) {
    return;
  }

  let errorMessage = "The billing service returned an error. Please try again.";

  try {
    const body = (await response.json()) as CheckoutSessionResponse;
    errorMessage = body.error ?? body.message ?? errorMessage;
  } catch {
    errorMessage = response.statusText || errorMessage;
  }

  throw new Error(errorMessage);
};

export const buildPaymentQuery = (extensionId: string) => {
  const params = new URLSearchParams({
    source: EXTENSION_SOURCE,
    feature: PRO_FEATURE,
  });

  if (extensionId) {
    params.set("extension_id", extensionId);
  }

  return params.toString();
};

export const buildHostedRoute = (path: "/payment-success" | "/payment-cancelled", extensionId: string) =>
  `${SITE_URL}${path}?${buildPaymentQuery(extensionId)}`;

export const createCheckoutSession = async ({ extensionId, billingInterval }: CheckoutParams) => {
  const response = await fetch(endpoint("create-checkout-session"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      feature: PRO_FEATURE,
      source: EXTENSION_SOURCE,
      extensionId,
      billingInterval,
      successUrl: buildHostedRoute("/payment-success", extensionId),
      cancelUrl: buildHostedRoute("/payment-cancelled", extensionId),
    }),
  });

  await requireOk(response);

  const body = (await response.json()) as CheckoutSessionResponse;
  if (!body.url) {
    throw new Error("Checkout did not return a redirect URL.");
  }

  return body.url;
};

const isActiveStatus = (status?: string) => status === "active" || status === "trialing";

export const checkSubscriptionStatus = async (extensionId: string, activationToken: string, sessionId?: string): Promise<SubscriptionStatus> => {
  const params = new URLSearchParams();

  if (extensionId) {
    params.set("extension_id", extensionId);
  }

  if (sessionId) params.set("session_id", sessionId);

  const response = await fetch(`${endpoint("subscription-status")}?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${activationToken}` },
  });

  await requireOk(response);

  const body = (await response.json()) as SubscriptionStatusResponse;
  const active =
    body.active === true ||
    body.subscribed === true ||
    isActiveStatus(body.status) ||
    body.subscription?.active === true ||
    isActiveStatus(body.subscription?.status);

  return { active, plan: body.plan };
};

// Preserve the deployed secure activation contract with the Chrome extension.
export const activateExtension = async (extensionId: string, activationToken: string) => {
  const runtime = (globalThis as typeof globalThis & {
    chrome?: { runtime?: {
      lastError?: { message?: string };
      sendMessage: (id: string, message: unknown, callback: (response?: { success?: boolean; error?: string }) => void) => void;
    } };
  }).chrome?.runtime;
  if (!runtime?.sendMessage) throw new Error("Open this page in Chrome with Screen Privacy Blur installed, then try again.");
  await new Promise<void>((resolve, reject) => {
    runtime.sendMessage(extensionId, {
      action: "screenGuardProSubscription", subscriptionToken: activationToken, active: true, status: "active",
    }, (response) => {
      const error = runtime.lastError?.message ?? (!response?.success ? response?.error ?? "The extension did not accept the activation." : undefined);
      if (error) reject(new Error(error));
      else resolve();
    });
  });
};
