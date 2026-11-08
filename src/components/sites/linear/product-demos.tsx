"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AtSign,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  Circle,
  CircleDot,
  File,
  Hash,
  Maximize2,
  Mic,
  MoreHorizontal,
  Plus,
  Send,
  Smile,
  SquarePen,
  Video,
  X,
} from "lucide-react";
import styles from "./product-demos.module.css";

const asset = (name: string) => `/sites/linear/${name}`;

function useSceneMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = ref.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scene.dataset.animate = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function MobileIllustration({ file, alt }: { file: string; alt: string }) {
  return (
    <Image
      className={styles.mobileIllustration}
      src={asset(file)}
      alt={alt}
      width={1560}
      height={1248}
      sizes="(max-width: 767px) 100vw, 1px"
      unoptimized
    />
  );
}

function Avatar({
  name,
  file,
  small = false,
}: {
  name: string;
  file: string;
  small?: boolean;
}) {
  return (
    <Image
      className={small ? styles.smallAvatar : styles.avatar}
      src={asset(file)}
      alt={name}
      width={small ? 14 : 36}
      height={small ? 14 : 36}
      unoptimized
    />
  );
}

const boardColumns = [
  {
    name: "Backlog",
    count: 8,
    issues: [
      ["ENG-2085", "Reduce UI flicker during autonomy…", ""],
      ["ENG-2094", "Add buffering for autonomy event streams", ""],
      ["ENG-2092", "Reduce startup delay caused by vehicle sync", ""],
      ["ENG-2200", "Fix delayed route updates during rerouting", ""],
    ],
  },
  {
    name: "Todo",
    count: 71,
    issues: [
      ["ENG-926", "Remove UI inconsistencies", "Bug  Design"],
      ["ENG-2088", "TypeError: Cannot read properties", "Bug"],
      ["ENG-924", "Upgrade to Claude Opus 5.5", "AI"],
      ["ENG-1882", "Optimize load times", "Performance"],
    ],
  },
  {
    name: "In Progress",
    count: 3,
    issues: [
      ["ENG-1487", "Remove contentData from GraphQL API", "61039"],
      ["MKT-1028", "Launch page assets", "Design"],
      ["ENG-2187", "Prevent duplicate ride requests on poor…", "Bug  62048"],
    ],
  },
  {
    name: "Done",
    count: 53,
    issues: [
      ["ENG-2074", "Clean up deprecated APIs…", "API  61002"],
      ["ENG-1912", "Reduce latency in autonomy st…", "61005"],
      ["ENG-1951", "Reduce ETA fluctuations durin…", "61202"],
      ["ENG-1960", "Improve fallback messaging", "UI  61149"],
    ],
  },
];

