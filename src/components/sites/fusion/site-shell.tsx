"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bot,
  Boxes,
  Briefcase,
  ChevronDown,
  Code2,
  Cpu,
  Database,
  FileCheck2,
  GitBranch,
  Layers,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trapDialogTab } from "@/components/ui/dialog-focus";
import { getCapabilities } from "./content";
import { getRoleSolutions, type RoleSlug } from "./solutions-data";
import { useLocale } from "@/components/locale-provider";
import { LanguageSwitch } from "@/components/language-switch";
import { localizeHref } from "@/lib/i18n";
import styles from "./site.module.css";

type DropdownKey = "product" | "solutions" | null;

const BUSINESS_ROLES: readonly RoleSlug[] = ["hr", "finance", "sales", "legal"];
const TECH_ROLES: readonly RoleSlug[] = [
  "operations",
  "product",
  "engineering",
  "it-admin",
];

function capabilityIcon(slug: string) {
  const props = { size: 16, strokeWidth: 1.75, "aria-hidden": true as const };
  switch (slug) {
    case "skybot":
      return <Bot {...props} />;
    case "employees":
      return <Users {...props} />;
    case "flows":
      return <GitBranch {...props} />;
    case "automations":
      return <Workflow {...props} />;
    case "knowledge":
      return <Database {...props} />;
    default:
      return <Cpu {...props} />;
  }
}

function roleIcon(slug: RoleSlug) {
  const props = { size: 16, strokeWidth: 1.75, "aria-hidden": true as const };
  switch (slug) {
    case "hr":
      return <Users {...props} />;
    case "finance":
      return <FileCheck2 {...props} />;
    case "sales":
      return <Briefcase {...props} />;
    case "legal":
      return <ShieldCheck {...props} />;
    case "operations":
      return <Workflow {...props} />;
    case "product":
      return <Layers {...props} />;
    case "engineering":
      return <Code2 {...props} />;
    default:
      return <Boxes {...props} />;
  }
}

function useSiteCopy() {
  const locale = useLocale();
  return {
    locale,
    t: (en: string, zh: string) => (locale === "en" ? en : zh),
    href: (path: string) => localizeHref(path, locale),
    capabilities: getCapabilities(locale),
    solutions: getRoleSolutions(locale),
  };
}

export function Brand({ compact = false }: { compact?: boolean }) {
  const file = compact ? "logo-mark" : "logo-lockup";
  return (
    <span className={compact ? styles.brandMark : styles.brandLockup}>
      <Image
        className={styles.lightAsset}
        src={`/sites/fusion/brand/${file}.svg`}
        width={compact ? 26 : 152}
        height={compact ? 31 : 39}
        alt="SkyMythos.ai"
        loading="eager"
        unoptimized
      />
      <Image
        className={styles.darkAsset}
        src={`/sites/fusion/brand/${file}-dark.svg`}
        width={compact ? 26 : 152}
        height={compact ? 31 : 39}
        alt="SkyMythos.ai"
        loading="eager"
        unoptimized
      />
    </span>
  );
}

function ThemeToggle() {
  const { t } = useSiteCopy();
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("skymythos-theme");
      } catch {
        /* 隐私模式仍可切换当次主题。 */
      }
      if (saved !== "light" && saved !== "dark") {
        document.documentElement.dataset.theme = media.matches ? "dark" : "light";
      }
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <Button
      variant="ghost"
      size="icon"
      className={styles.themeToggle}
      aria-label={t("Toggle color theme", "切换明暗主题")}
      onClick={() => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("skymythos-theme", next);
        } catch {
          /* 主题不依赖持久化才能使用。 */
        }
      }}
    >
      <Sun className={styles.darkAsset} />
      <Moon className={styles.lightAsset} />
    </Button>
  );
}

