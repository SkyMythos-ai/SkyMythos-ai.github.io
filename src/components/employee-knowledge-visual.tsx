import type { Locale } from "@/lib/i18n";
import { employeeMaterial } from "@/components/employee-visual-material";

/** 640 × 560 原生 SVG；服务端默认展示 11.8 秒的完整成果。 */
export function KnowledgeVisual({ locale, prefix }: { locale: Locale; prefix: string }) {
  const t = (zh: string, en: string) => locale === "zh" ? zh : en;
  const p = employeeMaterial;
  return <g className="employee-visual">
    <defs>
      <linearGradient id={`${prefix}-source-face`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={p.faceTop}/>
        <stop offset="1" stopColor={p.face}/>
      </linearGradient>
      <linearGradient id={`${prefix}-index-face`} x1="0" y1="0" x2=".9" y2="1">
        <stop stopColor={p.faceTop}/>
        <stop offset=".52" stopColor={p.face}/>
        <stop offset="1" stopColor={p.faceLow}/>
      </linearGradient>
      <linearGradient id={`${prefix}-index-edge`} x1="0" y1="0" x2="1" y2="0">
        <stop stopColor={p.edge}/>
        <stop offset=".65" stopColor={p.side}/>
        <stop offset="1" stopColor={p.edge}/>
      </linearGradient>
      <linearGradient id={`${prefix}-task-face`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={p.faceTop}/>
        <stop offset="1" stopColor={p.face}/>
      </linearGradient>
      <radialGradient id={`${prefix}-contact-shadow`}>
        <stop stopColor={p.shadow} stopOpacity={p.shadowOpacity * .45}/>
        <stop offset="1" stopColor={p.shadow} stopOpacity="0"/>
      </radialGradient>
    </defs>
    <g fontFamily="inherit" shapeRendering="geometricPrecision">
      <ellipse cx="434" cy="330" rx="169" ry="23" fill={`url(#${prefix}-contact-shadow)`}/>
      <g transform="translate(45 69)">
        <path d="M2 27 128 7 184 35 57 56Z" fill={p.shadow} opacity={p.shadowOpacity * .5} transform="translate(0 3)"/>
        <path d="M0 18 130 0 183 28 53 46Z" fill={`url(#${prefix}-source-face)`} stroke={p.line} strokeWidth=".85"/>
        <path d="M0 18 53 46 53 48.5 0 20.5Z" fill={p.faceLow}/>
        <path d="M53 46 183 28 183 30.5 53 48.5Z" fill={p.side}/>
        <path d="M8 19 129 4 171 27 54 41Z" fill={p.inset} fillOpacity=".18" stroke={p.highlight} strokeOpacity=".25" strokeWidth=".8"/>
        <path d="M27 21 99 11 M37 26 121 14 M47 31 111 21" fill="none" stroke={p.secondary} strokeOpacity=".58" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M136 19 151 27 138 29 123 21Z" fill={p.violet} opacity=".64"/>
        <path d="M53 46 183 28" stroke={p.violet} strokeOpacity=".75" strokeWidth="1.25"/>
        <text className="motion-key-label" x="0" y="84" fontSize="24" fontWeight="560" fill={p.ink}>{t("项目文档", "Documents")}</text>
      </g>
      <g transform="translate(92 197)">
        <path d="M2 27 128 7 184 35 57 56Z" fill={p.shadow} opacity={p.shadowOpacity * .5} transform="translate(0 3)"/>
        <path d="M0 18 130 0 183 28 53 46Z" fill={`url(#${prefix}-source-face)`} stroke={p.line} strokeWidth=".85"/>
        <path d="M0 18 53 46 53 48.5 0 20.5Z" fill={p.faceLow}/>
        <path d="M53 46 183 28 183 30.5 53 48.5Z" fill={p.side}/>
        <path d="M8 19 129 4 171 27 54 41Z" fill={p.inset} fillOpacity=".18" stroke={p.highlight} strokeOpacity=".25" strokeWidth=".8"/>
        <path d="M27 21 99 11 M37 26 121 14 M47 31 111 21" fill="none" stroke={p.secondary} strokeOpacity=".58" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M136 19 151 27 138 29 123 21Z" fill={p.amber} opacity=".64"/>
        <path d="M53 46 183 28" stroke={p.amber} strokeOpacity=".75" strokeWidth="1.25"/>
        <text className="motion-key-label" x="0" y="84" fontSize="24" fontWeight="560" fill={p.ink}>{t("技术决策", "Decisions")}</text>
        <g transform="translate(145 56)">
          <rect width="43" height="31" rx="6" fill={p.amberDim} stroke={p.amber} strokeOpacity=".25" strokeWidth=".8"/>
          <text className="motion-reference-label" x="21.5" y="22" textAnchor="middle" fontSize="22" fontWeight="650" fill={p.amber}>[1]</text>
        </g>
      </g>
      <g transform="translate(48 325)">
        <path d="M2 27 128 7 184 35 57 56Z" fill={p.shadow} opacity={p.shadowOpacity * .5} transform="translate(0 3)"/>
        <path d="M0 18 130 0 183 28 53 46Z" fill={`url(#${prefix}-source-face)`} stroke={p.line} strokeWidth=".85"/>
        <path d="M0 18 53 46 53 48.5 0 20.5Z" fill={p.faceLow}/>
        <path d="M53 46 183 28 183 30.5 53 48.5Z" fill={p.side}/>
        <path d="M8 19 129 4 171 27 54 41Z" fill={p.inset} fillOpacity=".18" stroke={p.highlight} strokeOpacity=".25" strokeWidth=".8"/>
        <path d="M27 21 99 11 M37 26 121 14 M47 31 111 21" fill="none" stroke={p.secondary} strokeOpacity=".58" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M136 19 151 27 138 29 123 21Z" fill={p.mint} opacity=".64"/>
        <path d="M53 46 183 28" stroke={p.mint} strokeOpacity=".75" strokeWidth="1.25"/>
        <text className="motion-key-label" x="0" y="84" fontSize="24" fontWeight="560" fill={p.ink}>{t("工作经验", "Work notes")}</text>
      </g>
      <g data-part="index" transform="translate(290 128)" opacity="1">
        <g data-part="layer-practice" transform="translate(0 96)" opacity="1">
          <path d="M0 52 206 14 290 66 84 105Z" fill={`url(#${prefix}-index-face)`} stroke={p.line} strokeWidth=".85"/>
          <path d="M0 52 84 105 84 107.5 0 54.5Z" fill={p.faceLow}/>
          <path d="M84 105 290 66 290 68.5 84 107.5Z" fill={p.side}/>
          <path d="M9 52 205 18 279 66 85 101Z" fill={p.inset} fillOpacity=".11" stroke={p.highlight} strokeOpacity=".21" strokeWidth=".8"/>
          <path d="M21 55 69 46 85 56 36 65Z M83 44 133 35 149 45 99 54Z M147 32 196 23 212 33 163 42Z" fill={p.side} fillOpacity=".65"/>
          <path d="M45 70 91 62" stroke={p.mint} strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M110 58 155 50 M174 46 221 38" stroke={p.secondary} strokeOpacity=".58" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M65 82 104 75 M124 70 174 61 M191 57 243 47" stroke={p.muted} strokeOpacity=".4" strokeWidth="1.15" strokeLinecap="round"/>
          <path d="M84 105 290 66" stroke={p.mint} strokeWidth="1.2" strokeOpacity=".68"/>
        </g>
        <g data-part="layer-decisions" transform="translate(0 66)" opacity="1">
          <path d="M0 52 206 14 290 66 84 105Z" fill={`url(#${prefix}-index-face)`} stroke={p.line} strokeWidth=".85"/>
          <path d="M0 52 84 105 84 107.5 0 54.5Z" fill={p.faceLow}/>
          <path d="M84 105 290 66 290 68.5 84 107.5Z" fill={p.side}/>
          <path d="M9 52 205 18 279 66 85 101Z" fill={p.inset} fillOpacity=".11" stroke={p.highlight} strokeOpacity=".21" strokeWidth=".8"/>
          <path d="M21 55 69 46 85 56 36 65Z M83 44 133 35 149 45 99 54Z M147 32 196 23 212 33 163 42Z" fill={p.side} fillOpacity=".65"/>
          <path d="M45 70 91 62" stroke={p.amber} strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M110 58 155 50 M174 46 221 38" stroke={p.secondary} strokeOpacity=".58" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M65 82 104 75 M124 70 174 61 M191 57 243 47" stroke={p.muted} strokeOpacity=".4" strokeWidth="1.15" strokeLinecap="round"/>
          <path d="M84 105 290 66" stroke={p.amber} strokeWidth="1.2" strokeOpacity=".68"/>
        </g>
        <g data-part="layer-docs" transform="translate(0 36)" opacity="1">
          <path d="M0 52 206 14 290 66 84 105Z" fill={`url(#${prefix}-index-face)`} stroke={p.line} strokeWidth=".85"/>
          <path d="M0 52 84 105 84 107.5 0 54.5Z" fill={p.faceLow}/>
          <path d="M84 105 290 66 290 68.5 84 107.5Z" fill={p.side}/>
          <path d="M9 52 205 18 279 66 85 101Z" fill={p.inset} fillOpacity=".11" stroke={p.highlight} strokeOpacity=".21" strokeWidth=".8"/>
          <path d="M21 55 69 46 85 56 36 65Z M83 44 133 35 149 45 99 54Z M147 32 196 23 212 33 163 42Z" fill={p.side} fillOpacity=".65"/>
          <path d="M45 70 91 62" stroke={p.violet} strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M110 58 155 50 M174 46 221 38" stroke={p.secondary} strokeOpacity=".58" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M65 82 104 75 M124 70 174 61 M191 57 243 47" stroke={p.muted} strokeOpacity=".4" strokeWidth="1.15" strokeLinecap="round"/>
          <path d="M84 105 290 66" stroke={p.violet} strokeWidth="1.2" strokeOpacity=".68"/>
        </g>
        <g data-part="index-crown" transform="translate(0 0)">
          <path d="M0 52 206 14 290 66 84 105Z" fill={`url(#${prefix}-index-face)`} stroke={p.edge} strokeOpacity=".75" strokeWidth=".9"/>
          <path d="M0 52 84 105 84 107.5 0 54.5Z" fill={p.faceLow}/>
          <path d="M84 105 290 66 290 68.5 84 107.5Z" fill={`url(#${prefix}-index-edge)`}/>
          <path d="M8 53 205 18 280 66 85 100Z" fill={p.inset} fillOpacity=".1" stroke={p.highlight} strokeOpacity=".25" strokeWidth=".8"/>
          <path d="M31 59 74 51 91 61 47 69Z M90 48 133 40 150 50 106 58Z M151 37 194 29 211 39 167 47Z" fill={p.side} fillOpacity=".68"/>
          <path d="M51 76 96 68 M111 65 157 56 M172 54 219 45" stroke={p.secondary} strokeOpacity=".65" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M83 104 290 66" stroke={p.cyan} strokeOpacity=".72" strokeWidth="1.15"/>
        </g>
      </g>
      <text className="motion-key-label" x="432" y="357" textAnchor="middle" fontSize="26" fontWeight="590" letterSpacing="-.6" fill={p.ink}>{t("组织检索索引", "Knowledge index")}</text>
      <g data-part="packet-docs" opacity="0" transform="translate(392 221) scale(0.86)">
        <path d="M-45 0 25-12 57 7-13 20Z" fill={p.faceTop} stroke={p.edge} strokeOpacity=".6" strokeWidth=".8"/>
        <path d="M-30 3 16-5 M-18 10 31 1" stroke={p.secondary} strokeWidth="1.2" strokeLinecap="round" strokeOpacity=".65"/>
        <path d="M-13 20 57 7 57 9.5-13 22.5Z" fill={p.side}/>
        <path d="M-13 20 57 7" stroke={p.violet} strokeOpacity=".9" strokeWidth="1.3"/>
      </g>
      <g data-part="packet-decisions" opacity="0" transform="translate(414 251) scale(0.86)">
        <path d="M-45 0 25-12 57 7-13 20Z" fill={p.faceTop} stroke={p.edge} strokeOpacity=".6" strokeWidth=".8"/>
        <path d="M-30 3 16-5 M-18 10 31 1" stroke={p.secondary} strokeWidth="1.2" strokeLinecap="round" strokeOpacity=".65"/>
        <path d="M-13 20 57 7 57 9.5-13 22.5Z" fill={p.side}/>
        <path d="M-13 20 57 7" stroke={p.amber} strokeOpacity=".9" strokeWidth="1.3"/>
      </g>
      <g data-part="packet-practice" opacity="0" transform="translate(419 293) scale(0.86)">
        <path d="M-45 0 25-12 57 7-13 20Z" fill={p.faceTop} stroke={p.edge} strokeOpacity=".6" strokeWidth=".8"/>
        <path d="M-30 3 16-5 M-18 10 31 1" stroke={p.secondary} strokeWidth="1.2" strokeLinecap="round" strokeOpacity=".65"/>
        <path d="M-13 20 57 7 57 9.5-13 22.5Z" fill={p.side}/>
        <path d="M-13 20 57 7" stroke={p.mint} strokeOpacity=".9" strokeWidth="1.3"/>
      </g>
      <g data-part="selected" transform="translate(426 261)" opacity="1">
        <path d="M-32-4 27-14 52 2-7 13Z" fill={p.amberDim} stroke={p.amber} strokeOpacity=".55" strokeWidth=".8"/>
        <path d="M-7 13 52 2 52 4.5-7 15.5Z" fill={p.side}/>
        <path d="M-7 13 52 2" stroke={p.amber} strokeOpacity=".8" strokeWidth="1.2"/>
        <g transform="translate(-21 -11)">
          <rect width="47" height="33" rx="6" fill={p.amberDim} stroke={p.amber} strokeOpacity=".45" strokeWidth=".8"/>
          <text className="motion-reference-label" x="23.5" y="24" textAnchor="middle" fontSize="23" fontWeight="650" fill={p.amber}>[1]</text>
        </g>
      </g>
      <g transform="translate(303 397)">
        <rect width="283" height="142" rx="8" fill={p.faceLow} stroke={p.line} strokeWidth=".9"/>
        <rect x="3" y="3" width="277" height="136" rx="6" fill={`url(#${prefix}-task-face)`} stroke={p.highlight} strokeOpacity=".1" strokeWidth=".8"/>
        <path d="M16 13H267" stroke={p.highlight} strokeOpacity=".12" strokeWidth=".8"/>
        <text className="motion-key-label" x="23" y="39" fontSize="24" fontWeight="580" fill={p.ink}>{t("当前任务", "Current task")}</text>
        <g transform="translate(23 57)">
          <path d="M0 0V24" stroke={p.blue} strokeWidth="2.6" strokeLinecap="round"/>
          <text className="motion-query-label" x="13" y="19" fontSize="22" fontWeight="470" fill={p.blue}>{t("部署约束", "Deploy")}</text>
        </g>
        <g data-part="answer" transform="translate(23 0)" opacity="1">
          <text className="motion-key-label" x="0" y="115" fontSize="22" fontWeight="520" fill={p.ink}>{t("分阶段发布", "Staged rollout")}</text>
        </g>
      </g>
      <g data-part="query" opacity="0" transform="translate(403 249)">
        <rect x="-3" y="-3" width="143" height="45" rx="9" fill={p.inset}/>
        <rect width="137" height="39" rx="6" fill={p.faceTop} stroke={p.blue} strokeOpacity=".6" strokeWidth=".9"/>
        <circle cx="18" cy="17" r="6" fill="none" stroke={p.blue} strokeWidth="1.4"/>
        <path d="M22 21 27 26" stroke={p.blue} strokeWidth="1.4" strokeLinecap="round"/>
        <text className="motion-query-label" x="35" y="27" fontSize="22" fontWeight="540" fill={p.blue}>{t("部署约束", "Deploy")}</text>
      </g>
      <g data-part="citation" transform="translate(517 489) scale(1)" opacity="1">
        <rect width="46" height="31" rx="6" fill={p.amberDim} stroke={p.amber} strokeOpacity=".4" strokeWidth=".8"/>
        <text className="motion-reference-label" x="23" y="23" textAnchor="middle" fontSize="23" fontWeight="650" fill={p.amber}>[1]</text>
      </g>
    </g>
  </g>;
}
