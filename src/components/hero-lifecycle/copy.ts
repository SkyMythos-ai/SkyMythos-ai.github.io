import type { Locale } from "@/lib/i18n";

const zh = {
  headings: ["把需求说清楚。", "让协作完成交付。", "让反馈推动下一版。"],
  title: "同一需求，Agent 参与全生命周期",
  description: "同一需求 REQ-014：客户提交反馈并查看处理进度。需求 Agent 澄清目标，人修改范围并确认；开发 Agent 实现，验证 Agent 找到并复验缺陷，人验收并批准发布 v1。上线后移动端反馈触发 AI 学习总结，人审核、补充权限角色、确认采用方法；同一需求 v2 先补验收条件，再修改并验证，仍等待人验收。v1 发布快照、来源和方法原件保留。",
  accessible: "同一需求的三幕自动故事。键盘聚焦暂停，移开焦点或点击继续；鼠标悬停不暂停。减少动态时显示完整结果。",
  caption: "虚构需求示意 · 非真实产品运行",
  cliContext: "编码 Agent", cliNote: "可选 CLI 底座", boundaryLabel: "示意边界",
  boundary: "REQ-014、Agent 岗位、品牌与反馈均为虚构示意，不代表预置岗位或固定模型绑定。编码示例展示可选 CLI 底座；CLI 与模型不是同一层，不构成任意组合兼容矩阵。已有配置的 Agent 参与工作不等于新员工创建。AI 总结经验，人审核、修改、确认并决定采用，不代表模型训练或无人自动上线。v1 历史与方法原件不被 v2 改写，v2 最终仍待人验收。原厂标识说明厂商来源，不代表专属 CLI Logo 或品牌背书。",
  logo: "标识",
  status: {
    goal: "一个需求，从明确目标开始", scope: "人修改范围，再确认需求", build: "开发与验证协作，先修正再复验",
    release: "人验收成果，并批准发布 v1", feedback: "反馈触发 AI 总结，人审核并修改", adopt: "人确认并采用，保留方法与来源",
    reuse: "引用方法，先更新 v2 验收条件", pending: "v1 与方法保留 · v2 仍待人验收",
  },
  scene: {
    knowledge: "企业知识", requirement: "需求", development: "开发", verification: "验证", feedbackTitle: "客户反馈",
    scopeOriginal: "提交后结束", scopeEdited: "可查看进度", implementation: "实现与任务记录", submitQuery: "提交与查询",
    duplicate: "重复反馈", prevented: "阻止重复", fix: "修正：重复提交", accepted: "验收通过", pending: "待人验收", releaseApproved: "发布已批准",
    mobileEntry: "手机入口", hardToFind: "不易找到", summary: "AI 总结", mobileAcceptance: "补充移动端验收", humanAmendment: "＋覆盖权限角色",
    mobile: "移动端", permissions: "权限角色", adopted: "采用", confirmed: "确认", approved: "批准", archive: "企业方法与历史",
    released: "已发布", experience: "REQ-014 · 经验", mobileMethod: "移动端验收", roleMethod: "覆盖权限角色", goal: "反馈",
  },
};

type Copy = Omit<typeof zh, "headings"> & { headings: string[] };

const en: Copy = {
  headings: ["Make the goal clear.", "Collaborate to deliver.", "Let feedback shape v2."],
  title: "One requirement, Agents across its lifecycle",
  description: "The same requirement, REQ-014: submit customer feedback and track its progress. A requirements Agent clarifies the goal; a person edits and confirms the scope. Development and verification Agents implement, find a defect, fix it and retest. A person accepts v1 and approves its release. Mobile feedback prompts an AI summary. A person reviews it, adds role coverage, confirms and adopts the method. The same requirement’s v2 updates acceptance criteria before implementation and verification, and still awaits human acceptance. The v1 release snapshot, provenance and original method remain intact.",
  accessible: "A three-act automatic story about one requirement. Keyboard focus pauses; move focus away or click to resume. Hover does not pause. Reduced motion shows the complete result.",
  caption: "Fictional workflow · not a live product run",
  cliContext: "Coding Agents", cliNote: "Optional CLI harnesses", boundaryLabel: "About this illustration",
  boundary: "REQ-014, Agent roles, brands and feedback are fictional, not preset roles or fixed model assignments. The coding example shows optional CLI harnesses; a CLI and a model are different layers, not a compatibility matrix for arbitrary combinations. Existing configured Agents joining work are not newly created employees. AI proposes a summary; people review, edit, confirm and decide whether to adopt it. This is not model training or unattended deployment. V2 does not rewrite v1 history or the original method, and still awaits human acceptance. Original vendor marks indicate source, not a dedicated CLI logo or an endorsement.",
  logo: "logo",
  status: {
    goal: "One requirement starts with a clear goal", scope: "A person edits and confirms the scope", build: "Build, verify, fix — then retest",
    release: "A person accepts v1 and approves release", feedback: "AI summarises feedback; a person reviews and edits", adopt: "A person confirms and adopts; provenance stays",
    reuse: "Reuse the method; update v2 acceptance criteria first", pending: "v1 and methods retained · v2 awaits human acceptance",
  },
  scene: {
    knowledge: "Knowledge", requirement: "Scope", development: "Build", verification: "Verify", feedbackTitle: "Feedback",
    scopeOriginal: "Submit and stop", scopeEdited: "Track progress", implementation: "Code & task log", submitQuery: "Submit & track",
    duplicate: "Duplicates", prevented: "No duplicates", fix: "Fix: deduplicate", accepted: "Accepted", pending: "Human review", releaseApproved: "Approved",
    mobileEntry: "Mobile link", hardToFind: "Hard to find", summary: "AI summary", mobileAcceptance: "Add mobile checks", humanAmendment: "+ Cover user roles",
    mobile: "Mobile", permissions: "Roles", adopted: "Adopt", confirmed: "OK", approved: "Go", archive: "Methods & history",
    released: "Released", experience: "REQ-014 · Notes", mobileMethod: "Mobile checks", roleMethod: "Cover user roles", goal: "Goal",
  },
};

export const lifecycleCopy: Record<Locale, Copy> = { zh, en };
export type LifecycleCopy = Copy;
