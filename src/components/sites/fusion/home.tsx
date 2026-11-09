import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileCheck2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { SiteShell } from "./site-shell";
import { PricingOverview } from "./pricing";
import {
  ProductShowcase,
  WorkDeliveryVisual,
  EmployeeVisual,
  KnowledgeVisual,
} from "./product-showcase";
import { getCapabilities, getQuestions } from "./content";
import { localizeHref, type Locale } from "@/lib/i18n";
import styles from "./site.module.css";
import homeStyles from "./home.module.css";

function CapabilityIndex({ slugs, locale }: { slugs: string[]; locale: Locale }) {
  const capabilities = getCapabilities(locale);
  return (
    <div className={styles.capabilityIndex}>
      <span>{locale === "zh" ? "进一步了解" : "Explore the capabilities"}</span>
      <div>
        {slugs.map((slug) => {
          const capability = capabilities.find((item) => item.slug === slug);
          return capability ? (
            <Link href={localizeHref(`/product/${slug}`, locale)} key={slug}>
              {capability.name}
              <ChevronRight size={14} />
            </Link>
          ) : null;
        })}
      </div>
    </div>
  );
}

export function FusionHome({ locale = "en" }: { locale?: Locale }) {
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  const questions = getQuestions(locale).slice(2);
  const pocSteps = [
    {
      title: text("带来一个真实场景", "Bring a real use case"),
      description: text("说明当前流程、遇到的问题，以及你希望交付的成果。", "Share your current process, the problem and the result you need."),
    },
    {
      title: text("核对环境与接入条件", "Review the setup"),
      description: text("一起确认模型、工具、资料来源和必要的访问授权。", "Review models, tools, source materials and the access they need."),
    },
    {
      title: text("约定交付与验收标准", "Define what success means"),
      description: text("明确 POC 范围、交付物，以及由谁、如何判断结果。", "Agree on POC scope, deliverables and how your team will assess them."),
    },
  ];

  return (
    <SiteShell>
      <main id="main-content">
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1>
              {text("让 AI 完成工作，", "Let AI do the work.")}
              <br />
              <span>{text("让能力留在企业。", "Keep the capability.")}</span>
            </h1>
            <div className={styles.heroBottom}>
              <p className={`${styles.heroDescription} ${homeStyles.heroDescription}`}>
                {text(
                  "面向企业的 AI 工作平台。连接数字员工、工具与知识，交付可检查的成果，让确认后的经验用于下一次工作。",
                  "An AI workspace for enterprise teams. Bring AI employees, tools and knowledge together. Review the results and reuse what works.",
                )}
              </p>
              <div className={styles.heroActions}>
                <Link href={localizeHref("/poc", locale)} className={styles.primaryLink}>
                  {text("申请 POC", "Request a POC")} <ArrowRight size={16} />
                </Link>
                <a href="#work" className={styles.textLink}>
                  {text("查看工作演示", "Explore the workflow")} <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.heroProduct} id="product-demo">
            <ProductShowcase />
          </div>
        </section>

        <section className={`${styles.storySection} ${homeStyles.firstStory}`} id="work">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                {text("从一周反馈，", "A week of feedback.")}
                <br />
                {text("到可执行的改进计划。", "A plan you can act on.")}
              </h2>
              <div>
                <p>
                  {text(
                    "把客户反馈和产品资料交给数字员工。它核对来源、归纳问题，整理改进建议与验收要求。你可以查看依据，再决定先做什么。",
                    "Give an AI employee your customer feedback and product materials. It checks sources, groups issues and prepares recommendations with acceptance criteria. Review the evidence, then decide what comes first.",
                  )}
                </p>
                <Link className={styles.textLink} href={localizeHref("/product/skybot", locale)}>
                  {text("了解工作交付", "Explore work delivery")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <WorkDeliveryVisual />
            </div>
            <CapabilityIndex locale={locale} slugs={["skybot", "flows", "automations"]} />
          </div>
        </section>

        <section className={styles.storySection} id="employees">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                {text("这次做对的方法，", "Good work makes")}
                <br />
                {text("下次接着用。", "the next task easier.")}
              </h2>
              <div>
                <p>
                  {text(
                    "反馈分析做完了，方法也值得留下。把有效的工作记录整理成数字员工的职责、知识与技能方案，保留来源，经你确认后再用于后续工作。",
                    "The feedback is analyzed. The method is worth keeping, too. Turn useful work records into proposed responsibilities, knowledge and skills for an AI employee. Keep the sources and review the proposal before reusing it.",
                  )}
                </p>
                <Link className={styles.textLink} href={localizeHref("/product/employees", locale)}>
                  {text("了解数字员工", "Explore AI employees")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <EmployeeVisual />
            </div>
            <CapabilityIndex locale={locale} slugs={["employees"]} />
          </div>
        </section>

        <section className={styles.storySection} id="knowledge">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>
                {text("每一个结论，", "See the source.")}
                <br />
                {text("都能回到依据。", "Make the call.")}
              </h2>
              <div>
                <p>
                  {text(
                    "计划里为什么建议调整首次配置？回到同一份反馈周报和接入指南，查看原文与上下文。将项目事实、决策与方法组织成可维护的企业知识，让团队沿着依据继续工作。",
                    "Why does the plan recommend changing onboarding? Open the original feedback and guide to check the context. Keep project facts, decisions and methods in maintainable knowledge your team can work from.",
                  )}
                </p>
                <Link className={styles.textLink} href={localizeHref("/product/knowledge", locale)}>
                  {text("了解企业知识", "Explore enterprise knowledge")} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <KnowledgeVisual />
            </div>
          </div>
        </section>

        <section className={`${styles.container} ${styles.governance}`} id="governance">
          <div className={styles.sectionHeading}>
            <h2>
              {text("工作持续推进，", "Work moves forward.")}
              <br />
              {text("决定仍在你手中。", "You make the call.")}
            </h2>
            <div>
              <p>
                {text(
                  "人定义目标、授权访问、验收结果。数字员工在配置的环境与权限范围内执行；需要额外判断的事项明确保留，让团队知道已经完成什么、下一步由谁决定。",
                  "People set goals, authorize access and accept results. AI employees work within the configured environment and permissions. Keep decisions explicit, so your team knows what is done and who decides what happens next.",
                )}
              </p>
              <Link href={localizeHref("/product/environments", locale)} className={styles.textLink}>
                {text("了解环境与治理", "Explore environments & governance")} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
          <div className={styles.governanceLayout}>
            <div className={styles.boundaryList}>
              <article>
                <KeyRound />
                <div>
                  <h3>{text("知识可以共享，凭据分别管理", "Shared knowledge. Separate credentials.")}</h3>
                  <p>{text("按每一种连接的授权访问模型、工具和资料，保留各自的使用范围。", "Access models, tools and materials through each connection’s own authorization and scope.")}</p>
                </div>
              </article>
              <article>
                <Layers3 />
                <div>
                  <h3>{text("执行环境与数据流，接入时核对", "Review the environment and data flows")}</h3>
                  <p>{text("按任务准备执行环境，逐项核对外部模型、代码仓库和工具的数据边界。", "Prepare the environment for the task. Review data boundaries for external models, repositories and tools.")}</p>
                </div>
              </article>
              <article>
                <FileCheck2 />
                <div>
                  <h3>{text("执行、验收与发布，分别确认", "Execution, acceptance and release stay distinct")}</h3>
                  <p>{text("检查通过后，由团队验收交付。合并、发布与部署依照实际工作流继续判断。", "Your team accepts the deliverable after checks. Merging, publishing and deployment follow the actual workflow.")}</p>
                </div>
              </article>
            </div>
            <div className={styles.environmentPanel}>
              <div className={styles.environmentTop}>
                <span><LockKeyhole size={17} />{text("客户反馈改进", "Customer feedback")}</span>
                <small>{text("示例确认节点", "Example review point")}</small>
              </div>
              <div className={homeStyles.reviewSummary}>
                <span className={homeStyles.reviewStatus}><span />{text("等待人工验收", "Awaiting human review")}</span>
                <h3>{text("计划已整理，优先级由你决定。", "The plan is ready. You set the priorities.")}</h3>
              </div>
              <dl>
                <div><dt>{text("已完成", "Prepared")}</dt><dd>{text("改进建议与来源依据", "Recommendations and sources")}</dd></div>
                <div><dt>{text("待确认", "To review")}</dt><dd>{text("优先级与验收标准", "Priorities and acceptance criteria")}</dd></div>
                <div><dt>{text("下一步", "Next step")}</dt><dd>{text("由团队决定后续工作", "Your team decides what follows")}</dd></div>
              </dl>
              <p><Check size={15} />{text("完成执行，不等于通过验收。", "Execution complete. Acceptance is your decision.")}</p>
            </div>
          </div>
        </section>

        <PricingOverview locale={locale} />
        <section className={`${styles.container} ${styles.faq}`}>
          <h2>{text("开始之前，你可能想了解", "Before you get started")}</h2>
          <div>
            {questions.map((item) => (
              <details key={item.question} name="fusion-faq">
                <summary>{item.question}<span aria-hidden="true"><Plus size={18} /></span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={`${styles.cta} ${homeStyles.pocSection}`}>
          <div className={styles.container}>
            <h2>{text("带一个真实场景，", "Bring a real use case.")}<br />{text("一起定义 POC。", "Let’s define your POC.")}</h2>
            <p>{text("从一项值得验证的工作开始，明确接入条件、交付物与验收方式。", "Start with work worth validating. Define the setup, deliverables and how you will assess the result.")}</p>
            <ol className={homeStyles.pocSteps}>
              {pocSteps.map((step) => (
                <li key={step.title}><h3>{step.title}</h3><p>{step.description}</p></li>
              ))}
            </ol>
            <div>
              <Link href={localizeHref("/poc", locale)} className={styles.primaryLink}>
                {text("申请 POC", "Request a POC")} <ArrowRight size={16} />
              </Link>
              <Link href={localizeHref("/docs/private-deployment", locale)} className={styles.textLink}>
                {text("了解私有部署", "Explore private deployment")} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
