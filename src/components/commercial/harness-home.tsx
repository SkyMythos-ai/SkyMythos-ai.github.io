import Link from "next/link";
import "@/styles/harness-home.css";
import { SourceProductDemo } from "./source-product-demo";

const Arrow = () => <span aria-hidden="true">→</span>;

export function HarnessHome() {
  return <div className="harness-home">
    <section className="harness-hero harness-wrap" id="product">
      <div className="harness-hero-copy">
        <h1>数字员工持续工作，<br />企业能力持续积累。</h1>
        <p>企业的 AI-Native Harness，面向 7×24 无人值守。<br className="harness-desktop-break" />从接收任务、调用工具到交付结果，在授权范围内持续推进。</p>
        <div className="harness-actions"><a className="harness-primary" href="#autonomy">查看工作方式 <Arrow /></a><Link prefetch={false} href="/zh/product/work-delivery/">了解产品 <Arrow /></Link></div>
      </div>
      <div className="harness-feature-visual">
        <SourceProductDemo name="delivery" wholePage />
      </div>
      <ol className="harness-workflow" aria-label="从目标到结果的工作过程">
        <li><strong>交付目标</strong><p>带上资料、要求与验收标准。</p></li>
        <li><strong>持续执行</strong><p>读取上下文，调用工具，推进工作。</p></li>
        <li><strong>回看结果</strong><p>检查报告与执行记录，完成验收。</p></li>
      </ol>
    </section>

    <section className="harness-premise harness-wrap" aria-labelledby="enterprise-capability">
      <h2 id="enterprise-capability">AI 不止完成一项工作。<span>每次执行留下的知识和经验，<br className="harness-desktop-break" />都应成为企业下一次工作的能力。</span></h2>
      <div className="harness-principles"><div><h3>持续交付</h3><p>从目标、工具执行到可检查的结果。</p></div><div><h3>经验复用</h3><p>让工作经验成为数字员工的能力来源。</p></div><div><h3>边界清楚</h3><p>授权、资产范围与验收责任保持明确。</p></div></div>
    </section>

    <section className="harness-section harness-wrap" id="autonomy" aria-labelledby="autonomy-title">
      <span id="workflow" className="harness-anchor" />
      <div className="harness-heading">
        <h2 id="autonomy-title">持续执行，<br />直到交付结果。</h2>
        <div className="harness-chapter-copy"><p>交付目标与验收要求，数字员工读取资料、调用工具、推进工作。过程可以回看，结果等待确认。</p><Link prefetch={false} className="harness-text-link" href="/zh/product/work-delivery/">了解工作交付 <Arrow /></Link></div>
      </div>
      <SourceProductDemo name="delivery" />
      <div className="harness-feature-index"><span>功能</span><div><Link prefetch={false} href="/zh/product/work-delivery/">任务与上下文 <Arrow /></Link><Link prefetch={false} href="/zh/product/work-delivery/">工具调用 <Arrow /></Link></div><div><Link prefetch={false} href="/zh/product/work-delivery/">报告与产物 <Arrow /></Link><Link prefetch={false} href="/zh/product/governance/">执行与验收 <Arrow /></Link></div></div>
    </section>

    <section className="harness-section harness-wrap" id="training" aria-labelledby="training-title">
      <span id="digital-employees" className="harness-anchor" />
      <div className="harness-heading">
        <h2 id="training-title">把工作经验，<br />变成数字员工。</h2>
        <div className="harness-chapter-copy"><p>选取做过的工作，分析其中的职责、技能与经验，形成可确认的员工方案，让下一次工作从已有积累出发。</p><Link prefetch={false} className="harness-text-link" href="/zh/product/methods/">了解数字员工训练 <Arrow /></Link></div>
      </div>
      <SourceProductDemo name="training" />
      <div className="harness-feature-index"><span>功能</span><div><Link prefetch={false} href="/zh/product/methods/">工作经验 <Arrow /></Link><Link prefetch={false} href="/zh/product/methods/">员工方案 <Arrow /></Link></div><div><Link prefetch={false} href="/zh/solutions/team-reuse/">方法复用 <Arrow /></Link><Link prefetch={false} href="/zh/product/work-delivery/">执行与验收 <Arrow /></Link></div></div>
    </section>

    <section className="harness-section harness-wrap" id="company-knowledge" aria-labelledby="knowledge-title">
      <span id="people-and-teams" className="harness-anchor" />
      <div className="harness-heading">
        <h2 id="knowledge-title">知识有出处，<br />工作有依据。</h2>
        <div className="harness-chapter-copy"><p>把资料留在共同的知识库。检索已有内容、核对原文，让团队从可查证的知识继续工作。</p><Link prefetch={false} className="harness-text-link" href="/zh/solutions/team-reuse/">了解企业知识沉淀 <Arrow /></Link></div>
      </div>
      <SourceProductDemo name="knowledge" />
      <div className="harness-feature-index"><span>功能</span><div><Link prefetch={false} href="/zh/docs/guides/knowledge-base/">知识检索 <Arrow /></Link><Link prefetch={false} href="/zh/docs/guides/knowledge-base/">原文与出处 <Arrow /></Link></div><div><Link prefetch={false} href="/zh/solutions/team-reuse/">工作区共享 <Arrow /></Link><Link prefetch={false} href="/zh/product/governance/">资产可见范围 <Arrow /></Link></div></div>
    </section>

    <section className="harness-governance" id="security-governance" aria-labelledby="governance-title">
      <span id="governance" className="harness-anchor" />
      <div className="harness-wrap">
        <div className="harness-heading">
          <h2 id="governance-title">自主工作，<br />边界始终清楚。</h2>
          <div className="harness-chapter-copy"><p>无人值守需要明确的授权。谁能使用什么、通过什么连接执行、结果如何验收，都应当有据可查。</p><Link prefetch={false} className="harness-text-link" href="/zh/security/">查看安全与治理 <Arrow /></Link></div>
        </div>
        <div className="harness-governance-details">
          <Link prefetch={false} href="/zh/product/governance/"><div><h3>身份与资产范围</h3><p>区分个人、工作区与共享资产的可见范围。</p></div><Arrow /></Link>
          <Link prefetch={false} href="/zh/docs/guides/connections-and-mcp/"><div><h3>连接与凭据</h3><p>按任务所需授权工具，管理访问外部系统的连接。</p></div><Arrow /></Link>
          <Link prefetch={false} href="/zh/product/work-delivery/"><div><h3>执行与验收</h3><p>保留工具调用和工作产物，按验收标准确认结果。</p></div><Arrow /></Link>
        </div>
      </div>
    </section>

    <section className="harness-adoption harness-section harness-wrap" id="product-proof" aria-labelledby="adoption-title">
      <span id="solutions" className="harness-anchor" /><span id="resources" className="harness-anchor" />
      <div className="harness-heading"><h2 id="adoption-title">接入现有工作，<br />从一个场景开始。</h2><p>先跑通一项真实任务，<br />再逐步扩展连接、知识与数字员工。</p></div>
      <div className="harness-resource-list">
        <Link prefetch={false} href="/zh/docs/guides/connections-and-mcp/"><span>连接工具与 MCP</span><span>让数字员工使用现有工作工具</span><Arrow /></Link>
        <Link prefetch={false} href="/zh/docs/getting-started/deployment/"><span>部署与配置</span><span>了解部署条件与外部服务边界</span><Arrow /></Link>
        <Link prefetch={false} href="/zh/docs/getting-started/overview/"><span>开始第一项工作</span><span>从目标、上下文到检查结果</span><Arrow /></Link>
      </div>
    </section>

    <section className="harness-end harness-wrap" id="product-access">
      <h2>下一项工作，<br />从已有能力出发。</h2>
      <div className="harness-actions"><Link prefetch={false} className="harness-primary" href="/zh/docs/getting-started/overview/">开始使用 <Arrow /></Link><Link prefetch={false} href="/zh/product/">探索产品 <Arrow /></Link></div>
    </section>
  </div>;
}
