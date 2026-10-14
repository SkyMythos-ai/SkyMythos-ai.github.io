"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** 原生菜单渐进增强：同布局路由跳转后收起，无脚本时仍可展开。 */
export function MobileNavigation({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    // 点击语言按钮或页面内容时收起导航，避免两个菜单覆盖同一区域。
    const closeOutside = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  function closeMenu(restoreFocus: boolean) {
    if (!detailsRef.current) return;
    detailsRef.current.open = false;
    if (restoreFocus) summaryRef.current?.focus();
  }

  return (
    <details
      ref={detailsRef}
      className="site-masthead__mobile-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && detailsRef.current?.open) {
          event.preventDefault();
          closeMenu(true);
        }
      }}
      onClick={(event) => {
        // 当前页链接也要收起；保留修饰键打开新标签页的原生行为。
        if (
          event.button === 0 && !event.metaKey && !event.ctrlKey &&
          !event.shiftKey && !event.altKey &&
          event.target instanceof Element && event.target.closest("a[href]")
        ) {
          closeMenu(true);
        }
      }}
    >
      <summary ref={summaryRef} aria-label={label}>
        <span className="site-masthead__menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </summary>
      {children}
    </details>
  );
}
