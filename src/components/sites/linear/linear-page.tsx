import { AssetImage } from "@/components/sites/linear/asset-image";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/sites/linear/navigation";
import { Footer } from "@/components/sites/linear/footer";
import { HeroDemo } from "@/components/sites/linear/hero-demo";
import {
  IntakeDemo,
  PlanningDemo,
  AgentsDemo,
  BuildDemo,
} from "@/components/sites/linear/product-demos";
import { FeatureSpecs } from "@/components/sites/linear/feature-specs";
import styles from "@/components/sites/linear/linear.module.css";

const principles = [
  {
    name: "Purpose-built",
    image: "purpose-built",
    text: "Linear is shaped by the practices and principles of world-class product teams.",
  },
  {
    name: "Powered by agents",
    image: "powered-by-agents",
    text: "Designed for workflows shared by humans and agents. From drafting PRDs to pushing PRs.",
  },
  {
    name: "Designed for speed",
    image: "designed-for-speed",
    text: "Reduces noise and restores momentum to help teams ship with high velocity and focus.",
  },
];
const workflow = [
  {
    id: "intake",
    title: (
      <>
        Intake
        <br />
        and integrations
      </>
    ),
    text: "Automatically turn conversations and customer feedback into actionable issues that are instantly routed, labeled, and prioritized for the right team.",
    features: ["Linear Agent", "Customer Requests", "Triage", "Linear Asks"],
    Visual: IntakeDemo,
  },
  {
    id: "plan",
    title: (
      <>
        Planning
        <br />
        and monitoring
      </>
    ),
    text: "Plan and navigate from idea to launch. Align your team with product initiatives, strategic roadmaps, and clear, up-to-date PRDs.",
    features: [
      "Projects",
      "Documents",
      "Pulse",
      "Initiatives",
      "Visual planning",
      "Insights",
    ],
    Visual: PlanningDemo,
  },
  {
    id: "ai",
    title: (
      <>
        AI and
        <br />
        automations
      </>
    ),
    text: "Build and deploy AI agents that work alongside you as teammates. Work on complex tasks together or delegate entire issues end-to-end.",
    features: ["Linear Agent", "Cloud Coding Agent", "Triage", "Linear MCP"],
    Visual: AgentsDemo,
  },
  {
    id: "build",
    title: (
      <>
        Build, review,
        <br />
        and ship
      </>
    ),
    text: "Streamline code reviews with clear diffs, better context, and fewer back-and-forth comments. Keep PRs moving without sacrificing quality.",
    features: [
      "Issues",
      "Git automations",
      "Guided reviews",
      "Cycles",
      "Diffs",
      "Releases",
    ],
    Visual: BuildDemo,
  },
];
const releases = [
  {
    title: "Mobile Diffs",
    date: "NOV 4, 2026",
    text: "",
    href: "/changelog/2026-11-04-mobile-diffs",
  },
  {
    title: "Slack and GitHub loop triggers",
    date: "OCT 22, 2026",
    text: "Loops automate product work by responding to changes in Linear and connected tools. You can now trigger them from Slack and GitHub, share them as templates, and customize their reasoning levels.",
    href: "/changelog/2026-10-22-slack-and-github-loops",
  },
  {
    title: "Stacked pull requests",
    date: "OCT 8, 2026",
    text: "Stacked pull requests are now displayed in Linear Diffs. Move through a stack and see review, CI, and merge status at a glance. Related PRs are grouped into a single collapsible row in Reviews, alongside their issue and project context.",
    href: "/changelog/2026-10-08-stacked-pull-requests",
  },
  {
    title: "New controls for Linear coding agent",
    date: "SEP 24, 2026",
    text: "Coding sessions are the shortest path from issue to diff. Assign a task to Linear Agent, and it works in a secure cloud environment to write and test the code before opening a pull request for review.",
    href: "/changelog/2026-09-24-new-controls-for-linear-coding-agent",
  },
];

