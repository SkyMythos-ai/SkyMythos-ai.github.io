"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Check, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getRoleSolutions, type RoleSlug } from "./solutions-data";
import site from "./site.module.css";
import styles from "./solutions.module.css";

/** 首页岗位解决方案交互预览：零冗余副标题 + 左要点列表 + 右提问与交付预览。 */
export function RoleSolutionsPreview({ locale = "en" }: { locale?: Locale }) {
  const solutions = getRoleSolutions(locale);
  const [selectedSlug, setSelectedSlug] = useState<RoleSlug>("hr");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);
  const current = solutions.find((item) => item.slug === selectedSlug) ?? solutions[0];
  const featuredSubgroup = current.subgroups[0];
  const featured = featuredSubgroup.scenarios[0];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % solutions.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + solutions.length) % solutions.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = solutions.length - 1;
    else return;
    event.preventDefault();
    setSelectedSlug(solutions[next].slug);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className={styles.previewSection} id="solutions" aria-labelledby={`${id}-heading`}>
      <div className={site.container}>
        <header className={styles.previewHeader}>
          <h2 id={`${id}-heading`}>
            {text("按岗位职责，组织数字员工与工作流", "Workflows organized around real team roles.")}
          </h2>
          <Link href={localizeHref("/solutions", locale)} className={site.textLink}>
            {text("查看全部岗位方案", "View all role solutions")}
            <ArrowRight size={15} />
          </Link>
        </header>

        <div className={styles.roleTabsWrap}>
          <div
            className={styles.roleTabs}
            role="tablist"
            aria-label={text("按岗位切换解决方案", "Switch role solutions")}
          >
            {solutions.map((role, index) => (
              <button
                key={role.slug}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${role.slug}`}
                aria-controls={`${id}-panel-${role.slug}`}
                aria-selected={role.slug === current.slug}
                tabIndex={role.slug === current.slug ? 0 : -1}
                onClick={() => setSelectedSlug(role.slug)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {role.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div
          id={`${id}-panel-${current.slug}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${current.slug}`}
          tabIndex={0}
          className={styles.previewStage}
        >
          <div className={styles.previewCopy}>
            <p className={styles.subgroupLine}>
              <span>{current.name}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredSubgroup.name}</span>
            </p>
            <h3>{current.tagline}</h3>
            <p className={styles.previewSummary}>{current.summary}</p>

            <ul className={styles.roleBulletList}>
              {current.bullets.map((bullet) => (
                <li key={bullet}>
                  <Check size={16} aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className={styles.previewActions}>
              <Link
                href={localizeHref(`/solutions/${current.slug}`, locale)}
                className={site.primaryLink}
              >
                {text(`了解${current.name}方案`, `Explore ${current.name}`)}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <aside className={styles.deliverablePane} aria-label={text("场景与交付示意", "Prompt and deliverable preview")}>
            <div className={styles.promptBubble}>
              <span className={styles.promptTag}>
                <Sparkles size={13} aria-hidden="true" />
                {featured.templateRole}
              </span>
              <p>{featured.promptExample}</p>
            </div>

            <div className={styles.deliverableCardInner}>
              <div className={styles.deliverableMeta}>
                <span>{featured.deliverableTag}</span>
                <span>{featured.sources.join(" · ")}</span>
              </div>
              <div className={styles.deliverableTitleRow}>
                <FileText size={18} aria-hidden="true" />
                <h4>{featured.deliverableTitle}</h4>
              </div>
              <ul className={styles.deliverablePoints}>
                {featured.deliverablePoints.map((point) => (
                  <li key={point}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.deliverableBoundaryNote}>
                <strong>{text("人工把关：", "Human sign-off: ")}</strong>
                {featured.boundary}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
