import {
  ArrowDown,
  BookOpen,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  Lock,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import styles from "./diagrams.module.css";

type DiagramProps = {
  locale: Locale;
};

type StepItem = {
  code: string;
  title: string;
  desc: string;
  tags: string[];
  tone?: "accent" | "positive";
};

export function HarnessClosedLoopDiagram({ locale }: DiagramProps) {
  const zh = locale === "zh";
  const steps: StepItem[] = zh
    ? [
        {
          code: "01 / 意图与上下文",
          title: "目标与冻结输入",
          desc: "定义验收条件，绑定工作区资料、代码仓库、数字员工职责与当前授权。",
          tags: ["Goal", "Knowledge", "Credentials"],
        },
        {
          code: "02 / 受控执行",
          title: "隔离环境推进",
          desc: "在项目工作目录或隔离 Sandbox 中运行任务，按节点与工具权限边界执行。",
          tags: ["SkyBot", "Task Sandbox", "Tools"],
          tone: "accent",
        },
        {
          code: "03 / 交付证据",
          title: "产物与门禁检查",
          desc: "输出可检查的代码变更、文档产物、工具记录与确定性测试门禁结果。",
          tags: ["Artifact", "Diff", "Unit Gate"],
        },
        {
          code: "04 / 人工把关",
          title: "审阅与业务验收",
          desc: "由责任人核对来源原文与改动范围，显式决定接受、定向返工或合并上线。",
          tags: ["Human Review", "Approval"],
          tone: "positive",
        },
        {
          code: "05 / 组织复利",
          title: "沉淀至企业能力",
          desc: "经审阅的经验整理为数字员工方法，经核实的结论发布进团队知识库。",
          tags: ["AI Employee", "Knowledge Release"],
        },
      ]
    : [
        {
          code: "01 / Intent & Context",
          title: "Goal & Frozen Inputs",
          desc: "Define acceptance criteria and bind authorized materials, repositories, and employee roles.",
          tags: ["Goal", "Knowledge", "Credentials"],
        },
        {
          code: "02 / Controlled Run",
          title: "Isolated Execution",
          desc: "Advance work inside a project directory or isolated Sandbox under explicit tool policies.",
          tags: ["SkyBot", "Task Sandbox", "Tools"],
          tone: "accent",
        },
        {
          code: "03 / Delivery Evidence",
          title: "Artifacts & Checks",
          desc: "Produce inspectable code diffs, deliverable files, tool logs, and deterministic Unit Gate checks.",
          tags: ["Artifact", "Diff", "Unit Gate"],
        },
        {
          code: "04 / Human Gate",
          title: "Review & Acceptance",
          desc: "Accountable owners verify cited sources and diffs, then explicitly approve, rework, or merge.",
          tags: ["Human Review", "Approval"],
          tone: "positive",
        },
        {
          code: "05 / Enterprise Compound",
          title: "Reusable Capabilities",
          desc: "Curate reviewed methods into AI employee proposals and publish verified facts to Knowledge.",
          tags: ["AI Employee", "Knowledge Release"],
        },
      ];

  return (
    <figure className={styles.diagram}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {zh ? "WHITEPAPER · VALUE CLOSED LOOP" : "WHITEPAPER · VALUE CLOSED LOOP"}
          </p>
          <p className={styles.title}>
            {zh
              ? "SkyMythos AI-Native Harness 价值闭环"
              : "SkyMythos AI-Native Harness Value Closed Loop"}
          </p>
          <p className={styles.subtitle}>
            {zh
              ? "从目标定义、受控执行、证据交付到人工验收与企业能力沉淀的完整工作链路。"
              : "End-to-end loop from goal specification and governed execution to human acceptance and capability retention."}
          </p>
        </div>
      </div>

      <div className={styles.flowRow}>
        {steps.map((step) => (
          <div
            key={step.code}
            className={`${styles.stepCard} ${
              step.tone === "accent"
                ? styles.stepCardAccent
                : step.tone === "positive"
                  ? styles.stepCardPositive
                  : ""
            }`}
          >
            <span
              className={`${styles.stepBadge} ${
                step.tone === "positive" ? styles.stepBadgePositive : ""
              }`}
            >
              {step.tone === "positive" ? (
                <CheckCircle2 size={13} aria-hidden="true" />
              ) : (
                <Workflow size={13} aria-hidden="true" />
              )}
              {step.code}
            </span>
            <p className={styles.stepTitle}>{step.title}</p>
            <p className={styles.stepDesc}>{step.desc}</p>
            <div className={styles.stepTags}>
              {step.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.loopBar}>
        <RefreshCw size={15} className={styles.loopIcon} aria-hidden="true" />
        <span>
          {zh
            ? "闭环原则：完成执行不等于业务验收；只有经过人确认的经验与知识，才会进入下一次工作的受控上下文。"
            : "Loop principle: Execution completion is distinct from business acceptance. Only human-reviewed experience and published knowledge enter future runs."}
        </span>
      </div>
    </figure>
  );
}

export function DomainModelDiagram({ locale }: DiagramProps) {
  const zh = locale === "zh";
  const layers = zh
    ? [
        {
          title: "1. 组织与访问边界（Governance Scope）",
          meta: "单一部署边界",
          icon: ShieldCheck,
          highlighted: false,
          cols: "nodeGrid3" as const,
          nodes: [
            {
              title: "Organization",
              desc: "部署级唯一企业边界，集中管理认证、全局模型网关与企业 IM/Git 连接目录。",
            },
            {
              title: "Workspace",
              desc: "承载团队成员授权、项目、任务、知识库与共享资产的逻辑协作空间（含唯一 Public Workspace）。",
            },
            {
              title: "User & IdentityLink",
              desc: "稳定人类账号与外部企业身份绑定；成员权限受角色约束，禁用与删除遵循独立生命周期。",
            },
          ],
        },
        {
          title: "2. 四大工作入口（Execution Surfaces）",
          meta: "面向不同工作形态",
          icon: Layers,
          highlighted: true,
          cols: "nodeGrid4" as const,
          nodes: [
            {
              title: "SkyBot & Turn",
              desc: "即时交互或按 Turn 异步推进工作，适合探索、分析与快速协同。",
            },
            {
              title: "Project",
              desc: "长期目标容器，共享工作目录与带来源的项目记忆，可关联多个代码库。",
            },
            {
              title: "Task & TaskSpec",
              desc: "冻结需求、仓库、基线与能力版本的研发交付实例，在独立沙箱运行。",
            },
            {
              title: "Automation & Run",
              desc: "面向重复工作的流程定义与触发规则，每次实际执行生成独立 Run 记录。",
            },
          ],
        },
        {
          title: "3. 可复用能力资产（Reusable Assets）",
          meta: "版本化与可见性治理",
          icon: Bot,
          highlighted: false,
          cols: "nodeGrid4" as const,
          nodes: [
            {
              title: "AI Employee",
              desc: "承载职责指令、基础模型与扩展能力的数字员工定义，通过待确认提案持续演进。",
            },
            {
              title: "Knowledge & Memory",
              desc: "Knowledge 保存带版本号的权威文档；Memory 仅在审阅后沉淀提炼线索。",
            },
            {
              title: "Flow & WorkNode",
              desc: "可编排的研发 DAG 模板与可复用执行节点，支持声明输入输出与检查门禁。",
            },
            {
              title: "Skill & MCP",
              desc: "封装领域方法与外部协议工具，在任务启动时通过 CapabilityLock 锁定摘要。",
            },
          ],
        },
        {
          title: "4. 运行环境与凭据底座（Runtime & Credentials）",
          meta: "隔离执行与最小授权",
          icon: Cpu,
          highlighted: false,
          cols: "nodeGrid3" as const,
          nodes: [
            {
              title: "Personal Dev Environment",
              desc: "单用户唯一持久开发机，绑定独立 PVC 存储与平台托管开发服务。",
            },
            {
              title: "Task Sandbox",
              desc: "一任务一隔离容器（K8s Agent Sandbox / 标准 E2B 沙箱池），承载 Runner 与执行现场。",
            },
            {
              title: "Gateway & User Credentials",
              desc: "平台服务目录与个人消费凭据严格分离，共享资产不越权暴露创建者密钥。",
            },
          ],
        },
      ]
    : [
        {
          title: "1. Governance Scope",
          meta: "Deployment & tenant boundary",
          icon: ShieldCheck,
          highlighted: false,
          cols: "nodeGrid3" as const,
          nodes: [
            {
              title: "Organization",
              desc: "Single deployment-wide enterprise boundary managing auth, model gateways, and connector catalogs.",
            },
            {
              title: "Workspace",
              desc: "Logical collaboration boundary for membership, projects, tasks, knowledge bases, and shared assets.",
            },
            {
              title: "User & IdentityLink",
              desc: "Stable human identity linked to enterprise SSO; governed by explicit role-based access control.",
            },
          ],
        },
        {
          title: "2. Execution Surfaces",
          meta: "Choose by work pattern",
          icon: Layers,
          highlighted: true,
          cols: "nodeGrid4" as const,
          nodes: [
            {
              title: "SkyBot & Turn",
              desc: "Interactive conversations and async Turns for rapid analysis and ad-hoc collaboration.",
            },
            {
              title: "Project",
              desc: "Long-lived workspace organizing shared directories, repositories, and sourced project memory.",
            },
            {
              title: "Task & TaskSpec",
              desc: "Frozen engineering delivery instance executing against a repository, branch, and Flow.",
            },
            {
              title: "Automation & Run",
              desc: "Repeatable workflow definitions triggered by schedule, webhook, or connector events.",
            },
          ],
        },
        {
          title: "3. Reusable Capabilities",
          meta: "Versioned & governed assets",
          icon: Bot,
          highlighted: false,
          cols: "nodeGrid4" as const,
          nodes: [
            {
              title: "AI Employee",
              desc: "Reusable role configuration combining prompts, models, skills, and reviewable improvement proposals.",
            },
            {
              title: "Knowledge & Memory",
              desc: "Published versioned Knowledge for authoritative docs; distilled Memory kept strictly distinct.",
            },
            {
              title: "Flow & WorkNode",
              desc: "Composable engineering DAG templates and reusable stage definitions with deterministic gates.",
            },
            {
              title: "Skill & MCP",
              desc: "Packaged domain methods and tool servers pinned via CapabilityLock at task creation.",
            },
          ],
        },
        {
          title: "4. Runtime & Credentials",
          meta: "Isolation & least privilege",
          icon: Cpu,
          highlighted: false,
          cols: "nodeGrid3" as const,
          nodes: [
            {
              title: "Personal Dev Environment",
              desc: "One persistent developer machine per user backed by a dedicated Kubernetes PVC.",
            },
            {
              title: "Task Sandbox",
              desc: "Per-task isolated container (K8s Agent Sandbox or E2B pool) running the DAG supervisor.",
            },
            {
              title: "Gateway & User Credentials",
              desc: "Platform gateway endpoints remain separate from each user's private model and Git tokens.",
            },
          ],
        },
      ];

  return (
    <figure className={styles.diagram}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {zh ? "DOMAIN MODEL · FOUR-LAYER ARCHITECTURE" : "DOMAIN MODEL · FOUR-LAYER ARCHITECTURE"}
          </p>
          <p className={styles.title}>
            {zh
              ? "SkyMythos 四层核心领域对象关系"
              : "SkyMythos Four-Layer Domain Object Model"}
          </p>
        </div>
      </div>

      <div className={styles.layerStack}>
        {layers.map((layer) => {
          const Icon = layer.icon;
          return (
            <div
              key={layer.title}
              className={`${styles.layer} ${layer.highlighted ? styles.layerHighlighted : ""}`}
            >
              <div className={styles.layerHeader}>
                <div className={styles.layerTitleGroup}>
                  <Icon size={16} className={styles.layerIcon} aria-hidden="true" />
                  <p className={styles.layerTitle}>{layer.title}</p>
                </div>
                <span className={styles.layerMeta}>{layer.meta}</span>
              </div>
              <div className={styles[layer.cols]}>
                {layer.nodes.map((node) => (
                  <div key={node.title} className={styles.nodeBox}>
                    <p className={styles.nodeTitle}>{node.title}</p>
                    <p className={styles.nodeDesc}>{node.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

export function SystemArchitectureDiagram({ locale }: DiagramProps) {
  const zh = locale === "zh";
  return (
    <figure className={styles.diagram}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {zh ? "TECHNICAL ARCHITECTURE · CONTROL & DATA PLANES" : "TECHNICAL ARCHITECTURE · CONTROL & DATA PLANES"}
          </p>
          <p className={styles.title}>
            {zh
              ? "控制面、隔离执行面与数据底座分工"
              : "Control Plane, Isolated Execution, and Data Plane Separation"}
          </p>
        </div>
      </div>

      <div className={styles.layerStack}>
        <div className={styles.layer}>
          <div className={styles.layerHeader}>
            <div className={styles.layerTitleGroup}>
              <Layers size={16} className={styles.layerIcon} aria-hidden="true" />
              <p className={styles.layerTitle}>
                {zh ? "交互展示层（Console & Platform Assistant）" : "Presentation Layer (Console & Platform Assistant)"}
              </p>
            </div>
            <span className={styles.layerMeta}>React Web Console · OAuth / Local Auth</span>
          </div>
          <div className={styles.nodeGrid3}>
            <div className={styles.nodeBox}>
              <p className={styles.nodeTitle}>{zh ? "日常工作台" : "Work Surfaces"}</p>
              <p className={styles.nodeDesc}>
                {zh
                  ? "SkyBot、Projects、Tasks、Automations、知识库与开发机终端。"
                  : "SkyBot, Projects, Tasks, Automations, Knowledge, and Web Terminal."}
              </p>
            </div>
            <div className={styles.nodeBox}>
              <p className={styles.nodeTitle}>{zh ? "全局平台助手" : "Platform Assistant"}</p>
              <p className={styles.nodeDesc}>
                {zh
                  ? "解释产品、查询状态、生成 Flow/WorkNode 可审阅变更建议（AI Change Set）。"
                  : "Explains features, inspects status, and proposes reviewable AI Change Sets."}
              </p>
            </div>
            <div className={styles.nodeBox}>
              <p className={styles.nodeTitle}>{zh ? "治理与配置中心" : "Admin & Governance"}</p>
              <p className={styles.nodeDesc}>
                {zh
                  ? "成员权限、团队配额、模型网关、连接器目录与运行实例视图。"
                  : "Membership, quotas, AI gateways, connector catalog, and runtime monitors."}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.connectorRow}>
          <ArrowDown size={14} aria-hidden="true" />
          <span>
            {zh
              ? "鉴权校验 · 解析冻结版本（TaskSpec / CapabilityLock）· 策略准入"
              : "AuthZ checks · Version resolution (TaskSpec / CapabilityLock) · Policy admission"}
          </span>
        </div>

        <div className={`${styles.layer} ${styles.layerHighlighted}`}>
          <div className={styles.layerHeader}>
            <div className={styles.layerTitleGroup}>
              <Lock size={16} className={styles.layerIcon} aria-hidden="true" />
              <p className={styles.layerTitle}>
                {zh ? "控制面（Control Plane）" : "Control Plane"}
              </p>
            </div>
            <span className={styles.layerMeta}>Go · Policy & Orchestration Authority</span>
          </div>
          <div className={styles.nodeGrid4}>
            <div className={styles.nodeBox}>
              <p className={styles.nodeTitle}>{zh ? "身份与工作区策略" : "Identity & Access"}</p>
              <p className={styles.nodeDesc}>
                {zh ? "校验 Org/Workspace 角色与个人凭据作用域。" : "Enforces Org/Workspace roles and credential scopes."}
              </p>
            </div>
            <div className={styles.nodeBox}>
              <p className={styles.nodeTitle}>{zh ? "资产版本与锁定" : "Version Resolution"}</p>
              <p className={styles.nodeDesc}>
                {zh ? "固化 Flow、WorkNode、Skill 与 MCP 精确摘要。" : "Pins Flow, WorkNode, Skill, and MCP digests."}
              </p>
            </div>
            <div className={styles.nodeBox}>
              <p className={styles.nodeTitle}>{zh ? "沙箱生命周期调度" : "Sandbox Scheduling"}</p>
              <p className={styles.nodeDesc}>
                {zh ? "调度 K8s Agent Sandbox 或标准 E2B 沙箱池。" : "Provisions K8s Agent Sandboxes or E2B pools."}
              </p>
            </div>
            <div className={styles.nodeBox}>
              <p className={styles.nodeTitle}>{zh ? "知识授权裁决" : "Knowledge AuthZ"}</p>
              <p className={styles.nodeDesc}>
                {zh ? "每次召回实时校验成员、工作区与授权范围。" : "Evaluates subject, workspace, and grant on every recall."}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.branchPair}>
          <div className={styles.layer}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitleGroup}>
                <Cpu size={16} className={styles.layerIcon} aria-hidden="true" />
                <p className={styles.layerTitle}>
                  {zh ? "隔离执行面（Sandbox & Runner）" : "Execution Plane (Sandbox & Runner)"}
                </p>
              </div>
            </div>
            <div className={styles.nodeGrid2}>
              <div className={styles.nodeBox}>
                <p className={styles.nodeTitle}>Supervisor & DAG</p>
                <p className={styles.nodeDesc}>
                  {zh
                    ? "在容器内调度阶段、管理 Attempt 与 SQLite 执行日志。"
                    : "Drives stage DAG, Attempts, and local SQLite execution journal."}
                </p>
              </div>
              <div className={styles.nodeBox}>
                <p className={styles.nodeTitle}>NetworkPolicy & Runtime</p>
                <p className={styles.nodeDesc}>
                  {zh
                    ? "默认 OCI 运行时或已验证 gVisor，按集群策略隔离网络出口。"
                    : "Default OCI or verified gVisor runtime with NetworkPolicy egress rules."}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.layer}>
            <div className={styles.layerHeader}>
              <div className={styles.layerTitleGroup}>
                <Database size={16} className={styles.layerIcon} aria-hidden="true" />
                <p className={styles.layerTitle}>
                  {zh ? "存储、知识与观测底座" : "Storage, Knowledge & Telemetry"}
                </p>
              </div>
            </div>
            <div className={styles.nodeGrid2}>
              <div className={styles.nodeBox}>
                <p className={styles.nodeTitle}>PostgreSQL & LightRAG</p>
                <p className={styles.nodeDesc}>
                  {zh
                    ? "PG 保存权威业务状态；LightRAG + Embedding 承担文档解析检索。"
                    : "PostgreSQL stores domain truth; LightRAG handles indexing and retrieval."}
                </p>
              </div>
              <div className={styles.nodeBox}>
                <p className={styles.nodeTitle}>Git · S3 · OTel / GreptimeDB</p>
                <p className={styles.nodeDesc}>
                  {zh
                    ? "代码事实、大对象产物与端到端链路用量证据分别持久保存。"
                    : "Persists Git refs, large artifacts, and OpenTelemetry trace/cost data."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.caption}>
        {zh
          ? "说明：外部模型网关（LLM / Embedding）、企业代码托管（GitHub / GitLab）与 IM 连接器通过受控出口配置接入，所有外部数据流均可在企业接入前逐项核验。"
          : "Note: External model gateways, Git providers, and IM connectors attach via explicit egress configuration and can be audited individually prior to onboarding."}
      </p>
    </figure>
  );
}

export function KnowledgeLifecycleDiagram({ locale }: DiagramProps) {
  const zh = locale === "zh";
  const steps: StepItem[] = zh
    ? [
        {
          code: "01 / 资料接入",
          title: "多源录入与起草",
          desc: "支持在线新建、上传文本/PDF/图片，或按明确 URL 单篇拉取飞书/Lark 文档。",
          tags: ["Draft", "Upload", "Lark Sync"],
        },
        {
          code: "02 / 显式发布",
          title: "单篇版本发布",
          desc: "保存草稿后显式“发布新版本”，保留历史版本身份，避免未校对草稿进入检索。",
          tags: ["Release", "Versioned"],
          tone: "accent",
        },
        {
          code: "03 / 异步索引",
          title: "解析与向量化",
          desc: "经独立 Embedding Gateway 与 LightRAG 解析切分，实时反馈处理中/可检索/失败状态。",
          tags: ["Embedding", "LightRAG"],
        },
        {
          code: "04 / 授权召回",
          title: "实时权限过滤",
          desc: "检索时校验调用者与工作区授权，输出匹配片段并支持一键回跳同一版本原文。",
          tags: ["AuthZ Check", "Citation"],
          tone: "positive",
        },
        {
          code: "05 / 边界隔离",
          title: "区分长期知识与记忆",
          desc: "运行提炼的 Memory 需经人工审阅确认，不将原始聊天流水账直接当作权威知识。",
          tags: ["Memory Candidate", "Audit"],
        },
      ]
    : [
        {
          code: "01 / Ingestion",
          title: "Create or Import",
          desc: "Author drafts inline, upload text/PDF/images, or import specific Lark/Feishu Docx URLs.",
          tags: ["Draft", "Upload", "Lark Sync"],
        },
        {
          code: "02 / Publication",
          title: "Per-Doc Release",
          desc: "Explicitly publish saved drafts into immutable versions so unreviewed edits stay isolated.",
          tags: ["Release", "Versioned"],
          tone: "accent",
        },
        {
          code: "03 / Indexing",
          title: "Parse & Embed",
          desc: "Dedicated Embedding Gateway and LightRAG index published revisions with clear status states.",
          tags: ["Embedding", "LightRAG"],
        },
        {
          code: "04 / Recall",
          title: "Authorized Retrieval",
          desc: "Queries re-check permissions on every call and link each hit back to its exact source version.",
          tags: ["AuthZ Check", "Citation"],
          tone: "positive",
        },
        {
          code: "05 / Governance",
          title: "Knowledge vs Memory",
          desc: "Distilled Memory candidates remain separate from authoritative Knowledge until human review.",
          tags: ["Memory Candidate", "Audit"],
        },
      ];

  return (
    <figure className={styles.diagram}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {zh ? "KNOWLEDGE PIPELINE · SOURCE TO CITATION" : "KNOWLEDGE PIPELINE · SOURCE TO CITATION"}
          </p>
          <p className={styles.title}>
            {zh
              ? "企业知识发布、授权召回与记忆边界"
              : "Enterprise Knowledge Publishing, Authorized Recall & Memory Boundaries"}
          </p>
        </div>
      </div>

      <div className={styles.flowRow}>
        {steps.map((step) => (
          <div
            key={step.code}
            className={`${styles.stepCard} ${
              step.tone === "accent"
                ? styles.stepCardAccent
                : step.tone === "positive"
                  ? styles.stepCardPositive
                  : ""
            }`}
          >
            <span
              className={`${styles.stepBadge} ${
                step.tone === "positive" ? styles.stepBadgePositive : ""
              }`}
            >
              <BookOpen size={13} aria-hidden="true" />
              {step.code}
            </span>
            <p className={styles.stepTitle}>{step.title}</p>
            <p className={styles.stepDesc}>{step.desc}</p>
            <div className={styles.stepTags}>
              {step.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function EngineeringFlowDiagram({ locale }: DiagramProps) {
  const zh = locale === "zh";
  const steps: StepItem[] = zh
    ? [
        {
          code: "STAGE 01 · 冻结规格",
          title: "TaskSpec 固化输入",
          desc: "绑定需求正文、Repository、Base branch、Flow 版本与 CapabilityLock 能力摘要。",
          tags: ["TaskSpec", "CapabilityLock"],
        },
        {
          code: "STAGE 02 · 上游分析",
          title: "理解与设计 WorkNode",
          desc: "在隔离 Sandbox 内拉取代码、召回授权知识，产出结构化分析计划与前置产物。",
          tags: ["Understand", "Knowledge Recall"],
          tone: "accent",
        },
        {
          code: "STAGE 03 · 并行实施",
          title: "编码与审查 WorkNode",
          desc: "通过具名输入绑定消费上游产物，独立 Agent Session 完成代码改动或并行审查。",
          tags: ["Code Change", "Review"],
          tone: "accent",
        },
        {
          code: "STAGE 04 · 门禁交接",
          title: "Unit Gate 与定向返工",
          desc: "校验 artifacts.json、result.md 与确定性测试门禁；失败时通过 Fusion Resume 定向重跑。",
          tags: ["Unit Gate", "Fusion Resume"],
        },
        {
          code: "STAGE 05 · 交付验收",
          title: "代码变更与人工合并",
          desc: "交付完整 Git Diff、验证证据与 MR 摘要，由研发负责人审查后决定合并与发布。",
          tags: ["Git Diff", "Human Merge"],
          tone: "positive",
        },
      ]
    : [
        {
          code: "STAGE 01 · Freeze",
          title: "TaskSpec & Lock",
          desc: "Freezes requirements, Repository, Base branch, Flow revision, and CapabilityLock digests.",
          tags: ["TaskSpec", "CapabilityLock"],
        },
        {
          code: "STAGE 02 · Plan",
          title: "Understand WorkNode",
          desc: "Inspects the repository and recalls authorized Knowledge inside an isolated Sandbox.",
          tags: ["Understand", "Knowledge Recall"],
          tone: "accent",
        },
        {
          code: "STAGE 03 · Build",
          title: "Code & Review Nodes",
          desc: "Consumes upstream bindings in isolated Agent Sessions to implement and review changes.",
          tags: ["Code Change", "Review"],
          tone: "accent",
        },
        {
          code: "STAGE 04 · Gate",
          title: "Unit Gate & Resume",
          desc: "Validates artifacts.json, result.md, and deterministic commands; supports Fusion Resume rework.",
          tags: ["Unit Gate", "Fusion Resume"],
        },
        {
          code: "STAGE 05 · Deliver",
          title: "Diff & Human Merge",
          desc: "Hands over verified Git diffs, test records, and MR summaries for human code review and merge.",
          tags: ["Git Diff", "Human Merge"],
          tone: "positive",
        },
      ];

  return (
    <figure className={styles.diagram}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {zh ? "ENGINEERING FLOW · TASK TO DELIVERY" : "ENGINEERING FLOW · TASK TO DELIVERY"}
          </p>
          <p className={styles.title}>
            {zh
              ? "研发 Task 与 Flow WorkNode 确定性交付链路"
              : "Engineering Task & Flow WorkNode Deterministic Delivery Pipeline"}
          </p>
        </div>
      </div>

      <div className={styles.flowRow}>
        {steps.map((step) => (
          <div
            key={step.code}
            className={`${styles.stepCard} ${
              step.tone === "accent"
                ? styles.stepCardAccent
                : step.tone === "positive"
                  ? styles.stepCardPositive
                  : ""
            }`}
          >
            <span
              className={`${styles.stepBadge} ${
                step.tone === "positive" ? styles.stepBadgePositive : ""
              }`}
            >
              {step.tone === "positive" ? (
                <GitBranch size={13} aria-hidden="true" />
              ) : (
                <FileCode2 size={13} aria-hidden="true" />
              )}
              {step.code}
            </span>
            <p className={styles.stepTitle}>{step.title}</p>
            <p className={styles.stepDesc}>{step.desc}</p>
            <div className={styles.stepTags}>
              {step.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
