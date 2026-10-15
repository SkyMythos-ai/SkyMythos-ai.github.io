import type { ReactNode } from "react";
import type { EmployeeScene } from "@/content/employee-story";
import type { Locale } from "@/lib/i18n";
import { employeeMaterial as p } from "@/components/employee-visual-material";
import { employeeFrame, employeeReadout, EMPLOYEE_POSTER_SECONDS } from "@/components/employee-motion-model";
import { machineBlock, machineLine, machineOutline, machinePoint, machineTop, machineVector } from "@/components/employee-machine-geometry";
import type { Point3 } from "@/components/employee-iso-kit";

export type Accent = "blue" | "cyan" | "violet" | "mint" | "amber";
export interface BlockSpec { x: number; y: number; w: number; d: number; z: number; h: number }

/** 有厚度的四阶实体；封闭轮廓盖住后方部件，细节在轮廓内部绘制。 */
export function Block({ x, y, w, d, z, h, radius, tone = "mid", accent, children }: BlockSpec & { radius?: number; tone?: "lo" | "mid" | "hi"; accent?: Accent; children?: ReactNode }) {
  const paths = machineBlock(x, y, w, d, z, h, radius);
  return <g className="iso-solid" data-solid="" data-box={[x, y, w, d, z, h].join(" ")} data-radius={radius} data-tone={tone}>
    <path className="machine-fill iso-fill" d={paths.fill}/>
    {paths.shades.map((path, index) => path && <path key={index} className="machine-shade" data-shade={index} d={path}/>)}
    <path className="machine-top" d={paths.top}/>
    <path className="iso-line iso-crease" d={paths.crease}/>
    {paths.bevel && <path className="iso-line iso-bevel" d={paths.bevel}/>}
    {children}
    <path className="iso-line iso-edge" d={paths.outline}/>
    {accent && <path className="iso-line machine-accent" style={{ stroke: p[accent] }} d={machineLine([[x + w, y], [x + w, y + d], [x, y + d]], z + h)}/>}
  </g>;
}

export function Screws({ x, y, w, d, z }: Omit<BlockSpec, "h">) {
  return <g className="machine-fasteners">{[[x + 3, y + 3], [x + w - 3, y + 3], [x + w - 3, y + d - 3], [x + 3, y + d - 3]].map(([sx, sy], i) => {
    const [px, py] = machinePoint([sx, sy, z]);
    return <g key={i}><circle cx={px} cy={py} r="1.35"/><circle cx={px} cy={py} r=".38" fill={p.highlight} stroke="none"/></g>;
  })}</g>;
}

export function Groove({ x, y, w, d, z }: Omit<BlockSpec, "h">) {
  return <path className="iso-line machine-groove" d={machineOutline({ x, y, w, d, r: 1 }, z)}/>;
}

export function Engraving({ x, y, z, children, size = 9, accent }: { x: number; y: number; z: number; children: ReactNode; size?: number; accent?: Accent }) {
  const width = String(children).length * size * .65;
  return <text data-surface-box={[x, y - size, width, size, z, .02].join(" ")} transform={machineTop(x, y, z)} fontSize={size} fill={accent ? p[accent] : p.secondary} className="machine-engraving">{children}</text>;
}

export function SurfaceLine({ points, z, accent, faint = false, free = false, motion }: { points: [number, number][]; z: number; accent?: Accent; faint?: boolean; free?: boolean; motion?: string }) {
  const ends = [points[0], points[points.length - 1]];
  const terminals = !free && Math.hypot(ends[0][0] - ends[1][0], ends[0][1] - ends[1][1]) > 15;
  const xs = points.map(point => point[0]), ys = points.map(point => point[1]);
  return <g data-surface-box={[Math.min(...xs), Math.min(...ys), Math.max(.02, Math.max(...xs) - Math.min(...xs)), Math.max(.02, Math.max(...ys) - Math.min(...ys)), z, .02].join(" ")}>
    <path className={`iso-line${faint ? " machine-groove" : ""}`} data-ink={motion} data-free={free ? "" : undefined} d={machineLine(points, z)} style={accent ? { stroke: `var(--machine-accent-${accent},${p[accent]})` } : undefined} pathLength={motion ? 100 : undefined} strokeDasharray={motion ? 100 : undefined} strokeDashoffset={motion ? 0 : undefined}/>
    {terminals && ends.map(([x, y], i) => {
      const [px, py] = machinePoint([x, y, z]);
      return <circle key={i} className="iso-wire-end" cx={px} cy={py} r=".85" fill={p.route}/>;
    })}
  </g>;
}

