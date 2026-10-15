import { anatomyProgress, type AnatomyFrame } from "./types";

/** 检查、授权、舱内加工与交付共用同一封签载体，冻结区不在加工时改写。 */
export function architectureFrame(position: number): AnatomyFrame {
  const at = Math.max(0, Math.min(3, position));
  const p = (from: number, to: number) => anatomyProgress(at, from, to);
  const clamp = p(.06, .25) * (1 - p(.55, .7));
  const open = p(.7, .94) * (1 - p(1.52, 1.74));
  const press = p(1.76, 1.98) * (1 - p(2.13, 2.35));
  const output = p(2.02, 2.22);
  const check = p(2.83, 2.97);
  const readout: readonly [string, string] = at < .7
    ? ["核对输入 · 冻结执行合同", "Check inputs · freeze the execution contract"]
    : at < 1.74
      ? ["授权环境 · 传入封签载体", "Authorise the environment · transfer the sealed carrier"]
      : at < 2.4
        ? ["舱内执行 · 形成声明产物", "Execute in isolation · produce declared outputs"]
        : ["检查声明结果 · 保留交付证据", "Check declared results · retain delivery evidence"];
  return {
    readout,
    parts: {
      "architecture-clamp-back": { shift: clamp },
      "architecture-clamp-front": { shift: clamp },
      "architecture-seal": { draw: p(.25, .5) },
      "architecture-gate": { shift: open },
      "architecture-carrier-x": { shift: p(.98, 1.5) },
      "architecture-carrier-y": { shift: p(2.4, 2.82) },
      "architecture-press": { shift: press },
      "architecture-output-0": { draw: output },
      "architecture-output-1": { draw: p(2.08, 2.27) },
      "architecture-output-2": { draw: p(2.14, 2.32) },
      "architecture-check-bridge": { shift: check },
      "architecture-check-0": { draw: p(2.96, 2.98) },
      "architecture-check-1": { draw: p(2.97, 2.99) },
      "architecture-check-2": { draw: p(2.98, 3) },
    },
  };
}
