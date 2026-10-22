import Link from "next/link";
import { defaultLocale, localeLabels, locales } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { Wordmark } from "@/components/wordmark";

/**
 * NotFoundView — the 404 body, without a document around it.
 *
 * Extracted because the site needs this content in two places that cannot share
 * a layout. `app/not-found.tsx` handles `notFound()` thrown from a route segment;
 * `app/global-not-found.tsx` handles a URL that matches no route at all. The
 * second one bypasses layouts entirely in order to render at all, so the two have
 * to be composed differently even though they read identically. Keeping the copy
 * and the links here means the reader cannot get two different 404s depending on
 * how they mistyped the address.
 *
 * It renders a fragment, never a document. Whichever caller wraps it owns
 * `<html>` and `<body>`.
 *
 * Both languages are shown rather than guessed at: this route sits outside the
 * locale segment and genuinely cannot know which tree the reader wanted, and an
 * English 404 shown to a Chinese reader is a worse failure than a slightly
 * longer page.
 */
export function NotFoundView() {
  const zh = getDictionary("zh");
  const en = getDictionary("en");

  return (
    <div className="scope-marketing not-found-view flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-[38rem] border-t border-rule pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <Wordmark />
          <span className="fact-sm text-ink-4">404</span>
        </div>

        <h1 className="mt-8 text-[2.25rem] font-normal leading-tight tracking-[-0.025em]">
          {zh.notFound.title}
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-3">
          {zh.notFound.body}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${defaultLocale}`}
            className="site-button inline-flex items-center rounded-[3px] bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-on-ink transition-colors hover:bg-ink-2"
          >
            {zh.notFound.cta}
          </Link>
          {locales
            .filter((locale) => locale !== defaultLocale)
            .map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                className="site-button inline-flex items-center rounded-[3px] border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              >
                {localeLabels[locale]}
              </Link>
            ))}
        </div>

        <div className="mt-8 border-t border-rule-soft pt-6">
          <h2 className="text-[1.0625rem] font-medium text-ink">
            {en.notFound.title}
          </h2>
          <p className="measure mt-2 text-[0.9375rem] leading-[1.7] text-ink-3">
            {en.notFound.body}
          </p>
          <Link
            href="/en"
            className="mt-3 inline-block text-[0.875rem] font-medium text-signal underline underline-offset-4"
          >
            {en.notFound.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
