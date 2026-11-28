import type { Locale } from "@/lib/i18n";

export type SuiteIconKey =
  | "bot"
  | "workflow"
  | "users"
  | "book"
  | "zap"
  | "message"
  | "cpu"
  | "shield";

export type SuiteChipItem = {
  id: string;
  label: string;
  icon: SuiteIconKey;
  tag?: string;
};

export type PlanChecklistItem = {
  label: string;
  included: boolean;
  note?: string;
  tip?: string;
};

export type PlanSubGroup = {
  id: "knowledge" | "connectivity" | "governance";
  title: string;
  items: PlanChecklistItem[];
};

export type PricingPlanCard = {
  id: "pilot" | "enterprise";
  name: string;
  badge?: string;
  featured?: boolean;
  priceLabel: string;
  priceUnit: string;
  tagline: string;
  primaryCta: string;
  primaryHref: string;
  secondaryActions: { label: string; href: string }[];
  noticeTitle: string;
  noticeText: string;
  primaryGroupTitle: string;
  primaryItems: PlanChecklistItem[];
  bonusLabel: string;
  bonusGroups: PlanSubGroup[];
};

export type PrivateArchitectureBanner = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type PricingCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  suiteHeading: string;
  suitePrimaryChips: SuiteChipItem[];
  suiteSecondaryChips: SuiteChipItem[];
  plans: PricingPlanCard[];
  privateBanner: PrivateArchitectureBanner;
  footnote: string;
  overview: {
    titleLine1: string;
    titleLine2: string;
    linkLabel: string;
    items: { name: string; basis: string }[];
  };
};

