import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { SpecPanel } from "@/components/spec-panel";

/**
 * Hero — the opening statement of the site.
 *
 * The design decision here is what to lead with. Every developer platform opens
 * with a screenshot of its own dashboard, which tells a reader nothing they could
 * not already guess. The most characteristic object in this product's world is
 * instead the frozen execution specification: a document that is resolved, checked
 * and sealed with a content digest before a single line of code is generated.
 * That object is what distinguishes the product, so it is what the hero shows.
 *
 * Concretely: the headline and lede occupy the left column at a reading measure,
 * and a specification panel occupies the right. The panel runs one composed
 * animation on load — the preflight checks resolve in sequence, a scan sweeps
 * across, and a digest seal drops into place — after which nothing moves again.
 * There is no scroll-triggered motion anywhere on the site.
 */
export function Hero({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  return (
    <section className="border-b border-rule px-6 md:px-10 lg:px-14">
      <div className="mx-auto grid max-w-[90rem] gap-x-14 gap-y-14 py-16 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:py-24">
        <div>
          <h1 className="reveal max-w-[19ch] text-[2.35rem] leading-[1.14] tracking-[-0.028em] md:text-[3.1rem] lg:text-[3.35rem]">
            {dictionary.hero.headline}
          </h1>

          <p
            className="reveal measure mt-7 text-[1rem] leading-[1.7] text-ink-2 md:text-[1.0625rem]"
            style={{ animationDelay: "80ms" }}
          >
            {dictionary.hero.lede}
          </p>

          <div
            className="reveal mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "160ms" }}
          >
            <Link
              href={localePath(locale, "/docs/getting-started/overview")}
              className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-ink-2"
            >
              {dictionary.hero.primaryCta}
              {/*
                The arrow sits inside its own hairline disc so it reads as a
                separate instrument from the label — the same boundary motif
                used in the wordmark and the seal.
              */}
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/25">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 10 10"
                  className="h-2.5 w-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 5h6M5.4 2.4 8 5l-2.6 2.6" />
                </svg>
              </span>
            </Link>

            <Link
              href={localePath(locale, "/concept")}
              className="inline-flex items-center rounded-sm border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
            >
              {dictionary.hero.secondaryCta}
            </Link>
          </div>
        </div>

        <SpecPanel locale={locale} />
      </div>
    </section>
  );
}
