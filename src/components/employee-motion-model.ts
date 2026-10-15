import { EMPLOYEE_SCENE_DURATION, type EmployeeScene } from "@/content/employee-story";
import type { Locale } from "@/lib/i18n";

export const EMPLOYEE_POSTER_SECONDS = EMPLOYEE_SCENE_DURATION / 1000 - .2;
export interface PartPose { shift?: number; opacity?: number; draw?: number }
export interface MachineFrame { phase: string; parts: Record<string, PartPose> }
const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** 五次缓动在首尾速度、加速度均为零；寻址、重播和服务端静帧共用同一模型。 */
function progress(t: number, start: number, end: number) {
  const u = clamp((t - start) / (end - start));
  return u * u * u * (u * (u * 6 - 15) + 10);
}
const during = (t: number, start: number, end: number) => progress(t, start, start + .3) * (1 - progress(t, end - .3, end));

export function employeeFrame(scene: EmployeeScene["id"], seconds: number): MachineFrame {
  const t = Math.max(0, Math.min(EMPLOYEE_SCENE_DURATION / 1000, Number(seconds) || 0));
  const p = (a: number, b: number) => progress(t, a, b);
  if (scene === "identity") {
    const verified = p(11.1, 11.65);
    return {
      phase: t < 3 ? "daily-work" : t < 5.6 ? "distill" : t < 7 ? "form-employee" : t < 8.3 ? "hire-employee" : t < 11.65 ? "delegated-work" : "employed",
      parts: {
        ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`work-record-${i}`, { shift: 1 - p(.15 + i * .5, .8 + i * .5), opacity: p(.05 + i * .5, .4 + i * .5) }])),
        "memory-record": { shift: 1 - p(3.65, 4.45), opacity: p(3.05, 3.3) },
        "memory-lift": { shift: p(3.2, 3.6) * (1 - p(4.45, 4.95)) },
        "memory-written": { draw: p(4.45, 5) },
        "skill-cartridge": { shift: 1 - p(4.1, 5.15), opacity: p(3.5, 3.75) },
        "skill-lift": { shift: p(3.6, 4) * (1 - p(5.15, 5.6)) },
        "skill-method": { draw: p(5.15, 5.65) },
        "memory-recall": { draw: p(5.1, 5.8), opacity: p(5, 5.3) },
        "skill-recall": { draw: p(5.65, 6.2), opacity: p(5.6, 5.9) },
        "employee-body": { shift: 1 - p(5.65, 6.3), opacity: p(5.65, 5.9) },
        "employee-cover": { shift: 1 - p(6.3, 6.9), opacity: p(6.1, 6.4) },
        "employee-name": { opacity: p(6.7, 7) },
        "employee-available": { opacity: during(t, 6.85, 8.15) },
        "memory-contact": { opacity: p(6.2, 6.5) },
        "skill-contact": { opacity: p(6.3, 6.6) },
        "hire-credential": { shift: 1 - p(7.25, 8.15), opacity: p(7, 7.25) },
        "hire-confirm": { draw: p(8.15, 8.3), opacity: p(8.15, 8.3) },
        "employee-hired": { opacity: p(8.15, 8.3) },
        "followup-task": { shift: p(8.4, 9.25), opacity: p(8.3, 8.55) * (1 - p(9.3, 9.65)) },
        "process-reuse": { opacity: p(9.2, 9.6) },
        output: { shift: p(10, 10.65), opacity: p(9.8, 10.1) },
        "verify-left": { shift: p(10.65, 11.1) },
        "verify-right": { shift: p(10.65, 11.1) },
        verified: { draw: verified, opacity: verified },
        "final-result": { draw: verified, opacity: verified },
      },
    };
  }
  if (scene === "collaboration") {
    const toCode = p(2.35, 3.2), toReview = p(4.65, 5.5), returnToCode = p(6.8, 7.45);
    const toVerify = p(8.2, 9.05), toDelivery = p(9.95, 10.8);
    return {
      phase: t < 1.1 ? "collab-connect" : t < 3.2 ? "collab-plan" : t < 5.5 ? "collab-build" : t < 7.45 ? "collab-review" : t < 8.2 ? "collab-revise" : t < 9.95 ? "collab-verify" : t < 11.5 ? "collab-deliver" : "collab-ready",
      parts: {
        "model-deepseek": { shift: p(.15, .9) },
        "peer-claude": { opacity: during(t, 1, 2.6) },
        "peer-codex": { opacity: Math.max(during(t, 3.2, 4.9), during(t, 7.45, 8.4)) },
        "peer-kimi": { opacity: during(t, 5.5, 7.05) },
        "peer-open": { opacity: p(9.05, 9.35) },
        "shared-work-x": { shift: toCode + toReview - returnToCode },
        "shared-work-y": { shift: -toCode + toReview - returnToCode + 2 * toVerify - (115 / 113) * toDelivery },
        "shared-work-seat": { shift: p(10.9, 11.5) },
        "shared-plan": { draw: p(1.1, 2.25) },
        "shared-code-1": { draw: p(3.3, 3.7) },
        "shared-code-2": { draw: p(3.7, 4.1) },
        "shared-code-3": { draw: p(4.1, 4.5) },
        "shared-original": { opacity: 1 - p(7.6, 7.95) },
        "shared-review": { draw: p(5.8, 6.5), opacity: p(5.7, 6) * (1 - p(7.8, 8.05)) },
        "shared-revised": { draw: p(7.55, 8), opacity: p(7.55, 7.8) },
        ...Object.fromEntries([0, 1, 2].map(i => [`shared-test-${i}`, { draw: p(9.15 + i * .2, 9.4 + i * .2), opacity: p(9.15 + i * .2, 9.35 + i * .2) }])),
      },
    };
  }
  return {
    phase: t < 3 ? "index" : t < 5.9 ? "retrieve" : t < 8.9 ? "excerpt" : t < 10.5 ? "compose" : "sourced",
    parts: {
      ...Object.fromEntries((["docs", "decisions", "notes"] as const).flatMap((id, i) => {
        const start = .25 + i * .45, end = 1.8 + i * .45;
        return [
          [`copy-${id}`, { shift: p(start, start + .35), opacity: during(t, start - .05, end + .3) }],
          [`lift-${id}`, { shift: p(start + .35, start + .5) }],
          [`transfer-${id}`, { shift: p(start + .5, start + .95) }],
          [`insert-${id}`, { shift: p(start + .95, end - .2) }],
          [`seat-${id}`, { shift: p(end - .25, end) }],
        ];
      })),
      "index-docs": { draw: p(1.6, 2.1), opacity: p(1.6, 2) },
      "index-decisions": { draw: p(2.05, 2.55), opacity: p(2.05, 2.45) },
      "index-notes": { draw: p(2.5, 3), opacity: p(2.5, 2.9) },
      query: { draw: p(3.15, 4.1), opacity: p(3.1, 3.5) },
      "search-head": { shift: p(3.3, 4.65) },
      "selected-drawer": { shift: p(4.55, 5.65) },
      "selected-content": { draw: p(5.2, 5.95), opacity: p(5.1, 5.45) },
      excerpt: { shift: p(6.5, 8.25), opacity: p(6, 6.35) },
      "excerpt-release": { shift: p(6, 6.5) },
      "excerpt-seat": { shift: p(8.25, 9) },
      "task-content": { draw: p(9, 10), opacity: p(9, 9.35) },
      "task-verified": { draw: p(10, 10.6), opacity: p(10, 10.3) },
    },
  };
}

