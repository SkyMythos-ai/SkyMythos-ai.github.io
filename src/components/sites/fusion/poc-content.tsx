"use client";

import { useSearchParams } from "next/navigation";
import { MessageSquareText, ClipboardCheck, Workflow } from "lucide-react";
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
  const params = useSearchParams();
  const enterprise = (params.get("enquiry") ?? initialEnquiry) === "enterprise";

  return (
    <main id="main-content" className={`${site.container} ${site.article}`}>
      <div className={styles.layout}>
        <section className={styles.intro}>
          <h1>
            {enterprise ? "从你的企业需求，" : "从你的业务场景，"}
            <br />
            {enterprise ? "明确项目与报价。" : "开始一次 POC。"}
          </h1>
          <p>
            {enterprise
              ? "说明目标、现有环境和预计使用范围，一起评估部署、集成与服务需求，明确项目方案和报价边界。"
              : "告诉我们希望解决的问题。一起评估 SkyMythos 如何连接你的团队、工作与知识，明确一个可以验证的目标。"}
          </p>
          <ul className={styles.process}>
            <li>
              <MessageSquareText />
              <div>
                <h2>沟通真实场景</h2>
                <p>了解目标、现有流程与希望改进的环节。</p>
              </div>
            </li>
            <li>
              <Workflow />
              <div>
                <h2>评估接入条件</h2>
                <p>核对环境、模型、工具与资料的访问范围。</p>
              </div>
            </li>
            <li>
              <ClipboardCheck />
              <div>
                <h2>约定验证标准</h2>
                <p>
                  {enterprise
                    ? "明确项目范围、费用边界、交付与验收方式。"
                    : "明确 POC 范围、交付结果与验收方式。"}
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
