import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { employeeMaterial } from "@/components/employee-visual-material";

/** 640 × 560 原生 SVG；服务端默认展示 11.8 秒的完整成果。 */
export function IdentityVisual({ locale, prefix }: { locale: Locale; prefix: string }) {
  const t = (zh: string, en: string) => locale === "zh" ? zh : en;
  const p = employeeMaterial;
  return <g className="employee-visual">
    <defs>
      <linearGradient id={`${prefix}-identity-core`} x1="0" y1="0" x2="0.9" y2="1">
        <stop stopColor={p.faceTop}/>
        <stop offset="0.48" stopColor={p.face}/>
        <stop offset="1" stopColor={p.faceLow}/>
      </linearGradient>
      <linearGradient id={`${prefix}-identity-record`} x1="0" y1="0" x2="1" y2="0.75">
        <stop stopColor={p.faceTop}/>
        <stop offset="1" stopColor={p.face}/>
      </linearGradient>
      <linearGradient id={`${prefix}-identity-artifact`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={p.faceTop}/>
        <stop offset="1" stopColor={p.faceLow}/>
      </linearGradient>
      <filter id={`${prefix}-identity-shadow`} x="-25%" y="-20%" width="155%" height="150%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor={p.shadow} floodOpacity={p.shadowOpacity}/>
      </filter>
      <filter id={`${prefix}-identity-smallShadow`} x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor={p.shadow} floodOpacity={p.shadowOpacity * .7}/>
      </filter>
    </defs>
    <g fill="none" stroke={p.line} strokeWidth="0.7" opacity="0.6" aria-hidden="true">
      <path d="M256 351 176 398M388 347 458 393"/>
      <path d="M64 331H80M72 323V339M560 331H576M568 323V339"/>
      <path d="M306 100H334"/>
    </g>
    <g data-part="identity-task-one" transform="translate(106.000 137.000) scale(1.0000)" opacity="0.0000">
      <text className="motion-label" x="0" y="-59" textAnchor="middle" fill={p.secondary} fontSize="23" fontWeight="400">{t("任务 01", "Task 01")}</text>
      <g filter={`url(#${prefix}-identity-smallShadow)`}>
        <path d="M-40 -18 43 -45V29L-40 56Z" transform="translate(2 3)" fill={p.side}/>
        <path d="M-40 -18 43 -45V29L-40 56Z" fill={`url(#${prefix}-identity-artifact)`} stroke={p.edge} strokeWidth="0.85"/>
        <path d="M-34 -12 37 -35V24L-34 47Z" fill={p.inset} stroke={p.line} strokeWidth="0.65"/>
        <path d="M-25 5 29 -13M-25 16 12 4M-25 27 23 11" stroke={p.blue} strokeWidth="1.6"/>
        <path d="M-25 37 -10 32M-3 30 7 26" stroke={p.highlight} strokeWidth="0.8" opacity="0.65"/>
        <path d="M-33 -12 35 -34" stroke={p.highlight} strokeWidth="0.65" opacity="0.4"/>
      </g>
    </g>
    <g data-part="identity-task-two" transform="translate(106.000 137.000) scale(1.0000)" opacity="1.0000">
      <text className="motion-label" x="0" y="-59" textAnchor="middle" fill={p.secondary} fontSize="23" fontWeight="400">{t("下一任务", "Next task")}</text>
      <g filter={`url(#${prefix}-identity-smallShadow)`}>
        <path d="M-40 -18 43 -45V29L-40 56Z" transform="translate(2 3)" fill={p.side}/>
        <path d="M-40 -18 43 -45V29L-40 56Z" fill={`url(#${prefix}-identity-artifact)`} stroke={p.edge} strokeWidth="0.85"/>
        <path d="M-34 -12 37 -35V24L-34 47Z" fill={p.inset} stroke={p.line} strokeWidth="0.65"/>
        <path d="M-25 5 29 -13M-25 16 12 4M-25 27 23 11" stroke={p.blue} strokeWidth="1.6"/>
        <path d="M-25 37 -10 32M-3 30 7 26" stroke={p.highlight} strokeWidth="0.8" opacity="0.65"/>
        <path d="M-33 -12 35 -34" stroke={p.highlight} strokeWidth="0.65" opacity="0.4"/>
        <path d="M28 -27 33 -29V-23L28 -21Z" fill={p.mint}/>
      </g>
    </g>
    <g data-part="identity-input" opacity="0.0000" transform="translate(263.000 234.000) scale(0.7000)">
      <path d="M-14 -10 19 -21V20L-14 31Z" fill={p.face} stroke={p.edge} strokeWidth="0.8"/>
      <path d="M-7 0 12 -6M-7 9 8 4M-7 18 12 12" stroke={p.blue} strokeWidth="1.4"/>
    </g>
    <g data-part="identity-agent" transform="translate(320 246)">
      <g filter={`url(#${prefix}-identity-shadow)`}>
        <path d="M-75 -83 -69 -89H69L75 -83V77L69 83H-69L-75 77Z" transform="translate(3 4)" fill={p.side}/>
        <path d="M-75 -83 -69 -89H69L75 -83V77L69 83H-69L-75 77Z" fill={`url(#${prefix}-identity-core)`} stroke={p.edge} strokeWidth="0.85"/>
        <path d="M-68 -77 -63 -82H63L68 -77V70L63 75H-63L-68 70Z" fill={p.inset} stroke={p.line} strokeWidth="0.75"/>
        <path d="M-62 -81H62" stroke={p.highlight} strokeWidth="0.7" opacity="0.55"/>
        <path d="M-67 -71V-57M67 52V67" stroke={p.highlight} strokeWidth="0.8" opacity="0.3"/>
        <image href={`${basePath}/brand/logo-mark.svg`} x="-34" y="-54" width="68" height="81"/>
        <path d="M-52 55H-25M-11 55H11M26 55H53" stroke={p.line} strokeWidth="1.4"/>
        <g data-part="identity-process" opacity="1">
          <path d="M-52 55H-25M-11 55H11M26 55H53" stroke={p.blue} strokeWidth="1.4"/>
          <path d="M-60 -51V39M60 -51V39" stroke={p.blue} strokeWidth="0.7" opacity="0.48"/>
        </g>
      </g>
      <g data-part="identity-memory-dock" transform="translate(-87.000 30.000) scale(1.0000)" opacity="1.0000">
        <path d="M-9 -19 9 -25V21L-9 27Z" fill={p.face} stroke={p.edge} strokeWidth="0.75"/>
        <path d="M-4 -11 4 -14M-4 -2 4 -5M-4 7 4 4M-4 16 4 13" stroke={p.cyan} strokeWidth="1.4"/>
      </g>
      <g data-part="identity-skill-dock" transform="translate(89.000 30.000) scale(1.0000)" opacity="1.0000">
        <path d="M-9 -25 9 -19V27L-9 21Z" fill={p.face} stroke={p.edge} strokeWidth="0.75"/>
        <path d="M-3 -13 3 -11V-4L0 -5V7L3 8V16L-3 14" fill="none" stroke={p.violet} strokeWidth="1.5"/>
      </g>
      <text className="motion-label" x="0" y="138" textAnchor="middle" fill={p.ink} fontSize="27" fontWeight="400">Agent</text>
    </g>
    <g data-part="identity-feedback" transform="translate(407.000 278.000) scale(0.5000)" opacity="0.0000">
      <g filter={`url(#${prefix}-identity-smallShadow)`}>
        <path d="M-42 -19 42 -47V29L-42 57Z" transform="translate(2 3)" fill={p.side}/>
        <path d="M-42 -19 42 -47V29L-42 57Z" fill={`url(#${prefix}-identity-artifact)`} stroke={p.edge} strokeWidth="0.85"/>
        <path d="M-35 -13 35 -37V24L-35 47Z" fill={p.inset} stroke={p.line} strokeWidth="0.6"/>
        <path d="M-25 3 27 -15M-25 14 12 1M-25 25 24 8" stroke={p.blue} strokeWidth="1.7"/>
        <path d="M-25 35 -8 29M0 27 18 21" stroke={p.highlight} strokeWidth="0.9" opacity="0.58"/>
        <path d="M-34 -13 34 -36" stroke={p.highlight} strokeWidth="0.65" opacity="0.4"/>
      </g>
    </g>
    <g data-part="identity-result" transform="translate(509.000 160.000) scale(1.0000)" opacity="1.0000">
      <g filter={`url(#${prefix}-identity-smallShadow)`}>
        <path d="M-42 -19 42 -47V29L-42 57Z" transform="translate(2 3)" fill={p.side}/>
        <path d="M-42 -19 42 -47V29L-42 57Z" fill={`url(#${prefix}-identity-artifact)`} stroke={p.edge} strokeWidth="0.85"/>
        <path d="M-35 -13 35 -37V24L-35 47Z" fill={p.inset} stroke={p.line} strokeWidth="0.6"/>
        <path d="M-25 3 27 -15M-25 14 12 1M-25 25 24 8" stroke={p.mint} strokeWidth="1.7"/>
        <path d="M-25 35 -8 29M0 27 18 21" stroke={p.highlight} strokeWidth="0.9" opacity="0.58"/>
        <path d="M-34 -13 34 -36" stroke={p.highlight} strokeWidth="0.65" opacity="0.4"/>
      </g>
    </g>
    <g data-part="identity-verify" transform="translate(509.000 160.000) scale(1.0000)" opacity="1.0000">
      <g data-part="identity-verify-left" transform="translate(0 0)">
        <path d="M-55 -35V-14M-55 -35 -42 -39" fill="none" stroke={p.amber} strokeWidth="1.6"/>
      </g>
      <g data-part="identity-verify-right" transform="translate(0 0)">
        <path d="M55 31V10M55 31 42 35" fill="none" stroke={p.amber} strokeWidth="1.6"/>
      </g>
      <g data-part="identity-check" transform="translate(25 47) scale(1)" opacity="1">
        <rect x="-13" y="-13" width="26" height="26" rx="2" fill={p.face} stroke={p.amber} strokeWidth="0.75"/>
        <path d="M-6 0 -2 4 7 -5" fill="none" stroke={p.amber} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <text className="motion-label" x="0" y="-75" textAnchor="middle" fill={p.amber} fontSize="23" fontWeight="400">{t("已验证", "Verified")}</text>
    </g>
    <g data-part="identity-memory" transform="translate(148.000 414.000) scale(1.0000)" opacity="1.0000">
      <g filter={`url(#${prefix}-identity-smallShadow)`}>
        <path d="M-63 5 -11 -18 63 18 11 41V43L-63 7Z" fill={p.side}/>
        <path d="M-63 5 -11 -18 63 18 11 41Z" fill={p.faceLow} stroke={p.line} strokeWidth="0.7"/>
        <path d="M-51 8 9 37 51 19" fill="none" stroke={p.highlight} strokeWidth="0.55" opacity="0.35"/>
        <g data-part="identity-record-0" transform="translate(0.000 6.000) scale(1.0000)" opacity="1.0000">
          <path d="M-48 -8 5 -30 54 -6 1 16V19L-48 -5Z" fill={p.side}/>
          <path d="M-48 -8 5 -30 54 -6 1 16Z" fill={`url(#${prefix}-identity-record)`} stroke={p.edge} strokeWidth="0.75"/>
          <path d="M-35 -8 5 -24" stroke={p.cyan} strokeWidth="1.7"/>
          <path d="M-27 -3 24 -16M-17 2 22 -14" stroke={p.highlight} strokeWidth="0.9" opacity="0.58"/>
          <path d="M31 -11 40 -7" stroke={p.cyan} strokeWidth="1.2"/>
        </g>
        <g data-part="identity-record-1" transform="translate(0.000 -7.000) scale(1.0000)" opacity="1.0000">
          <path d="M-48 -8 5 -30 54 -6 1 16V19L-48 -5Z" fill={p.side}/>
          <path d="M-48 -8 5 -30 54 -6 1 16Z" fill={`url(#${prefix}-identity-record)`} stroke={p.edge} strokeWidth="0.75"/>
          <path d="M-35 -8 5 -24" stroke={p.cyan} strokeWidth="1.7"/>
          <path d="M-27 -3 31 -16M-17 2 22 -14" stroke={p.highlight} strokeWidth="0.9" opacity="0.58"/>
          <path d="M31 -11 40 -7" stroke={p.cyan} strokeWidth="1.2"/>
        </g>
        <g data-part="identity-record-2" transform="translate(0.000 -20.000) scale(1.0000)" opacity="1.0000">
          <path d="M-48 -8 5 -30 54 -6 1 16V19L-48 -5Z" fill={p.side}/>
          <path d="M-48 -8 5 -30 54 -6 1 16Z" fill={`url(#${prefix}-identity-record)`} stroke={p.edge} strokeWidth="0.75"/>
          <path d="M-35 -8 5 -24" stroke={p.cyan} strokeWidth="1.7"/>
          <path d="M-27 -3 18 -16M-17 2 22 -14" stroke={p.highlight} strokeWidth="0.9" opacity="0.58"/>
          <path d="M31 -11 40 -7" stroke={p.cyan} strokeWidth="1.2"/>
        </g>
      </g>
      <g data-part="identity-memory-label" opacity="1" transform="translate(0 0)">
        <text className="motion-label" x="0" y="91" textAnchor="middle" fill={p.ink} fontSize="27" fontWeight="400">Memory</text>
        <text className="motion-secondary" x="0" y="119" textAnchor="middle" fill={p.secondary} fontSize="22" fontWeight="400">{t("证据留存", "Retain evidence")}</text>
      </g>
    </g>
    <g data-part="identity-skill" transform="translate(493.000 412.000) scale(1.0000)" opacity="1.0000">
      <g filter={`url(#${prefix}-identity-smallShadow)`}>
        <path d="M-62 6 -9 -20 62 15 9 42V44L-62 8Z" fill={p.side}/>
        <path d="M-62 6 -9 -20 62 15 9 42Z" fill={p.faceLow} stroke={p.line} strokeWidth="0.7"/>
        <g data-part="identity-skill-left" transform="translate(0.000 0.000) scale(1.0000)" opacity="1.0000">
          <path d="M-58 -14 -6 -40 -6 37 -58 11Z" transform="translate(1.5 2)" fill={p.side}/>
          <path d="M-58 -14 -6 -40 -6 37 -58 11Z" fill={`url(#${prefix}-identity-record)`} stroke={p.edge} strokeWidth="0.75"/>
          <path d="M-51 -12 -13 -31V28L-51 9Z" fill={p.inset} stroke={p.line} strokeWidth="0.6"/>
          <path d="M-43 -9 -31 -15V-5L-21 0M-43 8 -31 14 -21 9" fill="none" stroke={p.highlight} strokeWidth="0.8" opacity="0.55"/>
          <path d="M-56 -13 -7 -37" stroke={p.highlight} strokeWidth="0.65" opacity="0.48"/>
        </g>
        <g data-part="identity-skill-right" transform="translate(0.000 0.000) scale(1.0000)" opacity="1.0000">
          <path d="M58 -14 6 -40V37L58 11Z" transform="translate(1.5 2)" fill={p.side}/>
          <path d="M58 -14 6 -40V37L58 11Z" fill={`url(#${prefix}-identity-record)`} stroke={p.edge} strokeWidth="0.75"/>
          <path d="M51 -12 13 -31V28L51 9Z" fill={p.inset} stroke={p.line} strokeWidth="0.6"/>
          <path d="M43 -9 31 -15V-5L21 0M43 8 31 14 21 9" fill="none" stroke={p.highlight} strokeWidth="0.8" opacity="0.55"/>
          <path d="M57 -13 7 -37" stroke={p.highlight} strokeWidth="0.65" opacity="0.48"/>
        </g>
        <g data-part="identity-skill-insert" transform="translate(0.000 0.000) scale(1.0000)" opacity="1.0000">
          <path d="M-23 -13 0 -25 24 -13V13L0 25 -23 13Z" fill={p.face} stroke={p.edge} strokeWidth="0.8"/>
          <path d="M-7 -9 -16 -3 -7 3M7 -3 16 3 7 9" fill="none" stroke={p.violet} strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M-11 18 0 23 12 17" fill="none" stroke={p.violet} strokeWidth="0.8" opacity="0.45"/>
        </g>
      </g>
      <g data-part="identity-skill-label" opacity="1" transform="translate(0 0)">
        <text className="motion-label" x="0" y="93" textAnchor="middle" fill={p.ink} fontSize="27" fontWeight="400">Skill</text>
        <text className="motion-secondary" x="0" y="121" textAnchor="middle" fill={p.secondary} fontSize="22" fontWeight="400">{t("方法复用", "Reuse methods")}</text>
      </g>
    </g>
    <g data-part="identity-memory-call" opacity="0.0000" transform="translate(233.000 276.000) scale(0.7000)">
      <path d="M-15 -11 16 -21V21L-15 31Z" fill={p.face} stroke={p.edge} strokeWidth="0.7"/>
      <path d="M-8 -1 10 -7M-8 8 6 3M-8 17 10 11" stroke={p.cyan} strokeWidth="1.4"/>
    </g>
    <g data-part="identity-skill-call" opacity="0.0000" transform="translate(410.000 276.000) scale(0.7000)">
      <path d="M-15 -21 16 -11V31L-15 21Z" fill={p.face} stroke={p.edge} strokeWidth="0.7"/>
      <path d="M-7 -8 -11 -6 -7 -1M6 0 10 5 6 7" fill="none" stroke={p.violet} strokeWidth="1.5"/>
    </g>
  </g>;
}

/** 640 × 560 原生 SVG；服务端默认展示 11.8 秒的完整成果。 */
export function CollaborationVisual({ locale, prefix }: { locale: Locale; prefix: string }) {
  const t = (zh: string, en: string) => locale === "zh" ? zh : en;
  const p = employeeMaterial;
  return <g className="employee-visual">
    <defs>
      <linearGradient id={`${prefix}-collab-rim`} x1="0" y1="0" x2=".65" y2="1">
        <stop stopColor={p.edge}/>
        <stop offset=".45" stopColor={p.line}/>
        <stop offset="1" stopColor={p.side}/>
      </linearGradient>
      <linearGradient id={`${prefix}-collab-face`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={p.faceTop}/>
        <stop offset="1" stopColor={p.face}/>
      </linearGradient>
      <linearGradient id={`${prefix}-collab-code`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={p.code}/>
        <stop offset="1" stopColor={p.code}/>
      </linearGradient>
      <linearGradient id={`${prefix}-collab-hub`} x1="0" y1="0" x2=".7" y2="1">
        <stop stopColor={p.faceTop}/>
        <stop offset="1" stopColor={p.faceLow}/>
      </linearGradient>
      <filter id={`${prefix}-collab-shadow`} x="-10%" y="-12%" width="120%" height="132%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.2" floodColor={p.shadow} floodOpacity={p.shadowOpacity}/>
      </filter>
    </defs>
    <g fill="none" stroke={p.route} strokeWidth="1" opacity=".48" strokeLinecap="round" strokeLinejoin="round">
      <path d="M210 161 C247 161 235 235 256 235"/>
      <path d="M430 171 C401 171 414 235 384 235"/>
      <path d="M216 398 C243 398 223 287 256 287"/>
      <path d="M429 395 C398 395 415 287 384 287"/>
      <path d="M108 211 C108 245 36 244 36 276 L36 328 C36 349 65 349 80 349"/>
      <path d="M529 227 C529 256 607 252 607 280 L607 328 C607 351 578 351 562 351"/>
      <path d="M320 64 L320 213 M320 312 L320 366"/>
    </g>
    <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path data-part="collab-route-plan" d="M210 161 C247 161 235 235 256 235" stroke={p.cyan} opacity="0"/>
      <path data-part="collab-route-code" d="M430 171 C401 171 414 235 384 235" stroke={p.violet} opacity="0"/>
      <path data-part="collab-route-review" d="M216 398 C243 398 223 287 256 287" stroke={p.amber} opacity="0"/>
      <path data-part="collab-route-test" d="M429 395 C398 395 415 287 384 287" stroke={p.mint} opacity="0"/>
    </g>
    <g fill={p.edge}>
      <circle cx="210" cy="161" r="2"/>
      <circle cx="430" cy="171" r="2"/>
      <circle cx="216" cy="398" r="2"/>
      <circle cx="429" cy="395" r="2"/>
    </g>
    <g data-part="collab-goal" opacity="0.66" transform="translate(0 -3)">
      <rect x="235" y="22" width="170" height="43" rx="7" fill={p.face} stroke={p.line} strokeWidth=".8"/>
      <path d="M245 23 H394" stroke={p.highlight} strokeWidth=".65" opacity=".42"/>
      <g transform="translate(251 35)" fill="none" stroke={p.blue} strokeWidth="1.3" strokeLinecap="round">
        <path d="M0 7 H13 M7 1 L13 7 L7 13"/>
      </g>
      <text x="284" y="50" fill={p.ink} fontSize="22" fontWeight="450" className="motion-label">{t("共同目标", "Goal")}</text>
    </g>
    <g data-part="collab-plan-unit" opacity="1">
      <image href={`${basePath}/brand/claude-symbol.svg`} x="43" y="80" width="27" height="27"/>
      <text x="80" y="103" fill={p.ink} fontSize="24" fontWeight="500" className="motion-label">Claude</text>
      <text x="169" y="103" fill={p.secondary} fontSize="22" className="motion-secondary">{t("方案", "Plan")}</text>
      <g filter={`url(#${prefix}-collab-shadow)`}>
        <path d="M36 125 Q36 118 44 117 L210 106 Q217 105 218 112 L221 191 Q221 198 213 199 L46 211 Q39 211 38 203Z" fill={`url(#${prefix}-collab-rim)`}/>
        <path d="M38 126 Q38 120 45 119 L209 108 Q215 108 216 114 L219 189 Q219 195 212 197 L47 208 Q41 209 40 202Z" fill={`url(#${prefix}-collab-face)`}/>
        <path d="M46 118 L210 107" stroke={p.highlight} strokeWidth=".7" opacity=".7"/>
      </g>
      <g data-part="collab-plan-root" opacity="1" transform="translate(0 0)">
        <rect x="67" y="132" width="100" height="21" rx="3" fill={p.inset} stroke={p.line} strokeWidth=".6"/>
        <rect x="73" y="138" width="41" height="2.5" rx="1" fill={p.cyan}/>
        <rect x="73" y="144" width="68" height="2" rx="1" fill={p.muted}/>
        <path d="M117 153 V163 M80 163 H177 M80 163 V174 M128 163 V170 M177 163 V166" fill="none" stroke={p.route} strokeWidth="1"/>
      </g>
      <g data-part="collab-plan-a" opacity="1" transform="translate(0 0)">
        <rect x="59" y="174" width="41" height="21" rx="3" fill={p.inset} stroke={p.line} strokeWidth=".6"/>
        <path d="M68 184 H90" stroke={p.cyan} strokeWidth="1.4" strokeLinecap="round"/>
      </g>
      <g data-part="collab-plan-b" opacity="1" transform="translate(0 0)">
        <rect x="108" y="170" width="41" height="21" rx="3" fill={p.inset} stroke={p.line} strokeWidth=".6"/>
        <path d="M118 180 H140" stroke={p.muted} strokeWidth="1.4" strokeLinecap="round"/>
      </g>
      <g data-part="collab-plan-c" opacity="1" transform="translate(0 0)">
        <rect x="157" y="166" width="41" height="21" rx="3" fill={p.inset} stroke={p.line} strokeWidth=".6"/>
        <path d="M167 176 H189" stroke={p.muted} strokeWidth="1.4" strokeLinecap="round"/>
      </g>
      <g data-part="collab-plan-ready" transform="translate(203 196)" opacity="1">
        <path d="M-6-1 L-2 3 L5-5" fill="none" stroke={p.cyan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </g>
    <g data-part="collab-code-unit" opacity="1">
      <rect x="425" y="88" width="34" height="34" rx="4" fill={p.paper}/>
      <image href={`${basePath}/brand/openai-blossom.svg`} x="422" y="85" width="40" height="40"/>
      <text x="466" y="114" fill={p.ink} fontSize="24" fontWeight="500" className="motion-label">Codex</text>
      <text x="550" y="114" fill={p.secondary} fontSize="22" className="motion-secondary">{t("实现", "Build")}</text>
      <g filter={`url(#${prefix}-collab-shadow)`}>
        <path d="M421 139 Q421 132 428 132 L593 144 Q600 144 600 152 L598 221 Q598 228 590 228 L427 217 Q420 216 420 209Z" fill={`url(#${prefix}-collab-rim)`}/>
        <path d="M423 140 Q423 134 429 134 L592 146 Q598 146 598 153 L596 219 Q596 225 589 225 L428 215 Q422 214 422 208Z" fill={`url(#${prefix}-collab-code)`}/>
        <path d="M430 133 L592 145" stroke={p.highlight} strokeWidth=".7" opacity=".6"/>
      </g>
      <path d="M437 152 L577 162" fill="none" stroke={p.edge} strokeWidth=".65" opacity=".45"/>
      <g data-part="collab-code-line-1" opacity="1" transform="translate(0 0)">
        <path d="M443 166 l-5 4 5 4 M462 167 l5 4 -5 4" fill="none" stroke={p.violet} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M451 166 l-4 9" stroke={p.violet} strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="478" y="169" width="65" height="3" rx="1" fill={p.violet}/>
      </g>
      <g data-part="collab-code-line-2" opacity="1" transform="translate(0 0)">
        <rect x="448" y="182" width="21" height="2.5" rx="1" fill={p.codeLine}/>
        <rect x="476" y="184" width="83" height="2.5" rx="1" fill={p.codeLine} opacity=".6"/>
      </g>
      <g data-part="collab-code-line-3" opacity="1" transform="translate(0 0)">
        <rect x="448" y="194" width="47" height="2.5" rx="1" fill={p.violet} opacity=".8"/>
        <rect x="502" y="198" width="42" height="2.5" rx="1" fill={p.codeLine} opacity=".7"/>
      </g>
      <g data-part="collab-code-ready" transform="translate(582 216)" opacity="1">
        <path d="M-6-1 L-2 3 L5-5" fill="none" stroke={p.violet} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </g>
    <g data-part="collab-hub" filter={`url(#${prefix}-collab-shadow)`} opacity="1">
      <rect x="245" y="216" width="150" height="98" rx="12" fill={`url(#${prefix}-collab-rim)`}/>
      <rect x="247" y="218" width="146" height="94" rx="10" fill={`url(#${prefix}-collab-hub)`}/>
      <path d="M259 217 H381" fill="none" stroke={p.highlight} strokeWidth=".8" opacity=".55"/>
      <path d="M258 313 H382" fill="none" stroke={p.side} strokeWidth=".7"/>
      <image href={`${basePath}/brand/logo-mark.svg`} x="304" y="230" width="31" height="37"/>
      <text x="320" y="293" textAnchor="middle" fill={p.ink} fontSize="22" fontWeight="500" letterSpacing="-.7" className="motion-label">SkyMythos</text>
    </g>
    <text x="320" y="340" textAnchor="middle" fill={p.secondary} fontSize="22" fontWeight="400" className="motion-secondary">{t("协作中枢", "Orchestrator")}</text>
    <g fill={p.inset} stroke={p.edge} strokeWidth="1">
      <circle cx="247" cy="235" r="2.5"/>
      <circle cx="393" cy="235" r="2.5"/>
      <circle cx="247" cy="287" r="2.5"/>
      <circle cx="393" cy="287" r="2.5"/>
    </g>
    <g data-part="collab-review-unit" opacity="1">
      <image href={`${basePath}/brand/claude-symbol.svg`} x="38" y="332" width="27" height="27"/>
      <text x="75" y="355" fill={p.ink} fontSize="24" fontWeight="500" className="motion-label">Claude</text>
      <text x="164" y="355" fill={p.secondary} fontSize="22" className="motion-secondary">{t("审查", "Review")}</text>
      <g filter={`url(#${prefix}-collab-shadow)`}>
        <rect x="27" y="377" width="189" height="83" rx="8" fill={`url(#${prefix}-collab-rim)`}/>
        <rect x="29" y="379" width="185" height="79" rx="6" fill={`url(#${prefix}-collab-face)`}/>
        <path d="M37 378 H205" stroke={p.highlight} strokeWidth=".7" opacity=".6"/>
      </g>
      <g data-part="collab-review-source" opacity="1" transform="translate(0 0)">
        <rect x="42" y="392" width="156" height="21" rx="2" fill={p.inset}/>
        <path d="M43 394 V411" stroke={p.amber} strokeWidth="1.5"/>
        <path d="M51 402 H57" stroke={p.amber} strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M67 402 H102 M111 402 H168" stroke={p.muted} strokeWidth="1.4" strokeLinecap="round"/>
      </g>
      <g data-part="collab-review-diff" opacity="1" transform="translate(0 0)">
        <rect x="42" y="420" width="156" height="22" rx="2" fill={p.inset}/>
        <path d="M43 422 V440" stroke={p.mint} strokeWidth="1.5"/>
        <path d="M51 431 H57 M54 428 V434" stroke={p.mint} strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M67 431 H112 M120 431 H166" stroke={p.secondary} strokeWidth="1.4" strokeLinecap="round"/>
      </g>
      <g data-part="collab-review-pass" transform="translate(192 430)" opacity="1">
        <path d="M-5 0 L-1 4 L6-5" fill="none" stroke={p.amber} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </g>
    <g data-part="collab-test-unit" opacity="1">
      <rect x="425" y="330" width="34" height="34" rx="4" fill={p.paper}/>
      <image href={`${basePath}/brand/openai-blossom.svg`} x="422" y="327" width="40" height="40"/>
      <text x="466" y="355" fill={p.ink} fontSize="24" fontWeight="500" className="motion-label">Codex</text>
      <text x="550" y="355" fill={p.secondary} fontSize="22" className="motion-secondary">{t("验证", "Verify")}</text>
      <g filter={`url(#${prefix}-collab-shadow)`}>
        <rect x="430" y="372" width="165" height="74" rx="8" fill={`url(#${prefix}-collab-rim)`}/>
        <rect x="432" y="374" width="161" height="70" rx="6" fill={`url(#${prefix}-collab-face)`}/>
        <path d="M440 373 H584" stroke={p.highlight} strokeWidth=".7" opacity=".6"/>
      </g>
      <g fill={p.inset}>
        <rect x="445" y="389" width="116" height="3" rx="1"/>
        <rect x="445" y="406" width="104" height="3" rx="1"/>
        <rect x="445" y="423" width="124" height="3" rx="1"/>
      </g>
      <g data-part="collab-test-bar-1" opacity="1" transform="translate(445 0) scale(1 1) translate(-445 0)">
        <rect x="445" y="389" width="116" height="3" rx="1" fill={p.mint}/>
      </g>
      <g data-part="collab-test-bar-2" opacity="1" transform="translate(445 0) scale(1 1) translate(-445 0)">
        <rect x="445" y="406" width="104" height="3" rx="1" fill={p.mint} opacity=".8"/>
      </g>
      <g data-part="collab-test-bar-3" opacity="1" transform="translate(445 0) scale(1 1) translate(-445 0)">
        <rect x="445" y="423" width="124" height="3" rx="1" fill={p.mint} opacity=".6"/>
      </g>
      <g data-part="collab-test-pass" transform="translate(580 425)" opacity="1">
        <path d="M-5 0 L-1 4 L6-5" fill="none" stroke={p.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </g>
    <g data-part="collab-output" opacity="1" transform="translate(0 0)">
      <g filter={`url(#${prefix}-collab-shadow)`}>
        <rect x="231" y="366" width="178" height="137" rx="8" fill={`url(#${prefix}-collab-rim)`}/>
        <rect x="233" y="368" width="174" height="133" rx="6" fill={`url(#${prefix}-collab-face)`}/>
        <path d="M241 367 H397" fill="none" stroke={p.highlight} strokeWidth=".7" opacity=".65"/>
      </g>
      <text x="244" y="393" fill={p.ink} fontSize="22" fontWeight="450" className="motion-label">{t("变更集", "Changes")}</text>
      <g data-part="collab-output-plan" opacity="1" transform="translate(0 0)">
        <path d="M244 401 H396" stroke={p.line} strokeWidth=".65"/>
        <path d="M244 401 H288" stroke={p.cyan} strokeWidth="1.1"/>
      </g>
      <g data-part="collab-output-code" opacity="1" transform="translate(0 0)">
        <rect x="244" y="409" width="151" height="34" rx="3" fill={p.code}/>
        <path d="M256 419 l-3 3 3 3 M272 419 l3 3 -3 3 M264 418 l-4 9" fill="none" stroke={p.violet} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="284" y="420" width="76" height="2.5" rx="1" fill={p.codeLine}/>
        <rect x="253" y="432" width="35" height="2" rx="1" fill={p.violet} opacity=".8"/>
        <rect x="295" y="432" width="88" height="2" rx="1" fill={p.codeLine} opacity=".6"/>
      </g>
      <g data-part="collab-output-review" opacity="1" transform="translate(0 0)">
        <path d="M250 459 L254 463 L260 454" fill="none" stroke={p.amber} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="270" y="466" fill={p.secondary} fontSize="22" fontWeight="400" className="motion-secondary">{t("审查通过", "Reviewed")}</text>
      </g>
      <g data-part="collab-output-test" opacity="1" transform="translate(0 0)">
        <path d="M250 484 L254 488 L260 479" fill="none" stroke={p.mint} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="270" y="491" fill={p.secondary} fontSize="22" fontWeight="400" className="motion-secondary">{t("验证通过", "Verified")}</text>
      </g>
    </g>
    <g data-part="collab-output-caption" opacity="1" transform="translate(0 0)">
      <text x="320" y="539" textAnchor="middle" fill={p.ink} fontSize="24" fontWeight="450" className="motion-label">{t("共同交付", "Shared delivery")}</text>
    </g>
    <g data-part="collab-goal-token" opacity="0" transform="translate(320 227)">
      <rect x="-13" y="-9" width="26" height="18" rx="3" fill={p.faceTop} stroke={p.edge} strokeWidth=".8"/>
      <path d="M-5 0 H5 M1-4 L5 0 L1 4" fill="none" stroke={p.blue} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g data-part="collab-plan-token" opacity="0" transform="translate(210 161)">
      <rect x="-11" y="-8" width="22" height="16" rx="2" fill={p.faceTop} stroke={p.edge} strokeWidth=".8"/>
      <path d="M-5-2 H5 M-5 2 H1" stroke={p.cyan} strokeWidth="1.2" strokeLinecap="round"/>
    </g>
    <g data-part="collab-code-token" opacity="0" transform="translate(430 171)">
      <rect x="-11" y="-8" width="22" height="16" rx="2" fill={p.faceTop} stroke={p.edge} strokeWidth=".8"/>
      <path d="M-4-3 L-7 0 L-4 3 M4-3 L7 0 L4 3" fill="none" stroke={p.violet} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g data-part="collab-review-token" opacity="0" transform="translate(80 382)">
      <rect x="-13" y="-9" width="26" height="18" rx="3" fill={p.faceTop} stroke={p.edge} strokeWidth=".8"/>
      <path d="M-6-2 H6 M-6 3 H2" stroke={p.amber} strokeWidth="1.3" strokeLinecap="round"/>
    </g>
    <g data-part="collab-test-token" opacity="0" transform="translate(562 380)">
      <rect x="-13" y="-9" width="26" height="18" rx="3" fill={p.faceTop} stroke={p.edge} strokeWidth=".8"/>
      <path d="M-5 0 L-1 4 L6-4" fill="none" stroke={p.mint} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g data-part="collab-return-review" opacity="0" transform="translate(249 287)">
      <rect x="-10" y="-8" width="20" height="16" rx="2" fill={p.faceTop} stroke={p.edge} strokeWidth=".8"/>
      <path d="M-4 0 L-1 3 L5-3" fill="none" stroke={p.amber} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g data-part="collab-return-test" opacity="0" transform="translate(391 287)">
      <rect x="-10" y="-8" width="20" height="16" rx="2" fill={p.faceTop} stroke={p.edge} strokeWidth=".8"/>
      <path d="M-4 0 L-1 3 L5-3" fill="none" stroke={p.mint} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </g>;
}
