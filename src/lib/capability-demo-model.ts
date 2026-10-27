export type CapabilityDemoName = "delivery" | "methods" | "management";

export const demoDurations = { delivery: 12, methods: 12, management: 12 } as const;

export function isCapabilityDemoName(value: unknown): value is CapabilityDemoName {
  return value === "delivery" || value === "methods" || value === "management";
}

/** 只选择已经捕获的产品状态，不模拟真实业务执行：0/6/12 秒 → start/middle/result。 */
export function demoFrame(name: CapabilityDemoName, elapsedSeconds: number, still = false) {
  if (!isCapabilityDemoName(name)) throw new Error(`Unknown capability demo: ${String(name)}`);
  const elapsed = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0;
  const progress = still ? 1 : Math.min(elapsed / demoDurations[name], 1);
  return {
    name,
    progress,
    phase: progress === 1 ? "result" : progress >= 0.5 ? "middle" : "start",
    complete: progress === 1,
  } as const;
}

export type CapabilityDemoFrame = ReturnType<typeof demoFrame>;