export function Motion({ scene, name, by = [0, 0, 0], children }: { scene: EmployeeScene["id"]; name: string; by?: Point3; children: ReactNode }) {
  const pose = employeeFrame(scene, EMPLOYEE_POSTER_SECONDS).parts[name];
  const [dx, dy] = machineVector(by);
  return <g data-part={name} data-world-vector={by.join(" ")} data-shift={pose?.shift ?? 0} data-vector={`${dx.toFixed(4)} ${dy.toFixed(4)}`} transform={`translate(${(dx * (pose?.shift ?? 0)).toFixed(3)} ${(dy * (pose?.shift ?? 0)).toFixed(3)})`} opacity={pose?.opacity ?? 1}>{children}</g>;
}

export function Board({ w = 318, d = 220 }: { w?: number; d?: number }) {
  const x = -w / 2, y = -d / 2;
  return <g>
    <path className="machine-shadow" d={machineBlock(x - 4, y - 4, w + 8, d + 8, -7, .1).fill}/>
    {[[x + 10, y + 10], [x + w - 22, y + 10], [x + 10, y + d - 22], [x + w - 22, y + d - 22]].map(([fx, fy], i) => <Block key={i} x={fx} y={fy} w={12} d={12} z={-5} h={5} tone="lo"/>)}
    <Block x={x} y={y} w={w} d={d} z={0} h={5} tone="lo">
      <Groove x={x + 5} y={y + 5} w={w - 10} d={d - 10} z={5}/>
      <Screws x={x + 5} y={y + 5} w={w - 10} d={d - 10} z={5}/>
      <g className="machine-ruler">{Array.from({ length: 24 }, (_, i) => <SurfaceLine key={i} points={[[x + 16 + i * 5, y + d - 5], [x + 16 + i * 5, y + d - (i % 5 === 0 ? 10 : 8)]]} z={5} faint/>)}</g>
    </Block>
  </g>;
}

export function Tray({ x, y, w, d, z = 5, accent, open = false }: Omit<BlockSpec, "h" | "z"> & { z?: number; accent?: Accent; open?: boolean }) {
  return <g>
    <Block x={x} y={y} w={w} d={d} z={z} h={2} tone="lo"/>
    <Block x={x} y={y} w={3} d={d} z={z + 2} h={2.5}/>
    <Block x={x + w - 3} y={y} w={3} d={d} z={z + 2} h={2.5}/>
    {!open && <Block x={x + 3} y={y + d - 3} w={w - 6} d={3} z={z + 2} h={2.5} accent={accent}/>}
  </g>;
}

export function Paper({ x, y, w = 55, d = 34, z, accent = "blue", children }: Omit<BlockSpec, "h"> & { accent?: Accent; children?: ReactNode }) {
  return <Block x={x} y={y} w={w} d={d} z={z} h={1} tone="hi" accent={accent}>
    <SurfaceLine points={[[x + 7, y + 8], [x + w - 8, y + 8]]} z={z + 1} accent={accent} free/>
    <SurfaceLine points={[[x + 7, y + 15], [x + w - 16, y + 15]]} z={z + 1} free/>
    <SurfaceLine points={[[x + 7, y + 21], [x + w - 11, y + 21]]} z={z + 1} faint free/>
    {children}
  </Block>;
}

export function Check({ x, y, z, accent = "mint", motion }: { x: number; y: number; z: number; accent?: Accent; motion?: string }) {
  return <SurfaceLine points={[[x, y + 3], [x + 3, y + 6], [x + 9, y - 2]]} z={z} accent={accent} motion={motion} free/>;
}

export function MachineCaption({ scene, locale, x = 54, y = 514 }: { scene: EmployeeScene["id"]; locale: Locale; x?: number; y?: number }) {
  return <g className="machine-caption">
    <circle cx={x - 12} cy={y - 6} r="2.2" fill={p.mint}/>
    <text data-readout="" x={x} y={y} className="machine-readout">{employeeReadout(employeeFrame(scene, EMPLOYEE_POSTER_SECONDS).phase, locale)}</text>
  </g>;
}