const labels: Record<string, [string, string]> = {
  "daily-work": ["日常工作 · 积累材料与反馈", "Daily work · collecting results and feedback"],
  distill: ["从工作中提炼 Memory 与 Skill", "Distilling Memory and Skills from work"],
  "form-employee": ["经验与方法 · 形成 Agent 员工", "Experience and methods form an Agent"],
  "hire-employee": ["雇佣员工 · 授予后续工作", "Hiring the employee for future work"],
  "delegated-work": ["已雇佣 · 接手新任务并交付", "Hired · taking on the next task"],
  employed: ["工作已交付 · 员工与经验保留", "Hired employee · next task delivered"],
  "collab-connect": ["开放接入 · 共同开始工作", "Open agents · one shared task"],
  "collab-plan": ["形成方案 · 交给下一位", "Plan the work · hand it over"],
  "collab-build": ["延续同一份工作 · 完成实现", "Build on the same working copy"],
  "collab-review": ["审查内容 · 返回具体修改", "Review · return a correction"],
  "collab-revise": ["修正问题 · 保留前序成果", "Revise · keep the shared context"],
  "collab-verify": ["继续验证 · 补齐交付证据", "Verify · add the evidence"],
  "collab-deliver": ["共同成果 · 汇入一次交付", "Bring the shared work together"],
  "collab-ready": ["不同执行端 · 一份共同交付", "Different agents · one delivery"],
  index: ["保留原件 · 建立检索副本", "Keeping originals · indexing copies"], retrieve: ["检索部署约束 · 命中技术决策", "Deployment query · decision found"],
  excerpt: ["摘录内容与来源 [1] 一同返回", "Returning the excerpt with source [1]"], compose: ["将带来源的知识用于任务", "Applying sourced knowledge to the task"], sourced: ["知识已引用 · 原始资料保留", "Knowledge cited · originals retained"],
};

export function employeeReadout(phase: string, locale: Locale) {
  return labels[phase][locale === "zh" ? 0 : 1];
}
