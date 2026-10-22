import type { Locale } from "@/lib/i18n";
import { AnatomyLive } from "@/components/anatomy/live";
import { HumanPortrait, AgentPortrait } from "@/components/anatomy/character-parts";
import { PlanarMotion as Motion } from "@/components/anatomy/planar-motion";
import { workflowFrame } from "@/components/anatomy/workflow-model";

const frame = workflowFrame(5);
const pose = (name: string) => frame.parts[name];
const copy = {
  zh: {
    title: "从工作记录与经验，到数字员工",
    description: "人先与模型完成实际工作，留下记录、结果和经验。AI 提出总结与方法候选；人审核，把“核对导出”改为“按权限核对行数”，确认并决定采用后，才形成并配备数字员工。员工就绪后承接下一项任务，最终由人审阅交付。",
    work: "工作是起点",
    library: "工作记录 + 经验",
    evidence: "人始终负责判断与验收",
    scope: "先修改并采用方法，再培养数字员工",
    note: "培养示意 · AI 提出候选，人审核、修改、确认并决定采用；不是自动训练模型。",
    stages: [
      { title: "日常工作", detail: "先在人与模型的协作中完成真实工作。" },
      { title: "记录经验", detail: "留下工作记录、结果与可复用经验。" },
      { title: "修改并采用", detail: "AI 提出候选；人审核，将“核对导出”改为“按权限核对行数”，确认后决定采用。" },
      { title: "形成员工", detail: "基于已确认的经验，创建并配备数字员工。" },
      { title: "承接新任务", detail: "员工就绪后，再委派下一项工作。" },
      { title: "审阅交付", detail: "成果交回给人，工作记录与经验继续积累。" },
    ],
  },
  en: {
    title: "From work records and experience to a digital employee",
    description: "A person first works with a model and retains records, results and experience. AI proposes summaries and methods. A person reviews the candidate, changes “check export” to “check access and rows”, confirms it and chooses adoption before forming and equipping an employee. Only then does the employee take on a new task and return the result for human review.",
    work: "Start with real work",
    library: "Work records + experience",
    evidence: "People own judgement and review",
    scope: "Review, edit and adopt before creation",
    note: "Formation illustration · AI proposes; people review, edit, confirm and choose adoption. Not automatic model training.",
    stages: [
      { title: "Do real work", detail: "Start by completing real work with a model." },
      { title: "Keep experience", detail: "Retain work records, results and reusable experience." },
      { title: "Edit and adopt", detail: "AI proposes a candidate. A person reviews it, changes “check export” to “check access and rows”, confirms it and chooses adoption." },
      { title: "Form the employee", detail: "Create and equip the employee from confirmed experience." },
      { title: "Delegate next task", detail: "Only the ready employee takes on the next task." },
      { title: "Review delivery", detail: "People review the result; records and experience continue to accumulate." },
    ],
  },
};

