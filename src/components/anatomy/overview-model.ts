import { anatomyProgress as p, type AnatomyFrame } from "./types";

/** One illustrative job: delegation precedes evidence, and review follows its return. */
export function overviewFrame(position: number): AnatomyFrame {
  const x = Math.max(0, Math.min(3, position));
  const outward = .5 * p(x, .25, .7) + .5 * p(x, .85, 1.3);
  const returned = p(x, 2.2, 2.8);
  return {
    parts: {
      "overview-work": { shift: outward - returned },
      "overview-transfer": { opacity: p(x, .2, .25) * (1 - p(x, 1.3, 1.4)) + p(x, 2.15, 2.2) * (1 - p(x, 2.8, 2.9)) },
      "overview-evidence": { opacity: p(x, 1.65, 2) },
      "overview-review": { opacity: p(x, 2.9, 3) },
      "overview-active": { opacity: p(x, 1, 1.3) * (1 - p(x, 2.15, 2.2)) },
    },
    readout: x < .8 ? ["人明确目标与验收标准。", "People define the goal and acceptance criteria."]
      : x < 1.65 ? ["SkyBot 统筹，专业员工按职责参与。", "SkyBot coordinates; specialists contribute."]
        : x < 2.8 ? ["带着产物与检查依据，交回结果。", "Return the result with outputs and checks."]
          : ["人核对结果，保留判断与验收。", "People review the evidence and accept the result."],
  };
}
