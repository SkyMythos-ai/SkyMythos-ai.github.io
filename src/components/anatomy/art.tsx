import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { machineVector } from "@/components/employee-machine-geometry";
import { machineOrder, type MachineLayer } from "@/components/employee-machine-depth";
import type { Point3 } from "@/components/employee-iso-kit";
import type { AnatomyFrame, AnatomyPartPose } from "./types";

type Attributes = Record<string, unknown> & { children?: ReactNode };

export function AnatomyMotion({ name, by = [0, 0, 0], pose, children }: {
  name: string; by?: Point3; pose?: AnatomyPartPose; children: ReactNode;
}) {
  const [dx, dy] = machineVector(by);
  const shift = pose?.shift ?? 0;
  return <g data-part={name} data-world-vector={by.join(" ")} data-vector={`${dx} ${dy}`} data-shift={shift} transform={`translate(${dx * shift} ${dy * shift})`} opacity={pose?.opacity ?? 1}>{children}</g>;
}

/** 展开服务端实体，同时保留父组材质与运动；路径进入客户端前已完成构造。 */
export function AnatomyArt({ art, frame }: { art: ReactNode; frame: AnatomyFrame }) {
  const layers: { art: ReactNode; geometry: MachineLayer }[] = [];
  const overlays: ReactNode[] = [], shadows: ReactNode[] = [];
  function wrap(node: ReactElement, context: Attributes[], key: string): ReactNode {
    let child: ReactNode = cloneElement(node, { key });
    for (let i = context.length - 1; i >= 0; i--) child = <g key={`${key}-${i}`} {...context[i]}>{child}</g>;
    return child;
  }
  function visit(node: ReactNode, context: Attributes[] = []) {
    if (Array.isArray(node)) { node.forEach(child => visit(child, context)); return; }
    if (!isValidElement<Attributes>(node)) return;
    if (typeof node.type === "function") { visit((node.type as (props: Attributes) => ReactNode)(node.props), context); return; }
    const props = node.props;
    if (props["data-part"] || (node.type === "g" && !props.transform && !props["data-box"] && !props["data-surface-box"])) {
      const { children, ...attributes } = props;
      visit(children, [...context, attributes]);
      return;
    }
    const box = props["data-box"] ?? props["data-surface-box"];
    if (typeof box === "string") {
      const index = layers.length;
      layers.push({ art: wrap(node, context, `solid-${index}`), geometry: {
        box: box.split(" ").map(Number),
        motions: context.filter(props => props["data-part"]).map(props => ({ name: String(props["data-part"]), vector: String(props["data-world-vector"]).split(" ").map(Number) })),
      } });
    } else if (props.className === "machine-shadow") shadows.push(wrap(node, context, `shadow-${shadows.length}`));
    else overlays.push(wrap(node, context, `overlay-${overlays.length}`));
  }
  visit(art);
  const geometry = layers.map(layer => layer.geometry);
  const { order, cycles } = machineOrder(geometry, frame.parts);
  if (cycles) throw new Error("Anatomy 实体存在无法排序的穿插");
  return <g className="employee-machine" key="anatomy-art">
    {shadows}
    <g data-anatomy-depth="" data-layers={JSON.stringify(geometry)}>{order.map(index => <g key={index} data-layer={index}>{layers[index].art}</g>)}</g>
    {overlays}
  </g>;
}
