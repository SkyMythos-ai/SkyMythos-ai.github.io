"use client";

import { useEffect, useId, useRef, useState } from "react";
import { basePath } from "@/lib/site";
import { usePathname } from "next/navigation";
import { locales, localeHtmlLang, localeLabels, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { languageSwitchDestination } from "@/lib/commercial-routes";

type LanguageSwitchProps = {
  locale: Locale;
  label: string;
  className?: string;
};

/** 对等页保留位置；中文独有页明确回目标语言首页，保留原生按钮、链接与焦点合同。 */
export function LanguageSwitch(props: LanguageSwitchProps) {
  const pathname = usePathname();
  // 路由切换即重建局部选择器，清除打开状态和旧 URL 后缀，无需 Effect 二次渲染。
  return <LanguageSelector key={pathname} pathname={pathname} {...props} />;
}

function LanguageSelector({
  locale,
  label,
  className,
  pathname,
}: LanguageSwitchProps & { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [urlSuffix, setUrlSuffix] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

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

  function destination(targetLocale: Locale) {
    // 跨语言使用原生链接加载导出 HTML，避免跨根布局缺少共享 RSC 分段。
    return languageSwitchDestination({ pathname, targetLocale, basePath, suffix: urlSuffix });
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
          "site-language-trigger inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm",
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
        className="site-language-panel absolute right-0 top-full z-50 mt-3 w-40 rounded-md border border-rule bg-surface p-1.5"
      >
        <ul aria-label={label}>
          {locales.map((option) => {
            const target = destination(option);
            const optionLabel = target.isEquivalent
              ? localeLabels[option]
              : `${localeLabels[option]}${locale === "zh" ? " 首页" : " home"}`;
            return (
              <li key={option}>
                <a
                  href={target.href}
                  hrefLang={localeHtmlLang[option]}
                  lang={localeHtmlLang[option]}
                  aria-current={option === locale ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "site-language-option flex min-h-10 items-center justify-between rounded-sm px-3 text-sm text-ink-2",
                    "transition-colors hover:bg-paper-deep hover:text-ink focus-visible:bg-paper-deep focus-visible:outline-2 focus-visible:outline-signal",
                    option === locale && "bg-paper-deep font-medium text-ink",
                  )}
                >
                  <span>{optionLabel}</span>
                  {option === locale && (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="m3 8 3.2 3.2L13 4.5" />
                    </svg>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
