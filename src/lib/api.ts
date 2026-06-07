const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  ""
);

export function isApiConfigured() {
  return Boolean(API_URL);
}

export async function submitContact(payload: {
  name: string;
  company: string;
  role: string;
  location?: string;
  availability?: string;
  message?: string;
}) {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (data as { error?: string }).error ?? "Failed to submit contact form"
    );
  }

  return data as { ok: boolean; id: string; message: string };
}

export async function trackAnalyticsEvent(
  event: "page_view" | "section_view" | "contact_open" | "assistant_open"
) {
  if (!API_URL) return;

  try {
    await fetch(`${API_URL}/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    });
  } catch {
    // Analytics should never block UX
  }
}
