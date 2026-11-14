"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronDown, FileText } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { useSiteMotion } from "./site-motion";
import styles from "./capability-scenes.module.css";

type Scene = "work" | "employees" | "knowledge";
type DocumentId = "feedback" | "guide";

const copy = {
  zh: {
    example: "交互示例", pending: "待确认", source: "来源", workTitle: "客户反馈改进计划",
    workSource: "客户反馈周报 · 产品接入指南", workLead: "将发现的问题，变成可以继续推进的工作。",
    tabs: ["交付计划", "来源依据", "确认事项"],
    points: ["简化首次配置，补充清晰的上手指引", "说明权限边界，减少反复确认", "将改进项拆分为可验收的工作"],
    pendingWork: "待确认：改进优先级与验收标准", evidenceTitle: "把结论和依据放在一起",
    evidenceNote: "以下为演示材料，不是真实执行日志。",
    questions: ["建议是否与来源资料一致？", "哪些改进应该优先处理？", "验收标准是否清楚、可检查？"],
    reviewNote: "示例仅说明确认过程，不会批准或发布实际工作。",
    records: "选择工作记录", recordsNote: "从有来源的工作中整理方案", proposal: "数字员工方案", responsibility: "职责", skills: "建议复用的 Skill",
    showReview: "查看确认事项", hideReview: "收起确认说明", employeeReview: "检查职责、Skill 与来源后再确认。本演示不会创建实际员工。",
    experiences: [
      { title: "客户反馈改进", note: "资料分析 · 改进计划", role: "产品分析助手", description: "从资料中核对问题，将反馈整理为可讨论的改进建议。", skills: ["反馈主题归纳", "改进计划撰写"] },
      { title: "产品接入体验", note: "需求拆解 · 验收要求", role: "研发协作助手", description: "关联需求与已有资料，整理实现范围和可检查的验收要求。", skills: ["需求梳理", "验收要求整理"] },
    ],
    documents: {
      feedback: { title: "客户反馈周报", scope: "产品团队 / 客户研究", excerpt: "首次配置中的疑问，主要集中在接入步骤、权限说明与完成后的下一步。", paragraphs: ["本周示例反馈集中在首次配置。用户需要更清楚地了解接入步骤、所需权限，以及完成配置后的下一步。", "建议将首次配置拆成可检查的步骤，在每一步说明当前状态、缺失信息与可执行动作。"] },
      guide: { title: "产品接入指南", scope: "团队知识库 / 使用指南", excerpt: "首次配置前，先确认工作空间、可用连接与必要的资料访问范围。", paragraphs: ["首次配置前，先确认当前工作空间、可用连接，以及完成工作所需的资料访问范围。", "把目标、相关文档和验收要求放进同一个项目，让后续工作可以沿用上下文。"] },
    },
    selectSource: "选择来源原文", conclusion: "关联结论", conclusionText: "简化首次配置", citation: "结论可回到原文核对",
  },
  en: {
    example: "Interactive example", pending: "Pending review", source: "Source", workTitle: "Customer feedback improvement plan",
    workSource: "Customer feedback weekly · Product onboarding guide", workLead: "Turn identified issues into work the team can move forward.",
    tabs: ["Delivery plan", "Source evidence", "Review items"],
    points: ["Simplify initial setup with clear onboarding guidance", "Explain permission boundaries to reduce repeated checks", "Break improvements into work with verifiable outcomes"],
    pendingWork: "Pending: priorities and acceptance criteria", evidenceTitle: "Connect conclusions to their sources",
    evidenceNote: "These are example materials, not actual execution logs.",
    questions: ["Are the recommendations consistent with the sources?", "Which improvements should come first?", "Are the acceptance criteria clear and verifiable?"],
    reviewNote: "This example illustrates review; it does not approve or publish actual work.",
    records: "Select a work record", recordsNote: "Build a proposal from work with a source", proposal: "Digital employee proposal", responsibility: "Responsibility", skills: "Skills suggested for reuse",
    showReview: "View review items", hideReview: "Hide review details", employeeReview: "Review the responsibility, skills and source before confirming. This example does not create an employee.",
    experiences: [
      { title: "Customer feedback improvement", note: "Analysis · Improvement plan", role: "Product analysis assistant", description: "Check issues against source materials and turn feedback into recommendations for discussion.", skills: ["Feedback theme analysis", "Improvement plan writing"] },
      { title: "Product onboarding experience", note: "Requirements · Acceptance criteria", role: "Engineering collaboration assistant", description: "Connect requirements with existing materials and define scope and verifiable acceptance criteria.", skills: ["Requirements analysis", "Acceptance criteria preparation"] },
    ],
    documents: {
      feedback: { title: "Customer feedback weekly", scope: "Product team / Customer research", excerpt: "Questions about initial setup focus on onboarding steps, permissions, and what to do next.", paragraphs: ["This week's example feedback focuses on initial setup. Users need clearer onboarding steps, required permissions, and next steps after setup.", "Break initial setup into verifiable steps, explaining the current state, missing information, and available actions at each step."] },
      guide: { title: "Product onboarding guide", scope: "Team knowledge base / Guides", excerpt: "Before initial setup, confirm the workspace, available connections, and required access to materials.", paragraphs: ["Before initial setup, confirm the current workspace, available connections, and access to the materials needed for the work.", "Place the goal, related documents, and acceptance criteria in one project so later work can reuse the context."] },
    },
    selectSource: "Select a source", conclusion: "Related conclusion", conclusionText: "Simplify initial setup", citation: "Trace the conclusion back to its source",
  },
};

