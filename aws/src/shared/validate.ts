import type { ContactPayload } from "./types";

const MAX = {
  name: 120,
  company: 120,
  role: 120,
  location: 120,
  availability: 120,
  message: 2000,
};

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function parseContactBody(raw: string | null): ContactPayload | null {
  if (!raw) return null;

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const name = clean(parsed.name, MAX.name);
  const company = clean(parsed.company, MAX.company);
  const role = clean(parsed.role, MAX.role);

  if (!name || !company || !role) return null;

  return {
    name,
    company,
    role,
    location: clean(parsed.location, MAX.location) || undefined,
    availability: clean(parsed.availability, MAX.availability) || undefined,
    message: clean(parsed.message, MAX.message) || undefined,
  };
}
