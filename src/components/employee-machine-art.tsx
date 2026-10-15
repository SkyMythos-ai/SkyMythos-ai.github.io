import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import type { EmployeeScene } from "@/content/employee-story";
import { employeeFrame, EMPLOYEE_POSTER_SECONDS } from "@/components/employee-motion-model";
import { machineOrder, type MachineLayer } from "@/components/employee-machine-depth";

type ArtProps = Record<string, unknown> & { children?: ReactNode };

/** 将纯插图部件展开为可排序的实体层，面内细节仍与宿主留在一起。 */
export function MachineArt({ art, scene }: { art: ReactNode; scene: EmployeeScene["id"] }) {
  const layers: { art: ReactNode; geometry: MachineLayer }[] = [];
  const overlays: ReactNode[] = [];
  const back: ReactNode[] = [];
  const wrap = (node: ReactElement, motions: ArtProps[], key: string): ReactNode => {
    let result = cloneElement(node, { key });
    for (let i = motions.length - 1; i >= 0; i--) result = <g key={`${key}-${i}`} {...motions[i]}>{result}</g>;
    return result;
  };
  function visit(node: ReactNode, motions: ArtProps[] = []) {
    if (Array.isArray(node)) { node.forEach(child => visit(child, motions)); return; }
    if (!isValidElement<ArtProps>(node)) return;
    if (typeof node.type === "function") {
      visit((node.type as (props: ArtProps) => ReactNode)(node.props), motions);
      return;
    }
    const props = node.props;
    if (props["data-part"]) {
      const { children, ...attributes } = props;
      visit(children, [...motions, attributes]);
      return;
    }
    const box = props["data-box"] ?? props["data-surface-box"];
    if (typeof box === "string") {
      const key = `layer-${layers.length}`;
      layers.push({ art: wrap(node, motions, key), geometry: {
        box: box.split(" ").map(Number),
        motions: motions.map(props => ({ name: String(props["data-part"]), vector: String(props["data-world-vector"]).split(" ").map(Number) })),
      } });
    } else if (props.className === "machine-shadow") {
      back.push(cloneElement(node, { key: `shadow-${back.length}` }));
    } else if (node.type === "g" && !props.transform && (!props.className || props.className === "employee-machine")) {
      visit(props.children, motions);
    } else {
      overlays.push(wrap(node, motions, `overlay-${overlays.length}`));
    }
  }
  visit(art);
  const geometry = layers.map(layer => layer.geometry);
  const { order, cycles } = machineOrder(geometry, employeeFrame(scene, EMPLOYEE_POSTER_SECONDS).parts);
  if (cycles) throw new Error(`插图 ${scene} 存在无法排序的实体层`);
  return <g className="employee-machine">
    {back}
    <g data-depth-layer="" data-layers={JSON.stringify(geometry)}>{order.map(index => <g key={index} data-layer={index}>{layers[index].art}</g>)}</g>
    {overlays}
  </g>;
}
