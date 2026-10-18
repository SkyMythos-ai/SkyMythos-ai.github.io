import type { Locale } from "@/lib/i18n";
import { AnatomyLive } from "@/components/anatomy/live";
import { ConceptArt, conceptAnchors } from "@/components/anatomy/concept-art";
import { PlanarMotion as Motion } from "@/components/anatomy/planar-motion";
import { workflowFrame } from "@/components/anatomy/workflow-model";

const frame = workflowFrame(5);
const pose = (name: string) => frame.parts[name];
const copy = {
  zh: {
    title: "从工作记录与经验，到数字员工",
    description: "人先与模型完成实际工作，留下工作记录、结果和经验。人整理职责、方法与工具配置并确认方案后，才形成数字员工。员工就绪后承接下一项任务，最终由人审阅交付。",
    work: "工作是起点",
    library: "工作记录 + 经验",
    evidence: "人始终负责判断与验收",
    scope: "先整理确认，再培养数字员工",
    note: "培养示意 · 经验经人整理确认，不是自动训练模型。",
    stages: [
      { title: "日常工作", detail: "先在人与模型的协作中完成真实工作。" },
      { title: "记录经验", detail: "留下工作记录、结果与可复用经验。" },
      { title: "整理确认", detail: "人整理职责、方法与工具，并确认培养方案。" },
      { title: "形成员工", detail: "基于已确认的经验，创建并配备数字员工。" },
      { title: "承接新任务", detail: "员工就绪后，再委派下一项工作。" },
      { title: "审阅交付", detail: "成果交回给人，工作记录与经验继续积累。" },
    ],
  },
  en: {
    title: "From work records and experience to a digital employee",
    description: "A person first works with a model and retains work records, results and experience. They curate the role, methods and tool configuration and confirm the plan before creating a digital employee. Only then does the employee take on a new task and return the result for human review.",
    work: "Start with real work",
    library: "Work records + experience",
    evidence: "People own judgement and review",
    scope: "Curate and confirm before creation",
    note: "Formation illustration · People curate experience; this is not automatic model training.",
    stages: [
      { title: "Do real work", detail: "Start by completing real work with a model." },
      { title: "Keep experience", detail: "Retain work records, results and reusable experience." },
      { title: "Review the plan", detail: "People curate the role, methods and tools, then confirm the plan." },
      { title: "Form the employee", detail: "Create and equip the employee from confirmed experience." },
      { title: "Delegate next task", detail: "Only the ready employee takes on the next task." },
      { title: "Review delivery", detail: "People review the result; records and experience continue to accumulate." },
    ],
  },
};

