import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, softwareApplicationJsonLd } from "@/lib/metadata";
import { Hero } from "@/components/hero";
import { ProductChapter, ProductLink } from "@/components/product-page-parts";

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale), dictionary = getDictionary(locale);
  return buildMetadata({ locale, title: dictionary.meta.title, description: dictionary.meta.description, path: "/", keywords: dictionary.meta.keywords });
}

export default async function HomePage({ params }: PageProps) {
  const locale = toLocale((await params).locale), zh = locale === "zh";
  const journey = zh ? [
    ["明确目标", "说明需求、约束与完成标准"],
    ["选择工作方式", "日常协作、研发任务或自动化"],
    ["带着证据交付", "看产物、检查与未完成事项"],
    ["把有效方法留下", "整理经验，用于下一次工作"],
  ] : [
    ["Define the goal", "Agree on needs, constraints and completion"],
    ["Choose how to work", "Conversation, engineering task or automation"],
    ["Deliver with evidence", "Inspect outputs, checks and unresolved work"],
    ["Keep what works", "Curate experience for the next job"],
  ];
  return <div className="product-page product-home">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd(locale)) }} />
    <Hero locale={locale} />

    <section className="product-width product-context" aria-labelledby="context-heading">
      <p className="story-eyebrow">{zh ? "已有 Agent，接下来呢？" : "You have Agents. What comes next?"}</p>
      <h2 id="context-heading">{zh ? "执行能力已经很强，工作还需要被组织。" : "Strong execution still needs coordinated work."}</h2>
      <p>{zh ? <>从一个人做到一群人交付，仍要说清：<strong>谁来承接、如何判断完成、有效方法怎样延续。</strong>SkyMythos 将这些工作组织在一起，而不是让你换掉已有工具。</> : <>From individual tasks to shared delivery, teams still need to agree <strong>who takes the work, what counts as done and how good methods carry forward.</strong> SkyMythos connects these responsibilities without replacing your tools.</>}</p>
    </section>

    <ProductChapter id="workflow" label={zh ? "01 / 把工作做成" : "01 / Get the work done"} title={zh ? "从一个目标，到一份可核对的结果。" : "From a goal to a result you can verify."} intro={zh ? "人明确目标，SkyBot 统筹工作，专业员工按职责参与。你把注意力留给关键判断，不必手工串联每一步。" : "People set the goal. SkyBot coordinates, and specialists contribute. Keep your attention on key decisions, not on stitching every step together."}>
      <ol className="work-journey">{journey.map(([name, detail], index) => <li key={name}><span className="story-index">0{index + 1}</span><h3>{name}</h3><p>{detail}</p></li>)}</ol>
      <div className="story-footnote"><p>{zh ? "工作方式按需要选择，不是每次对话都创建研发任务。" : "Choose the right work mode. A conversation does not automatically create an engineering task."}</p><ProductLink locale={locale} href="/concept#delivery">{zh ? "跟随订单导出案例" : "Follow the order-export example"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="people-and-teams" label={zh ? "02 / 让方法留下" : "02 / Keep what works"} title={zh ? "先有工作记录与经验，再沉淀数字员工。" : "Work and experience come before the employee."} intro={zh ? "一次工作的价值不止于结果。记录与经验经人整理确认，成为可复用的方法，或用于培养持续协作的数字员工。" : "A job leaves more than a result. People curate and confirm its records and experience, turning them into reusable methods or a lasting digital collaborator."}>
      <span id="digital-employees" />
      <div className="reuse-summary" role="group" aria-label={zh ? "从工作来源到后续复用" : "From work evidence to future reuse"}>
        <div className="reuse-source"><span>{zh ? "工作记录" : "Work records"}</span><span>{zh ? "检查与反馈" : "Checks & feedback"}</span><span>{zh ? "有效经验" : "Useful experience"}</span></div>
        <div className="reuse-confirm"><span aria-hidden="true">→</span><strong>{zh ? "人整理与确认" : "People curate & confirm"}</strong><span aria-hidden="true">→</span></div>
        <div className="reuse-result"><strong>{zh ? "方法 / 数字员工" : "Methods / Digital employees"}</strong><p>{zh ? "带着来源，参与下一次工作" : "Carry their sources into the next job"}</p></div>
      </div>
      <div className="story-footnote"><p>{zh ? "共享方法，不自动复制私人会话或凭据；整理经验不等于训练模型。" : "Share methods, not private conversations or credentials. Curating experience is not model training."}</p><ProductLink locale={locale} href="/concept#employees">{zh ? "看经验如何形成员工" : "See how experience forms an employee"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="product-access" label={zh ? "03 / 在已有体系上工作" : "03 / Build on your existing tools"} title={zh ? "模型可以选择，组织能力持续积累。" : "Choose your models. Keep your organisation’s methods."} intro={zh ? "保留已有模型、Coding Agent、Git 与 CI/CD 投入。工作入口、角色、流程与经验在同一套授权边界内组织。" : "Keep your investment in models, coding Agents, Git and CI/CD. Organise work, roles, flows and experience within clear access boundaries."}>
      <div className="integration-summary"><div><span>{zh ? "组织工作" : "Organise"}</span><strong>SkyMythos</strong><p>{zh ? "目标 · 角色 · 流程 · 经验" : "Goals · Roles · Flows · Experience"}</p></div><div><span>{zh ? "接入执行能力" : "Connect execution"}</span><strong>{zh ? "Agent 运行时 + 模型" : "Agent runtimes + Models"}</strong><p>{zh ? "按部署适配、模型协议与授权选择" : "Subject to deployed adapters, protocols and access"}</p></div><div><span>{zh ? "沿用业务系统" : "Keep your systems"}</span><strong>Git · CI/CD · MCP</strong><p>{zh ? "明确资源权限与外部数据流" : "Explicit resource access and external data flows"}</p></div></div>
      <ProductLink locale={locale} href="/architecture">{zh ? "查看系统全貌与部署边界" : "See the system and deployment boundaries"}</ProductLink>
    </ProductChapter>

    <ProductChapter id="pilot" label={zh ? "04 / 从真实工作开始" : "04 / Start with real work"} title={zh ? "一个仓库，一类任务，先验证价值。" : "One repository. One kind of job. Prove the value."} intro={zh ? "先约定成功标准与当前投入，再覆盖执行、失败、纠正和再次使用。比较交付质量、人工协调与总成本，再决定是否扩展。" : "Agree on success criteria and a baseline. Include execution, failure, correction and reuse. Compare quality, coordination effort and total cost before expanding."}>
      <span id="first-use" />
      <div className="pilot-measures">{(zh ? ["交付周期", "人工投入", "验收质量", "单次交付成本"] : ["Delivery time", "Human effort", "Acceptance quality", "Cost per delivery"]).map(item => <span key={item}>{item}</span>)}</div>
      <div className="story-footnote"><p>{zh ? "收益以实际工作验证为准。核心链路可演示，生产部署、外部接入与业务验收仍需逐项确认。" : "Measure benefits on real work. Core workflows can be demonstrated; production deployment, external integrations and business acceptance still require validation."}</p><ProductLink locale={locale} href="/docs/getting-started/overview">{zh ? "从使用指南开始" : "Start with the user guide"}</ProductLink></div>
    </ProductChapter>
  </div>;
}
