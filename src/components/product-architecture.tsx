import type { Locale } from "@/lib/i18n";
import { ProductChapter, ProductLink } from "@/components/product-page-parts";
import { EnterpriseSystemMap, DeploymentMap } from "@/components/enterprise-system-map";

export function ProductArchitecture({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const boundaries = zh ? [
    ["谁能访问什么", "身份与资源授权", "工作区、仓库、知识与工具分别检查权限。能看到一段群聊，不等于获得其中所有资源的访问权。", "/docs/operations/roles"],
    ["凭据怎样使用", "连接与授权", "模型、Git 与外部工具按范围授权。凭据与普通聊天内容分开管理，员工共享不带走个人凭据。", "/docs/guides/connections-and-mcp"],
    ["工作在哪里运行", "执行环境与隔离", "个人云环境与任务 Sandbox 分开治理。任务执行尝试、环境状态和业务成功是不同事实。", "/docs/concepts/sandbox"],
    ["结果如何追溯", "执行事实与交付证据", "控制面管理业务生命周期与引用，运行器记录执行，环境由 Provider 管理；产物和检查支持完成结论。", "/docs/concepts/artifacts-and-gates"],
  ] : [
    ["Who can access what?", "Identity and resource access", "Check access separately for workspaces, repositories, knowledge and tools. Seeing a group conversation does not grant access to all its resources.", "/docs/operations/roles"],
    ["How are credentials used?", "Connections and authorisation", "Grant scoped access to models, Git and tools. Manage credentials separately from chat content; sharing an employee does not transfer personal credentials.", "/docs/guides/connections-and-mcp"],
    ["Where does work run?", "Execution and isolation", "Govern personal environments and task Sandboxes separately. An execution attempt, a ready environment and business success are different facts.", "/docs/concepts/sandbox"],
    ["How can results be traced?", "Execution and delivery evidence", "The control plane owns business lifecycle and references; the runner records execution; providers manage environments. Outputs and checks support completion.", "/docs/concepts/artifacts-and-gates"],
  ];
  return <div className="product-page product-architecture">
    <header className="product-opening product-width">
      <div><p className="story-eyebrow">{zh ? "企业架构" : "Enterprise architecture"}</p><h1>{zh ? <>组织能力留下，<br />执行边界看清。</> : <>Keep the capability.<br />Know the boundaries.</>}</h1></div>
      <div className="product-opening-copy"><p>{zh ? "SkyMythos 组织目标、员工、流程与经验，在企业选择的运行环境中执行，并按授权接入模型和业务系统。先看全貌，再看治理与部署。" : "SkyMythos organises goals, employees, flows and experience. Execution uses your selected environments and authorised models and systems. Start with the whole system, then inspect governance and deployment."}</p><ProductLink locale={locale} href="/architecture#deployment">{zh ? "查看参考部署" : "See a reference deployment"}</ProductLink></div>
    </header>
    <section id="system" className="product-width" aria-labelledby="system-heading"><h2 id="system-heading" className="system-heading">{zh ? "一套工作体系，清楚的职责分层。" : "One work system. Clear responsibilities."}</h2><EnterpriseSystemMap locale={locale} /></section>

    <ProductChapter id="boundaries" label={zh ? "01 / 把控制权落实到边界" : "01 / Make control concrete"} title={zh ? "授权、运行与验收，各有依据。" : "Access, execution and acceptance each need evidence."} intro={zh ? "治理约束实际资源与动作，不把 Prompt 或 Agent 自律当作安全边界。可观测性用于核对 AI 的执行和交付，不是人员监控。" : "Govern actual resources and actions, rather than relying on prompts or Agent self-restraint. Observability helps verify AI execution and delivery, not monitor people."}>
      <dl className="boundary-ledger">{boundaries.map(([question, title, detail, href], index) => <div key={question}><dt><span className="story-index">0{index + 1}</span>{question}</dt><dd><h3>{title}</h3><p>{detail}</p><ProductLink locale={locale} href={href}>{zh ? "查看详细边界" : "Read the details"}</ProductLink></dd></div>)}</dl>
    </ProductChapter>

    <ProductChapter id="deployment" label={zh ? "02 / 部署在企业选择的环境" : "02 / Deploy in your chosen environment"} title={zh ? "控制系统，也核对每一条外部数据流。" : "Control the system. Verify external data flows."} intro={zh ? "核心控制面与执行环境可部署在客户环境。模型、代码托管、IM 和工具的实际访问范围，仍需按所选服务、网络与出口策略逐项确认。" : "The core control plane and execution environments can run in your infrastructure. Verify model, Git, IM and tool access against selected services, networks and egress policies."}>
      <DeploymentMap locale={locale} />
      <div className="story-footnote"><p>{zh ? "环境就绪不等于业务验收。安装、授权、实际模型调用与交付链路应分别验证。" : "A ready environment is not business acceptance. Validate installation, access, actual model calls and delivery separately."}</p><ProductLink locale={locale} href="/docs/getting-started/deployment">{zh ? "部署与接入检查清单" : "Deployment and integration checklist"}</ProductLink></div>
    </ProductChapter>
    <section className="product-next product-width"><p>{zh ? "把系统边界，带回一项真实工作。" : "Put these boundaries to work on a real job."}</p><div><ProductLink locale={locale} href="/concept#delivery">{zh ? "查看工作方式" : "See how it works"}</ProductLink><ProductLink locale={locale} href="/docs/operations/verification">{zh ? "了解验证与验收" : "Read the validation guide"}</ProductLink></div></section>
  </div>;
}
