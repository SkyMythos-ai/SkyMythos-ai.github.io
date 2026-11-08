"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore, type SyntheticEvent } from "react";
import { Languages } from "lucide-react";
import { localizeHref } from "@/lib/i18n";
import { useLocale } from "./locale-provider";
import styles from "./sites/fusion/site.module.css";

function subscribeURL(callback: () => void) {
  const navigation = (window as Window & { navigation?: EventTarget }).navigation;
  // 同页章节链接可通过history更新，未必触发hashchange。
  navigation?.addEventListener("currententrychange", callback);
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    navigation?.removeEventListener("currententrychange", callback);
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
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
