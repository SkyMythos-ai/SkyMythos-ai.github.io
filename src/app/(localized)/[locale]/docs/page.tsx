import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { DocsCatalog } from "@/components/docs-catalog";
import { buildMetadata } from "@/lib/metadata";
import { getDocCorpus } from "@/content/registry";
import { buildDocNav } from "@/content/types";

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

/** 从实际工作入口进入手册，全文目录保留无脚本可读的静态内容。 */
export default async function DocsIndexPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = toLocale(raw);
  const corpus = getDocCorpus(locale);
  const groups = buildDocNav(corpus).map(group => ({ ...group, pages: group.pages.map(({ slug, title, summary }) => ({ slug, title, summary })) }));
  const zh = locale === "zh";
  const paths = zh ? [
    { href: "getting-started/overview", title: "开始使用", detail: "选择工作入口，完成第一次交付。" },
    { href: "guides/digital-employees", title: "完成与复用", detail: "培养员工，留下方法与知识。" },
    { href: "management/usage", title: "企业管理", detail: "核对使用记录、估算费用与模型策略。" },
    { href: "getting-started/deployment", title: "部署运维", detail: "部署、接入、授权与验收。" },
  ] : [
    { href: "getting-started/overview", title: "Get started", detail: "Choose an entry point and make your first delivery." },
    { href: "guides/digital-employees", title: "Deliver and reuse", detail: "Develop employees, methods and knowledge." },
    { href: "management/usage", title: "Manage your organisation", detail: "Review usage, estimated costs and model policies." },
    { href: "getting-started/deployment", title: "Deploy and operate", detail: "Deployment, connections, access and acceptance." },
  ];
  return <div className="docs-home">
    <section className="docs-home-intro">
      <div><h1>{zh ? "把工作做成的使用指南。" : "Guides for getting work done."}</h1><p>{zh ? "从第一项工作到企业部署，找到当前需要的操作与边界。" : "From your first job to enterprise deployment, find the steps and boundaries you need."}</p></div>
    </section>
    <DocsCatalog groups={groups} locale={locale}>
      <nav className="docs-starting-points" aria-label={zh ? "常用操作" : "Common actions"}>{paths.map(path => <Link key={path.href} href={localePath(locale, `/docs/${path.href}`)}><span><strong>{path.title}</strong><span>{path.detail}</span></span><span aria-hidden="true">↗</span></Link>)}</nav>
    </DocsCatalog>
  </div>;
}
