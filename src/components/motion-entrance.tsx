"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** 屏外章节只入场一次；SSR、减少动态和已在视口内的内容始终可读。 */
export function MotionEntrance() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const pending = elements.filter((element) => !element.parentElement?.closest("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.revealState = "visible";
        observer.unobserve(entry.target);
      });
    }, { threshold: .04, rootMargin: "0px 0px -24px 0px" });

    function syncPreference() {
      observer.disconnect();
      pending.forEach((element) => {
        const aboveFold = element.getBoundingClientRect().top < window.innerHeight - 24;
        if (preference.matches || aboveFold || element.dataset.revealState === "visible") {
          element.dataset.revealState = "visible";
        } else {
          element.dataset.revealState = "waiting";
          observer.observe(element);
        }
      });
    }

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncPreference);
      pending.forEach((element) => delete element.dataset.revealState);
    };
  }, [pathname]);

  return null;
}
