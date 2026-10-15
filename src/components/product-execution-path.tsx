"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

const stages = {
  zh: [
    ["提出工作", "Console → Control Plane", "工作台提交输入。控制面检查身份与工作范围，保存任务记录。"],
    ["准备执行", "Preflight → Sandbox Provider", "预检解析本次执行所需的流程、模型、能力与输入，再准备运行环境。"],
    ["推进工作", "Runner → Agent Harness", "运行器推进依赖与执行尝试；Harness 在环境里运行 Agent，会话和事件可在界面中查看。"],
    ["验证交付", "Artifact → Control Plane", "执行按约定生成产物、摘要与门禁结果。控制面保存任务生命周期与交付引用。"],
  ],
  en: [
    ["Request work", "Console → Control Plane", "The workbench submits inputs. The control plane checks identity and scope, then saves the task record."],
    ["Prepare the run", "Preflight → Sandbox Provider", "Preflight resolves the flow, models, capabilities and inputs for this run, before preparing the environment."],
    ["Execute the work", "Runner → Agent Harness", "The runner advances dependencies and attempts. A harness runs the agent in the environment; sessions and events are visible in the console."],
    ["Verify delivery", "Artifact → Control Plane", "Execution produces the declared outputs, summaries and gate results. The control plane keeps the task lifecycle and delivery references."],
  ],
} as const;

function SystemNode({ name, children, active }: { name: string; children: React.ReactNode; active: boolean }) {
  return <div className="product-system-node" data-active={active}><strong>{name}</strong><p>{children}</p></div>;
}

/** 选择一次任务所处的阶段，定位组件边界；图中保留完整的静态阅读内容。 */
export function ProductExecutionPath({ locale }: { locale: Locale }) {
  const [stage, setStage] = useState(0);
  const zh = locale === "zh";
  const items = stages[locale];
  return (
    <figure className="product-execution-figure">
      <div className="product-system-map">
        <div className="product-system-console" data-active={stage === 0}>
          <strong>Console</strong><p>{zh ? "工作台 · 员工 · 任务 · 知识 · 运行观测" : "Workbench · employees · tasks · knowledge · observability"}</p>
        </div>
        <div className="product-system-entry" aria-hidden="true">↓<span>{zh ? "经授权的产品接口" : "Authorised product APIs"}</span></div>
        <div className="product-system-lanes">
          <div className="product-system-governance">
            <h3>{zh ? "产品与治理" : "Product and governance"}</h3>
            <SystemNode name="Control Plane" active={stage !== 2}>{zh ? "身份与范围 · 配置版本 · 任务生命周期" : "Identity and scope · configuration versions · task lifecycle"}</SystemNode>
            <SystemNode name="Sandbox Provider" active={stage === 1}>{zh ? "环境的创建、观察、绑定与清理" : "Provision, observe, bind and clean up environments"}</SystemNode>
            <p className="product-system-authority">{zh ? "业务状态留在控制面" : "Business state belongs to the control plane"}</p>
          </div>
          <div className="product-system-transfer" aria-hidden="true"><span>{zh ? "供给环境" : "Provision"}</span><span>→</span><span>{zh ? "授予执行" : "Grant execution"}</span></div>
          <div className="product-system-runtime">
            <h3>{zh ? "任务运行环境" : "Task execution environment"}</h3>
            <SystemNode name="Runner / Supervisor" active={stage === 2}>{zh ? "依赖推进 · 执行尝试 · 会话与事件" : "Dependencies · attempts · sessions and events"}</SystemNode>
            <SystemNode name="Agent Harness" active={stage === 2}>{zh ? "原生执行方式 · 模型 · Skill / MCP" : "Native execution · models · skills / MCP"}</SystemNode>
            <SystemNode name="Artifact & Gate" active={stage === 3}>{zh ? "声明产物 · 结果摘要 · 确定性检查" : "Declared outputs · result summary · deterministic checks"}</SystemNode>
          </div>
        </div>
        <div className="product-system-gateway"><strong>Sandbox Gateway</strong><p>{zh ? "Web / WebSocket 接入、终端与运行器通信，遵守相同授权边界。" : "Web / WebSocket access, terminals and runner communication follow the same authorisation boundaries."}</p></div>
      </div>
      <figcaption className="product-route-explainer">
        <p className="product-route-hint">{zh ? "选择一个阶段，查看任务走到哪里。" : "Choose a stage to follow the task."}</p>
        <div className="product-route-buttons" role="group" aria-label={zh ? "任务阶段" : "Task stage"}>
          {items.map(([title], index) => <button key={title} type="button" aria-pressed={index === stage} onClick={() => setStage(index)}>{title}<span aria-hidden="true">↗</span></button>)}
        </div>
        <div className="product-route-detail" aria-live="polite" aria-atomic="true"><strong>{items[stage][1]}</strong><p>{items[stage][2]}</p></div>
        <noscript><ol className="product-static-route">{items.slice(1).map(([title, path, detail]) => <li key={title}><strong>{title} · {path}</strong><p>{detail}</p></li>)}</ol></noscript>
      </figcaption>
    </figure>
  );
}
