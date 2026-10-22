import type { Locale } from "@/lib/i18n";

/** Resource relationships, not a single mandatory execution pipeline. */
export function EnterpriseSystemMap({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <figure className="enterprise-system" aria-label={zh ? "工作组织、执行、资产与贯穿治理的逻辑关系" : "Logical relationships between coordination, execution, assets and governance"}>
    <div className="system-entry"><strong>Web Console</strong><span>{zh ? "已配置的企业 IM" : "Configured enterprise IM"}</span></div>
    <div className="system-join">{zh ? "目标与工作请求" : "Goals and work requests"}<span aria-hidden="true">↓</span></div>
    <div className="system-grid">
      <aside className="system-assets"><h3>{zh ? "企业资产" : "Company assets"}</h3><ul><li>{zh ? "知识与员工经验" : "Knowledge and experience"}</li><li>Skill / Flow / {zh ? "角色" : "Roles"}</li><li>{zh ? "版本与共享范围" : "Versions and sharing scopes"}</li></ul><p>{zh ? "按授权调用与沉淀，保留来源。" : "Authorised use and curation, with sources retained."}</p></aside>
      <div className="system-core">
        <section><h3>{zh ? "工作组织" : "Work coordination"}</h3><div className="system-tokens"><span>SkyBot</span><span>{zh ? "专业员工" : "Specialists"}</span><span>Workflow</span><span>Automation</span></div><p>{zh ? "明确职责，组织过程与交付。" : "Connect responsibilities, execution and delivery."}</p></section>
        <div className="system-core-link" aria-hidden="true">→</div>
        <section><h3>{zh ? "执行环境" : "Execution environments"}</h3><div className="system-environments"><div><strong>{zh ? "个人云环境" : "Personal environment"}</strong><p>{zh ? "服务对话与项目，不是一会话一 Sandbox。" : "For conversations and projects, not one Sandbox per conversation."}</p></div><div><strong>{zh ? "任务 Sandbox" : "Task Sandbox"}</strong><p>{zh ? "任务级隔离，保留执行尝试与产物。" : "Task isolation with execution attempts and outputs."}</p></div></div><p className="system-runtime">{zh ? "运行时按入口适配；Automation 保留独立 Run。" : "Runtimes depend on the entry point. Automation retains separate Runs."}</p></section>
      </div>
      <aside className="system-governance"><h3>{zh ? "贯穿治理" : "Governance"}</h3><dl><div><dt>{zh ? "访问" : "Access"}</dt><dd>{zh ? "身份、工作区、资源与凭据" : "Identity, workspace, resources and credentials"}</dd></div><div><dt>{zh ? "记录" : "Records"}</dt><dd>{zh ? "资产范围、使用与内容访问审计" : "Asset scopes, usage and content-access audits"}</dd></div><div><dt>{zh ? "策略" : "Policies"}</dt><dd>{zh ? "计量估算、模型与 Task 准入" : "Metering, estimates, models and Task admission"}</dd></div></dl></aside>
    </div>
    <div className="system-join"><span aria-hidden="true">↕</span>{zh ? "按配置与授权接入" : "Configured, authorised connections"}</div>
    <div className="system-integrations"><div><strong>{zh ? "模型服务" : "Model services"}</strong><span>{zh ? "企业网关 / 托管 / 自托管" : "Enterprise gateway / Hosted / Self-hosted"}</span></div><div><strong>{zh ? "研发工具链" : "Engineering tools"}</strong><span>Git / CI/CD</span></div><div><strong>{zh ? "业务系统" : "Business systems"}</strong><span>MCP / Connector</span></div></div>
    <figcaption>{zh ? "逻辑关系示意，不等同部署拓扑。各入口保留自己的运行对象；模型与运行时组合以实际部署为准。记录消耗不等于全入口实时预算封顶。" : "Logical relationships, not deployment topology. Entry points retain distinct run identities; model and runtime support depends on the deployment. Metering is not a real-time budget cap across all entry points."}</figcaption>
  </figure>;
}

export function DeploymentMap({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <figure className="deployment-map" aria-label={zh ? "客户环境与外部服务的参考部署边界" : "Reference deployment boundary between customer infrastructure and external services"}>
    <div className="deployment-account"><h3>{zh ? "客户环境内" : "Within customer infrastructure"}</h3><div className="deployment-core"><strong>Console / Control Plane</strong><strong>{zh ? "个人云环境 / 任务 Sandbox" : "Personal environments / Task Sandboxes"}</strong></div><p>{zh ? "以 EKS 等 Kubernetes 环境承载，网络、身份、密钥和出口按企业方案配置。" : "Run on Kubernetes, such as EKS. Configure networking, identity, secrets and egress for your organisation."}</p><dl className="deployment-services"><div><dt>{zh ? "元数据" : "Metadata"}</dt><dd>PostgreSQL / RDS</dd></div><div><dt>{zh ? "对象存储" : "Object storage"}</dt><dd>S3 {zh ? "或兼容服务" : "or compatible storage"}</dd></div><div><dt>{zh ? "遥测" : "Telemetry"}</dt><dd>OTLP / CloudWatch</dd></div></dl></div>
    <div className="deployment-external"><h3>{zh ? "需核对的外部接入" : "External connections to verify"}</h3><ul><li>{zh ? "模型 / Bedrock / 模型网关" : "Models / Bedrock / Model gateways"}</li><li>GitHub / GitLab</li><li>{zh ? "企业 IM / 外部工具" : "Enterprise IM / External tools"}</li></ul><p>{zh ? "明确哪些数据发往哪里、使用谁的授权。私有部署不等于零外发。" : "Verify what data goes where and whose access is used. Private deployment does not mean zero external traffic."}</p></div>
    <figcaption>{zh ? "AWS 为参考方案，托管服务为可选项，均需按实际适配与部署验收；不代表模型或工具调用一定留在账户内。" : "AWS is a reference and managed services are optional. Validate actual adapters and deployment; model and tool traffic may still leave the account."}</figcaption>
  </figure>;
}
