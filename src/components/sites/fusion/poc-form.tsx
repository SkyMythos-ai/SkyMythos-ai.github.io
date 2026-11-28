"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowRight, Check, Copy, LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  pocScenarios,
  getPocScenarioLabel,
  validatePoc,
  type PocChannel,
  type PocErrors,
  type PocEnquiry,
} from "@/lib/poc";
import { useLocale } from "@/components/locale-provider";
import { localizeHref } from "@/lib/i18n";
import styles from "./poc.module.css";

type Submission =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success" }
  | { status: "email-ready"; content: string; mailtoHref: string }
  | { status: "error"; message: string };

export function PocForm({
  channel,
  enquiry = "poc",
  staticHosting = false,
}: {
  channel: PocChannel;
  enquiry?: PocEnquiry;
  staticHosting?: boolean;
}) {
  const locale = useLocale();
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  const enterprise = enquiry === "enterprise";
  const requestLabel = enterprise ? text("企业项目询价", "enterprise project enquiry") : text("POC 申请", "POC request");
  const prefix = useId();
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<PocErrors>({});
  const [submission, setSubmission] = useState<Submission>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const id = (field: string) => `${prefix}-${field}`;
  const errorProps = (field: keyof PocErrors) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? id(`${field}-error`) : undefined,
  });
  const errorText = (field: keyof PocErrors) =>
    errors[field] ? (
      <span className={styles.fieldError} id={id(`${field}-error`)}>
        {errors[field]}
      </span>
    ) : null;
  if (submission.status === "success")
    return (
      <div className={styles.success} role="status">
        <div>
          <Check size={28} />
        </div>
        <h2>
          {enterprise ? text("已收到您的企业项目询价。", "We have received your enterprise enquiry.") : text("已收到您的 POC 申请。", "We have received your POC request.")}
        </h2>
        <p>
          {text("团队会通过您提供的邮箱与您沟通，进一步了解场景、环境和希望验证的目标。", "The team will contact you at the email you provided to discuss your use case, environment and validation goals.")}
        </p>
        <Link href={localizeHref("/docs/private-deployment", locale)}>
          {text("先了解企业接入准备", "Explore enterprise setup")} <ArrowRight size={15} />
        </Link>
      </div>
    );
  return (
    <form
      ref={form}
      className={styles.form}
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        if (submission.status === "sending") return;
        const values = new FormData(event.currentTarget);
        const result = validatePoc({
          requestType: enquiry,
          name: values.get("name"),
          company: values.get("company"),
          email: values.get("email"),
          role: values.get("role"),
          scenario: values.get("scenario"),
          needs: values.get("needs"),
          consent: values.get("consent") === "on",
        }, locale);
        if (!result.valid) {
          setErrors(result.errors);
          setSubmission({ status: "idle" });
          const first = Object.keys(result.errors)[0];
          form.current
            ?.querySelector<HTMLElement>(`[name="${first}"]`)
            ?.focus();
          return;
        }
        setErrors({});
        if (channel.mode === "email") {
          const data = result.data;
          const subject = `SkyMythos ${requestLabel} · ${data.company}`;
          const content = `${requestLabel}\n\n${text("姓名", "Name")}: ${data.name}\n${text("公司/组织", "Company/organization")}: ${data.company}\n${text("工作邮箱", "Work email")}: ${data.email}\n${text("职位", "Role")}: ${data.role || text("未填写", "Not provided")}\n${text("关注方向", "Area of interest")}: ${getPocScenarioLabel(data.scenario, locale)}\n\n${text("项目目标与需求", "Project goals and requirements")}:\n${data.needs}`;
          const mailtoHref = `mailto:${channel.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
          const anchor = document.createElement("a");
          anchor.href = mailtoHref;
          anchor.style.display = "none";
          document.body.append(anchor);
          anchor.click();
          anchor.remove();
          setCopied(false);
          setSubmission({ status: "email-ready", content, mailtoHref });
          return;
        }
        if (staticHosting) {
          setSubmission({
            status: "error",
            message:
              text("申请接收通道尚未开放，您的资料尚未发送。资料仍保留在当前页面，请稍后再试。", "The receiving service is not available yet. Your details have not been sent and remain on this page. Please try again later."),
          });
          return;
        }
        setSubmission({ status: "sending" });
        try {
          const response = await fetch("/api/poc", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept-Language": locale },
            body: JSON.stringify(result.data),
          });
          const body: unknown = await response.json();
          const resultBody =
            typeof body === "object" && body !== null
              ? (body as Record<string, unknown>)
              : {};
          if (response.ok && resultBody.ok === true)
            setSubmission({ status: "success" });
          else
            setSubmission({
              status: "error",
              message:
                typeof resultBody.message === "string"
                  ? resultBody.message
                  : text("暂时无法提交，请稍后重试。资料仍保留在当前页面。", "Unable to submit right now. Your details remain on this page. Please try again later."),
            });
        } catch {
          setSubmission({
            status: "error",
            message: text("网络连接未完成，资料仍保留在当前页面。请检查连接后重试。", "The connection did not complete. Your details remain on this page. Check your connection and try again."),
          });
        }
      }}
    >
      <div className={styles.formHeading}>
        <h2>{text("告诉我们您的需求", "Tell us about your needs")}</h2>
        <p>
          {enterprise
            ? text("说明项目目标、部署条件与预计规模，用于方案与报价评估。", "Describe your goals, deployment conditions and expected scale so we can assess a proposal and quote.")
            : text("先了解场景，再一起明确 POC 的目标与验收方式。", "Start with the use case, then agree on POC goals and acceptance criteria.")}
        </p>
      </div>
      <div className={styles.fields}>
        <div>
          <label htmlFor={id("name")}>
            {text("姓名", "Name")} <span>*</span>
          </label>
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder={text("您的姓名", "Your name")}
            required
            {...errorProps("name")}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor={id("company")}>
            {text("公司 / 组织", "Company / organization")} <span>*</span>
          </label>
          <input
            id={id("company")}
            name="company"
            autoComplete="organization"
            maxLength={120}
            placeholder={text("公司或组织名称", "Company or organization name")}
            required
            {...errorProps("company")}
          />
          {errorText("company")}
        </div>
        <div>
          <label htmlFor={id("email")}>
            {text("工作邮箱", "Work email")} <span>*</span>
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@company.com"
            required
            {...errorProps("email")}
          />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor={id("role")}>
            {text("职位", "Role")} <small>{text("选填", "optional")}</small>
          </label>
          <input
            id={id("role")}
            name="role"
            autoComplete="organization-title"
            maxLength={80}
            placeholder={text("您在团队中的角色", "Your role in the team")}
            {...errorProps("role")}
          />
          {errorText("role")}
        </div>
        <div className={styles.fullField}>
          <label htmlFor={id("scenario")}>
            {text("关注方向", "Area of interest")} <span>*</span>
          </label>
          <select
            id={id("scenario")}
            name="scenario"
            required
            defaultValue=""
            {...errorProps("scenario")}
          >
            <option value="" disabled>
              {text("请选择希望评估的方向", "Choose an area of interest")}
            </option>
            {pocScenarios.map((option) => (
              <option key={option} value={option}>{getPocScenarioLabel(option, locale)}</option>
            ))}
          </select>
          {errorText("scenario")}
        </div>
        <div className={styles.fullField}>
          <label htmlFor={id("needs")}>
            {enterprise ? text("企业项目希望实现什么？", "What should your enterprise project achieve?") : text("希望通过 POC 验证什么？", "What would you like to validate in a POC?")}{" "}
            <span>*</span>
          </label>
          <textarea
            id={id("needs")}
            name="needs"
            rows={4}
            maxLength={2000}
            placeholder={text("例如：希望为研发团队验证从需求到代码交付的流程，或将现有企业知识用于数字员工工作。", "For example: validate a requirements-to-code workflow for your engineering team, or connect enterprise knowledge to AI employees.")}
            required
            {...errorProps("needs")}
          />
          {errorText("needs")}
        </div>
      </div>
      <div className={styles.consent}>
        <input
          id={id("consent")}
          name="consent"
          type="checkbox"
          required
          {...errorProps("consent")}
        />
        <label htmlFor={id("consent")}>
          {locale === "zh" ? `我同意团队就本次${requestLabel}与我联系，并已阅读` : `I agree to be contacted about this ${requestLabel} and have read the `}
          <Link
            href={localizeHref("/privacy", locale)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={text("信息使用说明（新窗口打开）", "Information use (opens in a new window)")}
          >
            {text("信息使用说明", "information use notice")}
          </Link>
          {locale === "zh" ? "。" : "."}
        </label>
      </div>
      {errorText("consent")}
      {channel.mode === "email" && submission.status === "idle" && (
        <p className={styles.channelNotice}>
          {text(
            `提交后将唤起您的本地邮件客户端，发送至 ${channel.email}。`,
            `Submitting opens your local email app addressed to ${channel.email}.`,
          )}
        </p>
      )}
      {channel.mode === "unconfigured" && (
        <p className={styles.channelNotice}>
          {text("申请接收通道尚在准备中，当前不会发送您的资料。", "The receiving service is being prepared. Your details will not be sent at this time.")}
        </p>
      )}
      {submission.status === "error" && (
        <p className={styles.submitError} role="alert">
          {submission.message}
        </p>
      )}
      {submission.status === "email-ready" && (
        <div className={styles.emailReady} role="status">
          <Mail size={18} />
          <p>
            {text(
              `已为您生成发送至 ${channel.mode === "email" ? channel.email : "团队邮箱"} 的邮件草稿，请在本地邮件客户端确认并发送。如未自动弹出邮件应用，可点击下方按钮或复制正文手动发送。`,
              `Your draft email to ${channel.mode === "email" ? channel.email : "our team"} is ready. Confirm and send it in your local email app, or use the actions below to reopen or copy the message.`,
            )}
          </p>
          <div className={styles.emailActions}>
            <a
              href={submission.mailtoHref}
              className={styles.emailActionPrimary}
            >
              <Mail size={14} aria-hidden="true" />
              {text("打开邮件应用", "Open Email App")}
            </a>
            <button
              type="button"
              className={styles.emailActionSecondary}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(submission.content);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? text("已复制邮件内容", "Copied") : text("复制邮件全文", "Copy Email Body")}
            </button>
          </div>
          <textarea
            aria-label={text("申请邮件内容", "Enquiry email content")}
            readOnly
            rows={7}
            value={submission.content}
          />
        </div>
      )}
      <Button
        className={styles.submit}
        type="submit"
        disabled={submission.status === "sending"}
      >
        {submission.status === "sending" ? (
          <>
            <LoaderCircle className={styles.spinner} size={16} />
            {text("正在提交", "Submitting")}
          </>
        ) : channel.mode === "email" ? (
          <>
            {enterprise
              ? text("通过邮件发送项目询价", "Send Enterprise Enquiry via Email")
              : text("通过邮件发送 POC 申请", "Send POC Request via Email")}{" "}
            <Mail size={16} />
          </>
        ) : (
          <>
            {enterprise ? text("提交项目询价", "Send enterprise enquiry") : text("提交 POC 申请", "Send POC request")}{" "}
            <ArrowRight size={16} />
          </>
        )}
      </Button>
      <p className={styles.footnote}>
        {enterprise
          ? text("您的资料仅用于此次企业项目询价与需求沟通。", "Your details are used only to discuss this enterprise enquiry and your requirements.")
          : text("您的资料仅用于此次 POC 联系与需求沟通。", "Your details are used only to discuss this POC request and your requirements.")}
      </p>
    </form>
  );
}
