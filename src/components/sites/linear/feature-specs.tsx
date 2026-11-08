"use client";

import { AssetImage } from "./asset-image";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import specData from "./specs-data.json";
import { trapDialogTab } from "@/components/ui/dialog-focus";
import styles from "./linear.module.css";

type Spec = {
  title: string;
  description: string;
  images: { src: string; alt: string }[];
  rows: string[][];
  headers: string[][];
  subheadings: string[];
  text: string;
  links: { text: string; href: string }[];
};
const specs: Record<string, Spec> = specData;

export function FeatureSpecs({ names }: { names: string[] }) {
  const titleId = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const spec = selected ? specs[selected] : null;
  useEffect(() => {
    if (!selected || !dialog.current) return;
    const element = dialog.current;
    const oldOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
    };
  }, [selected]);
  return (
    <>
      <div className={styles.featureRow}>
        <span>Features</span>
        <div className={styles.featureButtons}>
          {names.map((name) => (
            <button
              onClick={() => setSelected(name)}
              key={name}
              aria-haspopup="dialog"
            >
              {name}
              <span aria-hidden="true">+</span>
            </button>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        onKeyDown={trapDialogTab}
        className={styles.specDialog}
        aria-labelledby={titleId}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              dialog.current?.close();
          }
        }}
      >
        <div className={styles.specTop}>
          <span>TECH SPECS</span>
          <button
            onClick={() => dialog.current?.close()}
            aria-label="Close technical specifications"
          >
            <X />
          </button>
        </div>
        {spec && (
          <div className={styles.specContent}>
            <h2 id={titleId}>{spec.title}</h2>
            <p>{spec.description}</p>
            {spec.images.map((image) => (
              <figure key={image.src}>
                <AssetImage src={image.src} alt={image.alt} />
                <figcaption>
                  {image.alt
                    .replace(/^A blueprint image of (the |an? )?/i, "")
                    .replace(/ in Linear\.?$/i, "")}
                </figcaption>
              </figure>
            ))}
            {spec.rows.length > 0 ? (
              <>
                <h3>{spec.subheadings[0] || "Features & properties"}</h3>
                <table className={styles.specTable}>
                  <thead>
                    <tr>
                      {(spec.headers[0] || ["Property", "Details"]).map(
                        (header) => (
                          <th scope="col" key={header}>
                            {header}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {spec.rows.map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, i) => (
                          <td key={i}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className={styles.specDescription}>
                {spec.text.split(spec.description)[1]?.trim()}
              </div>
            )}
            {spec.links.length > 0 && (
              <p>
                {spec.links.map((link) => (
                  <a
                    key={link.href}
                    href={
                      link.href.startsWith("/")
                        ? `https://linear.app${link.href}`
                        : link.href
                    }
                  >
                    {link.text} →{" "}
                  </a>
                ))}
              </p>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
