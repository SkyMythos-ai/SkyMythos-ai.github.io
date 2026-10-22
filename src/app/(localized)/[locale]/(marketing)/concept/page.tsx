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
    title: locale === "zh" ? "工作方式" : "How it works",
    description: locale === "zh"
      ? "跟随订单导出示例核对目标、执行与交付，区分工作产物、运行记录与经人确认的可复用资产，了解数字员工培养与使用记录的可见边界。"
      : "Follow an order-export example from goal to delivery. Distinguish outputs, run records and curated assets; understand employee formation and usage visibility.",
    path: "/concept",
    keywords: locale === "zh"
      ? ["工作方式", "SkyBot", "数字员工", "研发任务", "自动化", "经验复用"]
      : ["how it works", "SkyBot", "digital employees", "engineering tasks", "automation", "experience reuse"],
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
