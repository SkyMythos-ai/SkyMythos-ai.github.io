import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { CapabilityExplorer } from "./capability-explorer";
import { AgentFoundationSection, SecurityJourneySection } from "./enterprise-diagrams";
import { HomeHero } from "./hero-motion";
import { PricingOverview } from "./pricing";
import { ProductShowcase } from "./product-showcase";
import { SiteMotionProvider } from "./site-motion";
import { SiteShell } from "./site-shell";
import { RoleSolutionsPreview } from "./solutions-preview";
import styles from "./site.module.css";
import homeStyles from "./home.module.css";

export function FusionHome({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);

  const cycleSteps = [
    text("明确目标", "Define the goal"),
    text("连接内部知识与工具", "Connect knowledge & tools"),
    text("隔离环境执行留痕", "Execute with audit trail"),
    text("人工验收并沉淀复用", "Approve & reuse"),
  ];

  return (
    <SiteShell>
      <SiteMotionProvider>
        <main id="main-content" className={homeStyles.home}>
          {/* 01 动态蓝白光影首屏 + 12s 自动推演工作台 */}
          <HomeHero locale={locale}>
            <ProductShowcase />
          </HomeHero>

          <div className={styles.container}>
            <div className={homeStyles.workCycle}>
              <p>{text("一项工作如何从目标推进到交付", "How work moves from goal to delivery")}</p>
              <ol>
                {cycleSteps.map((step, index) => (
                  <li key={step}>
                    <span>{step}</span>
                    {index < cycleSteps.length - 1 && <ArrowRight size={14} aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 02 一个 Agent 底座，支撑企业数字员工规模化应用 */}
          <AgentFoundationSection locale={locale} />

          {/* 03 按岗位职责，组织数字员工与工作流 */}
          <RoleSolutionsPreview locale={locale} />

          {/* 04 交付成果、数字员工与企业知识深度交互 */}
          <CapabilityExplorer locale={locale} />

          {/* 05 企业级安全治理，护航规模化应用（三步时间轴 + 等轴测组件图） */}
          <SecurityJourneySection locale={locale} />

          {/* 06 私有化部署与按团队席位授权概览 */}
          <PricingOverview locale={locale} />

          {/* 07 简洁收口 CTA */}
          <section className={`${styles.cta} ${homeStyles.pocSection}`}>
            <div className={styles.container}>
              <h2>
                {text("围绕一个真实部门场景，", "Start with one real team workflow.")}
                <br />
                {text("开启可验收的企业试点。", "Validate it inside your boundary.")}
              </h2>
              <p>
                {text(
                  "预约专属顾问演示，共同确认接入范围、交付标准与席位部署方案。",
                  "Book a tailored walkthrough to align on integration scope, deliverables and seat licensing.",
                )}
              </p>
              <div>
                <Link href={localizeHref("/poc", locale)} className={styles.primaryLink}>
                  {text("预约演示", "Book a Demo")} <ArrowRight size={15} />
                </Link>
                <Link href={localizeHref("/security", locale)} className={styles.textLink}>
                  {text("了解安全合规", "Security & Compliance")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </SiteMotionProvider>
    </SiteShell>
  );
}
