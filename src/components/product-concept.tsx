import type { Locale } from "@/lib/i18n";
import { ProductChapter, ProductLink } from "@/components/product-page-parts";
import { ProductDemo } from "@/components/product-demo/figure";
import { HomeWorkflowFigure } from "@/components/home-workflow-figure";

export function ProductConcept({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const modes = zh ? [
    ["对话协作", "讨论、探索与临时工作", "在 SkyBot 中围绕目标协作，不必先画流程。", "/docs/getting-started/overview"],
    ["研发任务", "需要检查与交接的工程工作", "用 Workflow 组织环节，保留变更与检查证据。", "/docs/guides/create-a-task"],
    ["周期自动化", "定时或事件触发的重复工作", "发布自动化定义，按配置触发并查看独立运行记录。", "/docs/getting-started/overview"],
  ] : [
    ["Conversation", "Exploration and everyday work", "Collaborate around a goal in SkyBot. No flow design required.", "/docs/getting-started/overview"],
    ["Engineering task", "Work that needs checks and handoffs", "Use a Workflow to organise steps, changes and verification evidence.", "/docs/guides/create-a-task"],
    ["Automation", "Recurring or event-driven work", "Publish a definition, configure its trigger and inspect independent runs.", "/docs/getting-started/overview"],
  ];
  const assets = zh ? [
    ["企业知识", "事实与背景", "保留资料来源，检索时按授权访问。", "/docs/concepts/knowledge-and-memory"],
    ["员工经验", "指导与职责方法", "保留独立经验、适用范围与纠正来源。", "/docs/guides/digital-employees"],
    ["Skill", "可执行的方法", "把成熟做法整理为有输入、输出与检查的能力。", "/docs/guides/flows-and-marketplace"],
    ["Flow", "组织交付的过程", "按版本复用环节依赖与产物交接。", "/docs/concepts/flows-and-worknodes"],
  ] : [
    ["Knowledge", "Facts and context", "Keep source material and check access when retrieving it.", "/docs/concepts/knowledge-and-memory"],
    ["Employee experience", "Guidance and working methods", "Keep independent experience, scope and correction sources.", "/docs/guides/digital-employees"],
    ["Skill", "An executable method", "Package proven methods with inputs, outputs and checks.", "/docs/guides/flows-and-marketplace"],
    ["Flow", "A delivery process", "Reuse versioned dependencies and output handoffs.", "/docs/concepts/flows-and-worknodes"],
  ];
  return <div className="product-page product-concept">
    <header className="product-opening product-width">
      <div><p className="story-eyebrow">{zh ? "工作方式" : "How it works"}</p><h1>{zh ? <>把一次工作做成，<br />把有效方法留下。</> : <>Deliver the work.<br />Keep what works.</>}</h1></div>
      <div className="product-opening-copy"><p>{zh ? "从目标出发，选择合适的工作方式。人保留关键判断，SkyBot 统筹，专业员工按职责参与。" : "Start with the goal, then choose how to work. People retain key decisions, SkyBot coordinates and specialists contribute."}</p><ProductLink locale={locale} href="/concept#delivery">{zh ? "看订单导出案例" : "See the order-export example"}</ProductLink></div>
    </header>

    <section id="collaboration" className="product-width work-modes" aria-labelledby="work-modes-heading">
      <h2 id="work-modes-heading">{zh ? "同一个目标，不必只有一种工作方式。" : "One goal. The right way to work."}</h2>
      <div className="work-mode-origin"><span>{zh ? "目标与约束" : "Goal & constraints"}</span><span aria-hidden="true">↓</span><span>{zh ? "按工作性质选择" : "Choose by the work"}</span></div>
      <div className="work-mode-branches">{modes.map(([title, purpose, detail, href]) => <article key={title}><p className="story-eyebrow">{purpose}</p><h3>{title}</h3><p>{detail}</p><ProductLink locale={locale} href={href}>{zh ? "使用指南" : "Read the guide"}</ProductLink></article>)}</div>
      <p className="story-note">{zh ? "三种入口共用权限与资产，但不是同一种运行对象。普通对话不隐式创建研发 Task；Automation Run 也不等于研发 Task。触发器与外部接入按实际配置验收。" : "These modes share access rules and assets, not one run identity. Conversations do not implicitly create engineering Tasks, and Automation Runs are not engineering Tasks. Triggers and integrations require configuration and validation."}</p>
    </section>

    <ProductChapter id="delivery" label={zh ? "01 / 一项研发工作的完整过程" : "01 / One engineering job, end to end"} title={zh ? "订单导出，从一句需求到可审查的变更。" : "Order export: from a request to reviewable changes."} intro={zh ? "同一个客户门户需求贯穿目标、方案确认、执行与交付：支持 CSV / Excel，沿用权限规则，并补充接口与交互测试。" : "Follow one customer-portal request through the goal, design approval, execution and delivery: CSV / Excel export, existing access rules, and API and interaction tests."}>
      <div className="case-example-label"><span>{zh ? "产品界面演示" : "Product interface demonstration"}</span><p>{zh ? "来自产品 Keynote 的固定示例，不是客户实测结果。" : "Chinese Console UI; fixed sample data from the product keynote, not measured customer results."}</p></div>
      <ProductDemo locale={locale} kind="order-delivery" />
      <div className="delivery-evidence"><h3>{zh ? "验收看什么？" : "What counts as evidence?"}</h3><ul>{(zh ? ["可审查的代码变更", "实际执行的检查", "完成项与未完成事项", "本次执行的依据与记录"] : ["Reviewable code changes", "Checks that actually ran", "Completed and unresolved work", "Execution inputs and records"]).map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className="story-footnote"><p>{zh ? "信息不足先澄清，高影响动作按策略确认。失败后先定位，再按现场保留与运行状态选择恢复。" : "Clarify missing information and confirm high-impact actions when policy requires it. Inspect failures before recovery; availability depends on retained state and runtime status."}</p><ProductLink locale={locale} href="/docs/guides/handle-failures">{zh ? "查看介入与恢复指南" : "Read the intervention and recovery guide"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="employees" label={zh ? "02 / 从这次工作，到下一次协作" : "02 / From this job to the next collaboration"} title={zh ? "先留下经验，再培养数字员工。" : "Experience first. Then a digital employee."} intro={zh ? "工作记录与经验经人整理，确认职责、方法和工具后，才形成并配备员工。它就绪后，再承接后续工作；不是自动训练模型。" : "People curate records and experience, then confirm the responsibility, methods and tools before creating and equipping an employee. Only then does it take on future work. This is not model training."}>
      <HomeWorkflowFigure locale={locale} />
      <div className="employee-distinction"><div><h3>{zh ? "角色，定义怎样工作" : "A role defines how to work"}</h3><p>{zh ? "职责、方法与交付标准可以按版本发布和复用。" : "Publish and reuse versioned responsibilities, methods and delivery standards."}</p></div><div><h3>{zh ? "员工，保留独立经验" : "An employee keeps its own experience"}</h3><p>{zh ? "同一角色可以被复用，员工的长期身份和个人经验仍各自保留。" : "A role can be reused while each employee retains its own identity and experience."}</p></div></div>
      <div className="story-footnote"><p>{zh ? "培养不是每次工作的前置条件，也可雇用已发布角色。共享角色不会自动复制私人会话、个人记忆或凭据。" : "Formation is not a prerequisite for every job; you can also hire a published role. Sharing a role does not copy private conversations, personal memory or credentials."}</p><ProductLink locale={locale} href="/docs/guides/digital-employees">{zh ? "对照界面培养员工" : "Develop an employee in the Console"}</ProductLink></div>
    </ProductChapter>

    <ProductChapter id="knowledge" label={zh ? "03 / 按用途复用，不混成一个记忆库" : "03 / Reuse with clear purposes"} title={zh ? "留下事实、经验、方法与过程。" : "Keep facts, experience, methods and processes distinct."} intro={zh ? "不同资产有不同的来源、权限和生命周期。先分清它们解决什么问题，再决定如何采用和共享。" : "Different assets have different sources, permissions and lifecycles. Understand their purpose before adopting or sharing them."}>
      <dl className="asset-ledger">{assets.map(([name, purpose, detail, href]) => <div key={name}><dt>{name}</dt><dd><strong>{purpose}</strong><p>{detail}</p></dd><dd><ProductLink locale={locale} href={href}>{zh ? "了解更多" : "Learn more"}</ProductLink></dd></div>)}</dl>
    </ProductChapter>
    <section className="product-next product-width"><p>{zh ? "工作方式清楚之后，再看它运行在哪里。" : "Now see where this work runs and who controls it."}</p><div><ProductLink locale={locale} href="/architecture">{zh ? "查看企业架构" : "Explore the architecture"}</ProductLink><ProductLink locale={locale} href="/docs/getting-started/first-task">{zh ? "开始第一项工作" : "Start your first job"}</ProductLink></div></section>
  </div>;
}
