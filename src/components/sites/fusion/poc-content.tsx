"use client";

import { useSearchParams } from "next/navigation";
import { MessageSquareText, ClipboardCheck, Workflow } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { PocForm } from "./poc-form";
import type { PocChannel, PocEnquiry } from "@/lib/poc";
import site from "./site.module.css";
import styles from "./poc.module.css";

export function PocContent({
  channel,
  initialEnquiry,
  staticHosting,
}: {
  channel: PocChannel;
  initialEnquiry: PocEnquiry;
  staticHosting: boolean;
}) {
  const locale = useLocale();
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  const params = useSearchParams();
  const enterprise = (params.get("enquiry") ?? initialEnquiry) === "enterprise";

  return (
    <main id="main-content" className={`${site.container} ${site.article}`}>
      <div className={styles.layout}>
        <section className={styles.intro}>
          <h1>
            {enterprise ? text("从你的企业需求，", "Start with your needs.") : text("从你的业务场景，", "Start with your use case.")}
            <br />
            {enterprise ? text("明确项目与报价。", "Define the project and quote.") : text("开始一次 POC。", "Define a POC together.")}
          </h1>
          <p>
            {enterprise
              ? text("说明目标、现有环境和预计使用范围，一起评估部署、集成与服务需求，明确项目方案和报价边界。", "Describe your goals, environment and expected usage. Together, we can assess deployment, integration and support to define the proposal and quote.")
              : text("告诉我们希望解决的问题。一起评估 SkyMythos 如何连接你的团队、工作与知识，明确一个可以验证的目标。", "Tell us what you want to solve. Assess how SkyMythos can connect your team, work and knowledge, and define a goal you can validate.")}
          </p>
          <ul className={styles.process}>
            <li>
              <MessageSquareText />
              <div>
                <h2>{text("沟通真实场景", "Discuss the use case")}</h2>
                <p>{text("了解目标、现有流程与希望改进的环节。", "Understand your goals, current process and opportunities to improve.")}</p>
              </div>
            </li>
            <li>
              <Workflow />
              <div>
                <h2>{text("评估接入条件", "Review setup requirements")}</h2>
                <p>{text("核对环境、模型、工具与资料的访问范围。", "Review the environment, models, tools and access to materials.")}</p>
              </div>
            </li>
            <li>
              <ClipboardCheck />
              <div>
                <h2>{text("约定验证标准", "Agree on acceptance criteria")}</h2>
                <p>
                  {enterprise
                    ? text("明确项目范围、费用边界、交付与验收方式。", "Define project scope, cost boundaries, deliverables and acceptance.")
                    : text("明确 POC 范围、交付结果与验收方式。", "Define POC scope, deliverables and acceptance criteria.")}
                </p>
              </div>
            </li>
          </ul>
        </section>
        <PocForm
          channel={channel}
          enquiry={enterprise ? "enterprise" : "poc"}
          staticHosting={staticHosting}
        />
      </div>
    </main>
  );
}
