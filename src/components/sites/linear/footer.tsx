import { AssetImage } from "./asset-image";
import Link from "next/link";
import styles from "./linear.module.css";

const columns = {
  Product: [
    ["Intake", "/intake"],
    ["Plan", "/plan"],
    ["AI", "/ai"],
    ["Build", "/build"],
    ["Pricing", "/pricing"],
    ["Security", "/security"],
  ],
  Features: [
    ["Asks", "/asks"],
    ["Agents", "/agents"],
    ["Cloud Coding Agent", "/coding-agent"],
    ["Customer Requests", "/customer-requests"],
    ["Insights", "/insights"],
    ["Mobile", "/mobile"],
    ["Integrations", "/integrations"],
    ["Changelog", "/changelog"],
  ],
  Company: [
    ["About", "/about"],
    ["Customers", "/customers"],
    ["Careers", "/careers"],
    ["Now", "/now"],
    ["Method", "/method"],
    ["Quality", "/quality"],
    ["Brand", "/brand"],
  ],
  Resources: [
    ["Switch", "/switch"],
    ["Download", "/download"],
    ["Documentation", "/docs"],
    ["Developers", "/developers"],
    ["Enterprise", "/enterprise"],
    ["Startups", "/startups"],
    ["Status", "https://linearstatus.com"],
    ["Legal", "/legal"],
  ],
  Connect: [
    ["Contact us", "/contact"],
    ["Community", "/join-slack"],
    ["X (Twitter)", "https://x.com/linear"],
    ["GitHub", "https://github.com/linear"],
    ["YouTube", "https://www.youtube.com/@linear"],
  ],
  Legal: [
    ["Privacy", "/privacy"],
    ["Terms", "/terms"],
    ["Other Policies", "/legal"],
    ["DPA", "/dpa"],
    ["AUP", "/legal/aup"],
  ],
};

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Link className={styles.footerMark} aria-label="Linear home" href="/reference/linear">
          <AssetImage src="/sites/linear/linear-mark.svg" alt="Linear" />
        </Link>
        {Object.entries(columns).map(([title, links]) => (
          <div
            key={title}
            className={title === "Legal" ? styles.legalColumn : ""}
          >
            <h3>{title}</h3>
            {links.map(([label, href]) => (
              <a
                key={label}
                href={
                  href.startsWith("https:") ? href : `https://linear.app${href}`
                }
              >
                {label === "Documentation" ? (
                  <>
                    <span className={styles.desktopRole}>Documentation</span>
                    <span className={styles.mobileRole}>Docs</span>
                  </>
                ) : (
                  label
                )}
              </a>
            ))}
          </div>
        ))}
        <div className={styles.footerLegal}>
          <a href="https://linear.app/privacy">Privacy</a>
          <a href="https://linear.app/terms">Terms</a>
          <a href="https://linear.app/legal">Other Policies</a>
        </div>
      </div>
    </footer>
  );
}
