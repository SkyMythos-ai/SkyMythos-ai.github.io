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
      headline: ["从日常工作，", "沉淀出数字员工。"],
      description: "把工作中的经验与方法，沉淀为拥有 Memory 和 Skill 的 Agent 员工。雇佣它，让它接手后续工作。",
      alt: "多份日常工作材料先进入工作台，提炼出 Memory 记录与 Skill 方法；这些能力汇入随后形成的研发 Agent。雇佣凭证进入员工槽位后，状态变为已雇佣，再由同一员工接手新任务并交付成果；来源与员工身份保留。",
    },
    {
      id: "collaboration",
      label: "多 Agent 协作",
      headline: ["开放协作，", "模型与工具自由选。"],
      description: "模型与 Agent Harness，按需选择。不同 Agent 在统一协作中分工，汇成一次交付。",
      alt: "Claude Code、Codex、Kimi Code 与开放 Harness 围绕一份共同工作稿。开放端可接入 GLM、DeepSeek、Grok 等模型模块。工作稿在执行端之间真实交接：形成方案、写入实现、审查退回具体修改、修正并验证，最后同一稿件落入 SkyMythos 共同交付座。图中分工为示例，职责不与品牌固定绑定。",
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
      headline: ["From daily work.", "Your next digital hire."],
      description: "Distill work experience and methods into an Agent with Memory and Skills. Hire it to take on the work that comes next.",
      alt: "Everyday work records yield Memory and a reusable Skill before a development Agent is assembled. An employment credential seats in the Agent, changing its status to hired. The same employee then takes a new task and delivers a result, while its sources and identity remain.",
    },
    {
      id: "collaboration",
      label: "Multi-agent collaboration",
      headline: ["Open collaboration.", "Choose your tools."],
      description: "Choose your models and Agent Harnesses. Different agents plan, build, review and verify together, with one shared delivery.",
      alt: "Claude Code, Codex, Kimi Code and an open Harness work on the same working copy. Swappable model modules illustrate GLM, DeepSeek and Grok. The copy passes between agents for planning, implementation, a review correction, revision and verification, then seats in the shared SkyMythos delivery dock. Roles are illustrative and are not tied to brands.",
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
