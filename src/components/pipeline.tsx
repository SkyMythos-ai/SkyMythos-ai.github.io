import type { Locale } from "@/lib/i18n";

/**
 * Pipeline — the execution chain, rendered as an engineering diagram.
 *
 * This is the only place on the site where numbered markers are used, and they
 * are used because the content genuinely is a sequence: preflight runs before
 * provisioning, which runs before execution, and each step is gated on the
 * previous one succeeding. The numbers are a rail index, not a decorative motif.
 *
 * The diagram shows real structure rather than a generic arrow chain:
 *   - a gated spine, where each step fails closed and hands off a frozen artefact
 *   - the sandbox boundary drawn explicitly, because "what runs where" is the
 *     product's central architectural claim
 *   - authority annotations naming which component is authoritative at each step
 *
 * Rendered as semantic markup with a table-like grid, so the diagram survives
 * without colour and reads correctly to a screen reader as a sequence of steps.
 */

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

export function Pipeline({ locale }: { locale: Locale }) {
  const steps = buildSteps(locale);
  const sandboxCount = steps.filter((step) => step.inSandbox).length;

  const labels =
    locale === "zh"
      ? {
          sandbox: "任务沙箱边界之内",
          sandboxNote: "一任务一沙箱。Supervisor 是这里的调度权威。",
          authority: "状态权威",
          gate: "门禁",
        }
      : {
          sandbox: "Inside the task sandbox boundary",
          sandboxNote:
            "One sandbox per task. The supervisor is the scheduling authority here.",
          authority: "authority",
          gate: "gate",
        };

  return (
    <div>
      {/*
        Column headers. The three columns are numbered because this genuinely is
        a stepped process, not because numbered markers look technical.
      */}
      <div
        aria-hidden="true"
        className="hidden grid-cols-[3rem_minmax(0,1fr)_9.5rem] gap-x-5 border-b border-rule-strong pb-2 lg:grid"
      >
        <span className="rail-label">step</span>
        <span className="rail-label">state</span>
        <span className="rail-label">{labels.authority}</span>
      </div>

      <ol className="mt-0">
        {steps.map((step, index) => {
          const previous = steps[index - 1];
          /**
           * Draw the sandbox boundary as a labelled band the first time a step
           * moves inside it. This is the site's one explicit structural device:
           * it divides "where the platform governs" from "where the agent runs",
           * which is the claim the architecture page goes on to defend.
           */
          const entersSandbox = step.inSandbox && !previous?.inSandbox;

          return (
            <li key={step.name}>
              {entersSandbox ? (
                <div className="flex items-center gap-3 border-y border-signal/25 bg-signal-wash/60 px-3 py-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 14 14"
                    className="h-3.5 w-3.5 shrink-0 text-signal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" />
                    <path d="M1.5 5h11M5 5v7.5" />
                  </svg>
                  <span className="fact-sm font-medium text-signal">
                    {labels.sandbox}
                  </span>
                  <span className="fact-sm hidden text-signal/75 md:inline">
                    {labels.sandboxNote}
                  </span>
                </div>
              ) : null}

              <div className="grid gap-x-5 gap-y-1.5 border-b border-rule-soft py-4 lg:grid-cols-[3rem_minmax(0,1fr)_9.5rem]">
                <span className="fact-sm text-ink-4 lg:pt-[3px]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h3 className="flex items-baseline gap-2.5 text-[0.9375rem] font-semibold text-ink">
                    {step.name}
                    {/*
                      Each step is gated on the previous one succeeding. Marking
                      that is information: it explains why a late failure does
                      not leave half-built infrastructure behind.
                    */}
                    {index > 0 ? (
                      <span className="fact-sm font-normal text-ink-4">
                        ← {labels.gate}
                      </span>
                    ) : null}
                  </h3>
                  <p className="measure mt-1.5 text-[0.875rem] leading-[1.65] text-ink-3">
                    {step.detail}
                  </p>
                </div>

                <span className="fact-sm text-ink-4 lg:pt-[3px]">{step.authority}</span>
              </div>
            </li>
          );
        })}
      </ol>

      {/*
        Closing count. States how much of the chain runs inside the sandbox,
        so the boundary band above is quantified rather than implied.
      */}
      <p className="fact-sm mt-4 text-ink-4">
        {locale === "zh"
          ? `合计 ${steps.length} 步，其中 ${sandboxCount} 步位于沙箱边界内。`
          : `${steps.length} steps in total, ${sandboxCount} of them inside the sandbox boundary.`}
      </p>
    </div>
  );
}
