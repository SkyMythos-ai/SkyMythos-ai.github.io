import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { lifecycleCopy } from "./copy";
import { LifecyclePlayback } from "./playback";
import { LifecycleScene } from "./scene";
import styles from "./hero-lifecycle.module.css";

export function HeroLifecycle({ locale }: { locale: Locale }) {
  const copy = lifecycleCopy[locale];
  return <figure className={styles.figure}>
    <LifecyclePlayback locale={locale}>
      <div className={styles.headings} key="headings">
        {copy.headings.map((heading, index) => <div key={heading} className={styles.heading} data-act-heading={index} hidden={index !== 2}>
          <span aria-hidden="true">0{index + 1}</span><h2>{heading}</h2>
        </div>)}
      </div>
      <LifecycleScene key="scene" copy={copy} />
      <p className={styles.status} data-lifecycle-status="" key="status">{copy.status.pending}</p>
      <div className={styles.cli} key="cli">
        <span className={styles.cliContext}>{copy.cliContext}<small>{copy.cliNote}</small></span>
        <span className={styles.cliBrand}><img src={`${basePath}/brand/claude-symbol.svg`} width={22} height={22} alt="" />Claude Code</span>
        <span className={styles.cliBrand}><img src={`${basePath}/brand/openai-blossom.svg`} width={22} height={22} alt="" />Codex CLI</span>
      </div>
      <div className={styles.track} aria-hidden="true" key="track">
        {[0, 1, 2].map(index => <span key={index} data-act-track={index} data-active={index === 2} />)}
      </div>
    </LifecyclePlayback>
    <figcaption className={styles.caption}>
      <span>{copy.caption}</span>
      <details className={styles.boundary}><summary>{copy.boundaryLabel}</summary><p>{copy.boundary}</p></details>
    </figcaption>
  </figure>;
}
