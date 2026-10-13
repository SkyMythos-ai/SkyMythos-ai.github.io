import type { Locale } from "@/lib/i18n";
import type { DocCorpus, DocPage, DocSection } from "@/content/types";
import { zhDocs } from "@/content/docs/zh";
import { enDocs } from "@/content/docs/en";

/**
 * Documentation registry.
 *
 * The two corpora are separate trees rather than a translation map, because the
 * English documentation is written for an overseas reader evaluating the product
 * — it explains the same system, not the same sentences. Keeping them apart lets
 * each tree carry the right level of context without one constraining the other.
 *
 * `docRoutes` exists so the sitemap and the static-params generators can read the
 * route list without importing the page bodies.
 */

const corpora: Record<Locale, DocCorpus> = {
  zh: zhDocs,
  en: enDocs,
};

export function getDocCorpus(locale: Locale): DocCorpus {
  return corpora[locale];
}

export function getDocPage(locale: Locale, slug: string): DocPage | undefined {
  return corpora[locale].pages.find((page) => page.slug === slug);
}

export function getDocSection(
  locale: Locale,
  sectionId: string,
): DocSection | undefined {
  return corpora[locale].sections.find((section) => section.id === sectionId);
}

/** Every documentation slug, used by `generateStaticParams` and the sitemap. */
export function docRoutes(): string[] {
  // Both corpora are authored to the same route list, so one is sufficient.
  return corpora.zh.pages.map((page) => page.slug);
}

export type { DocCorpus, DocPage, DocSection };
