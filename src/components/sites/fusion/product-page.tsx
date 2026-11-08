import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getCapabilities } from "./content";
import { SiteShell } from "./site-shell";
import styles from "./site.module.css";

export function ProductDetail({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const capabilities = getCapabilities(locale);
  const capability = capabilities.find((item) => item.slug === slug);
  if (!capability) notFound();
  const zh = locale === "zh";
  return (
    <SiteShell>
      <main id="main-content" className={`${styles.container} ${styles.article}`}>
        <div className={styles.articleHeader}>
          <nav className={styles.breadcrumbs} aria-label={zh ? "面包屑" : "Breadcrumb"}>
            <Link href={localizeHref("/", locale)}>{zh ? "首页" : "Home"}</Link>
            <ChevronRight size={13} />
            <span>{capability.name}</span>
          </nav>
          <h1>{capability.title}</h1>
          <p className={styles.articleLead}>{capability.description}</p>
          <div className={styles.articleActions}>
            <Link className={styles.primaryLink} href={localizeHref("/poc", locale)}>
              {zh ? "申请 POC" : "Request a POC"} <ArrowRight size={16} />
            </Link>
            <Link className={styles.secondaryLink} href={localizeHref("/docs", locale)}>
              {zh ? "阅读指南" : "Read the guides"}
            </Link>
          </div>
        </div>
        <div className={styles.articleContent}>
          <nav className={styles.articleNav} aria-label={zh ? "产品能力" : "Product capabilities"}>
            <p>{zh ? "产品能力" : "Product capabilities"}</p>
            {capabilities.map((item) => (
              <Link
                key={item.slug}
                href={localizeHref(`/product/${item.slug}`, locale)}
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
              {zh
                ? "从一个范围明确的工作开始，先约定目标、授权和验收标准，再用真实结果决定如何扩大使用。"
                : "Start with a clearly scoped task. Agree on goals, permissions and acceptance criteria, then use real results to decide how to expand."}
            </aside>
            <div className={styles.articleActions}>
              <Link className={styles.textLink} href={localizeHref("/docs/private-deployment", locale)}>
                {zh ? "了解企业接入" : "Explore enterprise setup"} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
