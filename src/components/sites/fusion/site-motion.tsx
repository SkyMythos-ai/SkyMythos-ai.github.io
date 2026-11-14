"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

type SiteMotion = {
  enabled: boolean;
  running: boolean;
  reducedMotion: boolean;
  paused: boolean;
  togglePaused: () => void;
};

const MotionContext = createContext<SiteMotion>({
  enabled: false,
  running: false,
  reducedMotion: true,
  paused: false,
  togglePaused: () => {},
});

function subscribePreference(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

/** 首页装饰动效统一暂停；工作台自己的示例播放控制仍由工作台负责。 */
export function SiteMotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribePreference, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
  const [paused, setPaused] = useState(false);
  const togglePaused = useCallback(() => setPaused(value => !value), []);
  const enabled = !reducedMotion && !paused;
  const value = useMemo(() => ({ enabled, running: enabled && visible, reducedMotion, paused, togglePaused }), [enabled, visible, reducedMotion, paused, togglePaused]);

  return (
    <MotionContext.Provider value={value}>
      <div data-site-motion={enabled ? "active" : "static"} data-motion-running={value.running}>
        {children}
      </div>
    </MotionContext.Provider>
  );
}

export function useSiteMotion() {
  return useContext(MotionContext);
}
