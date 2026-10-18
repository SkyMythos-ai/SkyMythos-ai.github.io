import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { Section } from "@/components/primitives";
import { ConsoleFigure } from "@/components/console-figure";

const copy = {
  zh: {
    title: "定义它的工作，接好它的工具。",
    intro: "从一个 Agent 开始，复用到协作与 Workflow。方法、工具和访问权限，各有清楚的归属。",
    agentTitle: "先写职责，再选模型。",
    agentBody: "给 Agent 明确的指令，选择模型，再添加 Skill 与 MCP。执行 CLI 按模型配置适配，不必先理解全部运行参数。",
    agentNote: "Workflow 节点可引用员工，或复制为独立定义；复制不会带走身份、长期记忆或凭据。",
    agentLink: "了解 Agent 与 Workflow",
    connectorTitle: "连接服务，不交出边界。",
    connectorBody: "在统一入口管理 Git、模型与 MCP。选择服务后，检查个人授权、运行环境与工具范围。",
    connectorNote: "MCP Gateway 支持远程 HTTP / SSE 与本地 stdio。官方业务 MCP 同样遵循当前用户和工作区权限。",
    connectorLink: "查看连接与授权",
    startTitle: "先进入工作，再按需配置。",
    startBody: "首次使用可选填个人 Git 与模型凭据，一次确认即可进入。Sandbox 在需要时单独准备，不因进入页面就分配资源。",
    startLink: "快速开始",
    startDetails: "查看首次使用界面",
  },
  en: {
    title: "Define the work. Connect the tools.",
    intro: "Start with an Agent. Reuse it in collaboration and Workflows, with clear ownership of methods, tools and access.",
    agentTitle: "Instructions first. Then a model.",
    agentBody: "Give an Agent instructions, select a model, and add Skills and MCP tools. Its execution CLI follows the model configuration.",
    agentNote: "Workflow nodes can reference an employee or copy an independent definition, without copying identity, long-term memory or credentials.",
    agentLink: "Explore Agents and Workflows",
    connectorTitle: "Connect services. Keep boundaries.",
    connectorBody: "Manage Git, models and MCP in one place. Inspect personal authorisation, execution environment and tool scope for each service.",
    connectorNote: "MCP Gateway supports remote HTTP / SSE and local stdio. Official business MCPs also enforce user and workspace permissions.",
    connectorLink: "Explore connections and access",
    startTitle: "Start now. Configure as needed.",
    startBody: "Personal Git and model credentials are optional at first sign-in. Prepare a Sandbox separately when needed; entering the app allocates no runtime resources.",
    startLink: "Get started",
    startDetails: "View first-use setup",
  },
} as const;

export function HomeProductAccess({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <>
      <Section id="product-access" className="home-section home-product-access" width="wide" divided>
        <header className="home-product-heading">
          <h2 className="home-heading">{t.title}</h2>
          <p className="home-lede">{t.intro}</p>
        </header>
        <div className="home-access-grid">
          <article>
            <div className="home-access-copy">
              <h3>{t.agentTitle}</h3>
              <p>{t.agentBody}</p>
            </div>
            <ConsoleFigure locale={locale} screen="agent-create" />
            <p className="home-access-note">{t.agentNote}</p>
            <Link href={localePath(locale, "/docs/guides/flows-and-marketplace")} className="home-text-link">{t.agentLink} <span aria-hidden="true">↗</span></Link>
          </article>
          <article>
            <div className="home-access-copy">
              <h3>{t.connectorTitle}</h3>
              <p>{t.connectorBody}</p>
            </div>
            <ConsoleFigure locale={locale} screen="connectors" />
            <p className="home-access-note">{t.connectorNote}</p>
            <Link href={localePath(locale, "/docs/guides/connections-and-mcp")} className="home-text-link">{t.connectorLink} <span aria-hidden="true">↗</span></Link>
          </article>
        </div>
      </Section>
      <Section id="first-use" className="home-section home-first-use" width="wide" divided>
        <h2 className="home-heading">{t.startTitle}</h2>
        <p className="home-lede">{t.startBody}</p>
        <Link href={localePath(locale, "/docs/getting-started/overview")} className="home-text-link">{t.startLink} <span aria-hidden="true">↗</span></Link>
        <details className="home-disclosure home-onboarding-reference">
          <summary>{t.startDetails}</summary>
          <ConsoleFigure locale={locale} screen="onboarding" />
        </details>
      </Section>
    </>
  );
}