export function IntakeDemo() {
  const sceneRef = useSceneMotion();
  const [sent, setSent] = useState(false);
  return (
    <div
      ref={sceneRef}
      className={`${styles.scene} ${styles.intakeScene}`}
      data-sent={sent}
      aria-label="Conversations become organized issues in Linear"
    >
      <div className={styles.board}>
        {boardColumns.map((column, index) => (
          <div className={styles.boardColumn} key={column.name}>
            <div className={styles.boardHeading}>
              <CircleDot
                size={13}
                className={index === 2 ? styles.yellow : undefined}
              />
              <span>{column.name}</span>
              <span className={styles.muted}>
                {column.count + (sent && index === 1 ? 1 : 0)}
              </span>
              <Plus size={12} />
              <MoreHorizontal size={14} />
            </div>
            {sent && index === 1 && (
              <div className={`${styles.issueCard} ${styles.createdIssue}`}>
                <div className={styles.cardId}>
                  ENG-2201
                  <Avatar
                    name="andreas"
                    file="22210a73-581d-42db-d42a-bf2907860300.png"
                    small
                  />
                </div>
                <div className={styles.cardTitle}>
                  Render UI before vehicle_state sync
                </div>
                <div className={styles.tagRow}>
                  <span className={styles.tag}>
                    <i className={styles.blueDot} />
                    Performance
                  </span>
                  <span className={styles.tag}>iOS</span>
                </div>
              </div>
            )}
            {column.issues.map(([id, title, tags], issueIndex) => (
              <div className={styles.issueCard} key={id}>
                <div className={styles.cardId}>
                  {id}
                  <Avatar
                    name="Team member"
                    file={
                      [
                        "086b510a-f5da-414b-bc9d-228afb968600.png",
                        "302b16a5-f9ca-42f2-dbae-3c76f19b2d00.png",
                        "1eb8f8b2-3593-473f-ba8a-acac99aa0300.png",
                      ][issueIndex % 3]
                    }
                    small
                  />
                </div>
                <div className={styles.cardTitle}>{title}</div>
                <div className={styles.tagRow}>
                  <span className={styles.priority}>
                    <ChartNoAxesColumnIncreasing size={12} />
                  </span>
                  {tags
                    .split("  ")
                    .filter(Boolean)
                    .map((tag) => (
                      <span className={styles.tag} key={tag}>
                        <i
                          className={
                            tag === "Bug" ? styles.redDot : styles.blueDot
                          }
                        />
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.slack}>
        <div className={styles.slackHeading}>
          <Hash size={19} />
          <span>Thread</span>
          <span className={styles.muted}>#product</span>
          <MoreHorizontal size={16} />
        </div>
        <div className={styles.slackMessages}>
          <div className={`${styles.message} ${styles.firstMessage}`}>
            <Avatar
              name="lena"
              file="580cd9c0-2770-4fe4-1ad2-95c76fc6f000.png"
            />
            <div>
              <strong>
                lena <time>9:37 PM</time>
              </strong>
              <p>
                Anyone else noticing the iOS app feels slow to open if you
                haven’t used it in a bit?
              </p>
            </div>
          </div>
          <div className={styles.message}>
            <Avatar
              name="didier"
              file="c8aeedda-7726-4a4f-226a-f573f85d8d00.png"
            />
            <div>
              <strong>
                didier <time>9:37 PM</time>
              </strong>
              <p>
                Yea, we’re still blocking initial render on a full vehicle_state
                sync every time…
              </p>
            </div>
          </div>
          <div className={styles.message}>
            <Avatar
              name="andreas"
              file="22210a73-581d-42db-d42a-bf2907860300.png"
            />
            <div>
              <strong>
                andreas <time>9:37 PM</time>
              </strong>
              <p>
                Feels like we could render sooner and load the rest in the
                background. Probably also worth tracking startup timing so we
                know how often this happens!
              </p>
            </div>
          </div>
        </div>
        <div className={styles.slackComposer}>
          <div className={styles.typingText}>
            <span className={styles.mention}>@Linear</span> create issues and
            assign to me
            <span className={styles.caret} />
          </div>
          {sent && (
            <div className={styles.sentStatus} role="status">
              Issue created · ENG-2201
            </div>
          )}
          <div className={styles.composerTools}>
            <Plus aria-hidden="true" />
            <span aria-hidden="true">Aa</span>
            <Smile aria-hidden="true" />
            <AtSign aria-hidden="true" />
            <span className={styles.divider} />
            <Video aria-hidden="true" />
            <Mic aria-hidden="true" />
            <span className={styles.divider} />
            <SquarePen aria-hidden="true" />
            <button
              type="button"
              className={styles.send}
              onClick={() => setSent(true)}
              disabled={sent}
              aria-label={sent ? "Demo issue created" : "Send demo request"}
            >
              <Send size={16} aria-hidden="true" />
              <span />
              <ChevronDown size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const months = ["MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
const roadmapRows = [
  {
    name: "UI Refresh",
    icon: "⚒",
    color: "teal",
    start: 16,
    width: 48,
    parts: ["Core screens", "Polish"],
  },
  {
    name: "Split fares",
    icon: "▣",
    color: "green",
    start: 25,
    width: 60,
    parts: ["Internal", "Public Beta"],
  },
  {
    name: "Autonomy status clarity",
    icon: "♧",
    color: "blue",
    start: 43,
    width: 42,
    parts: ["Alpha"],
  },
  {
    name: "Autonomy telemetry reliability",
    icon: "♧",
    color: "green",
    start: 0,
    width: 47,
    parts: ["Beta", "GA"],
  },
];

function Roadmap() {
  return (
    <div className={styles.roadmap}>
      <div className={styles.calendar}>
        {months.map((month) => (
          <div className={styles.month} key={month}>
            <span>{month}</span>
            <div>2　 9　16　23</div>
          </div>
        ))}
      </div>
      <div className={styles.roadmapLines}>
        {roadmapRows.map((row) => (
          <div
            className={`${styles.roadmapRow} ${styles[row.color]}`}
            key={row.name}
            style={{ marginLeft: `${row.start}%`, width: `${row.width}%` }}
          >
            <div className={styles.roadmapName}>
              <span>{row.icon}</span>
              {row.name}
              <span className={styles.health}>⌁</span>
            </div>
            <div className={styles.roadmapBar}>
              <i>♦</i>
              <i>♢</i>
            </div>
            <div className={styles.milestones}>
              {row.parts.map((part) => (
                <span key={part}>{part}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CycleChart() {
  const dots = Array.from({ length: 440 }, (_, i) => {
    const group = Math.floor(i / 110);
    // 整数散列在 Node 和浏览器中结果一致，避免浮点三角函数导致 hydration 属性差异。
    const pseudo = (n: number) => {
      let value = Math.imul(n + 1, 0x45d9f3b);
      value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
      return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
    };
    const x = 82 + group * 166 + (pseudo(i + 2) - 0.5) * 38;
    const y = 115 + Math.abs(pseudo(i + 42)) * 330;
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={2.7}
        fill="#00a4b5"
        opacity={0.4 + Math.abs(pseudo(i + 7)) * 0.5}
      />
    );
  });
  return (
    <div className={styles.chartPanel}>
      <div className={styles.chartTitle}>Cycle time by agent</div>
      <svg
        viewBox="0 0 720 500"
        role="img"
        aria-label="Cycle time by agent, October 2025 through February 2026"
      >
        <g stroke="#333638" strokeWidth="1" strokeDasharray="2 4">
          {[25, 105, 185, 265, 345, 425].map((y) => (
            <path key={y} d={`M0 ${y}H720`} />
          ))}
        </g>
        <g fill="none" strokeWidth="1">
          <path
            stroke="#893e38"
            d="M0 155H154L178 127H322L347 170H490L520 158H720"
          />
          <path
            stroke="#865033"
            d="M0 218H152L178 239H320L348 225H492L520 262H720"
          />
          <path
            stroke="#434647"
            d="M0 245H152L178 287H320L348 320H492L520 286H720"
          />
        </g>
        {dots}
        <path stroke="#303234" d="M0 465H720" />
        <g fill="#74797f" fontSize="12">
          {["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"].map(
            (month, i) => (
              <text key={month} x={55 + i * 165} y="495">
                {month}
              </text>
            ),
          )}
        </g>
      </svg>
    </div>
  );
}

export function PlanningDemo() {
  return (
    <div
      className={`${styles.scene} ${styles.planningScene}`}
      aria-label="Plan projects on a shared roadmap and monitor cycle times"
    >
      <Roadmap />
      <CycleChart />
      <MobileIllustration
        file="7d7115d9-a0eb-4a92-5900-3ca3ee077d00.png"
        alt="Project roadmap from June to August, with milestones for UI Refresh, Split fares, and Autonomy status clarity"
      />
    </div>
  );
}

const agentPrompts = [
  {
    name: "Linear",
    icon: "linear-mark.svg",
    model: "Opus 5.5",
    prompt:
      "what are the three most important customer requests around permissions? add them to the Access Controls project",
    context: "",
    reply: "Three issues ranked by customer impact:",
    issues: [
      "ENG-2298　Add granular project permissions",
      "ENG-2647　Let guests access multiple teams",
      "ENG-2352　Create custom roles with scoped access",
    ],
  },
  {
    name: "Cursor",
    icon: "cursor-logo.svg",
    model: "",
    prompt:
      "add retry handling for failed image uploads described in this issue",
    context: "ENG-2844",
    reply: "",
    issues: [],
  },
  {
    name: "Linear",
    icon: "linear-mark.svg",
    model: "Opus 5.5",
    prompt:
      "Review today’s mobile triage and group the issues by what should happen next",
    context: "Mobile Triage",
    reply: "",
    issues: [],
  },
  {
    name: "ChatPRD",
    icon: "d0a00c69-e4c9-4e2f-cff9-ec1178dd7700.png",
    model: "",
    prompt:
      "review this issue, draft complete offline mode requirements, and break the work into sub-issues",
    context: "ENG-2521",
    reply:
      "Updated the issue with requirements, open product decisions, and acceptance criteria.",
    issues: ["ENG-2920　Define offline mode requirements"],
  },
];

export function AgentsDemo() {
  const sceneRef = useSceneMotion();
  return (
    <div
      ref={sceneRef}
      className={`${styles.scene} ${styles.agentsScene}`}
      aria-label="AI agents work alongside your team"
    >
      <div className={styles.agentTrack}>
        {agentPrompts.map((agent, index) => (
          <div className={styles.agentCard} key={`${agent.name}-${index}`}>
            <div className={styles.agentHeading}>
              <Image
                src={asset(agent.icon)}
                alt=""
                width={14}
                height={14}
                unoptimized
              />
              <span>{agent.name}</span>
              {agent.model && <small>{agent.model}</small>}
              <span className={styles.windowTools} aria-hidden="true">
                − <Maximize2 size={12} />
                <X size={15} />
              </span>
            </div>
            <div className={styles.agentPrompt}>{agent.prompt}</div>
            {agent.context && (
              <div className={styles.agentContext}>
                <CircleDot size={14} />
                {agent.context}
                <span>added to context</span>
              </div>
            )}
            {agent.reply && (
              <div className={styles.agentAnswer}>
                <span>Worked for {index === 0 ? "8 sec" : "1 min"}　▸</span>
                <p>{agent.reply}</p>
                {agent.issues.map((issue) => (
                  <div className={styles.answerIssue} key={issue}>
                    {issue}
                  </div>
                ))}
                {index === 0 && (
                  <p>
                    I’ve added them to <strong>Access Controls</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <MobileIllustration
        file="584d7dbd-ff4a-41bb-4fab-74fd5217a400.png"
        alt="Assign an issue to Codex, Steven, Ema, GitHub Copilot, or Cursor"
      />
    </div>
  );
}

const reviewGroups = [
  {
    label: "In Review",
    count: 3,
    state: "green",
    rows: [
      ["ENG-2498", "Replace isFullySynced with a sync status"],
      ["ENG-2380", "Show a stale data banner while syncing"],
      ["ENG-2039", "Pass sync status to the dashboard"],
    ],
  },
  {
    label: "In Progress",
    count: 4,
    state: "yellow",
    rows: [
      ["ENG-2076", "Reduce ETA jitter"],
      ["ENG-2108", "Handle GPS dropouts gracefully"],
      ["ENG-2143", "Optimize map tile loading on initial app open"],
      ["ENG-2187", "Prevent duplicate ride requests on poor networks"],
    ],
  },
  {
    label: "Todo",
    count: 4,
    state: "muted",
    rows: [
      ["ENG-2254", "Reduce unnecessary map re-rendering on home screen"],
      ["ENG-2291", "Clean up deprecated APIs used by the rider app"],
      ["ENG-2327", "Speed up CI pipelines for mobile builds"],
      ["ENG-2358", "Reduce flakiness in mobile UI tests"],
    ],
  },
];

const oldCode = [
  "import React from 'react'",
  "import { View, ActivityIndicator } from 'react-native'",
  "import { useVehicleState } from '@hooks/useVehicleState'",
  "import { Dashboard } from '@components/Dashboard'",
  "",
  "export const HomeScreen = () => {",
  "  const { vehicleState, isFullySynced } = useVehicleState()",
  "",
  "  if (!isFullySynced) {",
  '    return <ActivityIndicator size="large" />',
  "  }",
  "",
  "  return (",
  "    <View>",
  "      <Dashboard state={vehicleState} />",
  "    </View>",
  "  )",
  "}",
];
const newCode = [
  "import React from 'react'",
  "import { View, ActivityIndicator } from 'react-native'",
  "import { useVehicleState, SyncStatus } from '@hooks/useVehicleState'",
  "import { Dashboard } from '@components/Dashboard'",
  "",
  "export const HomeScreen = () => {",
  "  const { vehicleState, syncStatus } = useVehicleState()",
  "",
  "  if (syncStatus === SyncStatus.PENDING) {",
  '    return <ActivityIndicator size="large" />',
  "  }",
  "",
  "  return (",
  "    <View>",
  "      <Dashboard state={vehicleState} syncStatus={syncStatus} />",
  "    </View>",
  "  )",
  "}",
];

function HighlightCode({ code }: { code: string }) {
  const parts = code.split(
    /('.*?'|".*?"|\b(?:import|from|export|const|return|if)\b|\b(?:React|View|ActivityIndicator|Dashboard|HomeScreen|useVehicleState|SyncStatus|vehicleState|syncStatus|isFullySynced)\b)/g,
  );
  return (
    <>
      {parts.map((part, i) => (
        <span
          className={
            part.startsWith("'") || part.startsWith('"')
              ? styles.codeString
              : /^(import|from|export|const|return|if)$/.test(part)
                ? styles.codeKeyword
                : /^[A-Z]/.test(part)
                  ? styles.codeComponent
                  : /^(vehicleState|syncStatus|isFullySynced|useVehicleState)$/.test(
                        part,
                      )
                    ? styles.codeVariable
                    : undefined
          }
          key={i}
        >
          {part}
        </span>
      ))}
    </>
  );
}

export function BuildDemo() {
  return (
    <div
      className={`${styles.scene} ${styles.buildScene}`}
      aria-label="Review issues alongside code changes"
    >
      <div className={styles.reviewList}>
        {reviewGroups.map((group) => (
          <div className={styles.reviewGroup} key={group.label}>
            <div className={styles.reviewGroupHeading}>
              <ChevronDown size={11} />
              <CircleDot className={styles[group.state]} size={13} />
              <span>{group.label}</span>
              <span className={styles.muted}>{group.count}</span>
            </div>
            {group.rows.map(([id, title], index) => (
              <div className={styles.reviewRow} key={id}>
                <ChartNoAxesColumnIncreasing size={13} />
                <span>{id}</span>
                {group.label === "Todo" ? (
                  <Circle size={13} />
                ) : (
                  <CircleDot className={styles[group.state]} size={13} />
                )}
                <strong>{title}</strong>
                <span className={styles.reviewMeta}>
                  #{54910 + index * 117}　Oct {9 - index}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.diff}>
        <div className={styles.diffHeading}>
          <File size={16} />
          <span>kinetic-ios/src/screens/Home/HomeScreen.tsx</span>
          <span>
            Linear <ChevronDown size={10} />
          </span>
        </div>
        <div className={styles.diffColumns}>
          {[oldCode, newCode].map((code, columnIndex) => (
            <div className={styles.diffColumn} key={columnIndex}>
              {code.map((line, index) => (
                <div
                  className={`${styles.codeLine} ${[2, 6, 8, 14].includes(index) ? (columnIndex === 0 ? styles.removed : styles.added) : ""}`}
                  key={index}
                >
                  <span className={styles.lineNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <code>
                    <HighlightCode code={line} />
                  </code>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <MobileIllustration
        file="c16152f3-a36c-468e-89ae-f87c2f244d00.png"
        alt="Code review showing a diff in AppBootstrapper.swift"
      />
    </div>
  );
}
