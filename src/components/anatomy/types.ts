export type AnatomyKind = "concept" | "architecture";
export interface AnatomyPartPose { shift?: number; opacity?: number; draw?: number }
export interface AnatomyFrame {
  parts: Record<string, AnatomyPartPose>;
  readout: readonly [string, string];
}

export function anatomyProgress(position: number, from: number, to: number) {
  const u = Math.max(0, Math.min(1, (position - from) / (to - from)));
  return u * u * u * (u * (u * 6 - 15) + 10);
}
