#!/usr/bin/env node
/**
 * 只读托管 ../fusion-harness/components/console/web/dist，
 * 为产品文档采集 11 组中英双语真实产品功能截图，并按真实 DOM 几何坐标叠加高亮框、编号圆标与文字标注。
 */
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../..");
const harnessRoot = path.resolve(repoRoot, "../fusion-harness");
const distDir = path.join(harnessRoot, "components/console/web/dist");
const outBase = path.join(repoRoot, "public/sites/fusion/docs");

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);

const WORKSPACE_ID = "ws-enterprise-prod";
const STAMP = "2026-11-26T09:30:00Z";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
};

function buildFixtures(locale) {
  const zh = locale === "zh";
  const wsName = zh ? "产品与研发空间" : "Product & Engineering";
  const userName = zh ? "林枚" : "Alex Chen";
  const email = "alex.chen@skymythos-demo.internal";

  const identity = {
    userId: "user-alex-chen",
    displayName: userName,
    email,
    status: "active",
    isAdmin: false,
    isSystemAdmin: false,
    platformRole: "member",
    workspaceMemberships: [
      {
        workspaceId: WORKSPACE_ID,
        workspaceName: wsName,
        workspacePublic: false,
        role: "workspace_admin",
        organizationId: "org-skymythos",
      },
    ],
    organizations: [{ id: "org-skymythos", name: "SkyMythos Enterprise", slug: "skymythos" }],
    organizationMemberships: [{ organizationId: "org-skymythos", role: "admin" }],
  };

  const accountProfile = {
    userId: identity.userId,
    displayName: userName,
    title: zh ? "平台研发负责人" : "Staff Platform Engineer",
    department: zh ? "产品研发中心" : "Engineering",
    employeeId: "SM-1024",
    manager: "",
    timezone: "Asia/Shanghai",
    language: zh ? "zh-CN" : "en",
    theme: "light",
    taskNotifications: true,
    approvalNotifications: true,
    revision: 1,
    userRevision: 1,
    updatedAt: STAMP,
  };

  const projects = [
    {
      id: "proj-onboarding",
      userId: identity.userId,
      workspaceId: WORKSPACE_ID,
      name: zh ? "客户反馈归因专项" : "Customer Feedback Triage",
      rootPath: "/workspace/projects/feedback-triage",
      instructions: zh ? "汇总脱敏客户反馈并对照产品规范生成改进清单。" : "Triage customer feedback against published product specs.",
      revision: 1,
      status: "active",
      archived: false,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
    {
      id: "proj-api-hardening",
      userId: identity.userId,
      workspaceId: WORKSPACE_ID,
      name: zh ? "配置接口校验加固" : "Config API Validation",
      rootPath: "/workspace/projects/api-hardening",
      instructions: zh ? "完善保存接口空值校验与单元测试。" : "Harden input validation and unit test coverage.",
      revision: 1,
      status: "active",
      archived: false,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
  ];

  const conversations = [
    {
      id: "conv-feedback-01",
      conversationId: "conv-feedback-01",
      userId: identity.userId,
      workspaceId: WORKSPACE_ID,
      title: zh ? "本周客户反馈优先级归因" : "Weekly Feedback Triage Plan",
      type: "agent_session",
      conversationType: "agent_session",
      runtimeId: "codex",
      projectId: "proj-onboarding",
      projectRole: "main",
      runningTurnCount: 0,
      status: "idle",
      createdAt: STAMP,
      updatedAt: STAMP,
    },
    {
      id: "conv-quick-01",
      conversationId: "conv-quick-01",
      userId: identity.userId,
      workspaceId: WORKSPACE_ID,
      title: zh ? "OAuth 回调路径核对" : "Verify OAuth Callback Routes",
      type: "agent_session",
      conversationType: "agent_session",
      runtimeId: "codex",
      runningTurnCount: 0,
      status: "idle",
      createdAt: STAMP,
      updatedAt: STAMP,
    },
  ];

  const userPrompt = zh
    ? "请结合《产品规范与接入指南》知识库，梳理本周客户反馈中的 3 项优先改进建议，并标注需要人工确认的边界。"
    : "Summarize the top 3 priority improvements from this week's feedback using the Onboarding Guide knowledge base, and mark decisions needing human sign-off.";

  const assistantReply = zh
    ? "已检索已发布知识库《产品规范与接入指南》（v2.1），结合反馈导出文件整理如下：\n\n1. **首单四要素提示模板**：建议在任务创建页补充可一键代入的结构化模板。\n2. **知识发布与索引区分**：明确区分“保存草稿”“发布新版本”与“可检索”状态。\n3. **待人工确认边界**：以上 3 项建议尚未创建外部工单，请产品负责人确认优先级后再排期。"
    : "Retrieved published Knowledge Base **Onboarding Guide (v2.1)** and grouped this week's feedback:\n\n1. **Four-Part Task Template**: Provide a quick-insert template on the task creation drawer.\n2. **Draft vs. Indexed Clarity**: Surface Draft, Published, and Searchable states explicitly.\n3. **Human Confirmation Gate**: No external tickets were modified—awaiting product lead sign-off.";

  const conversationMessages = [
    {
      id: "msg-1",
      conversationId: "conv-feedback-01",
      role: "user",
      text: userPrompt,
      createdAt: STAMP,
    },
    {
      id: "msg-2",
      conversationId: "conv-feedback-01",
      role: "assistant",
      text: assistantReply,
      createdAt: STAMP,
    },
  ];

  const conversationEvents = [
    {
      eventId: "ev-1",
      turnId: "turn-1",
      type: "user_message",
      role: "user",
      content: userPrompt,
      createdAt: STAMP,
    },
    {
      eventId: "ev-2",
      turnId: "turn-1",
      type: "assistant_message",
      role: "assistant",
      content: assistantReply,
      createdAt: STAMP,
    },
  ];

  const tasks = [
    {
      taskId: "task-api-validation",
      id: "task-api-validation",
      workspaceId: WORKSPACE_ID,
      title: zh ? "为配置保存接口补充空名称校验与单测" : "Add empty-name validation & unit tests",
      status: "completed",
      branch: "fusion/task-api-validation",
      repositoryName: "skymythos/core-service",
      baseBranch: "main",
      flowName: "standard-engineering-flow",
      flowVersion: "1.2.0",
      createdAt: STAMP,
      updatedAt: STAMP,
      createdBy: identity.userId,
      worknodes: [
        { id: "understand", title: zh ? "需求理解" : "Understand", status: "completed" },
        { id: "implement", title: zh ? "代码实现" : "Implement", status: "completed" },
        { id: "unit-gate", title: zh ? "Unit Gate 门禁" : "Unit Gate", status: "completed" },
      ],
    },
    {
      taskId: "task-oauth-audit",
      id: "task-oauth-audit",
      workspaceId: WORKSPACE_ID,
      title: zh ? "核对飞书/Lark 回调状态校验边界" : "Audit Lark/Feishu OAuth state validation",
      status: "running",
      branch: "fusion/task-oauth-audit",
      repositoryName: "skymythos/identity-gateway",
      baseBranch: "dev",
      flowName: "security-review-flow",
      flowVersion: "1.0.3",
      createdAt: STAMP,
      updatedAt: STAMP,
      createdBy: identity.userId,
      worknodes: [
        { id: "understand", title: zh ? "需求理解" : "Understand", status: "completed" },
        { id: "review", title: zh ? "安全审查" : "Security Review", status: "running" },
      ],
    },
  ];

  const flows = [
    {
      scope: "workspace_private",
      workspaceId: WORKSPACE_ID,
      name: "standard-engineering-flow",
      releases: [
        {
          version: "1.2.0",
          digest: "a".repeat(64),
          publishedAt: STAMP,
          notes: zh ? "标准需求分析、实现、单测门禁与交付摘要流" : "Standard analyze, code, Unit Gate, and delivery flow",
          spec: {
            title: zh ? "标准研发交付流程" : "Standard Engineering Delivery Flow",
            description: zh
              ? "从需求理解、编码实现到 Unit Gate 单元测试验证的标准多阶段流程。"
              : "Multi-stage flow covering analysis, implementation, and deterministic Unit Gate checks.",
            worknodes: [
              { id: "understand", title: zh ? "需求理解" : "Understand", agentRuntime: "codex" },
              { id: "implement", title: zh ? "编码实现" : "Implement", agentRuntime: "codex" },
              { id: "verify", title: zh ? "单测门禁" : "Unit Gate", agentRuntime: "codex" },
            ],
          },
        },
      ],
      tags: { latest: "1.2.0" },
      tagRevision: 1,
      updatedAt: STAMP,
      createdAt: STAMP,
    },
  ];

  const employees = [
    {
      employeeId: "emp-skybot-root",
      id: "emp-skybot-root",
      ownerUserId: identity.userId,
      kind: "root",
      lifecycle: "active",
      workspaceId: WORKSPACE_ID,
      displayName: "SkyBot",
      responsibility: zh ? "统筹工作目标，协调数字员工与项目上下文。" : "Coordinate goals, specialists, and project context.",
      readiness: { state: "ready", reasons: [] },
      revision: 1,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
    {
      employeeId: "emp-feedback-analyst",
      id: "emp-feedback-analyst",
      ownerUserId: identity.userId,
      kind: "professional",
      lifecycle: "active",
      canTrain: true,
      workspaceId: WORKSPACE_ID,
      displayName: zh ? "客户反馈归因专员" : "Customer Feedback Analyst",
      responsibility: zh ? "对照已发布产品规范对客户反馈归因分级并保留来源引用。" : "Categorize feedback against published specs with exact source citations.",
      visibility: "workspace",
      readiness: { state: "ready", reasons: [] },
      configuration: {
        responsibility: zh ? "客户反馈归因、优先级分析与改进草案起草" : "Feedback triage, prioritization, and draft reporting",
        instructions: zh
          ? "1. 先检索工作空间已发布的产品规范知识库。\n2. 按缺陷、需求缺失、引导不清三类归纳客户反馈。\n3. 每条结论附带来源文档版本号与原文链接，不自动修改外部工单。"
          : "1. Query published product spec Knowledge Bases first.\n2. Group feedback by UX bug, missing feature, or doc clarity.\n3. Attach revision citations to every finding; never mutate external tickets.",
        capabilities: [
          { kind: "skill", name: "knowledge-citation-audit", version: "1.1.0", digest: "sha256:abc", assetId: "skill-citation" },
        ],
        defaultModel: { gatewayId: "gw-enterprise", model: "claude-sonnet-4" },
        roles: [zh ? "产品运营" : "Product Ops"],
      },
      revision: 3,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
    {
      employeeId: "emp-code-reviewer",
      id: "emp-code-reviewer",
      ownerUserId: identity.userId,
      kind: "professional",
      lifecycle: "active",
      canTrain: true,
      workspaceId: WORKSPACE_ID,
      displayName: zh ? "接口规范审查专员" : "API Convention Reviewer",
      responsibility: zh ? "按团队错误码与单测基线检查新提交的接口变更。" : "Review new endpoint diffs against error-code and test baselines.",
      visibility: "workspace",
      readiness: { state: "ready", reasons: [] },
      configuration: {
        responsibility: zh ? "接口参数校验与单元测试门禁初筛" : "API validation and unit test pre-review",
        instructions: zh
          ? "检查参数边界校验、错误码一致性及单元测试覆盖情况，输出待工程师确认的审查摘要。"
          : "Audit input validation, error codes, and unit test coverage; output review notes for engineers.",
        capabilities: [
          { kind: "skill", name: "pr-gate-review", version: "2.0.0", digest: "sha256:def", assetId: "skill-pr-gate" },
        ],
        defaultModel: { gatewayId: "gw-enterprise", model: "gpt-5" },
        roles: [zh ? "软件研发" : "Engineering"],
      },
      revision: 2,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
  ];

  const knowledgeBases = [
    {
      id: "kb-product-specs",
      knowledgeBaseId: "kb-product-specs",
      organizationId: "org-skymythos",
      ownerWorkspaceId: WORKSPACE_ID,
      scope: "workspace",
      name: zh ? "产品规范与接入指南" : "Product Specs & Onboarding Guide",
      description: zh ? "保存已发布的产品功能边界、接入清单与客户反馈分级标准。" : "Published product boundaries, onboarding checklists, and triage standards.",
      status: "active",
      documentCount: 14,
      indexedCount: 14,
      revision: 5,
      createdBy: identity.userId,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
    {
      id: "kb-eng-standards",
      knowledgeBaseId: "kb-eng-standards",
      organizationId: "org-skymythos",
      ownerWorkspaceId: WORKSPACE_ID,
      scope: "public",
      name: zh ? "研发接口与安全基线库" : "Engineering API & Security Baseline",
      description: zh ? "公开至全组织共享的错误码规范、单元测试要求与沙箱隔离标准。" : "Organization-public API error conventions, testing rules, and sandbox baselines.",
      status: "active",
      documentCount: 22,
      indexedCount: 22,
      revision: 3,
      createdBy: identity.userId,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
  ];

  const marketplaceCatalog = {
    mcp: [
      {
        id: "mcp-github-ent",
        kind: "mcp",
        scope: "workspace",
        name: "github-enterprise-readonly",
        displayName: "GitHub Enterprise OpenAPI",
        description: zh ? "按当前成员授权读取企业仓库 Issue、Pull Request 与差异摘要。" : "Read authorized enterprise GitHub issues, PRs, and diff metadata.",
        authorUserId: identity.userId,
        authorDisplayName: userName,
        publisherKind: "user",
        latestVersion: "1.4.0",
        revision: 2,
        hasDraftChanges: false,
        maintenanceWorkspaceId: WORKSPACE_ID,
        createdAt: STAMP,
        updatedAt: STAMP,
        updatedBy: userName,
        releases: [{ version: "1.4.0", content: { description: "GitHub Enterprise MCP" } }],
      },
      {
        id: "mcp-sentry-obs",
        kind: "mcp",
        scope: "public",
        name: "sentry-error-tracker",
        displayName: "Sentry Error Tracker",
        description: zh ? "查询授权项目告警事件、异常堆栈与版本回归状态。" : "Inspect project alert events, stack traces, and release regressions.",
        authorUserId: "system",
        authorDisplayName: zh ? "平台团队" : "Platform Team",
        publisherKind: "system",
        latestVersion: "2.1.0",
        revision: 1,
        hasDraftChanges: false,
        maintenanceWorkspaceId: "",
        createdAt: STAMP,
        updatedAt: STAMP,
        updatedBy: "Platform Team",
        releases: [{ version: "2.1.0", content: { description: "Sentry MCP" } }],
      },
    ],
    skill: [
      {
        id: "skill-pr-gate",
        kind: "skill",
        scope: "public",
        name: "pr-gate-review",
        displayName: "PR Gate & Code Review",
        description: zh ? "标准化检查改动范围、潜在边界缺陷、测试覆盖与构建门禁。" : "Standardize scope review, boundary checks, test coverage, and build gates.",
        authorUserId: "system",
        authorDisplayName: zh ? "研发效能组" : "DevEx Team",
        publisherKind: "system",
        latestVersion: "2.0.0",
        revision: 2,
        hasDraftChanges: false,
        maintenanceWorkspaceId: "",
        createdAt: STAMP,
        updatedAt: STAMP,
        updatedBy: "DevEx Team",
        releases: [{ version: "2.0.0", content: { description: "PR Gate Skill" } }],
      },
      {
        id: "skill-citation",
        kind: "skill",
        scope: "workspace",
        name: "knowledge-citation-audit",
        displayName: zh ? "知识原文溯源审计" : "Knowledge Citation Audit",
        description: zh ? "强制报告每条结论关联已发布知识库版本号与原文位置。" : "Requires every finding to cite its exact published Knowledge revision.",
        authorUserId: identity.userId,
        authorDisplayName: userName,
        publisherKind: "user",
        latestVersion: "1.1.0",
        revision: 1,
        hasDraftChanges: false,
        maintenanceWorkspaceId: WORKSPACE_ID,
        createdAt: STAMP,
        updatedAt: STAMP,
        updatedBy: userName,
        releases: [{ version: "1.1.0", content: { description: "Citation Audit Skill" } }],
      },
    ],
    flow: [
      {
        id: "flow-standard-eng",
        kind: "flow",
        scope: "public",
        name: "standard-engineering-flow",
        displayName: zh ? "标准研发交付 Flow" : "Standard Engineering Delivery Flow",
        description: zh ? "涵盖需求理解、编码实现、Unit Gate 单测与交付摘要的标准流程。" : "Covers understanding, implementation, deterministic Unit Gates, and handover.",
        authorUserId: "system",
        authorDisplayName: zh ? "平台团队" : "Platform Team",
        publisherKind: "system",
        latestVersion: "1.2.0",
        revision: 1,
        hasDraftChanges: false,
        maintenanceWorkspaceId: "",
        createdAt: STAMP,
        updatedAt: STAMP,
        updatedBy: "Platform Team",
        releases: flows[0].releases,
      },
    ],
    worknode: [
      {
        id: "node-unit-gate",
        kind: "worknode",
        scope: "public",
        name: "deterministic-unit-gate",
        displayName: zh ? "确定性单测门禁节点" : "Deterministic Unit Gate Node",
        description: zh ? "在隔离沙箱执行单元测试与静态类型检查并留存退出码证据。" : "Runs unit tests and typechecks inside the sandbox and records exit codes.",
        authorUserId: "system",
        authorDisplayName: zh ? "平台团队" : "Platform Team",
        publisherKind: "system",
        latestVersion: "1.0.1",
        revision: 1,
        hasDraftChanges: false,
        maintenanceWorkspaceId: "",
        createdAt: STAMP,
        updatedAt: STAMP,
        updatedBy: "Platform Team",
        releases: [
          {
            version: "1.0.1",
            content: {
              kind: "WorkNode",
              metadata: { name: "deterministic-unit-gate", title: "Deterministic Unit Gate Node" },
              spec: { title: "Deterministic Unit Gate Node", description: "Runs deterministic test checks." },
            },
          },
        ],
      },
    ],
  };

  const coworkFlows = [
    {
      definitionId: "auto-weekly-digest",
      id: "auto-weekly-digest",
      workspaceId: WORKSPACE_ID,
      name: zh ? "每周客户反馈简报自动生成" : "Weekly Customer Feedback Digest",
      description: zh ? "每周一 09:00 汇总新接入的反馈记录并生成待审阅简报。" : "Compiles weekly feedback updates every Monday at 09:00 for human review.",
      triggerType: "schedule",
      scheduleCron: "0 9 * * 1",
      timezone: "Asia/Shanghai",
      paused: false,
      revision: 3,
      publishedRevision: 3,
      lastRunStatus: "succeeded",
      lastRunAt: STAMP,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
    {
      definitionId: "auto-pr-triage",
      id: "auto-pr-triage",
      workspaceId: WORKSPACE_ID,
      name: zh ? "Git Webhook 变更初筛" : "Git Webhook PR Pre-Triage",
      description: zh ? "接收企业 Git 仓库 Webhook 事件后生成待确认的影响范围摘要。" : "Generates a scope impact brief when receiving authorized Git webhook events.",
      triggerType: "webhook",
      paused: false,
      revision: 2,
      publishedRevision: 2,
      lastRunStatus: "succeeded",
      lastRunAt: STAMP,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
  ];

  const nowIso = () => new Date().toISOString();

  const devEnvs = [
    {
      id: "dev-alex-personal",
      ownerId: identity.userId,
      name: "dev-alex-personal",
      size: "standard",
      tier: "workstation",
      imageTemplateId: "skymythos-dev-runtime:v2.4.0",
      operatingSystem: "Ubuntu 24.04 LTS",
      cpuMillis: 2000,
      memoryMiB: 4096,
      storageGiB: 20,
      pvcName: "pvc-dev-alex-personal",
      storageClassName: "standard-csi",
      status: "running",
      ready: true,
      desiredState: "running",
      generation: 2,
      idleTimeoutMinutes: 60,
      lastActivityAt: STAMP,
      managedServices: [
        { id: "workspace-api", displayName: "Workspace API", port: 8081, protocol: "http", exposure: "internal", userVisible: true, health: { state: "healthy", checkedAt: nowIso() } },
        { id: "terminal", displayName: "Web Terminal", port: 17681, protocol: "websocket", exposure: "internal", userVisible: true, health: { state: "healthy", checkedAt: nowIso() } },
      ],
      createdAt: STAMP,
      updatedAt: STAMP,
    },
  ];

  const inboxItems = [
    {
      id: "inbox-prop-1",
      source: "assistant",
      kind: "proposal",
      state: "pending",
      title: zh ? "ActionProposal：发布《产品规范与接入指南 v2.2》" : "ActionProposal: Publish Product Specs & Guide v2.2",
      summary: zh ? "Platform Assistant 建议将已审校草稿发布为正式可检索版本。" : "Platform Assistant proposes publishing the reviewed draft as an indexed release.",
      createdAt: STAMP,
      sourceStatus: "waiting_approval",
      sourceRef: { conversationId: "conv-feedback-01", turnId: "turn-1", resourceId: "kb-product-specs" },
      followup: { kind: "conversation", resourceId: "conv-feedback-01" },
    },
    {
      id: "inbox-q-1",
      source: "skybot",
      kind: "question",
      state: "pending",
      title: zh ? "待确认：客户反馈周报是否纳入灰度渠道样本？" : "Question: Include canary channel samples in weekly brief?",
      summary: zh ? "SkyBot 在归因汇总前请求确认统计口径边界。" : "SkyBot requests scope confirmation before finalizing triage counts.",
      createdAt: STAMP,
      sourceStatus: "waiting_answer",
      sourceRef: { conversationId: "conv-feedback-01", turnId: "turn-1", resourceId: "conv-feedback-01" },
      followup: { kind: "conversation", resourceId: "conv-feedback-01" },
    },
  ];

  const acceptanceItems = [
    {
      itemId: "accept-1",
      workspaceId: WORKSPACE_ID,
      sourceKind: "task",
      sourceRef: {
        resourceId: "task-api-validation",
        requestId: "req-1",
        workNodeId: "unit-gate",
        executionGeneration: 1,
        artifactDigest: "sha256:abc123",
      },
      requestVersion: "1",
      viewRevision: "1",
      title: zh ? "交付待验收：配置保存接口空名称校验与单测" : "Ready for Review: Empty-name validation & unit tests",
      state: "pending",
      requestedAt: STAMP,
      observedAt: STAMP,
      freshness: "fresh",
      actions: [{ actionId: "approve", label: zh ? "通过验收" : "Approve", requiresReason: false }],
      evidence: {
        name: zh ? "14 项单元测试门禁已通过 · Git Diff 待审查" : "14 Unit Gate tests passed · Git Diff ready",
        path: "reports/unit-gate.json",
        digest: "sha256:abc123",
      },
    },
  ];

  return {
    identity,
    accountProfile,
    workspace: {
      id: WORKSPACE_ID,
      name: wsName,
      description: zh ? "用于产品协作、数字员工训练与研发交付的企业工作空间。" : "Enterprise workspace for collaboration, AI employees, and engineering delivery.",
      revision: 8,
      status: "active",
    },
    projects,
    conversations,
    conversationMessages,
    conversationEvents,
    tasks,
    flows,
    employees,
    knowledgeBases,
    marketplaceCatalog,
    coworkFlows,
    devEnvs,
    inboxItems,
    acceptanceItems,
    nowIso,
  };
}

function resolveApi(pathname, search, fx, locale) {
  const zh = locale === "zh";
  const kind = search.get("kind") || "mcp";
  const scope = search.get("scope") || "all";
  const kindAssets = fx.marketplaceCatalog[kind] ?? [];
  const filteredAssets = scope === "all" ? kindAssets : kindAssets.filter((a) => a.scope === scope);

  const availableModelsPayload = {
    models: [
      {
        modelRef: { gatewayId: "gw-enterprise", model: "claude-sonnet-4" },
        gatewayId: "gw-enterprise",
        modelId: "claude-sonnet-4",
        displayName: "Claude Sonnet 4",
        supportedProtocols: ["anthropic-messages"],
      },
      {
        modelRef: { gatewayId: "gw-enterprise", model: "gpt-5" },
        gatewayId: "gw-enterprise",
        modelId: "gpt-5",
        displayName: "GPT-5",
        supportedProtocols: ["openai-responses"],
      },
    ],
    defaultModelRef: { gatewayId: "gw-enterprise", modelId: "claude-sonnet-4", model: "claude-sonnet-4" },
  };

  const conversationDetailPayload = {
    conversation: fx.conversations[0],
    messages: fx.conversationMessages,
    turns: [],
    events: [],
    proposals: [],
    history: {
      version: 1,
      snapshotCursor: fx.conversationMessages.length,
      hasOlderMessages: false,
      hasNewerMessages: false,
      pageMessageIds: fx.conversationMessages.map((m) => m.id),
      eventsComplete: true,
    },
  };

  const taskStatusFilter = search.get("status");
  const filteredTaskQueue =
    taskStatusFilter === "paused" || taskStatusFilter === "failed"
      ? []
      : fx.tasks.map((t) => ({ source: "task", id: t.taskId, title: t.title, status: t.status, createdAt: STAMP, task: t }));

  const freshDevEnvs = fx.devEnvs.map((env) => ({
    ...env,
    managedServices: env.managedServices.map((svc) => ({
      ...svc,
      health: { state: "healthy", checkedAt: fx.nowIso() },
    })),
  }));

  const exact = {
    "/api/v1/auth/me": { data: fx.identity },
    "/api/v1/account/profile-get": { data: fx.accountProfile },
    "/api/v1/account/onboarding-get": {
      data: { version: 1, revision: 1, setupCompleted: true, tourCompleted: true, tourDismissed: true },
    },
    "/api/v1/account/onboarding-requirements": { data: { embeddingRequired: false } },
    "/api/v1/account/onboarding-hidden-connectors": { data: { ids: [] } },
    "/api/v1/account/maas-get": { data: { state: "configured", canRetry: false } },
    "/api/v1/account/login-methods": { data: { passwordEnabled: true, providers: [] } },
    "/api/v1/workspace/get": { data: fx.workspace },
    "/api/v1/chat/projects": { data: fx.projects, total: fx.projects.length },
    "/api/v1/chat/project-threads": { data: [], total: 0 },
    "/api/v1/chat/question-list": { data: [] },
    "/api/v1/task/question-list": { data: [], total: 0 },
    "/api/v1/chat/conversation-list": { data: fx.conversations },
    "/api/v1/chat/conversation-page": { data: conversationDetailPayload },
    "/api/v1/chat/conversation-get": { data: conversationDetailPayload },
    "/api/v1/chat/conversation-preparation": {
      data: {
        state: "ready",
        resources: [
          { id: "env-cloud", name: "Cloud Environment", kind: "environment", state: "ready" },
          { id: "ws-prod", name: fx.workspace.name, kind: "workspace", state: "ready" },
        ],
      },
    },
    "/api/v1/chat/role-agent-state": {
      data: { recommendations: [], sessions: [], events: [] },
    },
    "/api/v1/chat/session-repositories-list": {
      data: { repositories: [], truncated: false },
    },
    "/api/v1/chat/project-repositories": {
      data: { repositories: [], truncated: false },
    },
    "/api/v1/chat/project-repository-clone-list": {
      data: { jobs: [] },
    },
    "/api/v1/chat/event-history": { data: { events: fx.conversationEvents, throughCursor: 2, hasMore: false } },
    "/api/v1/chat/model-list-available": { data: availableModelsPayload },
    "/api/v1/chat/configuration": {
      data: {
        availableModels: availableModelsPayload,
        runtimes: [
          {
            runtimeId: "codex",
            displayName: "Codex Runtime",
            adapterPackage: "codex",
            adapterVersion: "1.0.0",
            acpProtocolVersion: 1,
            agentName: "codex",
            agentVersion: "1.0.0",
            modelProtocols: ["openai-responses", "anthropic-messages"],
            workModes: [{ id: "default", label: zh ? "标准模式" : "Default" }],
            requiresTokenCapacities: false,
          },
        ],
        runtimeConfigurations: [
          {
            runtimeId: "codex",
            availableModels: availableModelsPayload,
            configurations: [
              {
                modelRef: { gatewayId: "gw-enterprise", model: "claude-sonnet-4" },
                configuration: {
                  availableModels: availableModelsPayload,
                  workModes: [{ id: "default", label: zh ? "标准模式" : "Default" }],
                  currentWorkMode: "default",
                },
              },
            ],
          },
        ],
        workModes: [{ id: "default", label: zh ? "标准模式" : "Default" }],
        currentWorkMode: "default",
      },
    },
    "/api/v1/chat/action-mode-get": {
      data: {
        requestedMode: "smart_approval",
        userDefault: { mode: "smart_approval", revision: 1 },
        workspaceMaximum: { mode: "automatic", revision: 1 },
      },
    },
    "/api/v1/chat/inbox-list": {
      data: {
        items: fx.inboxItems,
        count: null,
        coverage: "complete",
        asOf: STAMP,
        sources: [
          { source: "skybot", status: "ok" },
          { source: "assistant", status: "ok" },
        ],
        missingItemIds: [],
      },
    },
    "/api/v1/interactions/item-list": {
      data: {
        items: fx.acceptanceItems,
        coverage: "complete",
        count: fx.acceptanceItems.length,
        knownCount: fx.acceptanceItems.length,
        asOf: STAMP,
      },
    },
    "/api/v1/task/list": { data: fx.tasks, total: fx.tasks.length },
    "/api/v1/task/queue-list": {
      data: filteredTaskQueue,
      total: filteredTaskQueue.length,
    },
    "/api/v1/flow/list": { data: fx.flows, total: fx.flows.length },
    "/api/v1/employees/list": { data: fx.employees, total: fx.employees.length },
    "/api/v1/employees/get": { data: fx.employees[1] },
    "/api/v1/employees/candidates": { data: fx.employees.slice(1) },
    "/api/v1/employees/work-records": { data: [], total: 0 },
    "/api/v1/employees/experience": { data: { items: [], nextCursor: "" } },
    "/api/v1/learning/list": { data: [] },
    "/api/v1/learning/recalls": { data: { items: [], total: 0 } },
    "/api/v1/marketplace/asset-list": { data: filteredAssets },
    "/api/v1/capability/list": { data: [] },
    "/api/v1/capability/skill-draft-list": { data: [] },
    "/api/v1/cowork/flow-summary-list": { data: fx.coworkFlows },
    "/api/v1/cowork/run-list": { data: [] },
    "/api/v1/cowork/wait-list": { data: [] },
    "/api/v1/cowork/model-list": { data: [{ key: "gw-enterprise::claude-sonnet-4", modelId: "claude-sonnet-4", pricingKnown: true }] },
    "/api/v1/serverless/function-list": { data: [] },
    "/api/v1/experience/resource-list": { data: [] },
    "/api/v1/development-environment/list": { data: freshDevEnvs },
    "/api/v1/development-environment/upgrade-plan": { data: { upgradeAvailable: false, upgradeInProgress: false } },
    "/api/v1/development-environment/resource-upgrade-plan": { data: { upgradeAvailable: false, upgradeInProgress: false } },
    "/api/v1/development-environment/artifact-installations": { data: { installations: [] } },
    "/api/v1/sandbox-runtime/options": {
      data: {
        options: [{ runtimeId: "codex", displayName: "Codex Runtime", available: true }],
        defaultRuntimeId: "codex",
      },
    },
    "/api/v1/git-connector/list-available": {
      data: [
        {
          id: "git-ent",
          name: "GitHub Enterprise",
          provider: "github",
          baseUrl: "https://github.internal.skymythos.ai",
          apiBaseUrl: "https://github.internal.skymythos.ai/api/v3",
          enabled: true,
          revision: 1,
        },
      ],
      total: 1,
    },
    "/api/v1/user-git-credential/status": {
      data: [{ connectorId: "git-ent", configured: true, needsReauthorization: false, authorizationType: "oauth", revision: 1 }],
      total: 1,
    },
    "/api/v1/user-llm-credential/status": {
      data: [{ gatewayId: "gw-enterprise", configured: true, needsReauthorization: false, revision: 1 }],
      total: 1,
    },
    "/api/v1/model/list-available": {
      data: [
        {
          gatewayId: "gw-enterprise",
          gatewayName: zh ? "企业统一 LLM Gateway" : "Enterprise LLM Gateway",
          logicalName: "Claude Sonnet 4",
          providerId: "anthropic",
          modelId: "claude-sonnet-4",
          protocol: "anthropic-messages",
          supportedProtocols: ["anthropic-messages"],
          isDefault: true,
        },
      ],
      total: 1,
    },
    "/api/v1/skybot/personal-model-keys/status": {
      data: [
        { gatewayId: "personal-deepseek", configured: true, needsReauthorization: false, revision: 1 },
      ],
    },
    "/api/v1/enterprise-connector/providers": {
      data: [
        {
          id: "lark",
          name: zh ? "飞书 / Lark 企业连接" : "Lark / Feishu Enterprise",
          active: true,
          enabled: true,
          contentGrantEnabled: true,
          capabilities: { documents: true },
        },
      ],
    },
    "/api/v1/enterprise-connector/connection-list": {
      data: [
        {
          id: "conn-lark-1",
          ownerUserId: fx.identity.userId,
          workspaceId: WORKSPACE_ID,
          provider: "lark",
          status: "active",
          updatedAt: STAMP,
        },
      ],
    },
    "/api/v1/governance/connector-list": { data: [] },
    "/api/v1/custom-connector/list": { data: [] },
    "/api/v1/custom-connector/status": { data: [] },
    "/api/v1/tracker-connectors/available": { data: [] },
    "/api/v1/tracker-connectors/credential-status": { data: [] },
    "/api/v1/workspace-access/member-directory": {
      data: [
        { userId: fx.identity.userId, displayName: fx.identity.displayName, email: fx.identity.email, role: "workspace_admin", status: "active" },
        { userId: "user-2", displayName: zh ? "陈思远" : "Siyuan Chen", email: "siyuan@skymythos-demo.internal", role: "member", status: "active" },
      ],
    },
    "/api/v1/workspace-settings/policies": { data: [] },
    "/api/v1/work/overview": {
      data: {
        items: [],
        total: 2,
        counts: { completed: 1, running: 1 },
        succeeded: 1,
        failed: 0,
        successRate: 1,
        acceptedDeliveries: 1,
        humanIntervention: 1,
        asOf: STAMP,
        from: STAMP,
        to: STAMP,
        coverage: "task_only",
      },
    },
    "/api/v1/environment-config/environments": { data: [] },
    "/api/v1/environment-config/environments/details": { data: [] },
    "/api/v1/role-im/identity/status": { data: { bound: true, provider: "lark" } },
  };

  if (exact[pathname]) return { matched: true, body: { code: "ok", ...exact[pathname] } };
  if (pathname.startsWith("/api/v1/knowledge-base/")) {
    if (pathname.includes("list")) return { matched: true, body: { code: "ok", data: fx.knowledgeBases, total: fx.knowledgeBases.length } };
    if (pathname.includes("get")) return { matched: true, body: { code: "ok", data: fx.knowledgeBases[0] } };
  }
  if (pathname.includes("knowledge")) {
    return { matched: true, body: { code: "ok", data: fx.knowledgeBases, total: fx.knowledgeBases.length } };
  }
  if (pathname.includes("/skybot/subscriptions/")) {
    const m = pathname.match(/\/skybot\/subscriptions\/[^/]+\/(openai|claude|qwen)\//);
    return { matched: true, body: { code: "ok", data: { provider: m ? m[1] : "openai", state: "signed_out" } } };
  }
  if (pathname.endsWith("/list") || pathname.includes("-list") || pathname.endsWith("/projects")) {
    return { matched: false, body: { code: "ok", data: [], total: 0 } };
  }
  return { matched: false, body: { code: "ok", data: {} } };
}

async function startStaticServer(rootDir) {
  const indexHtml = await readFile(path.join(rootDir, "index.html"));
  const server = createServer(async (req, res) => {
    const reqUrl = new URL(req.url || "/", "http://127.0.0.1");
    const relPath = decodeURIComponent(reqUrl.pathname).replace(/^\/+/, "");
    const candidate = path.resolve(rootDir, relPath);
    const inside = candidate === rootDir || candidate.startsWith(`${rootDir}${path.sep}`);
    if (relPath && inside && existsSync(candidate) && path.extname(candidate)) {
      res.writeHead(200, { "content-type": MIME_TYPES[path.extname(candidate)] ?? "application/octet-stream" });
      res.end(await readFile(candidate));
      return;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(indexHtml);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}` };
}

/**
 * 在页面上测量真实 DOM 坐标，绘制高对比度红框 + 白色描边光晕 + 序号圆标 + 深色胶囊文字签。
 */
async function annotateAndCapture(page, specs, outPath) {
  const resolved = [];
  for (const spec of specs) {
    const box = await spec.measure(page);
    if (box && box.width > 4 && box.height > 4) {
      resolved.push({ step: spec.step, label: spec.label, placement: spec.placement || "auto", box });
    } else {
      console.warn(`  [warn] annotation ${spec.step} (${spec.label}) missing box on ${outPath}`);
    }
  }

  await page.evaluate((items) => {
    const existing = document.getElementById("doc-annotation-overlay");
    if (existing) existing.remove();

    const W = window.innerWidth;
    const H = window.innerHeight;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.id = "doc-annotation-overlay";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    Object.assign(svg.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "2147483647",
      fontFamily: '"PingFang SC", "Microsoft YaHei", Inter, system-ui, sans-serif',
    });

    const defs = document.createElementNS(svgNS, "defs");
    defs.innerHTML = `<filter id="doc-badge-shadow" x="-15%" y="-20%" width="130%" height="150%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(10,16,32,0.32)" />
    </filter>`;
    svg.appendChild(defs);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = '600 12.5px "PingFang SC", "Microsoft YaHei", Inter, system-ui, sans-serif';

    const placedLabels = [];
    const overlaps = (a, b) => !(a.x + a.w + 8 < b.x || b.x + b.w + 8 < a.x || a.y + a.h + 6 < b.y || b.y + b.h + 6 < a.y);

    for (const item of items) {
      const pad = 4;
      const x = Math.max(4, item.box.x - pad);
      const y = Math.max(4, item.box.y - pad);
      const w = Math.min(W - x - 4, item.box.width + pad * 2);
      const h = Math.min(H - y - 4, item.box.height + pad * 2);

      const halo = document.createElementNS(svgNS, "rect");
      halo.setAttribute("x", String(x));
      halo.setAttribute("y", String(y));
      halo.setAttribute("width", String(w));
      halo.setAttribute("height", String(h));
      halo.setAttribute("rx", "8");
      halo.setAttribute("fill", "none");
      halo.setAttribute("stroke", "rgba(255,255,255,0.92)");
      halo.setAttribute("stroke-width", "5");
      svg.appendChild(halo);

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(w));
      rect.setAttribute("height", String(h));
      rect.setAttribute("rx", "8");
      rect.setAttribute("fill", "rgba(229, 57, 53, 0.04)");
      rect.setAttribute("stroke", "#e53935");
      rect.setAttribute("stroke-width", "2.5");
      svg.appendChild(rect);

      const textWidth = Math.ceil(ctx.measureText(item.label).width);
      const badgeW = 24 + textWidth + 16;
      const badgeH = 26;

      const candidates = [];
      if (item.placement === "bottom") {
        candidates.push({ x, y: y + h + 8 });
      } else if (item.placement === "top") {
        candidates.push({ x, y: y - badgeH - 8 });
      } else if (item.placement === "top-center") {
        candidates.push({ x: x + Math.max(220, Math.round((w - badgeW) / 2)), y: y - badgeH - 10 });
      } else if (item.placement === "left") {
        candidates.push({ x: x - badgeW - 10, y });
      } else if (item.placement === "right") {
        candidates.push({ x: x + w + 10, y });
      }
      candidates.push(
        { x, y: y - badgeH - 8 },
        { x, y: y + h + 8 },
        { x: x + w - badgeW, y: y + h + 8 },
        { x: x + w - badgeW, y: y - badgeH - 8 },
        { x: x + 10, y: y + 10 },
      );

      let chosen = null;
      for (const cand of candidates) {
        const clamped = {
          x: Math.max(8, Math.min(W - badgeW - 8, cand.x)),
          y: Math.max(8, Math.min(H - badgeH - 8, cand.y)),
          w: badgeW,
          h: badgeH,
        };
        if (!placedLabels.some((p) => overlaps(p, clamped))) {
          chosen = clamped;
          break;
        }
      }
      if (!chosen) {
        chosen = {
          x: Math.max(8, Math.min(W - badgeW - 8, x)),
          y: Math.max(8, Math.min(H - badgeH - 8, y + 8)),
          w: badgeW,
          h: badgeH,
        };
      }
      placedLabels.push(chosen);

      const g = document.createElementNS(svgNS, "g");
      g.setAttribute("filter", "url(#doc-badge-shadow)");

      const pill = document.createElementNS(svgNS, "rect");
      pill.setAttribute("x", String(chosen.x));
      pill.setAttribute("y", String(chosen.y));
      pill.setAttribute("width", String(badgeW));
      pill.setAttribute("height", String(badgeH));
      pill.setAttribute("rx", "13");
      pill.setAttribute("fill", "#141824");
      pill.setAttribute("stroke", "#ffffff");
      pill.setAttribute("stroke-width", "1.5");
      g.appendChild(pill);

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", String(chosen.x + 13));
      circle.setAttribute("cy", String(chosen.y + 13));
      circle.setAttribute("r", "9.5");
      circle.setAttribute("fill", "#e53935");
      g.appendChild(circle);

      const num = document.createElementNS(svgNS, "text");
      num.setAttribute("x", String(chosen.x + 13));
      num.setAttribute("y", String(chosen.y + 17));
      num.setAttribute("text-anchor", "middle");
      num.setAttribute("fill", "#ffffff");
      num.setAttribute("font-size", "11.5");
      num.setAttribute("font-weight", "700");
      num.textContent = String(item.step);
      g.appendChild(num);

      const txt = document.createElementNS(svgNS, "text");
      txt.setAttribute("x", String(chosen.x + 28));
      txt.setAttribute("y", String(chosen.y + 17.5));
      txt.setAttribute("fill", "#ffffff");
      txt.setAttribute("font-size", "12.5");
      txt.setAttribute("font-weight", "600");
      txt.textContent = item.label;
      g.appendChild(txt);

      svg.appendChild(g);
    }

    document.body.appendChild(svg);
  }, resolved);

  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await mkdir(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath });
}

async function unionBoxes(locators) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const loc of locators) {
    const b = await loc.boundingBox().catch(() => null);
    if (b && b.width > 0 && b.height > 0) {
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

async function boxOf(locator) {
  const count = await locator.count().catch(() => 0);
  if (!count) return null;
  return locator.first().boundingBox().catch(() => null);
}

const { server, baseUrl } = await startStaticServer(distDir);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
});

try {
  for (const locale of ["zh", "en"]) {
    const zh = locale === "zh";
    const fx = buildFixtures(locale);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 860 },
      deviceScaleFactor: 1.5,
    });
    await context.addInitScript((lang) => {
      window.localStorage.setItem("fusion-theme", "light");
      window.localStorage.setItem("fusion-language", lang);
    }, zh ? "zh-CN" : "en");

    const page = await context.newPage();
    const unhandled = new Set();

    await page.route("**/auth/enterprise/**", async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith("/organizations")) {
        return route.fulfill({ json: { organizations: fx.identity.organizations } });
      }
      if (url.pathname.endsWith("/providers")) {
        return route.fulfill({
          json: {
            providers: [
              {
                id: "lark",
                name: zh ? "飞书 / Lark 企业连接" : "Lark / Feishu Enterprise",
                active: true,
                enabled: true,
                contentGrantEnabled: true,
                capabilities: { documents: true },
              },
            ],
          },
        });
      }
      return route.fulfill({ json: {} });
    });

    await page.route("**/api/v1/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      if (url.pathname === "/api/v1/console/state-events") {
        return route.fulfill({
          status: 200,
          headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache" },
          body: 'id: state-1\nevent: state.ready\ndata: {"eventId":"state-1","type":"state.ready","resourceId":"","revision":"1","payload":{"versions":{},"modes":{}}}\n\n',
        });
      }
      if (url.pathname === "/api/v1/chat/events") {
        return route.fulfill({
          status: 200,
          headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache" },
          body: 'id: chat-1\nevent: ready\ndata: {"cursor":2}\n\n',
        });
      }
      const res = resolveApi(url.pathname, url.searchParams, fx, locale);
      if (!res.matched) unhandled.add(`${req.method()} ${url.pathname}`);
      return route.fulfill({ json: res.body });
    });

    async function go(routePath) {
      await page.goto(`${baseUrl}${routePath}`, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(700);
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
    }

    const targets = [
      {
        name: "console-overview",
        route: `/w/${WORKSPACE_ID}/chat?mode=agent&conversation=conv-feedback-01`,
        annotations: [
          {
            step: "1",
            label: zh ? "顶部模块与空间切换栏" : "Top Modules & Workspace Bar",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("header").first()),
          },
          {
            step: "2",
            label: zh ? "左侧会话与项目导航" : "Conversations & Projects Rail",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "3",
            label: zh ? "目标输入框与上下文区" : "Goal Composer & Context",
            placement: "top",
            measure: (p) => boxOf(p.locator("textarea:visible, [contenteditable='true']:visible, [role='textbox']:visible").last()),
          },
          {
            step: "4",
            label: zh ? "项目协作、工作区与记忆工具栏" : "Workspace, Memory & Live Runtime Bar",
            placement: "bottom",
            measure: (p) => unionBoxes([
              p.getByRole("button", { name: /协作|Collaborat/i }).first(),
              p.getByRole("button", { name: /运行实况|Live|Runtime/i }).first(),
            ]),
          },
        ],
      },
      {
        name: "inbox-management",
        route: `/w/${WORKSPACE_ID}/inbox`,
        annotations: [
          {
            step: "1",
            label: zh ? "待办分类筛选（待处理/待回答/待授权）" : "Inbox Category Filters",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "2",
            label: zh ? "关键词搜索与来源过滤" : "Search & Source Filters",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main input").first()),
          },
          {
            step: "3",
            label: zh ? "待人工决策与验收事项列表" : "Actionable Decisions & Approvals",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main table, main [role='table'], main .t-table").first()),
          },
        ],
      },
      {
        name: "tasks-list",
        route: `/w/${WORKSPACE_ID}/tasks`,
        annotations: [
          {
            step: "1",
            label: zh ? "任务列表与 Task Flow 切换" : "Tasks & Task Flow Nav",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "2",
            label: zh ? "新建研发任务入口" : "Create Engineering Task",
            placement: "left",
            measure: (p) => boxOf(p.locator("main").getByRole("button", { name: /新建任务|New Task|Create task/i }).first()),
          },
          {
            step: "3",
            label: zh ? "任务状态、基线分支与详情操作" : "Status, Base Branch & Actions",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main table, main .t-table").first()),
          },
        ],
      },
      {
        name: "task-flow-editor",
        route: `/w/${WORKSPACE_ID}/flows`,
        annotations: [
          {
            step: "1",
            label: zh ? "流程编排与可复用节点库切换" : "Flows & Reusable Nodes Tabs",
            placement: "bottom",
            measure: (p) => boxOf(p.locator('main [role="tablist"]').first()),
          },
          {
            step: "2",
            label: zh ? "新建 Flow Template" : "Create Flow Template",
            placement: "left",
            measure: (p) => boxOf(p.locator("main").getByRole("button", { name: /新建 Flow|New Flow|Create Flow/i }).first()),
          },
          {
            step: "3",
            label: zh ? "已发布流程版本与发起任务" : "Published Flow & Launch Task",
            placement: "right",
            measure: (p) => boxOf(p.locator("main .t-card, main [class*='card']").first()),
          },
        ],
      },
      {
        name: "employees-config",
        route: `/w/${WORKSPACE_ID}/my-ai?section=employees`,
        beforeAnnotate: async (p) => {
          const item = p.getByText(/客户反馈归因专员|Customer Feedback Analyst/i).first();
          if (await item.count()) {
            await item.click().catch(() => {});
            await p.waitForTimeout(450);
          }
        },
        annotations: [
          {
            step: "1",
            label: zh ? "已雇佣数字员工与创建入口" : "Hired Employees & Create",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "2",
            label: zh ? "开始协作与员工状态操作" : "Start Collaboration & Actions",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main").getByRole("button", { name: /开始协作|Start Collaborat/i }).first()),
          },
          {
            step: "3",
            label: zh ? "职责指令与关联技能配置" : "Role Prompt & Capabilities",
            placement: "top",
            measure: (p) => boxOf(p.locator("main textarea").first()),
          },
        ],
      },
      {
        name: "knowledge-base",
        route: `/w/${WORKSPACE_ID}/knowledge`,
        annotations: [
          {
            step: "1",
            label: zh ? "知识范围与同步/质量分析导航" : "Scopes, Sync & Quality Nav",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "2",
            label: zh ? "检索测试与新建知识库" : "Retrieval Test & New Base",
            placement: "left",
            measure: (p) => unionBoxes([
              p.locator("main").getByRole("button", { name: /检索|Search|Test/i }).first(),
              p.locator("main").getByRole("button", { name: /新建知识库|New Knowledge/i }).first(),
            ]),
          },
          {
            step: "3",
            label: zh ? "已发布知识库列表" : "Published Knowledge Bases",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main table, main .t-table").first()),
          },
        ],
      },
      {
        name: "marketplace-assets",
        route: `/w/${WORKSPACE_ID}/marketplace?type=skill`,
        annotations: [
          {
            step: "1",
            label: zh ? "四大资产分类（MCP/Skill/Flow/Node）" : "4 Asset Types (MCP/Skill/Flow/Node)",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "2",
            label: zh ? "搜索过滤与卡片/列表切换" : "Search & View Toggle",
            placement: "top",
            measure: (p) => boxOf(p.locator("main input").first()),
          },
          {
            step: "3",
            label: zh ? "新建 Skill 能力入口" : "Create New Skill",
            placement: "left",
            measure: (p) => boxOf(p.locator("main").getByRole("button", { name: /新建|New|Create/i }).first()),
          },
          {
            step: "4",
            label: zh ? "资产卡片与版本可见范围" : "Asset Card & Visibility Scope",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main .t-card, main [class*='card']").first()),
          },
        ],
      },
      {
        name: "connectors-auth",
        route: `/w/${WORKSPACE_ID}/connectors`,
        annotations: [
          {
            step: "1",
            label: zh ? "授权状态筛选页签" : "Authorization Status Tabs",
            placement: "bottom",
            measure: (p) => boxOf(p.locator('main [role="tablist"]').first()),
          },
          {
            step: "2",
            label: zh ? "前往能力市场关联 MCP" : "Browse Marketplace MCPs",
            placement: "left",
            measure: (p) => boxOf(p.locator("main").getByRole("link", { name: /Marketplace|能力市场/i }).first()),
          },
          {
            step: "3",
            label: zh ? "Git、企业连接与个人凭据列表" : "Git, Enterprise & Personal Tokens",
            placement: "bottom",
            measure: (p) => unionBoxes([
              p.locator("main").getByRole("button", { name: /管理|Manage/i }).first(),
              p.locator("main").getByRole("button", { name: /配置|Configure|管理|Manage/i }).last(),
            ]),
          },
        ],
      },
      {
        name: "automations-flows",
        route: `/w/${WORKSPACE_ID}/agents/flows`,
        annotations: [
          {
            step: "1",
            label: zh ? "流程、环境、Webhook 与轨迹导航" : "Flows, Envs, Webhooks & Traces",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "2",
            label: zh ? "新建自动化流程" : "New Automation Workflow",
            placement: "left",
            measure: (p) => boxOf(p.locator("main").getByRole("button", { name: /新建流程|New|Create/i }).first()),
          },
          {
            step: "3",
            label: zh ? "定时与事件触发流程列表" : "Scheduled & Event Workflow List",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main table, main .t-table").first()),
          },
        ],
      },
      {
        name: "dev-machine",
        route: `/w/${WORKSPACE_ID}/development-environments`,
        annotations: [
          {
            step: "1",
            label: zh ? "个人持久化开发机与运行状态" : "Personal Dev Machine & Status",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main h1, main h2").first()),
          },
          {
            step: "2",
            label: zh ? "发起会话与受控 WebTerminal" : "Start Session & WebTerminal",
            placement: "left",
            measure: (p) => boxOf(p.locator("main").getByRole("button", { name: /WebTerminal|Terminal|Web Terminal|发起会话|Session/i }).first()),
          },
          {
            step: "3",
            label: zh ? "托管服务协议健康状态表" : "Managed Services Health Table",
            placement: "top-center",
            measure: (p) => boxOf(p.locator("main table, main .t-table").last()),
          },
        ],
      },
      {
        name: "team-settings",
        route: `/w/${WORKSPACE_ID}/workspace-settings`,
        annotations: [
          {
            step: "1",
            label: zh ? "成员、用量、成本分析与配额导航" : "Members, Usage, Cost & Quotas",
            placement: "right",
            measure: (p) => boxOf(p.locator("aside").first()),
          },
          {
            step: "2",
            label: zh ? "工作空间名称与基本信息表单" : "Workspace Identity & Settings Form",
            placement: "bottom",
            measure: (p) => boxOf(p.locator("main input").first()),
          },
          {
            step: "3",
            label: zh ? "保存工作空间设置" : "Save Workspace Settings",
            placement: "left",
            measure: (p) => boxOf(p.locator("main").getByRole("button", { name: /保存|Save/i }).first()),
          },
        ],
      },
    ];

    console.log(`\n=== Capturing ${locale} screenshots ===`);
    for (const t of targets) {
      await go(t.route);
      if (t.beforeAnnotate) await t.beforeAnnotate(page);
      const outPath = path.join(outBase, locale, `${t.name}.png`);
      await annotateAndCapture(page, t.annotations, outPath);
      const bannerText = await page.locator("body").innerText().catch(() => "");
      const hasErr = /无法读取|加载失败|暂不可用|无法载入|状态未知|同步协议已更新|当前页面暂时无法显示|版本\/分页字段无效|could not be loaded|Failed to load|unavailable|Unable to load|Status unavailable|could not be displayed|synchronization protocol|pagination field is invalid/i.test(bannerText);
      console.log(`  captured ${locale}/${t.name}.png (errBanner=${hasErr})`);
    }
    if (unhandled.size) {
      console.log(`  unhandled API routes (${locale}):`, [...unhandled].join(", "));
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
