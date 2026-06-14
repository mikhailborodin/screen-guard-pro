const SUPABASE_URL = "https://rqwssmxjpphxngrncjfb.supabase.co";

type SupportRequestPayload = {
  name: string;
  email: string;
  topic: string;
  message: string;
  company?: string;
  pageUrl: string;
  userAgent: string;
};

type SupportRequestResponse = {
  ok?: boolean;
  conversationId?: number;
  error?: string;
};

const endpoint = (path: string) => `${SUPABASE_URL}/functions/v1/${path}`;

export async function submitSupportRequest(payload: SupportRequestPayload) {
  const response = await fetch(endpoint("support-request"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as SupportRequestResponse;

  if (!response.ok) {
    throw new Error(body.error || "Support request could not be sent.");
  }

  return body;
}
