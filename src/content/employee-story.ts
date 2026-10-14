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
      headline: ["数字员工，", "参与长期工作。"],
      description: "持续的身份，经过验证的 Memory，以及可复用的 Skill。让每一次工作，成为下一次工作的基础。",
      alt: "SkyMythos Agent 自动执行任务并产出工作成果；反馈经验证后形成 Memory 记录与可复用 Skill，下一次任务调用它们，表达 RSI 持续改进方向。",
    },
    {
      id: "collaboration",
      label: "多 Agent 协作",
      headline: ["不同 Agent，", "汇成一次交付。"],
      description: "Claude 与 Codex 按任务分工。方案、实现、审查和验证逐次交接，最终形成共同的工作成果。",
      alt: "同一目标进入 SkyMythos 协作中枢，Claude 与 Codex 执行 Agent 分工形成方案和代码，再交给审查与验证 Agent，汇成一次可审查交付；图中职责为示例。",
    },
    {
      id: "experience",
      label: "知识库",
      headline: ["有来源的知识，", "进入下一次工作。"],
      description: "原始资料保留在知识空间。任务检索命中相关内容，返回带来源的片段，并将它用在实际工作中。",
      alt: "项目文档、技术决策与工作经验的副本形成组织检索索引；任务查询部署约束，命中技术决策 [1]，返回带相同来源编号的分阶段发布片段，三份原件仍然保留。",
    },
  ],
  en: [
    {
      id: "identity",
      label: "Digital employees",
      headline: ["Digital employees.", "Built for lasting work."],
      description: "A lasting identity, validated Memory and reusable Skills. Each completed task lays the groundwork for the next.",
      alt: "The SkyMythos Agent executes a task and produces work. Validated feedback forms Memory records and a reusable Skill; the next task calls both, representing the direction of RSI.",
    },
    {
      id: "collaboration",
      label: "Multi-agent collaboration",
      headline: ["Different agents.", "One shared delivery."],
      description: "Claude and Codex divide the work. Planning, implementation, review and verification come together in a shared result.",
      alt: "One goal enters the SkyMythos orchestrator. Claude and Codex agents form a plan and code, then hand off to review and verification agents for a shared delivery. Roles are illustrative.",
    },
    {
      id: "experience",
      label: "Knowledge base",
      headline: ["Sourced knowledge.", "For your next task."],
      description: "Original sources stay in the knowledge space. Tasks retrieve relevant passages with citations and put them to work.",
      alt: "Copies of project documents, technical decisions and work notes form a shared knowledge index. A deployment query retrieves technical decision [1] and returns a cited staged-rollout passage while all three original sources remain.",
    },
  ],
};

export function getEmployeeStory(locale: Locale) {
  return stories[locale];
}
