export const executionDuration = 18;
export const inspectionDuration = 12;
const completions = [3, 7.5, 12, executionDuration];
const records = [3, 7.5, 12, 16];
export type Inspection = "records" | "checks" | "delivery";

export function executionFrame(elapsed: number) {
  const time = Math.max(0, elapsed);
  const completed = completions.filter(at => time >= at).length;
  const inspecting = completed === completions.length;
  const inspectionTime = Math.max(0, time - executionDuration);
  const inspection: Inspection | null = inspecting ? (["records", "checks", "delivery"] as const)[Math.floor(inspectionTime / 4) % 3] : null;
  const start = completed ? completions[completed - 1] : 0;
  return {
    completed,
    active: inspecting ? null : completed,
    progress: inspecting ? 1 : (time - start) / (completions[completed] - start),
    records: records.filter(at => time >= at).length,
    checks: time >= 16,
    delivery: time >= executionDuration,
    inspection,
    cycle: inspecting ? Math.floor(inspectionTime / inspectionDuration) : 0,
    message: inspecting ? 4 : completed,
  };
}
