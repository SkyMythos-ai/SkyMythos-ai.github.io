"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { commercialNavigation } from "@/content/commercial/navigation";
import { basePath } from "@/lib/site";

/** 与既有 NavLink 一样只将路径高亮放到 Client，主体页面与产品投影仍由 Server 渲染。 */
export function CommercialNavigation() {
  const pathname = usePathname();
  const appPath = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
  const current = appPath.replace(/\/+$/, "");
  return <nav id="navigation" aria-label="主导航">
    {commercialNavigation.map(group => {
      const active = current === `/zh/${group.section}` || current.startsWith(`/zh/${group.section}/`);
      if ("route" in group) return <Link key={group.section} className="nav-link" href={`/zh/${group.route}`} aria-current={active ? "page" : undefined}>{group.label}</Link>;
      return <details className="nav-group" key={group.section} data-section={group.section} data-active={active ? "true" : undefined}>
        <summary>{group.label}</summary>
        <div className={`nav-panel${group.section === "resources" ? " nav-panel-end" : ""}`}>
          <span className="menu-eyebrow">{group.description}</span>
          {group.links.map(([route, label, description]) => {
            const href = route.startsWith("/") ? route : `/zh/${route}`;
            return <Link key={route} href={href} aria-current={current === href.replace(/\/+$/, "") ? "page" : undefined}><strong>{label}</strong><small>{description}</small></Link>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