/** 同一培养模型的新图形：记录、确认、形成、任务与验收各有明确位置。 */
function FormationArt({ locale, mobile }: { locale: Locale; mobile: boolean }) {
  const zh = locale === "zh";
  const box = mobile ? { work: [10,20,150,140], records: [185,20,155,140], plan: [10,235,150,160], employee: [185,235,155,160], task: [185,465,155,140], result: [10,465,150,140] } : { work: [10,20,180,140], records: [250,20,220,140], plan: [530,20,220,140], employee: [530,240,220,155], task: [250,265,220,105], result: [10,265,180,105] };
  const text = (key: keyof typeof box, y: number, value: string, accent = false) => <text x={box[key][0] + 16} y={box[key][1] + y} fontSize="14" fill={accent ? "var(--diagram-accent)" : "var(--diagram-muted)"}>{value}</text>;
  const panel = (key: keyof typeof box, title: string, accent = false) => <><rect x={box[key][0]} y={box[key][1]} width={box[key][2]} height={box[key][3]} rx="16" fill={accent ? "var(--diagram-soft)" : "var(--diagram-fill)"} stroke="var(--diagram-line)"/>{text(key,28,title,accent)}</>;
  return <g className={mobile ? "formation-mobile" : "formation-desktop"}>
    {panel("work",zh ? "日常工作" : "Real work")}
    <HumanPortrait x={box.work[0] + 18} y={box.work[1] + 46} width={35}/>
    <Motion name="prior-work" pose={pose("prior-work")}>{text("work",122,zh ? "记录结果与经验" : "Keep the results")}</Motion>
    <Motion name="source-log" pose={pose("source-log")}>{panel("records",zh ? "工作记录" : "Work records")}{text("records",64,zh ? "过程与检查依据" : "Work and checks")}</Motion>
    <Motion name="source-experience" pose={pose("source-experience")}>{text("records",98,zh ? "经验与纠正来源" : "Experience")}</Motion>
    <Motion name="source-method" pose={pose("source-method")}>{panel("plan",zh ? "AI 方法候选" : "AI method draft",true)}{text("plan",54,zh ? "候选：核对导出" : "Check export")}</Motion>
    <Motion name="source-role" pose={pose("source-role")}><path d={`M${box.plan[0] + 16} ${box.plan[1] + 49}h100`} stroke="var(--diagram-muted)"/>{text("plan",78,zh ? "人审核修改" : "Human edit")}{text("plan",100,zh ? "按权限核对行数" : "Access + rows",true)}</Motion>
    <Motion name="source-confirmed" pose={pose("source-confirmed")}>{text("plan",123,zh ? "人确认并采用" : "Adopted by person",true)}</Motion>
    <Motion name="agent-visible" pose={pose("agent-visible")}>{panel("employee",zh ? "形成员工" : "Form employee",true)}<AgentPortrait x={box.employee[0] + 20} y={box.employee[1] + 44} size={38}/></Motion>
    <Motion name="skill-record" pose={pose("skill-record")}>{text("employee",119,"Skill")}</Motion>
    <Motion name="mcp-record" pose={pose("mcp-record")}>{text("employee",141,"MCP")}</Motion>
    <Motion name="employee-ready" pose={pose("employee-ready")}>{text("employee",98,zh ? "已配备就绪" : "Equipped",true)}</Motion>
    <Motion name="delegated-work" pose={pose("delegated-work")}>{panel("task",zh ? "下一项工作" : "Next task")}{text("task",64,zh ? "按职责执行" : "Execute the work")}</Motion>
    <Motion name="agent-result" pose={pose("agent-result")}>{panel("result",zh ? "审阅交付" : "Review delivery")}{text("result",64,zh ? "产物与检查" : "Outputs, checks")}</Motion>
    <Motion name="human-approved" pose={pose("human-approved")}>{text("result",91,zh ? "人已验收" : "Accepted",true)}</Motion>
    <Motion name="source-method" pose={pose("source-method")}><path d={mobile ? "M262 172V198H85V223" : "M482 90H518"} stroke="var(--diagram-line)" fill="none"/></Motion>
    <Motion name="employee-ready" pose={pose("employee-ready")}><path d={mobile ? "M262 407V453" : "M640 407V427H360V382"} stroke="var(--diagram-line)" fill="none"/></Motion>
    <Motion name="agent-result" pose={pose("agent-result")}><path d={mobile ? "M173 535H162" : "M238 315H202"} stroke="var(--diagram-line)" fill="none"/></Motion>
    {["capture","develop"].map(name => <g key={name} data-part={`flow-${name}`} opacity="0"><path className={mobile ? "workflow-mobile" : "workflow-desktop"} data-flow-path={name} d={name === "capture" ? mobile ? "M162 90H173" : "M202 90H238" : mobile ? "M162 315H173" : "M640 172V228"} stroke="var(--diagram-accent)" fill="none"/></g>)}
  </g>;
}

export function HomeWorkflowFigure({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <figure className="anatomy-plate home-workflow-figure" lang={locale} aria-label={t.title}>
    <AnatomyLive kind="concept" variant="workflow" locale={locale} title={t.title} description={t.description} stages={t.stages} art={<><FormationArt locale={locale} mobile={false}/><FormationArt locale={locale} mobile={true}/></>} viewBox="0 0 760 440" mobileViewBox="0 0 350 630" overlay={<>{["capture","develop"].map(name => <g key={name} data-part={`flow-${name}`} data-flow-token={name} opacity="0"><rect x="-5" y="-4" width="10" height="8" rx="2" fill="var(--diagram-accent)"/></g>)}</>}/>
    <figcaption>{t.note}</figcaption>
    <noscript><style>{"@media(max-width:767px){.home-workflow-figure .anatomy-stage{display:none}}"}</style></noscript>
  </figure>;
}
