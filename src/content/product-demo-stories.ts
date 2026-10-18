import type { ProductDemoKind, ProductDemoStory } from "@/components/product-demo/types";

/** 当前 Console 的真实组件截图；全部工作、身份和返回状态为本地示例。 */
export const productDemoStories: Record<ProductDemoKind, ProductDemoStory> = {
  "order-delivery": {
    title: { zh: "订单导出：从目标到交付", en: "Order export: from goal to delivery" },
    frames: [
      {
        id: "order-goal", src: "/images/product/keynote-order-goal.png", width: 3200, height: 1800,
        title: { zh: "约定目标", en: "Agree on the goal" },
        detail: { zh: "明确 CSV / Excel 导出、权限规则与测试要求，选定仓库、基线和研发流程。", en: "Agree on CSV / Excel export, access rules and tests. Select the repository, baseline and flow. Chinese UI; sample data." },
        focus: [.58, .08, .38, .65], mobileFocus: [.585, .1, .25, .34], durationMs: 5600,
      },
      {
        id: "order-approval", src: "/images/product/keynote-order-approval.png", width: 3200, height: 1800,
        title: { zh: "按策略确认", en: "Confirm when required" },
        detail: { zh: "示例在技术方案处设置审批，核对权限与实现约定；不是所有工作、每个步骤都需要人工确认。", en: "This example pauses for design approval. Check access and implementation choices; not every job or step requires approval." },
        focus: [.24, .37, .44, .36], mobileFocus: [.235, .49, .25, .25], durationMs: 5600,
      },
      {
        id: "order-execution", src: "/images/product/keynote-order-execution.png", width: 3200, height: 1800,
        title: { zh: "跟进执行", en: "Follow execution" },
        detail: { zh: "查看当前节点、执行记录与交接关系，在原工作上下文补充指导；计划不等于完成。", en: "Follow nodes, execution records and handoffs. Add guidance in context. A plan is not proof of completion." },
        focus: [.235, .21, .74, .54], mobileFocus: [.235, .24, .25, .4], durationMs: 5600,
      },
      {
        id: "order-delivery", src: "/images/product/keynote-order-delivery.png", width: 3200, height: 1800,
        title: { zh: "核对交付", en: "Review delivery" },
        detail: { zh: "核对代码变更、实际检查和未完成事项。图中测试数与 PR 编号均为演示数据，不是客户业绩。", en: "Review changes, actual checks and unresolved work. Test counts and PR numbers are sample data, not customer results." },
        focus: [.235, .34, .44, .39], mobileFocus: [.235, .35, .25, .36], durationMs: 6200,
      },
    ],
    poster: 3,
  },
  "employees": {
    "title": {
      "zh": "界面对照：从工作经验创建员工",
      "en": "In the Console: create an employee from experience"
    },
    "frames": [
      {
        "id": "employees-current",
        "src": "/images/product/employees-current.png",
        "width": 1440,
        "height": 960,
        "title": {
          "zh": "从员工目录开始",
          "en": "Start in Agent Employee"
        },
        "detail": {
          "zh": "在 Agent Employee 中管理 SkyBot 与专业员工，选择从工作经验创建。",
          "en": "Manage SkyBot and specialists, then choose creation from work experience."
        },
        "focus": [
          0.19,
          0.08,
          0.77,
          0.45
        ],
        "mobileFocus": [
          0.17,
          0.08,
          0.28,
          0.4
        ],
        "durationMs": 4800
      },
      {
        "id": "formation-sources",
        "src": "/images/product/formation-sources.png",
        "width": 1440,
        "height": 960,
        "title": {
          "zh": "说明职责，选择经验",
          "en": "Define a role and select experience"
        },
        "detail": {
          "zh": "选择有权限且可复用的已保存经验。分析不会创建员工或发布技能。",
          "en": "Select authorised, reusable experience. Analysis creates no employee or published Skill."
        },
        "focus": [
          0.27,
          0.27,
          0.63,
          0.6
        ],
        "mobileFocus": [
          0.25,
          0.48,
          0.3,
          0.4
        ],
        "durationMs": 4800
      },
      {
        "id": "formation-plan",
        "src": "/images/product/formation-plan.png",
        "width": 1440,
        "height": 960,
        "title": {
          "zh": "你确认后，才开始创建",
          "en": "Review before creation"
        },
        "detail": {
          "zh": "检查员工方案、拟形成的 Skill 和来源，再明确确认创建。",
          "en": "Review the responsibility, proposed Skills and sources before confirming creation."
        },
        "focus": [
          0.27,
          0.49,
          0.63,
          0.36
        ],
        "mobileFocus": [
          0.25,
          0.49,
          0.3,
          0.36
        ],
        "durationMs": 4800
      },
      {
        "id": "formation-result",
        "src": "/images/product/formation-result.png",
        "width": 1440,
        "height": 960,
        "title": {
          "zh": "保留结果与来源",
          "en": "Keep results and sources"
        },
        "detail": {
          "zh": "查看已生成的 Skill、角色与员工。界面为示例回执，不代表真实业务已完成。",
          "en": "Review Skills, role and employee. This sample receipt does not prove real execution."
        },
        "focus": [
          0.27,
          0.5,
          0.63,
          0.35
        ],
        "mobileFocus": [
          0.25,
          0.5,
          0.3,
          0.35
        ],
        "durationMs": 4800
      }
    ],
    "poster": 2
  },
  "agent-setup": {
    "title": {
      "zh": "运行工具与模型，分别选择",
      "en": "Choose a harness and model"
    },
    "frames": [
      {
        "id": "goal-and-choices",
        "src": "/images/product/demos/agent-setup-goal-and-choices.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "同一个工作目标",
          "en": "One goal, separate choices"
        },
        "detail": {
          "zh": "先写清工作目标，运行工具与模型分别设置。",
          "en": "Describe the work, then choose the runtime and model separately. Chinese UI; sample data."
        },
        "focus": [
          0.16473,
          0.59565,
          0.63327,
          0.22859
        ],
        "cursor": [
          0.56308,
          0.74399
        ],
        "durationMs": 3800,
        "mobileFocus": [
          0.18,
          0.53,
          0.3,
          0.34
        ]
      },
      {
        "id": "runtime-picker",
        "src": "/images/product/demos/agent-setup-runtime-picker.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "选择运行工具",
          "en": "Choose an agent harness"
        },
        "detail": {
          "zh": "原生工具列表展示当前部署的候选，示例切换到 Claude Code。",
          "en": "The native picker lists deployed runtimes. This example selects Claude Code. Chinese UI; sample data."
        },
        "focus": [
          0.52468,
          0.56577,
          0.22296,
          0.17185
        ],
        "durationMs": 3800
      },
      {
        "id": "compatible-models",
        "src": "/images/product/demos/agent-setup-compatible-models.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "再选兼容的模型",
          "en": "Choose a compatible model"
        },
        "detail": {
          "zh": "模型候选按当前运行工具的协议返回，不把工具与模型混成一个列表。",
          "en": "Model choices follow the selected runtime’s protocol. Runtimes and models remain separate. Chinese UI; sample data."
        },
        "focus": [
          0.57959,
          0.56577,
          0.22296,
          0.17185
        ],
        "cursor": [
          0.69107,
          0.69304
        ],
        "durationMs": 3800
      },
      {
        "id": "configured-combination",
        "src": "/images/product/demos/agent-setup-configured-combination.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "按当前组合开始",
          "en": "Ready with this combination"
        },
        "detail": {
          "zh": "目标、运行工具与模型已分别确认，可从这里开始执行。",
          "en": "The goal, harness and model are confirmed. Start execution here."
        },
        "focus": [
          0.47767,
          0.67724,
          0.31051,
          0.13351
        ],
        "durationMs": 4300,
        "mobileFocus": [
          0.54,
          0.66,
          0.28,
          0.18
        ]
      }
    ],
    "poster": 3
  },
  "knowledge": {
    "title": {
      "zh": "知识检索，带着来源回到原文",
      "en": "Retrieve knowledge and verify sources"
    },
    "frames": [
      {
        "id": "published-documents",
        "src": "/images/product/demos/knowledge-published-documents.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "先看可用的资料",
          "en": "Inspect available knowledge"
        },
        "detail": {
          "zh": "目录区分可检索、处理中与未发布文档；上传不等于已可使用。",
          "en": "The document list distinguishes searchable, processing and unpublished material. Chinese UI; sample data."
        },
        "focus": [
          0.19833,
          0.52179,
          0.62764,
          0.47821
        ],
        "cursor": [
          0.12395,
          0.21459
        ],
        "durationMs": 3800,
        "mobileFocus": [
          0.205,
          0.48,
          0.28,
          0.38
        ]
      },
      {
        "id": "retrieval-question",
        "src": "/images/product/demos/knowledge-retrieval-question.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "问一个具体问题",
          "en": "Ask a specific question"
        },
        "detail": {
          "zh": "在已发布且有权限的资料中测试检索，问题保留在原生输入区。",
          "en": "Test retrieval over authorised published material. The question stays in the native input. Chinese UI; sample data."
        },
        "focus": [
          0.01997,
          0.2481,
          0.34441,
          0.2526
        ],
        "cursor": [
          0.06306,
          0.45989
        ],
        "durationMs": 3800,
        "mobileFocus": [
          0.04,
          0.25,
          0.22,
          0.32
        ]
      },
      {
        "id": "sourced-results",
        "src": "/images/product/demos/knowledge-sourced-results.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "结果带着来源与版本",
          "en": "Results carry their sources"
        },
        "detail": {
          "zh": "命中内容同时显示原文标题、版本与片段标识，分数只表示检索排序。",
          "en": "Hits include the document title, revision and chunk ID. Scores describe retrieval ranking. Chinese UI; sample data."
        },
        "focus": [
          0.36204,
          0.2481,
          0.61966,
          0.35245
        ],
        "cursor": [
          0.42319,
          0.30835
        ],
        "durationMs": 4300,
        "mobileFocus": [
          0.36,
          0.27,
          0.28,
          0.31
        ]
      },
      {
        "id": "source-revision",
        "src": "/images/product/demos/knowledge-source-revision.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "回到支撑结果的原文",
          "en": "Open the cited revision"
        },
        "detail": {
          "zh": "按命中的发布版本打开正文，核对支撑结果的原文。",
          "en": "Open the cited revision and verify the source text."
        },
        "focus": [
          0.01165,
          0.48444,
          0.38602,
          0.13782
        ],
        "durationMs": 4500,
        "mobileFocus": [
          0.02,
          0.41,
          0.28,
          0.3
        ]
      }
    ],
    "poster": 3
  }
};
