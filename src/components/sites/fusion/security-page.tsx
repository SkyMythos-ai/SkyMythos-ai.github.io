import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  FileCheck2,
  KeyRound,
  Layers3,
  LockKeyhole,
} from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { CircuitPrivacyStage } from "./enterprise-diagrams";
import { GovernanceScene } from "./governance-scene";
import { SiteMotionProvider } from "./site-motion";
import { SiteShell } from "./site-shell";
import site from "./site.module.css";
import homeStyles from "./home.module.css";
import styles from "./enterprise-diagrams.module.css";

export function SecurityPage({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const text = (z: string, e: string) => (zh ? z : e);

  const readinessSteps = [
    {
      step: "01",
      title: text("核对部署与网络范围", "Align infrastructure & network scope"),
      detail: text(
        "支持企业自有服务器、专有云或独立租户部署，接入前逐项确认内网连通与数据存储位置。",
        "Deploy inside your on-premises cluster, VPC or dedicated environment with data residency verified upfront.",
      ),
    },
    {
      step: "02",
      title: text("接入统一身份与模型网关", "Connect enterprise SSO & model gateways"),
      detail: text(
        "对接企业身份认证（SSO / 企业 IM）与批准的大模型端点，按部门配置访问范围与调用配额。",
        "Integrate corporate SSO or enterprise IM alongside your approved LLM endpoints and department quotas.",
      ),
    },
    {
      step: "03",
      title: text("设定高危操作审批边界", "Define human approval gates"),
      detail: text(
        "按岗位场景明确自动执行范围与人工确认节点，确保外发、合入与用印动作始终受控。",
        "Set clear rules for autonomous drafting versus human-approved merges, external sends and formal sign-offs.",
      ),
    },
  ];

  return (
    <SiteShell>
      <SiteMotionProvider>
        <main id="main-content" className={styles.securityPage}>
          <section className={`${site.container} ${styles.securityTopWrap}`}>
            <CircuitPrivacyStage locale={locale} />
          </section>

          <GovernanceScene>
            <div className={`${site.container} ${homeStyles.governance}`}>
              <div className={site.sectionHeading}>
                <h2>
                  {text("工作持续推进，", "Work moves forward.")}
                  <br />
                  {text("决定始终在团队手中。", "Decisions stay with your team.")}
                </h2>
                <div>
                  <p>
                    {text(
                      "人负责设定目标、授予权限并验收结果。数字员工严格在配置的隔离环境与访问边界内运行，关键业务动作明确保留人工把关。",
                      "Your team defines goals, authorizes connections and signs off on deliverables. AI employees execute strictly within configured scopes.",
                    )}
                  </p>
                </div>
              </div>

              <div className={site.governanceLayout}>
                <div className={site.boundaryList}>
                  <article>
                    <KeyRound />
                    <div>
                      <h3>{text("团队共享知识，凭据各自隔离", "Shared knowledge, isolated credentials")}</h3>
                      <p>
                        {text(
                          "复用团队数字员工与业务技能不会暴露个人密钥；系统连接按各自授权范围独立校验。",
                          "Reusing team AI employees or skills never exposes personal keys; every system connection validates its own scope.",
                        )}
                      </p>
                    </div>
                  </article>
                  <article>
                    <Layers3 />
                    <div>
                      <h3>{text("任务独立隔离，高危操作默认拦截", "Isolated execution with safe defaults")}</h3>
                      <p>
                        {text(
                          "不依赖提示词自律作为安全防线，执行环境在系统层限制越界目录读写与未授权外部网络请求。",
                          "Security never relies on prompt instructions alone. System-level isolation restricts file access and outbound traffic.",
                        )}
                      </p>
                    </div>
                  </article>
                  <article>
                    <FileCheck2 />
                    <div>
                      <h3>{text("执行完成与正式发布严格分离", "Execution separated from final release")}</h3>
                      <p>
                        {text(
                          "每次运行完整保留工具记录、来源出处与检查报告，由业务或研发负责人审阅后决定是否采纳。",
                          "Every run attaches tool logs, cited sources and check results so owners review concrete evidence before release.",
                        )}
                      </p>
                    </div>
                  </article>
                </div>

                <div className={site.environmentPanel} data-review-panel>
                  <div className={site.environmentTop}>
                    <span>
                      <LockKeyhole size={16} />
                      {text("人工验收关口", "Human review checkpoint")}
                    </span>
                    <small>{text("治理示意", "Governance gate")}</small>
                  </div>
                  <div className={homeStyles.reviewSummary}>
                    <span className={homeStyles.reviewStatus}>
                      <Clock3 size={14} aria-hidden="true" />
                      {text("等待负责人确认", "Awaiting owner sign-off")}
                    </span>
                    <h3>
                      {text(
                        "交付材料与来源依据已备齐，下一步由你拍板。",
                        "Deliverables and source evidence are ready for your call.",
                      )}
                    </h3>
                  </div>
                  <dl>
                    <div>
                      <dt>{text("已就绪", "Prepared")}</dt>
                      <dd>{text("初稿产物、检查记录与制度原文出处", "Draft output, check logs & cited sources")}</dd>
                    </div>
                    <div>
                      <dt>{text("待确认", "To confirm")}</dt>
                      <dd>{text("业务采纳、代码合入或对外发送许可", "Business adoption, merge or external send")}</dd>
                    </div>
                    <div>
                      <dt>{text("安全边界", "Boundary")}</dt>
                      <dd>{text("未确认前不触发外部系统写入", "No external write actions until approved")}</dd>
                    </div>
                  </dl>
                  <p>
                    <Check size={15} />
                    {text("检查通过 ≠ 自动合入或对外生效。", "Checks passed does not mean merged or published.")}
                  </p>
                </div>
              </div>
            </div>
          </GovernanceScene>

          <section className={styles.readinessSection} aria-labelledby="security-readiness-heading">
            <div className={site.container}>
              <h2 id="security-readiness-heading" className={styles.sectionTitleOnly}>
                {text("三步完成企业私有化安全接入", "Three steps to governed private deployment.")}
              </h2>
              <div className={styles.readinessGrid}>
                {readinessSteps.map((item) => (
                  <article key={item.step} className={styles.readinessCard}>
                    <span className={styles.readinessStep}>{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={site.cta}>
            <div className={site.container}>
              <h2>
                {text("需要结合企业内控要求评估部署方案？", "Evaluating security & deployment requirements?")}
              </h2>
              <p>
                {text(
                  "预约架构与安全沟通，逐项核对网络隔离、身份接入与数据流边界。",
                  "Schedule an architecture review to align on network isolation, identity integration and data boundaries.",
                )}
              </p>
              <div>
                <Link href={localizeHref("/poc?enquiry=enterprise", locale)} className={site.primaryLink}>
                  {text("预约安全与架构沟通", "Book Security Review")}
                  <ArrowRight size={15} />
                </Link>
                <Link href={localizeHref("/docs/private-deployment", locale)} className={site.textLink}>
                  {text("阅读私有化部署文档", "Read private deployment docs")}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </SiteMotionProvider>
    </SiteShell>
  );
}
