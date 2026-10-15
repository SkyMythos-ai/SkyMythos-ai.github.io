import { Block, Check, Groove, Screws, SurfaceLine } from "@/components/employee-machine-parts";
import { machineSide, machineTop } from "@/components/employee-machine-geometry";
import { AnatomyMotion } from "./art";
import { conceptFrame } from "./concept-model";

export const conceptViewBox = "145 125 320 270";
const frame = conceptFrame(5);
const pose = (name: string) => frame.parts[name];

/** 人始终在场；Agent 形成后才与方法册、工具接入件组合。 */
export function ConceptArt() {
  return <g className="concept-person-scene">
    <Worktable />
    <Human />
    <Chat />
    <Modules />
    <Agent />
    <g className="concept-workpiece"><AnatomyMotion name="delegated-work" by={[100, 0, 0]} pose={pose("delegated-work")}>
      <Block x={-86} y={61} w={72} d={30} z={51} h={1} tone="hi">
        <SurfaceLine points={[[-79, 68], [-22, 68]]} z={52} free/>
        <AnatomyMotion name="agent-result" pose={pose("agent-result")}><SurfaceLine points={[[-79, 75], [-37, 75]]} z={52} motion="agent-result" free/><SurfaceLine points={[[-79, 82], [-47, 82]]} z={52} motion="agent-result" free/></AnatomyMotion>
        <AnatomyMotion name="human-approved" pose={pose("human-approved")}><Check x={-31} y={81} z={52} motion="human-approved"/></AnatomyMotion>
      </Block>
    </AnatomyMotion></g>
  </g>;
}

function Worktable() {
  return <g>
    {[-94, 85].flatMap(x => [35, 83].map(y => <Block key={`${x}-${y}`} x={x} y={y} w={9} d={9} z={0} h={48} tone="lo"/>))}
    {[-96, -48, 0, 48].flatMap(x => [33, 63].map(y => <Block key={`${x}-${y}-panel`} x={x} y={y} w={48} d={y === 33 ? 30 : 31} z={48} h={3} tone="lo"/>))}
    {[-96, 93].map(x => <Block key={x} x={x} y={33} w={3} d={61} z={51} h={2}/>)}
    <Block x={-12} y={25} w={84} d={8} z={50} h={1} tone="lo"/>
    <Block x={28} y={-4} w={44} d={29} z={50} h={1} tone="lo"/>
  </g>;
}

function Human() {
  const c = -50;
  return <g className="concept-human">
    <Block x={c - 24} y={-15} w={48} d={33} z={0} h={3} tone="lo"/>
    {[-18, 4].map(x => <g key={x}>
      <Block x={c + x} y={-12} w={14} d={27} z={3} h={5} tone="lo" radius={2}/>
      <Block x={c + x + 2} y={-8} w={10} d={14} z={8} h={33} tone="lo" radius={1.5}/>
    </g>)}
    <Block x={c - 18} y={-10} w={36} d={20} z={41} h={10} tone="lo" radius={2}/>
    <Block x={c - 14} y={-8} w={28} d={16} z={51} h={4} tone="lo"/>
    <Block x={c - 21} y={-12} w={42} d={24} z={55} h={28} tone="lo" radius={3}>
      <g transform={machineSide(c - 15, 12, 80, "left")}><path className="iso-line" d="M0 0L9 7L8 7L0 1ZM15 0L9 7L10 7L15 1Z"/><rect className="iso-line" x="8.7" y="7" width=".6" height="14"/><text x="21" y="9" fontSize="5" fill="#bdc4ce">人</text></g>
    </Block>
    <Block x={c - 4} y={-4} w={8} d={8} z={83} h={7} tone="hi"/>
    <Block x={c - 10} y={-10} w={20} d={18} z={90} h={18} tone="hi" radius={6}>
      <g transform={machineSide(c - 6, 8, 102, "left")}><rect className="iso-line" x="3" y="0" width="1.5" height=".6"/><rect className="iso-line" x="7.5" y="0" width="1.5" height=".6"/><rect className="iso-line" x="4" y="6" width="4" height=".6"/></g>
    </Block>
    <Block x={c - 10} y={-10} w={20} d={18} z={108} h={4} tone="lo" radius={3}/>
    <Block x={c - 1} y={8} w={3} d={2} z={97} h={3} tone="hi" radius={1}/>
    {[-28, 21].map(x => <Block key={x} x={c + x} y={-10} w={7} d={24} z={73} h={10} tone="lo"/>)}
    <AnatomyMotion name="human-chat" by={[0, 1, 0]} pose={pose("human-chat")}>
      <AnatomyMotion name="human-review" by={[0, -2, 0]} pose={pose("human-review")}>
        <Arms c={c} human />
      </AnatomyMotion>
    </AnatomyMotion>
  </g>;
}

