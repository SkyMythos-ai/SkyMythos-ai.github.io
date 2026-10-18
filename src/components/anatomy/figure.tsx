import type { Locale } from "@/lib/i18n";
import { AnatomyArt } from "./art";
import { AnatomyLive } from "./live";
import { ConceptArt, conceptViewBox } from "./concept-art";
import { conceptFrame } from "./concept-model";
import { ArchitectureArt, architectureViewBox } from "./architecture-art";
import { architectureFrame } from "./architecture-model";
import type { AnatomyKind } from "./types";

const copy = {
  concept: {
    zh: {
      title: "从人机协作，到数字员工",
      description: "左侧的人先通过 Chat 与大模型共同做事，留下 Skill 方法和 MCP 工具接入，随后形成右侧的 Agent。Agent 配上 Skill 与 MCP 后组成数字员工。任务卡从人流向员工，成果返回后由人审批验收。",
      stages: [
        { title: "人 + 模型 Chat", detail: "人设定目标，与大模型通过 Chat 逐轮推进，先一起完成真实工作。" },
        { title: "沉淀 Skill / MCP", detail: "把做事的方法沉淀为 Skill，把所需工具接入保留为 MCP 能力。可复用能力先留下。" },
        { title: "形成 Agent", detail: "从持续工作中形成有明确职责、上下文和执行方式的 Agent。Agent、Skill、MCP 是不同对象。" },
        { title: "组成数字员工", detail: "把 Agent 与 Skill 方法、MCP 工具接入组合，成为能够承接这类工作的数字员工。" },
        { title: "指派任务", detail: "人下达目标与任务，数字员工使用配备的 Skill 和 MCP 执行，产出待审阅的结果。" },
        { title: "审批验收", detail: "员工把成果交还给人，由人审批与验收。你负责委派任务和结果把关。" },
      ],
      legend: ["Skill：可复用的工作方法", "MCP：可调用的工具接入", "Agent：承接目标与执行", "人：委派、审批与验收"],
      caption: "Agent + Skill + MCP = 数字员工。人从逐轮 Chat 推进工作，转为指派任务、审批与验收结果。",
    },
    en: {
      title: "From working together to a digital employee",
      description: "A person on the left works with a model in Chat. Reusable Skill methods and MCP tool connections are retained, then an Agent forms on the right. The Agent combines with Skill and MCP to become a digital employee. The person delegates a new task, the employee executes and returns a result, and the person reviews and accepts it.",
      stages: [
        { title: "Work in Chat", detail: "A person sets the goal and works with a model through Chat to complete real work." },
        { title: "Retain Skill / MCP", detail: "Retain working methods as a Skill and tool connections as MCP capabilities. Reusable capabilities come first." },
        { title: "Form an Agent", detail: "An Agent develops a defined role, context and execution approach. The Agent, Skill and MCP remain distinct objects." },
        { title: "Build an employee", detail: "Combine the Agent with Skill methods and MCP tool connections to form a digital employee for this work." },
        { title: "Delegate work", detail: "The person assigns a goal and task. The employee uses its Skill and MCP capabilities to execute and produce a result for review." },
        { title: "Review results", detail: "The employee returns the result to the person for approval and acceptance. You delegate the work and judge the outcome." },
      ],
      legend: ["Skill: reusable working methods", "MCP: callable tool connections", "Agent: goals and execution", "Person: delegation and approval"],
      caption: "Agent + Skill + MCP = digital employee. Your role moves from advancing each Chat turn to delegating work and reviewing its results.",
    },
  },
  architecture: {
    zh: {
      title: "任务在边界之间执行",
      description: "等距受控传递台：输入先经过控制侧检查，授权后经闸口进入剖开的隔离执行舱，在舱内加工为产物，最后经过检查进入交付仓。",
      stages: [
        { title: "检查输入", detail: "控制侧确认身份、工作范围和输入，解析并冻结本次执行需要的配置。" },
        { title: "授权环境", detail: "环境与授权就绪后，封签载荷才通过传递口。治理职责和执行职责保持分界。" },
        { title: "隔离执行", detail: "运行器在隔离环境内推进节点与会话，Agent Harness 执行工作，产生可检查的产物。" },
        { title: "检查交付", detail: "产物按声明的输出和质量检查交接，控制面保存任务状态及交付引用。并非所有门禁都要求人工审批。" },
      ],
      legend: ["输入床：控制与规格", "剖开舱：运行器与 Harness", "检验架：产物与交付条件"],
      caption: "机制示意：图中的闸口表示授权与交接条件，非真实硬件或固定人工审批。恢复与后续代际另按快照及证据边界处理。",
    },
    en: {
      title: "Execution across explicit boundaries",
      description: "An isometric transfer rig checks input on the control side, passes an authorised sealed carrier into a cutaway execution chamber, transforms the work and inspects the resulting artefact before delivery.",
      stages: [
        { title: "Check input", detail: "The control side checks identity, scope and inputs, then resolves and freezes the configuration needed for this execution." },
        { title: "Authorise runtime", detail: "The sealed work carrier passes the hatch after environment and authorisation checks. Governance and execution remain separate." },
        { title: "Execute in isolation", detail: "The runner advances nodes and sessions inside the isolated environment. The Agent Harness performs work and produces inspectable artefacts." },
        { title: "Inspect delivery", detail: "Declared outputs and quality checks govern the handoff. The control plane retains task state and delivery references; a gate does not always require a person." },
      ],
      legend: ["Input bed: control and specification", "Chamber: runner and Harness", "Inspection rig: delivery conditions"],
      caption: "A mechanism illustration: the hatch represents authorisation and handoff conditions, not physical product hardware or mandatory human approval. Recovery preserves its own snapshot and evidence boundaries.",
    },
  },
} as const;

export function ProductAnatomyFigure({ kind, locale }: { kind: AnatomyKind; locale: Locale }) {
  const t = copy[kind][locale];
  const frame = (kind === "concept" ? conceptFrame : architectureFrame)(t.stages.length - 1);
  return <figure className="anatomy-plate" aria-label={t.title} data-animation-scope="">
    <div className="anatomy-instrument-heading"><span>{kind === "concept" ? "Fig. 01" : "Fig. 02"}</span><span>{t.title}</span></div>
    <AnatomyLive kind={kind} locale={locale} title={t.title} description={t.description} stages={[...t.stages]} viewBox={kind === "concept" ? conceptViewBox : architectureViewBox} art={kind === "concept" ? <ConceptArt locale={locale} frame={frame} /> : <AnatomyArt frame={frame} art={<ArchitectureArt />} />}/>
    <figcaption><ul className="anatomy-legend">{t.legend.map(text => <li key={text}>{text}</li>)}</ul><p>{t.caption}</p></figcaption>
  </figure>;
}
