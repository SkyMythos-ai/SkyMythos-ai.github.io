import type { Locale } from "@/lib/i18n";

/** Logical responsibilities, not a claim that every entry uses one runtime or sandbox. */
export function EnterpriseSystemMap({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <figure className="enterprise-system" aria-label={zh ? "SkyMythos 系统逻辑分层" : "SkyMythos logical system layers"}>
    <div className="system-entry"><span>{zh ? "工作入口" : "Work entry points"}</span><strong>Web Console</strong><span>·</span><strong>{zh ? "已配置的企业 IM" : "Configured enterprise IM"}</strong></div>
    <div className="system-join" aria-hidden="true">↓</div>
    <div className="system-boundary">
      <div className="system-layers">
        <section className="system-layer system-organisation"><header><span className="story-index">01</span><h3>{zh ? "组织工作" : "Organise work"}</h3><span>SkyMythos</span></header><div className="system-tokens"><span>SkyBot</span><span>{zh ? "专业员工" : "Specialist employees"}</span><span>Workflow</span><span>Automation</span></div><p>{zh ? "承接目标、组织职责、串联过程与交付依据" : "Connect goals, responsibilities, execution and delivery evidence"}</p></section>
        <div className="system-join" aria-hidden="true">↓</div>
        <section className="system-layer"><header><span className="story-index">02</span><h3>{zh ? "执行工作" : "Execute work"}</h3></header><div className="system-environments"><div><strong>{zh ? "个人云环境" : "Personal cloud environment"}</strong><p>{zh ? "对话与项目的工作环境，不是一会话一 Sandbox。" : "A work environment for conversations and projects, not one Sandbox per conversation."}</p></div><div><strong>{zh ? "研发任务 Sandbox" : "Engineering task Sandbox"}</strong><p>{zh ? "任务级隔离，按节点执行并保留尝试与产物。" : "Task-level isolation, node execution, attempts and outputs."}</p></div></div><p className="system-runtime">{zh ? "Agent 运行时按入口与部署配置适配；自动化保留独立 Run。" : "Agent runtimes depend on the entry point and deployment. Automations retain independent Runs."}</p></section>
        <div className="system-join" aria-hidden="true">↕</div>
        <section className="system-layer"><header><span className="story-index">03</span><h3>{zh ? "保留工作资产" : "Keep work assets"}</h3></header><div className="system-tokens"><span>{zh ? "角色与流程版本" : "Role & flow versions"}</span><span>{zh ? "产物与执行证据" : "Outputs & evidence"}</span><span>{zh ? "知识与员工经验" : "Knowledge & experience"}</span></div><p>{zh ? "各自维护来源、生命周期与访问范围" : "Separate sources, lifecycles and access scopes"}</p></section>
      </div>
      <aside className="system-governance"><h3>{zh ? "贯穿各层的治理" : "Governance across layers"}</h3><ul>{(zh ? ["身份与工作区", "资源授权", "凭据与连接", "执行观测与证据"] : ["Identity & workspace", "Resource access", "Credentials & connections", "Observation & evidence"]).map(item => <li key={item}>{item}</li>)}</ul><p>{zh ? "约束实际资源与动作，不依赖 Agent 自律。" : "Govern resources and actions, not just Agent instructions."}</p></aside>
    </div>
    <div className="system-join"><span aria-hidden="true">↕</span><span>{zh ? "按配置与授权接入" : "Connect through configuration and authorisation"}</span></div>
    <div className="system-integrations"><div><strong>{zh ? "模型服务" : "Model services"}</strong><span>{zh ? "企业网关 / 托管 / 自托管" : "Enterprise gateways / Hosted / Self-hosted"}</span></div><div><strong>{zh ? "研发工具链" : "Engineering tools"}</strong><span>Git · CI/CD</span></div><div><strong>{zh ? "业务系统" : "Business systems"}</strong><span>MCP · Connector</span></div></div>
    <figcaption>{zh ? "逻辑架构示意，不等同于部署拓扑。各入口保留自己的运行对象，支持的模型与运行时组合以实际部署为准。" : "Logical architecture, not a deployment topology. Entry points retain distinct run identities; supported model and runtime combinations depend on the deployment."}</figcaption>
  </figure>;
}

export function DeploymentMap({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <figure className="deployment-map" aria-label={zh ? "客户 AWS 账户参考部署与外部接入" : "Reference AWS deployment and external connections"}>
    <div className="deployment-account"><p className="story-eyebrow">{zh ? "客户 AWS 账户 · 参考拓扑" : "Customer AWS account · Reference topology"}</p><h3>{zh ? "控制面与执行环境" : "Control plane & execution environments"}</h3><div className="deployment-core"><strong>Console / Control Plane</strong><strong>{zh ? "个人云环境 / 任务 Sandbox" : "Personal environments / Task Sandboxes"}</strong></div><p>{zh ? "以 EKS 等 Kubernetes 环境承载；网络、身份、密钥和出口策略按企业方案配置。" : "Run on Kubernetes, such as EKS. Configure networking, identity, secrets and egress for the enterprise."}</p><dl className="deployment-services"><div><dt>{zh ? "元数据" : "Metadata"}</dt><dd>PostgreSQL / RDS</dd></div><div><dt>{zh ? "对象存储" : "Object storage"}</dt><dd>S3 {zh ? "等兼容服务" : "or compatible storage"}</dd></div><div><dt>{zh ? "遥测后端" : "Telemetry"}</dt><dd>OTLP / CloudWatch</dd></div></dl><p className="story-note">{zh ? "以上托管服务为可选项，需按实际适配与部署方案验收。" : "Managed services are optional and require adapter and deployment validation."}</p></div>
    <div className="deployment-external"><p className="story-eyebrow">{zh ? "按服务选型确定数据边界" : "Service choices define data boundaries"}</p><h3>{zh ? "需要核对的外部接入" : "Connections to verify"}</h3><ul><li>{zh ? "模型 / Bedrock / 模型网关" : "Models / Bedrock / Model gateways"}</li><li>GitHub / GitLab</li><li>{zh ? "企业 IM / 外部工具" : "Enterprise IM / External tools"}</li></ul><p>{zh ? "确认哪些数据发送到哪里、使用谁的授权。私有部署不等于零外发。" : "Verify what data goes where and whose access is used. Private deployment does not mean zero external traffic."}</p></div>
    <figcaption>{zh ? "AWS 是参考方案，不是唯一部署形态，也不代表模型或外部工具调用一定留在账户内。" : "AWS is a reference, not the only deployment option or a guarantee that model and tool traffic stays within the account."}</figcaption>
  </figure>;
}
