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
      description: "环境要求、部署步骤与第一个任务的完整走查。",
    },
    {
      id: "concepts",
      title: "核心概念",
      description:
        "任务、流程、沙箱、产物、知识与记忆的领域模型，以及每条约束背后的原因。",
    },
    {
      id: "guides",
      title: "操作指南",
      description: "创建任务、观察执行、处理失败与复用能力的实际做法。",
    },
    {
      id: "operations",
      title: "平台运维",
      description: "角色权限、部署级配置与验证分级口径。",
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
