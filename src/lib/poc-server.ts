import type { PocChannel } from "./poc";

export function getPocChannel(): PocChannel {
  if (getPocWebhook()) return { mode: "webhook" };
  const email = process.env.POC_CONTACT_EMAIL?.trim();
  if (email && /^[^\s@?&]+@[^\s@?&]+\.[^\s@?&]+$/.test(email))
    return { mode: "email", email };
  return { mode: "unconfigured" };
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
