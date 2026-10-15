import { Block, Groove, Screws, SurfaceLine } from "@/components/employee-machine-parts";
import { machinePoint } from "@/components/employee-machine-geometry";
import { employeeMaterial } from "@/components/employee-visual-material";
import { AnatomyMotion } from "./art";
import { architectureFrame } from "./architecture-model";

const frame = architectureFrame(3);
export const architectureViewBox = "144 112 352 294";

function Pin({ x, y, z }: { x: number; y: number; z: number }) {
  const [cx, cy] = machinePoint([x, y, z]);
  return <g><circle cx={cx} cy={cy} r={1.1} fill={employeeMaterial.faceTop} stroke={employeeMaterial.edge} strokeWidth={.5} /><circle cx={cx} cy={cy} r={.3} fill={employeeMaterial.highlight} /></g>;
}

/** 垂直壳面上的真实检修盖缝与固定螺钉，闭合线不产生悬空纹理端点。 */
function ServicePanel({ x, y, z, length, height, axis }: { x: number; y: number; z: number; length: number; height: number; axis: "x" | "y" }) {
  const at = (u: number, v: number) => machinePoint([x + (axis === "x" ? u : 0), y + (axis === "y" ? u : 0), z + v]);
  const outline = [at(0, 0), at(length, 0), at(length, height), at(0, height)];
  return <g><path className="iso-line machine-groove" d={`M${outline.map(p => p.join(" ")).join("L")}Z`} />{[[3, 3], [length - 3, 3], [length - 3, height - 3], [3, height - 3]].map(([u, v], i) => {
    const [cx, cy] = at(u, v);
    return <g key={i}><circle cx={cx} cy={cy} r={1.1} fill={employeeMaterial.faceTop} stroke={employeeMaterial.edge} strokeWidth={.5} /><circle cx={cx} cy={cy} r={.3} fill={employeeMaterial.highlight} /></g>;
  })}</g>;
}

function InputBed() {
  return <g>
    {[-143, -67].flatMap(x => [-31, 15].map(y => <Block key={`${x}-${y}`} x={x} y={y} w={10} d={10} z={0} h={6} tone="lo" />))}
    {[-146, -70].map(x => <Block key={x} x={x} y={-34} w={16} d={60} z={6} h={6}><Screws x={x} y={-34} w={16} d={60} z={12} /></Block>)}
    <Block x={-148} y={-36} w={98} d={64} z={12} h={6} tone="lo"><Groove x={-145} y={-33} w={92} d={58} z={18} /></Block>
    {[-36, 22].flatMap(y => [[-148, 30], [-118, 68]].map(([x, w]) => <Block key={`${x}-${y}`} x={x} y={y} w={w} d={6} z={18} h={4}><Groove x={x + 2} y={y + 1} w={w - 4} d={4} z={22} /></Block>))}
    <AnatomyMotion name="architecture-clamp-back" by={[0, 3, 0]} pose={frame.parts["architecture-clamp-back"]}>
      {[-128, -97].map(x => <Block key={x} x={x} y={-30} w={7} d={5} z={18} h={6} tone="hi"><Groove x={x + 1} y={-29} w={5} d={3} z={24} /></Block>)}
    </AnatomyMotion>
    <AnatomyMotion name="architecture-clamp-front" by={[0, -3, 0]} pose={frame.parts["architecture-clamp-front"]}>
      {[-128, -97].map(x => <Block key={x} x={x} y={13} w={7} d={5} z={18} h={6} tone="hi"><Groove x={x + 1} y={14} w={5} d={3} z={24} /></Block>)}
    </AnatomyMotion>
    {[-36, 22].map(y => <Block key={y} x={-128} y={y} w={10} d={6} z={22} h={30}><Pin x={-123} y={y + 3} z={52} /></Block>)}
    <Block x={-128} y={-36} w={10} d={64} z={52} h={6}><Groove x={-127} y={-33} w={8} d={58} z={58} /></Block>
    <Block x={-128} y={-12} w={10} d={16} z={36} h={16} tone="hi"><Groove x={-127} y={-11} w={8} d={14} z={52} /></Block>
  </g>;
}

