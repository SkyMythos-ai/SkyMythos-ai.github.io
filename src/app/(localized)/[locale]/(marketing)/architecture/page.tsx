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
      ? "了解 SkyMythos 的工作组织、个人云环境、任务 Sandbox 与模型和业务系统接入，核对身份、授权、凭据和交付证据，并查看客户环境的参考部署。"
      : "Explore work coordination, personal environments, task Sandboxes and model and system integrations. Inspect identity, access, credentials and delivery evidence, with a reference deployment.",
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
