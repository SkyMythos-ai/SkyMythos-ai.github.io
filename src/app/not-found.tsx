import Link from "next/link";
import type { Metadata } from "next";
import { defaultLocale, localeLabels, locales } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { Wordmark } from "@/components/wordmark";
import { productName } from "@/lib/site";

/**
 * The 404 carries its own title. Without one, the browser tab shows the raw URL
 * — and because this is the page a mistyped address lands on, that is exactly
 * where a readable title helps most. Both languages are included, since this
 * route cannot know which tree the reader meant to reach.
 */
export const metadata: Metadata = {
  title: `404 · 页面不存在 | Page not found · ${productName}`,
  robots: { index: false, follow: true },
};

/**
 * Not found.
 *
 * This file sits outside the locale segment, so it cannot know which language the
 * reader wants. Rather than guess, it shows both, which for a two-locale site
 * costs one extra block and avoids showing an English 404 to a Chinese reader.
 *
 * It renders a fragment, not a document. The root layout already supplies `<html>`
 * and `<body>`; rendering them again here produced a nested document in the
 * exported `404.html`, which is invalid HTML. Because GitHub Pages serves this
 * file for any unmatched path, it is also the page most likely to be hit by a
 * mistyped URL, so the links back into the site matter more here than the
 * apology does.
 */
export default function NotFound() {
  const zh = getDictionary("zh");
  const en = getDictionary("en");

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-[34rem] border-t border-rule pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <Wordmark />
          <span className="fact-sm text-ink-4">404</span>
        </div>

        <h1 className="mt-6 text-[1.75rem] leading-tight tracking-[-0.02em]">
          {zh.notFound.title}
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-3">
          {zh.notFound.body}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/${defaultLocale}`}
            className="inline-flex items-center rounded-sm bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-ink-2"
          >
            {zh.notFound.cta}
          </Link>
          {locales
            .filter((locale) => locale !== defaultLocale)
            .map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                className="inline-flex items-center rounded-sm border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              >
                {localeLabels[locale]}
              </Link>
            ))}
        </div>

        <div className="mt-8 border-t border-rule-soft pt-6">
          <h2 className="text-[1.0625rem] font-semibold text-ink">
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
