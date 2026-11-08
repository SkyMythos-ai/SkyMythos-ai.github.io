"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Folder,
  GitBranch,
  Layers3,
  ListTodo,
  LoaderCircle,
  PanelRight,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Workflow,
} from "lucide-react";
import styles from "./showcase.module.css";

type Scene = "project" | "task" | "automation";
const scenarioTabs = [
  { id: "project", label: "项目工作" },
  { id: "task", label: "研发任务" },
  { id: "automation", label: "自动化" },
] as const;
const scenarios: Record<
  Scene,
  {
    title: string;
    goal: string;
    steps: string[];
    output: string;
    points: string[];
    context: string;
    employee: string;
    next: string;
  }
> = {
  project: {
    title: "客户反馈改进",
    goal: "为客户反馈建立可执行的改进计划",
    steps: [
      "读取项目资料与已发布知识",
      "归纳反馈主题，核对影响范围",
      "整理改进建议与验收要求",
    ],
    output: "客户反馈改进计划",
    points: [
      "简化首次配置，补充清晰的上手指引",
      "说明权限边界，减少反复确认",
      "将改进项拆分为可验收的工作",
    ],
    context: "客户反馈周报 · 产品接入指南",
    employee: "产品分析助手",
    next: "请确认改进优先级，再继续下一步。",
  },
  task: {
    title: "产品接入体验优化",
    goal: "为首次配置补充引导，并交付可审查的变更",
    steps: [
      "读取需求与代码仓库上下文",
      "按流程组织实现与检查",
      "整理变更摘要和验证材料",
    ],
    output: "配置引导 · 交付摘要",
    points: [
      "整理配置流程中的提示与空状态",
      "保留本次变更与检查结果",
      "汇总待审查项，由团队决定后续操作",
    ],
    context: "产品接入指南 · 需求说明",
    employee: "研发协作助手",
    next: "变更与验证材料已整理，等待人工审查。",
  },
  automation: {
    title: "客户反馈归集",
    goal: "收到反馈事件后，生成待确认的改进摘要",
    steps: [
      "接收事件，核对运行准入",
      "在指定环境中整理反馈",
      "保存本次运行结果与证据",
    ],
    output: "反馈归集 · 本次运行摘要",
    points: [
      "归集本次输入中的反馈主题",
      "关联团队已有的知识与处理方法",
      "标记需要人工判断的后续行动",
    ],
    context: "反馈处理规范 · 产品接入指南",
    employee: "反馈整理助手",
    next: "本次示例结果待确认，不会自动发布或通知。",
  },
};

const phaseDurations = [1300, 1500, 1500, 1600, 1700, 4200];
const phaseNames = [
  "goal",
  "reading",
  "working",
  "drafting",
  "delivery",
  "confirmation",
];
const phaseLabels = [
  "目标已明确",
  "准备资料",
  "执行中",
  "整理交付",
  "交付已整理",
  "等待确认",
];

