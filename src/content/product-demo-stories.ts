import type { ProductDemoKind, ProductDemoStory } from "@/components/product-demo/types";

/** 当前 Console 的真实组件截图；全部工作、身份和返回状态为本地示例。 */
export const productDemoStories: Record<ProductDemoKind, ProductDemoStory> = {
  "employees": {
    "title": {
      "zh": "界面对照：从经验培养员工",
      "en": "In the Console: develop an employee"
    },
    "frames": [
      {
        "id": "work-records",
        "src": "/images/product/demos/employees-work-records.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "回看已有工作的依据",
          "en": "Review existing work"
        },
        "detail": {
          "zh": "从工作记录查看执行与来源，为培养目标整理可用经验。",
          "en": "Use work records and sources to identify experience for a development goal. Chinese UI; sample data."
        },
        "focus": [
          0.00832,
          0,
          0.16593,
          0.42891
        ],
        "durationMs": 3800
      },
      {
        "id": "formation-goal",
        "src": "/images/product/demos/employees-formation-goal.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "说明培养目标",
          "en": "Set a development goal"
        },
        "detail": {
          "zh": "在「从经验培养」中说明希望形成的职责，提交后查看来源覆盖与培养结果。",
          "en": "Describe a responsibility in Develop from experience, then inspect source coverage and results. Chinese UI; sample data."
        },
        "focus": [
          0.16805,
          0.3473,
          0.46589,
          0.35946
        ],
        "cursor": [
          0.57005,
          0.64256
        ],
        "durationMs": 3800,
        "mobileFocus": [
          0.18,
          0.35,
          0.28,
          0.36
        ]
      },
      {
        "id": "formed-employee",
        "src": "/images/product/demos/employees-formed-employee.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "查看角色与 Skill 成果",
          "en": "Review role and Skill outputs"
        },
        "detail": {
          "zh": "查看来源覆盖、角色与 Skill 成果，再打开已培养员工。",
          "en": "Review source coverage, role and skill outputs, then open the employee."
        },
        "focus": [
          0.01997,
          0.25182,
          0.19982,
          0.26459
        ],
        "cursor": [
          0.08959,
          0.47802
        ],
        "durationMs": 3800
      },
      {
        "id": "ready-to-work",
        "src": "/images/product/demos/employees-ready-to-work.png",
        "width": 1803,
        "height": 1110,
        "title": {
          "zh": "准备接手后续工作",
          "en": "Ready for the next task"
        },
        "detail": {
          "zh": "员工就绪后，可点「开始协作」进入该员工的会话，说明下一项任务。",
          "en": "When ready, choose Start collaboration to open the employee’s session and describe the next task. Chinese UI; sample data."
        },
        "focus": [
          0.80206,
          0.05106,
          0.14671,
          0.08161
        ],
        "durationMs": 4300
      }
    ],
    "poster": 3
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
