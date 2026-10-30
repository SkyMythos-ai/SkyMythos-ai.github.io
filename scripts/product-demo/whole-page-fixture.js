import { QueryClient } from '@tanstack/react-query';
import { operationMap } from '__PRODUCT__/src/api/operation-map.ts';
import { stateTopics } from '__PRODUCT__/src/lib/console-state/query-registry.ts';
const fixture = __FIXTURE__;
export function createWholePageFixture() {
const operation = { ...fixture.operation, sourceDetails: [fixture.source] };
const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } } });
const requests = []; const unknown = []; const writes = []; const simulatedWrites = [];
window.__reference = { fixture: true, requests, unknown, writes, simulatedWrites };
const failWrite = async () => { writes.push('blocked'); throw new Error('只读参照禁止业务写入'); };
const scope = fixture.scope;
const timestamp = new Date().toISOString();
const profile = { ...fixture.identity, language: 'zh-CN', theme: 'light', timezone: 'Asia/Shanghai', revision: 1, userRevision: 1 };
const onboarding = { version: 1, revision: 1, setupCompleted: true, tourCompleted: true, tourDismissed: false };
const git = [{ id: 'github', name: 'GitHub', provider: 'github', baseUrl: 'https://github.com', enabled: true, revision: 1 }];
const models = [{ gatewayId: 'example-models', gatewayName: '示例模型服务', gatewayBaseUrl: 'https://models.example.test/v1', logicalName: 'example-model' }];
const environment = { id: 'example-environment', ownerId: scope.ownerId, name: '示例工作环境', size: 'standard', imageTemplateId: 'ubuntu-24.04', operatingSystem: 'linux', cpuMillis: 1000, memoryMiB: 2048, storageGiB: 50, status: 'running', desiredState: 'running', ready: true, generation: 1, managedServices: [{ id: 'workspace-api', displayName: '会话服务', port: 8080, protocol: 'http', exposure: 'internal', userVisible: true, health: { state: 'healthy', checkedAt: timestamp } }, { id: 'terminal', displayName: '终端', port: 8081, protocol: 'http', exposure: 'internal', userVisible: true, health: { state: 'healthy', checkedAt: timestamp } }], createdAt: timestamp, updatedAt: timestamp, idleTimeoutMinutes: 60, lastActivityAt: timestamp, backupStatus: 'ready', legacyMigrationStatus: 'not_applicable' };
const project = { id: 'example-project', userId: scope.ownerId, workspaceId: scope.workspaceId, name: '发布前检查', kind: 'project', mainConversationId: 'example-main', rootPath: '/workspace/example', instructions: '仅检查示例配置与回滚条件，不修改生产系统。', revision: 1, archived: false, createdAt: timestamp, updatedAt: timestamp };
const complete = false;
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
read('model.listAvailable', models); read('user.llmCredential.status', [{ gatewayId: 'example-models', configured: true, revision: 1 }]);
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

