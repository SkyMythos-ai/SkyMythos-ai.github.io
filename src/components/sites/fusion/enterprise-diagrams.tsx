"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  ClipboardCheck,
  Code2,
  Database,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  GitBranch,
  Layers,
  MessageSquare,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  Workflow,
   type LucideIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { useSiteMotion } from "./site-motion";
import site from "./site.module.css";
import styles from "./enterprise-diagrams.module.css";

type MatrixCardItem = {
  label: string;
  Icon: LucideIcon;
  badgeTone?: "cyan" | "indigo" | "slate" | "blue";
};

const badgeToneClass = {
  cyan: styles.badgeCyan,
  indigo: styles.badgeIndigo,
  slate: styles.badgeSlate,
  blue: styles.badgeBlue,
} as const;

function MatrixCard({
  title,
  items,
}: {
  title: string;
  items: MatrixCardItem[];
}) {
  return (
    <article className={styles.matrixCard}>
      <h3>{title}</h3>
      <ul className={styles.iconRow}>
        {items.map(({ label, Icon, badgeTone }) => (
          <li key={label} className={styles.iconItem}>
            <span
              className={
                badgeTone
                  ? `${styles.appBadge} ${badgeToneClass[badgeTone]}`
                  : styles.glyphBox
              }
              aria-hidden="true"
            >
              <Icon />
            </span>
            <span className={styles.iconLabel}>{label}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** 首页核心架构区：四角纯图标短词卡片 + 中央双环底座 + 四支柱竖线底栏。 */
export function AgentFoundationSection({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);

  const leftCards = [
    {
      title: "SkyMythos",
      items: [
        { label: text("工作空间", "Workspace"), Icon: Bot },
        { label: text("数字员工", "Employees"), Icon: Users },
        { label: text("企业知识", "Knowledge"), Icon: BookOpen },
        { label: text("任务协同", "Workflows"), Icon: Workflow },
      ],
    },
    {
      title: text("办公与研发协同", "Collaboration Suite"),
      items: [
        { label: text("飞书 / Lark", "Lark"), Icon: MessageSquare, badgeTone: "cyan" as const },
        { label: "Slack", Icon: FolderKanban, badgeTone: "indigo" as const },
        { label: text("代码仓库", "Git Repos"), Icon: GitBranch, badgeTone: "slate" as const },
        { label: text("企业文档", "Docs"), Icon: FileText, badgeTone: "blue" as const },
      ],
    },
  ];

  const rightCards = [
    {
      title: text("企业内部业务", "Internal Systems"),
      items: [
        { label: text("工单流转", "Tickets"), Icon: ClipboardCheck },
        { label: text("内部制度库", "Policies"), Icon: Database },
        { label: text("审批协同", "Approvals"), Icon: ShieldCheck },
        { label: text("业务台账", "ERP & CRM"), Icon: FileSpreadsheet },
      ],
    },
    {
      title: text("核心部门场景", "Core Departments"),
      items: [
        { label: text("HR 人事", "HR"), Icon: Users },
        { label: text("财务法务", "Finance"), Icon: Scale },
        { label: text("销售运营", "Sales"), Icon: Briefcase },
        { label: text("产研技术", "R&D"), Icon: Code2 },
      ],
    },
  ];

  const pillars = [
    {
      title: text("灵活构建", "Flexible Build"),
      detail: text("角色 · 技能 · 知识 · 连接器", "Roles · Skills · Knowledge · Tools"),
      Icon: Layers,
    },
    {
      title: text("稳定运行", "Reliable Runtime"),
      detail: text("多数字员工 · 阶段流程 · 隔离沙箱", "Multi-Agent · Flows · Sandboxes"),
      Icon: Activity,
    },
    {
      title: text("统一治理", "Unified Governance"),
      detail: text("权限分级 · 审计留痕 · 用量配额", "RBAC · Audit Trail · Quotas"),
      Icon: ShieldCheck,
    },
    {
      title: text("持续沉淀", "Compounding Craft"),
      detail: text("原文溯源 · 经验提炼 · 按权复用", "Citations · Distillation · Reuse"),
      Icon: TrendingUp,
    },
  ];

  return (
    <section
      className={styles.foundationSection}
      id="platform"
      aria-labelledby="foundation-heading"
    >
      <div className={site.container}>
        <h2 id="foundation-heading" className={styles.sectionTitleOnly}>
          {text("一个 Agent 底座，", "One Agent foundation,")}
          <br />
          {text("支撑企业数字员工规模化应用", "built for enterprise-wide scale.")}
        </h2>

        <div className={styles.matrixStage}>
          <div className={styles.matrixColumn}>
            {leftCards.map((card) => (
              <MatrixCard key={card.title} title={card.title} items={card.items} />
            ))}
          </div>

          <div className={styles.hubCenter}>
            <div className={styles.hubOrbitWrap}>
              <svg
                className={styles.hubChevronsLeft}
                viewBox="0 0 30 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 10L22 32L8 54M2 16L13 32L2 48"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeDasharray="2.5 3.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className={styles.hubOuterRing}>
                <div className={styles.hubInnerDisc}>
                  <span className={styles.hubMark} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/sites/fusion/brand/logo-mark.svg" alt="" width={24} height={24} />
                  </span>
                  <span className={styles.hubCode}>SMH</span>
                </div>
              </div>

              <svg
                className={styles.hubChevronsRight}
                viewBox="0 0 30 64"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M22 10L8 32L22 54M28 16L17 32L28 48"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeDasharray="2.5 3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className={styles.hubCaption}>
              <strong>SkyMythos Managed Harness</strong>
              <span>
                {text("私有化数字员工统一平台", "Self-Hosted Enterprise Agent Platform")}
              </span>
              <small>
                {text(
                  "统一运行时 + 知识溯源 + 隔离沙箱 + 权限治理",
                  "Runtime + Cited Knowledge + Sandboxes + Governance",
                )}
              </small>
              <svg
                className={styles.hubDownArrow}
                width="36"
                height="16"
                viewBox="0 0 36 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 3L18 11L28 3M12 8L18 13L24 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className={styles.matrixColumn}>
            {rightCards.map((card) => (
              <MatrixCard key={card.title} title={card.title} items={card.items} />
            ))}
          </div>
        </div>

        <div className={styles.pillarsBar}>
          {pillars.map(({ title, detail, Icon }) => (
            <div key={title} className={styles.pillarItem}>
              <div className={styles.pillarIcon} aria-hidden="true">
                <Icon />
              </div>
              <h4>{title}</h4>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IsoDataSovereignty() {
  return (
    <svg className={styles.isoSvg} viewBox="0 0 420 230" fill="none" aria-hidden="true">
      {/* 底部等轴测虚线参考盘 */}
      <path
        d="M210 34L374 122L210 210L46 122Z"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeDasharray="4 5"
      />
      {/* 中央主卡：VPC Lock */}
      <g transform="translate(136, 26)">
        <path
          d="M74 8L148 48L74 88L0 48Z"
          fill="var(--f-surface)"
          stroke="var(--f-accent)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <path
          d="M0 48L74 88L148 48V56L74 96L0 56Z"
          fill="var(--f-accent-soft)"
        />
        <rect
          x="63"
          y="39"
          width="22"
          height="16"
          rx="4"
          stroke="var(--f-accent)"
          strokeWidth="1.8"
        />
        <path
          d="M68 39V34C68 30.7 70.7 28 74 28C77.3 28 80 30.7 80 34V39"
          stroke="var(--f-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <text
          x="74"
          y="71"
          textAnchor="middle"
          fill="var(--f-muted)"
          fontSize="10"
          fontFamily="var(--f-mono)"
        >
          VPC
        </text>
      </g>
      {/* 左下卫星卡：Data */}
      <g transform="translate(52, 92)">
        <path
          d="M58 6L116 38L58 70L0 38Z"
          fill="var(--f-surface)"
          stroke="currentColor"
          strokeOpacity="0.18"
        />
        <path d="M0 38L58 70L116 38V44L58 76L0 44Z" fill="var(--f-raised)" />
        <ellipse cx="45" cy="34" rx="8" ry="4" stroke="var(--f-accent)" strokeWidth="1.5" />
        <path d="M37 34V42C37 44.2 40.6 46 45 46C49.4 46 53 44.2 53 42V34" stroke="var(--f-accent)" strokeWidth="1.5" />
        <text x="69" y="42" fill="var(--f-text)" fontSize="10" fontFamily="var(--f-mono)">
          Data
        </text>
      </g>
      {/* 右下卫星卡：DLP / Gateway */}
      <g transform="translate(252, 96)">
        <path
          d="M58 6L116 38L58 70L0 38Z"
          fill="var(--f-surface)"
          stroke="currentColor"
          strokeOpacity="0.18"
        />
        <path d="M0 38L58 70L116 38V44L58 76L0 44Z" fill="var(--f-raised)" />
        <circle cx="43" cy="36" r="7" stroke="var(--f-accent)" strokeWidth="1.6" />
        <path d="M48 41L53 46" stroke="var(--f-accent)" strokeWidth="1.6" strokeLinecap="round" />
        <text x="68" y="41" fill="var(--f-text)" fontSize="10" fontFamily="var(--f-mono)">
          DLP
        </text>
      </g>
    </svg>
  );
}

function IsoBoundedSandbox() {
  return (
    <svg className={styles.isoSvg} viewBox="0 0 420 230" fill="none" aria-hidden="true">
      <path
        d="M210 36L370 122L210 208L50 122Z"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeDasharray="4 5"
      />
      {/* 左侧叠层 Skill 卡 */}
      <g transform="translate(64, 74)">
        <path d="M58 14L116 46L58 78L0 46Z" fill="var(--f-raised)" />
        <path
          d="M58 6L116 38L58 70L0 38Z"
          fill="var(--f-surface)"
          stroke="currentColor"
          strokeOpacity="0.18"
        />
        <text x="58" y="42" textAnchor="middle" fill="var(--f-text)" fontSize="10.5" fontFamily="var(--f-mono)">
          &lt;/&gt; Skill
        </text>
      </g>
      {/* 右侧深色隔离沙箱核心卡 */}
      <g transform="translate(184, 46)">
        <path
          d="M88 8L176 56L88 104L0 56Z"
          fill="var(--f-accent-soft)"
          stroke="var(--f-accent)"
          strokeOpacity="0.4"
        />
        <path d="M88 16L162 56L88 96L14 56Z" fill="#151b2c" />
        <circle cx="88" cy="49" r="15" fill="#2563eb" fillOpacity="0.28" stroke="#699ef5" strokeWidth="1.4" />
        <text x="88" y="53" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600" fontFamily="var(--f-mono)">
          S
        </text>
        <text x="88" y="77" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily="var(--f-mono)">
          Agent
        </text>
      </g>
      {/* 底部 Sandbox 校验胶囊 */}
      <g transform="translate(158, 144)">
        <path
          d="M46 2L92 27L46 52L0 27Z"
          fill="var(--f-surface)"
          stroke="var(--f-positive)"
          strokeOpacity="0.5"
        />
        <text x="46" y="30" textAnchor="middle" fill="var(--f-positive)" fontSize="9.5" fontFamily="var(--f-mono)">
          ✓ Sandbox
        </text>
      </g>
    </svg>
  );
}

function IsoAuditTrail() {
  return (
    <svg className={styles.isoSvg} viewBox="0 0 420 230" fill="none" aria-hidden="true">
      <path
        d="M210 36L370 122L210 208L50 122Z"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeDasharray="4 5"
      />
      {/* 多层审计日志卡片 */}
      <g transform="translate(76, 38)">
        <path d="M86 24L172 72L86 120L0 72Z" fill="var(--f-raised)" />
        <path
          d="M86 10L172 58L86 106L0 58Z"
          fill="var(--f-surface)"
          stroke="currentColor"
          strokeOpacity="0.18"
        />
        <text x="86" y="48" textAnchor="middle" fill="var(--f-text)" fontSize="10.5" fontFamily="var(--f-mono)">
          Audit Log
        </text>
        <path d="M58 62L112 62" stroke="var(--f-accent)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
        <path d="M66 73L106 73" stroke="var(--f-positive)" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* 右下身份徽章 */}
      <g transform="translate(228, 96)">
        <ellipse
          cx="58"
          cy="40"
          rx="48"
          ry="28"
          fill="var(--f-accent-soft)"
          stroke="var(--f-accent)"
          strokeOpacity="0.4"
        />
        <ellipse cx="58" cy="38" rx="31" ry="18" fill="#151b2c" />
        <text x="58" y="42" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="var(--f-mono)">
          ID · RBAC
        </text>
      </g>
    </svg>
  );
}

/** 首页三步安全治理时间轴（对标左细线节点 + 右等轴测立体卡片）。 */
export function SecurityJourneySection({ locale = "en" }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { enabled } = useSiteMotion();
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);

  useEffect(() => {
    const element = sectionRef.current;
    if (!enabled || !element) return;
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight * 0.35);
      const progress = Math.max(0.08, Math.min(1, (window.innerHeight * 0.72 - rect.top) / total));
      element.style.setProperty("--security-progress", String(progress));
    };
    const schedule = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "120px" },
    );
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      element.style.removeProperty("--security-progress");
    };
  }, [enabled]);

  const steps = [
    {
      code: "01",
      tag: text("数据不出域", "Data stays in-house"),
      title: text("让敏感信息始终留在企业内", "Keep sensitive data inside your boundary"),
      points: [
        {
          heading: text("全栈私有化部署", "Self-hosted infrastructure"),
          detail: text(
            "控制面、知识库与执行环境均部署在企业自有服务器或专有云内，核心业务资料无需托管至外部公共平台。",
            "Deploy the control plane, knowledge store and workspaces inside your own cluster or VPC without handing data to public SaaS.",
          ),
        },
        {
          heading: text("模型与外联边界可控", "Controlled model & outbound flows"),
          detail: text(
            "支持接入企业自有大模型或指定模型网关，外部连接逐项核准，敏感凭据全程加密隔离。",
            "Connect self-hosted models or approved enterprise gateways, with every external integration reviewed and credentials isolated.",
          ),
        },
      ],
      Artwork: IsoDataSovereignty,
    },
    {
      code: "02",
      tag: text("行为有边界", "Bounded execution"),
      title: text("让数字员工只做被授权的事", "Ensure AI employees act strictly within scope"),
      points: [
        {
          heading: text("任务级隔离沙箱", "Isolated per-task sandboxes"),
          detail: text(
            "每项执行任务在独立受控环境中运行，未授权外联与高危指令默认阻断，文件变更留存可核查记录。",
            "Every task runs in an isolated sandbox where unauthorized network calls and high-risk commands are blocked by default.",
          ),
        },
        {
          heading: text("关键动作人工把关", "Human sign-off on critical actions"),
          detail: text(
            "资料检索与初稿起草自动推进；涉及代码合并、对外发送与正式签批的节点均保留人工确认。",
            "Drafting and analysis run autonomously, while code merges, external sends and formal sign-offs require human approval.",
          ),
        },
      ],
      Artwork: IsoBoundedSandbox,
    },
    {
      code: "03",
      tag: text("全程可审计", "End-to-end auditability"),
      title: text("让每一次调用都可追溯", "Trace every action back to its source"),
      points: [
        {
          heading: text("组织身份与权限继承", "Enterprise identity & RBAC"),
          detail: text(
            "对接企业统一身份体系，数字员工严格继承授权人的部门与项目访问边界，越权请求直接拦截。",
            "Integrate with enterprise SSO and RBAC so AI employees inherit strict project permissions without widening access.",
          ),
        },
        {
          heading: text("全链路留痕与原文溯源", "Complete audit & source trail"),
          detail: text(
            "完整记录工具调用、引用文档版本与人工审批节点，支持合规内控复盘与部门用量核算。",
            "Log tool invocations, cited document versions and human approvals end to end for internal audits and governance.",
          ),
        },
      ],
      Artwork: IsoAuditTrail,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="governance"
      className={styles.securityTimelineSection}
      aria-labelledby="security-timeline-heading"
    >
      <div className={site.container}>
        <div className={styles.sectionHeaderRow}>
          <h2 id="security-timeline-heading" className={styles.sectionTitleOnly}>
            {text("企业级安全治理，", "Enterprise security governance,")}
            <br />
            {text("护航规模化应用", "built for confident rollout.")}
          </h2>
          <Link href={localizeHref("/security", locale)} className={site.textLink}>
            {text("查看安全合规详情", "Explore Security & Privacy")}
            <ArrowRight size={15} />
          </Link>
        </div>

        <ol className={styles.timelineList}>
          {steps.map(({ code, tag, title, points, Artwork }) => (
            <li key={code} className={styles.timelineStep}>
              <span className={styles.stepDot} aria-hidden="true" />
              <div className={styles.stepBody}>
                <div className={styles.stepTagRow}>
                  <span className={styles.stepCode}>{code}</span>
                  <span className={styles.stepTagLabel}>{tag}</span>
                </div>
                <h3>{title}</h3>
                <div className={styles.stepPoints}>
                  {points.map((pt) => (
                    <div key={pt.heading}>
                      <h4>{pt.heading}</h4>
                      <p>{pt.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.isoArtwork}>
                <Artwork />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 独立 /security 专页首屏：浅蓝正交电路网格大圆角容器 + 2x2 几何图标白卡。 */
export function CircuitPrivacyStage({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);

  const cards = [
    {
      title: text("私有化数据隔离", "Private Data Isolation"),
      description: text(
        "支持全栈部署在企业自有集群或专有云环境，核心业务文档、代码仓库与工作记录始终留在企业可控边界内。",
        "Deploy the complete platform inside your own cluster or private cloud so documents, repositories and work records stay in-house.",
      ),
      icon: (
        <svg className={styles.privacyGeom} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <rect x="6" y="14" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
          <rect x="16" y="6" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M15 23L25 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: text("精细权限管控", "Granular Access Control"),
      description: text(
        "基于组织角色的多级权限体系，管理员可按工作空间、部门与项目精确控制知识库读取、工具调用与资产共享范围。",
        "Multi-tier role-based permissions let administrators govern workspace access, knowledge visibility and tool scopes by department.",
      ),
      icon: (
        <svg className={styles.privacyGeom} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="16" cy="24" r="8" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      ),
    },
    {
      title: text("关键动作人工把关", "Human Review Gates"),
      description: text(
        "明确区分任务执行完成与正式对外生效；代码合并、外部通知、合同用印与资产发布均保留负责人确认环节。",
        "Separate task execution from production effect, keeping code merges, external communications and approvals under human sign-off.",
      ),
      icon: (
        <svg className={styles.privacyGeom} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M20 6L32 11V20C32 27.5 26.8 33.2 20 35C13.2 33.2 8 27.5 8 20V11L20 6Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path d="M15 20.5L18.5 24L25.5 16.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: text("全链路审计追溯", "Full-Chain Audit Trail"),
      description: text(
        "完整留存数字员工调用日志、引用原文版本、审批记录与部门模型用量，支持导出核查，满足企业内控要求。",
        "Preserve complete logs of tool calls, cited source versions, approval decisions and department token usage for internal compliance.",
      ),
      icon: (
        <svg className={styles.privacyGeom} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="10" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="30" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="20" cy="29" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M13.5 12H26.5M12 15L18 26M28 15L22 26" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.circuitStage}>
      <svg
        className={styles.circuitSvg}
        viewBox="0 0 1200 640"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M64 0V520M148 0V240H320V460M240 80H520V210M680 0V180H920V540M820 60H1140M1040 0V420H840M80 380H420V640M560 420H980M740 310V640"
          stroke="currentColor"
          strokeWidth="1"
        />
        {[
          [64, 120],
          [148, 240],
          [320, 240],
          [240, 80],
          [520, 80],
          [680, 180],
          [920, 180],
          [820, 60],
          [1040, 280],
          [420, 380],
          [740, 310],
          [980, 420],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="var(--f-surface)" stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>

      <div className={styles.privacyPill}>
        <strong>{text("安全合规", "SECURITY")}</strong>
        <span>PRIVACY &amp; SECURITY</span>
      </div>

      <header className={styles.circuitHeader}>
        <h1>{text("隐私与安全", "Privacy & Security")}</h1>
        <p>
          {text(
            "企业级私有化架构与全链路数据保护，让每一次人机协作都可信、可控、可追溯。",
            "Self-hosted enterprise architecture and end-to-end access controls keep every collaboration trusted, bounded and auditable.",
          )}
        </p>
      </header>

      <div className={styles.privacyGrid}>
        {cards.map((card) => (
          <article key={card.title} className={styles.privacyCard}>
            {card.icon}
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
