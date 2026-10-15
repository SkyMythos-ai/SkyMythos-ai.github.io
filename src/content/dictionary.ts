import type { Locale } from "@/lib/i18n";

/**
 * UI strings.
 *
 * Marketing and documentation *bodies* live in their own corpora; this file
 * holds only the chrome — navigation, buttons, labels, footer. Keeping it in one
 * typed record means a missing translation is a compile error rather than a
 * blank space on a page.
 */

export interface Dictionary {
  meta: {
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
  };
  nav: {
    product: string;
    concept: string;
    architecture: string;
    docs: string;
    getStarted: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    skipToContent: string;
    home: string;
  };
  hero: {
    /**
     * 首页 slogan：以一句话表达核心产品价值。
     */
    headline: string;
    lede: string;
    primaryCta: string;
    secondaryCta: string;
    /** Caption above the frozen-specification panel. */
    specPanelLabel: string;
    specPanelNote: string;
  };
  home: {
    problemRail: string;
    problemHeading: string;
    problemLede: string;
    problems: Array<{ title: string; detail: string }>;
    shiftRail: string;
    shiftHeading: string;
    /** Contrast table: conventional agent usage versus the governed platform. */
    shiftColumns: [string, string];
    shifts: Array<{ conventional: string; governed: string }>;
    pipelineRail: string;
    pipelineHeading: string;
    pipelineLede: string;
    pipelineNote: string;
    capabilityRail: string;
    capabilityHeading: string;
    capabilityLede: string;
    capabilities: Array<{
      name: string;
      /** Domain object this capability is built from, shown as a mono tag. */
      object: string;
      detail: string;
    }>;
    boundaryRail: string;
    boundaryHeading: string;
    boundaryLede: string;
    /** Honest scope statement — what the platform deliberately does not do. */
    boundaries: Array<{ title: string; detail: string }>;
    maturityRail: string;
    maturityHeading: string;
    maturityBody: string[];
    maturityCaveat: string;
    ctaHeading: string;
    ctaBody: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  concept: {
    title: string;
    description: string;
    lede: string;
    /** Each block documents one domain object and its governing constraint. */
    objects: Array<{
      rail: string;
      name: string;
      role: string;
      constraints: string[];
      note?: string;
    }>;
    lifecycleRail: string;
    lifecycleHeading: string;
    lifecycleLede: string;
    lifecycle: Array<{ step: string; detail: string }>;
  };
  architecture: {
    title: string;
    description: string;
    lede: string;
    layersRail: string;
    layersHeading: string;
    layers: Array<{
      name: string;
      responsibility: string;
      /** What holds authority for this layer's state. */
      authority: string;
    }>;
    decisionsRail: string;
    decisionsHeading: string;
    decisionsLede: string;
    decisions: Array<{ title: string; decision: string; consequence: string }>;
    persistenceRail: string;
    persistenceHeading: string;
    persistenceBody: string;
  };
  docs: {
    title: string;
    description: string;
    lede: string;
    sidebarLabel: string;
    onThisPage: string;
    previous: string;
    next: string;
    backToIndex: string;
    readTime: string;
    minutes: string;
    empty: string;
    searchHint: string;
  };
  footer: {
    tagline: string;
    productHeading: string;
    resourceHeading: string;
    companyHeading: string;
    productLinks: Array<{ label: string; href: string }>;
    resourceLinks: Array<{ label: string; href: string }>;
    companyLinks: Array<{ label: string; href: string }>;
    rights: string;
    builtWith: string;
  };
  notFound: {
    title: string;
    body: string;
    cta: string;
  };
}

const zh: Dictionary = {
  meta: {
    title: "SkyMythos — 企业私有化部署的自主软件研发平台",
    titleTemplate: "%s · SkyMythos",
    description:
      "SkyMythos 把需求或技术设计编译为可审查、可验证、可追溯的软件变更。基于版本化 Flow、隔离 Sandbox、Artifact 确定性交接与项目知识闭环的 Agent 工程控制面。",
    keywords: [
      "AI Infra",
      "Coding Agent",
      "私有化部署",
      "Agent 工程控制面",
      "软件研发自动化",
      "Sandbox 隔离",
      "Flow 编排",
      "Artifact 交付",
      "企业知识库",
    ],
  },
  nav: {
    product: "产品",
    concept: "产品概念",
    architecture: "架构",
    docs: "使用文档",
    getStarted: "快速开始",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    switchLanguage: "切换语言",
    skipToContent: "跳到主要内容",
    home: "首页",
  },
  hero: {
    headline: "让想法，成为可交付的软件。",
    lede: "在你的环境中，让多个 Agent 协作，将需求转化为可审查的代码与验证证据。",
    primaryCta: "阅读使用文档",
    secondaryCta: "了解产品概念",
    specPanelLabel: "TaskSpec · 冻结中",
    specPanelNote: "执行期间不可变。Sandbox 只消费这份规格，不再解析浮动版本。",
  },
  home: {
    problemRail: "问题",
    problemHeading: "Coding Agent 能写代码，企业缺的是把它纳入研发体系",
    problemLede:
      "模型能力已经不是瓶颈。瓶颈在于一次 Agent 工作能否被组织解释、审计、复现和交接。以下六件事在聊天式代码助手里无解，因为它们的根因不在模型，而在缺少控制面。",
    problems: [
      {
        title: "任务过程不可复现",
        detail:
          "Prompt、模型、Skill 与上下文随会话漂移。同一个任务无法重放，也无法解释当时为什么做出那个决定。",
      },
      {
        title: "复杂研发无法可靠协作",
        detail:
          "分析、编码、评审和交付挤在一个长会话里。上下游依赖、失败边界和返工范围都没有被显式表达。",
      },
      {
        title: "产出离交付仍有距离",
        detail:
          "生成代码不等于完成研发。缺少测试执行、变更摘要、Artifact 交接和变更请求这些确定性交付物。",
      },
      {
        title: "企业知识无法持续积累",
        detail:
          "架构约束、项目决策与历史经验散落在文档和个人会话中。下一个任务仍要从头理解同一件事。",
      },
      {
        title: "安全与治理依赖 Agent 自律",
        detail:
          "代码、模型凭据、企业系统权限与外部副作用缺少平台级隔离。Prompt 和 Skill 不是安全边界。",
      },
      {
        title: "执行过程是黑盒",
        detail:
          "团队难以实时了解 Agent 正在做什么、为什么失败，以及什么时候需要人工介入。",
      },
    ],
    shiftRail: "形态差异",
    shiftHeading: "同样是让 AI 写代码，工程形态完全不同",
    shiftColumns: ["个人驱动的 Coding Agent 用法", "SkyMythos 的目标形态"],
    shifts: [
      {
        conventional: "依赖个人 Prompt 和临时会话",
        governed: "使用版本化 Flow 与 WorkNode 组织研发过程",
      },
      {
        conventional: "一个 Agent 从头做到尾",
        governed: "多个独立 Agent Session 按 DAG 并行或串行协作",
      },
      {
        conventional: "上下文随运行时变化",
        governed: "Task 创建时冻结模型、能力与知识版本",
      },
      {
        conventional: "用自然语言说明「已经完成」",
        governed: "用 Artifact、Unit Gate 与验证结果证明完成",
      },
      {
        conventional: "失败后重新开一个会话",
        governed: "保留执行谱系，从指定 WorkNode 恢复或重跑受影响子图",
      },
      {
        conventional: "过程结束后知识散失",
        governed: "把可复用认知归并到仓库与项目知识空间",
      },
      {
        conventional: "代码和凭据暴露给不受控工具",
        governed: "在企业环境内以 Sandbox 与最小凭据边界运行",
      },
    ],
    pipelineRail: "执行链路",
    pipelineHeading: "一次任务经历什么",
    pipelineLede:
      "每个 Task 是一次冻结输入后的研发执行，每个 WorkNode 是一个独立的 Agent Session，Artifact 是它们之间的正式数据面。控制面负责身份、版本、策略与 Sandbox 生命周期；Sandbox 内的 Supervisor 负责 DAG、执行尝试、会话与产物。",
    pipelineNote:
      "Supervisor 负责运行时内的调度与执行证据。环境丢失后，可从校验为 Ready 的运行快照恢复同一任务；恢复会重新校验授权与冻结配置，并保留执行和环境代际。",
    capabilityRail: "核心能力",
    capabilityHeading: "平台提供什么",
    capabilityLede: "以下能力共同构成产品差异，单独任何一项都不足够。",
    capabilities: [
      {
        name: "Task 工作台",
        object: "Task",
        detail:
          "创建、观察和管理研发任务。在统一工作台查看 WorkNode 拓扑、Agent 会话、Artifact、验证结果与交付状态。",
      },
      {
        name: "Flow 与 WorkNode 库",
        object: "Flow",
        detail:
          "用可发布的 Flow 描述研发 DAG，用不可变 WorkNode Release 复用 Agent 能力与质量门禁。普通用户只描述任务，平台在 Preflight 中优先复用已有 Flow。",
      },
      {
        name: "隔离执行",
        object: "Sandbox",
        detail:
          "一 Task 一 Sandbox。支持本地运行与 Kubernetes Agent Sandbox 配合 gVisor 执行边界。每个执行尝试使用独立 Git worktree。",
      },
      {
        name: "确定性交付",
        object: "Artifact",
        detail:
          "以 artifacts.json、result.md、内容摘要与 Unit Gate 约束完成条件。下游不能修改上游产物，每页读取有明确边界。",
      },
      {
        name: "恢复与返工",
        object: "Attempt",
        detail:
          "区分执行层 Retry 与语义层 Rework。保留执行代次、尝试与快照谱系，在明确边界内恢复运行时或重跑受影响子图。",
      },
      {
        name: "项目知识闭环",
        object: "Knowledge",
        detail:
          "管理长期项目知识、决策与个人工作偏好。知识通过只读召回进入 Sandbox，下次任务按冻结版本重新调用。",
      },
      {
        name: "能力供应链",
        object: "Marketplace",
        detail:
          "管理版本化 Skill、MCP 与企业资源连接。Task 只消费经过解析和冻结的能力，不在运行时拉取浮动内容。",
      },
      {
        name: "可观测性",
        object: "Trace",
        detail:
          "通过实时事件、任务与 WorkNode 状态以及 OpenTelemetry 链路理解 Agent 行为与系统运行情况。",
      },
    ],
    boundaryRail: "产品边界",
    boundaryHeading: "不做什么",
    boundaryLede:
      "清楚的产品边界比能力清单更能说明一个平台的位置。SkyMythos 聚焦「需求与设计到代码交付」这一段工程过程。",
    boundaries: [
      {
        title: "不替代代码托管与评审平台",
        detail: "与 GitHub、GitLab 等现有系统协作，不重建仓库、评审和权限体系。",
      },
      {
        title: "不建设通用 CI/CD 与生产发布",
        detail: "与 Jenkins、Argo CD 等协作，不接管构建集群和生产发布流程。",
      },
      {
        title: "不以 DAG 画布为产品中心",
        detail: "执行中的 Task 与 Agent 会话是主要工作表面，执行图按需用于解释过程。",
      },
      {
        title: "不把 Agent 自律当作安全边界",
        detail: "凭据、工具、网络与高风险副作用必须由平台策略约束，不能依赖 Prompt 或模型判断。",
      },
      {
        title: "不把完整对话当作长期知识",
        detail: "进入知识空间的内容必须可追溯、可审阅，并具有明确的权威来源。",
      },
    ],
    maturityRail: "当前阶段",
    maturityHeading: "已形成什么，还差什么",
    maturityBody: [
      "仓库当前已经形成可运行的本地与 OrbStack 纵向切片，用来验证领域模型、控制面、真实 ACP Agent 会话、隔离 Sandbox、DAG 调度、Artifact 交接、知识召回、运行时快照与恢复、可观测性与 Console 体验能够贯通。",
      "这仍不等于生产版本已经完整交付。持久化服务的完整覆盖、企业单点登录与审计、高可用控制面、更多 Coding Driver、生产环境安装升级，以及基于真实企业网关和代码托管系统的完整端到端验收，仍在持续建设中。",
    ],
    maturityCaveat: "这一节按实际情况陈述，不按目标形态陈述。",
    ctaHeading: "从第一个任务开始",
    ctaBody:
      "部署本地切片，配置模型网关，然后提交一个真实任务。文档按操作顺序组织，不需要先理解全部领域模型。",
    ctaPrimary: "打开快速开始",
    ctaSecondary: "查看领域术语",
  },
  concept: {
    title: "产品概念",
    description:
      "SkyMythos 的核心领域对象：Task、TaskSpec、Flow、WorkNode、Sandbox、Attempt、Artifact、Knowledge 与 Memory，以及它们之间的约束关系。",
    lede: "理解 SkyMythos 不需要先读架构文档。需要的是分清七个对象各自负责什么、什么状态由谁权威、以及哪些边界不许越界。这一页按领域对象组织，每一个都给出职责与硬约束。",
    objects: [
      {
        rail: "01",
        name: "Organization 与 Workspace",
        role: "治理边界与协作范围",
        constraints: [
          "一套部署恰好一个 Organization，不提供多组织创建、切换或归档语义。",
          "Workspace 是 Organization 内承载成员授权与共享能力的逻辑范围，不与代码仓库绑定。",
          "系统管理权不自动带来 Workspace 数据权；每次读写都由控制面按登录身份与成员关系鉴权。",
        ],
        note: "Project 在 Workspace 内围绕一个持续工程目标组织仓库、任务、知识与决策，是长期范围而不是一次执行。",
      },
      {
        rail: "02",
        name: "Task 与 TaskSpec",
        role: "一次研发执行及其冻结规格",
        constraints: [
          "Task 绑定一份 TaskSpec 和一个 Sandbox，创建后异步进入运行状态机。",
          "TaskSpec 在创建前解析完成，执行期间不可变。它冻结创建者、工作范围、仓库、初始流程快照、模型与能力版本，但不包含任何密钥。",
          "Retry、Rework、Restart 与恢复始终沿用同一份规格，运行中不重新解析浮动版本。",
        ],
      },
      {
        rail: "03",
        name: "Flow 与 WorkNode",
        role: "可版本化的研发过程定义",
        constraints: [
          "WorkNode 是可独立维护和版本化的可复用 Agent 执行定义；Flow 由多个 WorkNode 调用按依赖组成 DAG。",
          "Draft 可以编辑，发布后的版本与内容摘要不可变。latest 只是可移动别名，不保证等于最大的版本号。",
          "任一时刻一个资产只有一处可编辑权威。已发布版本只能标记弃用或撤回，不能覆盖或物理删除。",
        ],
        note: "普通用户默认只描述任务，平台在 Preflight 中优先复用市场 Flow，无法适配时生成可审计的临时 Flow。用户仍可自行定义 Flow，或把验证过的临时快照固化为市场草稿。",
      },
      {
        rail: "04",
        name: "Sandbox",
        role: "一次任务的隔离运行边界",
        constraints: [
          "任务在绑定的隔离环境中执行，Supervisor 负责运行时内的 DAG 状态与调度。",
          "控制面管理任务生命周期、授权、环境绑定和交付引用，执行节点由运行器推进。",
          "环境丢失后，可从校验为 Ready 的运行快照恢复同一任务；恢复重新校验授权与配置，并记录新的环境代际。",
        ],
      },
      {
        rail: "05",
        name: "Attempt",
        role: "一个 WorkNode 的一次不可变执行",
        constraints: [
          "每个 WorkNode 都是独立的 Agent 会话；每次执行使用独立 Git worktree，不直接修改共享工作区。",
          "执行层 Retry 处理网关超时、进程崩溃、命令超时等故障；语义层 Rework 处理下游确认的上游产物缺陷。两者分开计数。",
          "Rework 始终创建新的会话、执行尝试与产物版本。失败记录不被改写，而是追加到历史。",
        ],
        note: "成功执行会把自己的 Git 修订冻结为独立引用。worktree 释放后仍能按该修订列出并读取代码。",
      },
      {
        rail: "06",
        name: "Artifact 与 Unit Gate",
        role: "WorkNode 之间的确定性交接面",
        constraints: [
          "完成条件是确定的：声明的产物全部生成、artifacts.json 存在且可枚举、result.md 内容有效、Unit Gate 全部通过。",
          "产物身份由 WorkNode、输出名、执行尝试与内容摘要共同构成。下游不能修改上游版本。",
          "确定性构建、测试、静态检查与扫描由用户在 WorkNode 中声明的 Shell 命令承担，按退出码判断结果。",
        ],
      },
      {
        rail: "07",
        name: "Knowledge 与 Memory",
        role: "长期认知的两个独立权威",
        constraints: [
          "Knowledge 是在明确范围内经过综合、可复用且带来源的正式认知，分为仓库知识与项目知识两个空间。",
          "Memory 是从执行中捕获、归并、召回和遗忘认知的持续机制，以用户为主体，采用工作记忆、语义记忆与常驻记忆分层。",
          "两者是独立的权威边界：Memory 不进入知识检索数据面，Tasks 只消费创建时冻结的快照，Agent 不能直接写长期记忆。",
        ],
        note: "进入长期知识的内容必须可追溯、可审阅并具有明确权威来源。完整会话不会被自动晋升为知识。",
      },
    ],
    lifecycleRail: "生命周期",
    lifecycleHeading: "从意图到交付的完整链路",
    lifecycleLede: "以下步骤在实现中由明确的持久化状态与检查点承载，而不是流程说明。",
    lifecycle: [
      {
        step: "创建",
        detail:
          "先持久化任务记录并返回标识，随后进入用户可见的预检阶段。此时尚未创建任何沙箱资源。",
      },
      {
        step: "预检",
        detail:
          "以当前用户与工作范围对规划结果重新授权，确定性校验仓库、分支、依赖图、模式、兼容性、预算与风险，并冻结不可变的执行规格。",
      },
      {
        step: "供给",
        detail:
          "只有预检成功才创建沙箱，依次完成仓库克隆、需求物化、运行时准备与 Agent 启动。失败保留结构化检查结果与修复入口。",
      },
      {
        step: "执行",
        detail:
          "Supervisor 持续选择依赖已满足的 WorkNode，受配额约束并行执行，并处理等待、失败、返工、取消与完成。",
      },
      {
        step: "交接",
        detail:
          "成功执行按契约冻结声明产物与摘要。下游 WorkNode 只读取冻结版本，不读取运行时目录中的临时文件。",
      },
      {
        step: "交付",
        detail:
          "交付 WorkNode 在受控完成步骤中推送检查点分支并幂等创建或解析变更请求。该步骤使用的凭据对 Agent 会话不可见。",
      },
      {
        step: "归并",
        detail:
          "任务结束后从输入、产物、代码变更、验证结果与有权限的交互中产生知识增量，由知识服务综合为可审阅的正式认知。",
      },
    ],
  },
  architecture: {
    title: "架构",
    description:
      "SkyMythos 的组件分层、状态权威归属与关键架构决策：控制面、Agent Runner、Sandbox Provider、Gateway、Console 与持久化边界。",
    lede: "平台由若干独立组件构成，每个组件拥有明确的职责与状态权威。理解架构的关键不是记住组件名，而是知道哪一层对哪一类事实负责。",
    layersRail: "分层",
    layersHeading: "组件与职责",
    layers: [
      {
        name: "控制面 Control Plane",
        responsibility:
          "承载产品用例与治理边界：身份、工作范围、流程与能力的版本权威、任务供给与调度、知识治理、审计与接口适配。",
        authority: "结构化业务状态的权威，位于 PostgreSQL。",
      },
      {
        name: "Agent Runner",
        responsibility:
          "在获授的执行代次内推进节点与执行尝试，运行原生 Agent 会话与事件，处理依赖、有界并发、取消与完成。",
        authority: "DAG、执行尝试、会话引用与运行时事件的权威。",
      },
      {
        name: "Sandbox Provider",
        responsibility:
          "拥有运行环境的创建、观察、绑定与清理。三个实现各自独立，核心通过统一协议调用。",
        authority: "运行环境的生命周期。环境就绪不代表业务完成。",
      },
      {
        name: "Sandbox Gateway",
        responsibility:
          "统一 Web 与 WebSocket 接入、页面终端与 Runner 的远程过程调用入口。",
        authority: "接入协议适配，不持有业务状态权威。",
      },
      {
        name: "Console",
        responsibility:
          "组合产品接口与受控交互，提供角色化的桌面工作台体验。",
        authority: "不持有运行或授权的第二权威，只呈现控制面事实。",
      },
      {
        name: "Contracts 与 Libraries",
        responsibility:
          "跨组件的协议与语义合同，以及可独立复用的基础能力。",
        authority: "组件之间不导入对方内部实现，只依赖显式合同。",
      },
    ],
    decisionsRail: "关键决策",
    decisionsHeading: "为什么这样设计",
    decisionsLede:
      "以下取舍决定了平台的形态。它们不是因为实现简单而选择，而是因为拒绝某种复杂度。",
    decisions: [
      {
        title: "调度与状态放在同一个故障域",
        decision:
          "DAG 状态、会话、产物与 Git worktree 都位于任务自己的沙箱内，沙箱内的 Supervisor 是唯一调度权威，控制面不保存节点级状态。",
        consequence:
          "从可用快照恢复时需要重新校验授权、运行工具与产物配置，并保留新的环境代际；这不等同于任意时刻的透明热迁移。",
      },
      {
        title: "完成由契约证明，而不是由自然语言声明",
        decision:
          "每个节点的成功条件由声明的产物、清单文件、结果摘要与质量门禁共同定义，运行时强制校验，格式或覆盖不完整时该节点失败。",
        consequence:
          "Agent 无法用「已经完成」绕过交付要求。项目自身的指令或模型偏差不能绕过完成合同。",
      },
      {
        title: "流程既可以生成，也可以版本化",
        decision:
          "普通用户只描述任务，平台在预检中优先复用已发布流程，无法适配时生成任务专属的临时流程；两部分都经过同一套确定性编译器与摘要校验。",
        consequence:
          "降低了采用门槛，同时不牺牲可复现性。临时流程不会自动变成团队资产，想要复用必须显式固化。",
      },
      {
        title: "知识必须同时具备治理面与执行面",
        decision:
          "用户维护与审阅知识，Agent 通过只读接口在任务执行时实时查询最新生效内容，每次调用重新检查主体、范围与授权。",
        consequence:
          "只有存储和页面、没有执行期消费接口，不构成完整知识产品；反之运行时也不能绕过治理直接检索。",
      },
      {
        title: "凭据使用最小接收者注入",
        decision:
          "成员模型密钥只交给运行器，本地扩展的凭据只交给对应边车，远程扩展的凭据只交给代理。各组件就绪后立即删除任务密钥。",
        consequence:
          "Agent 主进程不直接持有扩展凭据，密钥不进入镜像、仓库、规格、日志或事件。",
      },
      {
        title: "企业版以纯私有化为前提",
        decision:
          "核心控制面、沙箱、模型接入、产物与遥测链路都能在客户环境独立运行，不依赖外部托管服务。",
        consequence:
          "所有状态权威都必须部署在客户网络内。这排除了以托管服务作为关键路径的设计。",
      },
    ],
    persistenceRail: "状态权威",
    persistenceHeading: "什么事实由谁保存",
    persistenceBody:
      "结构化业务状态由控制面的关系数据库保存。运行器以本地事务日志原子保存执行代次、事件与恢复回执。源码事实由 Git 保存。运行时快照、冻结需求与能力包等大对象按各自合同进入对象存储。知识正文与索引由独立的检索数据面承载，个人记忆使用独立的数据库与账号，不与控制面主库建立外键或共享事务。执行代次、环境代次与写入者纪元各自独立：取消受理、进程退出、持久终态与业务成功是不同的事实，缺少退出证据的副作用保持未知，不会被自动重放。",
  },
  docs: {
    title: "使用文档",
    description:
      "SkyMythos 完整使用手册：部署与首次登录、核心概念、任务操作、失败恢复、平台运维与领域术语参考。",
    lede: "手册按实际操作顺序组织。如果只是想把第一个任务跑起来，从快速开始读起；如果想理解平台为什么这样设计，从核心概念读起。",
    sidebarLabel: "手册目录",
    onThisPage: "本页内容",
    previous: "上一篇",
    next: "下一篇",
    backToIndex: "返回手册目录",
    readTime: "阅读约",
    minutes: "分钟",
    empty: "这一节还没有内容。",
    searchHint: "使用左侧目录浏览全部章节。",
  },
  footer: {
    tagline: "面向企业私有化部署的自主软件研发平台。",
    productHeading: "产品",
    resourceHeading: "资源",
    companyHeading: "关于",
    productLinks: [
      { label: "产品概览", href: "/" },
      { label: "产品概念", href: "/concept" },
      { label: "架构", href: "/architecture" },
      { label: "使用文档", href: "/docs" },
    ],
    resourceLinks: [
      { label: "快速开始", href: "/docs/getting-started/overview" },
      { label: "领域术语表", href: "/docs/reference/glossary" },
      { label: "常见问题", href: "/docs/reference/faq" },
      { label: "平台运维", href: "/docs/operations/roles" },
    ],
    companyLinks: [
      { label: "源码仓库", href: "https://github.com/SkyMythos-ai/fusion-harness" },
      { label: "部署说明", href: "/docs/getting-started/deployment" },
      { label: "安全与治理", href: "/architecture" },
    ],
    rights: "保留所有权利。",
    builtWith: "静态导出，部署于 GitHub Pages。",
  },
  notFound: {
    title: "页面不存在",
    body: "这个地址没有对应内容。可能是链接已更新，或者路径输入有误。",
    cta: "返回首页",
  },
};

const en: Dictionary = {
  meta: {
    title: "SkyMythos — Autonomous software R&D, deployed in your own environment",
    titleTemplate: "%s · SkyMythos",
    description:
      "SkyMythos compiles a requirement or technical design into reviewable, verifiable, traceable software change. An agent engineering control plane built on versioned flows, isolated sandboxes, artefact-based handoff and a project knowledge loop.",
    keywords: [
      "AI infrastructure",
      "coding agent",
      "self-hosted",
      "agent control plane",
      "software delivery automation",
      "sandbox isolation",
      "flow orchestration",
      "artefact handoff",
      "enterprise knowledge",
    ],
  },
  nav: {
    product: "Product",
    concept: "Concepts",
    architecture: "Architecture",
    docs: "Documentation",
    getStarted: "Get started",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "Switch language",
    skipToContent: "Skip to content",
    home: "Home",
  },
  hero: {
    headline: "From idea to software delivery.",
    lede: "Agents collaborate in your environment to turn requirements into reviewable code and verification evidence.",
    primaryCta: "Read the documentation",
    secondaryCta: "Explore the concepts",
    specPanelLabel: "TaskSpec · freezing",
    specPanelNote:
      "Immutable for the life of the task. The sandbox consumes this specification and never resolves a floating version at runtime.",
  },
  home: {
    problemRail: "Problem",
    problemHeading:
      "Coding agents can write code. What enterprises lack is a way to put that into the delivery system",
    problemLede:
      "Model capability is no longer the constraint. The constraint is whether a single agent run can be explained, audited, replayed and handed off by an organisation. These six failures are unsolvable inside a chat-style assistant, because their cause is not the model — it is the missing control plane.",
    problems: [
      {
        title: "Runs are not reproducible",
        detail:
          "Prompts, models, skills and context drift with the session. The same task cannot be replayed, and no one can explain why a decision was made at the time.",
      },
      {
        title: "Complex work cannot be coordinated",
        detail:
          "Analysis, implementation, review and delivery are compressed into one long conversation. Dependencies, failure boundaries and rework scope are never expressed.",
      },
      {
        title: "Output is still short of delivery",
        detail:
          "Generated code is not completed R&D work. Test execution, change summaries, artefact handoff and merge requests are missing.",
      },
      {
        title: "Enterprise knowledge does not accumulate",
        detail:
          "Architectural constraints, project decisions and past experience scatter across documents and personal sessions. The next task re-learns all of it.",
      },
      {
        title: "Security depends on agent self-restraint",
        detail:
          "Code, model credentials, enterprise system access and external side effects lack platform-level isolation. Prompts and skills are not a security boundary.",
      },
      {
        title: "Execution is a black box",
        detail:
          "Teams cannot see what an agent is doing right now, why it failed, or when a human needs to step in.",
      },
    ],
    shiftRail: "The shift",
    shiftHeading: "Same intent, entirely different engineering shape",
    shiftColumns: ["Agent-driven development as usual", "The SkyMythos target"],
    shifts: [
      {
        conventional: "Depends on individual prompts and ad-hoc sessions",
        governed: "Uses versioned flows and work nodes to organise the work",
      },
      {
        conventional: "One agent carries the task end to end",
        governed: "Independent agent sessions collaborate across a DAG",
      },
      {
        conventional: "Context shifts with the runtime",
        governed: "Model, capabilities and knowledge versions freeze at task creation",
      },
      {
        conventional: "Completion asserted in natural language",
        governed: "Completion proven by artefacts, unit gates and verification results",
      },
      {
        conventional: "A failure means starting a new session",
        governed: "Execution lineage is kept; resume a node or rerun the affected subgraph",
      },
      {
        conventional: "Knowledge is lost when the session ends",
        governed: "Reusable cognition is consolidated into repository and project knowledge",
      },
      {
        conventional: "Code and credentials exposed to uncontrolled tools",
        governed: "Runs inside your environment under sandbox and least-credential boundaries",
      },
    ],
    pipelineRail: "Pipeline",
    pipelineHeading: "What a task actually goes through",
    pipelineLede:
      "Every task is one R&D execution over frozen inputs. Every work node is a separate agent session. Artefacts are the formal data plane between them. The control plane owns identity, versions, policy and sandbox lifecycle; the supervisor inside the sandbox owns the DAG, attempts, sessions and artefacts.",
    pipelineNote:
      "The supervisor owns runtime scheduling and execution evidence. A lost environment can be restored for the same task from a validated Ready runtime snapshot. Restore rechecks authorization and frozen configuration, preserving execution and runtime generations.",
    capabilityRail: "Capabilities",
    capabilityHeading: "What the platform provides",
    capabilityLede:
      "The product's difference comes from these capabilities together. Any one of them alone is not enough.",
    capabilities: [
      {
        name: "Task workbench",
        object: "Task",
        detail:
          "Create, observe and manage R&D tasks. Inspect node topology, agent sessions, artefacts, verification results and delivery state in one surface.",
      },
      {
        name: "Flow and work node library",
        object: "Flow",
        detail:
          "Describe the R&D DAG with publishable flows, and reuse agent capability and quality gates through immutable work node releases. Ordinary users describe the task; the platform reuses an existing flow when one fits.",
      },
      {
        name: "Isolated execution",
        object: "Sandbox",
        detail:
          "One sandbox per task. Runs locally or on Kubernetes agent sandboxes with a gVisor boundary. Every attempt uses its own Git worktree.",
      },
      {
        name: "Deterministic delivery",
        object: "Artefact",
        detail:
          "Completion is constrained by an artefact manifest, a result summary, content digests and unit gates. Downstream nodes cannot modify an upstream artefact.",
      },
      {
        name: "Resume and rework",
        object: "Attempt",
        detail:
          "Execution-level retry is counted separately from semantic rework. Execution generations, attempts and snapshots are retained so work can resume at a defined point.",
      },
      {
        name: "Project knowledge loop",
        object: "Knowledge",
        detail:
          "Manage long-lived project knowledge, decisions and personal working preferences. Knowledge enters the sandbox read-only and is recalled by frozen version in later tasks.",
      },
      {
        name: "Capability supply chain",
        object: "Marketplace",
        detail:
          "Manage versioned skills, MCP endpoints and enterprise resource connections. A task consumes only resolved, frozen capabilities — never floating content at runtime.",
      },
      {
        name: "Observability",
        object: "Trace",
        detail:
          "Understand agent behaviour and system health through live events, task and node state, and OpenTelemetry traces.",
      },
    ],
    boundaryRail: "Boundaries",
    boundaryHeading: "What it deliberately does not do",
    boundaryLede:
      "A clear boundary says more about a platform's position than a feature list. SkyMythos focuses on the span from requirement and design to code delivery.",
    boundaries: [
      {
        title: "Does not replace code hosting or review",
        detail:
          "Works alongside GitHub, GitLab and similar systems rather than rebuilding repositories, review and permissions.",
      },
      {
        title: "Does not build general CI/CD or production release",
        detail:
          "Collaborates with Jenkins, Argo CD and similar tools instead of taking over build clusters and release pipelines.",
      },
      {
        title: "Does not centre the product on a DAG canvas",
        detail:
          "Running tasks and agent sessions are the primary working surface. The execution graph explains the process on demand.",
      },
      {
        title: "Does not treat agent self-restraint as security",
        detail:
          "Credentials, tools, network and high-risk side effects are constrained by platform policy — never by a prompt or a model's judgement.",
      },
      {
        title: "Does not treat full conversations as long-term knowledge",
        detail:
          "Content entering a knowledge space must be traceable, reviewable and backed by an explicit authoritative source.",
      },
    ],
    maturityRail: "Current stage",
    maturityHeading: "What exists today, and what is still missing",
    maturityBody: [
      "The repository already contains a working vertical slice, runnable locally and on OrbStack, proving that the domain model, control plane, real ACP agent sessions, isolated sandbox, DAG scheduling, artefact handoff, knowledge recall, runtime snapshot and resume, observability and console experience connect end to end.",
      "That is not the same as a complete production release. Full persistence coverage, enterprise single sign-on and audit, a highly available control plane, additional coding drivers, production installation and upgrade, and full end-to-end verification against real enterprise gateways and code hosting are still under construction.",
    ],
    maturityCaveat:
      "This section describes the actual state, not the target state.",
    ctaHeading: "Start with your first task",
    ctaBody:
      "Deploy the local slice, configure a model gateway, then submit a real task. The documentation follows the order you would actually work in — you do not need the whole domain model first.",
    ctaPrimary: "Open getting started",
    ctaSecondary: "Read the glossary",
  },
  concept: {
    title: "Concepts",
    description:
      "The core domain objects of SkyMythos: Task, TaskSpec, Flow, WorkNode, Sandbox, Attempt, Artefact, Knowledge and Memory, together with the constraints that govern them.",
    lede: "Understanding SkyMythos does not begin with an architecture diagram. It begins with separating what seven objects each own, which state each one holds authority over, and which boundaries must not be crossed. This page is organised by domain object, and gives the responsibility and the hard constraint for each.",
    objects: [
      {
        rail: "01",
        name: "Organization and Workspace",
        role: "Governance boundary and collaboration scope",
        constraints: [
          "One deployment is exactly one organisation. There is no multi-organisation creation, switching or archiving.",
          "A workspace carries membership authorisation and shared capabilities inside the organisation. It is not bound to a repository.",
          "Platform operations rights do not imply workspace data rights. Every read and write is authorised by the control plane against the signed-in principal and membership.",
        ],
        note: "A project organises repositories, tasks, knowledge and decisions around one sustained engineering goal inside a workspace — a long-lived scope, not a single execution.",
      },
      {
        rail: "02",
        name: "Task and TaskSpec",
        role: "One R&D execution and its frozen specification",
        constraints: [
          "A task binds one specification and one sandbox, then enters a running state machine asynchronously.",
          "The specification is resolved before creation and is immutable while the task runs. It freezes the creator, scope, repository, initial flow snapshot, model and capability versions — and holds no secrets.",
          "Retry, rework, restart and resume all reuse the same specification. Floating versions are never re-resolved mid-run.",
        ],
      },
      {
        rail: "03",
        name: "Flow and WorkNode",
        role: "A versionable definition of R&D process",
        constraints: [
          "A work node is a reusable, independently maintained and versioned agent execution definition. A flow composes several invocations into a DAG by dependency.",
          "Drafts are editable; a published version and its content digest are immutable. `latest` is a movable alias and is not guaranteed to be the highest version number.",
          "An asset has exactly one editable authority at any moment. A published release can only be deprecated or yanked — never overwritten or physically deleted.",
        ],
        note: "By default an ordinary user only describes the task. Preflight reuses a marketplace flow when one fits and generates an auditable task-scoped flow when none does. Users can still author flows, or promote a verified generated snapshot into a marketplace draft.",
      },
      {
        rail: "04",
        name: "Sandbox",
        role: "The isolated runtime boundary of one task",
        constraints: [
          "A task executes in its bound isolated environment. The supervisor owns DAG state and scheduling within that runtime.",
          "The control plane manages task lifecycle, authorisation, runtime bindings and delivery references. The runner advances execution nodes.",
          "A lost environment can be restored for the same task from a validated Ready runtime snapshot. Restore rechecks authorisation and configuration and records a new runtime generation.",
        ],
      },
      {
        rail: "05",
        name: "Attempt",
        role: "One immutable execution of a work node",
        constraints: [
          "Every work node is its own agent session, and every attempt uses its own Git worktree rather than editing a shared workspace.",
          "Execution-level retry handles gateway timeouts, process crashes and command timeouts. Semantic rework handles upstream artefacts a downstream node has proven defective. The two are counted separately.",
          "Rework always creates a new session, a new attempt and a new artefact version. A failure record is appended to history, never rewritten.",
        ],
        note: "A successful attempt freezes its own Git revision under a dedicated ref, so code remains listable and readable after the worktree is released.",
      },
      {
        rail: "06",
        name: "Artefact and Unit Gate",
        role: "The deterministic handoff between work nodes",
        constraints: [
          "Completion is deterministic: every declared artefact exists, the manifest is present and enumerable, the result summary has valid content, and every unit gate passes.",
          "Artefact identity combines the work node, output name, attempt and content digest. A downstream node cannot modify an upstream version.",
          "Deterministic build, test, lint and scan steps run as shell commands declared on the work node, judged by exit code.",
        ],
      },
      {
        rail: "07",
        name: "Knowledge and Memory",
        role: "Two independent authorities for long-lived cognition",
        constraints: [
          "Knowledge is formal cognition that is synthesised, reusable and sourced within an explicit scope. It splits into repository knowledge and project knowledge.",
          "Memory is the ongoing mechanism that captures, consolidates, recalls and forgets cognition. It is subject-centred, and layered into working, semantic and resident memory.",
          "They are separate authorities. Memory does not enter the knowledge retrieval plane, tasks consume only the snapshot frozen at creation, and an agent cannot write long-term memory directly.",
        ],
        note: "Content entering long-term knowledge must be traceable, reviewable and explicitly sourced. A complete session is never promoted to knowledge automatically.",
      },
    ],
    lifecycleRail: "Lifecycle",
    lifecycleHeading: "The full path from intent to delivery",
    lifecycleLede:
      "These steps are carried by explicit persisted state and checkpoints in the implementation, not by a process description.",
    lifecycle: [
      {
        step: "Create",
        detail:
          "The task record is persisted and an identifier returned first, then the task enters a visible preflight stage. No sandbox resource exists yet.",
      },
      {
        step: "Preflight",
        detail:
          "The plan is re-authorised against the current user and scope. Repository, branch, dependency graph, schema, compatibility, budget and risk are checked deterministically, and an immutable specification is frozen.",
      },
      {
        step: "Provision",
        detail:
          "Only a successful preflight creates a sandbox: repository clone, requirement materialisation, runtime preparation and agent start-up, in order. Failure keeps structured findings and a repair entry point.",
      },
      {
        step: "Execute",
        detail:
          "The supervisor keeps selecting work nodes whose dependencies are satisfied, runs them in parallel under quota, and handles waiting, failure, rework, cancellation and completion.",
      },
      {
        step: "Hand off",
        detail:
          "A successful attempt freezes its declared artefacts and digests under contract. Downstream nodes read the frozen version, never temporary files in the runtime directory.",
      },
      {
        step: "Deliver",
        detail:
          "The delivery work node pushes a checkpoint branch and idempotently creates or resolves a merge request in a controlled completion step. The credentials it uses are invisible to the agent session.",
      },
      {
        step: "Consolidate",
        detail:
          "After the task ends, a knowledge delta is produced from inputs, artefacts, code changes, verification results and authorised interactions, and the knowledge service synthesises it into reviewable formal cognition.",
      },
    ],
  },
  architecture: {
    title: "Architecture",
    description:
      "Component layering, state authority and key architectural decisions in SkyMythos: control plane, agent runner, sandbox providers, gateway, console and persistence boundaries.",
    lede: "The platform is built from independent components, each with a defined responsibility and a defined authority over state. The important thing is not memorising component names — it is knowing which layer is authoritative for which kind of fact.",
    layersRail: "Layers",
    layersHeading: "Components and responsibilities",
    layers: [
      {
        name: "Control Plane",
        responsibility:
          "Carries product use cases and the governance boundary: identity, scope, version authority for flows and capabilities, task provisioning and dispatch, knowledge governance, audit and transport adaptation.",
        authority: "Authoritative for structured business state, in PostgreSQL.",
      },
      {
        name: "Agent Runner",
        responsibility:
          "Advances nodes and attempts within a granted execution generation, runs native agent sessions and events, and handles dependencies, bounded concurrency, cancellation and completion.",
        authority: "Authoritative for the DAG, attempts, session references and runtime events.",
      },
      {
        name: "Sandbox Provider",
        responsibility:
          "Owns creation, observation, binding and cleanup of runtime environments. Three implementations ship independently behind one protocol.",
        authority:
          "Authoritative for environment lifecycle. A ready environment does not mean the work succeeded.",
      },
      {
        name: "Sandbox Gateway",
        responsibility:
          "Unifies web and WebSocket access, in-page terminals, and the runner's remote procedure entry.",
        authority: "Transport adaptation only; it holds no business state authority.",
      },
      {
        name: "Console",
        responsibility:
          "Composes product APIs and controlled interaction into a role-aware desktop workbench.",
        authority:
          "Holds no second authority over execution or authorisation; it presents control-plane facts.",
      },
      {
        name: "Contracts and Libraries",
        responsibility:
          "Cross-component protocols and semantic contracts, plus independently reusable foundational capability.",
        authority:
          "Components never import each other's internals — only explicit contracts.",
      },
    ],
    decisionsRail: "Decisions",
    decisionsHeading: "Why it is built this way",
    decisionsLede:
      "These trade-offs define the platform's shape. They were not chosen for implementation convenience — each one refuses a specific kind of complexity.",
    decisions: [
      {
        title: "Scheduling and state share one failure domain",
        decision:
          "DAG state, sessions, artefacts and Git worktrees all live inside the task's own sandbox. The supervisor in that sandbox is the only scheduling authority, and the control plane keeps no node-level state.",
        consequence:
          "Restoring an available snapshot rechecks authorization, toolchain and artefact configuration, and records a new runtime generation. This is not transparent live migration at an arbitrary moment.",
      },
      {
        title: "Completion is proven by contract, not asserted in prose",
        decision:
          "Each node's success condition is defined by declared artefacts, a manifest file, a result summary and quality gates, all enforced at runtime. An incomplete format or coverage fails the node.",
        consequence:
          "An agent cannot bypass delivery requirements by saying the work is done. Project instructions or model drift cannot override the completion contract.",
      },
      {
        title: "Flows can be generated and still versioned",
        decision:
          "Ordinary users describe the task. The platform prefers reusing a published flow and generates a task-scoped flow only when none fits — both passing the same deterministic compiler and digest verification.",
        consequence:
          "Lowers adoption cost without giving up reproducibility. A generated flow never becomes a team asset automatically; reuse requires explicit promotion.",
      },
      {
        title: "Knowledge needs both governance and an execution surface",
        decision:
          "Users maintain and review knowledge, while agents query the latest effective content at runtime through a read-only interface that rechecks subject, scope and authorisation on every call.",
        consequence:
          "Storage and a UI without a runtime consumption interface is not a complete knowledge product — and the runtime cannot bypass governance to search directly.",
      },
      {
        title: "Credentials are injected to the smallest possible receiver",
        decision:
          "Member model keys go only to the runner, local extension credentials only to their sidecar, remote extension credentials only to the proxy. The task secret is deleted once components are ready.",
        consequence:
          "The main agent process never holds extension credentials, and secrets never enter images, repositories, specifications, logs or events.",
      },
      {
        title: "Enterprise edition assumes pure private deployment",
        decision:
          "The control plane, sandboxes, model access, artefacts and telemetry all run standalone inside the customer environment, depending on no externally hosted service.",
        consequence:
          "Every state authority must be deployable inside the customer's network. This rules out designs that place a managed service on the critical path.",
      },
    ],
    persistenceRail: "Authority",
    persistenceHeading: "Which fact is stored where",
    persistenceBody:
      "Structured business state lives in the control plane's relational database. The runner atomically stores execution generations, events and recovery receipts in a local transactional journal. Source-of-truth facts live in Git. Large objects — runtime snapshots, frozen requirements and capability bundles — enter object storage under their own contracts. Knowledge bodies and indexes are held by a separate retrieval data plane, and personal memory uses its own database and account with no foreign keys or shared transactions against the control-plane database. Execution generation, environment generation and writer epoch are independent: cancellation acceptance, process exit, durable terminal state and business success are distinct facts, and a side effect lacking exit evidence stays unknown rather than being automatically replayed.",
  },
  docs: {
    title: "Documentation",
    description:
      "The complete SkyMythos manual: deployment and first sign-in, core concepts, task operation, failure recovery, platform operations and a domain glossary.",
    lede: "The manual follows the order you would actually work in. If you just want a first task running, start with getting started. If you want to understand why the platform is designed this way, start with the concepts.",
    sidebarLabel: "Manual contents",
    onThisPage: "On this page",
    previous: "Previous",
    next: "Next",
    backToIndex: "Back to contents",
    readTime: "About",
    minutes: "min read",
    empty: "This section has no content yet.",
    searchHint: "Browse every section from the contents list.",
  },
  footer: {
    tagline: "Autonomous software R&D, deployed inside your own environment.",
    productHeading: "Product",
    resourceHeading: "Resources",
    companyHeading: "About",
    productLinks: [
      { label: "Product overview", href: "/" },
      { label: "Concepts", href: "/concept" },
      { label: "Architecture", href: "/architecture" },
      { label: "Documentation", href: "/docs" },
    ],
    resourceLinks: [
      { label: "Getting started", href: "/docs/getting-started/overview" },
      { label: "Glossary", href: "/docs/reference/glossary" },
      { label: "FAQ", href: "/docs/reference/faq" },
      { label: "Platform operations", href: "/docs/operations/roles" },
    ],
    companyLinks: [
      { label: "Source repository", href: "https://github.com/SkyMythos-ai/fusion-harness" },
      { label: "Deployment guide", href: "/docs/getting-started/deployment" },
      { label: "Security and governance", href: "/architecture" },
    ],
    rights: "All rights reserved.",
    builtWith: "Statically exported, deployed to GitHub Pages.",
  },
  notFound: {
    title: "Page not found",
    body: "Nothing lives at this address. The link may have moved, or the path may be mistyped.",
    cta: "Back to home",
  },
};

const dictionaries: Record<Locale, Dictionary> = { zh, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
