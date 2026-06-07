export type ContactPayload = {
  name: string;
  company: string;
  role: string;
  location?: string;
  availability?: string;
  message?: string;
};

export type ContactRecord = ContactPayload & {
  id: string;
  createdAt: string;
  status: "queued" | "sent" | "failed";
  sourceIp?: string;
};

export type AnalyticsEvent = {
  event: string;
  path?: string;
  metadata?: Record<string, string>;
};
