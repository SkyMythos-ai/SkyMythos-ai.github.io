import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { ConsoleFigure } from "@/components/console-figure";
import { ProductAnatomyFigure } from "@/components/anatomy/figure";
import { ProductDemo } from "@/components/product-demo/figure";

const copy = {
  zh: {
    title: ["从日常工作，", "沉淀数字员工。"],
    intro: "先和大模型在 Chat 中反复把事情做成，沉淀 Skill 与 MCP，再形成 Agent 并组成数字员工。后续由你指派任务，它执行、交付，你审批验收。",
    action: "对照界面开始使用",
    chapters: ["数字员工", "开放协作", "知识沉淀"],
    workTitle: "从反复协作，到数字员工",
    workBody: "先留下 Skill 方法与 MCP 工具接入，再围绕明确职责形成 Agent。将这些能力组合为数字员工后，你从逐轮推进工作，转为指派任务、审批与验收。",
    employeeTitle: ["你来指派与验收，", "Agent 负责执行。"],
    employeeBody: "Agent 是执行主体，数字员工让它具备持续身份与职责。配上 Skill 方法、MCP 工具和工作经验，它接手后续任务；你在员工目录查看角色、工作记录与来源。",
    employeeSteps: [
      ["沉淀方法与工具", "从人和大模型的协作中提炼 Skill，整理可复用的 MCP 工具接入能力，保留工作的依据。"],
      ["形成数字员工", "Agent 围绕职责组合方法与工具。当前界面支持从经验培养，也支持从 Agent Hub 雇用已发布角色。"],
      ["指派任务，审批交付", "你说明目标，由 Agent 推进执行并提交成果，再由你审批与验收。"],
    ],
    employeeLink: "了解数字员工的使用方式",
    openTitle: "模型与工具，各自选择",
    openBody: "模型提供推理，Agent 负责执行，Harness 承载执行循环。Skill 提供工作方法，MCP 接入外部工具；按职责组合这些能力，让不同 Agent 参与同一项工作。",
    openFacts: [
      ["模型接入", "开始会话时，从已配置的网关与可用模型中选择。"],
      ["Agent Harness", "为 Agent 会话选择运行工具，按工具的协议使用模型。"],
      ["能力与交接", "Skill 复用方法，MCP 接入工具；角色与流程约定职责、输入和输出。"],
    ],
    openNote: "可用组合由当前部署的运行时、模型协议、能力配置与个人授权共同决定。",
    openLink: "查看模型与能力配置",
    knowledgeTitle: ["经验可以个人化，", "知识需要有出处。"],
    knowledgeBody: "个人记忆帮助员工延续协作；知识库承载团队可共享的正式资料。在知识库中管理文档、测试检索，并查看知识图谱与质量信息。",
    knowledgeFacts: [
      ["文档", "维护内容、来源和发布状态。"],
      ["检索测试", "检查哪些资料会被检索出来。"],
      ["知识图谱与质量", "从关联和使用情况检查知识。"],
    ],
    knowledgeLink: "了解知识与记忆",
    objectsTitle: "需要深入时，再看对象",
    objectsBody: "界面里的每次操作，都能回到具体的领域对象。先完成一次工作，再按需要查看它们的职责与边界。",
    objects: [
      ["Agent / Employee", "执行主体与持续身份", "Agent 理解目标、调用能力并执行；数字员工以 Agent 为执行主体，组合职责、Skill、MCP 等能力与持续经验。", "/docs/reference/glossary"],
      ["Workspace / Project", "工作范围", "Workspace 组织成员与共享能力；Project 将围绕持续目标的仓库、任务和知识放在一起。", "/docs/reference/glossary"],
      ["Task / TaskSpec", "一次任务与执行规格", "任务承载一次执行。执行规格记录本次使用的工作范围、输入、流程、模型与能力版本。", "/docs/concepts/tasks-and-specs"],
      ["Flow / WorkNode", "协作过程与工作单元", "Flow 描述依赖关系，WorkNode 声明一个可复用的执行单元，包括需要的输入、能力和输出。", "/docs/concepts/flows-and-worknodes"],
      ["Sandbox / Attempt", "环境与执行尝试", "Sandbox 承载运行环境；Attempt 记录一次具体执行。重试、返工与恢复分别保留自己的运行事实。", "/docs/concepts/sandbox"],
      ["Artifact / Gate", "产物与完成依据", "产物、清单、结果摘要和质量门禁，共同定义工作是否完成，以及如何向下游交接。", "/docs/concepts/artifacts-and-gates"],
      ["Knowledge / Memory", "共享知识与个人经验", "知识以文档、来源和治理范围组织；记忆围绕个人及员工的持续协作管理。", "/docs/reference/glossary"],
    ],
    readDefinition: "查看完整定义",
    next: "从真实界面开始，完成第一项工作。",
    nextAction: "打开使用文档",
    architecture: "继续了解架构",
  },
  en: {
    title: ["Work becomes", "experience."],
    intro: "Work with a model in Chat. Retain methods as Skills and tool access through MCP, then form an Agent and combine its capabilities into a digital employee. You assign the work; it executes and delivers for your review and approval.",
    action: "Start with the interface",
    chapters: ["Digital employees", "Open collaboration", "Knowledge"],
    workTitle: "From collaboration to a digital employee",
    workBody: "Retain Skill methods and MCP tool access, then form an Agent around a responsibility. Together they become a digital employee. Your role shifts from advancing each Chat turn to assigning work, reviewing and approving results.",
    employeeTitle: ["You assign and review.", "Your Agent executes."],
    employeeBody: "An Agent executes. A digital employee gives it a lasting identity and responsibility, combining Skills, authorised MCP tools and work experience. Its directory entry retains the role, work records and source evidence.",
    employeeSteps: [
      ["Capture methods and tool use", "Retain Skills and reusable MCP tool access from work with a model, keeping the source evidence."],
      ["Form a digital employee", "Combine methods and tools around the Agent’s responsibility. The Console supports development from experience and hiring published roles from Agent Hub."],
      ["Assign work and approve delivery", "You describe the goal. The Agent executes and submits its results for your review and approval."],
    ],
    employeeLink: "Learn how digital employees work",
    openTitle: "Choose models and tools",
    openBody: "Models provide reasoning. Agents execute. Harnesses host the execution loop. Skills provide methods, while MCP connects external tools. Combine these capabilities around a responsibility so different Agents can contribute to the same work.",
    openFacts: [
      ["Model access", "Start a session with a model available through your configured gateways."],
      ["Agent harness", "Choose a session’s execution tool and use models through the tool’s supported protocols."],
      ["Capabilities and handoffs", "Skills reuse methods; MCP connects tools. Roles and flows define responsibilities, inputs and outputs."],
    ],
    openNote: "Available combinations depend on deployed runtimes, model protocols, capability configuration and personal authorisation.",
    openLink: "Configure models and capabilities",
    knowledgeTitle: ["Personal memory.", "Shared knowledge."],
    knowledgeBody: "Personal memory helps an employee continue a collaboration. Knowledge bases hold formal material a team can share. Manage documents, test retrieval, and inspect the knowledge graph and quality information.",
    knowledgeFacts: [
      ["Documents", "Maintain content, sources and publication state."],
      ["Retrieval tests", "Check which materials are retrieved."],
      ["Graph and quality", "Review knowledge through its connections and usage."],
    ],
    knowledgeLink: "Understand knowledge and memory",
    objectsTitle: "Explore the objects",
    objectsBody: "Every action in the interface maps to a concrete domain object. Complete some work first, then explore responsibilities and boundaries as you need them.",
    objects: [
      ["Agent / Employee", "Executor and lasting identity", "An Agent understands a goal, uses capabilities and executes. A digital employee combines that executor with a responsibility, Skills, MCP tool access and continuing experience.", "/docs/reference/glossary"],
      ["Workspace / Project", "Scope of work", "A workspace organises members and shared capabilities. A project brings repositories, tasks and knowledge together around a continuing goal.", "/docs/reference/glossary"],
      ["Task / TaskSpec", "A task and its specification", "A task represents an execution. Its specification records the scope, inputs, flow, model and capability versions used for that run.", "/docs/concepts/tasks-and-specs"],
      ["Flow / WorkNode", "A process and its work units", "A flow defines dependencies. A work node defines a reusable execution unit with its inputs, capabilities and outputs.", "/docs/concepts/flows-and-worknodes"],
      ["Sandbox / Attempt", "An environment and an attempt", "A sandbox hosts execution. An attempt records one execution. Retries, rework and recovery retain their respective runtime facts.", "/docs/concepts/sandbox"],
      ["Artifact / Gate", "Outputs and completion evidence", "Artefacts, manifests, result summaries and quality gates define completion and the handoff to downstream work.", "/docs/concepts/artifacts-and-gates"],
      ["Knowledge / Memory", "Shared knowledge and experience", "Knowledge is organised through documents, sources and governed scopes. Memory supports a person’s and employee’s continuing collaboration.", "/docs/reference/glossary"],
    ],
    readDefinition: "Read the full definition",
    next: "Start with the interface. Complete your first job.",
    nextAction: "Open the user guide",
    architecture: "Explore the architecture",
  },
} as const;

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="product-text-link" href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}

