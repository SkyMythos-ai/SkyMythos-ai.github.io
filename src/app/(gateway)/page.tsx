import Link from "next/link";
import type { Metadata } from "next";
import { defaultLocale, localeLabels, locales, localeHtmlLang } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { Wordmark } from "@/components/wordmark";

/**
 * Root route — a language gateway.
 *
 * Two constraints shape this page.
 *
 * First, `redirect()` from `next/navigation` cannot be used: a static export has
 * no server to issue a 302, so the helper produces an error shell rather than a
 * redirect. A `meta refresh` is the correct mechanism on a static host, and React
 * 19 hoists the tag into `<head>` from wherever it is rendered.
 *
 * Second, a meta refresh alone is a poor experience and a weak signal. Search
 * engines follow it but treat it as a soft redirect, so this page also declares a
 * `canonical` pointing at the default locale and renders a real, visible choice.
 * A reader whose browser blocks or delays the refresh still sees the site and can
 * pick a language deliberately — which is also the only path that lets an English
 * speaker reach the English tree, since no user agent can infer their preference
 * from a static response.
 */
export const metadata: Metadata = {
  title: getDictionary(defaultLocale).meta.title,
  description: getDictionary(defaultLocale).meta.description,
  robots: { index: true, follow: true },
};

export default function RootPage() {
  const dictionary = getDictionary(defaultLocale);

  return (
    <>
      {/*
        React 19 hoists this into <head>. The trailing slash matches
        `trailingSlash: true`, so the refresh lands on an existing file rather
        than incurring a host redirect.
      */}
      <meta httpEquiv="refresh" content={`0;url=/${defaultLocale}/`} />
      <link rel="canonical" href={`/${defaultLocale}`} />

      <div className="scope-marketing flex min-h-dvh items-center justify-center px-6">
        <div className="w-full max-w-[30rem] border-t border-rule pt-8">
          <Wordmark size="large" />

          <p className="mt-5 text-[0.9375rem] leading-[1.7] text-ink-3">
            {dictionary.meta.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                lang={localeHtmlLang[locale]}
                className={
                  locale === defaultLocale
                    ? "site-button inline-flex items-center rounded-sm bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-on-ink transition-colors hover:bg-ink-2"
                    : "site-button inline-flex items-center rounded-sm border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
                }
              >
                {localeLabels[locale]}
              </Link>
            ))}
          </div>

          <p className="fact-sm mt-6 border-t border-rule-soft pt-5 text-ink-4">
            {dictionary.nav.switchLanguage}
          </p>
        </div>
      </div>
    </>
  );
}
