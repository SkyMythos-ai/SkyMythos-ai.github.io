import type { Locale } from "@/lib/i18n";
import { AnatomyLive } from "@/components/anatomy/live";
import { HumanPortrait, AgentPortrait } from "@/components/anatomy/character-parts";
import { PlanarMotion as Motion } from "@/components/anatomy/planar-motion";
import { overviewFrame } from "@/components/anatomy/overview-model";

/** Existing collaborators work on one goal; employee formation has its own explanation. */
export function WorkOverview({ locale }: { locale: Locale }) {
  const zh = locale === "zh", frame = overviewFrame(3);
  const stages = zh ? [
    { title: "明确目标", detail: "人说明目标、约束与验收标准。" },
    { title: "组织协作", detail: "SkyBot 统筹，按工作需要调用专业员工与工具。" },
    { title: "带证据交付", detail: "提交实际产物、检查记录与未完成事项。" },
    { title: "由人验收", detail: "人核对结果，并保留关键决定权。" },
  ] : [
    { title: "Define the goal", detail: "People define the goal, constraints and acceptance criteria." },
    { title: "Coordinate work", detail: "SkyBot coordinates specialists and tools as needed." },
    { title: "Deliver evidence", detail: "Return actual outputs, checks and unresolved work." },
    { title: "Human review", detail: "People review the result and retain key decisions." },
  ];
  const title = zh ? "一个目标，一次有依据的交付" : "One goal. An evidenced result.";
  return <figure className="work-overview" data-animation-scope="">
    <AnatomyLive kind="concept" variant="overview" locale={locale} title={title} description={zh ? "同一份工作由人交给 SkyBot，专业员工执行后带着证据返回，由人验收。已有员工协作示意，不代表员工培养步骤。" : "One piece of work moves from a person through SkyBot to a specialist, then returns with evidence for human review. Existing collaborators are shown, not employee formation."} viewBox="0 0 640 350" stages={stages} art={<>
      <HumanPortrait x={62} y={50} />
      <AgentPortrait x={266} y={64} size={108} />
      <AgentPortrait x={486} y={74} size={88} />
      {[
        [110, zh ? "人" : "Person", zh ? "目标与验收" : "Goals & review"],
        [320, "SkyBot", zh ? "统筹与交接" : "Coordination"],
        [530, zh ? "专业员工" : "Specialist", zh ? "按职责执行" : "Execution"],
      ].map(([x, name, detail]) => <g key={name}><text x={x} y="209" textAnchor="middle" className="overview-name">{name}</text><text x={x} y="234" textAnchor="middle" className="overview-note">{detail}</text></g>)}
      <Motion name="overview-active" pose={frame.parts["overview-active"]}><path d="M496 185h68" stroke="#aec9c2" strokeWidth="2" /></Motion>
      <Motion name="overview-transfer" pose={frame.parts["overview-transfer"]}><path d="M110 250v42h420v-42" stroke="#667b8d" strokeWidth="1.5" /></Motion>
      <Motion name="overview-work" by={[420, 0]} pose={frame.parts["overview-work"]}>
        <rect x="60" y="258" width="100" height="72" rx="6" fill="#dfe6ec" />
        <path d="M76 276h50M76 287h37" stroke="#526474" strokeWidth="2" strokeLinecap="round" />
        <Motion name="overview-evidence" pose={frame.parts["overview-evidence"]}><path d="M76 300h42M76 311h30" stroke="#526474" strokeWidth="2" strokeLinecap="round" /></Motion>
        <Motion name="overview-review" pose={frame.parts["overview-review"]}><path d="m130 308 6 6 12-15" stroke="#42675e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></Motion>
      </Motion>
    </>} />
    <figcaption>{zh ? "协作示意 · 人始终保留关键判断" : "Illustrative collaboration · People retain key decisions"}</figcaption>
  </figure>;
}
