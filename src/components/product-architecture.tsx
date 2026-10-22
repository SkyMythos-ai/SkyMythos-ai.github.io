import type { Locale } from "@/lib/i18n";
import { ProductChapter, ProductLink } from "@/components/product-page-parts";
import { EnterpriseSystemMap, DeploymentMap } from "@/components/enterprise-system-map";

export function ProductArchitecture({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const boundaries = zh ? [
    ["谁能访问什么", "身份与资源授权", "工作区、仓库、知识与工具分别检查权限。能看到一段群聊，不等于获得其中所有资源的访问权。", "/docs/operations/roles"],
    ["凭据怎样使用", "连接与授权", "模型、Git 与外部工具按范围授权。凭据与普通聊天内容分开管理，员工共享不带走个人凭据。", "/docs/guides/connections-and-mcp"],
    ["工作在哪里运行", "执行环境与隔离", "个人云环境与任务 Sandbox 分开治理。任务执行尝试、环境状态和业务成功是不同事实。", "/docs/concepts/sandbox"],
    ["资产怎样维护", "来源、版本与共享范围", "知识按授权召回，Skill、Flow 与角色按版本维护。共享资产不等于复制员工实例、私人会话或个人凭据。", "/docs/guides/flows-and-marketplace"],
    ["谁能看到使用内容", "使用记录与访问审计", "运行记录按访问范围查询。内容读取另需权限检查与成功写入审计；私人开发机运行仅本人可见。", "/docs/management/usage"],
    ["结果如何追溯", "执行事实与交付证据", "控制面管理业务生命周期与引用，运行器记录执行，环境由 Provider 管理；产物和检查支持完成结论。", "/docs/concepts/artifacts-and-gates"],
  ] : [
    ["Who can access what?", "Identity and resource access", "Check access separately for workspaces, repositories, knowledge and tools. Seeing a group conversation does not grant access to all its resources.", "/docs/operations/roles"],
    ["How are credentials used?", "Connections and authorisation", "Grant scoped access to models, Git and tools. Manage credentials separately from chat content; sharing an employee does not transfer personal credentials.", "/docs/guides/connections-and-mcp"],
    ["Where does work run?", "Execution and isolation", "Govern personal environments and task Sandboxes separately. An execution attempt, a ready environment and business success are different facts.", "/docs/concepts/sandbox"],
    ["How are assets maintained?", "Sources, versions and sharing", "Retrieve knowledge with authorisation and maintain versioned Skills, Flows and roles. Sharing assets does not copy employee instances, private conversations or credentials.", "/docs/guides/flows-and-marketplace"],
    ["Who can read usage content?", "Usage records and access audits", "Query runs within your access scope. Content reads require permission and a successful audit write; private development-machine runs remain owner-only.", "/docs/management/usage"],
    ["How can results be traced?", "Execution and delivery evidence", "The control plane owns business lifecycle and references; the runner records execution; providers manage environments. Outputs and checks support completion.", "/docs/concepts/artifacts-and-gates"],
  ];
  const groups = zh ? [
    { title: "访问与凭据", intro: "授权落实到实际资源，不依赖 Agent 自律。", indices: [0, 1] },
    { title: "资产与内容", intro: "共享有范围，内容读取需授权与审计。", indices: [3, 4] },
    { title: "执行与交付", intro: "环境状态、执行事实与业务验收分别核对。", indices: [2, 5] },
  ] : [
    { title: "Access and credentials", intro: "Authorise real resources, not Agent self-restraint.", indices: [0, 1] },
    { title: "Assets and content", intro: "Scoped sharing, authorised and audited content reads.", indices: [3, 4] },
    { title: "Execution and delivery", intro: "Check environment state, execution and acceptance separately.", indices: [2, 5] },
  ];
  return <div className="product-page product-architecture">
    <header className="product-opening product-width">
      <h1>{zh ? <>组织能力留下，<br />执行边界看清。</> : <>Keep the capability.<br />Know the boundaries.</>}</h1>
      <div className="product-opening-copy"><p>{zh ? "工作、资产与治理相互连接，执行与数据边界各自清晰。" : "Connect work, assets and governance. Keep execution and data boundaries clear."}</p><ProductLink variant="action" locale={locale} href="/architecture#deployment">{zh ? "查看参考部署" : "See a reference deployment"}</ProductLink></div>
    </header>
    <section id="system" className="product-width" aria-labelledby="system-heading"><h2 id="system-heading" className="system-heading">{zh ? "一套工作体系，清楚的职责分层。" : "One work system. Clear responsibilities."}</h2><EnterpriseSystemMap locale={locale} /></section>

    <ProductChapter id="boundaries" title={zh ? "把控制权，落实到边界。" : "Make control concrete."} intro={zh ? "治理约束实际资源与动作，可观测性用于核对 AI 的执行和交付，不是人员监控。" : "Govern actual resources and actions. Verify AI execution and delivery, rather than monitor people."}>
      <div className="boundary-groups">{groups.map(group => <section key={group.title}><h3>{group.title}</h3><p>{group.intro}</p>{group.indices.map(index => {
        const [question, title, detail, href] = boundaries[index];
        return <details className="story-disclosure" key={question}><summary>{question}</summary><h4>{title}</h4><p>{detail}</p><ProductLink locale={locale} href={href}>{zh ? "查看详细边界" : "Read the details"}</ProductLink></details>;
      })}</section>)}</div>
    </ProductChapter>

    <ProductChapter id="cost-governance" title={zh ? "看清消耗，在任务入口落实策略。" : "Measure usage. Apply policy at task admission."} intro={zh ? "已记录消耗支持后续准入检查，不是实时扣款或全入口预算熔断。" : "Recorded usage informs admission checks. This is not real-time charging or budget enforcement across every entry point."}>
      <ol className="metering-path">
        <li><span className="story-index">{zh ? "采集" : "Record"}</span><h3>{zh ? "已记录的 Run" : "Recorded Runs"}</h3><p>{zh ? "记录所属用户、工作区、模型和 Token。只能分析已采集且有权读取的运行。" : "Record owner, workspace, model and tokens. Analysis covers collected runs within the reader’s access scope."}</p></li>
        <li><span className="story-index">{zh ? "聚合" : "Aggregate"}</span><h3>{zh ? "用量与估算费用" : "Usage and cost estimates"}</h3><p>{zh ? "按目录价格估算，保留完整、部分已知或未知状态；不等同供应商账单对账。" : "Estimate with catalogue prices, retaining complete, partial or unknown status. This is not provider invoice reconciliation."}</p></li>
        <li><span className="story-index">{zh ? "准入" : "Admit"}</span><h3>{zh ? "新 Task 的模型检查" : "Model checks for new Tasks"}</h3><p>{zh ? "检查模型是否启用、UTC 当月已记录用量是否达到额度。达到上限时拒绝创建新的任务。" : "Check model availability and whether recorded usage has reached the current UTC month’s allowance. Reject new tasks when the limit is reached."}</p></li>
      </ol>
      <div className="story-footnote"><p>{zh ? "月额度检查不是额度预占或运行中熔断；并发与遥测延迟可能导致超出。不能据此假定对话、自动角色协作等所有入口都有相同预算控制。" : "Monthly checks do not reserve budget or interrupt running work. Concurrency and telemetry delays can allow overshoot. Do not assume the same budget enforcement for conversations or automatic role collaboration."}</p><ProductLink locale={locale} href="/docs/management/model-policies">{zh ? "配置模型与任务额度" : "Configure models and task allowances"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="deployment" title={zh ? "控制系统，也核对每一条外部数据流。" : "Control the system. Verify external data flows."} intro={zh ? "核心控制面与执行环境可部署在客户环境，外部访问仍需逐项核对。" : "Run the core control plane and execution environments in your infrastructure. Verify each external connection."}>
      <DeploymentMap locale={locale} />
      <div className="story-footnote"><p>{zh ? "环境就绪不等于业务验收。安装、授权、实际模型调用与交付链路应分别验证。" : "A ready environment is not business acceptance. Validate installation, access, actual model calls and delivery separately."}</p><ProductLink locale={locale} href="/docs/getting-started/deployment">{zh ? "部署与接入检查清单" : "Deployment and integration checklist"}</ProductLink></div>
    </ProductChapter>
    <section className="product-next product-width"><p>{zh ? "把系统边界，带回一项真实工作。" : "Put these boundaries to work on a real job."}</p><div><ProductLink locale={locale} href="/concept#delivery">{zh ? "查看工作方式" : "See how it works"}</ProductLink><ProductLink locale={locale} href="/docs/operations/verification">{zh ? "了解验证与验收" : "Read the validation guide"}</ProductLink></div></section>
  </div>;
}
