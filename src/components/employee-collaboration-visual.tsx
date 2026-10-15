import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { employeeMaterial as p } from "@/components/employee-visual-material";
import { machineBlock, machinePoint, machineSide, machineTop } from "@/components/employee-machine-geometry";
import { Block, Check, Engraving, Groove, MachineCaption, Motion, Screws, SurfaceLine, type Accent } from "@/components/employee-machine-parts";

const peers = [
  { id: "claude", x: -166, y: -30, name: "Claude Code", logo: "claude-symbol.svg", accent: "amber" },
  { id: "codex", x: -47, y: -143, name: "Codex", logo: "openai-blossom.svg", accent: "blue" },
  { id: "kimi", x: 72, y: -30, name: "Kimi Code", logo: "kimi-symbol.svg", accent: "violet" },
  { id: "open", x: -47, y: 83, name: "Open Harness", logo: null, accent: "mint" },
] as const;

/** 每个接入端都有自己的机身、工作面和接口，品牌属于实际参与工作的主体。 */
function Peer({ id, x, y, name, logo, accent }: { id: string; x: number; y: number; name: string; logo: string | null; accent: Accent }) {
  const [cx, cy] = machinePoint([x + 47, y + 32, 20]);
  const labelX = cx - (id === "open" ? 70 : 0);
  const labelY = cy + (id === "claude" || id === "codex" ? -55 : 76);
  return <g>
    <path className="machine-shadow" d={machineBlock(x - 3, y - 3, 100, 70, -1, .1).fill}/>
    {[[x + 5, y + 5], [x + 79, y + 5], [x + 5, y + 50], [x + 79, y + 50]].map(([fx, fy], i) => <Block key={i} x={fx} y={fy} w={10} d={9} z={0} h={4} tone="lo"/>)}
    <Block x={x} y={y} w={94} d={64} z={4} h={4} tone="lo"/>
    <Block x={x + 3} y={y + 3} w={88} d={58} z={8} h={12}>
      <Groove x={x + 6} y={y + 6} w={82} d={52} z={20}/>
      <Screws x={x + 3} y={y + 3} w={88} d={58} z={20}/>
      <g transform={machineSide(x + 12, y + 61, 17, "left")}>
        {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={i * 9} y="0" width="5" height="5" rx="1" className="machine-vent"/>)}
      </g>
    </Block>
    <Block x={x + 12} y={y + 10} w={70} d={42} z={20} h={.3} tone="lo">
      <g transform={machineTop(x + 33, y + 17, 20.3)}>
        <rect width="28" height="28" rx="3" fill={p.paper}/>
        {logo ? <image href={`${basePath}/brand/${logo}`} x="3" y="3" width="22" height="22"/> : <text x="14" y="20" textAnchor="middle" fontSize="21" fill={p.darkInk}>∞</text>}
      </g>
    </Block>
    {[x + 7, x + 84].map(rx => <Block key={rx} x={rx} y={y + 7} w={3} d={50} z={20} h={3} tone="hi"/>)}
    <Block x={x + 35} y={y - 3} w={24} d={6} z={8} h={3} tone="lo"/>
    {[0, 1, 2].map(i => <Block key={i} x={x + 38 + i * 6} y={y - 3} w={3} d={3} z={11} h={.5} tone="hi"/>)}
    <Motion scene="collaboration" name={`peer-${id}`}><SurfaceLine points={[[x + 13, y + 56], [x + 81, y + 56]]} z={20.1} accent={accent} free/></Motion>
    <text x={labelX} y={labelY} textAnchor="middle" className="machine-peer-name">{name}</text>
  </g>;
}