const zhPricing: PricingCopy = {
  eyebrow: "定价与授权",
  title: "私有化部署，按团队席位授权",
  subtitle: "统一管理、私有交付的企业级数字员工与 AI 协作平台，将可核查的智能体能力装进企业自有环境。",
  suiteHeading: "一套席位授权，内置完整企业智能体套件",
  suitePrimaryChips: [
    { id: "skybot", label: "SkyBot 项目协作空间", icon: "bot" },
    { id: "flows", label: "数字员工与研发工作流", icon: "workflow" },
  ],
  suiteSecondaryChips: [
    { id: "roles", label: "8 大岗位方案", icon: "users" },
    { id: "rag", label: "企业知识库 RAG", icon: "book" },
    { id: "auto", label: "事件触发自动化", icon: "zap" },
    { id: "im", label: "多端办公 IM", icon: "message", tag: "多端" },
    { id: "gateway", label: "自有模型网关", icon: "cpu" },
    { id: "sandbox", label: "隔离沙箱与审计", icon: "shield" },
  ],
  plans: [
    {
      id: "pilot",
      name: "场景试点验证",
      priceLabel: "按试点范围评估",
      priceUnit: "1–2 个核心场景先行验证",
      tagline: "面向部门先行验证，在真实业务流中确认交付质量与正式席位规模。",
      primaryCta: "申请场景试点",
      primaryHref: "/poc",
      secondaryActions: [
        { label: "了解安全治理", href: "/security" },
        { label: "部署前置要求", href: "/docs/private-deployment" },
      ],
      noticeTitle: "试点资产平滑继承",
      noticeText: "试点阶段配置的岗位数字员工、工作流与知识库可直接迁入正式生产环境。",
      primaryGroupTitle: "SkyBot 与数字员工核心套件",
      primaryItems: [
        {
          label: "SkyBot 项目空间与多轮独立执行线程",
          included: true,
          tip: "主会话围绕目标组织资料、代码仓与多条隔离执行 Thread。",
        },
        { label: "核心岗位数字员工模板", included: true, note: "试点场景" },
        { label: "自定义数字员工职责指令与记忆召回", included: true },
        {
          label: "阶段化任务与研发工作流 Tasks & Flows",
          included: true,
          tip: "按分析、执行、评审与检查推进，输出可审查的 Artifact 产物。",
        },
        { label: "可审查交付产物与执行检查记录", included: true },
        { label: "手动、定时、Webhook 与事件触发自动化", included: true },
        { label: "关键外发、代码合入与写入人工审批关口", included: true },
        { label: "经负责人确认的团队技能与经验沉淀", included: true },
        {
          label: "企业内部能力市场（跨部门共享 Skill / MCP / Flow）",
          included: false,
          tip: "企业正式部署开放组织级共享能力市场与发布权限治理。",
        },
      ],
      bonusLabel: "内置底座权益",
      bonusGroups: [
        {
          id: "knowledge",
          title: "企业知识库与原文溯源",
          items: [
            { label: "个人、部门空间与组织三级知识库", included: true },
            { label: "文档草稿编辑与多版本发布管理", included: true },
            {
              label: "内置 LightRAG 解析与段落级原文溯源",
              included: true,
              tip: "回答与产出直接锚定命中文档片段与对应发布版本。",
            },
            {
              label: "遵循成员与空间权限的受控知识召回",
              included: true,
              tip: "仅检索当前账号有权限访问的知识库范围，并记录命中引用。",
            },
          ],
        },
        {
          id: "connectivity",
          title: "模型网关与办公系统连接",
          items: [
            {
              label: "对接企业自部署大模型或已批准模型网关",
              included: true,
              tip: "兼容 OpenAI Responses / Chat、Anthropic Messages 与 Embeddings 接口。",
            },
            { label: "飞书 / Lark / 企业微信 / 钉钉 / Slack 协同交互", included: true },
            { label: "Git 代码仓与内部业务 API / MCP 工具连接", included: true },
            {
              label: "平台连接配置与个人授权凭据严格隔离",
              included: true,
              tip: "共享数字员工与流程不会暴露成员个人的 Git 或 OAuth 密钥。",
            },
          ],
        },
        {
          id: "governance",
          title: "私有化底座、沙箱与安全治理",
          items: [
            { label: "私有化环境交付", included: true, note: "独立测试实例" },
            {
              label: "任务级隔离沙箱与持久化个人开发环境",
              included: true,
              tip: "每个执行任务运行在隔离 Sandbox 内，支持 NetworkPolicy 与 Web Terminal。",
            },
            { label: "按工作空间与成员席位统计模型调用与 Token 用量", included: true },
            {
              label: "企业统一身份认证（OIDC / SSO）与跨部门分级权限",
              included: false,
              tip: "企业正式部署支持对接既有 SSO 目录同步与多层级组织权限管控。",
            },
            {
              label: "OpenTelemetry 全链路审计导出、高可用规划与架构师支持",
              included: false,
              tip: "包含运行调用链追踪导出、多副本拓扑评估与专属版本升级保障。",
            },
          ],
        },
      ],
    },
    {
      id: "enterprise",
      name: "企业正式部署",
      badge: "企业标准方案",
      featured: true,
      priceLabel: "按团队席位报价",
      priceUnit: "年度席位授权 · 私有化交付",
      tagline: "面向企业与多部门推广，在自有集群内交付完整安全治理与团队协同能力。",
      primaryCta: "获取席位报价方案",
      primaryHref: "/poc?enquiry=enterprise",
      secondaryActions: [
        { label: "预约架构沟通", href: "/poc?enquiry=enterprise" },
        { label: "私有化部署指南", href: "/docs/private-deployment" },
      ],
      noticeTitle: "三项费用边界清晰",
      noticeText: "年度软件席位许可、私有化环境集成与企业自有大模型调用量三项分列，不捆绑算力溢价。",
      primaryGroupTitle: "SkyBot 与数字员工核心套件",
      primaryItems: [
        {
          label: "SkyBot 项目空间与多轮独立执行线程",
          included: true,
          tip: "主会话围绕目标组织资料、代码仓与多条隔离执行 Thread。",
        },
        { label: "核心岗位数字员工模板", included: true, note: "全部 8 大岗位" },
        { label: "自定义数字员工职责指令与记忆召回", included: true },
        {
          label: "阶段化任务与研发工作流 Tasks & Flows",
          included: true,
          tip: "按分析、执行、评审与检查推进，输出可审查的 Artifact 产物。",
        },
        { label: "可审查交付产物与执行检查记录", included: true },
        { label: "手动、定时、Webhook 与事件触发自动化", included: true },
        { label: "关键外发、代码合入与写入人工审批关口", included: true },
        { label: "经负责人确认的团队技能与经验沉淀", included: true },
        {
          label: "企业内部能力市场（跨部门共享 Skill / MCP / Flow）",
          included: true,
          tip: "团队统一发布、评审与复用经验证的技能、连接器与标准流程。",
        },
      ],
      bonusLabel: "内置底座权益",
      bonusGroups: [
        {
          id: "knowledge",
          title: "企业知识库与原文溯源",
          items: [
            { label: "个人、部门空间与组织三级知识库", included: true },
            { label: "文档草稿编辑与多版本发布管理", included: true },
            {
              label: "内置 LightRAG 解析与段落级原文溯源",
              included: true,
              tip: "回答与产出直接锚定命中文档片段与对应发布版本。",
            },
            {
              label: "遵循成员与空间权限的受控知识召回",
              included: true,
              tip: "仅检索当前账号有权限访问的知识库范围，并记录命中引用。",
            },
          ],
        },
        {
          id: "connectivity",
          title: "模型网关与办公系统连接",
          items: [
            {
              label: "对接企业自部署大模型或已批准模型网关",
              included: true,
              tip: "兼容 OpenAI Responses / Chat、Anthropic Messages 与 Embeddings 接口。",
            },
            { label: "飞书 / Lark / 企业微信 / 钉钉 / Slack 协同交互", included: true },
            { label: "Git 代码仓与内部业务 API / MCP 工具连接", included: true },
            {
              label: "平台连接配置与个人授权凭据严格隔离",
              included: true,
              tip: "共享数字员工与流程不会暴露成员个人的 Git 或 OAuth 密钥。",
            },
          ],
        },
        {
          id: "governance",
          title: "私有化底座、沙箱与安全治理",
          items: [
            { label: "私有化环境交付", included: true, note: "自有集群全栈" },
            {
              label: "任务级隔离沙箱与持久化个人开发环境",
              included: true,
              tip: "每个执行任务运行在隔离 Sandbox 内，支持 NetworkPolicy 与 Web Terminal。",
            },
            { label: "按工作空间与成员席位统计模型调用与 Token 用量", included: true },
            {
              label: "企业统一身份认证（OIDC / SSO）与跨部门分级权限",
              included: true,
              tip: "支持对接企业既有 SSO 身份体系、组织架构映射与分级空间授权。",
            },
            {
              label: "OpenTelemetry 全链路审计导出、高可用规划与架构师支持",
              included: true,
              tip: "包含运行调用链追踪导出、多副本拓扑评估与专属版本升级保障。",
            },
          ],
        },
      ],
    },
  ],
  privateBanner: {
    title: "企业私有化架构与定制集成",
    description:
      "针对内网隔离、既有单点登录对接、多副本高可用容灾及内部 ERP / 工单系统连接需求，由解决方案架构师与贵司技术团队逐项核对交付方案。",
    primaryLabel: "立即咨询架构方案",
    primaryHref: "/poc?enquiry=enterprise",
    secondaryLabel: "查看私有化部署前置清单",
    secondaryHref: "/docs/private-deployment",
  },
  footnote: "软件席位许可、私有化部署集成与大模型算力资源消耗在正式方案中分项列明，便于企业 IT 与采购清晰评估。",
  overview: {
    titleLine1: "私有化部署，",
    titleLine2: "按团队席位授权。",
    linkLabel: "查看完整定价与授权说明",
    items: [
      { name: "场景试点验证", basis: "1–2 个真实岗位场景 · 明确验收标准" },
      { name: "企业正式部署", basis: "自有环境全栈交付 · 按团队席位年度授权" },
      { name: "费用边界清晰", basis: "席位许可 · 部署集成 · 自有模型独立结算" },
    ],
  },
};

