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
 *
 * Structurally this is a ruled sheet on grey ground rather than three lists
 * floating on the same grey. The article sits on `surface` — the one place on
 * the site that earns a white field, because it is the one place a reader stays
 * for minutes — and the two side columns are divided from it by vertical
 * hairlines rather than by whitespace alone. The design language claims every
 * divider comes from the `rule` scale; before this, the three columns of the
 * documentation page were the exception that proved it. The rules and the paper
 * are edge-to-edge bands rather than one bordered box, so each column keeps its
 * own scroll and its own sticky offset.
 *
 * The measure is 46rem. At the raised prose size that lands Chinese near 44
 * characters and Latin near 76 — inside the band a Chinese column wants and
 * within what Latin tolerates for reference reading.
 */
const readingMeasure = "max-w-[46rem]";

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

      <details className="docs-mobile-contents">
        <summary>{locale === "zh" ? "文档目录" : "Browse documentation"}</summary>
        <nav aria-label={dictionary.docs.sidebarLabel}>
          {nav.map(group => <section key={group.id}><h2>{group.title}</h2><ul>{group.pages.map(item => <li key={item.slug}><Link href={localePath(locale, `/docs/${item.slug}`)} aria-current={item.slug === slug ? "page" : undefined}>{item.title}</Link></li>)}</ul></section>)}
        </nav>
      </details>
      <div className="docs-reading-layout mx-auto flex max-w-[90rem] px-6 md:px-10 lg:px-14">
        <DocsSidebar
          locale={locale}
          nav={nav}
          activeSlug={slug}
          label={dictionary.docs.sidebarLabel}
        />

        {/*
          The reading sheet. The vertical hairline on each side is the left
          border of the article, so the rule belongs to the paper rather than to
          the gutter: it travels with the column and stops where the column stops,
          instead of running the full height of the viewport.
        */}
        <article
          className={cn(
            "docs-reading-article min-w-0 flex-1 py-10 md:py-12",
            "border-x border-rule bg-surface",
            "px-6 md:px-10 lg:px-12",
          )}
        >
          <div className={cn("mx-auto", readingMeasure)}>
            {/*
              The trail lives in `DocHeader` — the manual links back to its own
              index there. A second breadcrumb above the title said the same
              thing twice in the same type size.
            */}
            <DocHeader
              indexLabel={dictionary.docs.title}
              indexHref={localePath(locale, "/docs")}
              sectionTitle={section.title}
              title={page.title}
              summary={page.summary}
              readingMinutes={minutes}
              readTimeLabel={dictionary.docs.readTime}
              minutesLabel={dictionary.docs.minutes}
            />

            <MarkdownRenderer content={page.body} locale={locale} className="mt-10" />

            {/* Previous / next walk the whole manual in reading order. */}
            <nav
              aria-label={dictionary.docs.backToIndex}
              className="docs-article-footer mt-16 grid gap-4 border-t border-rule pt-8 sm:grid-cols-2"
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
          </div>
        </article>

        <TableOfContents entries={toc} label={dictionary.docs.onThisPage} />
      </div>
    </>
  );
}