export function ProductConcept({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <div className="product-page product-concept">
      <header className="product-opening product-width">
        <div>
          <h1>{t.title.map((line) => <span key={line}>{line}</span>)}</h1>
        </div>
        <div className="product-opening-copy">
          <p>{t.intro}</p>
          <TextLink href={localePath(locale, "/docs")}>{t.action}</TextLink>
        </div>
      </header>

      <section className="product-workspace product-width" aria-labelledby="product-workspace-heading">
        <div className="product-media-intro">
          <h2 id="product-workspace-heading">{t.workTitle}</h2>
          <p>{t.workBody}</p>
        </div>
        <ProductAnatomyFigure kind="concept" locale={locale}/>
        <details className="product-interface-reference"><summary>{locale === "zh" ? "对照实际的对话工作台" : "Compare with the conversation workspace"}</summary><ConsoleFigure locale={locale} screen="workspace"/></details>
        <nav className="product-chapters" aria-label={locale === "zh" ? "概念章节" : "Concept chapters"}>
          {t.chapters.map((chapter, index) => <a key={chapter} href={`#${["employees", "collaboration", "knowledge"][index]}`}>{chapter}<span aria-hidden="true">↓</span></a>)}
        </nav>
      </section>

      <section id="employees" className="product-chapter product-width product-employee" aria-labelledby="product-employee-heading">
        <div className="product-chapter-heading">
          <h2 id="product-employee-heading">{t.employeeTitle.map((line) => <span key={line}>{line}</span>)}</h2>
          <p>{t.employeeBody}</p>
        </div>
        <div className="product-feature-layout">
          <ProductDemo locale={locale} kind="employees" />
          <div className="product-sequence">
            <ol>{t.employeeSteps.map(([title, detail]) => <li key={title}><h3>{title}</h3><p>{detail}</p></li>)}</ol>
            <TextLink href={localePath(locale, "/docs/guides/digital-employees")}>{t.employeeLink}</TextLink>
          </div>
        </div>
      </section>

      <section id="collaboration" className="product-chapter product-width product-open" aria-labelledby="product-open-heading">
        <div className="product-chapter-heading">
          <h2 id="product-open-heading">{t.openTitle}</h2>
          <p>{t.openBody}</p>
        </div>
        <ProductDemo locale={locale} kind="agent-setup" />
        <dl className="product-three-facts">{t.openFacts.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
        <div className="product-footnote-row"><p>{t.openNote}</p><TextLink href={localePath(locale, "/docs/guides/flows-and-marketplace")}>{t.openLink}</TextLink></div>
      </section>

      <section id="knowledge" className="product-chapter product-width product-knowledge" aria-labelledby="product-knowledge-heading">
        <div className="product-knowledge-copy">
          <h2 id="product-knowledge-heading">{t.knowledgeTitle.map((line) => <span key={line}>{line}</span>)}</h2>
          <p>{t.knowledgeBody}</p>
          <dl className="product-knowledge-facts">{t.knowledgeFacts.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
          <TextLink href={localePath(locale, "/docs/concepts/knowledge-and-memory")}>{t.knowledgeLink}</TextLink>
        </div>
        <ProductDemo locale={locale} kind="knowledge" />
      </section>

      <section className="product-chapter product-width product-definitions" aria-labelledby="product-definitions-heading">
        <div className="product-chapter-heading"><h2 id="product-definitions-heading">{t.objectsTitle}</h2><p>{t.objectsBody}</p></div>
        <div className="product-definition-list">{t.objects.map(([name, role, detail, path]) => (
          <details key={name}>
            <summary><span>{name}</span><span>{role}</span></summary>
            <div className="product-definition-content"><p>{detail}</p><TextLink href={localePath(locale, path)}>{t.readDefinition}</TextLink></div>
          </details>
        ))}</div>
      </section>

      <section className="product-next product-width">
        <p>{t.next}</p>
        <div><TextLink href={localePath(locale, "/docs")}>{t.nextAction}</TextLink><TextLink href={localePath(locale, "/architecture")}>{t.architecture}</TextLink></div>
      </section>
    </div>
  );
}
