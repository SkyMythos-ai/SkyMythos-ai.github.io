import type { ReactNode } from "react";
import type { AnatomyPartPose } from "./types";

/** Planar work diagrams share the player, without pretending to be depth-sorted solids. */
export function PlanarMotion({ name, by = [0, 0], pose, children }: {
  name: string; by?: [number, number]; pose?: AnatomyPartPose; children: ReactNode;
}) {
  const shift = pose?.shift ?? 0;
  return <g data-part={name} data-vector={by.join(" ")} data-shift={shift} transform={`translate(${by[0] * shift} ${by[1] * shift})`} opacity={pose?.opacity ?? 1}>{children}</g>;
}
