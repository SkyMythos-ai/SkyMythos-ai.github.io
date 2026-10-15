import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { ConsoleFigure } from "@/components/console-figure";
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
    { href: "getting-started/first-task", title: "开始第一个任务", detail: "从任务要求到审阅结果。" },
    { href: "guides/digital-employees", title: "培养与雇佣员工", detail: "让工作经验成为可复用的能力。" },
    { href: "guides/knowledge-base", title: "使用项目知识", detail: "发布资料，检索并核对来源。" },
  ] : [
    { href: "getting-started/first-task", title: "Start your first task", detail: "From a work request to a reviewable result." },
    { href: "guides/digital-employees", title: "Develop and hire employees", detail: "Turn work experience into reusable capability." },
    { href: "guides/knowledge-base", title: "Use project knowledge", detail: "Publish, retrieve and check the sources." },
  ];
  return <div className="docs-home">
    <section className="docs-home-intro">
      <div><h1>{zh ? "让第一份工作，顺利交付。" : "Make your first delivery."}</h1><p>{zh ? "从对话发起工作，培养或雇佣员工，再查看任务进展。跟着实际界面，完成下一步。" : "Start a conversation, develop or hire an employee, and follow the work through. The guides follow the actual Console."}</p><Link className="docs-primary-link" href={localePath(locale, "/docs/getting-started/overview")}>{zh ? "开始使用" : "Get started"}<span aria-hidden="true">↗</span></Link></div>
      <ConsoleFigure locale={locale} screen="workspace"/>
    </section>
    <nav className="docs-starting-points" aria-label={zh ? "常用操作" : "Common actions"}>{paths.map(path => <Link key={path.href} href={localePath(locale, `/docs/${path.href}`)}><span><strong>{path.title}</strong><span>{path.detail}</span></span><span aria-hidden="true">↗</span></Link>)}</nav>
    <DocsCatalog groups={groups} locale={locale}/>
  </div>;
}
