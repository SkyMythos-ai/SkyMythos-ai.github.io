"use client";

import { AssetImage } from "./asset-image";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { trapDialogTab } from "@/components/ui/dialog-focus";
import styles from "./linear.module.css";

const productLinks = [
  {
    title: "Intake",
    description: "Bring requests and context\nin from every tool you use",
    path: "/intake",
  },
  {
    title: "Plan and monitor",
    description: "Set the plan and follow it\nfrom idea to launch",
    path: "/plan",
  },
  {
    title: "AI and automations",
    description: "Agents that follow work\nfrom conversation to code",
    path: "/ai",
  },
  {
    title: "Build, review and ship",
    description: "Write code and review\npull requests inside Linear",
    path: "/build",
  },
];
const resourceLinks = [
  {
    title: "About",
    description: "Meet the team and the\nstory behind Linear",
    path: "/about",
  },
  {
    title: "Careers",
    description: "Come work with us on the\ntools our teams use daily",
    path: "/careers",
  },
  {
    title: "Docs",
    description: "Learn how to use every\npart of Linear",
    path: "/docs",
  },
  {
    title: "Developers",
    description: "Build on the Linear API\nand developer platform",
    path: "/developers",
  },
];

export function Navigation() {
  const [menu, setMenu] = useState<"Product" | "Resources" | null>(null);
  const [mobile, setMobile] = useState(false);
  const header = useRef<HTMLElement>(null);
  const mobileDialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(null);
        mobileDialog.current?.close();
      }
    };
    const outside = (event: PointerEvent) => {
      if (header.current && !header.current.contains(event.target as Node))
        setMenu(null);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  useEffect(() => {
    if (!mobile) return;
    mobileDialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobile]);
  return (
    <header
      ref={header}
      className={styles.header}
      onMouseLeave={() => setMenu(null)}
    >
      <div className={styles.headerInner}>
        <Link href="/reference/linear" aria-label="Linear home" className={styles.brand}>
          <AssetImage src="/sites/linear/linear-logo.svg" alt="Linear" />
        </Link>
        <nav aria-label="Main navigation" className={styles.desktopNav}>
          {(["Product", "Resources"] as const).map((label) => (
            <button
              key={label}
              aria-expanded={menu === label}
              aria-controls="navigation-panel"
              onMouseEnter={() => setMenu(label)}
              onClick={() => setMenu(label)}
            >
              {label}
            </button>
          ))}
          {[
            ["Customers", "/customers"],
            ["Pricing", "/pricing"],
            ["Now", "/now"],
            ["Contact", "/contact"],
          ].map(([title, path]) => (
            <a
              key={title}
              href={`https://linear.app${path}`}
              onMouseEnter={() => setMenu(null)}
            >
              {title}
            </a>
          ))}
        </nav>
        <div className={styles.accountNav}>
          <a href="https://linear.app/login">Log in</a>
          <a href="https://linear.app/signup" className={styles.signup}>
            Sign up
          </a>
          <button
            className={styles.mobileToggle}
            ref={menuTrigger}
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMobile(!mobile);
              setMenu(null);
            }}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menu && (
        <div id="navigation-panel" className={styles.navPanel}>
          <div className={styles.navPanelGrid}>
            <div className={styles.navFeatured}>
              {(menu === "Product" ? productLinks : resourceLinks).map(
                (link) => (
                  <a key={link.title} href={`https://linear.app${link.path}`}>
                    <strong>{link.title}</strong>
                    <span>{link.description}</span>
                  </a>
                ),
              )}
            </div>
            <div className={styles.navSecondary}>
              {(menu === "Product"
                ? [
                    ["Integration directory", "/integrations"],
                    ["Changelog", "/changelog"],
                    ["Mobile", "/mobile"],
                    ["Security", "/security"],
                  ]
                : [
                    ["Switch to Linear", "/switch"],
                    ["For enterprise", "/enterprise"],
                    ["For startups", "/startups"],
                    ["Download", "/download"],
                  ]
              ).map(([title, href]) => (
                <a key={title} href={`https://linear.app${href}`}>
                  {title}
                </a>
              ))}
            </div>
          </div>
          {menu === "Product" && (
            <a
              className={styles.navAnnouncement}
              href="https://linear.app/changelog"
            >
              <span>
                <b>New</b> Mobile Diffs
              </span>
              <span>
                Learn more <ArrowRight />
              </span>
            </a>
          )}
        </div>
      )}
      {mobile && (
        <dialog
          ref={mobileDialog}
          onKeyDown={trapDialogTab}
          className={styles.mobileDialog}
          aria-label="Site navigation"
          onClose={() => {
            setMobile(false);
            menuTrigger.current?.focus();
          }}
        >
          <div className={styles.headerInner}>
            <Link href="/reference/linear" className={styles.brand} aria-label="Linear home">
              <AssetImage src="/sites/linear/linear-logo.svg" alt="Linear" />
            </Link>
            <div className={styles.accountNav}>
              <a href="https://linear.app/login">Log in</a>
              <a className={styles.signup} href="https://linear.app/signup">
                Sign up
              </a>
              <button
                className={styles.mobileToggle}
                aria-label="Close menu"
                onClick={() => mobileDialog.current?.close()}
              >
                <X />
              </button>
            </div>
          </div>
          <nav
            id="mobile-navigation"
            aria-label="Site navigation"
            className={styles.mobileNav}
          >
            <div className={styles.mobileNavColumns}>
              <div>
                <h3>System</h3>
                {productLinks.map((link) => (
                  <a key={link.path} href={`https://linear.app${link.path}`}>
                    {link.title}
                  </a>
                ))}
              </div>
              <div>
                <h3>Product</h3>
                {[
                  ["Integrations", "/integrations"],
                  ["Pricing", "/pricing"],
                  ["Changelog", "/changelog"],
                  ["Documentation", "/docs"],
                ].map(([label, path]) => (
                  <a key={path} href={`https://linear.app${path}`}>
                    {label}
                  </a>
                ))}
              </div>
              <div>
                <h3>Resources</h3>
                {[
                  ["About", "/about"],
                  ["Customers", "/customers"],
                  ["Careers", "/careers"],
                  ["Contact", "/contact"],
                  ["Now", "/now"],
                  ["Method", "/method"],
                  ["Switch", "/switch"],
                ].map(([label, path]) => (
                  <a key={path} href={`https://linear.app${path}`}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </dialog>
      )}
    </header>
  );
}
