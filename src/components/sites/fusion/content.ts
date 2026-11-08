import type { Locale } from "@/lib/i18n";

export type Capability = {
  slug: string;
  name: string;
  title: string;
  summary: string;
  description: string;
  points: { title: string; text: string }[];
};

export const capabilities: Capability[] = [
  {
    slug: "skybot",
    name: "SkyBot",
    title: "把一个目标，变成有上下文的工作。",
    summary: "在项目里组织目标、对话、工具与工作成果。",
    description:
      "从一个明确的目标开始，在项目工作空间中补充上下文、组织对话和任务。工作过程与交付物留在同一个地方，团队可以接着推进。",
    points: [
      {
        title: "从目标开始",
        text: "提供背景、期望结果和判断完成的标准，让每一步工作有共同的方向。",
      },
      {
        title: "连接工作上下文",
        text: "按当前授权使用项目资料、知识和工具，保留相关过程与结果。",
      },
      {
        title: "让结果可检查",
        text: "查看工具记录、工作产物与需要人确认的事项，分别判断执行与业务验收。",
      },
    ],
  },
  {
    slug: "employees",
    name: "AI Employee",
    title: "把有效的工作经验，留给下一次工作。",
    summary: "为数字员工组织职责、技能、知识与工具。",
    description:
      "数字员工承载可复用的工作配置。将一次工作的经验整理成待确认的改进方案，再由人决定是否纳入员工的技能与工作方法。",
    points: [
      {
        title: "明确员工职责",
        text: "按工作目标配置数字员工的职责与能力，而不是为每次工作重新组织全部上下文。",
      },
      {
        title: "整理工作经验",
        text: "从具体工作中发现有效方法，保留经验的来源和适用范围。",
      },
      {
        title: "由人确认改进",
        text: "经验分析形成待确认方案。方案形成、能力更新与后续实际采用是不同步骤。",
      },
    ],
  },
  {
    slug: "flows",
    name: "研发任务与流程",
    title: "让复杂研发，沿着明确的流程交付。",
    summary: "用 Tasks 和 Flows 组织分析、实现、评审与验证。",
    description:
      "把需求与代码仓库组织成研发任务，通过可复用的阶段和流程推进工作。在隔离环境中执行，以变更、产物和检查结果交接。",
    points: [
      {
        title: "复用研发流程",
        text: "将分析、实现、评审和交付组织成明确阶段，为任务选择适用的流程。",
      },
      {
        title: "保留交付证据",
        text: "查看阶段状态、代码变更、工作产物与检查结果，避免只依赖一句完成声明。",
      },
      {
        title: "在边界内恢复",
        text: "在明确的运行和阶段边界内继续工作；检查通过不等于已合并或已发布。",
      },
    ],
  },
  {
    slug: "automations",
    name: "自动化",
    title: "让重复工作，有自己的运行节奏。",
    summary: "将可重复的工作组织为自动化与独立运行。",
    description:
      "为适合重复执行的工作设置触发与运行配置，查看每次运行的过程和结果。需要决策的事项仍保留人的授权与确认。",
    points: [
      {
        title: "按规则触发",
        text: "依据当前支持的定时与事件入口配置自动化，区分配置本身和每一次实际运行。",
      },
      {
        title: "逐次查看运行",
        text: "保留运行记录，判断工作是否执行、产生了什么结果，以及哪里需要跟进。",
      },
      {
        title: "保留人的决策",
        text: "对外发布、合并和其他需要授权的动作，按实际工作流程保留确认环节。",
      },
    ],
  },
  {
    slug: "knowledge",
    name: "企业知识",
    title: "每一次引用，都能回到来源。",
    summary: "将分散资料组织成有来源、可维护的企业知识。",
    description:
      "把项目事实、决策与工作资料组织成知识。在检索结果中查看匹配内容与原文，按访问范围共享，持续维护长期有效的内容。",
    points: [
      {
        title: "按问题检索",
        text: "围绕当前工作查找相关资料，通过匹配内容判断是否适用。",
      },
      {
        title: "回到来源原文",
        text: "将检索结果与同一知识库、文档和版本的内容关联起来，避免失去上下文。",
      },
      {
        title: "持续维护知识",
        text: "区分工作记录与已确认知识，按来源、权限和维护责任积累团队能力。",
      },
    ],
  },
  {
    slug: "environments",
    name: "环境与治理",
    title: "自主执行，也有明确的边界。",
    summary: "管理执行环境、模型与工具连接，保留必要的确认。",
    description:
      "将执行环境与模型、工具连接分开配置。以身份、工作范围和连接授权约束访问，让团队明确哪些工作可以执行，哪些动作需要人决定。",
    points: [
      {
        title: "配置工作环境",
        text: "为工作选择适用的执行环境，按实际部署核对隔离、网络和资源条件。",
      },
      {
        title: "分别管理授权",
        text: "团队共享能力不等于共享个人凭据；模型和工具访问依照各自授权配置。",
      },
      {
        title: "核对真实边界",
        text: "私有部署不等于零外发。接入前逐项核对模型、代码托管与外部工具的数据流。",
      },
    ],
  },
];

