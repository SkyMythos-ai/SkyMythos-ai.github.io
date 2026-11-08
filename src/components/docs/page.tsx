import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { getMDXComponents } from "@/components/docs/mdx";
import { getDocsSource } from "@/lib/docs-source";
import { localizedMetadata, type Locale } from "@/lib/i18n";

type PageProps = { slug?: string[]; locale: Locale };

export function getDocumentationMetadata({
  slug,
  locale,
}: PageProps): Metadata {
  const page = getDocsSource(locale).getPage(slug);
  if (!page) notFound();
  return localizedMetadata(locale, `/docs${slug?.length ? `/${slug.join("/")}` : ""}`, page.data.title, page.data.description);
}

export function DocumentationPageContent({ slug, locale }: PageProps) {
  const page = getDocsSource(locale).getPage(slug);
  if (!page) notFound();
  const Content = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Content components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
