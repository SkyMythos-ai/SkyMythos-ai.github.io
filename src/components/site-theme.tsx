"use client";

import { useEffect, useRef, useState } from "react";

export function ThemeToggle({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const [dark, setDark] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.dataset.siteTheme === "dark");
    sync();
    if (button.current) button.current.style.visibility = "visible";
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-site-theme"] });
    return () => observer.disconnect();
  }, []);
  function toggle() {
    const next = document.documentElement.dataset.siteTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.siteTheme = next;
    document.documentElement.setAttribute("data-site-theme-chosen", "");
    try { localStorage.setItem("skymythos-theme", next); } catch { /* Storage may be unavailable. */ }
    setDark(next === "dark");
  }
  return <button ref={button} className="site-theme-toggle" type="button" style={{ visibility: "hidden" }} onClick={toggle} aria-label={locale === "zh" ? (dark ? "切换到浅色模式" : "切换到深色模式") : (dark ? "Switch to light mode" : "Switch to dark mode")}>
    {dark ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42m0-14.14-1.42 1.42M6.35 17.65l-1.42 1.42"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>}
  </button>;
}
