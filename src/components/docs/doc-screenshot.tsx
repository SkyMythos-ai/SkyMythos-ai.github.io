import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import styles from "./doc-screenshot.module.css";

export type ScreenshotAnnotationItem = {
  step: string;
  title: string;
  description: string;
};

export type DocScreenshotProps = {
  locale: Locale;
  name: string;
  alt: string;
  caption?: string;
  annotations?: ScreenshotAnnotationItem[];
};

/**
 * Render an annotated SkyMythos Web Console screenshot with a responsive numbered callout legend.
 */
export function DocScreenshot({
  locale,
  name,
  alt,
  caption,
  annotations,
}: DocScreenshotProps) {
  const src = `/sites/fusion/docs/${locale}/${name}.png`;
  const hasLegend = Boolean(caption || (annotations && annotations.length > 0));

  return (
    <figure className={styles.wrapper} data-slot="doc-screenshot">
      <div className={styles.frame}>
        <Image
          src={src}
          alt={alt}
          width={1440}
          height={860}
          loading="eager"
          unoptimized
          className={styles.image}
        />
      </div>
      {hasLegend ? (
        <figcaption className={styles.legend}>
          {caption ? <p className={styles.caption}>{caption}</p> : null}
          {annotations && annotations.length > 0 ? (
            <ol
              className={
                caption ? styles.list : `${styles.list} ${styles.captionOnly}`
              }
            >
              {annotations.map((item) => (
                <li key={item.step} className={styles.item}>
                  <span className={styles.badge} aria-hidden="true">
                    {item.step}
                  </span>
                  <div className={styles.itemBody}>
                    <strong className={styles.itemTitle}>{item.title}</strong>
                    <span className={styles.itemSep}>—</span>
                    <span>{item.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
