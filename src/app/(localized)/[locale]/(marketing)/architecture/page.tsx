import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { ProductArchitecture } from "@/components/product-architecture";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = toLocale(raw);
  return buildMetadata({
    locale,
    title: locale === "zh" ? "企业架构" : "Enterprise architecture",
    description: locale === "zh"
      ? "了解工作组织、企业资产与执行环境如何连接，核对授权、内容审计、用量计量和模型月额度的 Task 准入边界，以及客户环境的参考部署。"
      : "Explore work coordination, company assets and execution environments. Inspect access, content audits, usage metering and monthly task-admission policies, with a reference deployment.",
    path: "/architecture",
    keywords: locale === "zh"
      ? ["系统架构", "控制面", "Agent Runner", "Agent Harness", "Sandbox Provider", "状态权威"]
      : ["system architecture", "control plane", "agent runner", "agent harness", "sandbox provider", "state authority"],
  });
}

export default async function ArchitecturePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = toLocale(raw);
  const dictionary = getDictionary(locale);
  const jsonLd = breadcrumbJsonLd(locale, [
    { name: dictionary.nav.home, path: "/" },
    { name: dictionary.nav.architecture, path: "/architecture" },
  ]);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><ProductArchitecture locale={locale} /></>;
}