/** 同一份稿件由不同执行端继续处理，修正、验证后落入共同交付座。 */
export function CollaborationVisual({ locale }: { locale: Locale }) {
  return <g className="employee-machine">
    {[
      { x: -72, y: 6, w: 25, d: 3 }, { x: 47, y: 6, w: 25, d: 3 },
      { x: -1.5, y: -79, w: 3, d: 45 }, { x: -1.5, y: 34, w: 3, d: 49 },
    ].map((bridge, i) => <Block key={i} {...bridge} z={0} h={4} tone="lo"/>)}
    {peers.map(peer => <Peer key={peer.id} {...peer}/>)}
    {[[ -42, -29], [33, -29], [-42, 23], [33, 23]].map(([x, y], i) => <Block key={i} x={x} y={y} w={9} d={9} z={0} h={4} tone="lo"/>)}
    <Block x={-47} y={-34} w={94} d={68} z={4} h={4} tone="lo"/>
    <Block x={-41} y={-30} w={82} d={60} z={8} h={4}>
      <Groove x={-39} y={-26} w={78} d={52} z={12}/><Screws x={-41} y={-30} w={82} d={60} z={12}/>
      <image href={`${basePath}/brand/logo-mark.svg`} transform={machineTop(-12, -15, 12)} width="24" height="29"/>
    </Block>
    {[-45, 41].map(x => <Block key={x} x={x} y={-20} w={4} d={42} z={8} h={5} tone="hi"/>)}
    <Block x={47} y={117} w={10} d={10} z={8} h={2} tone="lo"/>
    <Block x={57} y={117} w={25} d={10} z={0} h={8} tone="lo"/>
    <Block x={82} y={78} w={32} d={92} z={0} h={3} tone="lo">
      <Groove x={84} y={80} w={28} d={88} z={3}/>
    </Block>
    {[
      { id: "glm", y: 82, logo: "zai-symbol.svg", name: "GLM" },
      { id: "deepseek", y: 112, logo: "deepseek-symbol.svg", name: "DeepSeek" },
      { id: "grok", y: 142, logo: "grok-symbol.svg", name: "Grok" },
    ].map(({ id, y, logo, name }) => <g key={id}>
      <Block x={86} y={y - 2} w={26} d={26} z={3} h={7} tone="lo"/>
      <Motion scene="collaboration" name={`model-${id}`} by={[-39, 0, 0]}>
        <Block x={88} y={y} w={22} d={22} z={10} h={2} tone="hi">
          <title>{name}</title>
          <g transform={machineTop(89.5, y + 1.5, 12)}><rect width="19" height="19" rx="2" fill={p.paper}/><image href={`${basePath}/brand/${logo}`} x="2" y="2" width="15" height="15"/></g>
        </Block>
      </Motion>
    </g>)}
    <text x={148} y={428} textAnchor="middle" className="machine-model-name">DeepSeek</text>
    <Motion scene="collaboration" name="shared-work-x" by={[119, 0, 0]}><Motion scene="collaboration" name="shared-work-y" by={[0, 113, 0]}><Motion scene="collaboration" name="shared-work-seat" by={[0, 0, -11]}>
      <Block x={-157} y={-23} w={76} d={50} z={23} h={1.4} tone="hi">
        <Engraving x={-149} y={-14} z={24.4} size={5.3}>WORKING COPY</Engraving>
        <SurfaceLine points={[[-149, -9], [-128, -9], [-128, -5], [-111, -5], [-111, -9], [-91, -9]]} z={24.4} motion="shared-plan" accent="cyan" free/>
        <SurfaceLine points={[[-149, 1], [-112, 1], [-112, 5], [-103, 5]]} z={24.4} motion="shared-code-1" accent="violet" free/>
        <Motion scene="collaboration" name="shared-original"><SurfaceLine points={[[-149, 10], [-132, 10], [-132, 14], [-106, 14]]} z={24.4} motion="shared-code-2" free/></Motion>
        <SurfaceLine points={[[-149, 20], [-120, 20]]} z={24.4} motion="shared-code-3" free/>
        <Motion scene="collaboration" name="shared-review"><SurfaceLine points={[[-150, 8], [-105, 16]]} z={24.45} motion="shared-review" accent="amber" free/></Motion>
        <Motion scene="collaboration" name="shared-revised"><SurfaceLine points={[[-149, 10], [-125, 10], [-125, 14], [-106, 14]]} z={24.45} motion="shared-revised" accent="mint" free/></Motion>
        {[0, 1, 2].map(i => <Motion key={i} scene="collaboration" name={`shared-test-${i}`}><Check x={-99} y={-1 + i * 9} z={24.45} motion={`shared-test-${i}`}/></Motion>)}
      </Block>
    </Motion></Motion></Motion>
    <MachineCaption scene="collaboration" locale={locale} x={84} y={465}/>
  </g>;
}
