import type { EmployeeScene } from "@/content/employee-story";
import type { Locale } from "@/lib/i18n";
import { employeeFrame, employeeReadout } from "@/components/employee-motion-model";
import { machineOrder, type MachineLayer } from "@/components/employee-machine-depth";

/** HeroStage 的唯一时钟驱动：只更新预计算实体的位移与蚀刻笔划。 */
export function createEmblemPainter(svg: SVGSVGElement, scene: EmployeeScene["id"], locale: Locale): (seconds: number) => void {
  const parts = Array.from(svg.querySelectorAll<SVGGElement>("[data-part]")).map(node => ({
    node,
    name: node.dataset.part!,
    vector: (node.dataset.vector ?? "0 0").split(" ").map(Number),
  }));
  const inks = Array.from(svg.querySelectorAll<SVGPathElement>("[data-ink]")).map(node => ({ node, name: node.dataset.ink! }));
  const readout = svg.querySelector<SVGTextElement>("[data-readout]");
  const layer = svg.querySelector<SVGGElement>("[data-depth-layer]");
  const geometry: MachineLayer[] = JSON.parse(layer?.dataset.layers ?? "[]");
  const nodes = Array.from(layer?.children ?? []).sort((a, b) => Number((a as SVGElement).dataset.layer) - Number((b as SVGElement).dataset.layer));
  let previousOrder = "";
  let previousPhase = "";
  return seconds => {
    const frame = employeeFrame(scene, seconds);
    if (layer) {
      const { order, cycles } = machineOrder(geometry, frame.parts);
      const signature = order.join(",");
      if (signature !== previousOrder) {
        const fragment = document.createDocumentFragment();
        for (const index of order) fragment.appendChild(nodes[index]);
        layer.appendChild(fragment);
        previousOrder = signature;
      }
      layer.dataset.depthCycles = String(cycles);
    }
    for (const { node, name, vector } of parts) {
      const pose = frame.parts[name];
      if (!pose) continue;
      if (pose.shift !== undefined) {
        node.setAttribute("transform", `translate(${(vector[0] * pose.shift).toFixed(3)} ${(vector[1] * pose.shift).toFixed(3)})`);
        node.dataset.shift = String(pose.shift);
      }
      if (pose.opacity !== undefined) node.setAttribute("opacity", pose.opacity.toFixed(4));
    }
    for (const { node, name } of inks) {
      node.setAttribute("stroke-dashoffset", ((1 - (frame.parts[name]?.draw ?? 1)) * 100).toFixed(3));
    }
    if (frame.phase !== previousPhase) {
      svg.dataset.phase = frame.phase;
      if (readout) readout.textContent = employeeReadout(frame.phase, locale);
      previousPhase = frame.phase;
    }
    svg.dataset.time = seconds.toFixed(3);
    svg.dataset.ready = "true";
  };
}
