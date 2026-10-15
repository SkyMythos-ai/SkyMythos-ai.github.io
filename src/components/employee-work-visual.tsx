import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { employeeMaterial as p } from "@/components/employee-visual-material";
import { machinePoint, machineSide, machineTop } from "@/components/employee-machine-geometry";
import { Block, Board, Check, Engraving, Groove, MachineCaption, Motion, Paper, Screws, SurfaceLine, Tray } from "@/components/employee-machine-parts";

/** 日常工作先形成经验与方法，再组装员工；雇佣凭证落座后才接入新任务。 */
export function IdentityVisual({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [workX, workY] = machinePoint([-112, -35, 5]);
  const [nextX, nextY] = machinePoint([25, -119, 5]);
  return <g className="employee-machine">
    <Board w={316} d={226}/>
    <SurfaceLine points={[[-74, 0], [-47, 0]]} z={5} faint/>
    <SurfaceLine points={[[0, -42], [0, -68]]} z={5} faint/>
    <SurfaceLine points={[[-17, 70], [-17, 45], [-36, 45], [-36, 44]]} z={5} faint/>
    <SurfaceLine points={[[105, 45], [58, 45], [58, 20], [45, 20]]} z={5} faint/>
    <Motion scene="identity" name="memory-recall"><SurfaceLine points={[[-17, 70], [-17, 45], [-36, 45], [-36, 44]]} z={5} accent="cyan" motion="memory-recall"/></Motion>
    <Motion scene="identity" name="skill-recall"><SurfaceLine points={[[105, 45], [58, 45], [58, 20], [45, 20]]} z={5} accent="violet" motion="skill-recall"/></Motion>
    <Tray x={-145} y={-30} w={70} d={60}/>
    {Array.from({ length: 4 }, (_, i) => <Motion key={i} scene="identity" name={`work-record-${i}`} by={[0, 0, 12]}>
      <Paper x={-139 + i} y={-25 + i} w={54} d={34} z={7 + i} accent={i % 2 === 0 ? "cyan" : "violet"}>
        <Check x={-106 + i} y={-5 + i} z={8 + i}/>
      </Paper>
    </Motion>)}
    <text x={workX} y={workY - 8} textAnchor="middle" className="machine-identity-note">{zh ? "日常工作" : "Daily work"}</text>
    <Tray x={-16} y={-108} w={82} d={48} accent="amber" open/>
    <text x={nextX} y={nextY - 8} textAnchor="middle" className="machine-identity-note">{zh ? "后续工作" : "Next task"}</text>
    <Motion scene="identity" name="followup-task" by={[0, 24, 0]}><Paper x={-8} y={-100} w={66} d={32} z={11} accent="blue"/></Motion>
    <Motion scene="identity" name="output" by={[0, -24, 0]}><Paper x={-8} y={-76} w={66} d={32} z={11} accent="blue"/></Motion>
    <Motion scene="identity" name="verify-left" by={[5, 0, 0]}><Block x={-19} y={-98} w={6} d={22} z={9.5} h={8} accent="amber"/></Motion>
    <Motion scene="identity" name="verify-right" by={[-5, 0, 0]}><Block x={63} y={-98} w={6} d={22} z={9.5} h={8} accent="amber"/></Motion>
    <Block x={-8} y={-100} w={66} d={56} z={7} h={4} tone="lo"/>
    <Motion scene="identity" name="verified"><Check x={41} y={-84} z={11} accent="amber" motion="verified"/></Motion>
    <Motion scene="identity" name="final-result"><SurfaceLine points={[[0, -79], [28, -79], [28, -86], [33, -86]]} z={11} accent="mint" motion="final-result" free/></Motion>
    <Block x={-51} y={-44} w={102} d={88} z={5} h={5} tone="lo"><Screws x={-51} y={-44} w={102} d={88} z={10}/></Block>
    {Array.from({ length: 7 }, (_, i) => <Block key={i} x={-40 + i * 12} y={-39} w={3} d={77} z={10} h={8} tone="lo"/>)}
    <Motion scene="identity" name="employee-body" by={[0, 0, 22]}><Block x={-44} y={-36} w={88} d={72} z={18} h={34}>
      <Groove x={-40} y={-32} w={80} d={64} z={52}/>
      <g transform={machineSide(-33, 36, 43, "left")}>
        {Array.from({ length: 7 }, (_, i) => <rect key={i} className="machine-vent" x={i * 9} y="0" width="3" height="11" rx=".8"/>)}
        <text x="0" y="20" fontSize="5" fill={p.secondary} letterSpacing="1">SKYMYTHOS</text>
      </g>
      <g transform={machineSide(44, 25, 43, "right")}>
        {Array.from({ length: 5 }, (_, i) => <rect key={i} className="machine-vent" x={i * 9} y="0" width="3" height="15" rx=".8"/>)}
      </g>
    </Block></Motion>
    <Motion scene="identity" name="employee-cover" by={[0, 0, 30]}><Block x={-38} y={-30} w={76} d={60} z={52} h={2} tone="hi">
      <image href={`${basePath}/brand/logo-mark.svg`} transform={machineTop(-14, -21, 54)} width="28" height="34"/>
      <Screws x={-38} y={-30} w={76} d={60} z={54}/>
    </Block></Motion>
    <Motion scene="identity" name="employee-name"><text x="320" y="118" textAnchor="middle" className="machine-object-label">{zh ? "研发 Agent" : "Development Agent"}</text></Motion>
    <Motion scene="identity" name="employee-available"><text x="320" y="146" textAnchor="middle" className="machine-identity-note">{zh ? "可雇佣" : "Available to hire"}</text></Motion>
    <Motion scene="identity" name="employee-hired"><text x="320" y="146" textAnchor="middle" className="machine-employment-state" fill={p.mint}>{zh ? "已雇佣" : "Hired"}</text></Motion>
    <Motion scene="identity" name="hire-credential" by={[76, 0, 0]}>
      <Block x={-28} y={17} w={56} d={10} z={54.05} h={.8} tone="hi" accent="mint">
        <Engraving x={-22} y={25} z={54.85} size={8} accent="mint">{zh ? "雇佣" : "HIRE"}</Engraving>
        <Motion scene="identity" name="hire-confirm"><Check x={13} y={20} z={54.85} motion="hire-confirm"/></Motion>
      </Block>
    </Motion>
    {[-1, 1].map(side => <g key={side}><Block x={side < 0 ? -50 : 44} y={-12} w={6} d={24} z={10} h={7}/>{[0, 1, 2].map(i => <Block key={i} x={side < 0 ? -51 : 47} y={-9 + i * 7} w={4} d={3} z={17} h={.8} tone="hi"/>)}</g>)}
    <Motion scene="identity" name="process-reuse"><SurfaceLine points={[[-35, -26], [35, -26]]} z={54.1} accent="mint" free/></Motion>
    {[-49, 8].map(x => <Block key={x} x={x} y={44} w={2} d={57} z={7} h={4}/>)}
    <Tray x={-57} y={58} w={75} d={48} accent="cyan"/>
    {Array.from({ length: 3 }, (_, i) => <Block key={i} x={-47} y={63 + i * 12} w={55} d={2} z={7} h={3} tone="lo"/>)}
    <Motion scene="identity" name="memory-record" by={[-89, -83, 0]}><Motion scene="identity" name="memory-lift" by={[0, 0, 42]}><Paper x={-49} y={66} w={59} d={32} z={11} accent="cyan"><SurfaceLine points={[[-41, 91], [-10, 91]]} z={12} accent="cyan" motion="memory-written" free/></Paper></Motion></Motion>
    <text x="181" y="427" textAnchor="middle" className="machine-object-label" fill={p.cyan}>Memory</text>
    <Motion scene="identity" name="memory-contact"><Block x={-34} y={44} w={12} d={3} z={8} h={2} tone="hi" accent="cyan"/></Motion>
    <Tray x={76} y={19} w={69} d={70} accent="violet"/>
    {[28, 74].map(y => <g key={y}><Block x={54} y={y} w={22} d={2} z={5} h={6}/><Block x={79} y={y} w={55} d={2} z={7} h={4}/></g>)}
    <Motion scene="identity" name="skill-cartridge" by={[-222, -45, 0]}><Motion scene="identity" name="skill-lift" by={[0, 0, 30]}>
      <Block x={86} y={28} w={48} d={48} z={11} h={5} tone="hi"><Groove x={91} y={33} w={38} d={38} z={16}/><Engraving x={95} y={56} z={16} size={16} accent="violet">{`</>`}</Engraving><Screws x={86} y={28} w={48} d={48} z={16}/><SurfaceLine points={[[94, 65], [125, 65]]} z={16} accent="violet" motion="skill-method" free/></Block>
      {[0, 1, 2, 3].map(i => <Block key={i} x={91 + i * 10} y={76} w={5} d={5} z={11} h={1} tone="hi" accent="violet"/>)}
    </Motion></Motion>
    <text x="451" y="427" textAnchor="middle" className="machine-object-label" fill={p.violet}>Skill</text>
    <Motion scene="identity" name="skill-contact"><Block x={45} y={20} w={3} d={12} z={10} h={2} tone="hi" accent="violet"/></Motion>
    <MachineCaption scene="identity" locale={locale}/>
  </g>;
}