function ChamberShell() {
  return <g>
    {[-44, 93].flatMap(x => [-60, 47].map(y => <Block key={`${x}-${y}`} x={x} y={y} w={11} d={11} z={0} h={6} tone="lo" />))}
    <Block x={-50} y={-66} w={160} d={130} z={6} h={7} tone="lo"><Groove x={-47} y={-63} w={154} d={124} z={13} /><Screws x={-46} y={-62} w={152} d={122} z={13} /></Block>
    <Block x={-40} y={-66} w={150} d={6} z={13} h={65}><Groove x={-36} y={-65} w={142} d={4} z={78} /><ServicePanel x={-28} y={-59.98} z={28} length={50} height={38} axis="x" /><ServicePanel x={30} y={-59.98} z={28} length={33} height={38} axis="x" /></Block>
    <Block x={104} y={-60} w={6} d={124} z={13} h={53}><Groove x={105} y={-56} w={4} d={116} z={66} /><ServicePanel x={110.02} y={-49} z={22} length={100} height={36} axis="y" /></Block>
    <Block x={-50} y={-66} w={10} d={28} z={13} h={65} />
    <Block x={-50} y={30} w={6} d={34} z={13} h={57} />
    <Block x={-44} y={58} w={44} d={6} z={13} h={15}><Groove x={-41} y={59} w={38} d={4} z={28} /></Block>
    <Block x={76} y={58} w={28} d={6} z={13} h={15}><Groove x={79} y={59} w={22} d={4} z={28} /></Block>
    {[-35, 43].map(x => <Block key={x} x={x} y={-66} w={66} d={6} z={78} h={3} tone="hi"><Pin x={x + 4} y={-63} z={81} /><Pin x={x + 62} y={-63} z={81} /></Block>)}
    <Block x={-50} y={-30} w={150} d={52} z={13} h={5} tone="lo"><Groove x={-47} y={-27} w={144} d={46} z={18} /></Block>
    {[[-40, 40], [76, 24]].map(([x, w]) => <Block key={x} x={x} y={22} w={w} d={6} z={13} h={5} tone="lo" />)}
    {[[-40, -36, 140], [-40, 22, 40], [76, 22, 24]].map(([x, y, w]) => <Block key={`${x}-${y}`} x={x} y={y} w={w} d={6} z={18} h={4}><Groove x={x + 2} y={y + 1} w={w - 4} d={4} z={22} /></Block>)}
    <Block x={70} y={-60} w={26} d={18} z={13} h={16} tone="lo" />
    <Block x={70} y={-60} w={26} d={18} z={29} h={20}><Groove x={73} y={-57} w={20} d={12} z={49} /></Block>
    <Block x={70} y={-60} w={26} d={18} z={49} h={3} tone="hi"><Screws x={71} y={-59} w={24} d={16} z={52} />{[76, 81, 86].map(x => <Groove key={x} x={x} y={-55} w={2} d={8} z={52} />)}</Block>
    {[70, 92].map(x => <Block key={x} x={x} y={-42} w={4} d={3} z={29} h={7} />)}
  </g>;
}

function Gate() {
  return <g>
    {[-38, 22].map(y => <Block key={y} x={-50} y={y} w={10} d={8} z={13} h={95}><Pin x={-45} y={y + 4} z={108} /></Block>)}
    <Block x={-50} y={-38} w={10} d={68} z={108} h={6} tone="hi"><Groove x={-49} y={-35} w={8} d={62} z={114} /></Block>
    <AnatomyMotion name="architecture-gate" by={[0, 0, 44]} pose={frame.parts["architecture-gate"]}>
      <Block x={-48} y={-30} w={6} d={52} z={18} h={38} />
      {[23, 45].map(z => <Block key={z} x={-42} y={-27} w={1.5} d={46} z={z} h={3} tone="hi" />)}
      <Block x={-48} y={-13} w={6} d={18} z={56} h={4} tone="hi"><Pin x={-45} y={-9} z={60} /><Pin x={-45} y={1} z={60} /></Block>
    </AnatomyMotion>
  </g>;
}

