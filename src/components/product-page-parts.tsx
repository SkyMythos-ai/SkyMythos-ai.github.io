import Link from "next/link";
import type { ReactNode } from "react";
import { localePath, type Locale } from "@/lib/i18n";

export function ProductLink({ locale, href, children, variant = "text" }: { locale: Locale; href: string; children: ReactNode; variant?: "text" | "action" }) {
  return <Link className={variant === "action" ? "product-action" : "product-text-link"} href={localePath(locale, href)}>{children}<span aria-hidden="true">↗</span></Link>;
}

export function ProductChapter({ id, label, title, intro, children }: {
  id: string; label?: string; title: string; intro: string; children: ReactNode;
}) {
  return <section id={id} className="product-chapter product-width story-chapter" aria-labelledby={`${id}-heading`}>
    {label && <p className="story-eyebrow">{label}</p>}
    <div className="product-chapter-heading"><h2 id={`${id}-heading`}>{title}</h2><p>{intro}</p></div>
    {children}
  </section>;
}
