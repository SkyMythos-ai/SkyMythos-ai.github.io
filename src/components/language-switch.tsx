"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeHtmlLang, localeLabels, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** 语言选择保留当前页面；使用原生按钮与链接支持键盘和新标签页导航。 */
export function LanguageSwitch({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [urlSuffix, setUrlSuffix] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsidePress(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open]);

  function localeHref(targetLocale: Locale) {
    // 仅替换语言前缀，保留文档路径及末尾斜杠；basePath 交给 Next Link。
    const target = /^\/(zh|en)(?=\/|$)/.test(pathname)
      ? pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${targetLocale}`)
      : `/${targetLocale}${pathname === "/" ? "" : pathname}`;
    return `${target}${urlSuffix}`;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative shrink-0", className)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setUrlSuffix(`${window.location.search}${window.location.hash}`);
          setOpen((value) => !value);
        }}
        className={cn(
          "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
          "text-ink-2 transition-colors hover:bg-paper-deep hover:text-ink",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal",
          open && "bg-paper-deep text-ink",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="8" cy="8" r="6.4" />
          <ellipse cx="8" cy="8" rx="2.7" ry="6.4" />
          <path d="M1.6 8h12.8" />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-3 w-40 rounded-lg border border-rule bg-surface p-1.5 shadow-lg"
      >
        <ul aria-label={label}>
          {locales.map((option) => (
            <li key={option}>
              <Link
                href={localeHref(option)}
                hrefLang={localeHtmlLang[option]}
                lang={localeHtmlLang[option]}
                aria-current={option === locale ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-10 items-center justify-between rounded-md px-3 text-sm text-ink-2",
                  "transition-colors hover:bg-paper-deep hover:text-ink focus-visible:bg-paper-deep focus-visible:outline-2 focus-visible:outline-signal",
                  option === locale && "bg-paper-deep font-medium text-ink",
                )}
              >
                <span>{localeLabels[option]}</span>
                {option === locale && (
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m3 8 3.2 3.2L13 4.5" />
                  </svg>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
