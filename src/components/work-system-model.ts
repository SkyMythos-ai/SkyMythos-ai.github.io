export const systemIntroduction = 20;
export const systemInspection = 18;

export function workSystemFrame(elapsed: number) {
  const time = Math.max(0, elapsed);
  const inspecting = time >= systemIntroduction;
  const window = time >= 5 && time < 8 ? "curate" : time >= 10 && time < 13 ? "store" : time >= 15 && time < 18 ? "reuse" : null;
  const start = window === "curate" ? 5 : window === "store" ? 10 : 15;
  const inspection = Math.max(0, time - systemIntroduction);
  return {
    workProgress: Math.min(time / 4, 1),
    records: time >= 4,
    confirmed: time >= 9,
    retained: time >= 13,
    reused: time >= 18,
    transfer: window,
    progress: window ? (time - start) / 3 : 0,
    focus: inspecting ? (["work", "assets", "governance"] as const)[Math.floor(inspection / 6) % 3] : time < 4 ? "work" : time < 13 ? "curation" : "assets",
    cycle: inspecting ? Math.floor(inspection / systemInspection) : 0,
  };
}
