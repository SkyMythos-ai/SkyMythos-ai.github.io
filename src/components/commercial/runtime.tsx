"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { mountCapabilities } from "./capability-controller";
import { bootstrapProductShadows } from "./demo-controller";
import { mountCommercialSite } from "./site-controller";

/**
 * 只接收稳定根 ID，不序列化产品 HTML。真实 Next 路由变化会释放旧控制器并挂载新页面。
 * StrictMode 的 mount → dispose → mount 保留已解析 ShadowRoot，同时恢复作者节点和监听边界。
 */
export function CommercialRuntime({ rootId }: { rootId: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    bootstrapProductShadows(root);
    const site = mountCommercialSite(root);
    const releaseCapabilities = mountCapabilities(root, site);
    let disposed = false;
    function dispose() {
      if (disposed) return;
      disposed = true;
      releaseCapabilities();
      site.dispose();
      window.removeEventListener("pagehide", pagehide);
    }
    function pagehide(event: PageTransitionEvent) {
      // bfcache 保留实例但暂停时钟；真正离开页面才释放整个控制器。
      if (!event.persisted) dispose();
    }
    window.addEventListener("pagehide", pagehide);
    return dispose;
  }, [rootId, pathname]);
  return null;
}