function subscribeMotionPreference(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
function readMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function subscribePageVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}
function readPageVisibility() {
  return document.visibilityState !== "hidden";
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.reveal = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function DemoNote({
  children = "产品场景示意 · 示例数据",
}: {
  children?: ReactNode;
}) {
  return (
    <span className={styles.demoNote}>
      <i />
      {children}
    </span>
  );
}

function BrandMark() {
  return (
    <span className={styles.brandMark}>
      <Image
        className={styles.markLight}
        src="/sites/fusion/brand/logo-mark.svg"
        width={24}
        height={24}
        alt="SkyMythos"
        loading="eager"
        unoptimized
      />
      <Image
        className={styles.markDark}
        src="/sites/fusion/brand/logo-mark-dark.svg"
        width={24}
        height={24}
        alt=""
        loading="eager"
        unoptimized
      />
    </span>
  );
}

function TabList<T extends string>({
  id,
  label,
  items,
  value,
  onChange,
}: {
  id: string;
  label: string;
  items: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  }
  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${item.id}`}
            aria-controls={`${id}-panel-${item.id}`}
            aria-selected={value === item.id}
            tabIndex={value === item.id ? 0 : -1}
            onKeyDown={(event) => onKeyDown(event, index)}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items
        .filter((item) => item.id !== value)
        .map((item) => (
          <div
            key={item.id}
            id={`${id}-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${item.id}`}
            hidden
          />
        ))}
    </>
  );
}

function Report({
  title,
  points,
  compact = false,
  phase = 5,
  stageLabel,
}: {
  title: string;
  points: string[];
  compact?: boolean;
  phase?: number;
  stageLabel?: string;
}) {
  return (
    <article
      className={`${styles.report} ${compact ? styles.reportCompact : ""}`}
      data-phase={phase}
    >
      <div className={styles.documentIcon}>
        <FileText size={21} />
      </div>
      <span className={styles.eyebrow}>交付成果 / 示例</span>
      <h4>{title}</h4>
      {compact && stageLabel && (
        <div className={styles.reportStage}>
          {phase > 3 ? (
            <ClipboardCheck size={13} />
          ) : phase === 0 ? (
            <ListTodo size={13} />
          ) : (
            <LoaderCircle size={13} className={styles.stageSpinner} />
          )}
          <span>{stageLabel}</span>
        </div>
      )}
      <p className={styles.reportLead}>
        将发现的问题，变成可以继续推进的工作。
      </p>
      <div className={styles.reportRule} />
      {points.map((point, index) => (
        <div className={styles.reportPoint} key={point}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>
            {phase > 3 ? (
              point
            ) : (
              <span
                className={styles.draftLine}
                aria-label="交付内容等待整理"
              />
            )}
          </p>
        </div>
      ))}
      <div className={styles.reportFooter}>
        <ClipboardCheck size={14} />
        <span>
          {phase > 3
            ? "已附验收要求，等待你的确认"
            : "先核对依据，再形成可检查的交付"}
        </span>
      </div>
    </article>
  );
}

export function ProductShowcase() {
  const [frame, setFrame] = useState<{ scene: Scene; phase: number }>({
    scene: "project",
    phase: 5,
  });
  const [inView, setInView] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeMotionPreference,
    readMotionPreference,
    () => true,
  );
  const pageVisible = useSyncExternalStore(
    subscribePageVisibility,
    readPageVisibility,
    () => true,
  );
  const tabsId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const { scene } = frame;
  const phase = reducedMotion ? 5 : frame.phase;
  const data = scenarios[scene];
  const playing =
    inView && pageVisible && !reducedMotion && !focusPaused;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => {
        if (!started.current) {
          started.current = true;
          setFrame((current) => ({ ...current, phase: 0 }));
          return;
        }
        setFrame((current) => {
          if (current.phase < 5)
            return { ...current, phase: current.phase + 1 };
          const next =
            (scenarioTabs.findIndex((item) => item.id === current.scene) + 1) %
            scenarioTabs.length;
          return { scene: scenarioTabs[next].id, phase: 0 };
        });
      },
      started.current ? phaseDurations[frame.phase] : 120,
    );
    return () => window.clearTimeout(timer);
  }, [playing, frame.scene, frame.phase]);
  function selectScene(next: Scene) {
    started.current = true;
    setFrame({ scene: next, phase: 5 });
  }
  const stageLabel =
    phase === 0
      ? "目标已明确，准备开始"
      : phase < 4
        ? data.steps[phase - 1]
        : phase === 4
          ? "交付报告已整理"
          : "等待人工确认";
  return (
    <div
      className={styles.workbench}
      ref={ref}
      aria-label="SkyMythos 产品场景示意"
      data-scene={scene}
      data-stage={phaseNames[phase]}
      data-playback={
        reducedMotion
          ? "reduced"
          : playing
            ? "playing"
            : "suspended"
      }
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          setFocusPaused(false);
      }}
    >
      <header className={styles.shellHeader}>
        <div className={styles.shellBrand}>
          <BrandMark />
          <span className={styles.wordmark}>
            <Image
              className={styles.markLight}
              src="/sites/fusion/brand/logo-wordmark.svg"
              width={106}
              height={18}
              alt="SkyMythos.ai"
              loading="eager"
              unoptimized
            />
            <Image
              className={styles.markDark}
              src="/sites/fusion/brand/logo-wordmark-dark.svg"
              width={106}
              height={18}
              alt=""
              loading="eager"
              unoptimized
            />
          </span>
        </div>
        <nav className={styles.primaryNav} aria-label="产品演示导航">
          <button
            type="button"
            className={scene === "project" ? styles.navActive : ""}
            onClick={() => selectScene("project")}
          >
            <Bot size={15} />
            SkyBot
          </button>
          <button
            type="button"
            className={scene === "task" ? styles.navActive : ""}
            onClick={() => selectScene("task")}
          >
            <ListTodo size={15} />
            任务
          </button>
          <button
            type="button"
            className={scene === "automation" ? styles.navActive : ""}
            onClick={() => selectScene("automation")}
          >
            <Workflow size={15} />
            自动化
          </button>
          <a href="#employees">
            <Users size={15} />
            数字员工
          </a>
          <a href="#knowledge">
            <BookOpen size={15} />
            知识库
          </a>
        </nav>
      </header>
      <div className={styles.shellBody}>
        <aside className={styles.sidebar}>
          <div className={styles.workspace}>
            <span className={styles.workspaceMonogram}>S</span>
            <span>
              产品团队<small>示例工作空间</small>
            </span>
            <ChevronDown size={13} />
          </div>
          <span className={styles.sidebarLabel}>快速对话</span>
          <span className={styles.sidebarItem}>
            <Bot size={15} />
            日常工作交流
          </span>
          <span className={styles.sidebarLabel}>项目</span>
          <button
            type="button"
            className={`${styles.sidebarItem} ${scene === "project" ? styles.sidebarActive : ""}`}
            onClick={() => selectScene("project")}
          >
            <Folder size={15} />
            客户反馈改进
          </button>
          <button
            type="button"
            className={`${styles.sidebarItem} ${scene === "task" ? styles.sidebarActive : ""}`}
            onClick={() => selectScene("task")}
          >
            <Folder size={15} />
            产品接入体验
          </button>
          <span className={styles.sidebarLabel}>工作入口</span>
          <a className={styles.sidebarItem} href="#work">
            <Layers3 size={15} />
            工作与交付
          </a>
          <a className={styles.sidebarItem} href="#employees">
            <Users size={15} />
            数字员工
          </a>
          <a className={styles.sidebarItem} href="#knowledge">
            <BookOpen size={15} />
            企业知识
          </a>
          <div className={styles.sidebarBottom}>
            <ShieldCheck size={14} />
            <span>工作保留上下文与来源</span>
          </div>
        </aside>
        <div className={styles.workspaceMain}>
          <div className={styles.workspaceBreadcrumb}>
            <Folder size={13} />
            <span>项目</span>
            <ChevronRight size={12} />
            <strong>{data.title}</strong>
            <span className={styles.pendingState}>
              <i />
              {phaseLabels[phase]}
            </span>
          </div>
          <div className={styles.workspaceHeading}>
            <span className={styles.eyebrow}>从目标到交付</span>
            <h3>{data.goal}</h3>
            <TabList
              id={tabsId}
              label="选择产品工作场景"
              items={scenarioTabs}
              value={scene}
              onChange={selectScene}
            />
          </div>
          <div
            className={styles.heroPanel}
            id={`${tabsId}-panel-${scene}`}
            role="tabpanel"
            aria-labelledby={`${tabsId}-tab-${scene}`}
            tabIndex={0}
          >
            <div className={styles.executionSummary}>
              <div className={styles.assistantHeading}>
                <span className={styles.botAvatar}>
                  <Bot size={17} />
                </span>
                <strong>SkyBot</strong>
                <span>执行记录示例</span>
              </div>
              <div className={styles.miniTimeline}>
                {data.steps.map((step, index) => (
                  <div
                    key={`${scene}-${step}`}
                    data-step-state={
                      phase > index + 1
                        ? "done"
                        : phase === index + 1
                          ? "active"
                          : "pending"
                    }
                  >
                    <span className={styles.timelineCheck}>
                      {phase > index + 1 ? (
                        <Check size={11} />
                      ) : phase === index + 1 ? (
                        <LoaderCircle
                          size={11}
                          className={styles.stageSpinner}
                        />
                      ) : (
                        <span className={styles.pendingDot} />
                      )}
                    </span>
                    <p>{step}</p>
                    <small>0{index + 1}</small>
                  </div>
                ))}
              </div>
              <div className={styles.heroArtifact} data-ready={phase > 3}>
                <FileCheck2 size={17} />
                <span>
                  {data.output}
                  <small>交付报告 · 验收要求</small>
                </span>
                <span className={styles.artifactReady}>
                  {phase > 3 ? "已整理" : "整理中"}
                </span>
              </div>
              <p className={styles.confirmation}>
                <Clock3 size={13} />
                {phase > 3 ? data.next : "示例正在推进，交付后保留人工确认。"}
              </p>
            </div>
            <Report
              compact
              title={data.output}
              points={data.points}
              phase={phase}
              stageLabel={stageLabel}
            />
          </div>
          <div className={styles.goalCriteria}>
            <ClipboardCheck size={15} />
            <div>
              <strong>交付有明确的完成标准</strong>
              <span>保留资料来源、可检查的成果与待确认事项。</span>
            </div>
            <span className={styles.criteriaNote}>产品场景示意</span>
          </div>
        </div>
        <aside className={styles.contextPanel}>
          <div className={styles.contextHeading}>
            <PanelRight size={14} />
            工作上下文
          </div>
          <span className={styles.sidebarLabel}>协作的数字员工</span>
          <div className={styles.employeeContext}>
            <span className={styles.botAvatar}>
              <Sparkles size={18} />
            </span>
            <div>
              <strong>{data.employee}</strong>
              <small>职责与能力可配置</small>
            </div>
          </div>
          <span className={styles.sidebarLabel}>使用的知识</span>
          {data.context.split(" · ").map((name) => (
            <a className={styles.contextSource} key={name} href="#knowledge">
              <FileText size={14} />
              <span>{name}</span>
              <ChevronRight size={12} />
            </a>
          ))}
          <div className={styles.contextBoundary}>
            <ShieldCheck size={17} />
            <strong>结果由你确认</strong>
            <p>保留资料来源、执行过程与交付成果，让下一步有据可依。</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function WorkDeliveryVisual() {
  const [view, setView] = useState<"report" | "evidence">("report");
  const id = useId();
  const ref = useReveal();
  return (
    <div
      className={styles.visualFrame}
      ref={ref}
      aria-label="工作执行与交付示例"
    >
      <div className={styles.visualHeader}>
        <span>
          <Workflow size={16} />
          工作执行
        </span>
        <DemoNote>示例工作 · 待确认</DemoNote>
      </div>
      <div className={styles.deliveryBody}>
        <div className={styles.deliveryTimeline}>
          <span className={styles.eyebrow}>目标 / 客户反馈改进</span>
          <h3>
            每一步工作，
            <br />
            都有迹可循。
          </h3>
          <div className={styles.toolRecord}>
            <span>
              <BookOpen size={16} />
            </span>
            <div>
              <strong>读取关联资料</strong>
              <p>客户反馈周报、产品接入指南</p>
              <small>输入有来源</small>
            </div>
            <CircleCheck size={15} />
          </div>
          <div className={styles.toolRecord}>
            <span>
              <Search size={16} />
            </span>
            <div>
              <strong>分析反馈与影响</strong>
              <p>核对原文，整理问题主题</p>
              <small>过程可回看</small>
            </div>
            <CircleCheck size={15} />
          </div>
          <div className={styles.toolRecord}>
            <span>
              <FileCheck2 size={16} />
            </span>
            <div>
              <strong>整理交付成果</strong>
              <p>改进计划、验收要求与待决事项</p>
              <small>结果待确认</small>
            </div>
            <CircleCheck size={15} />
          </div>
        </div>
        <div className={styles.deliveryOutput}>
          <TabList
            id={id}
            label="查看交付材料"
            items={[
              { id: "report", label: "交付报告" },
              { id: "evidence", label: "执行证据" },
            ]}
            value={view}
            onChange={setView}
          />
          <div
            className={styles.deliveryPanel}
            id={`${id}-panel-${view}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${view}`}
            tabIndex={0}
          >
            {view === "report" ? (
              <Report
                title="客户反馈改进计划"
                points={scenarios.project.points}
              />
            ) : (
              <div className={styles.evidenceList}>
                <div className={styles.evidenceTitle}>
                  <Terminal size={20} />
                  <h4>把结论和依据放在一起</h4>
                  <p>以下为演示材料，不是真实执行日志。</p>
                </div>
                {[
                  {
                    title: "输入资料",
                    text: "保留关联文档及其来源。",
                    icon: BookOpen,
                  },
                  {
                    title: "工作记录",
                    text: "记录工具调用与关键输出。",
                    icon: Workflow,
                  },
                  {
                    title: "交付与验证",
                    text: "附上成果、验收要求与待决事项。",
                    icon: ClipboardCheck,
                  },
                ].map(({ title, text, icon: Icon }) => (
                  <div className={styles.evidenceItem} key={title}>
                    <Icon size={17} />
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                    <Check size={14} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const experiences = [
  {
    id: "feedback",
    title: "客户反馈改进",
    note: "资料分析 · 改进计划",
    skills: ["反馈主题归纳", "改进计划撰写"],
    role: "产品分析助手",
    description: "从资料中核对问题，将反馈整理为可讨论的改进建议。",
  },
  {
    id: "onboarding",
    title: "产品接入体验",
    note: "需求拆解 · 验收要求",
    skills: ["需求梳理", "验收要求整理"],
    role: "研发协作助手",
    description: "关联需求与已有资料，整理实现范围和可检查的验收要求。",
  },
];

export function EmployeeVisual() {
  const [source, setSource] = useState("feedback");
  const [inspected, setInspected] = useState(false);
  const data = experiences.find((item) => item.id === source) ?? experiences[0];
  const ref = useReveal();
  return (
    <div
      className={styles.visualFrame}
      ref={ref}
      aria-label="从工作经验整理数字员工方案"
    >
      <div className={styles.visualHeader}>
        <span>
          <Users size={16} />
          数字员工
        </span>
        <DemoNote>经验分析示例</DemoNote>
      </div>
      <div className={styles.formationBody}>
        <div className={styles.experienceColumn}>
          <span className={styles.eyebrow}>01 / 选择已有工作</span>
          <h3>从做过的工作出发</h3>
          <p>选择有来源的工作记录，分析职责、技能与经验。</p>
          <div className={styles.experienceList}>
            {experiences.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={source === item.id}
                onClick={() => {
                  setSource(item.id);
                  setInspected(false);
                }}
              >
                <span className={styles.experienceIcon}>
                  <FileCheck2 size={19} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.note}</small>
                </span>
                <span className={styles.sourceRadio}>
                  {source === item.id && <i />}
                </span>
              </button>
            ))}
          </div>
          <div className={styles.sourceAssurance}>
            <GitBranch size={15} />
            <span>保留工作来源与分析依据</span>
          </div>
        </div>
        <div className={styles.formationArrow}>
          <ArrowRight size={22} />
        </div>
        <div className={styles.employeeProposal}>
          <div className={styles.proposalTop}>
            <span className={styles.employeeAvatar}>
              <Bot size={30} />
            </span>
            <span className={styles.pendingState}>
              <i />
              待确认方案
            </span>
          </div>
          <span className={styles.eyebrow}>02 / 检查能力方案</span>
          <h4>{data.role}</h4>
          <p>{data.description}</p>
          <div className={styles.proposalLine} />
          <span className={styles.proposalLabel}>建议复用的 Skill</span>
          <div className={styles.skillList}>
            {data.skills.map((skill) => (
              <span key={skill}>
                <Sparkles size={13} />
                {skill}
              </span>
            ))}
          </div>
          <div className={styles.proposalSource}>
            <FileText size={14} />
            来源：{data.title}
          </div>
          <button
            type="button"
            className={styles.outlineAction}
            onClick={() => setInspected((value) => !value)}
            aria-expanded={inspected}
          >
            {inspected ? "收起确认说明" : "查看确认事项"}
            <ChevronDown size={13} />
          </button>
          {inspected && (
            <p role="status" className={styles.proposalNotice}>
              检查职责、Skill 与来源后再确认。本演示不会创建实际员工。
            </p>
          )}
        </div>
      </div>
      <div className={styles.formationFooter}>
        <ShieldCheck size={14} />
        <span>经验分析 → 检查方案 → 人工确认；不是模型微调。</span>
      </div>
    </div>
  );
}

const documents = [
  {
    id: "feedback",
    title: "客户反馈周报",
    scope: "产品团队 / 客户研究",
    excerpt: "首次配置中的疑问，主要集中在接入步骤、权限说明与完成后的下一步。",
    paragraphs: [
      "本周示例反馈集中在首次配置。用户需要更清楚地了解接入步骤、所需权限，以及完成配置后的下一步。",
      "建议将首次配置拆成可检查的步骤，在每一步说明当前状态、缺失信息与可执行动作。",
      "这些反馈需要结合产品目标继续判断优先级，不能直接视为已批准的需求。",
    ],
    term: "首次配置 客户 反馈 接入 权限",
  },
  {
    id: "guide",
    title: "产品接入指南",
    scope: "团队知识库 / 使用指南",
    excerpt: "首次配置前，先确认工作空间、可用连接与必要的资料访问范围。",
    paragraphs: [
      "首次配置前，先确认当前工作空间、可用连接，以及完成工作所需的资料访问范围。",
      "把目标、相关文档和验收要求放进同一个项目，让后续工作可以沿用上下文。",
      "执行结果应附来源和验证材料，再由负责人确认下一步。",
    ],
    term: "首次配置 接入 指南 项目 文档 工作空间",
  },
  {
    id: "permissions",
    title: "权限设计说明",
    scope: "团队知识库 / 产品规范",
    excerpt: "资料访问与工具执行按各自授权判断，关键结果保留人工确认。",
    paragraphs: [
      "资料访问、工具执行和结果确认分别承担不同职责。给出工作目标不等于授予所有操作权限。",
      "团队应能识别使用的知识来源、执行环境与连接范围。",
      "需要额外授权或输入时，应明确说明当前阻塞和下一步，而不是隐藏不确定性。",
    ],
    term: "权限 访问 授权 资料 工具",
  },
];

export function KnowledgeVisual() {
  const [query, setQuery] = useState("首次配置");
  const [search, setSearch] = useState("首次配置");
  const [selected, setSelected] = useState("feedback");
  const ref = useReveal();
  const id = useId();
  const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = documents.filter(
    (doc) =>
      terms.length === 0 ||
      terms.some((term) =>
        `${doc.title}${doc.term}${doc.excerpt}`.toLowerCase().includes(term),
      ),
  );
  const source = results.find((doc) => doc.id === selected) ?? results[0];
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(query);
    setSelected("");
  }
  return (
    <div
      className={styles.visualFrame}
      ref={ref}
      aria-label="企业知识检索与来源原文演示"
    >
      <div className={styles.visualHeader}>
        <span>
          <BookOpen size={16} />
          企业知识
        </span>
        <DemoNote>本地关键词检索示例</DemoNote>
      </div>
      <form className={styles.knowledgeSearch} onSubmit={submitSearch}>
        <Search size={17} />
        <label htmlFor={`${id}-query`} className={styles.srOnly}>
          检索示例知识
        </label>
        <input
          id={`${id}-query`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="试试：首次配置、权限、项目"
        />
        <button type="submit">
          检索
          <ArrowRight size={13} />
        </button>
      </form>
      <div className={styles.knowledgeBody}>
        <div className={styles.searchResults}>
          <div className={styles.resultsLabel} role="status">
            检索结果 <span>{results.length} 篇示例文档</span>
          </div>
          {results.map((doc) => (
            <button
              type="button"
              key={doc.id}
              aria-pressed={selected === doc.id}
              onClick={() => setSelected(doc.id)}
            >
              <span className={styles.resultTitle}>
                <FileText size={15} />
                <strong>{doc.title}</strong>
                <ChevronRight size={12} />
              </span>
              <span className={styles.resultScope}>{doc.scope}</span>
              <p>{doc.excerpt}</p>
              <span className={styles.readOriginal}>
                查看来源原文
                <ArrowRight size={11} />
              </span>
            </button>
          ))}
          {results.length === 0 && (
            <div className={styles.noResults}>
              <Search size={23} />
              <strong>没有匹配的示例文档</strong>
              <p>可以试试“配置”“权限”或清空检索词。</p>
            </div>
          )}
        </div>
        <article
          className={styles.sourceDocument}
          aria-label={source ? `来源原文：${source.title}` : "尚无匹配原文"}
        >
          {source ? (
            <>
              <div className={styles.sourceBreadcrumb}>
                <BookOpen size={13} />
                {source.scope}
                <span>示例原文</span>
              </div>
              <span className={styles.documentIcon}>
                <FileText size={22} />
              </span>
              <h4>{source.title}</h4>
              <span className={styles.sourceSubtitle}>
                保留上下文，核对每一处引用。
              </span>
              {source.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? styles.highlightedParagraph : ""}
                >
                  {paragraph}
                </p>
              ))}
              <div className={styles.sourceBottom}>
                <ShieldCheck size={13} />
                演示文档，不含真实客户资料
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <BookOpen size={25} />
              <strong>选择有来源的知识</strong>
              <p>调整检索词，再从结果中查看原文。</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
