import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { cn } from "@/lib/cn";

/**
 * SpecPanel — the frozen execution specification, the hero's memorable object.
 *
 * This is the one place on the site where boldness is spent. Everything around it
 * is quiet: hairline rules, one ink colour, no gradients, no cards. The panel is
 * a facsimile of what the platform actually produces at the end of preflight —
 * a resolved, checked, digest-sealed specification — and it is annotated with the
 * real field names a SkyMythos user sees in the Task workbench.
 *
 * Which fields are shown is itself an argument. Repository, flow provenance, the
 * work node graph, the exact model and capability pins, the knowledge release set,
 * the budget, and a SHA-256 digest over the whole thing. Nothing here drifts at
 * runtime, and the digest is the proof.
 *
 * The panel is a single composed animation, not a set of independent fade-ins:
 * rows resolve top to bottom as preflight checks complete, a scan sweeps across
 * once, then the seal lands. After roughly two seconds the panel is permanently
 * still. All of it is CSS; the component stays a server component.
 */

interface SpecRow {
  /** Field name, in mono — this is a key, so it is a machine fact. */
  key: string;
  value: string;
  /** Rendered in the signal colour to mark the one field that is "live". */
  emphasis?: boolean;
  /** Rendered as a chip list rather than a single value. */
  chips?: string[];
}

function buildRows(locale: Locale): SpecRow[] {
  if (locale === "zh") {
    return [
      { key: "workspace", value: "payment-platform / q3-reliability" },
      { key: "repository", value: "git.internal/apigo/payment-gateway" },
      { key: "base_branch", value: "main @ 7c41e0a9" },
      { key: "flow", value: "generated · task-scoped", emphasis: true },
      {
        key: "worknodes",
        value: "",
        chips: ["analyze", "implement", "verify", "deliver"],
      },
      { key: "model", value: "claude-sonnet-4-6 · pinned", emphasis: true },
      {
        key: "capabilities",
        value: "",
        chips: ["skill@2.1.0", "mcp@0.4.3"],
      },
      { key: "knowledge", value: "release-set · 3 spaces" },
      { key: "budget", value: "max_cost 12.00 USD · max_turns 40" },
    ];
  }

  return [
    { key: "workspace", value: "payment-platform / q3-reliability" },
    { key: "repository", value: "git.internal/apigo/payment-gateway" },
    { key: "base_branch", value: "main @ 7c41e0a9" },
    { key: "flow", value: "generated · task-scoped", emphasis: true },
    {
      key: "worknodes",
      value: "",
      chips: ["analyze", "implement", "verify", "deliver"],
    },
    { key: "model", value: "claude-sonnet-4-6 · pinned", emphasis: true },
    {
      key: "capabilities",
      value: "",
      chips: ["skill@2.1.0", "mcp@0.4.3"],
    },
    { key: "knowledge", value: "release-set · 3 spaces" },
    { key: "budget", value: "max_cost 12.00 USD · max_turns 40" },
  ];
}

export function SpecPanel({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const rows = buildRows(locale);

  /**
   * Preflight checks, in the order the control plane actually performs them.
   * The sequence is real product behaviour, not invented theatre.
   */
  const checks =
    locale === "zh"
      ? [
          "重授权身份与工作范围",
          "校验仓库与基线提交",
          "编译依赖图并检查模式",
          "解析模型与能力版本",
          "冻结规格并计算摘要",
        ]
      : [
          "re-authorise principal and scope",
          "verify repository and base commit",
          "compile dependency graph",
          "resolve model and capability pins",
          "freeze specification and digest",
        ];

  return (
    <div className="relative">
      {/* Panel shell: outer enclosure with the concentric inner radius. */}
      <div className="rounded-[10px] border border-rule-strong bg-surface p-[3px] shadow-[0_1px_2px_rgba(20,23,26,0.04),0_12px_32px_-12px_rgba(20,23,26,0.10)]">
        <div className="overflow-hidden rounded-[7px] border border-rule-soft">
          {/* Panel header: title plus a live indicator. */}
          <div className="flex items-center justify-between gap-3 border-b border-rule-soft bg-sunken px-3.5 py-2.5">
            <span className="fact-sm text-ink-3">{dictionary.hero.specPanelLabel}</span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="caret h-1.5 w-1.5 rounded-full bg-signal"
              />
              <span className="fact-sm text-signal">preflight</span>
            </span>
          </div>

          {/*
            The scan sweep. A single absolutely-positioned pseudo-element runs
            once across the field area while the rows resolve, then stops. It is
            clipped by the panel, so it reads as an instrument passing over the
            document rather than a decorative shimmer.
          */}
          <div className="sweep relative">
            <dl className="divide-y divide-rule-soft">
              {rows.map((row, index) => (
                <div
                  key={row.key}
                  className="reveal grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-baseline gap-x-3 px-3.5 py-2"
                  style={{ animationDelay: `${120 + index * 85}ms` }}
                >
                  <dt className="fact-sm truncate text-ink-4">{row.key}</dt>
                  <dd className="min-w-0">
                    {row.chips ? (
                      <span className="flex flex-wrap gap-1">
                        {row.chips.map((chip) => (
                          <span
                            key={chip}
                            className="fact-sm rounded-[2px] border border-rule bg-sunken px-1.5 py-[1px] text-ink-2"
                          >
                            {chip}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "fact-sm block truncate",
                          row.emphasis ? "text-signal" : "text-ink-2",
                        )}
                      >
                        {row.value}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Preflight check sequence — the rows resolving above, spelled out. */}
          <div className="border-t border-rule-soft bg-sunken px-3.5 py-3">
            <ol className="space-y-1">
              {checks.map((check, index) => (
                <li
                  key={check}
                  className="reveal flex items-center gap-2"
                  style={{ animationDelay: `${560 + index * 105}ms` }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="h-3 w-3 shrink-0 text-signal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.2 6.3 4.8 8.9 9.8 3.4" />
                  </svg>
                  <span className="fact-sm text-ink-3">{check}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* The seal. This is the payload of the whole panel. */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-rule bg-surface px-3.5 py-3">
            <div className="seal flex items-center gap-2.5" style={{ animationDelay: "1120ms" }}>
              {/*
                The seal mark: a bracketed enclosure with a check inside — the
                same frozen-scope bracket as the wordmark, so the motif recurs
                with meaning rather than as ornament.
              */}
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-signal/30 bg-signal-wash">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 14 14"
                  className="h-3.5 w-3.5 text-signal"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7.2 5.8 10 11 4.2" />
                </svg>
              </span>
              <span className="flex flex-col">
                <span className="fact-sm font-medium text-ink">
                  {locale === "zh" ? "规格已封存" : "specification sealed"}
                </span>
                <span className="fact-sm text-ink-4">
                  sha256:4b8e1c0f9a7d…
                </span>
              </span>
            </div>

            <span className="fact-sm text-ink-4">
              {locale === "zh" ? "执行期不可变" : "immutable at runtime"}
            </span>
          </div>
        </div>
      </div>

      <p className="measure mt-3.5 px-1 text-[0.8125rem] leading-[1.6] text-ink-4">
        {dictionary.hero.specPanelNote}
      </p>
    </div>
  );
}
