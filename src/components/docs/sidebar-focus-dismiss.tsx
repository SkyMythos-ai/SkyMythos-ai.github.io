"use client";

import { useEffect } from "react";
import { useSidebar } from "fumadocs-ui/layouts/docs/slots/sidebar";

/** 框架侧栏为非模态导航；键盘离开导航后同步移除遮罩。 */
export function SidebarFocusDismiss() {
  const { open, mode, setOpen } = useSidebar();
  useEffect(() => {
    if (!open || mode !== "drawer") return;
    function onFocusOutside(event: FocusEvent) {
      const sidebar = document.getElementById("nd-sidebar-mobile");
      if (
        sidebar &&
        event.target instanceof Node &&
        !sidebar.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("focusin", onFocusOutside);
    return () => document.removeEventListener("focusin", onFocusOutside);
  }, [open, mode, setOpen]);
  return null;
}
