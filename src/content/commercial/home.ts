import { basePath } from "@/lib/site";

/** 已认可的首页作者稿；注释槽在服务端替换为真实 React 组件。 */
export const homeBody = `  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-intro wrap">
      <h1 id="hero-title"><span>让 AI 完成工作，</span><span>让能力留在企业。</span></h1>
      <p class="hero-lede">企业自己的 AI 工作平台。将 Agent、知识与工具组织进工作，完成交付、复用方法、掌握使用与投入。</p>
      <div class="actions"><a class="button" href="#contact" data-contact>预约演示<span aria-hidden="true">↗</span></a><a class="button button-secondary" href="${basePath}/zh/product/">了解产品<span aria-hidden="true">↘</span></a></div>
    </div>
    <figure class="hero-stage">
      <a class="hero-screen" href="{{PRODUCT_IMAGE:workbench}}" data-zoom aria-label="查看原图 ↗，企业 AI 工作台">
        <img src="{{PRODUCT_IMAGE:workbench}}" width="{{PRODUCT_WIDTH:workbench}}" height="{{PRODUCT_HEIGHT:workbench}}" alt="当前 SkyMythos 产品工作台，展示真实功能界面，使用本地示例数据" fetchPriority="high" loading="eager" decoding="async">
        <span class="zoom-hint">查看原图 ↗</span>
      </a>
      <figcaption><span>从你想完成的工作开始。</span><span>产品界面 · 示例数据，非实时运行</span></figcaption>
    </figure>
  </section>

  <section class="product section wrap" id="product" aria-labelledby="product-title" data-animation-scope="">
    <div class="section-heading"><div><p class="eyebrow">工作 · 方法 · 使用</p><h2 id="product-title">把工作做成，<br>也为下一次留下起点。</h2></div></div>
    <div class="capability-track"><div class="capability-browser">
      <nav class="product-tabs" aria-label="产品能力">
        <a href="#panel-delivery" data-tab="delivery" class="product-tab"><span class="tab-number">01</span><strong>完成工作</strong></a>
        <a href="#panel-methods" data-tab="methods" class="product-tab"><span class="tab-number">02</span><strong>保留方法</strong></a>
        <a href="#panel-management" data-tab="management" class="product-tab"><span class="tab-number">03</span><strong>管理使用</strong></a>
      </nav>
      <div class="capability-panels">
        <div class="product-panel" id="panel-delivery" data-panel="delivery">
          <div class="panel-copy"><div><h3>交付有依据，结果由人确认。</h3><p>明确目标和验收条件，查看执行、检查与产物，再决定是否接受交付。</p></div></div>
          <figure class="product-shot"><!-- CAPABILITY:delivery --><a class="capability-original text-link" href="{{PRODUCT_IMAGE:delivery}}" data-zoom data-zoom-alt="当前产品线程会话与交付信息的只读示例界面，结果仍需人工验收" aria-label="查看原图 ↗，交付界面">查看原图 ↗</a><figcaption>真实工作区节选，示例数据，非实时运行。执行状态与人工验收分开，不是客户实测或效果承诺。</figcaption></figure>
        </div>
        <div class="product-panel" id="panel-methods" data-panel="methods">
          <div class="panel-copy"><div><h3>经验先审清，再成为工作能力。</h3><p>选择有来源的经验，检查职责、方法与工具配置。经人确认方案后，才继续创建。</p></div></div>
          <figure class="product-shot"><!-- CAPABILITY:methods --><a class="capability-original text-link" href="{{PRODUCT_IMAGE:methods}}" data-zoom data-zoom-alt="数字员工形成方案的产品界面，显示经验来源、职责与等待确认方案状态，尚未创建员工" aria-label="查看原图 ↗，方法形成方案">查看原图 ↗</a><figcaption>真实工作区节选，示例数据，非实时运行。方案待确认 · 员工尚未创建、方法尚未采用，不表示模型训练。</figcaption></figure>
        </div>
        <div class="product-panel" id="panel-management" data-panel="management">
          <div class="panel-copy"><div><h3>接入工具，也明确授权范围。</h3><p>看清连接状态、工作空间与凭据边界。运行、Token 与估算费用的覆盖范围，另见管理说明。</p></div></div>
          <figure class="product-shot"><!-- CAPABILITY:management --><a class="capability-original text-link" href="{{PRODUCT_IMAGE:management}}" data-zoom data-zoom-alt="当前产品连接与授权的分类清单及配置界面，不是费用分析图表" aria-label="查看原图 ↗，连接配置">查看原图 ↗</a><figcaption>真实工作区节选，示例数据，非实时运行。连接清单与配置弹窗，非费用图 · 不提交凭据或发起授权。</figcaption></figure>
        </div>
      </div>
    </div></div>
  </section>

  <span class="legacy-anchor" id="people-and-teams"></span><span class="legacy-anchor" id="digital-employees"></span>
  <section class="workflow section wrap" id="workflow" aria-labelledby="workflow-title">
    <div class="section-heading"><div><p class="eyebrow">工作如何发生</p><h2 id="workflow-title">工作完成了，<br>有效的方法也留下。</h2></div><p>目标先说清，交付由人确认。AI 提出经验候选，经人审核、修改并决定采用，再成为下一次工作可以引用的方法。</p></div>
    <div class="workflow-story"><!-- LIFECYCLE --></div>
    <div class="workflow-footer"><a class="text-link" href="${basePath}/zh/resources/how-it-works/">了解完整工作方式<span aria-hidden="true">↗</span></a></div>
  </section>

  <section class="solutions section" id="solutions" aria-labelledby="solutions-title"><div class="wrap">
    <div class="section-heading"><div><p class="eyebrow">从一项工作，到团队采用</p><h2 id="solutions-title">先把一项工作做成，<br>再让团队用起来。</h2></div><p>交付是否可审阅，方法是否值得复用，<br>接入与投入是否清楚。从这些问题开始。</p></div>
    <div class="solution-list">
      <article id="development"><span class="solution-number"><span>01</span><span>研发交付</span></span><div><h3>先交付一项可以审阅的工作。</h3><p>从真实需求开始，约定范围与验收条件。让团队看见执行记录、检查和产物，再由人决定是否接受与发布。</p></div><a class="text-link" href="${basePath}/zh/solutions/engineering/">看工作示例<span aria-hidden="true">↗</span></a></article>
      <article id="team-methods"><span class="solution-number"><span>02</span><span>团队复用</span></span><div><h3>让经过确认的方法，被下一项工作用上。</h3><p>从有效经验中挑选值得复用的部分。保留来源和版本，由人决定共享范围，下一项工作再按授权引用。</p></div><a class="text-link" href="${basePath}/zh/solutions/team-reuse/">了解知识复用<span aria-hidden="true">↗</span></a></article>
      <article id="adoption"><span class="solution-number"><span>03</span><span>企业接入</span></span><div><h3>先明确怎么接入，再评估怎样扩展。</h3><p>对照已有模型、工具与授权方式，确认哪些入口记录运行和用量、哪些策略实际生效，再评估团队采用。</p></div><a class="text-link" href="${basePath}/zh/solutions/enterprise-adoption/">了解管理策略<span aria-hidden="true">↗</span></a></article>
    </div>
  </div></section>

  <span class="legacy-anchor" id="governance"></span><span class="legacy-anchor" id="product-access"></span>
  <section class="security section wrap" id="security" aria-labelledby="security-title">
    <div class="security-intro"><p class="eyebrow">安全与企业采用</p><h2 id="security-title">接入 AI，<br>不模糊企业的边界。</h2><p>从授权、执行到数据流向，先把责任讲清楚。让业务团队知道如何使用，让技术团队知道如何评估。</p><a class="text-link" href="${basePath}/zh/product/architecture/">了解企业架构<span aria-hidden="true">↗</span></a><div class="security-footnote">实际能力及适用范围以产品文档、部署配置与评估结果为准。</div></div>
    <div class="security-details">
      <details open><summary>谁可以使用哪些知识和工具？</summary><div><p>成员与工作空间权限、资产共享范围及连接凭据共同决定访问边界。共享一个角色，不等于共享个人凭据或私人工作内容。</p><a class="text-link" href="${basePath}/zh/docs/operations/roles/">身份与权限说明<span aria-hidden="true">↗</span></a></div></details>
      <details><summary>工作在哪里运行，数据会流向哪里？</summary><div><p>结合企业部署、任务执行环境和外部模型或工具连接进行评估。私有部署不等于零外发，应逐项确认模型调用、凭据与外部系统的责任边界。</p><a class="text-link" href="${basePath}/zh/docs/getting-started/deployment/">部署与接入说明<span aria-hidden="true">↗</span></a></div></details>
      <details><summary>如何看清 AI 的使用与投入？</summary><div><p>在权限范围内分析已记录运行的模型使用、Token 和估算费用。估算不等于供应商账单，缺失价格也不代表免费；使用量不作为员工绩效。</p><a class="text-link" href="${basePath}/zh/docs/management/costs/">用量与费用说明<span aria-hidden="true">↗</span></a></div></details>
      <details><summary>哪些决策仍然由人确认？</summary><div><p>在工作流程中保留范围确认、产物验收、发布批准与方法采用等人工关口。模型策略有明确生效范围，不将任务创建准入描述为全入口实时硬预算。</p><a class="text-link" href="${basePath}/zh/docs/management/model-policies/">策略与适用范围<span aria-hidden="true">↗</span></a></div></details>
    </div>
  </section>

  <section class="resources section wrap" id="resources" aria-labelledby="resources-title"><div class="section-heading"><div><p class="eyebrow">资源</p><h2 id="resources-title">继续了解，不必从术语开始。</h2></div></div><div class="resource-grid"><a href="${basePath}/zh/resources/how-it-works/"><span>产品指南</span><h3>一项工作如何完成，又留下什么？</h3><p>沿着完整工作过程，了解人的确认、交付与方法复用。</p><strong>了解工作方式 ↗</strong></a><a href="${basePath}/zh/product/architecture/"><span>技术评估</span><h3>如何接入企业已有的系统与能力？</h3><p>了解资产、执行、授权、数据与参考部署的责任边界。</p><strong>查看企业架构 ↗</strong></a><a href="${basePath}/zh/docs/getting-started/overview/"><span>使用文档</span><h3>从第一项工作，开始实际操作。</h3><p>查看任务、知识、数字员工和企业管理的操作说明。</p><strong>进入产品文档 ↗</strong></a></div></section>
`;