export default function Home() {
  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#main">
        Skip to content →
      </a>
      <Navigation />
      <main id="main">
        <section className={styles.hero}>
          <div className={`${styles.container} ${styles.heroCopy}`}>
            <h1>
              <span className={styles.desktopTitle}>
                The product development
                <br />
                system for teams and agents
              </span>
              <span className={styles.mobileTitle}>
                The product
                <br />
                development
                <br />
                system for teams
                <br />
                and agents
              </span>
            </h1>
            <div className={styles.heroSubline}>
              <p>
                Purpose-built for planning and building products. Designed for
                the AI era.
              </p>
              <a href="https://linear.app/loops">
                <span>New</span> Loops <ArrowRight />
              </a>
            </div>
          </div>
          <HeroDemo />
        </section>
        <section className={`${styles.container} ${styles.introduction}`}>
          <div className={styles.logos} aria-label="Customers">
            {[
              "openai",
              "vercel",
              "salesforce",
              "figma",
              "cursor",
              "coinbase",
              "ramp",
            ].map((name) => (
              <a href="https://linear.app/customers" key={name}>
                <AssetImage
                  src={`/sites/linear/${name}-logo.svg`}
                  alt={
                    name === "openai"
                      ? "OpenAI"
                      : name === "vercel"
                        ? "Vercel"
                        : name === "figma"
                          ? "Figma"
                          : name === "cursor"
                            ? "Cursor"
                            : name
                  }
                />
              </a>
            ))}
          </div>
          <p className={styles.eyebrow}>
            Powering the companies building the future
          </p>
          <h2 className={styles.introHeading}>
            <span>A new species of product tool.</span> Purpose-built for modern
            teams with AI workflows at its core, Linear sets a new standard for
            planning and building products.
          </h2>
          <div className={styles.principles}>
            {principles.map((principle, i) => (
              <article
                key={principle.name}
                className={styles.principle}
                tabIndex={0}
              >
                <span className={styles.figure}>Fig 0.{i + 1}</span>
                <div className={styles.principleImage}>
                  <AssetImage
                    src={`/sites/linear/${principle.image}.svg`}
                    alt=""
                  />
                </div>
                <h3>{principle.name}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>
        {workflow.map(({ id, title, text, features, Visual }) => (
          <section className={styles.workflow} id={id} key={id}>
            <div className={styles.container}>
              <div className={styles.sectionHeading}>
                <h2>{title}</h2>
                <div>
                  <p>{text}</p>
                  <a
                    className={styles.subtleLink}
                    href={`https://linear.app/${id}`}
                  >
                    Learn more <ArrowRight />
                  </a>
                </div>
              </div>
              <div className={styles.productVisual}>
                <Visual />
              </div>
              <FeatureSpecs names={features} />
            </div>
          </section>
        ))}
        <section className={`${styles.container} ${styles.changelog}`}>
          <h2>Changelog</h2>
          <div className={styles.releaseGrid}>
            {releases.map((release, i) => (
              <a
                href={`https://linear.app${release.href}`}
                key={release.title}
                className={styles.release}
              >
                <span
                  className={i === 0 ? styles.newRelease : styles.releaseDot}
                />
                <h3>{release.title}</h3>
                {release.text && <p>{release.text}</p>}
                <time>{release.date}</time>
              </a>
            ))}
          </div>
          <a className={styles.subtleLink} href="https://linear.app/changelog">
            View all <ArrowRight />
          </a>
        </section>
        <section
          className={`${styles.container} ${styles.customers}`}
          aria-label="Customer stories"
        >
          <div className={styles.testimonials}>
            <a
              href="https://linear.app/customers/openai"
              className={styles.openaiQuote}
            >
              <AssetImage
                className={styles.quoteWatermark}
                src="/sites/linear/openai-mark.svg"
                alt=""
              />
              <blockquote>
                “You’ll probably build a better product,
                <br className={styles.desktopBreak} /> just because of the craft
                that using
                <br className={styles.desktopBreak} /> Linear infuses on your
                brain.”
              </blockquote>
              <div className={styles.attribution}>
                <AssetImage src="/sites/linear/openai-mark.svg" alt="OpenAI" />
                <div>
                  <strong>Gabriel Peal</strong>
                  <p className={styles.desktopRole}>
                    Staff Software Engineer, OpenAI
                  </p>
                  <p className={styles.mobileRole}>OpenAI</p>
                </div>
              </div>
            </a>
            <a
              href="https://linear.app/customers/ramp"
              className={styles.rampQuote}
            >
              <blockquote>
                “Our speed is intense
                <br className={styles.desktopBreak} /> and Linear helps us
                <br className={styles.desktopBreak} /> be action biased.”
              </blockquote>
              <div className={styles.attribution}>
                <AssetImage
                  className={styles.rampSymbol}
                  src="/sites/linear/ramp-mark.svg"
                  alt="Ramp"
                />
                <div>
                  <strong>Nik Koblov</strong>
                  <p className={styles.desktopRole}>
                    Head of Engineering, Ramp
                  </p>
                  <p className={styles.mobileRole}>Ramp</p>
                </div>
              </div>
            </a>
            <a
              href="https://linear.app/customers/opendoor"
              className={styles.opendoorQuote}
            >
              <blockquote>
                “Linear is excellent, just excellent. It has the right opinions
                for fast moving teams.”
              </blockquote>
              <div className={styles.attribution}>
                <AssetImage
                  className={styles.rampSymbol}
                  src="/sites/linear/opendoor-mark.svg"
                  alt="Opendoor"
                />
                <div>
                  <strong>Kaz Nejatian</strong>
                  <p>Opendoor</p>
                </div>
              </div>
            </a>
          </div>
          <div className={styles.customerSummary}>
            <p>
              Linear powers over <strong>50,000</strong> product teams. From
              ambitious startups to major enterprises.
            </p>
            <a
              className={styles.subtleLink}
              href="https://linear.app/customers"
            >
              Customer stories <ArrowRight />
            </a>
          </div>
        </section>
        <section className={styles.cta}>
          <h2>
            Built for the future.
            <br />
            Available today.
          </h2>
          <div>
            <a
              href="https://linear.app/signup"
              className={styles.primaryButton}
            >
              Get started
            </a>
            <a
              href="https://linear.app/contact/sales"
              className={styles.secondaryButton}
            >
              Contact sales
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
