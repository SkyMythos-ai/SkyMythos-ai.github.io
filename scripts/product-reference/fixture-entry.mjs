// 独立产品参照：不导入官网renderer/model；所有业务读取均为内存虚构数据。
__IMPORTS__
const h = React.createElement;
const fixture = __FIXTURE__;
const options = new URLSearchParams(location.search);
const mode = options.get('mode') || 'poc';
const frame = options.get('frame') || 'result';
const operation = { ...fixture.operation, sourceDetails: [fixture.source] };
const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } } });
const requests = []; const unknown = []; const writes = [];
window.__reference = { fixture: true, mode, frame, requests, unknown, writes };
const failWrite = async () => { writes.push('blocked'); throw new Error('只读参照禁止业务写入'); };
const scope = fixture.scope;
const timestamp = '2026-10-24T00:00:00Z';
const profile = { ...fixture.identity, language: 'zh-CN', theme: 'light', timezone: 'Asia/Shanghai', revision: 1, userRevision: 1 };
const onboarding = { version: 1, revision: 1, setupCompleted: true, tourCompleted: true, tourDismissed: false };
const git = [{ id: 'github', name: 'GitHub', provider: 'github', baseUrl: 'https://github.com', enabled: true, revision: 1 }];
const models = [{ gatewayId: 'example-models', gatewayName: '示例模型服务', gatewayBaseUrl: 'https://models.example.test/v1', logicalName: 'example-model' }];
const environment = { id: 'example-environment', ownerId: scope.ownerId, name: '示例工作环境', size: 'standard', imageTemplateId: 'ubuntu-24.04', operatingSystem: 'linux', cpuMillis: 1000, memoryMiB: 2048, storageGiB: 50, status: 'running', desiredState: 'running', ready: true, generation: 1, managedServices: [{ id: 'workspace-api', displayName: '会话服务', port: 8080, protocol: 'http', exposure: 'internal', userVisible: true, health: { state: 'healthy', checkedAt: timestamp } }, { id: 'terminal', displayName: '终端', port: 8081, protocol: 'http', exposure: 'internal', userVisible: true, health: { state: 'healthy', checkedAt: timestamp } }], createdAt: timestamp, updatedAt: timestamp, idleTimeoutMinutes: 60, lastActivityAt: timestamp, backupStatus: 'ready', legacyMigrationStatus: 'not_applicable' };
const project = { id: 'example-project', userId: scope.ownerId, workspaceId: scope.workspaceId, name: '发布前检查', kind: 'project', mainConversationId: 'example-main', rootPath: '/workspace/example', instructions: '仅检查示例配置与回滚条件，不修改生产系统。', revision: 1, archived: false, createdAt: timestamp, updatedAt: timestamp };
const complete = frame !== 'start';
const delivery = { id: 'example-delivery', digest: 'example-evidence-digest', threadId: 'example-thread', turnId: 'example-turn', requirementsRevision: 1, executionGeneration: 1, executionStatus: 'succeeded', verification: [{ name: '配置与回滚路径核对', status: 'passed', evidenceRef: 'example/check-results.md' }], outputRef: 'example/check-results.md', createdAt: timestamp };
const thread = { id: 'example-thread', workspaceId: scope.workspaceId, projectId: project.id, parentConversationId: project.mainConversationId, name: 'example-check', title: '配置与回滚检查', objective: '核对示例发布的配置、回滚路径与权限，输出待处理问题。', acceptanceCriteria: ['检查结果可复核', '执行完成后由成员人工验收'], runtimeId: 'codex', modelRef: { gatewayId: 'example-models', model: 'example-model' }, context: { project, memories: [] }, repositories: [], rootPath: '/workspace/example/check', state: 'active', reviewStatus: 'pending', revision: 1, activeTurnCount: complete ? 0 : 1, lastTurnStatus: complete ? 'succeeded' : 'running', requirementsRevision: 1, executionGeneration: 1, overview: { executionState: complete ? 'succeeded' : 'running', reviewState: 'pending', executionGeneration: 1, requirementsRevision: 1, ...(complete ? { latestDelivery: delivery } : {}) }, createdAt: timestamp, updatedAt: timestamp };
const conversation = id => {
  const child = id === thread.id;
  const text = child ? (complete ? '已完成示例配置与回滚路径核对。检查结果已整理，等待人工验收。' : '正在核对示例配置与回滚路径。发现的问题将单独列出，不修改生产系统。') : '请核对本次发布准备情况，整理检查结果与待处理问题；执行完成后等待人工验收。';
  return { conversation: { id, userId: scope.ownerId, workspaceId: scope.workspaceId, projectId: project.id, ...(child ? { threadId: thread.id, parentConversationId: project.mainConversationId } : {}), runtimeId: 'codex', type: 'agent_session', title: child ? thread.title : '发布准备协作', createdAt: timestamp, updatedAt: timestamp }, messages: [{ id: `${id}-message`, conversationId: id, ...(child ? { turnId: 'example-turn' } : {}), role: child ? 'assistant' : 'user', text, createdAt: timestamp }], turns: child ? [{ id: 'example-turn', conversationId: id, workspaceId: scope.workspaceId, userId: scope.ownerId, messageId: `${id}-message`, status: complete ? 'succeeded' : 'running', revision: 1, createdAt: timestamp, updatedAt: timestamp }] : [] };
};
const workbenchScope = { key: 'example-scope', workspaceId: scope.workspaceId, projectId: project.id, parentConversationId: project.mainConversationId, runtimeGeneration: 1 };
const zeroDuration = { milliseconds: 0, openSince: [], unknownIntervals: 0, status: 'known' };
const cost = { currency: 'USD', status: 'unknown', knownAmountUsd: null, knownSamples: 0, unknownSamples: 0, source: 'runtime_reported' };
const analytics = { from: null, to: null, observedAt: timestamp, cost, acceptedCost: cost, tokens: { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, status: 'unknown' }, cycle: { queued: zeroDuration, executing: zeroDuration, blocked: zeroDuration, awaitingReview: zeroDuration }, threads: [] };
const snapshot = { schemaVersion: 1, scope: workbenchScope, watermark: 0, sourceCursor: 0, observedAt: timestamp, stale: false, threads: [thread], workItems: [], capacity: { known: false, limit: 0, live: 0, busy: 0, starting: 0, waiting: 0, available: 0, projectBusy: 0, projectQueued: 0, source: 'unknown', observedAt: timestamp }, analytics };
const dataByPath = new Map();
function read(alias, value) {
  const definition = operationMap[alias];
  if (!definition) throw new Error(`参照读取别名不存在 ${alias}`);
  dataByPath.set(definition.path, value);
}
read('auth.me', fixture.identity); read('account.profile.get', profile); read('account.onboarding.get', onboarding);
read('account.onboarding.hiddenConnectors', { ids: [] });
read('developmentEnvironment.list', [environment]); read('notification.list', []);
read('gitConnector.listAvailable', git); read('user.gitCredential.status', [{ connectorId: 'github', configured: true, revision: 3, updatedAt: timestamp }]);
read('model.listAvailable', models); read('user.llmCredential.status', [{ gatewayId: 'example-models', configured: false, revision: 1 }]);
read('enterpriseConnector.connection.list', []); read('governance.connector.list', []); read('customConnector.list', []); read('user.customConnector.status', []);
read('marketplace.asset.list', []); read('capability.list', []);
// 其余读取使用明确路径；不是未知请求的通配兜底。
const directReads = {
  '/auth/enterprise/providers': { providers: [] },
  '/api/v1/employees/list': [],
  '/api/v1/task/list': [],
  '/api/v1/serverless/function-list': [],
  '/api/v1/chat/session-repository-clone-list': { jobs: [] },
  '/api/v1/chat/session-repositories-list': { repositories: [], truncated: false },
  '/api/v1/observability/runs-resolve-task': { runId: 'example-run' },
  '/api/v1/observability/task-context': {},
  '/api/v1/observability/task-content': { taskId: 'example-turn', traceId: '', availability: 'unavailable', items: [], warnings: [] },
  '/api/v1/chat/project-repositories': { repositories: [], truncated: false },
  '/api/v1/chat/projects': [project],
  '/api/v1/chat/project-threads': [thread],
  '/api/v1/chat/project-thread': thread,
  '/api/v1/chat/conversation-preparation': { state: 'ready', resources: [{ id: 'environment', kind: 'environment', name: 'environment', state: 'ready' }, { id: 'workspace', kind: 'workspace', name: 'workspace', state: 'ready' }] },
  '/api/v1/role-im/identity/status': { bound: false },
  '/api/v1/role-im/runs': [],
};
for (const [key, value] of Object.entries(directReads)) dataByPath.set(key, value);
read('chat.conversation.get', input => conversation(input.conversationId));
read('chat.conversation.list', [conversation(project.mainConversationId).conversation]);
read('chat.actionMode.get', { userDefault: { mode: 'smart_approval', revision: 1 }, workspaceMaximum: { mode: 'automatic', revision: 1 }, requestedMode: 'smart_approval', effectiveMode: 'smart_approval', limitedByWorkspace: false, policyRevision: 'example' });
read('chat.model.listAvailable', { models: [{ modelRef: { gatewayId: 'example-models', model: 'example-model' }, displayName: '示例模型' }], defaultModelRef: { gatewayId: 'example-models', model: 'example-model' } });
read('agentRuntime.catalog', [{ runtimeId: 'codex', displayName: 'Codex', adapterPackage: 'example-fixture', adapterVersion: '1', acpProtocolVersion: 1, agentName: '示例执行环境', agentVersion: '1', modelProtocols: ['openai-responses'], workModes: [{ id: 'default', name: '默认' }] }]);
read('chat.configuration', { workModes: [{ id: 'default', name: '默认' }], currentWorkMode: 'default' });
read('chat.roleAgent.state', { recommendations: [], sessions: [], events: [] });
read('chat.question.list', []);
read('chat.project.workbench.snapshot', snapshot);
read('chat.project.workbench.events', { schemaVersion: 1, scope: workbenchScope, events: [], nextCursor: 0, watermark: 0, resetRequired: false });
read('chat.project.workbench.analytics', analytics);
read('chat.project.thread.dispatch.list', []);
window.fetch = async (input, init = {}) => {
  const url = new URL(input instanceof Request ? input.url : String(input), location.origin);
  const body = init.body ? JSON.parse(String(init.body)) : {};
  const args = { ...Object.fromEntries(url.searchParams), ...body };
  requests.push({ path: url.pathname, method: init.method || 'GET' });
  if (url.pathname === '/api/v1/chat/events') return new Response(new ReadableStream(), { headers: { 'Content-Type': 'text/event-stream' } });
  if (!dataByPath.has(url.pathname)) { unknown.push(url.pathname); throw new Error(`参照未定义或禁止写入 ${url.pathname}`); }
  const value = dataByPath.get(url.pathname); const data = typeof value === 'function' ? value(args) : value;
  return new Response(JSON.stringify(url.pathname === '/auth/enterprise/providers' ? data : { code: 'ok', info: '', data, total: Array.isArray(data) ? data.length : undefined }), { headers: { 'Content-Type': 'application/json' } });
};
client.setQueryData(['auth', 'me'], fixture.identity);
client.setQueryData(['account', 'profile'], profile);
client.setQueryData(['account', 'onboarding', scope.ownerId], onboarding);
const api = { formationSources: async () => ({ items: [fixture.source], total: 1, page: 1, size: 10 }), learning: async () => frame === 'middle' ? { ...operation, status: 'running', stage: '分析经验来源', plan: undefined } : operation, formations: async () => ({ items: [operation], total: 1, page: 1, size: 5 }), form: failWrite, confirmFormation: failWrite, retry: failWrite };
let page;
if (mode === 'poc') page = h(MemoryRouter, null, h(FormationPreview, { operation, pending: false, enabled: true, onConfirm: failWrite }));
else {
  const initial = mode === 'methods' ? `/w/reference/my-ai?${frame === 'start' ? 'create=experience' : 'operation=example-operation&operationEmployee=root'}` : mode === 'management' ? '/w/reference/connectors' : `/w/reference/chat?project=${project.id}&conversation=${project.mainConversationId}&panel=threads&thread=${thread.id}`;
  page = h(MemoryRouter, { initialEntries: [initial] }, h(Routes, null, h(Route, { path: '/w/:workspaceId', element: h(ProductShell) }, h(Route, { path: 'my-ai', element: h(FormationPage, { scope, api }) }), h(Route, { path: 'connectors', element: h(ConnectorsPage) }), h(Route, { path: 'chat', element: h(WorkspaceChatPage) }))));
}
createRoot(document.getElementById('root')).render(h(QueryClientProvider, { client }, h(ConsolePreferencesProvider, null, page)));
