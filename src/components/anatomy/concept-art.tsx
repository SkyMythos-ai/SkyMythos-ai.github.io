import type { Locale } from "@/lib/i18n";
import { HumanPortrait, AgentPortrait } from "./character-parts";
import { PlanarMotion as Motion } from "./planar-motion";
import { conceptFrame } from "./concept-model";
import type { AnatomyFrame } from "./types";

export const conceptViewBox = "0 0 430 350";
export const conceptAnchors = { result: [88, 292], method: [288, 232] } as const;

/** The same person delegates and reviews. The Agent appears only after reusable work exists. */
export function ConceptArt({ locale, frame = conceptFrame(5) }: { locale: Locale; frame?: AnatomyFrame }) {
  const zh = locale === "zh";
  const pose = (name: string) => frame.parts[name];
  return <g className="concept-person-scene" data-planar-art="">
    <Motion name="employee-ready" pose={pose("employee-ready")}>
      <rect x="246" y="25" width="160" height="217" rx="16" fill="none" stroke="#647b80" strokeWidth="1.2" />
      <text x="326" y="17" textAnchor="middle" className="concept-note">{zh ? "数字员工" : "Digital employee"}</text>
    </Motion>
    <HumanPortrait x={40} y={24} />
    <text x="88" y="174" textAnchor="middle" className="concept-label">{zh ? "人" : "Person"}</text>
    <Motion name="model-ready" pose={pose("model-ready")}>
      <circle cx="338" cy="91" r="42" fill="#1b222b" stroke="#485463" />
      <text x="338" y="96" textAnchor="middle" className="concept-label">LLM</text>
    </Motion>
    <Motion name="agent-visible" by={[0, 8]} pose={pose("agent-visible")}>
      <AgentPortrait x={286} y={39} />
      <text x="338" y="174" textAnchor="middle" className="concept-label">Agent</text>
    </Motion>
    <Motion name="chat-screen" pose={pose("chat-screen")}>
      <path d="M140 86H150M242 86H276" stroke="#485463" />
      <rect x="150" y="47" width="92" height="90" rx="8" fill="#1b222b" stroke="#485463" />
      <text x="164" y="67" className="concept-note">Chat</text>
      <path d="M164 81H196" stroke="#b5c1cd" strokeWidth="3" strokeLinecap="round" />
      <Motion name="chat-reply-one" pose={pose("chat-reply-one")}><path d="M184 95H228" stroke="#7f97a9" strokeWidth="3" strokeLinecap="round" /></Motion>
      <Motion name="chat-user-two" pose={pose("chat-user-two")}><path d="M164 109H194" stroke="#b5c1cd" strokeWidth="3" strokeLinecap="round" /></Motion>
      <Motion name="chat-reply-two" pose={pose("chat-reply-two")}><path d="M184 123H228" stroke="#7f97a9" strokeWidth="3" strokeLinecap="round" /></Motion>
    </Motion>
    <Motion name="review-screen" pose={pose("review-screen")}>
      <path d="M140 86H150" stroke="#93aaa8" />
      <rect x="150" y="47" width="92" height="90" rx="8" fill="#1b222b" stroke="#647b80" />
      <text x="196" y="72" textAnchor="middle" className="concept-note">{zh ? "人确认结果" : "Human review"}</text>
      <Motion name="review-pending" pose={pose("review-pending")}><path d="M175 93H217M175 105H206M175 117H211" stroke="#a2afbb" strokeWidth="2" strokeLinecap="round" /></Motion>
      <Motion name="human-approved" pose={pose("human-approved")}><path d="m183 104 9 9 19-22" fill="none" stroke="#b2cfc7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Motion>
    </Motion>
    {(["skill", "mcp"] as const).map((name, index) => <Motion key={name} name={`${name}-record`} by={[86, 0]} pose={pose(`${name}-record`)}>
      <Motion name={`${name}-install`} by={index === 0 ? [110, 0] : [180, -50]} pose={pose(`${name}-install`)}>
        <g className="concept-capability">
          <rect x="62" y={190 + index * 50} width="60" height="42" rx="6" fill="#28333f" stroke="#748797" />
          <text x="92" y={216 + index * 50} textAnchor="middle" className="concept-label">{index === 0 ? "Skill" : "MCP"}</text>
          <Motion name={`${name}-use`} pose={pose(`${name}-use`)}><path d={`M72 ${226 + index * 50}h40`} stroke="#c7d8d3" strokeWidth="2" strokeLinecap="round" /></Motion>
        </g>
      </Motion>
    </Motion>)}
    <Motion name="work-lane" pose={pose("work-lane")}><path d="M88 254V292H338V254" fill="none" stroke="#485463" strokeWidth="1.2" /></Motion>
    <Motion name="delegated-work" by={[250, 0]} pose={pose("delegated-work")}>
      <rect x="52" y="260" width="72" height="64" rx="6" fill="#e0e6eb" />
      <path d="M64 274H100" stroke="#526474" strokeWidth="2" strokeLinecap="round" />
      <Motion name="agent-result" pose={pose("agent-result")}><path d="M64 285H111M64 295H99" stroke="#526474" strokeWidth="2" strokeLinecap="round" /></Motion>
      <Motion name="human-approved" pose={pose("human-approved")}><path d="m99 310 5 5 10-12" fill="none" stroke="#42675e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Motion>
    </Motion>
    <Motion name="human-review" by={[0, 2]} pose={pose("human-review")}><path d="M73 185H103" stroke="#b2cfc7" strokeWidth="2" strokeLinecap="round" /></Motion>
  </g>;
}
