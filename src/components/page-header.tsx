import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * PageHeader — the opening band of a non-home page.
 *
 * One component so every interior page opens with identical typographic rhythm:
 * the section name in the gutter, an optional meta value on the right, the title
 * at a consistent size, and the lede at the standard measure. Without this, each
 * page invents its own header proportions and the site loses its spine.
 *
 * The right-aligned `meta` slot carries a count or a language tag — a fact about
 * the page, which is why it is set in mono.
 *
 * On the marketing pages this is the second-loudest type on the page, one step
 * below the home hero and one above a chapter heading. It uses the fluid scale so
 * an interior page's opening statement carries the same weight as the home page's
 * without repeating its exact size.
 */
export function PageHeader({
  rail,
  title,
  lede,
  meta,
  className,
}: {
  rail: string;
  title: string;
  lede: string;
  meta?: string;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-rule px-6 md:px-10 lg:px-14", className)}>
      <div className="mx-auto max-w-[90rem] pb-16 pt-16 md:pb-20 md:pt-20">
        <div className="flex items-baseline justify-between gap-4">
          <span className="rail-label">{rail}</span>
          {meta ? <span className="fact-sm text-ink-4">{meta}</span> : null}
        </div>

        <h1 className="mt-7 max-w-[20ch] text-chapter font-semibold">{title}</h1>

        <p className="measure mt-6 text-lead text-ink-2">{lede}</p>
      </div>
    </section>
  );
}

/**
 * DocHeader — the header used by documentation pages.
 *
 * Documentation is a different reading mode from marketing copy, so it gets its
 * own entry point rather than a pile of conditional props on `PageHeader`.
 *
 * Two departures from the marketing header, both for the same reason — a reader
 * deep in the manual needs to know where they are, and a header that repeats
 * itself wastes the one row it has:
 *
 * 1. The trail is a single breadcrumb line rather than a bare section name. A
 *    reader arriving from a search result has no idea that "快速开始" is a
 *    chapter of a larger manual, so the manual names itself first and links back
 *    to its index.
 * 2. The summary is set to the article's own measure, not the marketing `.measure`.
 *    The two widths are close enough to look like a mistake and different enough
 *    that the right edge of the summary never lines up with the right edge of the
 *    prose beneath it.
 */
export function DocHeader({
  indexLabel,
  indexHref,
  sectionTitle,
  title,
  summary,
  readingMinutes,
  readTimeLabel,
  minutesLabel,
}: {
  indexLabel: string;
  indexHref: string;
  sectionTitle: string;
  title: string;
  summary: string;
  readingMinutes: number;
  readTimeLabel: string;
  minutesLabel: string;
}) {
  return (
    <header className="border-b border-rule pb-8">
      <div className="flex items-baseline justify-between gap-4">
        <nav aria-label={indexLabel} className="fact-sm min-w-0">
          <Link
            href={indexHref}
            className="text-ink-4 transition-colors hover:text-ink-2"
          >
            {indexLabel}
          </Link>
          <span aria-hidden="true" className="px-2 text-rule-strong">
            /
          </span>
          <span className="text-ink-3">{sectionTitle}</span>
        </nav>

        <span className="fact-sm shrink-0 text-ink-4">
          {readTimeLabel} {readingMinutes} {minutesLabel}
        </span>
      </div>

      <h1 className="mt-5 max-w-[26ch] text-[1.9rem] leading-[1.2] tracking-[-0.022em] md:text-[2.25rem]">
        {title}
      </h1>

      <p className="mt-4 text-[1rem] leading-[1.7] text-ink-3">{summary}</p>
    </header>
  );
}