const enPricing: PricingCopy = {
  eyebrow: "ENTERPRISE LICENSING",
  title: "Private deployment, licensed by team size.",
  subtitle:
    "Deploy SkyMythos inside your own infrastructure with full control over data residency, models and team access.",
  suiteHeading: "One per-seat license, the complete enterprise AI suite",
  suitePrimaryChips: [
    { id: "skybot", label: "SkyBot Workspace", icon: "bot" },
    { id: "flows", label: "AI Employees & Flows", icon: "workflow" },
  ],
  suiteSecondaryChips: [
    { id: "roles", label: "8 Role Templates", icon: "users" },
    { id: "rag", label: "Knowledge RAG", icon: "book" },
    { id: "auto", label: "Event Automations", icon: "zap" },
    { id: "im", label: "Enterprise IM", icon: "message", tag: "Multi-IM" },
    { id: "gateway", label: "BYO Model Gateway", icon: "cpu" },
    { id: "sandbox", label: "Sandboxes & Audit", icon: "shield" },
  ],
  plans: [
    {
      id: "pilot",
      name: "Scoped Pilot",
      priceLabel: "Scoped Assessment",
      priceUnit: "1–2 priority workflows",
      tagline: "Validate real deliverables with a focused department group before sizing seats.",
      primaryCta: "Request a Pilot",
      primaryHref: "/poc",
      secondaryActions: [
        { label: "Security & Governance", href: "/security" },
        { label: "Deployment Checklist", href: "/docs/private-deployment" },
      ],
      noticeTitle: "Seamless Pilot Carryover",
      noticeText: "AI employees, workflows and knowledge bases configured during your pilot carry directly into production.",
      primaryGroupTitle: "SkyBot & AI Employee Suite",
      primaryItems: [
        {
          label: "SkyBot project spaces & isolated execution threads",
          included: true,
          tip: "Coordinate files, repositories and parallel execution threads around shared goals.",
        },
        { label: "Role-based AI employee templates", included: true, note: "Pilot scope" },
        { label: "Custom role instructions & memory recall", included: true },
        {
          label: "Staged Tasks & Flows with inspectable deliverables",
          included: true,
          tip: "Advance through analysis, implementation, review and verification with check artifacts.",
        },
        { label: "Reviewable artifacts & verification logs", included: true },
        { label: "Manual, scheduled, webhook & connector automations", included: true },
        { label: "Explicit human approval gates for writes & merges", included: true },
        { label: "Owner-confirmed skill & craft curation", included: true },
        {
          label: "Organization-wide Skill, MCP & Flow Marketplace",
          included: false,
          tip: "Enterprise Deployment unlocks organization-wide publishing and reuse governance.",
        },
      ],
      bonusLabel: "Included Platform Capabilities",
      bonusGroups: [
        {
          id: "knowledge",
          title: "Enterprise Knowledge & Citations",
          items: [
            { label: "Personal, workspace & organization knowledge bases", included: true },
            { label: "Draft editing & versioned document publishing", included: true },
            {
              label: "Built-in LightRAG indexing & passage citations",
              included: true,
              tip: "Every retrieved claim links directly back to the exact published passage.",
            },
            {
              label: "Permission-aware retrieval with access logs",
              included: true,
              tip: "Queries respect active workspace permissions and log matched references.",
            },
          ],
        },
        {
          id: "connectivity",
          title: "Models & Enterprise Connectors",
          items: [
            {
              label: "Self-hosted LLMs or approved enterprise gateways",
              included: true,
              tip: "Compatible with OpenAI Responses / Chat, Anthropic Messages and Embeddings APIs.",
            },
            { label: "Lark / Feishu, WeCom, DingTalk & Slack collaboration", included: true },
            { label: "Git repositories & internal API / MCP connectors", included: true },
            {
              label: "Strict isolation of platform config vs. personal auth",
              included: true,
              tip: "Shared AI employees and workflows never expose personal Git or OAuth keys.",
            },
          ],
        },
        {
          id: "governance",
          title: "Private Infrastructure & Governance",
          items: [
            { label: "Private environment delivery", included: true, note: "Isolated pilot" },
            {
              label: "Isolated per-task Sandboxes & persistent dev workspaces",
              included: true,
              tip: "Run tasks inside NetworkPolicy-isolated sandboxes with Web Terminal access.",
            },
            { label: "Workspace & seat-level LLM usage visibility", included: true },
            {
              label: "Enterprise OIDC / SSO & multi-department RBAC",
              included: false,
              tip: "Included in Enterprise Deployment for directory sync and tiered access policies.",
            },
            {
              label: "OpenTelemetry audit exports, HA planning & architect SLA",
              included: false,
              tip: "Full trace exports, multi-replica topology review and dedicated upgrade support.",
            },
          ],
        },
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise Deployment",
      badge: "Enterprise Standard",
      featured: true,
      priceLabel: "Per-Seat Annual",
      priceUnit: "Annual seat tiers · Self-hosted",
      tagline: "Full-stack cluster delivery with enterprise SSO, multi-team governance and support.",
      primaryCta: "Request Seat Quote",
      primaryHref: "/poc?enquiry=enterprise",
      secondaryActions: [
        { label: "Book Architecture Call", href: "/poc?enquiry=enterprise" },
        { label: "Private Deployment Docs", href: "/docs/private-deployment" },
      ],
      noticeTitle: "Transparent Cost Split",
      noticeText: "Annual seat license, private onboarding and self-hosted LLM compute are itemized separately with zero token markup.",
      primaryGroupTitle: "SkyBot & AI Employee Suite",
      primaryItems: [
        {
          label: "SkyBot project spaces & isolated execution threads",
          included: true,
          tip: "Coordinate files, repositories and parallel execution threads around shared goals.",
        },
        { label: "Role-based AI employee templates", included: true, note: "All 8 roles" },
        { label: "Custom role instructions & memory recall", included: true },
        {
          label: "Staged Tasks & Flows with inspectable deliverables",
          included: true,
          tip: "Advance through analysis, implementation, review and verification with check artifacts.",
        },
        { label: "Reviewable artifacts & verification logs", included: true },
        { label: "Manual, scheduled, webhook & connector automations", included: true },
        { label: "Explicit human approval gates for writes & merges", included: true },
        { label: "Owner-confirmed skill & craft curation", included: true },
        {
          label: "Organization-wide Skill, MCP & Flow Marketplace",
          included: true,
          tip: "Publish, review and reuse verified skills, connectors and workflows across departments.",
        },
      ],
      bonusLabel: "Included Platform Capabilities",
      bonusGroups: [
        {
          id: "knowledge",
          title: "Enterprise Knowledge & Citations",
          items: [
            { label: "Personal, workspace & organization knowledge bases", included: true },
            { label: "Draft editing & versioned document publishing", included: true },
            {
              label: "Built-in LightRAG indexing & passage citations",
              included: true,
              tip: "Every retrieved claim links directly back to the exact published passage.",
            },
            {
              label: "Permission-aware retrieval with access logs",
              included: true,
              tip: "Queries respect active workspace permissions and log matched references.",
            },
          ],
        },
        {
          id: "connectivity",
          title: "Models & Enterprise Connectors",
          items: [
            {
              label: "Self-hosted LLMs or approved enterprise gateways",
              included: true,
              tip: "Compatible with OpenAI Responses / Chat, Anthropic Messages and Embeddings APIs.",
            },
            { label: "Lark / Feishu, WeCom, DingTalk & Slack collaboration", included: true },
            { label: "Git repositories & internal API / MCP connectors", included: true },
            {
              label: "Strict isolation of platform config vs. personal auth",
              included: true,
              tip: "Shared AI employees and workflows never expose personal Git or OAuth keys.",
            },
          ],
        },
        {
          id: "governance",
          title: "Private Infrastructure & Governance",
          items: [
            { label: "Private environment delivery", included: true, note: "Full cluster stack" },
            {
              label: "Isolated per-task Sandboxes & persistent dev workspaces",
              included: true,
              tip: "Run tasks inside NetworkPolicy-isolated sandboxes with Web Terminal access.",
            },
            { label: "Workspace & seat-level LLM usage visibility", included: true },
            {
              label: "Enterprise OIDC / SSO & multi-department RBAC",
              included: true,
              tip: "Connect corporate OIDC / SSO providers, directory sync and tiered workspace roles.",
            },
            {
              label: "OpenTelemetry audit exports, HA planning & architect SLA",
              included: true,
              tip: "Full trace exports, multi-replica topology review and dedicated upgrade support.",
            },
          ],
        },
      ],
    },
  ],
  privateBanner: {
    title: "Private Architecture & Custom Integration",
    description:
      "Work directly with our solutions architects to scope air-gapped or VPC networking, OIDC / SSO directory sync, high-availability topology and custom internal system connectors.",
    primaryLabel: "Book Architecture Review",
    primaryHref: "/poc?enquiry=enterprise",
    secondaryLabel: "Private deployment checklist",
    secondaryHref: "/docs/private-deployment",
  },
  footnote:
    "Software seat licensing, private deployment onboarding and model compute remain itemized separately in every enterprise proposal.",
  overview: {
    titleLine1: "Private deployment,",
    titleLine2: "licensed by team size.",
    linkLabel: "Explore licensing & rollout",
    items: [
      { name: "Scoped Pilot", basis: "1–2 real role workflows · Clear acceptance criteria" },
      { name: "Enterprise Deployment", basis: "Self-hosted stack · Annual per-seat license" },
      { name: "Clear Cost Split", basis: "Seat license · Onboarding · Bring your own models" },
    ],
  },
};

export function getPricingCopy(locale: Locale = "en"): PricingCopy {
  return locale === "zh" ? zhPricing : enPricing;
}