const identity = { ...fixture.identity, workspaceMemberships: fixture.identity.workspaceMemberships.map(value => ({...value, role: 'workspace_admin'})) };
read('auth.me', identity);
read('account.profile.get', () => ({...profile, theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'}));
read('developmentEnvironment.list', () => [{...environment, managedServices: environment.managedServices.map(service => ({...service, health: {...service.health, checkedAt: new Date().toISOString()}}))}]);
const knowledgeDefaults = {organizationId:'reference-org', ownerWorkspaceId:scope.workspaceId, ownerSubjectId:scope.ownerId, scope:'workspace', status:'active', revision:1, createdBy:scope.ownerId, createdAt:timestamp, updatedAt:timestamp};
// Fictional directory examples; original KnowledgeHomePage owns filtering and scope rendering.
read('knowledgeBase.listWorkspace', [
 {...knowledgeDefaults,id:'example-runbook',name:'团队发布手册',description:'发布配置、回滚步骤与检查记录，供后续任务查阅。'},
 {...knowledgeDefaults,id:'example-acceptance',name:'交付验收标准',description:'结果核对清单、验收要求与待确认事项。'},
 {...knowledgeDefaults,id:'example-customer-answers',name:'客户答复规范',description:'常见问题、产品用语与经过复核的答复说明。'},
]);
read('knowledgeBase.listAccessible', [{...knowledgeDefaults,id:'example-product-guide',ownerWorkspaceId:'example-product-team',name:'产品说明',description:'产品团队共享的功能说明、使用边界与操作指引。'}]);
read('experience.resource.list', []);
read('workspace.embeddingModel.listAvailable', [{gatewayId:'example-models', gatewayName:'示例模型服务', logicalName:'example-embedding'}]);
read('admin.workspaceEmbeddingCredential.status', [{gatewayId:'example-models',configured:true,revision:1}]);
dataByPath.set('/api/v1/voice/capabilities', {audio:false});
dataByPath.set('/api/v1/chat/project-memories', []);
let detail = {conversation:{id:project.mainConversationId, userId:scope.ownerId, workspaceId:scope.workspaceId, projectId:project.id, projectRole:'main', runtimeId:'codex', type:'agent_session', title:'发布准备检查',createdAt:timestamp,updatedAt:timestamp}, messages:[],turns:[],events:[],proposals:[]};
read('chat.conversation.get', () => structuredClone(detail));
read('chat.conversation.list', () => [detail.conversation]);
const subscriptions = new Set();
const stateStops = new Set();
const encoder = new TextEncoder();
let learning = null;
const api = {
 formationSources: async ({page=1,size=10}) => ({items:[fixture.source],total:1,page,size}),
 formations: async () => ({items:learning ? [learning] : [],total:learning?1:0,page:1,size:5}),
 learning: async () => learning,
 form: async ({goal}) => {simulatedWrites.push({path:'formation.form',scope:'memory'}); learning={...fixture.operation,goal,sourceDetails:[fixture.source],status:'running',stage:'分析所选经验',plan:undefined};return structuredClone(learning)},
 confirmFormation: failWrite, retry: failWrite,
};
const report = '## 发布准备检查报告\n\n已核对发布资料，检查结果如下：\n\n- 配置清单完整，关键参数已逐项核对。\n- 回滚步骤齐全，验证命令与权限要求已列出。\n- 发布窗口和验收负责人仍需人工确认。\n\n报告：`artifacts/report.md`\n\n**检查完成，等待人工验收。**';
const toolExamples = [
 {id:'read',title:'读取发布清单',kind:'read_file',start:5500,end:8500,input:'release/checklist.md',output:'配置清单：已提供\n回滚步骤：已提供\n验收负责人：待确认\n发布窗口：待确认'},
 {id:'rollback',title:'检查回滚配置',kind:'command',start:9000,end:12000,input:'release-check --dry-run',output:'PASS 配置完整\nPASS 回滚条件\n待人工确认发布窗口'},
 {id:'report',title:'整理检查报告',kind:'write_file',start:12500,end:15000,input:'artifacts/report.md',output:'检查结果已整理\n报告已生成：artifacts/report.md'},
];
const timeline = [];
const add = (at, type, data) => timeline.push({at,type,data});
add(4400,'agent.acp',{kind:'message',text:'收到，我会核对发布清单、检查回滚条件，再整理可复核的结果。'});
for(const tool of toolExamples){
 add(tool.start,'agent.acp',{kind:'tool',toolId:tool.id,title:tool.title,status:'running',data:{kind:tool.kind,input:tool.input}});
 for(let part=1;part<=5;part++)add(tool.start+(tool.end-tool.start)*part/6,'agent.acp',{kind:'tool',toolId:tool.id,title:tool.title,status:'running',data:{kind:tool.kind,input:tool.input,content:tool.output.slice(0,Math.ceil(tool.output.length*part/5))}});
 add(tool.end,'agent.acp',{kind:'tool',toolId:tool.id,title:tool.title,status:'completed',data:{kind:tool.kind,input:tool.input,content:tool.output}});
}
for(let n=0;n<report.length;n+=8)add(16000+n/report.length*4000,'agent.acp',{kind:'message',text:report.slice(n,n+8)});
add(20500,'agent.acp',{kind:'completed'}); add(20600,'turn.succeeded',{status:'succeeded'});
timeline.sort((a,b)=>a.at-b.at);
let emitted=0;
const sendPath=operationMap['chat.send'].path;
function advance(time){
 if(learning?.status==='running' && time>=14500){learning={...fixture.operation,goal:learning.goal,sourceDetails:[fixture.source]};void client.invalidateQueries();}
 if(!detail.turns.length)return;
 while(emitted<timeline.length&&timeline[emitted].at<=time){
   const item=timeline[emitted++];
   const event={cursor:emitted,sequence:emitted,turnId:'demo-turn',type:item.type,data:item.data,occurredAt:new Date(Date.parse(timestamp)+item.at).toISOString()};
   detail.events.push(event);
   if(item.type==='turn.succeeded'){
     detail.turns[0]={...detail.turns[0],status:'succeeded',revision:3,nextEventSequence:emitted+1,text:report};
     detail.messages.push({id:'demo-answer',conversationId:detail.conversation.id,turnId:'demo-turn',role:'assistant',text:report,createdAt:event.occurredAt});
   }
   for(const subscription of subscriptions)if(event.cursor>subscription.cursor){subscription.controller.enqueue(encoder.encode(`id: ${event.cursor}\ndata: ${JSON.stringify({payload:event})}\n\n`));subscription.cursor=event.cursor;}
 }
}
function install(){
 window.__reference={fixture:true,requests,unknown,writes,simulatedWrites,getTurnStatus:()=>detail.turns.at(-1)?.status??'idle',getFormationStatus:()=>learning?.status??'idle'};
 window.fetch=async(input,init={})=>{
  const url=new URL(input instanceof Request?input.url:String(input),location.origin);
  const method=init.method || (input instanceof Request?input.method:'GET');
  const body=init.body?JSON.parse(String(init.body)):{};
  const args={...Object.fromEntries(url.searchParams),...body}; requests.push({path:url.pathname,method});
  if(url.origin!==location.origin){unknown.push(url.href);throw new Error('Product demo blocks external network')}
  if(url.pathname==='/api/v1/console/state-events'){
   let controller,timer,closed=false;
   const stop=()=>{if(closed)return;closed=true;clearInterval(timer);stateStops.delete(stop);try{controller.close()}catch{}};
   const stream=new ReadableStream({start(value){controller=value;stateStops.add(stop);const frame={type:'state.ready',eventId:'example-state-ready',resourceId:scope.workspaceId,revision:'1',payload:{workspaceId:scope.workspaceId,epoch:'example-state',configEpoch:'example-config',versions:Object.fromEntries(stateTopics.map(topic=>[topic,'1'])),modes:Object.fromEntries(stateTopics.map(topic=>[topic,'legacy'])),topics:[]}};controller.enqueue(encoder.encode(`event: state.ready\nid: example-state-ready\ndata: ${JSON.stringify(frame)}\n\n`));timer=setInterval(()=>{if(!closed)controller.enqueue(encoder.encode(': example heartbeat\n\n'))},10000)},cancel:stop});
   return new Response(stream,{headers:{'Content-Type':'text/event-stream'}});
  }
  if(url.pathname==='/api/v1/chat/events'){
   let subscription;
   const stream=new ReadableStream({start(controller){const headers=new Headers(init.headers);subscription={controller,cursor:Number(headers.get('Last-Event-ID')||0)};subscriptions.add(subscription);for(const event of detail.events)if(event.cursor>subscription.cursor){controller.enqueue(encoder.encode(`id: ${event.cursor}\ndata: ${JSON.stringify({payload:event})}\n\n`));subscription.cursor=event.cursor;}},cancel(){subscriptions.delete(subscription)}});
   return new Response(stream,{headers:{'Content-Type':'text/event-stream'}});
  }
  if(url.pathname===sendPath&&method==='POST'){
    if(args.workspaceId!==scope.workspaceId||args.conversationId!==detail.conversation.id||!args.text?.trim())throw new Error('Invalid example conversation');
    simulatedWrites.push({path:sendPath,scope:'memory'});
    detail.messages=[{id:'demo-request',conversationId:detail.conversation.id,role:'user',text:args.text,createdAt:timestamp}];
    detail.turns=[{id:'demo-turn',conversationId:detail.conversation.id,workspaceId:scope.workspaceId,userId:scope.ownerId,messageId:'demo-request',status:'running',revision:2,nextEventSequence:1,createdAt:timestamp,updatedAt:timestamp}];
    return envelope(structuredClone(detail));
  }
  const localReadPost=method==='POST'&&['/api/v1/observability/task-context','/api/v1/observability/task-content'].includes(url.pathname);
  if(method!=='GET'&&!localReadPost){writes.push({path:url.pathname,method});throw new Error('Product demo blocks business writes')}
  if(!dataByPath.has(url.pathname)){unknown.push(url.pathname);throw new Error(`Product demo has no read fixture: ${url.pathname}`)}
  const value=dataByPath.get(url.pathname);const data=typeof value==='function'?value(args):value;
  return url.pathname==='/auth/enterprise/providers'?new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}}):envelope(data);
 };
 window.XMLHttpRequest=class{open(){throw new Error('Product demo blocks network')}};
 window.WebSocket=class{constructor(){throw new Error('Product demo blocks network')}};
 window.EventSource=class{constructor(){throw new Error('Product demo blocks network')}};
 client.setQueryData(['auth','me'],identity);client.setQueryData(['account','profile'],{...profile,theme:document.documentElement.dataset.theme==='dark'?'dark':'light'});client.setQueryData(['account','onboarding',scope.ownerId],onboarding);
}
function envelope(data){return new Response(JSON.stringify({code:'ok',info:'',data,total:Array.isArray(data)?data.length:undefined}),{headers:{'Content-Type':'application/json'}})}
function dispose(){for(const stop of [...stateStops])stop();for(const subscription of subscriptions)try{subscription.controller.close()}catch{}subscriptions.clear();client.clear()}
return {client,api,scope,fixture,project,install,advance,dispose,settle:()=>client.refetchQueries({type:'active'})};
}
