import type { ReactNode } from "react";

/** 业务关系图的绘制原语，不模拟可交互的产品界面。颜色继承所在页面主题。 */
export function Label({ x, y, children, size = 16, tone = "ink", middle = false }: { x: number; y: number; children: ReactNode; size?: number; tone?: "ink" | "muted" | "accent"; middle?: boolean }) {
  return <text x={x} y={y} fill={`var(--diagram-${tone})`} fontSize={size} textAnchor={middle ? "middle" : "start"}>{children}</text>;
}
export function Part({ name, children }: { name: string; children: ReactNode }) { return <g data-part={name}>{children}</g>; }
export function Panel({ x, y, width, height, accent = false }: { x: number; y: number; width: number; height: number; accent?: boolean }) {
  return <rect x={x} y={y} width={width} height={height} rx={16} fill={accent ? "var(--diagram-soft)" : "var(--diagram-fill)"} stroke="var(--diagram-line)" strokeWidth="1"/>;
}
export function Arrowhead({ id }: { id: string }) {
  return <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="var(--diagram-accent)" strokeWidth="1.4"/></marker></defs>;
}
export function Transfer({ name, d, marker }: { name: string; d: string; marker: string }) {
  return <>
    <g data-flow={name} opacity="0"><path data-route="" d={d} fill="none" stroke="var(--diagram-accent)" strokeWidth="1.5" markerEnd={`url(#${marker})`}/><g data-packet=""><rect x="-7" y="-5" width="14" height="10" rx="3" fill="var(--diagram-accent)"/></g></g>
    <path className="static-route" d={d} fill="none" stroke="var(--diagram-line)" strokeWidth="1.2" markerEnd={`url(#${marker})`}/>
  </>;
}
