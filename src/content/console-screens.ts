import type { Locale } from "@/lib/i18n";

export const consoleScreens = {
  "employees-current": { file: "employees-current.png", width: 1440, height: 960, zh: "SkyBot 与专业员工目录", en: "SkyBot and specialist employees" },
  "agent-create": { file: "agent-create.png", width: 1440, height: 960, zh: "创建 Agent：指令、模型与扩展能力", en: "Create an Agent: instructions, model and capabilities" },
  connectors: { file: "connectors.png", width: 1440, height: 960, zh: "连接器与个人授权", en: "Connectors and personal access" },
  onboarding: { file: "onboarding.png", width: 1440, height: 960, zh: "首次使用：可选个人配置", en: "First use: optional personal setup" },
  "formation-sources": { file: "formation-sources.png", width: 1440, height: 960, zh: "定义职责，选择已验证的工作经验", en: "Define a responsibility and select validated experience" },
  "formation-plan": { file: "formation-plan.png", width: 1440, height: 960, zh: "创建前确认员工方案与技能来源", en: "Review the employee plan and Skill sources before creation" },
  "formation-result": { file: "formation-result.png", width: 1440, height: 960, zh: "查看员工、角色与 Skill 创建结果", en: "Review employee, role and Skill creation results" },
  workspace: { file: "chat-workbench.png", width: 2160, height: 1050, zh: "对话工作台", en: "Conversation workspace" },
  employees: { file: "employees.png", width: 2160, height: 690, zh: "我的员工与经验培养", en: "Employees and experience-based development" },
  "agent-setup": { file: "agent-setup.png", width: 1098, height: 480, zh: "Agent 运行工具与模型选择", en: "Agent Harness and model selection" },
  knowledge: { file: "knowledge.png", width: 2160, height: 1350, zh: "知识库文档与发布状态", en: "Knowledge documents and publication status" },
  task: { file: "task-detail.png", width: 2160, height: 1350, zh: "任务进展与工作上下文", en: "Task progress and working context" },
} as const;

export type ConsoleScreen = keyof typeof consoleScreens;

export function consoleScreenTitle(screen: ConsoleScreen, locale: Locale) {
  return consoleScreens[screen][locale];
}

export function consoleScreenFromPath(path: string): ConsoleScreen | undefined {
  return (Object.keys(consoleScreens) as ConsoleScreen[]).find(screen => path.endsWith(`/images/product/${consoleScreens[screen].file}`));
}
