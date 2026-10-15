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
    title: locale === "zh" ? "系统架构" : "System architecture",
    description: locale === "zh"
      ? "沿一次真实任务理解 Console、控制面、运行器、Agent Harness 与隔离环境的职责边界，并从任务页面追踪执行、产物和交付。"
      : "Follow a task through the console, control plane, runner, agent harness and isolated environment. Trace execution, outputs and delivery from the task interface.",
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
