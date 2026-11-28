import type { PocChannel } from "./poc";

export const DEFAULT_POC_CONTACT_EMAIL = "avatr@skymythos.ai";

export function getPocChannel(): PocChannel {
  if (getPocWebhook()) return { mode: "webhook" };
  const raw = process.env.POC_CONTACT_EMAIL?.trim();
  if (raw && /^[^\s@?&]+@[^\s@?&]+\.[^\s@?&]+$/.test(raw))
    return { mode: "email", email: raw };
  return { mode: "email", email: DEFAULT_POC_CONTACT_EMAIL };
}

export function getPocWebhook(): URL | null {
  const raw = process.env.POC_WEBHOOK_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.username || url.password) return null;
    const loopback =
      url.hostname === "127.0.0.1" || url.hostname === "localhost";
    return url.protocol === "https:" || (loopback && url.protocol === "http:")
      ? url
      : null;
  } catch {
    return null;
  }
}