export const questions = [
  {
    question: "SkyMythos 是聊天工具，还是工作平台？",
    answer:
      "对话是开始工作的入口之一。SkyMythos 将目标、数字员工、项目、研发任务、自动化、知识和执行环境组织起来，关注工作如何推进、如何检查结果，以及哪些经验值得复用。",
  },
  {
    question: "数字员工的“训练”意味着什么？",
    answer:
      "这里强调从实际工作中整理经验，形成待确认的能力改进方案。知识、技能与工作方法的改进不等同于训练或修改底层模型参数。",
  },
  {
    question: "自动执行以后，还需要人做什么？",
    answer:
      "人负责定义目标、提供授权并验收结果。涉及高风险操作、对外发布、代码合并或生产部署时，按照实际配置保留必要的决策关口。",
  },
  {
    question: "私有部署是否意味着完全不向外发送数据？",
    answer:
      "需要逐项核对。私有部署与外部模型、代码仓库、工具连接的数据流是不同问题，接入时应明确每种连接的访问和数据范围。",
  },
  {
    question: "如何评估 SkyMythos 是否适合我们的企业？",
    answer:
      "提交 POC 申请，说明公司、关注场景和希望验证的目标。团队会围绕工作环境、连接授权与验收标准和你沟通。页面中的产品场景仅用于说明机制，不直接创建真实任务。",
  },
];