function WorkScene({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [view, setView] = useState(0);
  return <div className={styles.workLayout}>
    <div className={styles.switches} aria-label={locale === "zh" ? "查看交付材料" : "View delivery materials"}>
      {t.tabs.map((label, index) => <button type="button" key={label} aria-pressed={view === index} onClick={() => setView(index)}>{label}</button>)}
    </div>
    <article className={styles.paper}>
      <div className={styles.paperTop}><span>{t.example}</span><span className={styles.pending}>{t.pending}</span></div>
      <h3>{view === 1 ? t.evidenceTitle : t.workTitle}</h3>
      {view === 0 && <><p className={styles.sourceLine}>{t.workSource}</p><p className={styles.lead}>{t.workLead}</p><ul className={styles.pointList}>{t.points.map(point => <li key={point}><Check size={17} aria-hidden="true" />{point}</li>)}</ul><div className={styles.paperFooter}>{t.pendingWork}</div></>}
      {view === 1 && <><p className={styles.sourceLine}>{t.evidenceNote}</p><div className={styles.evidence}>{Object.values(t.documents).map(doc => <div key={doc.title}><FileText size={18} aria-hidden="true" /><div><strong>{doc.title}</strong><p>{doc.excerpt}</p></div></div>)}</div><div className={styles.paperFooter}>{t.citation}</div></>}
      {view === 2 && <><p className={styles.sourceLine}>{t.workSource}</p><ul className={styles.questionList}>{t.questions.map(question => <li key={question}>{question}</li>)}</ul><div className={styles.paperFooter}>{t.reviewNote}</div></>}
    </article>
  </div>;
}

function EmployeeScene({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const experience = t.experiences[selected];
  return <div className={styles.splitLayout}>
    <div className={styles.sourceColumn}><h3>{t.records}</h3><p>{t.recordsNote}</p><div className={styles.sourceButtons}>{t.experiences.map((item, index) => <button type="button" key={item.title} aria-pressed={selected === index} onClick={() => { setSelected(index); setOpen(false); }}><span><strong>{item.title}</strong><small>{item.note}</small></span><ArrowRight size={17} aria-hidden="true" /></button>)}</div></div>
    <article className={`${styles.paper} ${styles.employeePaper}`}>
      <div className={styles.paperTop}><span>{t.proposal} · {t.example}</span><span className={styles.pending}>{t.pending}</span></div>
      <h3>{experience.role}</h3>
      <div className={styles.detail}><strong>{t.responsibility}</strong><p>{experience.description}</p></div>
      <div className={styles.detail}><strong>{t.skills}</strong><ul className={styles.skills}>{experience.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
      <div className={styles.employeeBottom}><p>{t.source}：{experience.title}</p><button type="button" className={styles.reviewButton} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t.hideReview : t.showReview}<ChevronDown size={15} aria-hidden="true" /></button>{open && <p className={styles.notice}>{t.employeeReview}</p>}</div>
    </article>
  </div>;
}

function KnowledgeScene({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [selected, setSelected] = useState<DocumentId>("feedback");
  const doc = t.documents[selected];
  return <div className={styles.splitLayout}>
    <div className={styles.sourceColumn}><h3>{t.selectSource}</h3><p>{t.citation}</p><div className={styles.sourceButtons}>{(["feedback", "guide"] as const).map(id => <button type="button" key={id} aria-pressed={selected === id} onClick={() => setSelected(id)}><span><strong>{t.documents[id].title}</strong><small>{t.documents[id].scope}</small></span><ArrowRight size={17} aria-hidden="true" /></button>)}</div></div>
    <article className={`${styles.paper} ${styles.knowledgePaper}`}>
      <div className={styles.paperTop}><span>{t.example}</span><FileText size={19} aria-hidden="true" /></div>
      <p className={styles.path}>{doc.scope}</p><h3>{doc.title}</h3>
      <div className={styles.documentText}>{doc.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      <div className={styles.conclusion}><span>{t.conclusion}</span><strong>{t.conclusionText}</strong><small>{t.citation}</small></div>
    </article>
  </div>;
}

export function CapabilityScene({ scene, locale }: { scene: Scene; locale: Locale }) {
  const { enabled } = useSiteMotion();
  return <div className={`${styles.canvas} ${enabled ? styles.motion : ""}`}>
    {scene === "work" ? <WorkScene locale={locale} /> : scene === "employees" ? <EmployeeScene locale={locale} /> : <KnowledgeScene locale={locale} />}
  </div>;
}
