import type { DocCorpus } from "@/content/types";
import { gettingStartedZh } from "./getting-started";
import { conceptsZh } from "./concepts";
import { guidesZh } from "./guides";
import { connectionsZh } from "./connections";
import { managementZh } from "./management";
import { operationsZh } from "./operations";
import { referenceZh } from "./reference";

/**
 * Chinese documentation corpus — the primary tree.
 *
 * Follow the reader's task: start, complete and reuse work, manage enterprise AI,
 * deploy and operate, then look up concepts and reference. Section membership is
 * independent of the stable URL slug.
 */
export const zhDocs: DocCorpus = {
  locale: "zh",
  sections: [
    {
      id: "getting-started",
      title: "快速开始",
      description: "进入工作台，选择入口，完成并确认第一项工作。",
    },
    {
      id: "guides",
      title: "完成与复用工作",
      description: "创建、审阅与恢复工作，整理知识、员工与可复用能力。",
    },
    {
      id: "management",
      title: "管理企业 AI",
      description: "管理成员与权限，核对使用记录、估算费用与模型月额度。",
    },
    {
      id: "operations",
      title: "部署运维",
      description: "准备部署，接入模型与工具，维护环境并完成业务验收。",
    },
    {
      id: "concepts",
      title: "核心概念",
      description: "理解员工、任务、执行环境、交付证据与知识记忆的边界。",
    },
    {
      id: "reference",
      title: "参考",
      description: "规范术语表与常见问题。",
    },
  ],
  pages: [
    ...gettingStartedZh,
    ...guidesZh,
    ...managementZh,
    ...operationsZh,
    ...connectionsZh,
    ...conceptsZh,
    ...referenceZh,
  ],
};
