"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trapDialogTab } from "@/components/ui/dialog-focus";
import { getCapabilities } from "./content";
import { getRoleSolutions } from "./solutions-data";
import { useLocale } from "@/components/locale-provider";
import { LanguageSwitch } from "@/components/language-switch";
import { localizeHref } from "@/lib/i18n";
import styles from "./site.module.css";

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
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hoverOpenedAt = useRef(0);
  const header = useRef<HTMLElement>(null);
  const mobile = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const isProductActive = base === "/" || base.startsWith("/product");
  const isPricingActive = base.startsWith("/pricing");
  const isSolutionsActive = base.startsWith("/solutions");
  const isSecurityActive = base.startsWith("/security");
  const isDocsActive = base.startsWith("/docs");

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        header.current &&
        !header.current.contains(event.target)
      ) {
        setSolutionsOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSolutionsOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
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

  return (
    <header
      className={styles.header}
      ref={header}
      onMouseLeave={() => setSolutionsOpen(false)}
    >
      <div className={styles.headerInner}>
        <div className={styles.brandGroup}>
          <Link
            href={href("/")}
            aria-label={t("SkyMythos home", "SkyMythos 首页")}
            data-brand-origin
          >
            <Brand />
          </Link>
          <span className={styles.editionBadge}>{t("Enterprise", "企业版")}</span>
        </div>

        <nav aria-label={t("Main navigation", "主导航")} className={styles.desktopNav}>
          <Link
            href={href("/")}
            data-active={isProductActive}
            onMouseEnter={() => setSolutionsOpen(false)}
          >
            {t("Product", "产品介绍")}
          </Link>
          <Link
            href={href("/pricing")}
            data-active={isPricingActive}
            onMouseEnter={() => setSolutionsOpen(false)}
          >
            {t("Pricing", "定价")}
          </Link>
          <div
            className={styles.navDropdownTrigger}
            onMouseEnter={() => {
              hoverOpenedAt.current = performance.now();
              setSolutionsOpen(true);
            }}
          >
            <button
              type="button"
              data-active={isSolutionsActive || solutionsOpen}
              aria-expanded={solutionsOpen}
              aria-controls="fusion-solutions-menu"
              onClick={() => {
                if (performance.now() - hoverOpenedAt.current < 300) return;
                setSolutionsOpen((prev) => !prev);
              }}
            >
              {t("Solutions", "解决方案")}
              <ChevronDown size={14} className={styles.navChevron} />
            </button>

            {solutionsOpen && (
              <div className={styles.solutionsMenu} id="fusion-solutions-menu">
                <p className={styles.solutionsMenuLabel}>
                  {t("By Role", "按角色")}
                </p>
                <div className={styles.solutionsMenuGrid}>
                  {solutions.map((role) => (
                    <Link
                      key={role.slug}
                      href={href(`/solutions/${role.slug}`)}
                      onClick={() => setSolutionsOpen(false)}
                    >
                      <span>{role.name}</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
                <Link
                  className={styles.solutionsMenuFooter}
                  href={href("/solutions")}
                  onClick={() => setSolutionsOpen(false)}
                >
                  <span>{t("View all role solutions", "查看全部岗位解决方案")}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
          <Link
            href={href("/security")}
            data-active={isSecurityActive}
            onMouseEnter={() => setSolutionsOpen(false)}
          >
            {t("Security", "安全合规")}
          </Link>
        </nav>

        <div className={styles.headerActions}>
          <Link
            href={href("/docs")}
            className={styles.docsNavLink}
            data-active={isDocsActive}
            onMouseEnter={() => setSolutionsOpen(false)}
          >
            {t("Docs", "产品文档")}
          </Link>
          <LanguageSwitch />
          <ThemeToggle />
          <Link className={styles.headerCta} href={href("/poc")}>
            {t("Book a Demo", "预约演示")}
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
            <div className={styles.brandGroup}>
              <Link href={href("/")} onClick={closeMobile}>
                <Brand />
              </Link>
              <span className={styles.editionBadge}>{t("Enterprise", "企业版")}</span>
            </div>
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
              <Link href={href("/pricing")} onClick={closeMobile}>
                {t("Pricing & licensing", "定价与授权")}
              </Link>
              <Link href={href("/security")} onClick={closeMobile}>
                {t("Privacy & security", "安全合规")}
              </Link>
              <Link href={href("/docs")} onClick={closeMobile}>
                {t("Documentation", "产品文档")}
              </Link>
              {capabilities.slice(0, 3).map((item) => (
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
  );
}

export function SiteFooter() {
  const { t, href, capabilities, solutions } = useSiteCopy();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerIdentity}>
          <div className={styles.brandGroup}>
            <Link href={href("/")} aria-label={t("SkyMythos home", "SkyMythos 首页")}>
              <Brand />
            </Link>
            <span className={styles.editionBadge}>{t("Enterprise", "企业版")}</span>
          </div>
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
