"use client";

import { AssetImage } from "./asset-image";

import { useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  AudioLines,
  Box,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  Circle,
  CircleDashed,
  Ellipsis,
  GitPullRequest,
  Inbox,
  Link2,
  Maximize2,
  MessageSquare,
  Search,
  Send,
  Settings2,
  Sparkles,
  SquarePen,
  Star,
  Tag,
  X,
  Zap,
} from "lucide-react";
import styles from "./linear.module.css";

const assets = "/sites/linear/";
const favoriteItems = [
  "Faster app launch",
  "Agent tasks",
  "Agent Insights",
  "UI Refresh",
];

export function HeroDemo() {
  const [active, setActive] = useState(0);
  const [chatOpen, setChatOpen] = useState(true);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);
  const title = favoriteItems[active];
  return (
    <div className={styles.heroVisual} aria-label="Linear product preview">
      <div className={styles.appFrame}>
        <aside className={styles.appSidebar}>
          <div className={styles.workspaceName}>
            <AssetImage src={`${assets}linear-mark.svg`} alt="" />{" "}
            <strong>Linear</strong>
            <ChevronDown />
            <span />
            <Search />
            <SquarePen />
          </div>
          <div className={styles.sideItems}>
            {[
              ["Pulse", Zap],
              ["Inbox", Inbox],
              ["My issues", CircleDashed],
              ["Reviews", GitPullRequest],
            ].map(([label, Icon]) => {
              const Glyph = Icon as typeof Zap;
              return (
                <div key={String(label)}>
                  <Glyph />
                  {String(label)}
                </div>
              );
            })}
            <small>Workspace⌄</small>
            <div>
              <Activity />
              Initiatives
            </div>
            <div>
              <Box />
              Projects
            </div>
            <div>
              <Ellipsis />
              More
            </div>
            <small>Favorites⌄</small>
            {favoriteItems.map((item, i) => (
              <button
                key={item}
                onClick={() => setActive(i)}
                className={active === i ? styles.sideActive : ""}
              >
                {i === 0 ? (
                  <Circle className={styles.yellow} />
                ) : i === 1 ? (
                  <MessageSquare />
                ) : i === 2 ? (
                  <ChartNoAxesColumnIncreasing className={styles.purple} />
                ) : (
                  <Settings2 className={styles.orange} />
                )}
                {item}
              </button>
            ))}
          </div>
        </aside>
        <div className={styles.appContent}>
          <div className={styles.appToolbar}>
            <Circle className={styles.yellow} />
            <span className={styles.mono}>DRV-8852</span>
            <span>{title}</span>
            <Star className={styles.yellow} fill="currentColor" />
            <Ellipsis />
            <span className={styles.toolbarSpace} />
            <span className={styles.dim}>1 / 84</span>
            <ArrowUp />
            <ArrowDown />
          </div>
          <div className={styles.appTools}>
            <Link2 />
            <Box />
            <GitPullRequest />
            <button
              aria-label="Open Linear agent"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <Sparkles />
            </button>
            <ChevronDown />
          </div>
          <div className={styles.issueBody}>
            <article className={styles.issueMain}>
              <h3>{title}</h3>
              <p>
                {active === 0 ? (
                  <>
                    Render UI before <code>vehicle_state</code> sync when
                    minimum required state is present,
                    <br /> instead of blocking on full refresh during iOS
                    startup.
                  </>
                ) : active === 1 ? (
                  "Delegate work to agents and keep every task connected to your team."
                ) : active === 2 ? (
                  "See how your team and agents work together, from issue to release."
                ) : (
                  "Bring clarity and consistency to the core screens of the app."
                )}
              </p>
              <h4>Activity</h4>
              <div className={styles.activityLine}>
                <AssetImage src={`${assets}karri-avatar.avif`} alt="" />
                Linear created the issue via Slack on behalf of Karri · 2min ago
              </div>
              <div className={styles.activityLine}>
                <Tag />
                Triage Intelligence added the labels Performance and iOS · 2min
                ago
              </div>
              <div className={styles.commentBox}>
                <div>
                  <AssetImage src={`${assets}karri-avatar.avif`} alt="Karri" />
                  <b>karri</b>
                  <span>· 4 min ago</span>
                </div>
                <p>
                  Right now we show a spinner forever, which makes it look like
                  the car disappeared...
                </p>
                <hr />
                <div>
                  <AssetImage
                    src={`${assets}f28b59f4-538c-4517-cfd7-510913015200.png`}
                    alt="Jori"
                  />
                  <b>jori</b>
                  <span>· just now</span>
                </div>
                <p>@Linear can you take a stab at this?</p>
              </div>
              <div className={styles.commentBox}>
                <div>
                  <AssetImage src={`${assets}linear-mark.svg`} alt="" />
                  <b>Linear</b>
                  <span>connected by Jori · 2 min ago</span>
                </div>
                <p>
                  <GitPullRequest /> Changed 2 files Draft PR awaiting your
                  review · 2 min ago
                </p>
              </div>
              <div className={styles.activityLine}>
                <Circle className={styles.yellow} />
                Linear moved from Todo to In Progress · just now
              </div>
            </article>
            <aside className={styles.issueProperties}>
              <small>Reviews</small>
              <p>
                <GitPullRequest className={styles.purple} />
                Revert
              </p>
              <small>Properties</small>
              <p>
                <Circle className={styles.yellow} />
                In Progress
              </p>
              <p>
                <ChartNoAxesColumnIncreasing />
                Medium
              </p>
              <p>
                <AssetImage src={`${assets}karri-avatar.avif`} alt="" />
                Karri
              </p>
              <p>
                <AssetImage src={`${assets}linear-mark.svg`} alt="" />
                Linear
              </p>
              <p>
                <CircleDashed />
                Cycle 144
              </p>
              <small>Labels</small>
              <p>
                <span className={styles.pill}>
                  <i /> Performance
                </span>
                <span className={styles.pill}>
                  <i /> iOS
                </span>
              </p>
              <small>Releases</small>
              <p>
                Linear App{" "}
                <span className={styles.dim}>1.6881... · Jun 25</span>
              </p>
            </aside>
          </div>
        </div>
        {chatOpen && (
          <div className={styles.agentWindow}>
            <div className={styles.agentTitle}>
              <AssetImage src={`${assets}linear-mark.svg`} alt="" />
              <b>Linear</b>
              <span className={styles.model}>Opus 5.5</span>
              <span className={styles.toolbarSpace} />
              <Maximize2 />
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close agent preview"
              >
                <X />
              </button>
            </div>
            <div className={styles.agentConversation}>
              <div className={styles.prompt}>
                Fix the dimmed ride rows that never reset and open a PR
              </div>
              <small>◉ DRV-364 added to context</small>
              <p className={styles.dim}>Worked for 10 sec ▸</p>
              <p>
                Pushed and opened a draft PR. Removed dimmedIds — isItemDimmed
                now checks waitingStatusById directly.
              </p>
              <div className={styles.diffSummary}>
                <span className={styles.mono}>
                  Changed 2 files <em>+22</em> <i>−10</i>
                </span>
                <p>
                  <GitPullRequest />
                  Draft &nbsp;Reset dimmed ride rows
                </p>
                <small>master ← ride/drv-364-reset-dimmed-rows</small>
              </div>
              {sent && (
                <div className={styles.prompt}>
                  {reply}
                  <Check size={12} />
                </div>
              )}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (reply.trim()) setSent(true);
              }}
            >
              <input
                aria-label="Reply to agent preview"
                placeholder="Reply…"
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setSent(false);
                }}
              />
              <div>
                <AudioLines />
                <span>Skills</span>
                <button aria-label="Send preview reply" type="submit">
                  <Send />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
