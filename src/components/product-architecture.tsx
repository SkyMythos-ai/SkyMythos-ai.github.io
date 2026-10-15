import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { ConsoleFigure } from "@/components/console-figure";
import { ProductAnatomyFigure } from "@/components/anatomy/figure";

const copy = {
  zh: {
    title: ["看清每一层，", "再放心交付。"],
    intro: "工作台呈现工作，控制面管理任务，运行器在隔离环境里推进执行。沿一次任务走一遍，比记住一排组件名更容易理解架构。",
    action: "查看任务操作指南",
    mapTitle: "一次任务，跨过哪些边界",
    mapBody: "选择任务阶段，查看各组件在这一刻承担的职责。治理与执行分别有自己的事实来源，通过明确协议交接。",
    traceTitle: ["从页面上的结果，", "追到实际执行。"],
    traceBody: "任务详情把需求、执行过程和交付放在同一个上下文里。排查时先看当前阶段，再进入节点、会话、事件和产物。",
    traceFacts: [
      ["输入与准备", "核对本次任务的需求、仓库、流程、模型与环境配置。"],
      ["节点与尝试", "从流程进入具体执行，区分等待、失败、重试与返工。"],
      ["结果与交付", "查看产物和门禁证据，按实际结果判断工作是否完成。"],
    ],
    traceAction: "按界面排查任务",
    boundaryTitle: "什么事实，由谁负责",
    boundaryBody: "环境就绪、进程退出、任务终态和业务成功，是不同的事实。界面展示它们的来源，组件各自维护自己的权威。",
    authority: [
      ["业务与授权", "Control Plane", "成员、工作范围、配置版本、任务生命周期与交付引用。"],
      ["执行与事件", "Agent Runner", "依赖推进、执行尝试、会话、运行事件与执行代次。"],
      ["环境生命周期", "Sandbox Provider", "运行环境的供给、观察、绑定、快照与清理能力。"],
      ["源码与大对象", "Git / Object Storage", "源码修订与交付引用，以及运行时快照、冻结输入和能力包。"],
      ["知识与记忆", "Independent services", "知识正文与检索数据面、个人记忆服务分别按自身范围维护。"],
    ],
    decisionsTitle: "把边界落到具体取舍",
    decisions: [
      ["完成要有证据", "执行节点按声明的产物、清单、结果摘要与质量门禁接受校验。自然语言的完成声明需要落实为可检查的结果。", "/docs/concepts/artifacts-and-gates", "查看产物与门禁"],
      ["开放接入，有明确合同", "模型、Agent Harness、Skill 与 MCP 各自配置。可用组合按运行时声明的模型协议、部署环境与授权检查。", "/docs/guides/flows-and-marketplace", "查看模型与工具配置"],
      ["恢复需要先看执行事实", "重试、返工、重启与运行环境恢复使用不同入口。先查看当前状态、已有产物和执行记录，再选择相应操作。", "/docs/guides/handle-failures", "查看任务排查与恢复"],
      ["把权限留在明确范围", "工作区成员关系、个人连接凭据与能力使用范围分别检查。Console 展示接口返回的事实，授权由服务端执行。", "/docs/operations/roles", "查看平台角色与权限"],
    ],
    next: "看完系统边界，回到一次真实工作。",
    nextAction: "打开使用文档",
    nextSecondary: "了解产品概念",
  },
  en: {
    title: ["See the boundary.", "Trace the work."],
    intro: "The workbench shows the work. The control plane manages tasks. The runner advances execution in an isolated environment. Follow one task to understand how the pieces fit.",
    action: "Read the task guide",
    mapTitle: "Follow a task across boundaries",
    mapBody: "Choose a task stage to see each component’s responsibility. Governance and execution keep their own authoritative facts and hand off through explicit protocols.",
    traceTitle: ["From the result", "to the execution."],
    traceBody: "Task detail brings requirements, execution and delivery into one context. Start with the current stage, then inspect nodes, sessions, events and outputs.",
    traceFacts: [
      ["Inputs and preparation", "Check this task’s requirements, repository, flow, model and environment configuration."],
      ["Nodes and attempts", "Inspect a specific execution. Distinguish waiting, failure, retries and rework."],
      ["Results and delivery", "Review artefacts and gate evidence to decide whether the work is complete."],
    ],
    traceAction: "Troubleshoot through the interface",
    boundaryTitle: "Who owns each fact?",
    boundaryBody: "A ready environment, an exited process, a terminal task state and a successful delivery are different facts. The interface shows their sources; each component keeps its own authority.",
    authority: [
      ["Business and authorisation", "Control Plane", "Membership, scope, configuration versions, task lifecycle and delivery references."],
      ["Execution and events", "Agent Runner", "Dependencies, execution attempts, sessions, runtime events and execution generations."],
      ["Environment lifecycle", "Sandbox Provider", "Environment provisioning, observation, binding, snapshot and cleanup capabilities."],
      ["Source and large objects", "Git / Object Storage", "Source revisions and delivery references; runtime snapshots, frozen inputs and capability bundles."],
      ["Knowledge and memory", "Independent services", "Knowledge content and its retrieval data plane, and personal memory, maintain their own scopes."],
    ],
    decisionsTitle: "Make the boundaries concrete",
    decisions: [
      ["Evidence defines completion", "Execution nodes are checked against declared outputs, manifests, result summaries and quality gates. A completion claim needs a result that can be inspected.", "/docs/concepts/artifacts-and-gates", "Read about artefacts and gates"],
      ["Open access, explicit contracts", "Models, agent harnesses, skills and MCP are configured separately. Available combinations are checked against runtime model protocols, deployment and authorisation.", "/docs/guides/flows-and-marketplace", "Configure models and tools"],
      ["Inspect the facts before recovery", "Retry, rework, restart and environment recovery have different entry points. Review the current state, existing outputs and execution record before choosing an action.", "/docs/guides/handle-failures", "Read troubleshooting and recovery"],
      ["Keep permissions within scope", "Workspace membership, personal connection credentials and capability scope are checked separately. The console presents API facts; services enforce authorisation.", "/docs/operations/roles", "Read about roles and permissions"],
    ],
    next: "Take these boundaries into a real piece of work.",
    nextAction: "Open the user guide",
    nextSecondary: "Explore product concepts",
  },
} as const;

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="product-text-link" href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}

