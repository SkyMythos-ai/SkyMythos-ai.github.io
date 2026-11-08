import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { capabilities } from "@/components/sites/fusion/content";
import { SiteShell } from "@/components/sites/fusion/site-shell";
import styles from "@/components/sites/fusion/site.module.css";

export function generateStaticParams() {
  return capabilities.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const capability = capabilities.find((item) => item.slug === slug);
  return {
    title: capability?.name || "产品能力",
    description: capability?.summary,
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const capability = capabilities.find((item) => item.slug === slug);
  if (!capability) notFound();
  return (
    <SiteShell>
      <main
        id="main-content"
        className={`${styles.container} ${styles.article}`}
      >
        <div className={styles.articleHeader}>
          <nav className={styles.breadcrumbs} aria-label="面包屑">
            <Link href="/">首页</Link>
            <ChevronRight size={13} />
            <span>{capability.name}</span>
          </nav>
          <h1>{capability.title}</h1>
          <p className={styles.articleLead}>{capability.description}</p>
          <div className={styles.articleActions}>
            <Link className={styles.primaryLink} href="/poc">
              申请 POC <ArrowRight size={16} />
            </Link>
            <Link className={styles.secondaryLink} href="/docs">
              阅读指南
            </Link>
          </div>
        </div>
        <div className={styles.articleContent}>
          <nav className={styles.articleNav} aria-label="产品能力">
            <p>产品能力</p>
            {capabilities.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                aria-current={item.slug === slug ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className={styles.articleBody}>
            {capability.points.map((point, index) => (
              <section key={point.title} id={`point-${index}`}>
                <h2>{point.title}</h2>
                <p>{point.text}</p>
              </section>
            ))}
            <aside className={styles.articleNote}>
              从一个范围明确的工作开始，先约定目标、授权和验收标准，再用真实结果决定如何扩大使用。
            </aside>
            <div className={styles.articleActions}>
              <Link className={styles.textLink} href="/docs/private-deployment">
                了解企业接入 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
