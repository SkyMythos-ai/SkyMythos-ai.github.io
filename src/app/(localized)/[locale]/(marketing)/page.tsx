import type { Metadata } from "next";
import Link from "next/link";
import { toLocale, localePath } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, softwareApplicationJsonLd } from "@/lib/metadata";
import { Hero } from "@/components/hero";
import { ExecutionPreview } from "@/components/execution-preview/figure";
import { WorkStoryFigure } from "@/components/work-story/figure";
import { ProductMedia } from "@/components/product-media";
import { ProductChapter, ProductLink } from "@/components/product-page-parts";

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale), dictionary = getDictionary(locale);
  return buildMetadata({ locale, title: dictionary.meta.title, description: dictionary.meta.description, path: "/", keywords: dictionary.meta.keywords });
}

export default async function HomePage({ params }: PageProps) {
  const locale = toLocale((await params).locale), zh = locale === "zh";
  return <div className="product-page product-home">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd(locale)) }} />
    <Hero locale={locale} />

    <section id="workflow" className="home-work product-width" aria-labelledby="workflow-heading">
      <div className="home-work-copy"><h2 id="workflow-heading">{zh ? "把工作做成。" : "Get the work done."}</h2><p>{zh ? "以一次研发工作为例：人确认方案，AI 按计划执行，产物与检查一起交回人审阅。" : "One example: a development task. People approve the plan, AI executes, and outputs return with checks for human review."}</p></div>
      <div className="case-spread">
        <ExecutionPreview locale={locale}/>
        <div className="case-spread-copy"><ol className="case-points">{(zh ? ["确认方案", "执行与检查", "人工审阅"] : ["Approve the plan", "Execute and check", "Human review"]).map(item => <li key={item}>{item}</li>)}</ol><div><p className="story-note">{zh ? "订单导出固定示例，非客户实测结果。" : "A fixed order-export example, not measured customer results."}</p><ProductLink locale={locale} href="/concept#delivery">{zh ? "查看完整案例" : "Explore the full example"}</ProductLink></div></div>
      </div>
    </section>

    <ProductChapter id="people-and-teams" title={zh ? "让有效方法留下。" : "Keep what works."} intro={zh ? "AI 总结工作中的经验，人审核、修改并决定采用。有效方法成为有来源、按授权复用的企业资产。" : "AI proposes methods from work. People review, edit and choose what to adopt, keeping sources and access boundaries intact."}>
      <span id="digital-employees" />
      <div className="asset-canvas">
        <div className="asset-product"><ProductMedia image="formation-plan" locale={locale} alt={zh ? "确认员工方案与技能来源的实际界面" : "Review the employee plan and Skill sources"} caption={zh ? "人的确认，是经验变成能力的关键。" : "People confirm how experience becomes capability."}/></div>
        <WorkStoryFigure kind="assets" locale={locale}/>
      </div>
      <div className="story-footnote"><p>{zh ? "共享方法，不自动共享私人会话或凭据。数字员工是复用方式之一，不是每次工作的前置条件。" : "Sharing methods does not share private conversations or credentials. An employee is one way to reuse capability, not a prerequisite."}</p><ProductLink locale={locale} href="/concept#knowledge">{zh ? "了解资产复用" : "Explore asset reuse"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="governance" title={zh ? "让使用与投入可管理。" : "Make usage and costs accountable."} intro={zh ? "在授权范围内看清 AI 用在哪里、消耗多少，再按实际支持的策略管理新任务。" : "See where AI is used and what it consumes within your access scope. Apply supported policies to new tasks."}>
      <div className="governance-canvas">
        <WorkStoryFigure kind="governance" locale={locale}/>
        <nav className="governance-guides" aria-label={zh ? "企业 AI 管理指南" : "AI management guides"}>
          <ProductLink locale={locale} href="/docs/management/usage">{zh ? "成员使用与权限" : "Usage and access"}</ProductLink>
          <ProductLink locale={locale} href="/docs/management/costs">{zh ? "理解费用估算" : "Cost estimates"}</ProductLink>
          <ProductLink locale={locale} href="/docs/management/model-policies">{zh ? "模型与任务额度" : "Model allowances"}</ProductLink>
        </nav>
      </div>
      <div className="story-footnote"><p>{zh ? "管理 AI 应用，不用消耗量评判员工。内容读取遵循权限与审计，管理员不拥有所有私人内容的读取权。" : "Govern AI adoption, not employee performance through token counts. Reading content requires permission and an audit record, including for administrators."}</p><ProductLink locale={locale} href="/architecture#cost-governance">{zh ? "查看计量与策略边界" : "Metering and policy boundaries"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="product-access" title={zh ? "接入已有能力，不从头再建。" : "Connect what you already use."} intro={zh ? "模型、运行时与业务系统各司其职，组织能力留在企业自己的体系中。" : "Models, runtimes and business systems keep their roles. Your organisation keeps its methods."}>
      <div className="connection-band" role="group" aria-label={zh ? "组织与执行能力的接入关系" : "Coordination and connected execution"}>
        <div className="connection-owner"><strong>SkyMythos</strong><span>{zh ? "目标、资产与治理" : "Goals, assets and governance"}</span></div>
        <span className="connection-relation">{zh ? "按配置与授权接入" : "Configured, authorised access"}</span>
        <dl><div><dt>{zh ? "执行能力" : "Execution"}</dt><dd>{zh ? "Agent 运行时 / 模型" : "Agent runtimes / Models"}</dd></div><div><dt>{zh ? "业务系统" : "Business systems"}</dt><dd>Git / CI/CD / MCP</dd></div></dl>
      </div>
      <ProductLink locale={locale} href="/architecture">{zh ? "了解企业架构" : "Explore architecture"}</ProductLink>
    </ProductChapter>

    <section id="pilot" className="home-pilot product-width" aria-labelledby="pilot-heading">
      <span id="first-use"/>
      <h2 id="pilot-heading">{zh ? "先验证一次交付。" : "Start with one real delivery."}</h2>
      <p>{zh ? "约定成功标准，再看方法能否复用、消耗能否追溯。价值由真实工作验证。" : "Agree on success criteria. Test the result, method reuse and usage traceability before expanding."}</p>
      <ul className="pilot-measures">{(zh ? ["交付质量", "人工投入", "方法复用", "可追溯消耗"] : ["Delivery quality", "Human effort", "Method reuse", "Traceable usage"]).map(item => <li key={item}>{item}</li>)}</ul>
      <Link className="employee-primary" href={localePath(locale, "/docs/getting-started/overview")}>{zh ? "快速开始" : "Get started"}<span aria-hidden="true">↗</span></Link>
    </section>
  </div>;
}