export function ProductArchitecture({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <div className="product-page product-architecture">
      <header className="product-opening product-width">
        <div><h1>{t.title.map((line) => <span key={line}>{line}</span>)}</h1></div>
        <div className="product-opening-copy"><p>{t.intro}</p><TextLink href={localePath(locale, "/docs/guides/create-a-task")}>{t.action}</TextLink></div>
      </header>

      <section className="product-width product-architecture-map-section" aria-labelledby="product-architecture-map-heading">
        <div className="product-media-intro"><h2 id="product-architecture-map-heading">{t.mapTitle}</h2><p>{t.mapBody}</p></div>
        <ProductAnatomyFigure kind="architecture" locale={locale}/>
      </section>

      <section className="product-chapter product-width product-trace" aria-labelledby="product-trace-heading">
        <div className="product-chapter-heading"><h2 id="product-trace-heading">{t.traceTitle.map((line) => <span key={line}>{line}</span>)}</h2><p>{t.traceBody}</p></div>
        <ConsoleFigure locale={locale} screen="task" />
        <dl className="product-three-facts">{t.traceFacts.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
        <TextLink href={localePath(locale, "/docs/guides/handle-failures")}>{t.traceAction}</TextLink>
      </section>

      <section className="product-chapter product-width product-authority" aria-labelledby="product-authority-heading">
        <div className="product-chapter-heading"><h2 id="product-authority-heading">{t.boundaryTitle}</h2><p>{t.boundaryBody}</p></div>
        <dl className="product-authority-list">{t.authority.map(([fact, owner, detail]) => <div key={fact}><dt>{fact}</dt><dd><strong>{owner}</strong><p>{detail}</p></dd></div>)}</dl>
      </section>

      <section className="product-chapter product-width product-decisions" aria-labelledby="product-decisions-heading">
        <h2 id="product-decisions-heading">{t.decisionsTitle}</h2>
        <div className="product-definition-list">{t.decisions.map(([title, detail, path, action]) => <details key={title}><summary><span>{title}</span></summary><div className="product-definition-content"><p>{detail}</p><TextLink href={localePath(locale, path)}>{action}</TextLink></div></details>)}</div>
      </section>

      <section className="product-next product-width"><p>{t.next}</p><div><TextLink href={localePath(locale, "/docs")}>{t.nextAction}</TextLink><TextLink href={localePath(locale, "/concept")}>{t.nextSecondary}</TextLink></div></section>
    </div>
  );
}
