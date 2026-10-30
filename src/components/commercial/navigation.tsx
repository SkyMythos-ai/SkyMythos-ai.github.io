"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { commercialNavigation } from "@/content/commercial/navigation";
import { basePath } from "@/lib/site";

/** 共享外壳随客户端换页同步字标与行动入口，避免将首页配色带入内页。 */
function useCommercialHome() {
  const pathname = usePathname();
  const appPath = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
  return /^\/zh\/?$/.test(appPath);
}

export function CommercialWordmark() {
  return <span className="site-wordmark"><Image className="site-wordmark-light" src={`${basePath}/brand/logo-wordmark.svg`} width="158" height="27" alt="SkyMythos.ai" /><Image className="site-wordmark-dark" src={`${basePath}/brand/logo-wordmark-dark.svg`} width="158" height="27" alt="" aria-hidden="true" /></span>;
}

export function CommercialHeaderAction() {
  const home = useCommercialHome();
  return home
    ? <Link prefetch={false} className="button button-small nav-cta" href="/zh/product/">了解产品<span aria-hidden="true">↗</span></Link>
    : <a className="button button-small nav-cta" href="#contact" data-contact>预约演示<span aria-hidden="true">↗</span></a>;
}

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