function ExecutionPress() {
  return <g>
    <Block x={55} y={-48} w={10} d={10} z={13} h={55}><Screws x={55} y={-48} w={10} d={10} z={68} /></Block>
    <Block x={55} y={-48} w={10} d={10} z={68} h={2} tone="hi" />
    <AnatomyMotion name="architecture-press" by={[0, 0, -9]} pose={frame.parts["architecture-press"]}>
      <Block x={39} y={-38} w={26} d={8} z={48} h={6} tone="hi"><Groove x={41} y={-37} w={22} d={6} z={54} /></Block>
      <Block x={39} y={-30} w={8} d={38} z={48} h={6} tone="hi"><Groove x={40} y={-28} w={6} d={34} z={54} /></Block>
      <Block x={36} y={-18} w={15} d={26} z={30} h={18} />
      <Block x={39} y={-8} w={8} d={10} z={54} h={6}><Pin x={43} y={-3} z={60} /></Block>
    </AnatomyMotion>
  </g>;
}

function DeliveryBed() {
  return <g>
    {[3, 63].flatMap(x => [69, 105].map(y => <Block key={`${x}-${y}`} x={x} y={y} w={10} d={10} z={0} h={13} tone="lo" />))}
    <Block x={0} y={22} w={76} d={96} z={13} h={5} tone="lo"><Groove x={3} y={25} w={70} d={90} z={18} /></Block>
    {[0, 72].map(x => <Block key={x} x={x} y={28} w={4} d={90} z={18} h={4}><Groove x={x + 1} y={31} w={2} d={84} z={22} /></Block>)}
    <Block x={4} y={114} w={68} d={4} z={18} h={4} tone="hi"><Pin x={8} y={116} z={22} /><Pin x={68} y={116} z={22} /></Block>
    {[-8, 76].map(x => <Block key={x} x={x} y={80} w={8} d={12} z={0} h={13} tone="lo" />)}
    {[-8, 76].map(x => <Block key={x} x={x} y={82} w={8} d={8} z={13} h={52}><Pin x={x + 4} y={86} z={65} /></Block>)}
    <AnatomyMotion name="architecture-check-bridge" by={[0, 0, -13]} pose={frame.parts["architecture-check-bridge"]}>
      <Block x={0} y={82} w={76} d={8} z={52} h={6} tone="hi"><Groove x={3} y={83} w={70} d={6} z={58} /></Block>
      {[22, 34, 46].map(x => <Block key={x} x={x} y={82} w={4} d={8} z={34} h={18} />)}
    </AnatomyMotion>
  </g>;
}

function Carrier() {
  return <AnatomyMotion name="architecture-carrier-x" by={[144, 0, 0]} pose={frame.parts["architecture-carrier-x"]}>
    <AnatomyMotion name="architecture-carrier-y" by={[0, 90, 0]} pose={frame.parts["architecture-carrier-y"]}>
      <g className="architecture-workpiece">
        <Block x={-131} y={-22} w={44} d={32} z={18} h={3} tone="hi">
          <Groove x={-129} y={-20} w={40} d={28} z={21} />
          <SurfaceLine points={[[-112, -20], [-112, 8]]} z={21} faint />
          {[-15, -9, -3].map((y, i) => <SurfaceLine key={y} points={[[-126, y], [-117 - i * 2, y]]} z={21} free />)}
          <SurfaceLine points={[[-128, 4], [-125, 7], [-119, 1], [-115, 1]]} z={21} motion="architecture-seal" free />
          {[0, 1, 2].map(i => <SurfaceLine key={i} points={[[-108, -15 + i * 8], [-94, -15 + i * 8], [-94, -12 + i * 8], [-101, -12 + i * 8]]} z={21} motion={`architecture-output-${i}`} free />)}
          {[0, 1, 2].map(i => {
            const x = -107 + i * 7;
            return <SurfaceLine key={i} points={[[x, 7], [x + 2, 9], [x + 5, 5]]} z={21} motion={`architecture-check-${i}`} free />;
          })}
        </Block>
      </g>
      <Block x={-131} y={-19} w={3} d={26} z={21} h={1.2} tone="hi" />
    </AnatomyMotion>
  </AnatomyMotion>;
}

/** 剖开隔离舱：左侧封签输入、舱内加工、前侧检验交付。所有支撑均为实际实体。 */
export function ArchitectureArt() {
  return <g key="architecture-machine"><InputBed /><ChamberShell /><Gate /><ExecutionPress /><DeliveryBed /><Carrier /></g>;
}
