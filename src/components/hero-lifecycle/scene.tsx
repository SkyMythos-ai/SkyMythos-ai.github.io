import { basePath } from "@/lib/site";
import type { LifecycleCopy } from "./copy";
import styles from "./hero-lifecycle.module.css";

/** Native SVG solids in their approved painter order; only data-part groups move. */
export function LifecycleScene({ copy }: { copy: LifecycleCopy }) {
  return (
    <svg viewBox="40 130 830 560" role="img" aria-labelledby="lifecycle-title lifecycle-description" data-lifecycle-scene="" className={styles.scene}>
      <title id="lifecycle-title">{copy.title}</title>
      <desc id="lifecycle-description">{copy.description}</desc>
      <defs>
        <filter id="lifecycle-floor-shadow" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id="lifecycle-contact-shadow" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect x="0" y="0" width="900" height="760" fill="#f4f6f8" />
      <g data-part="world" fontFamily="PingFang SC,Microsoft YaHei,sans-serif" strokeLinejoin="round" strokeLinecap="round">
        <ellipse cx="475" cy="503" rx="316" ry="35" fill="#c4d0dd" opacity=".24" filter="url(#lifecycle-floor-shadow)" />
        <polygon points="436.50,213.95 446.40,218.90 446.40,208.90 436.50,203.95" fill="#b9c7d6" />
        <polygon points="456.30,213.95 446.40,218.90 446.40,208.90 456.30,203.95" fill="#a5b9cc" />
        <polygon points="446.40,199.00 456.30,203.95 446.40,208.90 436.50,203.95" fill="#c6d1dc" />
        <polygon points="784.80,388.10 794.70,393.05 794.70,383.05 784.80,378.10" fill="#b9c7d6" />
        <polygon points="804.60,388.10 794.70,393.05 794.70,383.05 804.60,378.10" fill="#a5b9cc" />
        <polygon points="794.70,373.15 804.60,378.10 794.70,383.05 784.80,378.10" fill="#c6d1dc" />
        <polygon points="521.10,519.95 531.00,524.90 531.00,514.90 521.10,509.95" fill="#b9c7d6" />
        <polygon points="540.90,519.95 531.00,524.90 531.00,514.90 540.90,509.95" fill="#a5b9cc" />
        <polygon points="531.00,505.00 540.90,509.95 531.00,514.90 521.10,509.95" fill="#c6d1dc" />
        <polygon points="172.80,345.80 182.70,350.75 182.70,340.75 172.80,335.80" fill="#b9c7d6" />
        <polygon points="192.60,345.80 182.70,350.75 182.70,340.75 192.60,335.80" fill="#a5b9cc" />
        <polygon points="182.70,330.85 192.60,335.80 182.70,340.75 172.80,335.80" fill="#c6d1dc" />
        <polygon points="135.00,338.50 531.00,536.50 531.00,525.50 135.00,327.50" fill="#d7e1eb" />
        <polygon points="846.00,379.00 531.00,536.50 531.00,525.50 846.00,368.00" fill="#c0cfde" />
        <polygon points="450.00,170.00 846.00,368.00 531.00,525.50 135.00,327.50" fill="#eef3f7" />
        <polygon points="483.30,289.25 491.40,293.30 491.40,221.30 483.30,217.25" fill="#c9d7e6" />
        <polygon points="499.50,289.25 491.40,293.30 491.40,221.30 499.50,217.25" fill="#adbed3" />
        <polygon points="491.40,213.20 499.50,217.25 491.40,221.30 483.30,217.25" fill="#e2eaf2" />
        <polygon points="661.50,378.35 669.60,382.40 669.60,310.40 661.50,306.35" fill="#c9d7e6" />
        <polygon points="677.70,378.35 669.60,382.40 669.60,310.40 677.70,306.35" fill="#adbed3" />
        <polygon points="669.60,302.30 677.70,306.35 669.60,310.40 661.50,306.35" fill="#e2eaf2" />
        <polygon points="364.50,348.65 372.60,352.70 372.60,280.70 364.50,276.65" fill="#c9d7e6" />
        <polygon points="380.70,348.65 372.60,352.70 372.60,280.70 380.70,276.65" fill="#adbed3" />
        <polygon points="372.60,272.60 380.70,276.65 372.60,280.70 364.50,276.65" fill="#e2eaf2" />
        <polygon points="542.70,437.75 550.80,441.80 550.80,369.80 542.70,365.75" fill="#c9d7e6" />
        <polygon points="558.90,437.75 550.80,441.80 550.80,369.80 558.90,365.75" fill="#adbed3" />
        <polygon points="550.80,361.70 558.90,365.75 550.80,369.80 542.70,365.75" fill="#e2eaf2" />
        <polygon points="378.90,330.65 549.00,415.70 549.00,408.70 378.90,323.65" fill="#cad7e6" />
        <polygon points="553.50,413.45 549.00,415.70 549.00,408.70 553.50,406.45" fill="#b1c4d8" />
        <polygon points="383.40,321.40 553.50,406.45 549.00,408.70 378.90,323.65" fill="#dce6ef" />
        <polygon points="557.10,411.55 561.60,413.80 561.60,407.80 557.10,405.55" fill="#d3dde8" />
        <polygon points="665.10,362.05 561.60,413.80 561.60,407.80 665.10,356.05" fill="#b8c9db" />
        <polygon points="660.60,353.80 665.10,356.05 561.60,407.80 557.10,405.55" fill="#fdfefe" />
        <polygon points="353.70,275.75 553.50,375.65 553.50,365.65 353.70,265.75" fill="#dbe5f0" />
        <polygon points="691.20,306.80 553.50,375.65 553.50,365.65 691.20,296.80" fill="#b4c8df" />
        <polygon points="491.40,196.90 691.20,296.80 553.50,365.65 353.70,265.75" fill="#fff" />
        <polygon points="357.30,272.55 549.00,368.40 549.00,365.40 357.30,269.55" fill="#c7d6e8" />
        <polygon points="552.60,366.60 549.00,368.40 549.00,365.40 552.60,363.60" fill="#acc0d9" />
        <polygon points="360.90,267.75 552.60,363.60 549.00,365.40 357.30,269.55" fill="#f8fbfd" />
        <g data-part="workmat">
          <polygon points="487.80,228.00 589.50,278.85 517.50,314.85 415.80,264.00" fill="#e7edf5" />
        </g>
        <g data-part="knowledge">
          <polygon points="429.30,254.05 480.60,279.70 480.60,276.70 429.30,251.05" fill="#d7e2f0" />
          <polygon points="519.30,260.35 480.60,279.70 480.60,276.70 519.30,257.35" fill="#b8cbe1" />
          <polygon points="468.00,231.70 519.30,257.35 480.60,276.70 429.30,251.05" fill="#fdfefe" />
          <polygon points="472.50,233.85 515.70,255.45 484.20,271.20 441.00,249.60" fill="#f9fbff" />
        </g>
        <g data-part="tool">
          <polygon points="544.50,331.45 568.80,343.60 568.80,330.60 544.50,318.45" fill="#6286ca" />
          <polygon points="593.10,331.45 568.80,343.60 568.80,330.60 593.10,318.45" fill="#4267ad" />
          <polygon points="568.80,306.30 593.10,318.45 568.80,330.60 544.50,318.45" fill="#8ba7dc" />
          <polygon points="571.50,308.45 588.60,317.00 585.90,318.35 568.80,309.80" fill="#ccdcf6" />
        </g>
        <g data-part="knowledge-label">
          <text x="375" y="245" fontSize="17" fill="#496383">{copy.scene.knowledge}</text>
        </g>
        <polygon points="232.20,300.50 271.80,320.30 271.80,312.30 232.20,292.50" fill="#d3dde8" />
        <polygon points="302.40,305.00 271.80,320.30 271.80,312.30 302.40,297.00" fill="#b8c9db" />
        <polygon points="262.80,277.20 302.40,297.00 271.80,312.30 232.20,292.50" fill="#fdfefe" />
        <g data-part="human" data-identity="human" data-pivot="266.4,294.3">
          <image href={`${basePath}/images/characters/person.svg`} x="220.39999999999998" y="174.70000000000002" width="92" height="119.60000000000001" aria-hidden="true" />
        </g>
        <g data-part="planner" data-home="748,239" transform="translate(748 239) scale(1)" data-agent="requirement-agent" data-identity="requirement-agent" data-model="Claude" data-station={copy.scene.requirement}>
          <ellipse cx="0" cy="5" rx="43" ry="8" fill="#a8bed5" opacity=".18" />
          <g data-part="planner-support">
            <path d="M-7 1L5 4V86L-7 83Z" fill="#c6d5e5" />
            <path d="M5 4L10 1V83L5 86Z" fill="#afc4dc" />
          </g>
          <path d="M-42 -14L-19 -25L44 -12L21 0Z" fill="#fff" />
          <path d="M-42 -14L21 0V7L-42 -7Z" fill="#d1dfed" />
          <path d="M21 0L44 -12V-5L21 7Z" fill="#afc4dc" />
          <path d="M-12 -25V-17L12 -12V-20Z" fill="#b7cadf" />
          <path d="M-31 -78L-23 -83H39L31 -78Z" fill="#fdfefe" />
          <path d="M31 -78L39 -83V-19L31 -14Z" fill="#bfd0e4" />
          <rect x="-31" y="-78" width="62" height="64" rx="4" fill="#fff" stroke="#d2dfed" strokeWidth="1.2" />
          <g transform="translate(-23.0 -69.0)">
            <image role="img" data-brand="claude-symbol" href={`${basePath}/brand/claude-symbol.svg`} width="46" height="46" aria-label={`Claude ${copy.logo}`} />
          </g>
          <rect x="-21" y="-10" width="39" height="3" rx="1.5" fill="#c5d4e8" />
          <g data-part="planner-active" opacity="0">
            <rect x="-21" y="-10" width="39" height="3" rx="1.5" fill="#6389c7" />
          </g>
          <path d="M-25 11H25V34H-25Z" fill="#f4f7fb" />
          <text x="0" y="28" fontSize="20" fill="#496383" textAnchor="middle">{copy.scene.requirement}</text>
        </g>
        <g data-part="developer" data-home="626,265" transform="translate(626 265) scale(1)" data-agent="developer-agent" data-identity="developer-agent" data-model="GPT" data-station={copy.scene.development}>
          <ellipse cx="0" cy="5" rx="43" ry="8" fill="#a8bed5" opacity=".18" />
          <path d="M-42 -14L-19 -25L44 -12L21 0Z" fill="#fff" />
          <path d="M-42 -14L21 0V7L-42 -7Z" fill="#d1dfed" />
          <path d="M21 0L44 -12V-5L21 7Z" fill="#afc4dc" />
          <path d="M-12 -25V-17L12 -12V-20Z" fill="#b7cadf" />
          <path d="M-31 -78L-23 -83H39L31 -78Z" fill="#fdfefe" />
          <path d="M31 -78L39 -83V-19L31 -14Z" fill="#bfd0e4" />
          <rect x="-31" y="-78" width="62" height="64" rx="4" fill="#fff" stroke="#d2dfed" strokeWidth="1.2" />
          <g transform="translate(-31.0 -77.0)">
            <image role="img" data-brand="openai-blossom" href={`${basePath}/brand/openai-blossom.svg`} width="62" height="62" aria-label={`OpenAI ${copy.logo}`} />
          </g>
          <rect x="-21" y="-10" width="39" height="3" rx="1.5" fill="#c5d4e8" />
          <g data-part="developer-active" opacity="0">
            <rect x="-21" y="-10" width="39" height="3" rx="1.5" fill="#6389c7" />
          </g>
          <path d="M-25 11H25V34H-25Z" fill="#f4f7fb" />
          <text x="0" y="28" fontSize="20" fill="#496383" textAnchor="middle">{copy.scene.development}</text>
        </g>
        <g data-part="tester" data-home="740,414" transform="translate(740 414) scale(1)" data-agent="verification-agent" data-identity="verification-agent" data-model="DeepSeek" data-station={copy.scene.verification}>
          <ellipse cx="0" cy="5" rx="43" ry="8" fill="#a8bed5" opacity=".18" />
          <path d="M-42 -14L-19 -25L44 -12L21 0Z" fill="#fff" />
          <path d="M-42 -14L21 0V7L-42 -7Z" fill="#d1dfed" />
          <path d="M21 0L44 -12V-5L21 7Z" fill="#afc4dc" />
          <path d="M-12 -25V-17L12 -12V-20Z" fill="#b7cadf" />
          <path d="M-31 -78L-23 -83H39L31 -78Z" fill="#fdfefe" />
          <path d="M31 -78L39 -83V-19L31 -14Z" fill="#bfd0e4" />
          <rect x="-31" y="-78" width="62" height="64" rx="4" fill="#fff" stroke="#d2dfed" strokeWidth="1.2" />
          <g transform="translate(-27.0 -73.0)">
            <image role="img" data-brand="deepseek-symbol" href={`${basePath}/brand/deepseek-symbol.svg`} width="54" height="54" aria-label={`DeepSeek ${copy.logo}`} />
          </g>
          <rect x="-21" y="-10" width="39" height="3" rx="1.5" fill="#c5d4e8" />
          <g data-part="tester-active" opacity="0">
            <rect x="-21" y="-10" width="39" height="3" rx="1.5" fill="#6389c7" />
          </g>
          <path d="M-25 11H25V34H-25Z" fill="#f4f7fb" />
          <text x="0" y="28" fontSize="20" fill="#496383" textAnchor="middle">{copy.scene.verification}</text>
        </g>
        <ellipse cx="455" cy="441" rx="125" ry="11" fill="#9fb2c9" opacity=".16" filter="url(#lifecycle-contact-shadow)" />
        <path d="M357 343L372 432L391 441L381 347Z" fill="#b9cadd" />
        <path d="M551 349L563 444L585 446L576 349Z" fill="#a7bed6" />
        <path d="M326 419L583 431L590 441L334 429Z" fill="#c3d2e4" />
        <g data-layout="folio">
        <g data-part="folio" transform="matrix(1 .05 -.1 .85 350 280)" data-requirement="REQ-014">
          <path d="M-10 -8H250V168H-10Z" fill="#b9cce3" />
          <path d="M-7 -6H247V164H-7Z" fill="#e7eef7" />
          <path d="M-4 -3H243V160H-4Z" fill="#f8fbfe" />
          <path d="M-11 -8H0V168H-11Z" fill="#7191bf" />
          <path d="M3 5H243V160H3Z" fill="#b9c9da" />
          <path d="M0 0H225L240 15V155H0Z" fill="#fff" stroke="#a0b4cc" strokeWidth="1.5" />
          <path d="M225 0V15H240" fill="#edf3f9" stroke="#b5c5d7" strokeWidth="1.3" />
          <text x="17" y="25" fontSize="17" fill="#496383">REQ-014</text>
          <text x="103" y="25" fontSize="16" fill="#496383">{copy.scene.feedbackTitle}</text>
          <g data-part="document-version">
            <text x="185" y="25" fontSize="17" fill="#496383">v2</text>
          </g>
          <path d="M14 35H222" stroke="#e3eaf2" strokeWidth="1.3" />
          <path d="M-4 20H6V39H-4Z M-4 112H6V131H-4Z" fill="#a7b8cb" stroke="#829ab4" strokeWidth="1" />
          <g data-part="scope-page" visibility="hidden">
            <text x="17" y="61" fontSize="22" fill="#496383">{copy.scene.scopeOriginal}</text>
            <g data-part="scope-strike">
              <path d="M14 54L152 66" fill="none" stroke="#54759f" strokeWidth="2" pathLength="1" />
            </g>
            <g data-part="scope-edit">
              <text x="17" y="104" fontSize="23" fill="#496383">{copy.scene.scopeEdited}</text>
            </g>
            <g data-part="scope-lines">
              <path d="M17 128H151M17 140H116" fill="none" stroke="#a5b8d2" strokeWidth="2" pathLength="1" />
            </g>
          </g>
          <g data-part="prototype-page" visibility="hidden">
            <rect x="18" y="50" width="127" height="86" rx="3" fill="#f9fbff" stroke="#bacbe0" strokeWidth="1.5" />
            <path d="M18 68H145" stroke="#c6d3e4" />
            <rect x="37" y="102" width="87" height="19" rx="2" fill="#7597d0" />
            <g data-part="prototype-lines">
              <path d="M32 82H111M32 91H92M49 111H112" fill="none" stroke="#91a8c8" strokeWidth="2" pathLength="1" />
            </g>
            <path d="M171 56H218V136H171Z" fill="#fff" stroke="#bccce0" strokeWidth="1.5" />
            <path d="M180 68H209M179 86H208M179 99H201" stroke="#c8d5e7" strokeWidth="2" />
          </g>
          <g data-part="code-page" visibility="hidden">
            <text x="18" y="63" fontSize="19" fill="#496383">{copy.scene.implementation}</text>
            <g data-part="code-line-0">
              <path d="M30 84h153" fill="none" stroke="#a7b9d3" strokeWidth="2.8" pathLength="1" />
            </g>
            <g data-part="code-line-1">
              <path d="M46 100h122" fill="none" stroke="#557cc3" strokeWidth="2.8" pathLength="1" />
            </g>
            <g data-part="code-line-2">
              <path d="M30 116h160" fill="none" stroke="#a7b9d3" strokeWidth="2.8" pathLength="1" />
            </g>
            <g data-part="code-line-3">
              <path d="M46 132h106" fill="none" stroke="#557cc3" strokeWidth="2.8" pathLength="1" />
            </g>
          </g>
          <g data-part="test-page" visibility="hidden">
            <text x="18" y="65" fontSize="21" fill="#496383">{copy.scene.submitQuery}</text>
            <g data-part="defect-label">
              <text x="18" y="109" fontSize="21" fill="#496383">{copy.scene.duplicate}</text>
            </g>
            <g data-part="fix-note">
              <text x="18" y="140" fontSize="16" fill="#496383">{copy.scene.fix}</text>
            </g>
            <g data-part="test-pass">
              <path d="M187 54L195 63L211 44" fill="none" stroke="#5b83c1" strokeWidth="3" />
            </g>
            <g data-part="defect-cross">
              <path d="M190 91L209 110M209 91L190 110" stroke="#6686b7" strokeWidth="3" />
            </g>
            <g data-part="retest-pass">
              <path d="M187 99L195 108L211 89" fill="none" stroke="#557cc3" strokeWidth="3" pathLength="1" />
            </g>
          </g>
          <g data-part="release-page" visibility="hidden">
            <g data-part="release-verdict">
              <text x="18" y="64" fontSize="22" fill="#496383">{copy.scene.accepted}</text>
            </g>
            <g data-part="release-approved">
              <text x="18" y="105" fontSize="21" fill="#496383">{copy.scene.releaseApproved}</text>
            </g>
            <g data-part="release-seal">
              <path d="M183 59L211 74V108L183 123L155 108V74Z" fill="#e7effa" stroke="#8ca8d1" />
              <path d="M169 91L181 102L199 80" fill="none" stroke="#6f92c9" strokeWidth="3" />
            </g>
          </g>
          <g data-part="feedback-page" visibility="hidden">
            <rect x="20" y="49" width="59" height="95" rx="5" fill="#fbfcfe" stroke="#9fb5ce" strokeWidth="2" />
            <path d="M39 58H60M30 79H68M30 92H62" stroke="#c1cee0" strokeWidth="2" />
            <text x="95" y="77" fontSize="20" fill="#496383">{copy.scene.mobileEntry}</text>
            <text x="95" y="109" fontSize="20" fill="#496383">{copy.scene.hardToFind}</text>
            <path d="M31 120H67" stroke="#7394c5" strokeWidth="2" strokeDasharray="3 3" />
          </g>
          <g data-part="learning-page" visibility="hidden">
            <text x="17" y="60" fontSize="18" fill="#496383">{copy.scene.summary}</text>
            <text x="17" y="91" fontSize="22" fill="#496383">{copy.scene.mobileAcceptance}</text>
            <g data-part="learning-edit">
              <text x="17" y="125" fontSize="21" fill="#496383">{copy.scene.humanAmendment}</text>
            </g>
          </g>
          <g data-part="v2-page">
            <rect x="20" y="49" width="59" height="95" rx="5" fill="#fbfcfe" stroke="#9fb5ce" strokeWidth="2" />
            <path d="M39 58H60M30 79H68M30 92H62" stroke="#c1cee0" strokeWidth="2" />
            <g data-part="mobile-entry">
              <rect x="29" y="113" width="41" height="17" rx="2" fill="#7397d0" />
              <path d="M36 122H63" stroke="#fff" strokeWidth="2" />
            </g>
            <g data-part="v2-criteria">
              <text x="102" y="77" fontSize="20" fill="#496383">{copy.scene.mobile}</text>
              <text x="102" y="111" fontSize="20" fill="#496383">{copy.scene.permissions}</text>
            </g>
            <g data-part="v2-check-0">
              <path d="M193 66L201 74L216 55" fill="none" stroke="#557cc3" strokeWidth="3" pathLength="1" />
            </g>
            <g data-part="v2-check-1">
              <path d="M193 102L201 110L216 91" fill="none" stroke="#557cc3" strokeWidth="3" pathLength="1" />
            </g>
          </g>
          <g data-part="page-curl" opacity="0">
            <path d="M224 0L240 15L208 18Z" fill="#dae6f5" />
          </g>
          <g data-part="pencil" data-home="50,105" transform="translate(50 105) scale(1)" visibility="hidden">
            <path d="M0 0H60V7H0Z" fill="#617fa8" />
            <path d="M60 0L74 3.5L60 7Z" fill="#c8b18a" />
            <path d="M71 2L77 3.5L71 5Z" fill="#354c68" />
          </g>
          <g data-part="approval" data-home="215,129" transform="translate(215 129) scale(1)" visibility="hidden">
            <circle r="18" fill="#fff" stroke="#6d91c7" strokeWidth="1.8" />
            <text x="-14" y="5" fontSize="14" fill="#496383">{copy.scene.adopted}</text>
          </g>
        </g>
        </g>
        <g data-layout="review">
        <g data-part="review-label">
          <text x="407" y="462" fontSize="19" fill="#496383">{copy.scene.pending}</text>
        </g>
        </g>
        <g data-layout="archive">
        <g data-part="rack">
          <ellipse cx="203" cy="623" rx="116" ry="12" fill="#b1c0d1" opacity=".16" filter="url(#lifecycle-contact-shadow)" />
          <path d="M93 506L104 501V620L93 625Z" fill="#c6d5e6" />
          <path d="M301 506L312 501V620L301 625Z" fill="#a9bed7" />
          <path d="M104 501H301L312 506H115Z" fill="#eef3f9" />
          <path d="M104 557H301L312 563H115Z" fill="#f9fbfd" />
          <path d="M115 563H312V570H115Z" fill="#cbd9ea" />
          <path d="M104 614H301L312 620H115Z" fill="#f9fbfd" />
          <path d="M115 620H312V627H115Z" fill="#c4d3e6" />
        </g>
        </g>
        <g data-layout="archive">
        <g data-part="asset-label">
          <text x="105" y="490" fontSize="19" fill="#496383">{copy.scene.archive}</text>
        </g>
        </g>
        <g data-layout="archive">
        <g data-part="v1-history" data-home="126,507" transform="translate(126 507) scale(0.8)" data-version="1" data-method-revision="0">
          <path d="M3 5H228V71H3Z" fill="#b9c9da" />
          <path d="M0 0H210L225 15V66H0Z" fill="#fff" stroke="#a0b4cc" strokeWidth="1.5" />
          <path d="M210 0V15H225" fill="#edf3f9" stroke="#b5c5d7" strokeWidth="1.3" />
          <text x="13" y="24" fontSize="20" fill="#496383">REQ-014 · v1</text>
          <text x="13" y="52" fontSize="24" fill="#496383">{copy.scene.released}</text>
        </g>
        </g>
        <g data-layout="archive">
        <g data-part="experience" data-home="124,576" transform="translate(124 576) scale(0.42)" data-source="REQ-014">
          <path d="M3 5H175V107H3Z" fill="#b9c9da" />
          <path d="M0 0H157L172 15V102H0Z" fill="#fff" stroke="#a0b4cc" strokeWidth="1.5" />
          <path d="M157 0V15H172" fill="#edf3f9" stroke="#b5c5d7" strokeWidth="1.3" />
          <text x="13" y="24" fontSize="16" fill="#496383">{copy.scene.experience}</text>
          <text x="13" y="53" fontSize="22" fill="#496383">{copy.scene.mobileMethod}</text>
          <text x="13" y="82" fontSize="20" fill="#496383">{copy.scene.roleMethod}</text>
        </g>
        </g>
        <g data-layout="archive">
        <g data-part="method" data-home="245,600" transform="translate(245 600) scale(1)" data-method="original" data-revision="1">
          <polygon points="-39.60,19.80 -4.50,37.35 -4.50,-12.65 -39.60,-30.20" fill="#e0e8f3" />
          <polygon points="35.10,17.55 -4.50,37.35 -4.50,-12.65 35.10,-32.45" fill="#b4c4da" />
          <polygon points="0.00,-50.00 35.10,-32.45 -4.50,-12.65 -39.60,-30.20" fill="#fbfdff" />
          <polygon points="-42.30,18.45 -38.70,20.25 -38.70,-31.75 -42.30,-33.55" fill="#4167ad" />
          <polygon points="0.90,0.45 -38.70,20.25 -38.70,-31.75 0.90,-51.55" fill="#34558f" />
          <polygon points="-2.70,-53.35 0.90,-51.55 -38.70,-31.75 -42.30,-33.55" fill="#7599d4" />
          <polygon points="-39.60,19.80 -4.50,37.35 -4.50,34.35 -39.60,16.80" fill="#557fc1" />
          <g data-part="method-cover">
            <polygon points="-39.60,16.80 -4.50,34.35 -4.50,-14.65 -39.60,-32.20" fill="#5d84c8" />
            <polygon points="-34.20,2.50 -12.60,13.30 -12.60,11.30 -34.20,0.50" fill="#eaf3ff" />
            <polygon points="-34.20,-9.50 -12.60,1.30 -12.60,-0.70 -34.20,-11.50" fill="#eaf3ff" />
            <polygon points="-34.20,-21.50 -12.60,-10.70 -12.60,-12.70 -34.20,-23.50" fill="#eaf3ff" />
          </g>
        </g>
        </g>
        <g data-part="reference" data-home="640,355" transform="translate(640 355) scale(0.8)" data-reference="method-1" data-revision="1">
          <polygon points="-25.20,12.60 -1.80,24.30 -1.80,-17.70 -25.20,-29.40" fill="#5b82c8" />
          <polygon points="23.40,11.70 -1.80,24.30 -1.80,-17.70 23.40,-30.30" fill="#3e64a9" />
          <polygon points="0.00,-42.00 23.40,-30.30 -1.80,-17.70 -25.20,-29.40" fill="#93ade0" />
          <path d="M-18 -20L-4 -13M-18 -12L-4 -5" stroke="#e5f0ff" strokeWidth="2" />
        </g>
        <g data-part="goal" data-home="482,293" transform="translate(482 293) scale(1)" visibility="hidden">
          <path d="M3 5H57V44H3Z" fill="#b9c9da" />
          <path d="M0 0H39L54 15V39H0Z" fill="#fff" stroke="#a0b4cc" strokeWidth="1.5" />
          <path d="M39 0V15H54" fill="#edf3f9" stroke="#b5c5d7" strokeWidth="1.3" />
          <text x="10" y="26" fontSize="15" fill="#496383">{copy.scene.goal}</text>
        </g>
        <g data-layout="archive">
        <g data-part="shelf-edge" opacity="0">
          <path d="M115 620H307" stroke="#6389c7" strokeWidth="2" opacity=".65" />
        </g>
        </g>
      </g>
    </svg>
  );
}
