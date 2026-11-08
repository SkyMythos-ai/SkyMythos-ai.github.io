"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trapDialogTab } from "@/components/ui/dialog-focus";
import { capabilities } from "./content";
import styles from "./site.module.css";

export function Brand({ compact = false }: { compact?: boolean }) {
  const file = compact ? "logo-mark" : "logo-lockup";
  return (
    <span className={compact ? styles.brandMark : styles.brandLockup}>
      <Image
        className={styles.lightAsset}
        src={`/sites/fusion/brand/${file}.svg`}
        width={compact ? 26 : 164}
        height={compact ? 31 : 42}
        alt="SkyMythos.ai"
        loading="eager"
        unoptimized
      />
      <Image
        className={styles.darkAsset}
        src={`/sites/fusion/brand/${file}-dark.svg`}
        width={compact ? 26 : 164}
        height={compact ? 31 : 42}
        alt="SkyMythos.ai"
        loading="eager"
        unoptimized
      />
    </span>
  );
}

function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("skymythos-theme");
      } catch {
        /* 隐私模式仍可切换当次主题。 */
      }
      if (saved !== "light" && saved !== "dark")
        document.documentElement.dataset.theme = media.matches
          ? "dark"
          : "light";
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <Button
      variant="ghost"
      size="icon"
      className={styles.themeToggle}
      aria-label="切换明暗主题"
      onClick={() => {
        const next =
          document.documentElement.dataset.theme === "dark" ? "light" : "dark";
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
  const [productOpen, setProductOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const mobile = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        header.current &&
        !header.current.contains(event.target)
      )
        setProductOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProductOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  useEffect(() => {
    if (!mobileOpen || !mobile.current) return;
    mobile.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);
  const closeMobile = () => mobile.current?.close();
  return (
    <header
      className={styles.header}
      ref={header}
      onMouseLeave={() => setProductOpen(false)}
    >
      <div className={styles.headerInner}>
        <Link href="/" aria-label="SkyMythos 首页">
          <Brand />
        </Link>
        <nav aria-label="主导航" className={styles.desktopNav}>
          <button
            aria-expanded={productOpen}
            aria-controls="fusion-products"
            onMouseEnter={() => setProductOpen(true)}
            onClick={() => setProductOpen(!productOpen)}
          >
            产品能力 <ChevronDown size={13} />
          </button>
          <Link href="/#work" onMouseEnter={() => setProductOpen(false)}>
            工作方式
          </Link>
          <Link
            href="/docs/private-deployment"
            onMouseEnter={() => setProductOpen(false)}
          >
            企业接入
          </Link>
          <Link href="/pricing" onMouseEnter={() => setProductOpen(false)}>
            价格
          </Link>
          <Link href="/docs" onMouseEnter={() => setProductOpen(false)}>
            文档
          </Link>
        </nav>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <Link className={styles.headerCta} href="/poc">
            申请 POC <ArrowRight size={14} />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={styles.mobileToggle}
            ref={trigger}
            aria-label="打开导航"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>
      {productOpen && (
        <div className={styles.productMenu} id="fusion-products">
          <div className={styles.menuGrid}>
            {capabilities.map((capability) => (
              <Link
                key={capability.slug}
                href={`/product/${capability.slug}`}
                onClick={() => setProductOpen(false)}
              >
                <strong>{capability.name}</strong>
                <span>{capability.summary}</span>
              </Link>
            ))}
          </div>
          <Link
            className={styles.menuFooter}
            href="/#product-demo"
            onClick={() => setProductOpen(false)}
          >
            从一次工作，了解 SkyMythos <ArrowRight size={16} />
          </Link>
        </div>
      )}
      {mobileOpen && (
        <dialog
          ref={mobile}
          className={styles.mobileDialog}
          aria-label="网站导航"
          onKeyDown={trapDialogTab}
          onClose={() => {
            setMobileOpen(false);
            trigger.current?.focus();
          }}
        >
          <div className={styles.mobileDialogHeader}>
            <Link href="/" onClick={closeMobile}>
              <Brand />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="关闭导航"
              onClick={closeMobile}
            >
              <X />
            </Button>
          </div>
          <nav aria-label="移动导航">
            <p>产品能力</p>
            {capabilities.map((capability) => (
              <Link
                key={capability.slug}
                href={`/product/${capability.slug}`}
                onClick={closeMobile}
              >
                {capability.name}
                <ArrowRight size={18} />
              </Link>
            ))}
            <div className={styles.mobileOther}>
              <Link href="/#work" onClick={closeMobile}>
                工作方式
              </Link>
              <Link href="/docs/private-deployment" onClick={closeMobile}>
                企业接入
              </Link>
              <Link href="/pricing" onClick={closeMobile}>
                价格与合作
              </Link>
              <Link href="/docs" onClick={closeMobile}>
                文档与指南
              </Link>
            </div>
            <Link
              className={styles.primaryLink}
              href="/poc"
              onClick={closeMobile}
            >
              申请 POC <ArrowRight size={16} />
            </Link>
          </nav>
        </dialog>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerIdentity}>
          <Link href="/" aria-label="SkyMythos 首页">
            <Brand />
          </Link>
          <p>
            让 AI 完成工作，
            <br />
            让能力留在企业。
          </p>
        </div>
        <div>
          <h3>产品</h3>
          {capabilities.slice(0, 3).map((item) => (
            <Link href={`/product/${item.slug}`} key={item.slug}>
              {item.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>能力</h3>
          {capabilities.slice(3).map((item) => (
            <Link href={`/product/${item.slug}`} key={item.slug}>
              {item.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>开始了解</h3>
          <Link href="/poc">申请 POC</Link>
          <Link href="/pricing">价格与合作</Link>
          <Link href="/docs/getting-started">使用入门</Link>
          <Link href="/docs/private-deployment">企业接入指南</Link>
          <Link href="/docs">全部文档</Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© 2026 SkyMythos.ai</span>
        <span>企业的 AI-Native Harness</span>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.fusionSite}>
      <a href="#main-content" className={styles.skipLink}>
        跳至主要内容
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
