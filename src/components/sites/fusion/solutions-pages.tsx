"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useId, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getCapabilities } from "./content";
import { getRoleSolution, getRoleSolutions, type RoleSubgroup } from "./solutions-data";
import { SiteShell } from "./site-shell";
import site from "./site.module.css";
import styles from "./solutions.module.css";

function SubgroupBlock({
  subgroup,
  locale,
}: {
  subgroup: RoleSubgroup;
  locale: Locale;
}) {
  const [activeId, setActiveId] = useState(subgroup.scenarios[0]?.id ?? "");
  const [mode, setMode] = useState<"deliverable" | "prompt">("deliverable");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const id = useId();
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);
  const current = subgroup.scenarios.find((s) => s.id === activeId) ?? subgroup.scenarios[0];

  async function copyPrompt(promptText: string, sceneId: string) {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(sceneId);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === sceneId ? null : prev));
      }, 1800);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <section className={styles.subgroupBlock} id={subgroup.id} aria-labelledby={`${id}-title`}>
      <header className={styles.subgroupHeader}>
        <h3 id={`${id}-title`}>{subgroup.name}</h3>
        <p>{subgroup.thesis}</p>
      </header>

      <div className={styles.workbenchGrid}>
        <div
          className={styles.verticalScenarioTabs}
          role="tablist"
          aria-label={subgroup.name}
        >
          {subgroup.scenarios.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              role="tab"
              id={`${id}-tab-${scene.id}`}
              aria-controls={`${id}-panel-${scene.id}`}
              aria-selected={scene.id === current.id}
              onClick={() => setActiveId(scene.id)}
            >
              <span className={styles.scenarioIndex}>0{index + 1}</span>
              <span>{scene.label}</span>
            </button>
          ))}
        </div>

        <div
          id={`${id}-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${current.id}`}
          className={styles.workbenchPanel}
        >
          <div className={styles.workbenchTopBar}>
            <h4>{current.label}</h4>
            <div className={styles.viewSwitch} role="group" aria-label={text("切换视图", "Switch view")}>
              <button
                type="button"
                data-active={mode === "deliverable"}
                onClick={() => setMode("deliverable")}
              >
                {text("交付成果预览", "Deliverable")}
              </button>
              <button
                type="button"
                data-active={mode === "prompt"}
                onClick={() => setMode("prompt")}
              >
                {text("提问示例", "Prompt Template")}
              </button>
            </div>
          </div>

          {mode === "deliverable" ? (
            <div className={styles.workbenchBody}>
              <div>
                <dl className={styles.anatomyList}>
                  <div>
                    <dt>{text("业务痛点", "Challenge")}</dt>
                    <dd>{current.situation}</dd>
                  </div>
                  <div>
                    <dt>{text("协作方式", "How SkyMythos helps")}</dt>
                    <dd>{current.approach}</dd>
                  </div>
                </dl>
                <p className={styles.boundaryCallout}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>
                    <strong>{text("人工把关：", "Human sign-off: ")}</strong>
                    {current.boundary}
                  </span>
                </p>
              </div>

              <div className={styles.deliverableCardInner}>
                <div className={styles.deliverableMeta}>
                  <span>{current.deliverableTag}</span>
                  <span>{text("交付产出", "Output")}</span>
                </div>
                <div className={styles.deliverableTitleRow}>
                  <FileText size={18} aria-hidden="true" />
                  <h4>{current.deliverableTitle}</h4>
                </div>
                <ul className={styles.deliverablePoints}>
                  {current.deliverablePoints.map((point) => (
                    <li key={point}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className={styles.deliverableBoundaryNote}>
                  <strong>{text("依据来源：", "Cited sources: ")}</strong>
                  {current.sources.join(" · ")}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.promptStage}>
              <div className={styles.promptBox}>
                <div className={styles.promptBoxHeader}>
                  <span className={styles.promptTag}>
                    <Sparkles size={14} aria-hidden="true" />
                    {current.templateRole}
                  </span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => copyPrompt(current.promptExample, current.id)}
                  >
                    {copiedId === current.id ? (
                      <>
                        <Check size={13} aria-hidden="true" />
                        {text("已复制", "Copied")}
                      </>
                    ) : (
                      <>
                        <Copy size={13} aria-hidden="true" />
                        {text("复制提问示例", "Copy prompt")}
                      </>
                    )}
                  </button>
                </div>
                <p className={styles.promptText}>{current.promptExample}</p>
              </div>
              <div className={styles.promptMetaFoot}>
                <span>
                  <strong>{text("关联知识源：", "Connected sources: ")}</strong>
                  {current.sources.join(" · ")}
                </span>
                <span>
                  <strong>{text("产出文档：", "Deliverable: ")}</strong>
                  {current.deliverableTitle}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function SolutionsHubPage({ locale = "en" }: { locale?: Locale }) {
  const solutions = getRoleSolutions(locale);
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);

  return (
    <SiteShell>
      <main id="main-content" className={styles.page}>
        <section className={`${site.container} ${styles.hubHero}`}>
          <span className={styles.rolePill}>
            {text("岗位解决方案 · ROLE SOLUTIONS", "ROLE SOLUTIONS")}
          </span>
          <h1>
            {text(
              "按岗位职责组织，交付有据可查的工作成果。",
              "Workflows organized around real enterprise roles.",
            )}
          </h1>
          <p className={styles.heroLead}>
            {text(
              "围绕企业各部门日常工作配置数字员工、内部知识库与人工审批边界，让每次交付都有章可循，逐步沉淀团队工作方法。",
              "Configure AI employees, cited internal knowledge and clear human sign-off rules around each department's daily work.",
            )}
          </p>
        </section>

        <section
          className={`${site.container} ${styles.hubGridSection}`}
          aria-label={text("全部岗位方案", "All role solutions")}
        >
          <div className={styles.hubGrid}>
            {solutions.map((role) => (
              <Link
                key={role.slug}
                href={localizeHref(`/solutions/${role.slug}`, locale)}
                className={styles.hubCard}
              >
                <h2>{role.name}</h2>
                <p>{role.summary}</p>
                <span className={styles.hubScope}>{role.tags.join(" · ")}</span>
                <span className={styles.hubCardLink}>
                  {text("了解方案详情", "Explore solution")}
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className={site.cta}>
          <div className={site.container}>
            <h2>{text("想围绕贵司具体岗位流程开展验证？", "Have a specific team workflow to validate?")}</h2>
            <p>
              {text(
                "预约专属顾问演示，结合真实业务资料评估部署范围与预期成果。",
                "Book a walkthrough to map your internal data boundaries, deliverables and pilot scope.",
              )}
            </p>
            <div>
              <Link href={localizeHref("/poc", locale)} className={site.primaryLink}>
                {text("预约演示", "Book a Demo")}
                <ArrowRight size={15} />
              </Link>
              <Link href={localizeHref("/pricing", locale)} className={site.textLink}>
                {text("查看席位授权方案", "View pricing")}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

export function RoleSolutionDetailPage({
  slug,
  locale = "en",
}: {
  slug: string;
  locale?: Locale;
}) {
  const role = getRoleSolution(slug, locale);
  if (!role) notFound();
  const allRoles = getRoleSolutions(locale);
  const capabilities = getCapabilities(locale).filter((cap) =>
    role.relatedCapabilities.includes(cap.slug),
  );
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);

  return (
    <SiteShell>
      <main id="main-content" className={styles.page}>
        <section className={`${site.container} ${styles.detailHero}`}>
          <nav className={site.breadcrumbs} aria-label={text("面包屑", "Breadcrumb")}>
            <Link href={localizeHref("/", locale)}>{text("首页", "Home")}</Link>
            <ChevronRight size={13} />
            <Link href={localizeHref("/solutions", locale)}>{text("解决方案", "Solutions")}</Link>
            <ChevronRight size={13} />
            <span>{role.name}</span>
          </nav>

          <span className={styles.rolePill}>
            {text(`${role.name} · 企业级岗位方案`, `${role.name} · Enterprise Role Solution`)}
          </span>
          <h1>{role.tagline}</h1>
          <p className={styles.heroLead}>{role.heroDescription}</p>

          <div className={site.articleActions}>
            <Link href={localizeHref("/poc", locale)} className={site.primaryLink}>
              {text("预约演示", "Book a Demo")}
              <ArrowRight size={15} />
            </Link>
            <Link href={localizeHref("/pricing", locale)} className={site.textLink}>
              {text("查看席位授权方案", "View seat licensing")}
              <ArrowRight size={15} />
            </Link>
          </div>

          <nav className={styles.anchorLinks} aria-label={text("场景模块目录", "Modules on this page")}>
            {role.subgroups.map((group) => (
              <a key={group.id} href={`#${group.id}`}>
                {group.name}
              </a>
            ))}
          </nav>
        </section>

        <section
          className={`${site.container} ${styles.highlightsStrip}`}
          aria-label={text("核心价值与边界", "Core value and boundaries")}
        >
          {role.highlights.map((item) => (
            <article key={item.label} className={styles.highlightItem}>
              <h2>{item.label}</h2>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className={`${site.container} ${styles.subgroupsSection}`}>
          <header className={styles.subgroupsHeading}>
            <h2>{text(`${role.name}高频场景工作台`, `Core workflows for ${role.name}`)}</h2>
          </header>

          <div className={styles.subgroupsList}>
            {role.subgroups.map((subgroup) => (
              <SubgroupBlock key={subgroup.id} subgroup={subgroup} locale={locale} />
            ))}
          </div>
        </section>

        <section className={`${site.container} ${styles.relatedSection}`}>
          <div className={styles.relatedBlock}>
            <h3>{text("支撑该岗位的平台底座能力", "Platform capabilities behind this role")}</h3>
            <div className={styles.relatedCaps}>
              {capabilities.map((cap) => (
                <Link key={cap.slug} href={localizeHref(`/product/${cap.slug}`, locale)}>
                  <strong>{cap.name}</strong>
                  <span>{cap.summary}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.relatedBlock}>
            <h3>{text("切换其他岗位解决方案", "Switch role solutions")}</h3>
            <nav className={styles.roleSwitcher} aria-label={text("全部岗位导航", "All roles")}>
              {allRoles.map((item) => (
                <Link
                  key={item.slug}
                  href={localizeHref(`/solutions/${item.slug}`, locale)}
                  aria-current={item.slug === role.slug ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className={site.cta}>
          <div className={site.container}>
            <h2>{role.ctaTitle}</h2>
            <p>{role.ctaDescription}</p>
            <div>
              <Link href={localizeHref("/poc", locale)} className={site.primaryLink}>
                {text("预约演示", "Book a Demo")}
                <ArrowRight size={15} />
              </Link>
              <Link href={localizeHref("/security", locale)} className={site.textLink}>
                {text("了解安全合规保障", "Security & Compliance")}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