export function SiteHeader() {
  const { t, href, capabilities, solutions } = useSiteCopy();
  const pathname = usePathname() || "/";
  const base = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  const [openMenu, setOpenMenu] = useState<DropdownKey>(null);
  const openMenuRef = useRef<DropdownKey>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hoverOpenedRef = useRef<{ key: DropdownKey; at: number }>({
    key: null,
    at: 0,
  });
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const header = useRef<HTMLElement>(null);
  const mobile = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const isHome = base === "/";
  const isProductActive = base.startsWith("/product");
  const isPricingActive = base.startsWith("/pricing");
  const isSolutionsActive = base.startsWith("/solutions");
  const isSecurityActive = base.startsWith("/security");
  const isDocsActive = base.startsWith("/docs");

  const businessSolutions = solutions.filter((r) =>
    BUSINESS_ROLES.includes(r.slug),
  );
  const techSolutions = solutions.filter((r) => TECH_ROLES.includes(r.slug));

  const setMenuState = (next: DropdownKey) => {
    openMenuRef.current = next;
    setOpenMenu(next);
  };

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setMenuState(null);
    }, 140);
  };

  const openDropdown = (key: "product" | "solutions") => {
    cancelClose();
    if (openMenuRef.current !== key) {
      hoverOpenedRef.current = { key, at: performance.now() };
    }
    setMenuState(key);
  };

  const toggleMenu = (key: "product" | "solutions") => {
    cancelClose();
    if (
      hoverOpenedRef.current.key === key &&
      performance.now() - hoverOpenedRef.current.at < 350
    ) {
      hoverOpenedRef.current = { key: null, at: 0 };
      return;
    }
    setMenuState(openMenuRef.current === key ? null : key);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        header.current &&
        !header.current.contains(event.target)
      ) {
        setMenuState(null);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuState(null);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      cancelClose();
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useEffect(() => {
    const dialog = mobile.current;
    if (!mobileOpen || !dialog || dialog.open) return;
    dialog.showModal();
  }, [mobileOpen]);

  const closeMobile = () => mobile.current?.close();

  const renderRoleColumn = (
    items: ReturnType<typeof getRoleSolutions>,
    colTitle: string,
    hasDivider: boolean,
  ) => (
    <div className={hasDivider ? styles.domainColDivider : undefined}>
      <p className={styles.megaColHeader}>{colTitle}</p>
      <div className={styles.domainList}>
        {items.map((role) => (
          <Link
            key={role.slug}
            href={href(`/solutions/${role.slug}`)}
            className={styles.menuRowLink}
            onClick={() => setMenuState(null)}
          >
            <span className={styles.menuIcon}>{roleIcon(role.slug)}</span>
            <span className={styles.menuRowBody}>
              <span className={styles.menuRowTitle}>
                <strong>{role.name}</strong>
                <ArrowRight size={13} className={styles.menuRowArrow} />
              </span>
              <span className={styles.menuRowDesc}>{role.tagline}</span>
              <span className={styles.tagStrip}>
                {role.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className={styles.tagChip}>
                    {tag}
                  </span>
                ))}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {openMenu && (
        <div
          className={styles.headerScrim}
          aria-hidden="true"
          onClick={() => setOpenMenu(null)}
        />
      )}
      <header
        className={styles.header}
        ref={header}
        data-solid={!isHome || scrolled || Boolean(openMenu)}
        data-elevated={scrolled || Boolean(openMenu)}
        data-menu-open={Boolean(openMenu)}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <Link
              href={href("/")}
              className={styles.brandGroup}
              aria-label={t("SkyMythos home", "SkyMythos 首页")}
            >
              <Brand />
            </Link>
            <span className={styles.brandDivider} aria-hidden="true" />

            <nav aria-label={t("Main navigation", "主导航")} className={styles.desktopNav}>
              <button
                type="button"
                className={`${styles.navItem} ${
                  openMenu === "product" ? styles.triggerOpen : ""
                }`}
                data-active={isProductActive || openMenu === "product"}
                aria-expanded={openMenu === "product"}
                aria-controls="fusion-products"
                onMouseEnter={() => openDropdown("product")}
                onClick={() => toggleMenu("product")}
              >
                {t("Product", "产品能力")}
                <ChevronDown
                  size={13}
                  strokeWidth={1.75}
                  className={styles.navChevron}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                className={`${styles.navItem} ${
                  openMenu === "solutions" ? styles.triggerOpen : ""
                }`}
                data-active={isSolutionsActive || openMenu === "solutions"}
                aria-expanded={openMenu === "solutions"}
                aria-controls="fusion-solutions-menu"
                onMouseEnter={() => openDropdown("solutions")}
                onClick={() => toggleMenu("solutions")}
              >
                {t("Solutions", "解决方案")}
                <ChevronDown
                  size={13}
                  strokeWidth={1.75}
                  className={styles.navChevron}
                  aria-hidden="true"
                />
              </button>

              <Link
                href={href("/pricing")}
                className={styles.navItem}
                data-active={isPricingActive}
                onMouseEnter={scheduleClose}
              >
                {t("Pricing", "定价")}
              </Link>

              <Link
                href={href("/security")}
                className={styles.navItem}
                data-active={isSecurityActive}
                onMouseEnter={scheduleClose}
              >
                {t("Security", "安全合规")}
              </Link>

              <a
                href="https://apigo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navItem}
                onMouseEnter={scheduleClose}
              >
                MaaS
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.75}
                  className={styles.externalNavIcon}
                  aria-hidden="true"
                />
              </a>
            </nav>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.utilityCapsule}>
              <LanguageSwitch />
              <span className={styles.capsuleDivider} aria-hidden="true" />
              <ThemeToggle />
            </div>
            <span className={styles.clusterDivider} aria-hidden="true" />
            <Link
              href={href("/docs")}
              className={styles.docsNavLink}
              data-active={isDocsActive}
              onMouseEnter={scheduleClose}
            >
              <BookOpen size={14} strokeWidth={1.75} aria-hidden="true" />
              {t("Docs", "产品文档")}
            </Link>
            <Link
              className={styles.headerCta}
              href={href("/poc")}
              onMouseEnter={scheduleClose}
            >
              {t("Book a Demo", "预约演示")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={styles.mobileToggle}
              ref={trigger}
              aria-label={t("Open navigation", "打开导航")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        {openMenu && (
          <div
            className={styles.popoverPositioner}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className={styles.popoverInnerFrame}>
              <div
                id={
                  openMenu === "product"
                    ? "fusion-products"
                    : "fusion-solutions-menu"
                }
                className={styles.popoverSurface}
                role="region"
                aria-label={
                  openMenu === "product"
                    ? t("Product capabilities menu", "产品能力菜单")
                    : t("Solutions menu", "解决方案菜单")
                }
              >
                {openMenu === "product" ? (
                  <div className={styles.megaLayout}>
                    <div>
                      <p className={styles.megaColHeader}>
                        {t("Core Harness Capabilities", "核心平台能力")}
                      </p>
                      <div className={styles.capGrid2}>
                        {capabilities.map((cap) => (
                          <Link
                            key={cap.slug}
                            href={href(`/product/${cap.slug}`)}
                            className={styles.menuRowLink}
                            onClick={() => setMenuState(null)}
                          >
                            <span className={styles.menuIcon}>
                              {capabilityIcon(cap.slug)}
                            </span>
                            <span className={styles.menuRowBody}>
                              <span className={styles.menuRowTitle}>
                                <strong>{cap.name}</strong>
                                <ArrowRight
                                  size={13}
                                  className={styles.menuRowArrow}
                                />
                              </span>
                              <span className={styles.menuRowDesc}>
                                {cap.summary}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className={styles.megaSpotlight}>
                      <div>
                        <h4>
                          {t(
                            "AI-Native Harness & Safety Boundaries",
                            "AI-Native Harness 架构与安全边界",
                          )}
                        </h4>
                        <p>
                          {t(
                            "See how TaskSpec, CapabilityLock, and isolated Sandboxes turn intent into auditable delivery.",
                            "了解目标规范（TaskSpec）、能力锁定（CapabilityLock）与隔离 Sandbox 如何协同交付可验收工作。",
                          )}
                        </p>
                      </div>
                      <div className={styles.spotlightLinks}>
                        <Link
                          href={href("/docs/architecture")}
                          onClick={() => setMenuState(null)}
                        >
                          <span>{t("System Architecture", "系统架构与数据流")}</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                        <Link
                          href={href("/docs/getting-started")}
                          onClick={() => setMenuState(null)}
                        >
                          <span>
                            {t("15-Min Quickstart Guide", "15 分钟跑通首个任务")}
                          </span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                        <Link
                          href={href("/security")}
                          onClick={() => setMenuState(null)}
                        >
                          <span>
                            {t("Security & Sandbox Isolation", "安全合规与沙箱隔离")}
                          </span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={styles.domainCols}>
                      {renderRoleColumn(
                        businessSolutions,
                        t("Business & Operations", "业务与职能协同"),
                        false,
                      )}
                      {renderRoleColumn(
                        techSolutions,
                        t("Product, Engineering & IT", "产研与技术治理"),
                        true,
                      )}
                    </div>

                    <div className={styles.popoverFooterBar}>
                      <Link
                        href={href("/solutions")}
                        className={styles.popoverFooterLink}
                        onClick={() => setMenuState(null)}
                      >
                        <span>
                          {t(
                            "Explore all 8 enterprise role solutions",
                            "浏览全部 8 大企业岗位解决方案总览",
                          )}
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                      <Link
                        href={href("/poc?enquiry=enterprise#main-content")}
                        className={styles.popoverFooterLink}
                        onClick={() => setMenuState(null)}
                      >
                        <span>
                          {t("Request scoped enterprise POC", "咨询企业试点方案")}
                        </span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mobileOpen && (
          <dialog
            ref={mobile}
            className={styles.mobileDialog}
            aria-label={t("Site navigation", "网站导航")}
            onKeyDown={trapDialogTab}
            onClose={() => {
              setMobileOpen(false);
              trigger.current?.focus();
            }}
          >
            <div className={styles.mobileDialogHeader}>
              <Link href={href("/")} onClick={closeMobile}>
                <Brand />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("Close navigation", "关闭导航")}
                onClick={closeMobile}
                autoFocus
              >
                <X />
              </Button>
            </div>
            <nav aria-label={t("Mobile navigation", "移动导航")}>
              <p>{t("Solutions by role", "按角色解决方案")}</p>
              {solutions.map((role) => (
                <Link
                  key={role.slug}
                  href={href(`/solutions/${role.slug}`)}
                  onClick={closeMobile}
                >
                  {role.name}
                  <ArrowRight size={18} />
                </Link>
              ))}
              <div className={styles.mobileOther}>
                <Link href={href("/")} onClick={closeMobile}>
                  {t("Product overview", "产品介绍")}
                </Link>
                <Link href={href("/solutions")} onClick={closeMobile}>
                  {t("All role solutions", "全部角色解决方案")}
                </Link>
                <Link href={href("/pricing")} onClick={closeMobile}>
                  {t("Pricing & licensing", "定价与授权")}
                </Link>
                <Link href={href("/security")} onClick={closeMobile}>
                  {t("Privacy & security", "安全合规")}
                </Link>
                <Link href={href("/docs")} onClick={closeMobile}>
                  {t("Documentation", "产品文档")}
                </Link>
                <a
                  href="https://apigo.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                >
                  MaaS (apigo.ai)
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                {capabilities.map((item) => (
                  <Link
                    key={item.slug}
                    href={href(`/product/${item.slug}`)}
                    onClick={closeMobile}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link
                className={styles.primaryLink}
                href={href("/poc")}
                onClick={closeMobile}
              >
                {t("Book a Demo", "预约演示")} <ArrowRight size={16} />
              </Link>
            </nav>
          </dialog>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  const { t, href, capabilities, solutions } = useSiteCopy();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerIdentity}>
          <Link href={href("/")} aria-label={t("SkyMythos home", "SkyMythos 首页")}>
            <Brand />
          </Link>
          <p>
            {t("Let AI deliver the work.", "让 AI 完成工作，")}
            <br />
            {t("Keep the capability in your enterprise.", "让能力留在企业。")}
          </p>
        </div>
        <div>
          <h3>{t("Solutions", "按角色解决方案")}</h3>
          {solutions.slice(0, 5).map((role) => (
            <Link href={href(`/solutions/${role.slug}`)} key={role.slug}>
              {role.name}
            </Link>
          ))}
          <Link href={href("/solutions")}>{t("All role solutions", "查看全部岗位")}</Link>
        </div>
        <div>
          <h3>{t("Platform", "平台与安全")}</h3>
          <Link href={href("/security")}>{t("Privacy & Security", "安全合规")}</Link>
          {capabilities.slice(0, 5).map((item) => (
            <Link href={href(`/product/${item.slug}`)} key={item.slug}>
              {item.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>{t("Resources & Contact", "文档与合作")}</h3>
          <Link href={href("/poc")}>{t("Book a Demo / POC", "预约演示 / 申请试点")}</Link>
          <Link href={href("/pricing")}>{t("Pricing & Seat Licensing", "定价与席位授权")}</Link>
          <Link href={href("/docs")}>{t("Documentation", "产品文档")}</Link>
          <Link href={href("/docs/private-deployment")}>{t("Private Deployment Guide", "私有化部署指南")}</Link>
          <Link href={href("/privacy")}>{t("Privacy Notice", "隐私说明")}</Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© 2026 SkyMythos.ai</span>
        <span>{t("Enterprise AI Agents & Collaborative Work Platform", "企业级数字员工与 AI 协作平台")}</span>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { t } = useSiteCopy();
  return (
    <div className={styles.fusionSite}>
      <a href="#main-content" className={styles.skipLink}>
        {t("Skip to main content", "跳至主要内容")}
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
