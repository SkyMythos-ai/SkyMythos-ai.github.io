"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import type { DocNavGroup } from "@/content/types";

type CatalogGroup = Omit<DocNavGroup, "pages"> & { pages: { slug: string; title: string; summary: string }[] };

/** 搜索只接收标题和摘要；文章正文继续在服务端生成。 */
export function DocsCatalog({ groups, locale, children }: { groups: CatalogGroup[]; locale: Locale; children?: ReactNode }) {
  const [query, setQuery] = useState("");
  const zh = locale === "zh";
  const words = query.normalize("NFKC").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const results = groups.map(group => ({ ...group, pages: group.pages.filter(page => words.every(word => `${page.title} ${page.summary} ${page.slug}`.toLocaleLowerCase().includes(word))) })).filter(group => group.pages.length);
  const count = results.reduce((total, group) => total + group.pages.length, 0);
  return <section className="docs-catalog" aria-labelledby="docs-catalog-heading">
    <div className="docs-catalog-header">
      <div><h2 id="docs-catalog-heading">{zh ? "查找操作与说明" : "Find a guide"}</h2><p>{zh ? "按标题和摘要搜索，或从下面的分类开始。" : "Search titles and summaries, or browse a topic below."}</p></div>
      <div className="docs-search"><label htmlFor="docs-search">{zh ? "搜索文档" : "Search documentation"}</label><div><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input id="docs-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={zh ? "搜索任务、员工、知识库…" : "Search tasks, employees, knowledge…"}/>{query && <button type="button" onClick={() => setQuery("")} aria-label={zh ? "清除搜索" : "Clear search"}>×</button>}</div></div>
    </div>
    {children}
    <div className="docs-catalog-meta"><nav aria-label={zh ? "文档分类" : "Documentation topics"}>{results.map(group => <a key={group.id} href={`#docs-${group.id}`}>{group.title}</a>)}</nav><p role="status" aria-live="polite">{zh ? `${count} 篇文档` : `${count} guides`}</p></div>
    {results.length ? results.map(group => <section className="docs-topic" id={`docs-${group.id}`} key={group.id} aria-labelledby={`docs-heading-${group.id}`}>
      <div><h3 id={`docs-heading-${group.id}`}>{group.title}</h3><p>{group.description}</p></div>
      <ul>{group.pages.map(page => <li key={page.slug}><Link href={localePath(locale, `/docs/${page.slug}`)}><span><strong>{page.title}</strong><span>{page.summary}</span></span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg></Link></li>)}</ul>
    </section>) : <p className="docs-search-empty">{zh ? "没有匹配的文档，试试“任务”“员工”或“知识库”。" : "No guides match. Try “task”, “employee” or “knowledge”."}</p>}
  </section>;
}
