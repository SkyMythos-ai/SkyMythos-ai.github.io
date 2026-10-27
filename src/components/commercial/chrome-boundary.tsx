"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { basePath } from "@/lib/site";

/** 旧显式深链保留原外壳；两个 Server slot 只挂载当前路径对应的一份，不隐藏重复 DOM。 */
export function MarketingChromeBoundary({ commercial, legacy }: { commercial: ReactNode; legacy: ReactNode }) {
  const pathname = usePathname();
  const appPath = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
  return /^\/zh\/(?:concept|architecture)\/?$/.test(appPath) ? legacy : commercial;
}
