import type { Locale } from "@/lib/i18n";

export type PricingStageCard = {
  id: "pilot" | "enterprise";
  name: string;
  badge?: string;
  tagline: string;
  priceLabel: string;
  billingBasis: string;
  actionLabel: string;
  href: string;
  featured?: boolean;
  features: string[];
};

export type CostBoundaryItem = {
  step: string;
  title: string;
  detail: string;
};

export type RolloutStepItem = {
  step: string;
  title: string;
  detail: string;
};

export type PricingCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stages: PricingStageCard[];
  boundaryHeading: string;
  boundaries: CostBoundaryItem[];
  rolloutHeading: string;
  rolloutSteps: RolloutStepItem[];
  footnote: string;
  setupLinkLabel: string;
  faqHeading: string;
  faqs: { question: string; answer: string }[];
  overview: {
    titleLine1: string;
    titleLine2: string;
    linkLabel: string;
    items: { name: string; basis: string }[];
  };
};

const zhPricing: PricingCopy = {
  eyebrow: "定价与授权 · ENTERPRISE LICENSING",
  title: "私有化部署，按团队席位授权",
  subtitle:
    "全栈软件部署在企业自有环境内，按实际启用的团队席位规模配置年度授权许可，软件、实施与模型费用边界清晰透明。",
  stages: [
    {
      id: "pilot",
      name: "场景试点验证",
      tagline: "围绕 1–2 个高价值岗位场景先行开展小范围验证，以真实交付结果评估正式席位规模。",
      priceLabel: "按试点范围评估",
      billingBasis: "限定试点席位与周期 · 明确验收标准",
      actionLabel: "申请场景试点",
      href: "/poc",
      features: [
        "聚焦核心部门真实高频工作流开展验证",
        "完整开放数字员工、知识溯源与流程协同能力",
        "支持企业测试环境或独立隔离实例快速部署",
        "配套岗位角色模板、知识整理与接入辅导",
        "共同约定人工把关节点与可核查交付清单",
        "试点沉淀的数字员工与知识资产平滑迁入正式环境",
      ],
    },
    {
      id: "enterprise",
      name: "企业正式部署",
      badge: "企业标准方案",
      tagline: "部署在企业自有服务器、Kubernetes 集群或专有云内，按团队席位人数阶梯核定年度许可。",
      priceLabel: "按团队席位报价",
      billingBasis: "年度软件席位许可 + 私有化环境部署支持",
      actionLabel: "获取席位报价方案",
      href: "/poc?enquiry=enterprise",
      featured: true,
      features: [
        "包含全部岗位方案模板与自定义数字员工配置",
        "企业自有集群或专有云全栈私有化交付，数据不出域",
        "对接企业统一身份（SSO / 飞书 / 企微 / Slack）与分级权限",
        "支持接入企业自有大模型或指定模型网关，部门配额可控",
        "任务级隔离沙箱执行与全链路操作审计日志导出",
        "专属架构师部署联调、平滑版本升级与企业技术支持",
      ],
    },
  ],
  boundaryHeading: "清晰拆分三项费用边界",
  boundaries: [
    {
      step: "01",
      title: "年度软件席位许可",
      detail: "按实际启用部门或团队席位人数阶梯核定，包含平台全部核心功能模块与持续版本更新。",
    },
    {
      step: "02",
      title: "私有化部署与系统集成",
      detail: "根据企业自有集群架构、统一身份认证对接及内部业务系统连接范围，单独列明实施支持。",
    },
    {
      step: "03",
      title: "大模型资源独立结算",
      detail: "直接对接企业自有算力模型或已采购模型网关，平台按工作空间与成员透明统计实际调用量。",
    },
  ],
  rolloutHeading: "四步推进企业落地",
  rolloutSteps: [
    {
      step: "01",
      title: "沟通业务场景",
      detail: "梳理优先落地的部门工作流、内部资料类型与安全内控要求。",
    },
    {
      step: "02",
      title: "小范围试点验证",
      detail: "围绕真实任务验证交付质量、来源准确度与团队协作体验。",
    },
    {
      step: "03",
      title: "核定团队席位规模",
      detail: "依据推广部门人数与部署环境确认年度席位方案与实施计划。",
    },
    {
      step: "04",
      title: "私有化正式启用",
      detail: "完成内网集群交付、身份权限联调与核心团队上手培训。",
    },
  ],
  footnote: "软件席位许可、私有化实施与大模型资源消耗在正式方案中分项列明，便于企业IT与采购清晰评估。",
  setupLinkLabel: "查看私有化部署前置清单",
  faqHeading: "授权与部署常见问题",
  faqs: [
    {
      question: "席位数量如何计算？后续跨部门扩充方便吗？",
      answer:
        "席位按在平台内实际拥有账号并使用协作空间的团队成员数核定。企业可从单个核心部门起步，后续按季度或年度阶梯增购席位，已有知识库与数字员工资产可直接按权限共享。",
    },
    {
      question: "正式部署前可以先开展小范围试点吗？",
      answer:
        "可以。我们建议先选取 1–2 个高频且结果易核验的岗位场景开展试点，验证通过后再核定全团队或跨部门正式席位规模。",
    },
    {
      question: "大模型调用费用是否包含在软件席位许可中？",
      answer:
        "不包含，二者独立核算。SkyMythos 对接贵司自部署大模型或已批准的企业模型网关，不绑定特定模型供应商，并提供按部门与成员的用量统计。",
    },
    {
      question: "私有化部署需要企业准备哪些基础环境？",
      answer:
        "标准环境包含 Linux / Kubernetes 集群、关系型数据库、对象存储以及企业批准的模型服务端点。详细硬件与网络前置要求可查阅产品文档中的《私有化部署指南》。",
    },
  ],
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
    "Deploy the complete platform inside your own infrastructure with predictable annual per-seat licensing and clear boundaries across software, onboarding and model spend.",
  stages: [
    {
      id: "pilot",
      name: "Scoped Pilot",
      tagline:
        "Validate 1–2 high-value role workflows with a focused pilot group before sizing your organization-wide rollout.",
      priceLabel: "Scoped Assessment",
      billingBasis: "Defined pilot seats & timeline · Agreed acceptance criteria",
      actionLabel: "Request a Pilot",
      href: "/poc",
      features: [
        "Focused validation on real department workflows",
        "Full access to AI employees, cited knowledge and task flows",
        "Deploy in an isolated pilot instance or staging cluster",
        "Guided role template configuration and knowledge setup",
        "Explicit human sign-off rules and deliverable checklist",
        "Smoothly carry pilot AI employees and knowledge into production",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise Deployment",
      badge: "Standard",
      tagline:
        "Full-stack deployment inside your own cluster or private cloud, licensed annually by active team seats.",
      priceLabel: "Per-Seat Annual Quote",
      billingBasis: "Annual seat tiers + private deployment onboarding",
      actionLabel: "Request Seat Quote",
      href: "/poc?enquiry=enterprise",
      featured: true,
      features: [
        "All role workflow templates plus custom AI employee configuration",
        "Self-hosted on-premises or private cloud cluster delivery",
        "Enterprise SSO, Lark / Feishu / Slack identity and multi-tier RBAC",
        "Connect self-hosted LLMs or approved enterprise model gateways",
        "Isolated per-task sandboxes and full audit log exports",
        "Dedicated solutions architect onboarding, upgrades and SLA support",
      ],
    },
  ],
  boundaryHeading: "Three transparent cost boundaries.",
  boundaries: [
    {
      step: "01",
      title: "Annual Seat License",
      detail: "Tiered by active team members across enabled departments, including full platform capabilities and releases.",
    },
    {
      step: "02",
      title: "Deployment & Integration",
      detail: "Scoped transparently around your cluster environment, SSO identity setup and internal tool connectors.",
    },
    {
      step: "03",
      title: "Independent Model Spend",
      detail: "Route directly to your self-hosted models or existing enterprise LLM accounts with per-workspace usage visibility.",
    },
  ],
  rolloutHeading: "Four steps to enterprise rollout.",
  rolloutSteps: [
    {
      step: "01",
      title: "Align Workflows",
      detail: "Identify priority role scenarios, internal knowledge sources and security requirements.",
    },
    {
      step: "02",
      title: "Run Scoped Pilot",
      detail: "Verify deliverable quality, source accuracy and human review workflows on real work.",
    },
    {
      step: "03",
      title: "Size Team Seats",
      detail: "Confirm annual seat tiers and cluster architecture for your target departments.",
    },
    {
      step: "04",
      title: "Go Live Privately",
      detail: "Complete private cluster deployment, SSO permissions and team onboarding.",
    },
  ],
  footnote:
    "Software seat licensing, private deployment onboarding and model compute remain itemized separately in every enterprise proposal.",
  setupLinkLabel: "Read private deployment checklist",
  faqHeading: "Licensing & deployment FAQ",
  faqs: [
    {
      question: "How are seats counted, and can we expand departments later?",
      answer:
        "Seats correspond to active team members provisioned with workspace access. Organizations typically begin with one or two core departments and add seat tiers smoothly as verified workflows expand across teams.",
    },
    {
      question: "Can we validate with a pilot before committing to an annual seat license?",
      answer:
        "Yes. Most enterprise rollouts start with a scoped pilot on one or two concrete workflows so IT and business owners can evaluate real deliverables first.",
    },
    {
      question: "Are LLM token costs bundled into the per-seat software license?",
      answer:
        "No—software licensing and model compute stay separate. SkyMythos connects directly to your self-hosted models or approved enterprise LLM gateways while tracking usage by workspace and member.",
    },
    {
      question: "What infrastructure is needed for private deployment?",
      answer:
        "A standard self-hosted setup uses a Linux or Kubernetes environment, PostgreSQL, object storage and your approved model endpoints. See the Private Deployment guide in Docs for full details.",
    },
  ],
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
