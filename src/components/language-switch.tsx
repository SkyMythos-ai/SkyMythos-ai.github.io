"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore, type SyntheticEvent } from "react";
import { Languages } from "lucide-react";
import { localizeHref } from "@/lib/i18n";
import { useLocale } from "./locale-provider";
import styles from "./sites/fusion/site.module.css";

function subscribeURL(callback: () => void) {
  let active = true;
  const notify = () => {
    // Next.js App Router 会在 HistoryUpdater 的 useInsertionEffect 内调用 history.pushState，
    // Chromium 的 Navigation API 会同步触发 currententrychange；推迟至微任务避免在 useInsertionEffect 中调度更新。
    queueMicrotask(() => {
      if (active) callback();
    });
  };
  const navigation = (window as Window & { navigation?: EventTarget }).navigation;
  // 同页章节链接可通过history更新，未必触发hashchange。
  navigation?.addEventListener("currententrychange", notify);
  window.addEventListener("hashchange", notify);
  window.addEventListener("popstate", notify);
  return () => {
    active = false;
    navigation?.removeEventListener("currententrychange", notify);
    window.removeEventListener("hashchange", notify);
    window.removeEventListener("popstate", notify);
  };
}

export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const target = locale === "en" ? "zh" : "en";
  const href = useSyncExternalStore(
    subscribeURL,
    () => localizeHref(`${window.location.pathname}${window.location.search}${window.location.hash}`, target),
    () => localizeHref(pathname, target),
  );
  const syncDestination = (event: SyntheticEvent<HTMLAnchorElement>) => {
    // 同时覆盖不支持Navigation API的浏览器及中键、右键与键盘打开。
    event.currentTarget.href = localizeHref(`${window.location.pathname}${window.location.search}${window.location.hash}`, target);
  };
  return (
    <a
      className={styles.languageSwitch}
      href={href}
      hrefLang={target === "zh" ? "zh-CN" : "en"}
      lang={target === "zh" ? "zh-CN" : "en"}
      aria-label={target === "zh" ? "切换到中文" : "Switch to English"}
      onPointerDown={syncDestination}
      onFocus={syncDestination}
      onContextMenu={syncDestination}
      onAuxClick={syncDestination}
      onClick={syncDestination}
    >
      <Languages size={15} aria-hidden="true" />
      <span>{target === "zh" ? "中文" : "English"}</span>
    </a>
  );
}
