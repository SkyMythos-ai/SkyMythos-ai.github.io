"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  pocScenarios,
  validatePoc,
  type PocChannel,
  type PocErrors,
  type PocEnquiry,
} from "@/lib/poc";
import styles from "./poc.module.css";

type Submission =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success" }
  | { status: "email-ready"; content: string }
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
  const enterprise = enquiry === "enterprise";
  const requestLabel = enterprise ? "企业项目询价" : "POC 申请";
  const prefix = useId();
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<PocErrors>({});
  const [submission, setSubmission] = useState<Submission>({ status: "idle" });
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
          {enterprise ? "已收到您的企业项目询价。" : "已收到您的 POC 申请。"}
        </h2>
        <p>
          团队会通过您提供的邮箱与您沟通，进一步了解场景、环境和希望验证的目标。
        </p>
        <Link href="/docs/private-deployment">
          先了解企业接入准备 <ArrowRight size={15} />
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
        });
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
        if (staticHosting) {
          setSubmission({
            status: "error",
            message:
              "申请接收通道尚未开放，您的资料尚未发送。资料仍保留在当前页面，请稍后再试。",
          });
          return;
        }
        if (channel.mode === "email") {
          const data = result.data;
          const content = `${requestLabel}\n\n姓名：${data.name}\n公司/组织：${data.company}\n工作邮箱：${data.email}\n职位：${data.role || "未填写"}\n关注方向：${data.scenario}\n\n项目目标与需求：\n${data.needs}`;
          window.location.href = `mailto:${channel.email}?subject=${encodeURIComponent(`SkyMythos ${requestLabel} · ${data.company}`)}&body=${encodeURIComponent(content)}`;
          setSubmission({ status: "email-ready", content });
          return;
        }
        setSubmission({ status: "sending" });
        try {
          const response = await fetch("/api/poc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
                  : "暂时无法提交，请稍后重试。资料仍保留在当前页面。",
            });
        } catch {
          setSubmission({
            status: "error",
            message: "网络连接未完成，资料仍保留在当前页面。请检查连接后重试。",
          });
        }
      }}
    >
      <div className={styles.formHeading}>
        <h2>告诉我们您的需求</h2>
        <p>
          {enterprise
            ? "说明项目目标、部署条件与预计规模，用于方案与报价评估。"
            : "先了解场景，再一起明确 POC 的目标与验收方式。"}
        </p>
      </div>
      <div className={styles.fields}>
        <div>
          <label htmlFor={id("name")}>
            姓名 <span>*</span>
          </label>
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder="您的姓名"
            required
            {...errorProps("name")}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor={id("company")}>
            公司 / 组织 <span>*</span>
          </label>
          <input
            id={id("company")}
            name="company"
            autoComplete="organization"
            maxLength={120}
            placeholder="公司或组织名称"
            required
            {...errorProps("company")}
          />
          {errorText("company")}
        </div>
        <div>
          <label htmlFor={id("email")}>
            工作邮箱 <span>*</span>
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
            职位 <small>选填</small>
          </label>
          <input
            id={id("role")}
            name="role"
            autoComplete="organization-title"
            maxLength={80}
            placeholder="您在团队中的角色"
            {...errorProps("role")}
          />
          {errorText("role")}
        </div>
        <div className={styles.fullField}>
          <label htmlFor={id("scenario")}>
            关注方向 <span>*</span>
          </label>
          <select
            id={id("scenario")}
            name="scenario"
            required
            defaultValue=""
            {...errorProps("scenario")}
          >
            <option value="" disabled>
              请选择希望评估的方向
            </option>
            {pocScenarios.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {errorText("scenario")}
        </div>
        <div className={styles.fullField}>
          <label htmlFor={id("needs")}>
            {enterprise ? "企业项目希望实现什么？" : "希望通过 POC 验证什么？"}{" "}
            <span>*</span>
          </label>
          <textarea
            id={id("needs")}
            name="needs"
            rows={4}
            maxLength={2000}
            placeholder="例如：希望为研发团队验证从需求到代码交付的流程，或将现有企业知识用于数字员工工作。"
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
          我同意团队就本次{requestLabel}与我联系，并已阅读
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="信息使用说明（新窗口打开）"
          >
            信息使用说明
          </Link>
          。
        </label>
      </div>
      {errorText("consent")}
      {channel.mode === "unconfigured" && (
        <p className={styles.channelNotice}>
          申请接收通道尚在准备中，当前不会发送您的资料。
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
            申请邮件已准备好，请在邮件应用中确认并发送。若未打开邮件应用，可将以下内容发送至{" "}
            {channel.mode === "email" ? channel.email : "团队邮箱"}。
          </p>
          <textarea
            aria-label="申请邮件内容"
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
            正在提交
          </>
        ) : channel.mode === "email" ? (
          <>
            生成申请邮件 <ArrowRight size={16} />
          </>
        ) : (
          <>
            {enterprise ? "提交项目询价" : "提交 POC 申请"}{" "}
            <ArrowRight size={16} />
          </>
        )}
      </Button>
      <p className={styles.footnote}>
        {enterprise
          ? "您的资料仅用于此次企业项目询价与需求沟通。"
          : "您的资料仅用于此次 POC 联系与需求沟通。"}
      </p>
    </form>
  );
}
