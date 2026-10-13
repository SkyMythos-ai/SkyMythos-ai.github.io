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
      <div className="mx-auto max-w-[90rem] pb-12 pt-14 md:pb-14 md:pt-16">
        <div className="flex items-baseline justify-between gap-4">
          <span className="rail-label">{rail}</span>
          {meta ? <span className="fact-sm text-ink-4">{meta}</span> : null}
        </div>

        <h1 className="mt-6 max-w-[22ch] text-[2.1rem] leading-[1.16] tracking-[-0.026em] md:text-[2.6rem]">
          {title}
        </h1>

        <p className="measure mt-5 text-[1rem] leading-[1.72] text-ink-2">{lede}</p>
      </div>
    </section>
  );
}

/**
 * DocHeader — the header used by documentation pages.
 *
 * Same grid and type scale as `PageHeader`, but the rail carries the section
 * name and the meta slot carries reading time. Documentation is a different
 * reading mode from marketing copy, so it gets its own entry point rather than a
 * pile of conditional props on the shared one.
 */
export function DocHeader({
  sectionTitle,
  title,
  summary,
  readingMinutes,
  readTimeLabel,
  minutesLabel,
}: {
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
        <span className="rail-label">{sectionTitle}</span>
        <span className="fact-sm text-ink-4">
          {readTimeLabel} {readingMinutes} {minutesLabel}
        </span>
      </div>

      <h1 className="mt-5 max-w-[26ch] text-[1.9rem] leading-[1.2] tracking-[-0.022em] md:text-[2.25rem]">
        {title}
      </h1>

      <p className="measure mt-4 text-[1rem] leading-[1.7] text-ink-3">{summary}</p>
    </header>
  );
}
