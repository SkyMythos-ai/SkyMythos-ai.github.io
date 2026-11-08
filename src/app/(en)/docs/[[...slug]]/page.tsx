import { DocumentationPageContent, getDocumentationMetadata } from "@/components/docs/page";
import { getDocsSource } from "@/lib/docs-source";

type PageProps = { params: Promise<{ slug?: string[] }> };

export function generateStaticParams() {
  return getDocsSource("en").generateParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return getDocumentationMetadata({ locale: "en", slug });
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug } = await params;
  return <DocumentationPageContent locale="en" slug={slug} />;
}
