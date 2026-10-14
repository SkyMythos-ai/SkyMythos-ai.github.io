import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";

const mark = `${basePath}/brand/logo-mark.svg`;
const edge = "#d9e2f2";

function Sheet({ x, y, width, height, shadow, children }: { x: number; y: number; width: number; height: number; shadow: string; children: ReactNode }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="4" y="6" width={width} height={height} rx="11" fill="#dce6fa" stroke="#c8d6ef"/>
    <path d={`M11 0H${width-20}L${width} 20V${height-11}Q${width} ${height} ${width-11} ${height}H11Q0 ${height} 0 ${height-11}V11Q0 0 11 0Z`} fill="#fff" stroke={edge} filter={shadow}/>
    <path d={`M${width-20} 0v12q0 8 8 8h12`} fill="#eff4ff" stroke={edge}/>
    <path d={`M12 ${height-5}H${width-12}`} stroke="#e6edfa"/>
    {children}
  </g>;
}

function Packet({ name }: { name: string }) {
  return <g data-motion={name} opacity="0"><rect x="-7" y="-9" width="14" height="18" rx="3" fill="#fff" stroke="#5479e6" strokeWidth="1.4"/><path d="M-3-3h6M-3 2h6" stroke="#5479e6"/></g>;
}

function AgentPort({ name, x, y, model, role, shadow }: { name: string; x: number; y: number; model: "Claude" | "Codex"; role: string; shadow: string }) {
  return <g data-motion={`agent-${name}`} transform={`translate(${x} ${y})`}>
    <rect x="1" y="4" width="216" height="68" rx="23" fill="#e4ebf9" stroke="#cedaf0"/>
    <rect width="216" height="68" rx="23" fill="#fff" fillOpacity=".97" stroke={edge} filter={shadow}/>
    <path d="M27 3h162M215 26v16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <rect x="11" y="11" width="46" height="46" rx="23" fill={model === "Claude" ? "#fbf1ec" : "#f0f3f9"}/>
    <image href={`${basePath}/brand/${model === "Claude" ? "claude-symbol" : "openai-blossom"}.svg`} x={model === "Claude" ? "19" : "10"} y={model === "Claude" ? "19" : "10"} width={model === "Claude" ? "30" : "48"} height={model === "Claude" ? "30" : "48"}/>
    <text x="70" y="29" className="work-agent-name">{model}</text>
    <text x="70" y="49" className="work-agent-role"><tspan className="work-role-prefix">Agent · </tspan>{role}</text>
    <circle data-motion={`status-${name}`} cx="196" cy="24" r="3.5" fill="#3156ff"/>
    <path data-motion={`ready-${name}`} d="m189 43 4 4 8-9" pathLength="100" stroke="#4e6fe0" strokeWidth="1.8" strokeLinecap="round"/>
  </g>;
}

