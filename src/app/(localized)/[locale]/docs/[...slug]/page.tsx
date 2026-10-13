import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { locales, localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import {
  getDocCorpus,
  getDocPage,
  getDocSection,
  docRoutes,
} from "@/content/registry";
import { buildDocNav, docNeighbours } from "@/content/types";
import { extractToc, readingMinutes } from "@/lib/headings";
import { cn } from "@/lib/cn";
import { DocHeader } from "@/components/page-header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { TableOfContents } from "@/components/table-of-contents";

interface PageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

/**
 * Static params for every documentation page in every locale.
 *
 * The slug is a catch-all so nested paths like `concepts/preflight` resolve,
 * which is what lets the documentation grow a deeper hierarchy without a route
 * restructure.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    docRoutes().map((slug) => ({
      locale,
      slug: slug.split("/"),
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug: rawSlug } = await params;
  const locale = toLocale(raw);
  const slug = rawSlug.join("/");
  const page = getDocPage(locale, slug);
  const section = getDocSection(locale, page?.section ?? "");

  if (!page) {
    return buildMetadata({
      locale,
      title: "Not found",
      description: "",
      path: `/docs/${slug}`,
    });
  }

  /**
   * The page summary becomes the meta description. It is written for exactly
   * this purpose — one sentence stating what the page answers — so no separate
   * SEO description field is needed, and the two can never drift apart.
   */
  return buildMetadata({
    locale,
    title: section ? `${page.title} — ${section.title}` : page.title,
    description: page.summary,
    path: `/docs/${page.slug}`,
    type: "article",
  });
}

/**
 * Documentation page.
 *
 * Three-column desktop layout: the manual contents on the left, the article in
 * the centre at reading measure, and the on-this-page index on the right. Both
 * side columns are sticky, so a reader who scrolls a long page keeps their
 * position in the manual visible.
 *
 * The centre column is the only one that scrolls. This is why documentation gets
 * its own layout rather than reusing the marketing `Section` primitive: the
 * reading mode is fundamentally different.
 */
export default async function DocPage({ params }: PageProps) {
  const { locale: raw, slug: rawSlug } = await params;
  const locale: Locale = toLocale(raw);
  const slug = rawSlug.join("/");

  const corpus = getDocCorpus(locale);
  const page = getDocPage(locale, slug);
  const section = page ? getDocSection(locale, page.section) : undefined;

  if (!page || !section) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const nav = buildDocNav(corpus);
  const { previous, next } = docNeighbours(corpus, slug);
  const toc = extractToc(page.body);
  const minutes = readingMinutes(page.body);

  const jsonLd = breadcrumbJsonLd(locale, [
    { name: dictionary.nav.home, path: "/" },
    { name: dictionary.docs.title, path: "/docs" },
    { name: section.title, path: `/docs/${page.slug}` },
    { name: page.title, path: `/docs/${page.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto flex max-w-[90rem] gap-x-10 px-6 md:px-10 lg:px-14">
        <DocsSidebar
          locale={locale}
          nav={nav}
          activeSlug={slug}
          label={dictionary.docs.sidebarLabel}
        />

        <article className="min-w-0 flex-1 py-12 md:py-14">
          {/*
            A single hop back to the manual index. Labelled with the section's
            own name rather than the sidebar's label, so the two do not read as
            the same control rendered twice.
          */}
          <nav aria-label={dictionary.docs.backToIndex} className="mb-8">
            <Link
              href={localePath(locale, "/docs")}
              className="fact-sm text-ink-4 transition-colors hover:text-ink-2"
            >
              {dictionary.docs.title}
            </Link>
          </nav>

          <DocHeader
            sectionTitle={section.title}
            title={page.title}
            summary={page.summary}
            readingMinutes={minutes}
            readTimeLabel={dictionary.docs.readTime}
            minutesLabel={dictionary.docs.minutes}
          />

          <MarkdownRenderer content={page.body} className="mt-10 max-w-[46rem]" />

          {/* Previous / next walk the whole manual in reading order. */}
          <nav
            aria-label={dictionary.docs.backToIndex}
            className="mt-16 grid gap-4 border-t border-rule pt-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={localePath(locale, `/docs/${previous.slug}`)}
                className="group rounded-panel border border-rule p-4 transition-colors hover:border-rule-strong"
              >
                <span className="rail-label">{dictionary.docs.previous}</span>
                <span className="mt-1.5 block text-[0.9375rem] font-medium text-ink">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            {next ? (
              <Link
                href={localePath(locale, `/docs/${next.slug}`)}
                className={cn(
                  "group rounded-panel border border-rule p-4 transition-colors",
                  "hover:border-rule-strong sm:text-right",
                )}
              >
                <span className="rail-label">{dictionary.docs.next}</span>
                <span className="mt-1.5 block text-[0.9375rem] font-medium text-ink">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        </article>

        <TableOfContents
          entries={toc}
          label={dictionary.docs.onThisPage}
        />
      </div>
    </>
  );
}
