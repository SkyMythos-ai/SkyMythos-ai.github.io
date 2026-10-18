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
      ? "按工作性质选择对话协作、研发任务或自动化。跟随订单导出示例核对目标、执行与交付，再了解工作记录和经验如何经人确认形成数字员工。"
      : "Choose conversation, engineering tasks or automation. Follow an order-export example from goal to delivery, then see how curated work records and experience form a digital employee.",
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
