import type { Locale } from "@/lib/i18n";
import { executionCopy } from "./copy";
import { ExecutionPlayback } from "./playback";
import styles from "./screen.module.css";

export function ExecutionPreview({ locale }: {locale: Locale}) {
  const copy = executionCopy[locale];
  return <ExecutionPlayback locale={locale}>
    <div className={styles.screen} data-execution-screen="" data-inspection="records">
      <div className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">Ⅱ</span>
        <div className={styles.heading}><strong>{copy.title}</strong><span>{copy.node}</span></div>
        <span className={styles.status} data-execution-status="">{copy.ready}</span>
      </div>
      <div>
        <div className={styles.planHeading}><strong>{copy.plan}</strong><span><span data-execution-count="">4</span> / 4 {copy.count}</span></div>
        <div className={styles.progress} aria-hidden="true">{copy.steps.map((_, i) => <span key={i}><span data-execution-progress={i}/></span>)}</div>
        <ol className={styles.steps}>{copy.steps.map((step, i) => <li key={step} data-execution-step={i} data-state="done">
          <span className={styles.stepNumber} aria-hidden="true"><span className={styles.number}>{i + 1}</span><span className={styles.tick}>✓</span></span>
          <span>{step}</span><span className={styles.stepState} data-execution-step-state="">{copy.states.done}</span>
        </li>)}</ol>
      </div>
      <div className={styles.agent}>
        <strong><span className={styles.miniAvatar} aria-hidden="true">Ⅱ</span>Agent</strong>
        <div className={styles.messages}>{copy.messages.map((message, i) => <p key={message} data-execution-message={i} data-active={i === 4} aria-hidden={i !== 4}>{message}</p>)}</div>
      </div>
      <div className={styles.footer}>
      <div className={styles.records} data-execution-records="">
        <div className={styles.recordHeading}><span>{copy.records}</span><span className={styles.view}>{[["none", copy.awaiting], ...Object.entries(copy.inspection)].map(([key, text]) => <span key={key} data-execution-view={key} data-active={key === "records"} aria-hidden={key !== "records"}>{text}</span>)}</span></div>
        <ul>{copy.entries.map((entry, i) => <li key={entry} data-execution-record={i}><span aria-hidden="true">✓</span>{entry}</li>)}</ul>
      </div>
      <div className={styles.results}>
        <div data-execution-checks=""><span>{copy.checks}</span><strong>{copy.checked}</strong></div>
        <div data-execution-delivery=""><span>{copy.delivery}</span><strong>CSV / Excel <span className={styles.review}>{copy.review}</span></strong></div>
      </div>
      </div>
    </div>
  </ExecutionPlayback>;
}