/** 执行端、产物和协作中枢各有身份；连线承载任务，纸面内容承载结果。 */
export function CollaborationVisual({ locale, prefix }: { locale: Locale; prefix: string }) {
  const zh = locale === "zh";
  const t = (cn: string, en: string) => zh ? cn : en;
  const shadow = `url(#${prefix}-shadow)`;
  return <g className="work-visual">
    <ellipse cx="320" cy="285" rx="130" ry="73" stroke="#d9e3f5" strokeWidth=".8" strokeDasharray="2 8"/>
    <g stroke="#cdd7e9" strokeWidth="1.1" strokeDasharray="2 6"><path d="M320 135v99M253 239C229 216 208 191 171 172M391 239C426 211 450 194 487 180M212 272h-39M428 272h41M246 302C218 347 173 359 153 390M392 302C420 350 470 362 488 394M118 335C110 359 109 374 127 390M526 332C540 358 528 381 510 394M262 372C283 378 283 390 294 404M380 370C359 379 357 390 347 404"/></g>
    <path data-motion="dispatch-a" d="M253 239C229 216 208 191 171 172" pathLength="100" stroke="#7b95e5" strokeWidth="1.8"/>
    <path data-motion="dispatch-b" d="M391 239C426 211 450 194 487 180" pathLength="100" stroke="#7b95e5" strokeWidth="1.8"/>
    <path data-motion="dispatch-c" d="M246 302C218 347 173 359 153 390" pathLength="100" stroke="#7b95e5" strokeWidth="1.8"/>
    <path data-motion="dispatch-d" d="M392 302C420 350 470 362 488 394" pathLength="100" stroke="#7b95e5" strokeWidth="1.8"/>
    <Sheet x={286} y={57} width={68} height={79} shadow={shadow}><path d="M15 18h38M15 29h30M15 40h36" stroke="#9aadd3" strokeWidth="3" strokeLinecap="round"/><text x="34" y="65" textAnchor="middle" className="work-paper-label">{t("目标", "Goal")}</text></Sheet>
    <AgentPort name="a" x={45} y={104} model="Claude" role={t("方案", "Plan")} shadow={shadow}/>
    <AgentPort name="b" x={379} y={112} model="Codex" role={t("实现", "Build")} shadow={shadow}/>
    <AgentPort name="c" x={45} y={390} model="Claude" role={t("审查", "Review")} shadow={shadow}/>
    <AgentPort name="d" x={379} y={394} model="Codex" role={t("验证", "Verify")} shadow={shadow}/>
    <path data-motion="produce-plan" d="M148 172C115 183 118 201 118 223" pathLength="100" stroke="#91a7db" strokeWidth="1.5"/>
    <path data-motion="produce-code" d="M501 180C530 187 526 202 526 220" pathLength="100" stroke="#91a7db" strokeWidth="1.5"/>
    <path data-motion="return-plan" d="M172 272h40" pathLength="100" stroke="#91a7db" strokeWidth="1.5"/>
    <path data-motion="return-code" d="M470 272h-42" pathLength="100" stroke="#91a7db" strokeWidth="1.5"/>
    <path data-motion="produce-review" d="M206 390C208 380 208 364 220 365" pathLength="100" stroke="#91a7db" strokeWidth="1.5"/>
    <path data-motion="produce-test" d="M441 394C433 380 435 365 422 365" pathLength="100" stroke="#91a7db" strokeWidth="1.5"/>
    <g data-motion="plan-sheet"><Sheet x={64} y={223} width={108} height={112} shadow={shadow}>
      <text x="14" y="26" className="work-paper-label">{t("方案", "Plan")}</text>
      <g data-motion="plan-lines"><path d="M15 43h72M15 53h52" stroke="#bdc9dd" strokeWidth="3" strokeLinecap="round"/><path d="M25 71h22v17H25zM63 71h22v17H63zM47 79h16M54 61v18" pathLength="100" stroke="#6d8be1" strokeWidth="1.5"/></g>
    </Sheet></g>
    <g data-motion="code-sheet"><Sheet x={470} y={220} width={112} height={112} shadow={shadow}>
      <path d="M0 27h112" stroke={edge}/><circle cx="13" cy="13" r="2.5" fill="#b1c1df"/><circle cx="23" cy="13" r="2.5" fill="#d2ddef"/><text x="74" y="18" className="work-tiny-label">code</text>
      <path data-motion="code-glyph" d="m31 41-10 10 10 10m49-20 10 10-10 10m-21-24-9 28" pathLength="100" stroke="#3156ff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      {[0,1,2].map(i=><path key={i} data-motion={`code-line-${i}`} d={`M17 ${78+i*10}h${i===1 ? 55 : 76}`} pathLength="100" stroke={i===1 ? "#91a7e1" : "#c1cde3"} strokeWidth="3" strokeLinecap="round"/>)}
    </Sheet></g>
    <g transform="translate(212 234)" filter={shadow}>
      <rect x="-6" y="1" width="228" height="85" rx="29" fill="#c6d6f7" stroke="#a8bde7"/>
      <rect x="-6" y="-6" width="228" height="85" rx="29" fill={`url(#${prefix}-rim)`}/>
      <rect width="216" height="76" rx="24" fill={`url(#${prefix}-core)`} stroke="#fff"/>
      <path d="M24 5h168M25 71h165" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <image href={mark} x="22" y="18" width="32" height="40"/><text x="70" y="35" className="work-hub-name">SkyMythos</text><text x="70" y="55" className="work-agent-role">{t("协作中枢", "Orchestrator")}</text>
      <rect data-motion="hub-response" width="216" height="76" rx="24" fill="none" stroke="#3156ff" strokeWidth="1.5" opacity="0"/>
    </g>
    <g data-motion="review-note" transform="translate(220 345)"><rect width="75" height="40" rx="10" fill="#fff" stroke={edge}/><path data-motion="review-check" d="m12 21 4 4 8-10" pathLength="100" stroke="#5479df" strokeWidth="1.7" strokeLinecap="round"/><path d="M31 15h29M31 23h22" stroke="#b8c7e1" strokeWidth="2.5" strokeLinecap="round"/></g>
    <g data-motion="test-note" transform="translate(347 345)"><rect width="75" height="40" rx="10" fill="#fff" stroke={edge}/><path data-motion="test-check" d="m12 21 4 4 8-10" pathLength="100" stroke="#5479df" strokeWidth="1.7" strokeLinecap="round"/><path d="M31 15h29M31 23h22" stroke="#b8c7e1" strokeWidth="2.5" strokeLinecap="round"/></g>
    <g data-motion="delivered" transform="translate(267 406)" filter={shadow}><rect x="2" y="4" width="108" height="72" rx="13" fill="#d4e1ff" stroke="#b5c7f2"/><rect width="108" height="72" rx="13" fill={`url(#${prefix}-core)`} stroke="#91abed"/><path d="M13 3h81" stroke="#fff" strokeWidth="2"/><path data-motion="deliver-check" d="m43 23 8 8 15-18" pathLength="100" stroke="#3156ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/><text x="54" y="55" textAnchor="middle" className="work-paper-label">{t("交付成果", "Delivered")}</text></g>
    {["goal-packet","packet-a","packet-b","packet-c","packet-d","plan-packet","code-packet","review-packet","test-packet"].map(name=><Packet key={name} name={name}/>)}
  </g>;
}

