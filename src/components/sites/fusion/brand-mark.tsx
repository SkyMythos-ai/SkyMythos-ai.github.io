import styles from "./brand-mark.module.css";
import { brandPaths, companionBodyPath } from "./brand-shape";
export { setCompanionBrandProgress } from "./brand-shape";

type CompanionBodyProps = {
  className?: string;
  stretch?: boolean;
  brandForm?: boolean;
};

type CompanionFaceProps = {
  className?: string;
  blinking?: boolean;
  dizzy?: boolean;
};

export function CompanionBody({ className, stretch = false, brandForm = false }: CompanionBodyProps) {
  if (brandForm) {
    return (
      <svg className={[styles.body, className].filter(Boolean).join(" ")} viewBox="0 0 256 306" preserveAspectRatio="none" aria-hidden="true" data-companion-body>
        <path data-brand-upper d={brandPaths[0]} fill="currentColor" />
        <path data-brand-lower d={brandPaths[1]} fill="currentColor" />
        <g transform="scale(3.2 4.25)" opacity="var(--brand-morph, 0)">
          <path fill="#7890ff" opacity=".65" d="M22 9 L59 4 Q65 3 67 7 L57 13 L18 17 Q19 12 22 9 Z" />
          <path fill="#203bc8" opacity=".8" d="M64 43 Q63 52 54 54 L39 57 L24 67 Q19 69 21 63 L23 57 L38 52 L55 49 Q61 48 64 43 Z" />
        </g>
      </svg>
    );
  }
  return (
    <svg className={[styles.body, className].filter(Boolean).join(" ")} viewBox="0 0 80 72" preserveAspectRatio={stretch ? "none" : "xMidYMid meet"} aria-hidden="true" data-companion-body>
      <path fill="#3156ff" d={companionBodyPath} />
      <path fill="#7890ff" opacity=".65" d="M22 9 L59 4 Q65 3 67 7 L57 13 L18 17 Q19 12 22 9 Z" />
      <path fill="#203bc8" opacity=".8" d="M64 43 Q63 52 54 54 L39 57 L24 67 Q19 69 21 63 L23 57 L38 52 L55 49 Q61 48 64 43 Z" />
    </svg>
  );
}

export function CompanionFace({ className, blinking = false, dizzy = false }: CompanionFaceProps) {
  return (
    <svg className={[styles.face, className].filter(Boolean).join(" ")} viewBox="0 0 40 28" aria-hidden="true" data-companion-face data-blinking={blinking}>
      <g className={styles.gaze}>
        {dizzy ? (
          <g fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="11" cy="14" r="5" />
            <circle cx="28" cy="14" r="5" />
            <path d="M9 14a2 2 0 1 0 2-2 M26 14a2 2 0 1 0 2-2" />
          </g>
        ) : (
          <g className={styles.eyes} fill="#fff">
            <rect x="7" y="6" width="8" height="17" rx="4" />
            <rect x="24" y="6" width="8" height="17" rx="4" />
          </g>
        )}
      </g>
    </svg>
  );
}
