import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/sites/fusion/site-shell";
import styles from "@/components/sites/fusion/site.module.css";

export const metadata: Metadata = { title: "咨询与申请信息使用说明" };
export default function PrivacyPage() {
  return (
    <SiteShell>
      <main
        id="main-content"
        className={`${styles.container} ${styles.article}`}
      >
        <header className={styles.articleHeader}>
          <div className={styles.breadcrumbs}>
            <Link href="/poc">申请 POC</Link>
            <span>/</span>
            <span>信息使用说明</span>
          </div>
          <h1>咨询与申请信息使用说明</h1>
          <p className={styles.articleLead}>
            在提交申请前，了解页面收集的资料及其用途。
          </p>
        </header>
        <article className={styles.articleBody}>
          <section>
            <h2>申请资料与用途</h2>
            <p>
              申请表收集您主动填写的姓名、公司或组织、邮箱、选填职位、关注方向、咨询类型与需求说明，用于团队联系、了解业务场景，以及评估本次
              POC 或企业项目的方案与报价。
            </p>
          </section>
          <section>
            <h2>发送与接收状态</h2>
            <p>
              在线提交仅在接收服务确认成功后显示“已收到”。如果页面提示接收服务未开放或提交失败，不会将其显示为提交成功。通过邮件方式联系时，页面会明确提示您在邮件应用中确认并发送。
            </p>
            <p>
              在您主动提交或发送之前，填写内容只保留在当前页面，不保存到浏览器持久存储。
            </p>
          </section>
          <section>
            <h2>填写时请注意</h2>
            <p>
              需求说明只需概述场景和目标，请勿在申请表中填写账号密码、API
              密钥、客户敏感资料或其他不适合用于初步沟通的信息。
            </p>
          </section>
          <Link className={styles.textLink} href="/poc">
            返回 POC 申请
          </Link>
        </article>
      </main>
    </SiteShell>
  );
}
