import Link from "next/link";
import { localizeHref, type Locale } from "@/lib/i18n";
import { SiteShell } from "./site-shell";
import styles from "./site.module.css";

export function PrivacyContent({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  return (
    <SiteShell>
      <main id="main-content" className={`${styles.container} ${styles.article}`}>
        <header className={styles.articleHeader}>
          <div className={styles.breadcrumbs}>
            <Link href={localizeHref("/poc", locale)}>{zh ? "申请 POC" : "Request a POC"}</Link>
            <span>/</span>
            <span>{zh ? "信息使用说明" : "Information use"}</span>
          </div>
          <h1>{zh ? "咨询与申请信息使用说明" : "How we use enquiry information"}</h1>
          <p className={styles.articleLead}>
            {zh ? "在提交申请前，了解页面收集的资料及其用途。" : "Understand what this form collects and how it is used before you submit."}
          </p>
        </header>
        <article className={styles.articleBody}>
          <section>
            <h2>{zh ? "申请资料与用途" : "What you provide and why"}</h2>
            <p>
              {zh
                ? "申请表收集您主动填写的姓名、公司或组织、邮箱、选填职位、关注方向、咨询类型与需求说明，用于团队联系、了解业务场景，以及评估本次 POC 或企业项目的方案与报价。"
                : "The form collects the name, company or organization, email, optional role, area of interest, enquiry type and requirements you choose to provide. These details help the team contact you, understand your use case and assess a proposal and quote for your POC or enterprise project."}
            </p>
          </section>
          <section>
            <h2>{zh ? "发送与接收状态" : "Sending and receipt"}</h2>
            <p>
              {zh
                ? "在线提交仅在接收服务确认成功后显示“已收到”。如果页面提示接收服务未开放或提交失败，不会将其显示为提交成功。通过邮件方式联系时，页面会明确提示您在邮件应用中确认并发送。"
                : "Online submission shows a received confirmation only after the receiving service confirms success. An unavailable service or failed submission is not shown as success. When contacting us by email, the page asks you to review and send the message in your email app."}
            </p>
            <p>
              {zh
                ? "在您主动提交或发送之前，填写内容只保留在当前页面，不保存到浏览器持久存储。"
                : "Before you choose to submit or send, the details stay on the current page and are not saved in persistent browser storage."}
            </p>
          </section>
          <section>
            <h2>{zh ? "填写时请注意" : "What to leave out"}</h2>
            <p>
              {zh
                ? "需求说明只需概述场景和目标，请勿在申请表中填写账号密码、API 密钥、客户敏感资料或其他不适合用于初步沟通的信息。"
                : "Describe your use case and goals at a high level. Do not include passwords, API keys, sensitive customer data or other information unsuitable for an initial conversation."}
            </p>
          </section>
          <Link className={styles.textLink} href={localizeHref("/poc", locale)}>
            {zh ? "返回 POC 申请" : "Back to the POC request"}
          </Link>
        </article>
      </main>
    </SiteShell>
  );
}
