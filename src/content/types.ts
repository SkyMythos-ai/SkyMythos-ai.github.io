import type { Locale } from "@/lib/i18n";

/**
 * Documentation content model.
 *
 * Bodies are Markdown (GFM) strings rendered through `react-markdown` at build
 * time, so every doc page is shipped as pre-rendered HTML. Keeping the source as
 * Markdown rather than a component DSL means the docs stay diffable and portable
 * — they can be lifted into the product repository's own `docs/` tree without
 * translation.
 */

export type DocSectionId =
  | "getting-started"
  | "concepts"
  | "guides"
  | "management"
  | "operations"
  | "reference";

export interface DocPage {
  /** URL slug within `/docs`, e.g. `concepts/preflight`. */
  slug: string;
  /** Section this page belongs to; drives sidebar grouping. */
  section: DocSectionId;
  /** Page title, shown as the H1 and in navigation. */
  title: string;
  /** One-line summary: used in meta description, doc cards and search. */
  summary: string;
  /** Markdown body. Must not repeat the H1 — the page renders it from `title`. */
  body: string;
  /** Slugs this page should be read after. Drives the "previous" control. */
  readingOrder: number;
}

export interface DocSection {
  id: DocSectionId;
  title: string;
  /** Why this group exists — shown once at the top of the section. */
  description: string;
}

export interface DocCorpus {
  locale: Locale;
  sections: DocSection[];
  pages: DocPage[];
}

/** Navigation entry for the docs sidebar, with its children resolved. */
export interface DocNavGroup extends DocSection {
  pages: DocPage[];
}

/**
 * Group a corpus into sidebar navigation, ordered by the section definition
 * rather than by array position, and within each section by `readingOrder`.
 */
export function buildDocNav(corpus: DocCorpus): DocNavGroup[] {
  return corpus.sections.map((section) => ({
    ...section,
    pages: corpus.pages
      .filter((page) => page.section === section.id)
      .sort((a, b) => a.readingOrder - b.readingOrder),
  }));
}

/**
 * Resolve the previous and next page across the whole corpus in reading order,
 * so the footer controls walk the manual the way a reader would.
 */
export function docNeighbours(
  corpus: DocCorpus,
  slug: string,
): { previous: DocPage | null; next: DocPage | null } {
  const ordered = corpus.sections.flatMap((section) =>
    corpus.pages
      .filter((page) => page.section === section.id)
      .sort((a, b) => a.readingOrder - b.readingOrder),
  );

  const index = ordered.findIndex((page) => page.slug === slug);

  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