/** 同一身份完成工作；验证后的记忆和方法留在原处，再以副本参与下一任务。 */
export function IdentityVisual({ locale, prefix }: { locale: Locale; prefix: string }) {
  const zh = locale === "zh";
  const t = (cn: string, en: string) => zh ? cn : en;
  const shadow = `url(#${prefix}-shadow)`;
  return <g className="work-visual">
    <path d="M176 282C202 282 213 267 235 267M405 267C427 255 443 266 456 281M522 265C578 206 562 176 492 179M518 378C475 464 364 474 270 420M268 393C281 369 280 346 291 331M433 189C409 200 397 214 379 231" stroke="#cdd7e9" strokeWidth="1.3" strokeDasharray="3 6"/>
    <path data-motion="work-thread" d="M176 282C202 282 213 267 235 267" pathLength="100" stroke="#7d97e6" strokeWidth="1.8"/>
    <path data-motion="result-thread" d="M405 267C427 255 443 266 456 281" pathLength="100" stroke="#7d97e6" strokeWidth="1.8"/>
    <path data-motion="memory-thread" d="M522 265C578 206 562 176 492 179" pathLength="100" stroke="#8ca3dc" strokeWidth="1.5"/>
    <path data-motion="learning-loop" d="M518 378C475 464 364 474 270 420" pathLength="100" stroke="#8ca3dc" strokeWidth="1.5"/>
    <Sheet x={57} y={243} width={119} height={119} shadow={shadow}><path d="M15 16h15v19H15zM19 21h7m-7 5h7" stroke="#6381c8" strokeWidth="1.3"/><text data-motion="task-label" x="16" y="58" className="work-paper-label">{t("工作任务", "Task")}</text><path d="M17 77h85M17 89h66M17 101h76" stroke="#c3cfe4" strokeWidth="3" strokeLinecap="round"/></Sheet>
    <g transform="translate(235 202)" filter={shadow}>
      <rect x="-8" y="2" width="186" height="150" rx="33" fill="#bccff5" stroke="#9fb6e5"/>
      <rect x="-8" y="-8" width="186" height="150" rx="33" fill={`url(#${prefix}-rim)`}/>
      <rect width="170" height="138" rx="26" fill={`url(#${prefix}-core)`} stroke="#fff" strokeWidth="1.4"/>
      <path d="M28 5h114M8 29v58M162 30v56" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 133h114" stroke="#abc1ee" strokeWidth="1.2"/>
      <image href={mark} x="53" y="19" width="64" height="76"/>
      <text x="85" y="122" textAnchor="middle" className="work-hub-name">SkyMythos</text>
      <rect data-motion="identity-response" width="170" height="138" rx="26" fill="none" stroke="#3156ff" strokeWidth="1.8" opacity="0"/>
    </g>
    <text x="320" y="378" textAnchor="middle" className="work-agent-name">Agent</text>
    <Sheet x={385} y={79} width={187} height={110} shadow={shadow}><path d="M16 21h17v18H16zM21 26h7m-7 5h7" stroke="#7290d4" strokeWidth="1.3"/><text x="44" y="36" className="work-agent-name">Memory</text><g data-motion="memory-record"><rect x="13" y="51" width="161" height="43" rx="7" fill="#edf2ff"/><path d="M26 65h126M26 78h91" pathLength="100" stroke="#849fe0" strokeWidth="3" strokeLinecap="round"/><circle cx="159" cy="77" r="3" fill="#3156ff"/></g></Sheet>
    <Sheet x={89} y={367} width={181} height={96} shadow={shadow}><text x="18" y="30" className="work-agent-name">Skill</text><g data-motion="skill-method"><rect x="15" y="44" width="151" height="35" rx="7" fill="#edf2ff"/><path data-motion="skill-function" d="m34 52-9 9 9 9m20-18 9 9-9 9m-8-20-5 21" pathLength="100" stroke="#3156ff" strokeWidth="1.8" strokeLinecap="round"/><path d="M77 56h68M77 66h50" stroke="#a2b5e0" strokeWidth="2.6" strokeLinecap="round"/></g></Sheet>
    <Sheet x={456} y={265} width={125} height={113} shadow={shadow}><text x="15" y="27" className="work-paper-label">{t("工作成果", "Result")}</text><g data-motion="result-content"><path d="M17 47h86M17 59h69M17 71h80" pathLength="100" stroke="#a0b5e4" strokeWidth="3" strokeLinecap="round"/><path data-motion="result-check" d="m83 89 5 5 10-11" pathLength="100" stroke="#3156ff" strokeWidth="1.8" strokeLinecap="round"/></g></Sheet>
    <g data-motion="feedback-evidence" opacity="0"><rect x="-10" y="-13" width="20" height="27" rx="3" fill="#fff" stroke="#7192dc"/><path d="M-5-3H5M-5 3H3" stroke="#91a8da"/><path data-motion="feedback-check" d="m-5 7 3 3 5-6" pathLength="100" stroke="#3156ff" strokeWidth="1.4"/></g>
    <g data-motion="memory-reuse" opacity="0"><rect x="-12" y="-9" width="24" height="18" rx="4" fill="#edf2ff" stroke="#7896dd"/><path d="M-7-2H7M-7 3H3" stroke="#7896dd"/></g>
    <g data-motion="skill-reuse" opacity="0"><path d="m-7-6-6 6 6 6m14-12 6 6-6 6m-5-15-4 18" stroke="#3156ff" strokeWidth="1.8" strokeLinecap="round"/></g>
    <Packet name="task-first"/><Packet name="task-next"/>
    <text x="337" y="479" className="work-agent-role">{t("RSI · 持续改进方向", "RSI · Improvement direction")}</text>
  </g>;
}
