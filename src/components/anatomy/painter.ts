import { machineOrder, type MachineLayer } from "@/components/employee-machine-depth";
import type { Locale } from "@/lib/i18n";
import type { AnatomyFrame } from "./types";

export function anatomyPainter(svg: SVGSVGElement, model: (position: number) => AnatomyFrame, locale: Locale, readout: HTMLElement | null) {
  const parts = [...svg.querySelectorAll<SVGGElement>("[data-part]")].map(node => ({ node, name: node.dataset.part!, vector: (node.dataset.vector ?? "0 0").split(" ").map(Number) }));
  const inks = [...svg.querySelectorAll<SVGPathElement>("[data-ink]")];
  const layer = svg.querySelector<SVGGElement>("[data-anatomy-depth]");
  const geometry: MachineLayer[] = JSON.parse(layer?.dataset.layers ?? "[]");
  const nodes = [...(layer?.children ?? [])].sort((a, b) => Number((a as SVGElement).dataset.layer) - Number((b as SVGElement).dataset.layer));
  let lastOrder = "";
  return (position: number) => {
    const frame = model(position);
    const { order, cycles } = machineOrder(geometry, frame.parts);
    const key = order.join(",");
    if (layer && key !== lastOrder) {
      const fragment = document.createDocumentFragment();
      order.forEach(index => fragment.appendChild(nodes[index]));
      layer.appendChild(fragment);
      lastOrder = key;
    }
    for (const { node, name, vector } of parts) {
      const pose = frame.parts[name];
      if (!pose) continue;
      const shift = pose.shift ?? 0;
      node.setAttribute("transform", `translate(${(vector[0] * shift).toFixed(3)} ${(vector[1] * shift).toFixed(3)})`);
      node.dataset.shift = String(shift);
      node.setAttribute("opacity", String(pose.opacity ?? 1));
    }
    inks.forEach(node => node.setAttribute("stroke-dashoffset", String((1 - (frame.parts[node.dataset.ink!]?.draw ?? 1)) * 100)));
    const text = frame.readout[locale === "zh" ? 0 : 1];
    if (readout && readout.textContent !== text) readout.textContent = text;
    svg.dataset.position = position.toFixed(4);
    svg.dataset.depthCycles = String(cycles);
    svg.dataset.ready = "true";
    return frame;
  };
}
