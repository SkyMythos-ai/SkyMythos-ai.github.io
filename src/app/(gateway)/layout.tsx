import type { ReactNode } from "react";
import { defaultLocale } from "@/lib/i18n";
import { DocumentShell } from "@/components/document-shell";

/**
 * Root layout for the gateway group.
 *
 * Two route groups exist at the top level, and each supplies its own document
 * element because `lang` is a per-tree fact that a shared layout cannot know:
 *
 *   (localized) — the `/zh/**` and `/en/**` trees, where the locale segment
 *                 renders the document with the language of that tree.
 *   (gateway)   — this group: the root language chooser and the 404 page, which
 *                 belong to no locale and therefore take the default.
 *
 * Route groups do not appear in the URL, so `(gateway)/page.tsx` still serves `/`
 * and `(localized)/[locale]/page.tsx` still serves `/zh`.
 */
export default function GatewayLayout({ children }: { children: ReactNode }) {
  return <DocumentShell locale={defaultLocale}>{children}</DocumentShell>;
}