function Agent() {
  const c = 50;
  return <g className="concept-employee"><AnatomyMotion name="agent-position" by={[0, -12, 0]} pose={pose("agent-position")}>
    <AnatomyMotion name="agent-foundation" pose={pose("agent-foundation")}>
      <Block x={c - 25} y={-16} w={50} d={34} z={0} h={3} tone="lo"/>
      {[-19, 4].map(x => <Block key={x} x={c + x} y={-12} w={15} d={28} z={3} h={6} radius={1.5}/>)}
      {[-16, 5].map(x => <g key={x}><Block x={c + x} y={-8} w={11} d={14} z={9} h={29} radius={1.5}/><Block x={c + x} y={-8} w={11} d={14} z={38} h={4} tone="lo"/></g>)}
      <Block x={c - 19} y={-10} w={38} d={20} z={42} h={8}/>
      <Block x={c - 15} y={-8} w={30} d={16} z={50} h={5} tone="lo"/>
    </AnatomyMotion>
    <AnatomyMotion name="agent-body" by={[6, 0, 0]} pose={pose("agent-body")}>
      <Block x={c - 22} y={-12} w={44} d={24} z={55} h={28} radius={2}>
        <Groove x={c - 18} y={-9} w={36} d={18} z={83}/>
        <g transform={machineSide(c - 16, 12, 78, "left")}><text className="concept-employee-name" x="0" y="4" fontSize="6">Agent</text><rect className="iso-line" x="0" y="10" width="26" height=".6"/></g>
        <AnatomyMotion name="employee-ready" pose={pose("employee-ready")}><g transform={machineSide(c - 12, 12, 65, "left")}><rect className="iso-line" data-ink="employee-ready" x="0" y="0" width="22" height=".8" pathLength="100" strokeDasharray="100" strokeDashoffset="0"/></g></AnatomyMotion>
      </Block>
      <Block x={c - 5} y={-5} w={10} d={10} z={83} h={6} tone="lo"/>
      <AnatomyMotion name="agent-head" by={[8, 0, 0]} pose={pose("agent-head")}>
        <Block x={c - 11} y={-12} w={22} d={20} z={89} h={18} radius={3.5}/>
        <Block x={c - 8} y={8} w={16} d={1} z={96} h={5} tone="lo"><g transform={machineSide(c - 7, 9, 101, "left")}><rect className="concept-employee-face" width="14" height="5" rx="1"/><rect className="concept-employee-eye" x="2" y="1.5" width="2.5" height="1" rx=".4"/><rect className="concept-employee-eye" x="9" y="1.5" width="2.5" height="1" rx=".4"/></g></Block>
      </AnatomyMotion>
      {[-28, 22].map(x => <Block key={x} x={c + x} y={-10} w={6} d={32} z={73} h={10} tone="lo"/>)}
      <AnatomyMotion name="agent-arms" by={[0, 12, 0]} pose={pose("agent-arms")}><Arms c={c}/></AnatomyMotion>
    </AnatomyMotion>
  </AnatomyMotion></g>;
}

function Arms({ c, human = false }: { c: number; human?: boolean }) {
  return <g>{[-37, 28].map(x => <g key={x}>
    <Block x={c + x} y={-8} w={9} d={14} z={58} h={22} tone={human ? "lo" : "mid"} radius={human ? 2 : 1}/>
    <Block x={c + x} y={6} w={9} d={7} z={54} h={8} tone="lo"/>
    <Block x={c + x + .5} y={13} w={8} d={36} z={54} h={7} tone={human ? "lo" : "mid"} radius={1}/>
    <Block x={c + x + 1} y={49} w={7} d={13} z={53} h={3} tone={human ? "hi" : "mid"} radius={1}/>
    <Block x={c + x + 1} y={59} w={7} d={3} z={52} h={1} tone="lo"/>
    <Block x={c + (x < 0 ? x + 8 : x - 2)} y={50} w={3} d={6} z={53} h={2} tone={human ? "hi" : "mid"} radius={.7}/>
  </g>)}</g>;
}

