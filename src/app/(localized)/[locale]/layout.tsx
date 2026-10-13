import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n";
import { DocumentShell } from "@/components/document-shell";
import { Masthead } from "@/components/masthead";
import { Colophon } from "@/components/colophon";
import { getDictionary } from "@/content/dictionary";

/**
 * Locale layout — the document root for the whole site.
 *
 * This is where `<html>` is created, not `app/layout.tsx`. The reason is `lang`:
 * the document element must carry the language of the tree it belongs to, and
 * only this segment knows which tree it is in. A root layout above it would have
 * no access to `[locale]` and would have to hard-code one language for both —
 * which is what made every English page claim to be Chinese.
 *
 * `generateStaticParams` is what makes the export emit both trees: Next
 * pre-renders `/zh/**` and `/en/**` as separate documents, which is also what
 * gives each locale its own crawlable URL and its hreflang pair.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  // A segment outside the supported set is a 404, not a silent fallback — a
  // fallback would publish duplicate content under an uncontrolled URL.
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);

  return (
    <DocumentShell locale={locale}>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-3 focus:py-2 focus:text-[0.8125rem] focus:text-white"
        >
          {dictionary.nav.skipToContent}
        </a>

        <Masthead locale={locale} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Colophon locale={locale} />
      </div>
    </DocumentShell>
  );
}
