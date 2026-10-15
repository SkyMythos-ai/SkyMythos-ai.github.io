import { anatomyProgress as p } from "./types";

interface TourPlan { segments: readonly (readonly [number, number])[]; resetAt: number; period: number }
const plans = new Map<number, TourPlan>([
  [4, { segments: [[1.3, 4.5], [5.1, 7.9], [8.5, 11.8]], resetAt: 16, period: 18 }],
]);

function planFor(stageCount: number): TourPlan {
  const known = plans.get(stageCount);
  if (known) return known;
  const segments: [number, number][] = [];
  let start = 1.3;
  for (let index = 0; index < stageCount - 1; index++) {
    const end = start + (index === 0 ? 5 : index >= stageCount - 3 ? 4.4 : 3.6);
    segments.push([start, end]);
    start = end + (index === 0 ? .9 : .8);
  }
  const resetAt = segments[segments.length - 1][1] + 4;
  const plan = { segments, resetAt, period: resetAt + 2.4 };
  plans.set(stageCount, plan);
  return plan;
}

/** 演示台重复复位，不表示删除产品中的员工或历史证据。 */
export function anatomyTour(seconds: number, stageCount = 4) {
  const { segments, resetAt, period } = planFor(stageCount);
  const t = ((seconds % period) + period) % period;
  for (let index = 0; index < segments.length; index++) {
    const [from, to] = segments[index];
    if (t < from) return { position: index, resetting: false };
    if (t < to) return { position: index + p(t, from, to), resetting: false };
  }
  if (t < resetAt) return { position: stageCount - 1, resetting: false };
  return { position: (stageCount - 1) * (1 - p(t, resetAt, period)), resetting: true };
}

/** 从手动停留的位置继续正向演示，避免恢复自动时跳回开头。 */
export function anatomyTourTimeAt(position: number, stageCount = 4) {
  const { segments } = planFor(stageCount);
  if (position <= 0) return 0;
  if (position >= stageCount - 1) return segments[segments.length - 1][1];
  const [from, to] = segments[Math.floor(position)];
  let low = from, high = to;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (anatomyTour(mid, stageCount).position < position) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}