function ExperienceLibrary({ locale }: { locale: Locale }) {
  const labels = locale === "zh" ? ["记录", "经验", "方法", "职责"] : ["Log", "Notes", "Method", "Role"];
  const names = ["source-log", "source-experience", "source-method", "source-role"];
  return <g className="workflow-library">
    <path d="M32 143v25h254v-25" fill="none" stroke="#748797" strokeWidth="1.5" strokeLinejoin="round" />
    {[54, 110, 166, 222].map((x, index) => <Motion key={names[index]} name={names[index]} by={[0, -12]} pose={pose(names[index])}>
      <rect x={x - 4} y="58" width="44" height="97" rx="6" fill={index === 2 ? "#e0e6eb" : "#28333f"} stroke="#748797" />
      <path d={`M${x + 5} 76h22M${x + 5} 86h16`} fill="none" stroke={index === 2 ? "#526474" : "#93a6b5"} strokeWidth="2" strokeLinecap="round" />
      {index === 2 && <Motion name="source-confirmed" pose={pose("source-confirmed")}><path d={`m${x + 8} 111 5 5 12-14`} fill="none" stroke="#42675e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Motion>}
      <text x={x + 18} y="139" textAnchor="middle" fill={index === 2 ? "#526474" : "#c4cbd5"} fontSize="11">{labels[index]}</text>
    </Motion>)}
  </g>;
}

function FlowRoutes() {
  const result = conceptAnchors.result.join(" ");
  // Experience feeds the retained methods before those methods are installed on the Agent.
  const retainedMethod = "178 232";
  return <g className="workflow-routes" fill="none" stroke="#465263" strokeWidth="1.2">
    <Motion name="flow-capture" pose={pose("flow-capture")}>
      <path className="workflow-desktop" data-flow-path="capture" d={`M${result}C88 331 340 340 440 318S450 154 500 154H532`} />
      <path className="workflow-mobile" data-flow-path="capture" d={`M${result}C18 335 32 424 167 434`} />
    </Motion>
    <Motion name="flow-develop" pose={pose("flow-develop")}>
      <path className="workflow-desktop" data-flow-path="develop" d={`M642 154C642 8 430 8 420 110V220Q420 252 400 252H200Q178 252 ${retainedMethod}`} />
      <path className="workflow-mobile" data-flow-path="develop" d={`M277 434C430 380 418 260 ${retainedMethod}`} />
    </Motion>
  </g>;
}

function WorkEvidence({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <>
    <Motion name="prior-work" pose={pose("prior-work")}>
      <rect x="52" y="260" width="72" height="64" rx="6" fill="#e0e6eb" />
      <text x="64" y="278" fill="#526474" fontSize="11">{zh ? "工作记录" : "Work log"}</text>
      <Motion name="prior-experience" pose={pose("prior-experience")}><path d="M64 290H111M64 300H99M64 310H104" stroke="#526474" strokeWidth="2" strokeLinecap="round" /></Motion>
    </Motion>
    <Motion name="formation-review" pose={pose("formation-review")}>
      <path d="M140 86H150" stroke="#93aaa8" />
      <rect x="150" y="47" width="92" height="90" rx="8" fill="#1b222b" stroke="#647b80" />
      <text x="196" y="72" textAnchor="middle" className="concept-note">{zh ? "人确认方案" : "Confirm plan"}</text>
      <Motion name="formation-pending" pose={pose("formation-pending")}><path d="M175 93H217M175 105H206M175 117H211" stroke="#a2afbb" strokeWidth="2" strokeLinecap="round" /></Motion>
      <Motion name="source-confirmed" pose={pose("source-confirmed")}><path d="m183 104 9 9 19-22" fill="none" stroke="#b2cfc7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Motion>
    </Motion>
  </>;
}

function FlowOverlay({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <>
    <WorkEvidence locale={locale} />
    <g className="workflow-methods">
      <ExperienceLibrary locale={locale} />
      <text x="156" y="220" textAnchor="middle" className="workflow-object-label">{t.library}</text>
      <text x="156" y="242" textAnchor="middle" className="workflow-object-note">{t.scope}</text>
    </g>
    <g className="workflow-work-label">
      <text x="215" y="354" textAnchor="middle" className="workflow-object-label">{t.work}</text>
      <Motion name="flow-evidence" pose={pose("flow-evidence")}><text x="215" y="376" textAnchor="middle" className="workflow-object-note">{t.evidence}</text></Motion>
    </g>
    {["capture", "develop"].map(name => <g key={name} data-part={`flow-${name}`} data-flow-token={name} opacity="0">
      <rect x="-12" y="-17" width="24" height="34" rx="3" fill="#e0e6eb" stroke="#748797" />
      <path d="M-7-9H7M-7-4H3" fill="none" stroke="#526474" strokeWidth="1.5" />
      {name === "develop" && <path d="M-6 6l4 4 8-9" fill="none" stroke="#42675e" strokeWidth="1.5" />}
    </g>)}
  </>;
}

export function HomeWorkflowFigure({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <figure className="anatomy-plate home-workflow-figure" lang={locale} data-animation-scope="" aria-label={t.title}>
    <AnatomyLive kind="concept" variant="workflow" locale={locale} title={t.title} description={t.description} stages={t.stages} art={<ConceptArt locale={locale} frame={frame} />} viewBox="0 0 780 390" mobileViewBox="0 0 430 600" underlay={<FlowRoutes />} overlay={<FlowOverlay locale={locale} />} />
    <figcaption>{t.note}</figcaption>
    <noscript><style>{"@media(max-width:767px){.home-workflow-figure .anatomy-stage{overflow:hidden}.home-workflow-figure .anatomy-stage>svg{width:181.395%;height:65%}}"}</style></noscript>
  </figure>;
}
