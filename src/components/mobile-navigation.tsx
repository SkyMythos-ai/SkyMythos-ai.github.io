"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** 原生菜单渐进增强：无脚本仍可展开，有脚本时补上退场、焦点和滚动约束。 */
export function MobileNavigation({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const panelId = useId();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const releaseModalRef = useRef<(() => void) | null>(null);

  function finishClose(restoreFocus: boolean) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    const details = detailsRef.current;
    if (details) {
      details.open = false;
      delete details.dataset.state;
    }
    releaseModalRef.current?.();
    releaseModalRef.current = null;
    if (restoreFocus) summaryRef.current?.focus();
  }

  function closeMenu(restoreFocus: boolean) {
    const details = detailsRef.current;
    if (!details?.open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose(restoreFocus);
      return;
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    details.dataset.state = "closing";
    closeTimerRef.current = setTimeout(() => finishClose(restoreFocus), 260);
  }

  useEffect(() => {
    // 路由接管焦点时立即释放约束，不把焦点拉回已离开的页面。
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    if (detailsRef.current) {
      detailsRef.current.open = false;
      delete detailsRef.current.dataset.state;
    }
    releaseModalRef.current?.();
    releaseModalRef.current = null;
  }, [pathname]);

  useEffect(() => {
    const details = detailsRef.current;
    const masthead = details?.closest<HTMLElement>(".site-masthead");
    if (!details || !masthead) return;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const updateModal = () => {
      if (!details.open || desktopQuery.matches) {
        releaseModalRef.current?.();
        releaseModalRef.current = null;
        return;
      }
      if (releaseModalRef.current) return;

      const previousOverflow = document.documentElement.style.overflow;
      const previousBodyOverflow = document.body.style.overflow;
      const siblings = Array.from(masthead.parentElement?.children ?? [])
        .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== masthead)
        .map((element) => ({ element, inert: element.inert }));

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      siblings.forEach(({ element }) => { element.inert = true; });

      releaseModalRef.current = () => {
        document.documentElement.style.overflow = previousOverflow;
        document.body.style.overflow = previousBodyOverflow;
        siblings.forEach(({ element, inert }) => { element.inert = inert; });
      };
    };

    // 语言按钮既支持指针也支持键盘激活；两个菜单不会同时占据页面。
    const closeOutside = (event: PointerEvent) => {
      if (details.open && event.target instanceof Node && !details.contains(event.target)) closeMenu(false);
    };
    const closeOnExternalClick = (event: MouseEvent) => {
      if (details.open && event.target instanceof Node && !details.contains(event.target)) closeMenu(false);
    };
    const handleKeyboard = (event: KeyboardEvent) => {
      if (!details.open || desktopQuery.matches || event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(masthead.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.getClientRects().length > 0 && !element.closest("[hidden], [inert]"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const constrainFocus = (event: FocusEvent) => {
      if (details.open && !desktopQuery.matches && event.target instanceof Node && !masthead.contains(event.target)) {
        summaryRef.current?.focus();
      }
    };
    const handleBreakpoint = () => {
      if (desktopQuery.matches) finishClose(false);
    };

    details.addEventListener("toggle", updateModal);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("click", closeOnExternalClick);
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("focusin", constrainFocus);
    desktopQuery.addEventListener("change", handleBreakpoint);
    updateModal();
    return () => {
      details.removeEventListener("toggle", updateModal);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("click", closeOnExternalClick);
      document.removeEventListener("keydown", handleKeyboard);
      document.removeEventListener("focusin", constrainFocus);
      desktopQuery.removeEventListener("change", handleBreakpoint);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      releaseModalRef.current?.();
      releaseModalRef.current = null;
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      className="site-masthead__mobile-menu"
      onClick={(event) => {
        // 等待退场完成后再关闭原生 details，避免内容在动画开始前被隐藏。
        if (event.target instanceof Node && summaryRef.current?.contains(event.target)) {
          if (detailsRef.current?.open) {
            event.preventDefault();
            closeMenu(true);
          }
          return;
        }
        if (event.target instanceof Element && event.target.classList.contains("site-masthead__mobile-overlay")) {
          closeMenu(true);
          return;
        }
        // 当前页链接也要收起；保留修饰键打开新标签页的原生行为。
        if (
          event.button === 0 && !event.metaKey && !event.ctrlKey &&
          !event.shiftKey && !event.altKey &&
          event.target instanceof Element && event.target.closest("a[href]")
        ) {
          closeMenu(true);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && detailsRef.current?.open) {
          event.preventDefault();
          event.stopPropagation();
          closeMenu(true);
        }
      }}
    >
      <summary ref={summaryRef} aria-label={label} aria-controls={panelId}>
        <span className="site-masthead__menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </summary>
      <div id={panelId} className="site-masthead__mobile-overlay">
        {children}
      </div>
    </details>
  );
}
