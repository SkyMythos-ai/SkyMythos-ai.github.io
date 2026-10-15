import type { DocCorpus } from "@/content/types";
import { gettingStartedZh } from "./getting-started";
import { conceptsZh } from "./concepts";
import { guidesZh } from "./guides";
import { operationsZh } from "./operations";
import { referenceZh } from "./reference";

/**
 * Chinese documentation corpus — the primary tree.
 *
 * Section order is an adoption path, not an information architecture imposed from
 * above: get it running, understand why it behaves this way, then operate it,
 * then look things up.
 */
export const zhDocs: DocCorpus = {
  locale: "zh",
  sections: [
    {
      id: "getting-started",
      title: "快速开始",
      description: "从真实工作台出发，完成接入检查与第一个任务。",
    },
    {
      id: "concepts",
      title: "核心概念",
      description:
        "员工、任务、开放执行、交付证据与知识记忆的边界。",
    },
    {
      id: "guides",
      title: "操作指南",
      description: "创建与审阅任务、恢复执行、培养员工及发布知识。",
    },
    {
      id: "operations",
      title: "平台运维",
      description: "团队权限、模型与工具接入，以及真实业务验收。",
    },
    {
      id: "reference",
      title: "参考",
      description: "规范术语表与常见问题。",
    },
  ],
  pages: [
    ...gettingStartedZh,
    ...conceptsZh,
    ...guidesZh,
    ...operationsZh,
    ...referenceZh,
  ],
};
