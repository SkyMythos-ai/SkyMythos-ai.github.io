import type { Locale } from "@/lib/i18n";
import { ProductChapter, ProductLink } from "@/components/product-page-parts";
import { ProductDemo } from "@/components/product-demo/figure";
import { HomeWorkflowFigure } from "@/components/home-workflow-figure";

export function ProductConcept({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const modes = zh ? [
    ["对话协作", "讨论、探索与临时工作，不必先画流程。", "/docs/getting-started/overview"],
    ["研发任务", "用 Workflow 组织变更、检查与交付。", "/docs/guides/create-a-task"],
    ["周期自动化", "按配置定时或事件触发，查看独立运行。", "/docs/getting-started/overview"],
  ] : [
    ["Conversation", "Explore a goal without first designing a flow.", "/docs/getting-started/overview"],
    ["Engineering task", "Organise changes, checks and delivery with a Workflow.", "/docs/guides/create-a-task"],
    ["Automation", "Configure recurring or event-driven work with independent runs.", "/docs/getting-started/overview"],
  ];
  const assets = zh ? [
    ["企业知识", "事实与背景", "保留资料来源，检索时按授权访问。", "/docs/concepts/knowledge-and-memory"],
    ["员工经验", "指导与职责方法", "保留独立经验、适用范围与纠正来源。", "/docs/guides/digital-employees"],
    ["Skill", "可执行的方法", "把成熟做法整理为有输入、输出与检查的能力。", "/docs/guides/flows-and-marketplace"],
    ["Flow", "组织交付的过程", "按版本复用环节依赖与产物交接。", "/docs/concepts/flows-and-worknodes"],
  ] : [
    ["Knowledge", "Facts and context", "Keep source material and check access when retrieving it.", "/docs/concepts/knowledge-and-memory"],
    ["Employee experience", "Guidance and methods", "Keep independent experience, scope and correction sources.", "/docs/guides/digital-employees"],
    ["Skill", "An executable method", "Package proven methods with inputs, outputs and checks.", "/docs/guides/flows-and-marketplace"],
    ["Flow", "A delivery process", "Reuse versioned dependencies and output handoffs.", "/docs/concepts/flows-and-worknodes"],
  ];
  return <div className="product-page product-concept">
    <header className="product-opening product-width">
      <h1>{zh ? <>把一次工作做成，<br />把有效方法留下。</> : <>Deliver the work.<br />Keep what works.</>}</h1>
      <div className="product-opening-copy"><p>{zh ? "人保留关键判断，SkyBot 统筹，专业员工按职责参与。" : "People make key decisions. SkyBot coordinates, and specialist employees contribute."}</p><ProductLink variant="action" locale={locale} href="/concept#delivery">{zh ? "看工作案例" : "See work in action"}</ProductLink></div>
    </header>

    <section id="collaboration" className="product-width work-modes" aria-labelledby="work-modes-heading">
      <h2 id="work-modes-heading">{zh ? "按工作性质，选择入口。" : "Choose the entry point for the work."}</h2>
      <div className="work-mode-branches">{modes.map(([title, detail, href]) => <article key={title}><h3>{title}</h3><p>{detail}</p><ProductLink locale={locale} href={href}>{zh ? "使用指南" : "Read the guide"}</ProductLink></article>)}</div>
      <details className="story-disclosure"><summary>{zh ? "三种入口，共用资产但不是同一个运行对象" : "Shared assets, distinct run identities"}</summary><p>{zh ? "普通对话不隐式创建研发 Task；Automation Run 也不等于研发 Task。触发器与外部接入按实际配置验收。" : "Conversations do not implicitly create engineering Tasks. Automation Runs are distinct from engineering Tasks. Validate triggers and integrations against the actual configuration."}</p></details>
    </section>

    <ProductChapter id="delivery" title={zh ? "订单导出，从需求到交付。" : "Order export, from request to delivery."} intro={zh ? "同一项需求贯穿方案确认、执行与审阅：支持 CSV / Excel，沿用权限规则，补充接口与交互测试。" : "Follow one request through approval, execution and review: CSV / Excel exports, existing access rules, and API and interaction tests."}>
      <p className="case-example-label">{zh ? "产品 Keynote 中的固定示例，非客户实测结果。" : "Chinese Console UI. A fixed keynote example, not measured customer results."}</p>
      <ProductDemo locale={locale} kind="order-delivery" />
      <dl className="work-outcomes">
        <div><dt>{zh ? "交付产物" : "Deliverables"}</dt><dd>{zh ? "变更、导出结果与检查，用来判断工作是否完成。" : "Changes, exports and checks establish whether the job is complete."}</dd></div>
        <div><dt>{zh ? "执行记录" : "Run records"}</dt><dd>{zh ? "过程、模型与已记录消耗，用于追溯，不自动成为知识。" : "Process, models and recorded usage support traceability, not automatic knowledge creation."}</dd></div>
        <div><dt>{zh ? "可复用资产" : "Reusable assets"}</dt><dd>{zh ? "AI 提出总结与方法候选，人审核、修改、确认并决定采用后，才按授权用于后续工作。" : "AI proposes summaries and methods. People review, edit, confirm and decide what to adopt before authorised reuse."}</dd></div>
      </dl>
      <aside className="usage-note"><p>{zh ? "在授权和已采集记录范围内，可查看本次工作的 Token 与估算费用。内容读取另需权限与审计；私人开发机运行仅本人可见。" : "Inspect recorded tokens and estimated costs within your access scope. Content reads require permission and an audit; private development-machine runs remain owner-only."}</p><ProductLink locale={locale} href="/docs/management/usage">{zh ? "使用记录与可见范围" : "Usage records and visibility"}</ProductLink></aside>
      <details className="story-disclosure"><summary>{zh ? "信息不全、需要介入或执行失败时" : "When information is missing or work needs intervention"}</summary><p>{zh ? "信息不足先澄清，高影响动作按策略确认。失败后先定位，再按现场保留与运行状态选择恢复。" : "Clarify missing information and confirm high-impact actions when policy requires it. Inspect failures before recovery; availability depends on retained state and runtime status."}</p><ProductLink locale={locale} href="/docs/guides/handle-failures">{zh ? "介入与恢复指南" : "Intervention and recovery"}</ProductLink></details>
    </ProductChapter>

    <ProductChapter id="employees" title={zh ? "先留下经验，再培养数字员工。" : "Experience first. Then a digital employee."} intro={zh ? "AI 从记录提出总结与方法候选，人审核、修改并确认，决定采用哪些职责、方法与工具配置；再形成并配备员工，承接后续工作。" : "AI proposes summaries and methods from records. People review, edit and confirm what to adopt for the role, methods and tools before forming and equipping an employee for future work."}>
      <HomeWorkflowFigure locale={locale} />
      <div className="employee-distinction"><div><h3>{zh ? "角色定义方法" : "Roles define methods"}</h3><p>{zh ? "职责、方法与交付标准按版本发布和复用。" : "Publish and reuse versioned responsibilities, methods and delivery standards."}</p></div><div><h3>{zh ? "员工保留经验" : "Employees retain experience"}</h3><p>{zh ? "角色可以复用，员工的长期身份与个人经验各自保留。" : "Reuse a role while each employee retains an independent identity and experience."}</p></div></div>
      <div className="story-footnote"><p>{zh ? "这不是模型训练，也不是每次工作的前置条件。共享角色不自动复制私人会话、记忆或凭据。" : "This is not model training or a prerequisite for every job. Sharing a role does not copy private conversations, memory or credentials."}</p><ProductLink locale={locale} href="/docs/guides/digital-employees">{zh ? "培养与雇用员工" : "Develop and hire employees"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="knowledge" title={zh ? "按用途留下，不混成一个记忆库。" : "Keep each kind of asset distinct."} intro={zh ? "事实、经验、方法与过程，各有来源、权限和生命周期。" : "Facts, experience, methods and processes have distinct sources, permissions and lifecycles."}>
      <div className="asset-definitions">{assets.map(([name, purpose, detail, href]) => <details key={name}><summary><strong>{name}</strong><span>{purpose}</span></summary><p>{detail}</p><ProductLink locale={locale} href={href}>{zh ? "使用指南" : "Read the guide"}</ProductLink></details>)}</div>
    </ProductChapter>
    <section className="product-next product-width"><p>{zh ? "再看它运行在哪里，边界由谁掌握。" : "See where the work runs and who controls it."}</p><div><ProductLink locale={locale} href="/architecture">{zh ? "了解企业架构" : "Explore architecture"}</ProductLink><ProductLink locale={locale} href="/docs/getting-started/first-task">{zh ? "开始第一项工作" : "Start your first job"}</ProductLink></div></section>
  </div>;
}
