import type { ReactNode } from "react";
import { toLocale } from "@/lib/i18n";
import { SiteChrome } from "@/components/site-chrome";

/**
 * Documentation ground — paper.
 *
 * The manual keeps the light ground it was designed around, and it is the only
 * part of the site that does. A reader stays here for minutes at a time and
 * scrolls long pages; a near-black field is a good frame for a headline and a
 * poor surface for sustained reading, so the two audiences get two treatments
 * rather than one compromise.
 *
 * This is also why the ground lives at the route-group level instead of being a
 * site-wide theme: the split is not a user preference to toggle, it is a fact
 * about which kind of page you are on.
 */
export default async function DocsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = toLocale(raw);

  return <div className="scope-manual"><SiteChrome locale={locale}>{children}</SiteChrome></div>;
}
