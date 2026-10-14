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
      label: "数字员工",
      headline: ["数字员工，", "团队的新力量。"],
      description: "Agent 自动执行任务，将真实工作与反馈沉淀为 Memory 和 Skill，在验证中持续改进。",
      alt: "SkyMythos Agent 自动执行任务并产出工作成果；反馈经验证后形成 Memory 记录与可复用 Skill，下一次任务调用它们，表达 RSI 持续改进方向。",
    },
    {
      id: "collaboration",
      label: "多 Agent 协作",
      headline: ["Claude 与 Codex，", "一起协作成事。"],
      description: "编排 Claude、Codex 等 Agent，按任务选择模型、分工交接，将成果汇成可审查的交付。",
      alt: "同一目标进入 SkyMythos 协作中枢，Claude 与 Codex 执行 Agent 分工形成方案和代码，再交给审查与验证 Agent，汇成一次可审查交付；图中职责为示例。",
    },
    {
      id: "experience",
      label: "知识库",
      headline: ["让知识积累，", "为下一次工作所用。"],
      description: "将项目文档、决策与经验组织进知识库。检索相关内容，带着来源进入下一次任务。",
      alt: "项目文档、技术决策与工作经验的副本形成知识库索引；任务查询命中项目文档 [1]，返回带相同来源编号的内容片段，三份原件仍然保留。",
    },
  ],
  en: [
    {
      id: "identity",
      label: "Digital employees",
      headline: ["Digital employees.", "Part of your team."],
      description: "Agents automate work, retain grounded Memory and form reusable Skills through feedback and validation.",
      alt: "The SkyMythos Agent executes a task and produces work. Validated feedback forms Memory records and a reusable Skill; the next task calls both, representing the direction of RSI.",
    },
    {
      id: "collaboration",
      label: "Multi-agent collaboration",
      headline: ["Claude and Codex.", "One shared goal."],
      description: "Orchestrate Claude, Codex and other agents with task-specific models. Combine their contributions into reviewable work.",
      alt: "One goal enters the SkyMythos orchestrator. Claude and Codex agents form a plan and code, then hand off to review and verification agents for a shared delivery. Roles are illustrative.",
    },
    {
      id: "experience",
      label: "Knowledge base",
      headline: ["Knowledge that stays.", "Ready for what's next."],
      description: "Organize project documents, decisions and experience. Retrieve relevant knowledge with its sources for the next task.",
      alt: "Copies of project documents, decisions and experience form a knowledge index. A task retrieves document [1] and receives a passage with the same source number while all original sources remain.",
    },
  ],
};

export function getEmployeeStory(locale: Locale) {
  return stories[locale];
}
