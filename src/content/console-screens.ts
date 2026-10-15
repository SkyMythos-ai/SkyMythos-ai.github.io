import type { Locale } from "@/lib/i18n";

export const consoleScreens = {
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
