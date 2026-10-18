import type { Locale } from "@/lib/i18n";

export const EMPLOYEE_SCENE_DURATION = 12_000;

export interface EmployeeScene {
  id: "identity" | "collaboration" | "experience";
  label: string;
  headline: [string, string];
  description: string;
  alt: string;
}

const stories: Record<Locale, EmployeeScene[]> = {
  zh: [
    {
      id: "identity",
      label: "个人工作",
      headline: ["让人专注创造，", "让 AI 推进工作。"],
      description: "与 SkyBot 和数字员工协作，减少重复劳动，把精力留给判断、创造与更有价值的工作。",
      alt: "多份日常工作材料先进入工作台，提炼出 Memory 记录与 Skill 方法；这些能力汇入随后形成的研发 Agent。雇佣凭证进入员工槽位后，状态变为已雇佣，再由同一员工接手新任务并交付成果；来源与员工身份保留。",
    },
    {
      id: "collaboration",
      label: "团队协作",
      headline: ["让个人的好方法，", "成为团队的能力。"],
      description: "将验证过的方法整理为 Skill 与流程，在授权范围内复用，让人和 Agent 更好地协作。",
      alt: "Claude Code、Codex、Kimi Code 与开放 Harness 围绕一份共同工作稿。开放端可接入 GLM、DeepSeek、Grok 等模型模块。工作稿在执行端之间真实交接：形成方案、写入实现、审查退回具体修改、修正并验证，最后同一稿件落入 SkyMythos 共同交付座。图中分工为示例，职责不与品牌固定绑定。",
    },
    {
      id: "experience",
      label: "经验与改进",
      headline: ["经验有据可查，", "改进有迹可循。"],
      description: "结合执行记录、验证结果与知识来源，审阅、纠正再复用，让持续改进有据可循。",
      alt: "项目文档、技术决策与工作经验的副本形成组织检索索引；任务查询部署约束，命中技术决策 [1]，返回带相同来源编号的分阶段发布片段，三份原件仍然保留。",
    },
  ],
  en: [
    {
      id: "identity",
      label: "Individual work",
      headline: ["More room to create.", "AI helps you deliver."],
      description: "Work with SkyBot and digital employees. Spend less effort on repetition and more on judgement, creativity and meaningful work.",
      alt: "Everyday work records yield Memory and a reusable Skill before a development Agent is assembled. An employment credential seats in the Agent, changing its status to hired. The same employee then takes a new task and delivers a result, while its sources and identity remain.",
    },
    {
      id: "collaboration",
      label: "Team capability",
      headline: ["Good methods.", "Shared team capability."],
      description: "Turn validated methods into Skills and workflows. Reuse them within granted access so people and Agents work better together.",
      alt: "Claude Code, Codex, Kimi Code and an open Harness work on the same working copy. Swappable model modules illustrate GLM, DeepSeek and Grok. The copy passes between agents for planning, implementation, a review correction, revision and verification, then seats in the shared SkyMythos delivery dock. Roles are illustrative and are not tied to brands.",
    },
    {
      id: "experience",
      label: "Learning and improvement",
      headline: ["Traceable experience.", "Grounded improvement."],
      description: "Use execution records, verification results and knowledge sources to review, correct and reuse experience. Improve with evidence.",
      alt: "Copies of project documents, technical decisions and work notes form a shared knowledge index. A deployment query retrieves technical decision [1] and returns a cited staged-rollout passage while all three original sources remain.",
    },
  ],
};

export function getEmployeeStory(locale: Locale) {
  return stories[locale];
}
