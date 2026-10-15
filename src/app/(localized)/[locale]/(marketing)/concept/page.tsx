import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { ProductConcept } from "@/components/product-concept";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = toLocale(raw);
  return buildMetadata({
    locale,
    title: locale === "zh" ? "产品概念" : "Product concepts",
    description: locale === "zh"
      ? "结合真实工作台，了解数字员工如何从日常工作中沉淀、被雇佣并继续协作，以及模型、Agent Harness、知识与记忆各自的职责。"
      : "Explore the real workbench: develop digital employees from daily work, hire them for future collaboration, and understand models, agent harnesses, knowledge and memory.",
    path: "/concept",
    keywords: locale === "zh"
      ? ["数字员工", "Agent Harness", "开放协作", "知识库", "个人记忆", "产品概念"]
      : ["digital employees", "agent harness", "open collaboration", "knowledge base", "personal memory", "product concepts"],
  });
}

export default async function ConceptPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = toLocale(raw);
  const dictionary = getDictionary(locale);
  const jsonLd = breadcrumbJsonLd(locale, [
    { name: dictionary.nav.home, path: "/" },
    { name: dictionary.nav.concept, path: "/concept" },
  ]);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ProductConcept locale={locale} /></>;
}
