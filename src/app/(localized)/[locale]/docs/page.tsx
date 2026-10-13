import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata } from "@/lib/metadata";
import { getDocCorpus } from "@/content/registry";
import { buildDocNav } from "@/content/types";
import { readingMinutes } from "@/lib/headings";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/primitives";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = toLocale(raw);
  const dictionary = getDictionary(locale);

  return buildMetadata({
    locale,
    title: dictionary.docs.title,
    description: dictionary.docs.description,
    path: "/docs",
    keywords:
      locale === "zh"
        ? ["使用文档", "部署指南", "操作手册", "领域术语", "常见问题"]
        : [
            "documentation",
            "deployment guide",
            "operations manual",
            "domain glossary",
            "FAQ",
          ],
  });
}

/**
 * Documentation index.
 *
 * Serves as both the entry point and the table of contents for the whole manual.
 * Each section is listed in reading order with its pages, their summaries, and
 * their estimated reading time — the reading time is the useful part, because it
 * tells a reader scanning for one answer whether they are about to open a
 * two-minute page or a twelve-minute one.
 */
export default async function DocsIndexPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = toLocale(raw);
  const dictionary = getDictionary(locale);
  const corpus = getDocCorpus(locale);
  const nav = buildDocNav(corpus);

  const totalPages = corpus.pages.length;

  return (
    <>
      <PageHeader
        rail={dictionary.nav.docs}
        title={dictionary.docs.title}
        lede={dictionary.docs.lede}
        meta={`${totalPages} ${locale === "zh" ? "篇" : "pages"}`}
      />

      {nav.map((group) => (
        <Section key={group.id} rail={group.title} divided width="wide">
          <p className="measure mb-8 text-[0.9375rem] leading-[1.7] text-ink-3">
            {group.description}
          </p>

          <ul>
            {group.pages.map((page, index) => (
              <li key={page.slug} className="border-t border-rule">
                <Link
                  href={localePath(locale, `/docs/${page.slug}`)}
                  className="group grid gap-x-6 gap-y-2 py-5 transition-colors lg:grid-cols-[2.5rem_minmax(0,1fr)_6rem]"
                >
                  <span className="fact-sm text-ink-4 lg:pt-[3px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                      {page.title}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 10 10"
                        className="h-2.5 w-2.5 text-ink-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M2 5h6M5.4 2.4 8 5l-2.6 2.6" />
                      </svg>
                    </span>
                    <span className="measure mt-1.5 block text-[0.875rem] leading-[1.65] text-ink-3">
                      {page.summary}
                    </span>
                  </div>

                  <span className="fact-sm text-ink-4 lg:pt-[3px] lg:text-right">
                    {readingMinutes(page.body)} {dictionary.docs.minutes}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <div className="pb-24 md:pb-28" />
    </>
  );
}