const englishCapabilities: Capability[] = [
  {
    slug: "skybot",
    name: "SkyBot",
    title: "Turn a goal into work with context.",
    summary: "Bring goals, conversations, tools and deliverables together in a project.",
    description:
      "Start with a clear goal. Add context, conversations and tasks in a project workspace. Keep the process and its deliverables together so your team can carry the work forward.",
    points: [
      { title: "Start with the goal", text: "Define the context, expected result and completion criteria so every step shares a clear direction." },
      { title: "Connect the context", text: "Use project materials, knowledge and tools within their authorized scope, keeping the relevant process and results." },
      { title: "Inspect the result", text: "Review tool records, deliverables and decisions awaiting confirmation. Assess execution and business acceptance separately." },
    ],
  },
  {
    slug: "employees",
    name: "AI Employee",
    title: "Let useful experience inform the next task.",
    summary: "Define responsibilities, skills, knowledge and tools for your AI employees.",
    description:
      "AI employees hold reusable work configurations. Organize experience from a task into a proposed improvement, then decide whether to incorporate it into an employee’s skills and working methods.",
    points: [
      { title: "Define responsibilities", text: "Configure an AI employee’s role and capabilities around the work, rather than assembling all the context again for every task." },
      { title: "Capture useful experience", text: "Identify effective methods in real work, preserving their sources and the conditions where they apply." },
      { title: "Review improvements", text: "Experience analysis produces a proposal for review. A proposal, a capability update and its subsequent use are separate steps." },
    ],
  },
  {
    slug: "flows",
    name: "Tasks & Flows",
    title: "Give complex engineering work a clear path to delivery.",
    summary: "Organize analysis, implementation, review and validation with Tasks and Flows.",
    description:
      "Bring requirements and repositories into an engineering task, then work through reusable stages and flows. Execute in an isolated environment and hand over changes, artifacts and check results.",
    points: [
      { title: "Reuse engineering workflows", text: "Organize analysis, implementation, review and delivery into explicit stages, choosing a suitable flow for each task." },
      { title: "Keep delivery evidence", text: "Inspect stage status, code changes, artifacts and check results instead of relying on a completion message alone." },
      { title: "Resume within clear boundaries", text: "Continue work within defined run and stage boundaries. Passing checks does not mean a change has been merged or deployed." },
    ],
  },
  {
    slug: "automations",
    name: "Automations",
    title: "Give recurring work its own rhythm.",
    summary: "Organize repeatable work into automations and individual runs.",
    description:
      "Configure triggers and execution for work suited to repetition, then review the process and result of each run. Decisions still retain the authorization and human confirmation they need.",
    points: [
      { title: "Trigger by rule", text: "Configure automations using the currently supported schedule and event triggers. Keep the configuration distinct from each actual run." },
      { title: "Review each run", text: "Use run records to see whether work executed, what it produced and where follow-up is needed." },
      { title: "Keep people in control", text: "Retain confirmation steps for publishing, merging and other actions that require authorization in the actual workflow." },
    ],
  },
  {
    slug: "knowledge",
    name: "Knowledge",
    title: "Follow every reference back to its source.",
    summary: "Organize scattered materials into maintainable enterprise knowledge with sources.",
    description:
      "Bring project facts, decisions and working materials into knowledge. Inspect matching passages and source text, share within access boundaries and maintain content that stays useful over time.",
    points: [
      { title: "Search around the work", text: "Find relevant materials for the task at hand and use matching passages to assess their relevance." },
      { title: "Return to the source", text: "Connect search results to the same knowledge base, document and version so their context stays intact." },
      { title: "Maintain knowledge over time", text: "Distinguish working records from confirmed knowledge. Build team capability with clear sources, permissions and maintenance ownership." },
    ],
  },
  {
    slug: "environments",
    name: "Environments & Governance",
    title: "Autonomous work. Clear boundaries.",
    summary: "Manage execution environments, model and tool connections, and necessary approvals.",
    description:
      "Configure execution environments separately from model and tool connections. Bound access by identity, work scope and connection permissions so the team knows what can proceed and what needs a human decision.",
    points: [
      { title: "Prepare the environment", text: "Choose an appropriate execution environment and verify isolation, network and resource conditions for the actual deployment." },
      { title: "Manage permissions separately", text: "Sharing team capabilities does not mean sharing personal credentials. Model and tool access follows each connection’s authorization." },
      { title: "Verify actual boundaries", text: "Private deployment does not mean zero external data transfer. Review data flows to models, code hosts and external tools before connecting them." },
    ],
  },
];

const englishQuestions: typeof questions = [
  {
    question: "Is SkyMythos a chat tool or a work platform?",
    answer: "Conversation is one way to start work. SkyMythos brings together goals, AI employees, projects, engineering tasks, automations, knowledge and execution environments, focusing on how work progresses, how results are checked and which experience is worth reusing.",
  },
  {
    question: "What does AI employee training mean?",
    answer: "It means organizing experience from real work into proposed capability improvements for review. Improving knowledge, skills and working methods does not mean training or changing the underlying model’s parameters.",
  },
  {
    question: "What do people do when work runs autonomously?",
    answer: "People define goals, authorize access and accept results. High-risk operations, external publishing, code merges and production deployments retain the decision points required by the actual configuration.",
  },
  {
    question: "Does private deployment mean no data leaves the environment?",
    answer: "Each connection needs review. Private deployment and data flows to external models, repositories and tools are separate questions. Define the access and data scope of every connection during setup.",
  },
  {
    question: "How can we assess whether SkyMythos fits our company?",
    answer: "Request a POC and describe your company, use case and validation goal. The team can discuss the environment, connection permissions and acceptance criteria with you. Product scenes on this website explain the workflow; they do not create real tasks.",
  },
];

export function getCapabilities(locale: Locale = "en"): Capability[] {
  return locale === "zh" ? capabilities : englishCapabilities;
}

export function getQuestions(locale: Locale = "en"): typeof questions {
  return locale === "zh" ? questions : englishQuestions;
}
