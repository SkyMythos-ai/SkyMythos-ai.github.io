import type { Locale } from "@/lib/i18n";
import type { StoryKind, StoryFrame, StoryFlow } from "./types";
import { storyCaption } from "./copy";

export const durations = { overview: 18, assets: 20, governance: 18 };
export const repeatDurations = { overview: 18, assets: 12, governance: 12 };
export const retainedParts = {
  overview: ['delivery', 'archive'],
  assets: ['record-one', 'record-two', 'record-three', 'candidate', 'human-edit', 'confirmed', 'skill', 'method-one', 'method-two', 'method-three', 'provenance', 'reused', 'executor'],
  governance: ['run', 'tokens', 'estimate', 'recorded'],
};
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => { const x = clamp(n); return x * x * (3 - 2 * x); };
const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const appear = (t: number, a: number) => ramp(t, a, a + .55);
const transfer = (t: number, start: number, end: number) => ({
  opacity: ramp(t, start, start + .18) * (1 - ramp(t, end - .18, end)),
  progress: ramp(t, start + .18, end - .18),
});
const readout = (t: number, entries: [number, string][]) => entries.findLast(([start]) => t >= start)?.[1] ?? entries[0][1];

// Initial tours explain formation; subsequent tours work with what already exists.
// Retained results never inherit the current request's fade-out or replay its creation.
export function storyFrame(kind: StoryKind, elapsed: number, locale: Locale = "zh"): StoryFrame {
  const time = Math.max(0, elapsed);
  const first = time < durations[kind];
  const duration = first ? durations[kind] : repeatDurations[kind];
  const cycle = first ? 0 : 1 + Math.floor((time - durations[kind]) / duration);
  const t = first ? time : (time - durations[kind]) % duration;
  const reset = 1 - ramp(t, duration - .7, duration);
  const parts: Record<string, number> = {};
  const flows: Record<string, StoryFlow> = {};
  let caption = '', scenario = '';
  const reveal = (name: string, start: number) => { parts[name] = appear(t, start) * reset; };
  const keep = (name: string, start: number) => { parts[name] = first ? appear(t, start) : 1; };
  const send = (name: string, start: number, end: number) => { flows[name] = transfer(t, start, end); };

  if (kind === 'overview') {
    reveal('goal', .2);
    send('goal', 2, 3.4);
    send('reuse', 3.6, 4.7);
    send('delegate', 5, 6.2);
    reveal('built', 6.2);
    keep('delivery', 6.2);
    reveal('delivery-output', 6.2);
    send('verify', 7, 8.2);
    reveal('checked', 8.2);
    reveal('delivery-checks', 8.2);
    send('deliver', 9.1, 10.6);
    send('return', 11.5, 13.3);
    reveal('accepted', 13.6);
    reveal('delivery-review', 13.6);
    keep('archive', 14.5);
    caption = readout(t, [
      [0, first ? '人明确目标：导出订单，并核对结果。' : '已确认的交付留下，新一项工作开始。'],
      [2, '目标交给 SkyBot，由它组织协作。'],
      [3.6, '按授权取用已有方法，不从头摸索。'],
      [5, '研发员工完成实现，产物先进入交付。'],
      [7, '保留产物，再叠加核验得到的检查依据。'],
      [9.1, '产物与检查依据汇在一起，交付逐步完整。'],
      [11.5, '结果回到人，由人核对并确认交付。'],
      [13.6, '在产物与检查依据之上，留下人的确认。'],
      [17.3, '已确认的交付保留，只切换当前任务。'],
    ]);
  } else if (kind === 'assets') {
    keep('record-one', .2);
    keep('record-two', 1.1);
    keep('record-three', 2);
    keep('candidate', 2.7);
    keep('human-edit', 4.8);
    keep('confirmed', 5.6);
    keep('skill', 7.3);
    keep('method-one', 7.5);
    keep('method-two', 7.9);
    keep('method-three', 8.3);
    keep('provenance', 8.7);
    keep('reused', 12.2);
    keep('executor', 9.6);
    if (first) {
      send('review', 3.4, 4.6);
      send('form', 6.2, 7.3);
    }
    reveal('next-task', first ? 9.6 : .6);
    send('reuse', first ? 10.2 : 2.2, first ? 11.6 : 3.6);
    reveal('reference', first ? 11.6 : 3.6);
    send('execute', first ? 12.2 : 4.2, first ? 13.3 : 5.3);
    reveal('next-delivery', first ? 14 : 6);
    caption = readout(t, first ? [
      [0, '一次工作，留下需求、检查与纠正记录。'],
      [2.7, 'AI 从记录提出总结与方法候选：导出并核对结果。'],
      [3.4, '人审核候选，判断哪些方法值得复用。'],
      [4.8, '人修改方法：沿用权限，并补充导出行数核对。'],
      [5.6, '人确认修改并决定采用，不自动共享全部记录。'],
      [6.2, '形成订单导出 Skill，来源与确认一起留下。'],
      [9.6, '下一项任务出现，按授权取得方法的引用。'],
      [11.6, '任务拿到引用，原 Skill 仍留在企业资产中。'],
      [14, '来源、方法与新的交付同时保留。'],
      [19.3, '保留来源与 Skill，只切换下一项任务。'],
    ] : [
      [0, '记录、确认和 Skill 已留下，不必重新形成。'],
      [2.2, '另一项任务按授权引用已有 Skill。'],
      [3.6, '取得的是引用，原资产仍然保留。'],
      [4.2, '数字员工沿用方法，继续完成新的工作。'],
      [6, '新的交付出现，资产与来源仍在原处。'],
      [11.3, '保留来源与 Skill，只切换下一项任务。'],
    ]);
  } else {
    const allowed = cycle % 2 === 0;
    scenario = allowed ? '示例：模型可用，月额度未达' : '另一情境：模型已禁用';
    keep('run', 2);
    keep('tokens', 3.7);
    keep('estimate', 4.1);
    keep('recorded', 4.6);
    if (first) {
      send('attribute', .8, 2);
      send('measure', 2.5, 3.7);
    }
    send('usage', first ? 5 : .2, first ? 6.1 : 1.3);
    reveal('request', first ? 6.2 : 1.4);
    send('admit', first ? 6.5 : 1.7, first ? 8 : 3.2);
    reveal('condition', first ? 8 : 3.2);
    send(allowed ? 'decision-allow' : 'decision-deny', first ? 9.5 : 4.7, first ? 10.7 : 5.9);
    reveal(allowed ? 'allowed' : 'denied', first ? 10.7 : 5.9);
    parts[allowed ? 'denied' : 'allowed'] = 0;
    caption = readout(t, [
      [0, first ? '在授权范围内，将运行关联到成员、工作区与模型。' : '保留已有运行与消耗记录，再检查一个新请求。'],
      [first ? 2.5 : .2, first ? '记录 Token；费用按价格目录估算，可能不完整。' : '仍依据已记录用量，不虚构新的消耗。'],
      [first ? 5 : 1.3, '检查依据是已记录用量，不是实时扣款。'],
      [first ? 6.2 : 1.4, '新的 Task 请求进入模型策略检查。'],
      [first ? 8 : 3.2, allowed ? '本轮示例：模型可用，已记录用量未达月额度。' : '切换情境：模型已禁用，不能创建该 Task。'],
      [first ? 10.7 : 5.9, allowed ? '允许创建新 Task，不代表额度已预占。' : '拒绝创建新 Task，已有运行与记录不会消失。'],
      [duration - .7, '保留运行与消耗记录，只切换本轮请求。'],
    ]);
  }
  return { t, cycle, duration, parts, flows, caption: storyCaption(caption, locale), scenario: storyCaption(scenario, locale), resetting: reset < 1 };
}
