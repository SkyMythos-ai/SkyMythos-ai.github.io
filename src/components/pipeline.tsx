import type { Locale } from "@/lib/i18n";

/** 七步执行链：以闭合分组明确沙箱边界，详细契约按需展开。 */
interface PipelineStep {
  /** Step name — the persisted state the control plane moves through. */
  name: string;
  detail: string;
  /** Who is authoritative for this step's state. Rendered in mono. */
  authority: string;
  /** True for steps that occur inside the task sandbox boundary. */
  inSandbox: boolean;
}

function buildSteps(locale: Locale): PipelineStep[] {
  if (locale === "zh") {
    return [
      {
        name: "创建",
        detail:
          "持久化任务记录并返回标识。此时还没有任何沙箱资源，失败不会留下孤儿 Pod。",
        authority: "control plane",
        inSandbox: false,
      },
      {
        name: "预检",
        detail:
          "以当前身份与工作范围重新授权，确定性校验仓库、依赖图、模式与预算，冻结不可变规格。失败保留结构化检查结果。",
        authority: "control plane",
        inSandbox: false,
      },
      {
        name: "供给",
        detail:
          "创建沙箱，克隆仓库到具体提交，物化需求与能力包，配置运行时并启动 Agent。",
        authority: "control plane → provider",
        inSandbox: false,
      },
      {
        name: "执行",
        detail:
          "Supervisor 选择依赖已满足的节点，受配额约束并行运行独立 Agent 会话，处理等待、失败、返工与取消。",
        authority: "sandbox supervisor",
        inSandbox: true,
      },
      {
        name: "交接",
        detail:
          "成功执行按契约冻结声明产物、清单与结果摘要，写入 Agent 可写目录之外的只读快照。",
        authority: "sandbox supervisor",
        inSandbox: true,
      },
      {
        name: "交付",
        detail:
          "受控完成步骤推送检查点分支并幂等创建变更请求。该步骤使用的凭据对 Agent 会话不可见。",
        authority: "sandbox → git",
        inSandbox: true,
      },
      {
        name: "归并",
        detail:
          "从输入、产物、代码变更与验证结果产生知识增量，综合为可审阅的正式认知，供后续任务按冻结版本召回。",
        authority: "control plane",
        inSandbox: false,
      },
    ];
  }

  return [
    {
      name: "Create",
      detail:
        "Persist the task record and return an identifier. No sandbox resource exists yet, so a failure here never leaves an orphaned pod.",
      authority: "control plane",
      inSandbox: false,
    },
    {
      name: "Preflight",
      detail:
        "Re-authorise against the current principal and scope, check repository, dependency graph, schema and budget deterministically, then freeze an immutable specification. Failure keeps structured findings.",
      authority: "control plane",
      inSandbox: false,
    },
    {
      name: "Provision",
      detail:
        "Create the sandbox, clone the repository at a specific commit, materialise requirements and capability bundles, configure the runtime and start the agent.",
      authority: "control plane → provider",
      inSandbox: false,
    },
    {
      name: "Execute",
      detail:
        "The supervisor selects nodes with satisfied dependencies, runs independent agent sessions in parallel under quota, and handles waiting, failure, rework and cancellation.",
      authority: "sandbox supervisor",
      inSandbox: true,
    },
    {
      name: "Hand off",
      detail:
        "A successful attempt freezes its declared artefacts, manifest and result summary under contract, into a read-only snapshot outside the agent's writable directory.",
      authority: "sandbox supervisor",
      inSandbox: true,
    },
    {
      name: "Deliver",
      detail:
        "A controlled completion step pushes the checkpoint branch and idempotently creates a merge request. The credentials it uses are invisible to the agent session.",
      authority: "sandbox → git",
      inSandbox: true,
    },
    {
      name: "Consolidate",
      detail:
        "Produce a knowledge delta from inputs, artefacts, code changes and verification results, and synthesise it into reviewable formal cognition for later tasks to recall by frozen version.",
      authority: "control plane",
      inSandbox: false,
    },
  ];
}

function FlowArrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 16" fill="none" className={`h-4 w-8 shrink-0 text-ink-4 ${className}`}>
      <path d="M1 8h28M23 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Pipeline({ locale }: { locale: Locale }) {
  const steps = buildSteps(locale);
  const zh = locale === "zh";
  const groups = [
    { label: zh ? "控制面 · 准备" : "Control plane · Prepare", steps: steps.slice(0, 3), offset: 0, sandbox: false },
    { label: zh ? "任务沙箱 · Supervisor" : "Task sandbox · Supervisor", steps: steps.filter((step) => step.inSandbox), offset: 3, sandbox: true },
    { label: zh ? "控制面" : "Control plane", steps: steps.slice(6), offset: 6, sandbox: false },
  ];
  const outputs = zh
    ? ["任务记录", "冻结规格", "隔离环境", "Agent 协作", "冻结产物", "变更请求", "知识增量"]
    : ["Task record", "Frozen spec", "Environment", "Agent sessions", "Frozen artefacts", "Merge request", "Knowledge delta"];
  const iconPaths = [
    "M7 4h10v16H7zM10 9h4M10 13h4",
    "M6 11h12v9H6zM9 11V7a3 3 0 0 1 6 0v4",
    "M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10",
    "M4 5h5v5H4zM15 14h5v5h-5zM15 4h5v5h-5zM9 7h3v10h3M12 7h3",
    "M5 5h14v14H5zM8 12l3 3 5-6",
    "M6 4v10a4 4 0 0 0 4 4h8M14 14l4 4-4 4M10 7h8M14 3l4 4-4 4",
    "M4 5h7l1 2 1-2h7v14h-7l-1 2-1-2H4zM12 7v14",
  ];

  return (
    <div className="task-flow">
      <figure aria-label={zh ? "从任务创建到知识归并的七步流程" : "Seven steps from task creation to knowledge consolidation"}>
        <div className="task-flow-groups">
          {groups.map((group, groupIndex) => (
            <div key={group.label} className="contents">
              {groupIndex > 0 ? <FlowArrow className="task-flow-group-arrow" /> : null}
              <div className="task-flow-group" data-sandbox={group.sandbox} data-final={groupIndex === 2}>
                <p className="task-flow-group-label">{group.label}</p>
                <ol start={group.offset + 1} className="task-flow-steps">
                  {group.steps.map((step, index) => (
                    <li key={step.name}>
                      <div className="task-flow-step">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="task-flow-icon">
                          <path d={iconPaths[group.offset + index]} />
                        </svg>
                        <span className="task-flow-index">{String(group.offset + index + 1).padStart(2, "0")}</span>
                        <h3>{step.name}</h3>
                        <p>{outputs[group.offset + index]}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
        <figcaption className="mt-5 text-xs leading-relaxed text-ink-3">
          {zh ? "预检通过后才创建沙箱。一个任务，一个沙箱；完成后归并知识。" : "Provision only after preflight passes. One task, one sandbox; consolidate knowledge after completion."}
        </figcaption>
      </figure>

      <details className="group mt-8 border-y border-rule">
        <summary className="cursor-pointer py-4 text-sm font-medium text-ink-2">
          {zh ? "查看完整流程与状态权威" : "Explore the full process and state authority"}
        </summary>
        <ol className="grid gap-x-8 pb-5 md:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.name} className="border-t border-rule-soft py-4">
              <h3 className="text-sm font-semibold text-ink"><span className="fact-sm mr-3 text-ink-4">{String(index + 1).padStart(2, "0")}</span>{step.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">{step.detail}</p>
              <p className="fact-sm mt-3 text-ink-4">{step.authority}</p>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