function Chat() {
  return <g className="concept-chat">
    <Block x={-75} y={33} w={50} d={4} z={51} h={2} tone="lo"/>
    <Block x={-75} y={34} w={50} d={2} z={53} h={30} tone="lo">
      <g transform={machineSide(-72, 36, 80, "left")}>
        <AnatomyMotion name="chat-screen" pose={pose("chat-screen")}>
        <text className="machine-engraving" x="0" y="3" fontSize="5.5">Chat</text><text className="machine-engraving" x="28" y="3" fontSize="5">LLM</text>
        <Bubble x={17} y={6} w={25} d={3.2}/><rect className="iso-line" x="20" y="7.5" width="18" height=".5"/>
        <Bubble x={0} y={10.5} w={27} d={3.2}/><AnatomyMotion name="chat-reply-one" pose={pose("chat-reply-one")}><rect className="iso-line" x="3" y="12" width="20" height=".5"/></AnatomyMotion>
        <Bubble x={17} y={15} w={25} d={3.2}/><AnatomyMotion name="chat-user-two" pose={pose("chat-user-two")}><rect className="iso-line" x="20" y="16.5" width="18" height=".5"/></AnatomyMotion>
        <Bubble x={0} y={19.5} w={27} d={3.2}/><AnatomyMotion name="chat-reply-two" pose={pose("chat-reply-two")}><rect className="iso-line" x="3" y="21" width="20" height=".5"/></AnatomyMotion>
        </AnatomyMotion>
        <AnatomyMotion name="review-screen" pose={pose("review-screen")}>
          <text className="machine-engraving" x="0" y="3" fontSize="5.5">Review</text>
          <rect className="iso-line" x="0" y="7" width="44" height="8" rx=".7"/>
          <text className="machine-engraving" x="3" y="12.5" fontSize="4.3">Result</text><rect className="iso-line" x="23" y="9.5" width="17" height=".5"/><rect className="iso-line" x="23" y="12.5" width="12" height=".5"/>
          <rect className="iso-line" x="0" y="18" width="44" height="7" rx=".8" style={{ fill: "#bdc4ce", stroke: "#dce0e6" }}/>
          <AnatomyMotion name="review-pending" pose={pose("review-pending")}><text className="machine-engraving" x="8" y="23.3" fontSize="5.5" style={{ fill: "#202833" }}>Approve</text></AnatomyMotion>
          <AnatomyMotion name="human-approved" pose={pose("human-approved")}><text className="machine-engraving" x="3" y="23.3" fontSize="5" style={{ fill: "#202833" }}>Approved</text><path className="iso-line" data-free="" data-ink="human-approved" d="M33 21.5L35 23.3L41 19.5" pathLength="100" strokeDasharray="100" strokeDashoffset="0" style={{ stroke: "#202833" }}/></AnatomyMotion>
        </AnatomyMotion>
      </g>
    </Block>
    <Block x={-84} y={54} w={68} d={7} z={51} h={1} tone="lo"><g transform={machineTop(-81, 55, 52)}>{[0, 1].flatMap(row => Array.from({ length: 10 }, (_, i) => <rect key={`${row}-${i}`} className="iso-line" x={i * 6} y={row * 2.3} width="4" height="1.6" rx=".3"/>))}<rect className="iso-line" x="0" y="4.4" width="60" height="1.3" rx=".3"/></g></Block>
  </g>;
}
function Bubble({ x, y, w, d }: { x: number; y: number; w: number; d: number }) {
  return <path className="iso-line" d={`M${x} ${y}H${x + w}V${y + d}H${x + 5}L${x + 2} ${y + d + 1.2}V${y + d}H${x}Z`}/>;
}

function Modules() {
  return <g>
    <AnatomyMotion name="skill-record" by={[33, 0, 0]} pose={pose("skill-record")}><AnatomyMotion name="skill-install" by={[0, -25, 0]} pose={pose("skill-install")}>
      <g className="concept-source-records"><Block x={-4} y={25} w={19} d={12} z={51} h={3}><Groove x={-1} y={27} w={14} d={8} z={54}/><g transform={machineTop(-1, 32, 54)}><text className="machine-engraving" fontSize="4.5">Skill</text></g></Block><Block x={-4} y={25} w={2} d={12} z={54} h={1} tone="lo"/><AnatomyMotion name="skill-use" by={[10, 0, 0]} pose={pose("skill-use")}><Block x={-1} y={27} w={1} d={8} z={54} h={.6} tone="hi"/></AnatomyMotion></g>
    </AnatomyMotion></AnatomyMotion>
    <AnatomyMotion name="mcp-record" by={[33, 0, 0]} pose={pose("mcp-record")}><AnatomyMotion name="mcp-install" by={[0, -25, 0]} pose={pose("mcp-install")}>
      <Block x={19} y={25} w={19} d={12} z={51} h={3} tone="lo"><g transform={machineTop(22, 31, 54)}><text className="machine-engraving" fontSize="4.5">MCP</text></g><SurfaceLine points={[[22, 33], [35, 33]]} z={54} free/></Block>
      <AnatomyMotion name="mcp-use" by={[0, -3, 0]} pose={pose("mcp-use")}>{[22, 27, 32].map(x => <Block key={x} x={x} y={35} w={2} d={2} z={54} h={2} tone="hi"/>)}</AnatomyMotion>
    </AnatomyMotion></AnatomyMotion>
  </g>;
}
