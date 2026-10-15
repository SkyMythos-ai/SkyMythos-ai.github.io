import type { Locale } from "@/lib/i18n";
import { employeeMaterial as p } from "@/components/employee-visual-material";
import { machinePoint } from "@/components/employee-machine-geometry";
import { Block, Board, Check, Engraving, Groove, MachineCaption, Motion, Paper, Screws, SurfaceLine, Tray } from "@/components/employee-machine-parts";

const sources = [
  { id: "docs", z: 61, accent: "violet", label: ["项目文档", "Documents"] },
  { id: "decisions", z: 39, accent: "amber", label: ["技术决策 [1]", "Decisions [1]"] },
  { id: "notes", z: 17, accent: "mint", label: ["工作经验", "Work notes"] },
] as const;

/** 原件留存；检索头停在中层，抽屉伸出后将正文与来源一起交给任务。 */
export function KnowledgeVisual({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [rackX] = machinePoint([-108, 78, 69]);
  return <g className="employee-machine">
    <Board w={320} d={234}/>
    <Tray x={-145} y={22} w={71} d={66}/>
    {[-142, -79].flatMap(x => [25, 77].map(y => <Block key={`${x}-${y}`} x={x} y={y} w={4} d={4} z={x === -79 ? 9.5 : 7} h={x === -79 ? 57.5 : 60} tone="lo"/>))}
    <Block x={-142} y={25} w={67} d={3} z={67} h={3}/>
    {sources.slice().reverse().map(({ id, z, accent, label }) => <g key={id}>
      {[-142, -79].map(x => <Block key={x} x={x} y={29} w={4} d={6} z={z - 2} h={2} tone="lo"/>)}
      <Block x={-138} y={29} w={59} d={49} z={z - 2} h={2} tone="lo"/>
      <Paper x={-134} y={33} w={51} d={39} z={z} accent={accent}/>
      <Engraving x={-130} y={68} z={z + 1} size={7} accent={accent}>{label[zh ? 0 : 1]}</Engraving>
    </g>)}
    <text x={rackX - 2} y={382} textAnchor="middle" className="machine-object-label">{zh ? "原始资料" : "Original sources"}</text>
    <text x={rackX - 2} y={408} textAnchor="middle" className="machine-object-note">{zh ? "保留原件" : "Retained"}</text>
    <Block x={-25} y={-108} w={154} d={85} z={5} h={5} tone="lo"/>
    {[-23, 123].map(x => <g key={x}>
      <Block x={x} y={-104} w={5} d={72} z={10} h={4}/><Block x={x} y={-104} w={5} d={5} z={14} h={69}/><Block x={x} y={-37} w={5} d={5} z={14} h={69}/>
    </g>)}
    <Block x={-23} y={-104} w={151} d={5} z={83} h={5}/>
    <Block x={-23} y={-37} w={151} d={5} z={83} h={5}><Screws x={-23} y={-37} w={151} d={5} z={88}/></Block>
    {sources.slice().reverse().map(({ id, z, accent }) => <g key={id}>
      {[-18, 112].map(x => <Block key={x} x={x} y={-100} w={10} d={93} z={z - 3} h={2} tone="lo"/>)}
      <Motion scene="experience" name={id === "decisions" ? "selected-drawer" : `drawer-${id}`} by={[0, id === "decisions" ? 25 : 0, 0]}>
        <Block x={-12} y={-100} w={128} d={65} z={z - 1} h={2}><Groove x={-8} y={-96} w={120} d={57} z={z + 1}/></Block>
        <Block x={-12} y={-35} w={128} d={3} z={z - 1} h={7} accent={accent}><Screws x={-12} y={-35} w={128} d={3} z={z + 6}/></Block>
        <Block x={38} y={-32} w={27} d={5} z={z - 1} h={3} tone="hi"/>
        <Motion scene="experience" name={`index-${id}`}><SurfaceLine points={[[0, -85], [74, -85], [74, -76], [101, -76]]} z={z + 1.2} accent={accent} motion={`index-${id}`} free/><SurfaceLine points={[[0, -66], [43, -66], [43, -59], [91, -59]]} z={z + 1.2} faint free/></Motion>
        {id === "decisions" && <Motion scene="experience" name="selected-content"><Paper x={0} y={-72} w={100} d={30} z={z + 1} accent="amber"/><Engraving x={8} y={-48} z={z + 2} size={10} accent="amber">[1]</Engraving></Motion>}
      </Motion>
    </g>)}
    <Block x={-35} y={-32} w={5} d={7} z={11} h={75}/>
    <Block x={-38} y={-36} w={11} d={15} z={5} h={6} tone="lo"/><Block x={-38} y={-36} w={11} d={15} z={86} h={3}/>
    <Motion scene="experience" name="search-head" by={[0, 0, -22]}><Block x={-35} y={-25} w={11} d={10} z={62} h={12} accent="blue"/><Block x={-29} y={-32} w={3} d={7} z={64} h={7} tone="hi" accent="blue"/></Motion>
    <Engraving x={-7} y={-110} z={88} size={10}>{zh ? "组织检索索引" : "KNOWLEDGE INDEX"}</Engraving>
    {sources.map(({ id, z, accent }, i) => <Motion key={id} scene="experience" name={`copy-${id}`} by={[0, -47, 0]}><Motion scene="experience" name={`lift-${id}`} by={[0, 0, 3]}><Motion scene="experience" name={`transfer-${id}`} by={[119, 0, 0]}><Motion scene="experience" name={`insert-${id}`} by={[0, -64, 0]}><Motion scene="experience" name={`seat-${id}`} by={[0, 0, -7 - i]}><Paper x={-131} y={37} w={46} d={29} z={z + 5 + i} accent={accent}/></Motion></Motion></Motion></Motion></Motion>)}
    <SurfaceLine points={[[32, 57], [32, 28], [-32, 28], [-32, -21]]} z={5} faint/>
    <Motion scene="experience" name="query"><SurfaceLine points={[[32, 57], [32, 28], [-32, 28], [-32, -21]]} z={5} accent="blue" motion="query"/></Motion>
    <Tray x={-6} y={58} w={150} d={54} accent="blue"/>
    <Engraving x={6} y={121} z={5} size={12}>{zh ? "当前任务" : "CURRENT TASK"}</Engraving>
    <Block x={0} y={64} w={138} d={42} z={7} h={2} tone="lo"/>
    <Block x={0} y={64} w={138} d={42} z={9} h={1.2} tone="lo"><Engraving x={6} y={78} z={10.2} size={11} accent="blue">{zh ? "部署约束" : "Deployment constraints"}</Engraving><SurfaceLine points={[[6, 85], [80, 85]]} z={10.2} faint free/></Block>
    <Motion scene="experience" name="excerpt" by={[0, 131, 0]}><Motion scene="experience" name="excerpt-release" by={[0, 0, 7]}><Motion scene="experience" name="excerpt-seat" by={[0, 0, -37.8]}>
      <Block x={3} y={-47} w={112} d={25} z={41} h={1.2} tone="hi" accent="amber"><Engraving x={9} y={-31} z={42.2} size={10}>{zh ? "分阶段发布" : "Staged rollout"}</Engraving><Engraving x={92} y={-31} z={42.2} size={12} accent="amber">[1]</Engraving><SurfaceLine points={[[9, -27], [106, -27]]} z={42.2} accent="amber" free/></Block>
    </Motion></Motion></Motion>
    <Motion scene="experience" name="task-content"><SurfaceLine points={[[10, 105], [87, 105]]} z={12.4} accent="amber" motion="task-content" free/></Motion>
    <Motion scene="experience" name="task-verified"><Check x={119} y={99} z={12.4} motion="task-verified"/></Motion>
    <g className="machine-source-legend">{sources.map(({ id, accent }, i) => <g key={id} transform={`translate(${48 + i * 185} 112)`}>
      <rect x="0" y="-9" width="5" height="5" fill={p[accent]}/><text x="13" y="0" fill={p.secondary}>{(zh ? ["项目文档", "决策 [1]", "工作经验"] : ["Documents", "Decision [1]", "Work notes"])[i]}</text>
    </g>)}</g>
    <text x="40" y="481" className="machine-query-caption" fill={p.blue}>{zh ? "部署约束" : "Deployment"}</text>
    <Motion scene="experience" name="task-content"><text x="230" y="481" className="machine-query-caption" fill={p.amber}>{zh ? "分阶段发布 [1]" : "Staged rollout [1]"}</text></Motion>
    <MachineCaption scene="experience" locale={locale}/>
  </g>;
}
