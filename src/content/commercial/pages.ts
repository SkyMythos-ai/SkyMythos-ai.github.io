import { basePath } from "@/lib/site";
import type { CommercialSection } from "@/lib/commercial-routes";

export interface ProductImage { src: string; width: number; height: number }
export type ProductImages = Record<"workbench" | "delivery" | "methods" | "management", ProductImage>;
export interface CommercialPage {
  path: string;
  label: string;
  title: string;
  description: string;
  section: CommercialSection;
  body: string;
  needsLifecycle?: boolean;
}

const docsRoot = `${basePath}/zh/docs/`;

function figure(image: ProductImage, alt: string, caption: string) {
  const { src, width, height } = image;
  return `<figure class="page-figure"><a href="${src}" data-zoom aria-label="查看原图：${alt}"><img src="${src}" width="${width}" height="${height}" alt="${alt}" loading="lazy" decoding="async"><span class="zoom-hint">查看原图 ↗</span></a><figcaption>${caption}</figcaption></figure>`;
}

function intro(title: string, lede: string, secondaryHref: string, secondaryLabel: string) {
  return `<section class="page-intro wrap"><h1>${title}</h1><p class="page-lede">${lede}</p><div class="page-actions"><a class="button" href="#contact" data-contact>预约演示<span aria-hidden="true">↗</span></a><a class="button button-secondary" href="${secondaryHref}">${secondaryLabel}<span aria-hidden="true">↗</span></a></div></section>`;
}

function section(title: string, body: string, id = '') {
  return `<section class="page-section wrap"${id ? ` id="${id}"` : ''}><div class="page-section-heading"><h2>${title}</h2></div>${body}</section>`;
}

function steps(items: [string, string][]) {
  return `<ol class="page-steps">${items.map(([title, text]) => `<li><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol>`;
}

function related(items: [string, string, string][]) {
  return section('继续了解', `<div class="related-links">${items.map(([href, title, text]) => `<a href="${href}"><strong>${title}</strong><span>${text}</span></a>`).join('')}</div>`);
}

function doc(slug: string) {
  return `${docsRoot}${slug}/`;
}

// 只生成正文与页面元数据；导航、联系表单及生命周期播放器由站点外壳负责。
export function createPages({ base, lifecycle, productImages }: {
  base: string;
  lifecycle: string;
  productImages: ProductImages;
}): CommercialPage[] {
  const owned = (path: string) => `${base}${path}`;
  return [
    {
      path: 'product/',
      label: '产品总览',
      title: '产品总览',
      description: '了解 SkyMythos 如何组织工作交付、方法复用与使用治理，以及这些能力之间的关系。',
      section: 'product',
      body: intro('把分散的 AI 能力，组织成企业的工作能力。', 'SkyMythos 是企业 AI 工作平台。围绕一项明确的工作，连接 Agent、知识、方法和工具，让团队既能审阅这次交付，也能为下一次保留可用的依据。', owned('product/work-delivery/'), '了解工作交付')
        + section('一个平台，处理相互关联的三件事', `<div class="page-columns"><div><h3>工作有结果，方法有来源，使用有范围。</h3><p>交付能力把目标、上下文和执行证据组织在一起；复用能力将经过确认的知识、Skill 与流程带入后续工作；治理能力约束谁能使用哪些资源，并在可见范围内解释运行与消耗。</p><p>它们不是交付结束后才依次开启的三个阶段。授权贯穿执行和复用，人的验收始终独立于 Agent 的完成状态。</p></div><div class="page-callout"><h3>从你正在做的工作开始</h3><p>日常协作可从对话进入；仓库中的明确研发目标可使用任务；重复运行的工作可使用当前部署支持的自动化入口。不同入口共享部分能力，但不因此变成同一种运行对象。</p></div></div>`
          + figure(productImages.workbench, '当前 SkyMythos 工作台，展示主会话、并排线程与真实产品导航', '真实产品工作台 · 本地示例数据，非实时运行；不代表所有模型与运行工具组合均已验收。'))
        + section('按你正在评估的问题，深入了解产品', `<div class="page-grid"><a class="page-card" href="${owned('product/work-delivery/')}"><h3>工作交付</h3><p>目标、资料、执行与检查如何对应起来？交付后，团队依据什么决定是否接受？</p><span>查看执行与审阅机制 ↗</span></a><a class="page-card" href="${owned('product/methods/')}"><h3>方法复用</h3><p>一次工作里的经验，怎样成为有来源、可维护且按范围复用的方法？</p><span>查看资产与形成过程 ↗</span></a><a class="page-card" href="${owned('product/governance/')}"><h3>使用治理</h3><p>哪些使用可以看见？费用如何理解？模型策略在哪些入口生效？</p><span>查看治理与适用边界 ↗</span></a><a class="page-card" href="${owned('product/architecture/')}"><h3>企业架构</h3><p>工作入口、运行环境、模型服务和企业系统各承担什么责任？</p><span>查看系统与接入关系 ↗</span></a></div>`)
        + section('先证明一项工作，再讨论扩大采用', `<div class="article-prose"><p>评估不必从整理全部企业资料开始。选一项范围清楚、结果容易核对的工作，准备必要授权，检查真实产物与验证记录，再确认其中是否存在值得复用的方法。</p><p>当团队希望扩大使用时，再逐项核对共享范围、维护责任、运行可见性和费用口径。界面截图和示例故事帮助理解产品，不替代目标部署中的实际业务验收。</p></div>`)
        + related([[owned('solutions/'), '选择采用场景', '从工作目标、输入与验收条件比较适合的起点。'], [owned('resources/how-it-works/'), '看完整工作案例', '沿同一需求理解人工确认、交付和后续方法引用。']]),
    },
    {
      path: 'product/work-delivery/',
      label: '工作交付',
      title: '工作交付',
      description: '把目标、资料、执行与验证组织成可审阅的交付，理解任务、证据及人工验收的边界。',
      section: 'product',
      body: intro('交付不只是一句“已完成”。', '将工作目标、已有资料与执行过程放在同一条可核对的路径上。团队查看变更、检查与产物，再决定是否接受结果，而不是只依赖 Agent 的最后一条回复。', owned('solutions/engineering/'), '查看研发交付场景')
        + section('一次明确工作，需要哪些对象', `<div class="page-columns"><div><h3>输入决定这次要完成什么</h3><p>任务要求记录目标、不应改变的行为与验收条件。按权限添加知识库资料、Markdown 或当前部署启用的来源；研发任务还需要已授权的仓库、基线分支和流程输入。</p><p>对话、研发 Task 与 Automation Run 是不同入口。这里的节点、变更与 PR/MR 审阅，主要说明研发任务的交付路径，不能套用到全部日常会话。</p></div><div><h3>证据说明实际发生了什么</h3><p>任务详情将节点进度、会话、上下文、变更、冻结修订、产物和 Trace 分开呈现。检查时先对应同一节点与执行尝试，再判断证据是否支持交付说明。</p><p>流程与能力的发布版本为执行提供依据；中间节点的冻结文件与最终分支代表不同时间点，不能相互替代。</p></div></div>`)
        + section('从目标到审阅，让每一步有判断依据', steps([
          ['明确目标和验收条件', '缩小工作范围，写清输入、约束和预期结果。先确认资料版本、仓库与分支，而不是让执行自己猜测业务边界。'],
          ['准备并检查执行条件', '选择适用的已发布流程或智能编排，补齐必填输入。创建检查通过后再准备运行环境；授权失败与执行失败分别处理。'],
          ['跟随进度，核对执行证据', '查看当前节点与等待输入的问题。需要定位偏差时，结合上下文、变更和 Trace，而不是只阅读结果摘要。'],
          ['审阅产物，保留人的决定', '确认修改范围、实际检查结果与交付链接，再按团队流程决定是否接受、合并或发布。平台记录执行完成，不代表人已经验收。'],
        ]))
        + section('真实界面如何呈现交付', figure(productImages.delivery, '当前产品的线程与交付工作区示例，执行状态与人工验收分开', '当前产品线程交付视图 · 固定示例数据，非实时执行或客户结果；会话交付与工程 Task 的节点和分支证据分别核对。')
          + `<div class="page-callout"><h3>先区分执行完成、验收和上线</h3><p>检查通过只支持对应检查项。PR/MR 存在还需要核对目标仓库、分支与差异；合并、部署和真实业务验收是后续独立决定。本页不承诺无人审阅或自动上线。</p></div>`)
        + section('出现问题时，保留历史而不是改写历史', `<div class="article-prose"><p>授权或预检失败，先修正创建条件；等待输入时，回复当前执行的问题。对具备恢复条件的任务，可以从明确节点继续，产生新的执行尝试并保留旧记录。</p><p>恢复不会自动撤回已经发生的外部操作。需求、仓库基线或流程需要改变时，应核对重建或新任务的输入，不假定一次重试就能安全覆盖全部状态。</p></div>`)
        + related([[doc('guides/create-a-task'), '创建任务', '核对要求、资料、仓库与流程。'], [doc('guides/observe-execution'), '观察执行与审阅结果', '按具体问题找到对应的证据入口。'], [doc('guides/handle-failures'), '处理失败与恢复', '区分创建失败、等待输入与新执行尝试。']]),
    },
    {
      path: 'product/methods/',
      label: '方法复用',
      title: '方法复用',
      description: '区分知识、经验、Skill、流程和员工，将经人工确认的方法按来源、版本与权限复用。',
      section: 'product',
      body: intro('把有效方法留下，不把所有记录都变成方法。', '一次交付会留下产物和运行记录。只有经过整理、核对并适合再次使用的内容，才应进入团队共享的知识与能力；复用仍需要来源、版本、权限和维护者。', owned('solutions/team-reuse/'), '查看团队复用场景')
        + section('先分清你想保留的是什么', `<div class="table-scroll"><table class="page-comparison"><caption>不同对象承担不同的复用责任</caption><thead><tr><th scope="col">对象</th><th scope="col">保留的内容</th><th scope="col">使用前核对</th></tr></thead><tbody><tr><th scope="row">知识文档</th><td>可发布、检索和追查来源的团队资料</td><td>文档生效版本、索引状态与访问范围</td></tr><tr><th scope="row">协作经验</th><td>来自实际工作的指示、经验与验证依据</td><td>适用性、来源和是否需要纠正或排除</td></tr><tr><th scope="row">Skill</th><td>可复用的方法、指令和辅助文件</td><td>内容、来源、固定发布版本与权限</td></tr><tr><th scope="row">流程与角色</th><td>工作步骤、输入输出、职责和执行配置</td><td>发布版本、依赖、运行端与输入契约</td></tr><tr><th scope="row">数字员工</th><td>持续协作的身份及其工作记录和经验</td><td>角色版本、就绪状态与当前成员的授权</td></tr></tbody></table></div>`)
        + section('从经验形成能力，确认发生在创建之前', `<div class="page-columns"><div>${steps([
          ['选取可迁移的来源', '先完成工作并保存、验证经验。排除错误、反例和不适合迁移的内容，明确希望形成的职责。'],
          ['检查方案与来源', '分析所选经验后，检查名称、职责、拟形成的 Skill 及其来源。分析本身不创建员工，也不发布技能。'],
          ['确认创建并验证结果', '人确认方案后再创建，分别检查生成的 Skill、角色和员工状态。已受理、部分完成和就绪不是同一个结果。'],
        ])}</div><div>${figure(productImages.methods, '从工作经验创建员工之前的方案确认页面，展示职责和拟形成技能的来源', '真实 Console 的创建前确认界面 · 响应为本地示例数据，未调用模型或执行真实员工创建；不证明培养效果。')}</div></div>`)
        + section('复用不是复制整段历史', `<div class="page-columns"><div><h3>让后续工作引用明确的方法</h3><p>工作可以使用已发布的 Skill、角色或流程，不必复制整个历史任务。流程更新发布新版本后，已有任务仍保留创建时确定的版本与证据。</p><p>共享角色定义与雇用员工不同：前者描述职责和执行方式，后者形成属于当前成员的协作身份。共享不会复制其他成员的私人记忆或凭据。</p></div><div><h3>让团队资料拥有自己的发布边界</h3><p>知识发布以单篇文档为单位，不存在覆盖整座知识库的统一发布版本。草稿保存、文档发布、索引就绪和检索命中应分别验证。</p><p>发现方法不再适用时，由维护者修改内容或纠正、排除经验。一次形成成功不能证明它适用于所有工作，更不代表底层模型完成训练。</p></div></div>`)
        + related([[doc('guides/digital-employees'), '培养与雇佣数字员工', '检查来源、方案、异步结果与员工依赖。'], [doc('guides/knowledge-base'), '发布并使用知识库', '按文档发布并验证带来源的检索结果。'], [doc('guides/flows-and-marketplace'), '复用角色、流程与能力', '核对固定版本、引用关系与个人凭据。']]),
    },
    {
      path: 'product/governance/',
      label: '使用治理',
      title: '使用治理',
      description: '了解成员授权、已记录运行、Token 与估算费用，以及模型启停和 Task 月额度的适用范围。',
      section: 'product',
      body: intro('看清使用与投入，也看清控制的边界。', '将成员身份、资源授权、运行记录与消耗口径分开管理。团队可以在授权范围内理解 AI 使用和投入，不把使用量当绩效，也不把一个策略入口描述成全平台硬预算。', owned('security/'), '查看安全与采用边界')
        + section('治理先回答三个实际问题', `<div class="page-columns"><div><h3>谁在什么范围内使用能力？</h3><p>组织身份、工作区成员关系和资源授权共同决定可用范围。平台配置服务目录，成员维护个人连接与凭据；共享 Skill 或角色不会自动授予外部系统访问权。</p><h3>有哪些已记录的运行？</h3><p>团队使用分析只覆盖当前账号可读且已记录的 Run。需要先统一工作区、查询范围和时间口径，才能解释成员与模型分布。</p></div><div class="page-callout"><h3>管理可见性不等于查看全部私人内容</h3><p>他人的私人 <code>development_machine</code> Run 不因管理员身份而开放。可读的运行统计，也不意味着 Prompt/Response 正文可读。</p><p>对符合范围的正文读取，需要显式请求、权限检查和成功写入审计；审计失败时拒绝读取。</p></div></div>`)
        + section('从可见信息到控制动作，分别核对', `<div class="table-scroll"><table class="page-comparison"><caption>治理能力及其不能代替的判断</caption><thead><tr><th scope="col">能力</th><th scope="col">可以支持的判断</th><th scope="col">不能推出</th></tr></thead><tbody><tr><th scope="row">成员与模型使用</th><td>分析可读 Run 的状态、归属与 Token 分布</td><td>全员全部活动、独立任务数或生产力排名</td></tr><tr><th scope="row">费用估算</th><td>按记录用量与模型目录价格理解投入</td><td>供应商账单、完整财务分摊或固定节省比例</td></tr><tr><th scope="row">模型启停</th><td>对当前接入策略检查的 Task 创建执行准入</td><td>撤销凭据或中止所有在途调用</td></tr><tr><th scope="row">月 Token / 费用额度</th><td>按 UTC 月已记录用量判断新 Task 是否准入</td><td>额度预占、全入口硬预算或运行中实时熔断</td></tr></tbody></table></div>`)
        + section('授权在产品中的具体位置', figure(productImages.management, '当前连接与授权分类清单及配置弹窗，展示 Git 服务的配置状态', '真实产品连接器界面 · 本地示例数据，非真实凭据或实时连接；它展示授权入口，不是使用统计或审计报表。')
          + `<p>成员在自己的连接入口确认服务地址与授权状态。保存配置只证明配置被接受，真实调用仍需要按目标服务、当前身份和执行环境单独验证。</p>`)
        + section('解释费用和额度时，保留不确定性', `<div class="article-prose"><p>费用存在完整计价、部分计价和未知状态。缺少价格或记录不能解释为免费；简表中的零金额也不能直接证明零成本。</p><p>Task 月额度检查使用已记录用量，不预占额度，也不实时终止正在运行的任务。并发创建、单次大消耗和遥测延迟都可能导致最终用量超过上限；不能推广为所有对话、自动化或协作入口都受到相同保护。</p></div>`)
        + related([[doc('management/usage'), '成员使用与可见范围', '核对 Run 覆盖、私人记录与正文读取。'], [doc('management/costs'), 'Token 与估算费用', '理解计价状态、价格快照及范围差异。'], [doc('management/model-policies'), '模型启停与月额度', '核对 Task 创建准入及并发超额边界。']]),
    },
    {
      path: 'product/architecture/',
      label: '企业架构',
      title: '企业架构',
      description: '从工作入口、能力组织、执行环境、共享资产和贯穿治理理解 SkyMythos 的系统责任边界。',
      section: 'product',
      body: intro('连接已有系统，明确每一层的责任。', '企业采用 AI，不只是在界面里选择一个模型。需要一起核对工作如何组织、在哪运行、读取哪些资料、使用谁的授权，以及哪些信息会进入外部服务。', owned('solutions/enterprise-adoption/'), '查看企业采用路径')
        + section('从工作入口到实际执行', `<div class="table-scroll"><table class="page-comparison"><caption>逻辑分层与需要核对的责任</caption><thead><tr><th scope="col">层次</th><th scope="col">承担的工作</th><th scope="col">企业需要确认</th></tr></thead><tbody><tr><th scope="row">工作入口</th><td>对话、研发任务与自动化承接不同类型工作</td><td>当前入口的对象、输入、触发及结果要求</td></tr><tr><th scope="row">工作组织</th><td>组织 Agent、流程、依赖、上下文和人工交互</td><td>角色和流程发布版本、输入输出与检查条件</td></tr><tr><th scope="row">执行能力</th><td>Harness 管理会话和工具执行，模型提供推理</td><td>运行端、模型、协议、镜像和网络的实际组合</td></tr><tr><th scope="row">企业资产</th><td>知识、Skill、角色与流程为工作提供可引用依据</td><td>维护者、可见范围、生效版本和来源</td></tr><tr><th scope="row">贯穿治理</th><td>身份、授权、运行记录、计量和策略执行点</td><td>数据可见范围、消耗口径与具体生效入口</td></tr></tbody></table></div>`)
        + section('模型、运行工具与连接器，不是同一个选择', `<div class="page-columns"><div><h3>模型与 Harness 分开验收</h3><p>模型网关提供模型调用目录，Harness 承担会话和工具执行。新增一个模型，不等于新增一个可用运行端；安装运行端，也不证明它兼容目录里的每个模型。</p><p>向量化服务承担文档索引等用途，应与对话模型分别配置和验证。具体支持范围以目标部署的适配器、协议与授权为准。</p></div><div><h3>运行环境与外部授权分开准备</h3><p>个人运行环境、任务 Sandbox 和 Agent 运行时承担不同责任。首次进入工作台不会自动创建 Sandbox；需要运行资源时再按入口准备。</p><p>模型、Git、企业服务和 MCP 的凭据由各自授权条件决定。市场中可见一个工具，并不证明它已启动、已连通或拥有当前成员的访问许可。</p></div></div>`
          + figure(productImages.management, '当前连接与授权入口中的服务分类清单和配置弹窗', '真实 Console 接入界面 · 本地示例数据，非实时网络连接；图中的服务存在不代表目标部署已接通。'))
        + section('部署到企业环境，仍需要检查数据去向', `<div class="page-columns"><div><h3>企业环境内的责任</h3><p>部署需准备控制面、运行资源、数据库、对象存储及网络条件，并明确备份恢复和日常运维责任。Kubernetes 部署还要核对对应沙箱控制器、运行时与网络策略能力。</p></div><div><h3>外部服务的责任</h3><p>调用外部模型、向量化服务、Git 或工具时，相关输入与产物可能跨越企业网络边界。私有部署不等于零外发，需要逐项核对服务端点、发送内容、凭据范围与企业政策。</p></div></div><div class="page-callout"><h3>配置成功，不等于链路验收成功</h3><p>按实际版本分别验证登录、模型响应、仓库访问、知识文档发布检索和一次小任务交付。页面可达、配置保存、部署健康与真实业务成功应分别记录。</p></div>`)
        + related([[doc('getting-started/deployment'), '部署与接入检查', '准备基础设施并验证真实链路。'], [doc('operations/configuration'), '平台配置与个人授权', '确认配置归属、依赖和生效时机。'], [doc('guides/connections-and-mcp'), '连接服务与 MCP 工具', '核对服务、工具范围和个人授权。'], [owned('security/'), '安全与责任边界', '继续核对身份、数据与执行风险。']]),
    },
    {
      path: 'solutions/',
      label: '解决方案',
      title: '解决方案',
      description: '按工作目标、已有输入、预期输出和人工验收，选择研发交付、团队复用或企业采用的评估起点。',
      section: 'solutions',
      body: intro('先选一个能够验收的问题。', '不同团队不必从同一项功能开始。先确认你想改善哪一类工作、已经具备哪些输入，以及人怎样判断结果，再决定用什么能力组合来评估。', owned('solutions/engineering/'), '从研发工作开始')
        + section('比较三种采用起点，而不是比较功能数量', `<div class="table-scroll"><table class="page-comparison"><caption>三种场景的任务、输入、输出与人工责任</caption><thead><tr><th scope="col">采用起点</th><th scope="col">要解决的任务与输入</th><th scope="col">预期输出</th><th scope="col">人如何验收</th></tr></thead><tbody><tr><th scope="row">研发任务交付</th><td>以已授权仓库、基线分支和明确需求，完成一个可验证改动</td><td>变更、实际检查记录，以及存在时可打开的 PR/MR</td><td>核对范围、测试结果、目标分支；另行决定合并与发布</td></tr><tr><th scope="row">团队方法复用</th><td>从已验证工作经验、已有资料与明确职责中，整理可复用内容</td><td>已发布文档、Skill、角色或流程；按需形成员工</td><td>审核来源和适用条件，再用另一项工作验证是否适用</td></tr><tr><th scope="row">企业 AI 采用</th><td>以部署版本、角色、服务清单和授权边界，建立小范围试点</td><td>已验收的接入组合、权限范围、运行与估算消耗依据</td><td>逐项核对链路、可见性、限制和维护责任，决定是否扩大</td></tr></tbody></table></div><p>这些是评估路径，不是产品效果承诺。一次示例或单项成功，都不能证明全部部署、场景和执行组合已验证。</p>`)
        + section('按当前最需要解决的问题进入', `<div class="page-grid"><a class="page-card" href="${owned('solutions/engineering/')}"><h3>研发任务交付</h3><p>适合已经有清楚目标和测试仓库，希望检查 AI 是否能完成一项有边界的工程工作，而非先改造全部开发流程的团队。</p><span>看输入、交付与验收步骤 ↗</span></a><a class="page-card" href="${owned('solutions/team-reuse/')}"><h3>团队方法复用</h3><p>适合已有可验证经验与共享需求，希望减少重复交代，又需要保留资料来源、版本和维护责任的团队。</p><span>看整理、发布与后续验证 ↗</span></a></div><div class="page-callout"><h3>你需要先解决部署、权限或投入评估？</h3><p>从企业采用路径开始，先选定试点工作区、执行组合和数据范围。接通环境与确认管理口径之后，再扩大到具体团队。</p><a href="${owned('solutions/enterprise-adoption/')}">了解企业 AI 采用 ↗</a></div>`)
        + section('为一次有判断价值的演示准备什么', steps([
          ['带来一个有边界的目标', '说明当前问题、不能改变的条件，以及一项可以客观核对的结果。不需要先上传全部企业资料。'],
          ['列出可使用的输入', '确认资料来源、仓库或环境、参与成员与授权条件。没有许可的数据和服务不进入评估范围。'],
          ['约定人的验收与后续决定', '明确谁检查结果、谁维护可复用内容、谁评估接入与消耗。是否扩大采用，由实际证据决定。'],
        ]))
        + related([[owned('product/'), '回到产品总览', '理解能力如何组合，而不是只看单个场景。'], [owned('resources/'), '查阅评估资料', '按交付、复用和部署问题选择指南。']]),
    },
    {
      path: 'solutions/engineering/',
      label: '研发任务交付',
      title: '研发任务交付方案',
      description: '面向研发团队，用有边界的需求、已授权仓库和明确检查，评估可审阅的 AI 工程交付。',
      section: 'solutions',
      body: intro('从一项小改动，验证完整的研发交付。', '面向研发负责人、开发与审阅者。将需求、仓库上下文和检查要求交代清楚，让 AI 执行有边界的工作，把人的精力留给范围判断、质量核对与合并决定。', owned('product/work-delivery/'), '了解工作交付机制')
        + section('解决“有回复，难验收”的问题', `<div class="page-columns"><div><h3>问题不只在代码生成</h3><p>一段看似合理的代码，不足以说明它基于正确分支、保留既有行为、通过相关检查，或者已形成可审阅交付。研发评估需要把这些依据连在一起。</p><p>适合从参数校验、局部缺陷修复或明确接口改动开始；不以“优化整个系统”作为第一次试点，也不把演示中的成功直接推广到生产仓库。</p></div><div class="page-callout"><h3>进入前准备</h3><ul><li>可用于评估的已授权仓库与基线分支。</li><li>包含范围、约束与验收条件的需求。</li><li>相关文档、已有测试与当前部署可用的流程。</li><li>具备相应权限的执行者与人工审阅者。</li></ul></div></div>`)
        + section('交付物应该支持具体检查', figure(productImages.delivery, '当前产品线程会话与交付信息的示例界面', '当前产品组件与固定示例数据 · 不是客户案例、实时执行或研发效率指标；本图不代替工程 Task 的真实变更验收。')
          + `<div class="table-scroll"><table class="page-comparison"><caption>把输出映射到人工验收</caption><thead><tr><th scope="col">预期输出</th><th scope="col">人工验收问题</th></tr></thead><tbody><tr><th scope="row">结果摘要与变更</th><td>是否解决约定问题？有没有超出范围或改变不应改变的行为？</td></tr><tr><th scope="row">测试与其他检查记录</th><td>执行了什么检查，实际结果如何，哪些检查没有运行？</td></tr><tr><th scope="row">冻结文件与产物</th><td>路径、内容及执行尝试是否一致，能否支持交接？</td></tr><tr><th scope="row">实际 PR/MR 链接（如有）</th><td>仓库、目标分支和差异是否正确，是否进入团队现有审查流程？</td></tr></tbody></table></div>`)
        + section('建议的采用顺序', steps([
          ['选择测试范围', '使用有权限的测试仓库或经批准的非关键分支，选择容易核对的小目标，约定不涉及发布的试点边界。'],
          ['准备授权和流程输入', '检查个人 Git 与模型授权、仓库目录和基线分支。流程选择不等于模型切换，实际执行配置需要单独确认。'],
          ['完成一次执行与审阅', '观察当前节点，回复必要问题。核对变更、检查和交付链接，记录失败项与需要人工补充的条件。'],
          ['根据证据决定下一步', '交付可接受后，再评估类似工作和可复用方法。恢复、扩大权限或接入生产流程，都应单独确认。'],
        ]))
        + section('不替代团队现有的质量责任', `<div class="article-prose"><p>平台完成状态不等于合并、上线或业务成功。一次测试通过只证明对应检查，敏感变更仍按团队要求审查。</p><p>执行失败时应先定位授权、环境或节点原因。恢复可能产生新的执行尝试，且不会自动撤销已经发生的外部副作用；不以反复重试代替原因判断。</p></div>`)
        + related([[doc('getting-started/first-task'), '完成第一个任务', '用小目标走通创建、执行和交付核对。'], [doc('guides/observe-execution'), '人工审阅指南', '明确进度、变更、冻结修订和交付链接各说明什么。'], [owned('resources/how-it-works/'), '同一需求的完整故事', '看确认、交付和后续方法引用如何衔接。']]),
    },
    {
      path: 'solutions/team-reuse/',
      label: '团队方法复用',
      title: '团队方法复用方案',
      description: '帮助团队从已验证经验和共享资料中整理可复用方法，以来源、版本、人工确认和后续工作检验复用。',
      section: 'solutions',
      body: intro('让下一项工作，不必从重复交代开始。', '面向业务方法维护者、团队负责人和知识维护者。将已经验证的做法整理成适合共享的资料与能力，让后续工作引用明确依据，而不是依赖某个人重新复述全部经验。', owned('product/methods/'), '了解方法复用机制')
        + section('先处理来源和适用性，再谈共享', `<div class="page-columns"><div><h3>你可能已经拥有方法，只是它还分散着</h3><p>一次项目的检查步骤在会话里，稳定规则在文档里，例外条件留在某位同事的经验里。直接把全部记录塞进知识库，往往不能形成可维护的方法。</p><p>先选一个会重复发生的工作类型，确认哪些内容是事实、哪些是操作步骤、哪些只适用于当时情况。错误和不适用经验应纠正或排除。</p></div><div><h3>准备最小可用的输入</h3><ul><li>已完成且能够核对结果的工作来源。</li><li>当前有权读取、版本明确的经验或资料。</li><li>希望复用的职责、工作步骤与适用条件。</li><li>负责审核、授权和后续维护的人。</li></ul><p>不是每次复用都需要创建员工；文档、Skill 或已发布流程也可能更合适。</p></div></div>`)
        + section('人确认的是具体方法，不是一句自动学习承诺', figure(productImages.methods, '经验分析后的员工方案，展示拟形成的技能和对应来源，等待人工确认创建', '真实产品方案确认界面 · 本地示例数据；分析尚未创建员工，图中来源与结果不代表真实学习效果。')
          + `<div class="page-callout"><h3>选择正确的输出对象</h3><p>团队资料可整理成按篇发布的知识文档；可重复操作方式可维护为 Skill 或流程；需要长期协作身份时，再评估从经验创建员工或雇用已发布角色。共享范围、版本与依赖仍需逐项检查。</p></div>`)
        + section('用第二项工作检验复用是否成立', steps([
          ['选一类会再次发生的工作', '先定义希望减少哪一种重复交代，明确什么条件下适用、什么条件下不能照搬。'],
          ['整理来源并审核内容', '核对事实和步骤，修正 AI 提出的候选内容，再由人决定是否采用。经验分析与模型训练不是同一件事。'],
          ['发布到合适的范围', '按对象发布文档、Skill、角色或流程，检查可见范围和依赖。共享定义不会复制个人凭据，也不会自动开放全部知识。'],
          ['在后续工作中核对引用与结果', '检查实际引用的版本和来源，评估方法是否适用、结果是否通过人的验收，再决定更新或扩大共享。'],
        ]))
        + section('验收复用，不只检查“已经发布”', `<div class="table-scroll"><table class="page-comparison"><caption>团队方法复用的验收依据</caption><thead><tr><th scope="col">检查项</th><th scope="col">可接受的依据</th></tr></thead><tbody><tr><th scope="row">来源可信</th><td>能回到对应工作、资料或经验，适用条件已经说明。</td></tr><tr><th scope="row">发布与权限正确</th><td>目标成员能读取应开放的版本，未获授权内容仍不可见。</td></tr><tr><th scope="row">后续引用明确</th><td>新工作使用的是指定方法或生效文档，不是旧草稿或一份失去来源的复制品。</td></tr><tr><th scope="row">后续结果可验收</th><td>人按新工作的条件核对输出，并记录方法的有效处与限制。</td></tr></tbody></table></div><p>发布成功不证明方法永远正确。员工出现于目录也不证明依赖就绪；知识文档完成索引，也不证明每个问题都能得到正确结果。</p>`)
        + related([[doc('guides/knowledge-base'), '发布并使用知识库', '按文档验证版本、索引和来源片段。'], [doc('guides/digital-employees'), '从经验创建员工', '区分分析、确认创建与可协作状态。'], [doc('guides/flows-and-marketplace'), '复用已发布能力', '选择适合的 Skill、角色或流程对象。']]),
    },
    {
      path: 'solutions/enterprise-adoption/',
      label: '企业 AI 采用',
      title: '企业 AI 采用方案',
      description: '面向企业管理员与技术负责人，以小范围试点核对部署、连接、权限、运行可见性和投入口径。',
      section: 'solutions',
      body: intro('扩大 AI 采用之前，先让责任与边界清楚。', '面向企业管理员、平台负责人和参与评估的团队。围绕一个工作区和一项真实工作，逐项确认服务接入、成员授权、执行结果与可见消耗，再决定是否扩大使用。', owned('security/'), '查看安全评估问题')
        + section('解决的不只是“能否打开页面”', `<div class="page-columns"><div><h3>从零散使用转向可核对的采用</h3><p>企业需要知道成员使用哪些服务、运行在哪里、资料开放给谁，以及费用依据是否完整。单个成员能完成一次对话，不足以证明组织已经具备相同的执行条件和管理范围。</p><p>建议先确定试点工作区和参与角色，不以全员接入或全部资料同步作为起点。接入范围与工作目标应一起批准。</p></div><div class="page-callout"><h3>评估输入</h3><ul><li>目标产品版本、部署环境与运维责任。</li><li>试点成员、工作区及角色权限清单。</li><li>模型、运行端、Git、知识与工具的服务清单。</li><li>允许使用的数据范围及一项可验收工作。</li></ul></div></div>`)
        + section('从个人连接开始，检查真实权限', figure(productImages.management, '当前连接器分类清单与配置弹窗，用于核对服务配置和凭据边界', '真实产品接入界面 · 本地示例数据，不是企业客户部署；连接状态示例不证明真实外部服务已接通。')
          + `<p>平台准备服务目录和运行资源，成员完成自己的授权。工作区成员关系与共享能力，不替代模型、Git 或企业系统本身的权限。</p>`)
        + section('逐步获得可以用于决策的输出', steps([
          ['确认工作区与角色', '选定管理员、执行成员和审阅者，记录他们应能访问与不应能访问的对象。导航可见与数据可读分别核对。'],
          ['验证最小接入组合', '按实际版本核对模型、Harness、协议、运行环境和个人授权。登录、仓库读取、知识检索和模型调用各自验收。'],
          ['完成一项有边界的工作', '保留输入、执行证据、实际输出和人工验收结论。失败项与人工补充条件一并记录，不把界面演示当作业务成功。'],
          ['核对使用与投入口径', '查看当前权限内已记录的 Run、Token 和估算费用，记录遗漏与未知状态。需要策略时，单独验证 Task 准入的生效范围。'],
          ['决定维护与扩大范围', '明确共享资产维护者、连接与环境负责人、问题处理路径。依据试点证据决定下一批工作，不预设全员推广结果。'],
        ]))
        + section('用明确证据结束试点', `<div class="table-scroll"><table class="page-comparison"><caption>采用评估的输出与验收责任</caption><thead><tr><th scope="col">输出</th><th scope="col">验收重点</th></tr></thead><tbody><tr><th scope="row">接入组合记录</th><td>版本、服务端点、模型、运行端和网络条件可追查；只声明已验证组合。</td></tr><tr><th scope="row">权限与数据范围</th><td>应开放对象可用，未获授权对象不因共享角色或管理身份而开放。</td></tr><tr><th scope="row">工作与复用证据</th><td>真实结果已经人工核对，值得留下的方法另行审核与发布。</td></tr><tr><th scope="row">投入与策略说明</th><td>估算费用、数据覆盖与准入边界明确，不与供应商账单或全入口硬预算混淆。</td></tr></tbody></table></div><div class="page-callout"><h3>本地部署不是“没有外部数据流”</h3><p>如果选用外部模型、Git、向量化或其他工具，仍需按企业政策检查发送内容、网络路径与授权。认证、SLA、身份集成和服务承诺应依据可提供的适用材料单独确认，不从页面示意推导。</p></div>`)
        + related([[doc('getting-started/deployment'), '部署与接入检查', '逐项准备基础设施与业务链路。'], [doc('operations/roles'), '角色与权限', '区分平台、工作区和个人授权责任。'], [doc('operations/verification'), '验证与验收边界', '分别记录已实现、测试、部署和业务验收。'], [owned('product/governance/'), '使用治理', '理解可见记录、费用估算与具体策略入口。']]),
    },
    {
      path: 'security/',
      label: '安全与边界',
      title: '安全与责任边界',
      description: '从身份授权、数据流、运行环境、人工确认和文档依据评估 SkyMythos 的企业安全与责任范围。',
      section: 'security',
      body: intro('安全有依据，边界可核对。', '从身份和工作区权限，到个人连接、运行环境和结果审阅，逐项确认控制在哪里生效。本页说明当前文档可核对的机制与限制，不以认证标识或笼统承诺代替证据。', owned('product/architecture/'), '查看企业架构')
        + section('身份与授权：管理权不等于所有数据的访问权', `<div class="page-columns"><div><h3>权限有多个独立范围</h3><p>组织身份与工作区成员关系共同参与授权。平台运维负责全局服务与运行资源，工作区权限限定对应范围；看到导航或知道一个地址，并不能绕过服务端检查。</p><p>个人 Git、模型和外部工具授权由成员维护。共享角色、Skill 或工作区成员关系，不会复制其他成员的私有凭据。</p><a href="${doc('operations/roles')}">查阅角色与权限依据 ↗</a></div><div><h3>统计与正文读取不是同一种权限</h3><p>团队使用分析只汇总可读且已记录的 Run。他人的私人开发机 Run 不因管理员身份而开放；对符合范围的 Prompt/Response 正文，还需显式请求、权限检查和成功写入审计。</p><p>审计失败时拒绝正文读取，具备读取资格也不保证内容仍被保留。不能据此宣称管理员能看全部内容，或永远不能读取正文。</p><a href="${doc('management/usage')}">查阅可见范围与正文读取 ↗</a></div></div>`)
        + section('数据流：按服务核对，而不是只看部署位置', `<div class="table-scroll"><table class="page-comparison"><caption>企业评估时需要逐项确认的数据边界</caption><thead><tr><th scope="col">环节</th><th scope="col">涉及的数据与动作</th><th scope="col">需要确认</th></tr></thead><tbody><tr><th scope="row">模型与向量化服务</th><td>工作输入、上下文或索引用到的文档内容</td><td>实际端点、发送范围、凭据与适用的数据处理政策</td></tr><tr><th scope="row">Git 与企业工具</th><td>读取仓库或资料，以及权限允许的外部写入</td><td>成员授权、工具范围、目标系统权限与副作用</td></tr><tr><th scope="row">知识与能力共享</th><td>文档发布版本、Skill、角色与流程的访问</td><td>维护者、来源、范围、依赖和当前生效版本</td></tr><tr><th scope="row">运行记录与观测</th><td>状态、用量及在权限条件下可读取的正文</td><td>采集覆盖、访问与保留条件，不将统计可见扩大为正文可见</td></tr></tbody></table></div><p>私有部署不等于零外发。如果使用外部服务，相关请求可能跨出企业环境。服务端点、网络策略和数据范围需要在目标部署中检查，不能由本地安装方式代替。</p>`)
        + section('执行边界：环境、能力与外部连接分别验证', figure(productImages.management, '当前连接与授权的服务清单与配置界面，用于核对配置与使用范围', '真实 Console 界面 · 本地示例数据，非真实凭据与实时服务连接；不构成安全认证或部署审计证据。')
          + `<div class="page-columns"><div><h3>环境就绪与工具可用分别确认</h3><p>运行环境需具备镜像、资源、网络与所需工具。MCP 出现在目录中不代表已启动或连通；保存授权配置也不代表实际调用成功。</p><a href="${doc('guides/connections-and-mcp')}">查阅连接与工具范围 ↗</a></div><div><h3>控制点只说明自身适用范围</h3><p>模型月额度针对当前接入的 Task 创建准入，不预占额度、不实时熔断。并发和遥测延迟可能造成超额，不能作为所有调用的硬预算承诺。</p><a href="${doc('management/model-policies')}">查阅模型策略边界 ↗</a></div></div>`)
        + section('人的确认：把业务责任留在可判断的位置', `<div class="article-prose"><p>提交前确认工作范围、来源和授权；交付后检查变更、验证记录与产物，再决定是否接受、合并或发布。平台显示执行完成，不等于人的验收已经发生。</p><p>可复用方法需要核对来源、适用条件和共享范围。员工经验分析不创建员工；确认方案后才进入创建，并继续检查结果和依赖。一次案例里的审批关口也不能推广成所有入口都强制审批。</p><p>执行恢复可能创建新的尝试，但不会自动撤回已经发生的外部操作。遇到结果不确定时，应先查明实际状态，再决定下一步。</p></div>`)
        + section('评估时，请要求与部署对应的证明', `<div class="resource-list"><article><h3>部署与配置依据</h3><p>核对产品版本、部署清单、服务端点、个人授权和环境要求，不从通用架构图推断当前环境已配置。</p><a href="${doc('getting-started/deployment')}">部署与接入检查 ↗</a></article><article><h3>真实业务验收记录</h3><p>分别记录界面检查、自动化检查、部署健康和实际业务读写。使用示例数据的截图不能证明真实系统已接通。</p><a href="${doc('operations/verification')}">验证与验收边界 ↗</a></article><article><h3>采购与安全材料的适用范围</h3><p>如评估需要认证、身份集成、保留策略或服务等级材料，应单独确认其可提供性、版本和适用范围。本页不作未经核验的资质或合同承诺。</p><a href="${owned('solutions/enterprise-adoption/')}">查看企业采用评估步骤 ↗</a></article></div>`),
    },
    {
      path: 'resources/',
      label: '资源中心',
      title: '资源中心',
      description: '按评估目标查找 SkyMythos 的工作案例、操作指南、方法复用、企业治理及部署验收资料。',
      section: 'resources',
      body: intro('找到评估和使用所需的资料。', '从工作案例理解完整过程，再按交付、方法复用或企业接入选择操作指南。部署与管理资料帮助团队核对实际使用条件。', owned('resources/how-it-works/'), '了解完整工作方式')
        + section('先建立对工作过程的完整理解', `<div class="page-columns"><div class="article-prose"><h3>同一项需求，怎样交付并留下方法</h3><p>REQ-014 是一段连续的虚构示例：人确认范围，Agent 协作并提供检查依据，人验收后决定发布；后续再审改方法候选，引用到同一需求的下一版。</p><p>案例保留历史与方法来源，也明确展示 v2 仍待人验收。它解释协作关系，不是实时运行、客户成果或全部产品入口的统一状态机。</p><a href="${owned('resources/how-it-works/')}">阅读完整工作案例 ↗</a></div><div class="page-callout"><h3>已经准备好操作？</h3><p>从产品文档进入真实入口说明。首次成员先找工作台，管理员先看部署；没有必要先读完全部核心概念。</p><a href="${docsRoot}">打开产品文档目录 ↗</a></div></div>`)
        + section('完成第一项工作', `<div class="resource-list"><article><h3>从工作台开始</h3><p>适合首次进入的成员。认识对话、任务、员工、知识与个人授权的职责，选择正确入口。</p><a href="${doc('getting-started/overview')}">阅读工作台入门 ↗</a></article><article><h3>第一个任务</h3><p>适合希望验证工程交付的团队。以小目标核对资料、仓库、执行进度和真实交付链接。</p><a href="${doc('getting-started/first-task')}">按步骤完成首项任务 ↗</a></article><article><h3>观察执行与审阅结果</h3><p>适合执行者与审阅者。按问题找到进度、上下文、变更、冻结文件、Trace 与产物。</p><a href="${doc('guides/observe-execution')}">查找交付证据 ↗</a></article><article><h3>处理失败与恢复</h3><p>适合遇到授权失败、等待输入或节点失败的成员。核对恢复起点和已经发生的外部操作。</p><a href="${doc('guides/handle-failures')}">查阅恢复条件 ↗</a></article></div>`)
        + section('把可用的方法带到后续工作', `<div class="resource-list"><article><h3>发布并使用知识库</h3><p>适合资料维护者。逐篇发布文档、检查索引，再核对检索结果的版本和来源片段。</p><a href="${doc('guides/knowledge-base')}">阅读文档发布与检索指南 ↗</a></article><article><h3>培养与雇佣数字员工</h3><p>适合需要长期协作身份的成员。区分经验分析、方案确认、创建结果与依赖就绪。</p><a href="${doc('guides/digital-employees')}">阅读员工形成与协作指南 ↗</a></article><article><h3>复用角色、流程与能力</h3><p>适合方法维护者。理解 Skill、角色、MCP 和流程的不同用途，以及固定版本与凭据边界。</p><a href="${doc('guides/flows-and-marketplace')}">选择正确的复用对象 ↗</a></article></div>`)
        + section('评估企业接入与治理', `<div class="page-grid"><article class="page-card"><h3>部署与权限准备</h3><p>面向管理员与平台负责人。先确认基础设施、模型和 Git 链路，再核对身份及工作区范围。</p><ul><li><a href="${doc('getting-started/deployment')}">部署与接入检查</a></li><li><a href="${doc('operations/roles')}">角色与权限</a></li><li><a href="${doc('guides/connections-and-mcp')}">连接服务与 MCP 工具</a></li><li><a href="${doc('operations/verification')}">验证与验收边界</a></li></ul></article><article class="page-card"><h3>使用与投入解释</h3><p>面向治理参与者。明确 Run 覆盖、私人记录、计价状态和 Task 准入，避免把估算当账单。</p><ul><li><a href="${doc('management/usage')}">成员使用与可见范围</a></li><li><a href="${doc('management/costs')}">Token 与估算费用</a></li><li><a href="${doc('management/model-policies')}">模型启停与月额度</a></li></ul></article></div>`)
        + related([[owned('solutions/'), '尚未确定评估起点？', '比较不同场景的输入、输出和人的验收责任。'], [owned('security/'), '准备安全评估', '围绕权限、数据去向与执行控制核对证明。']]),
    },
    {
      path: 'resources/how-it-works/',
      label: '工作方式',
      title: '工作方式与完整案例',
      description: '沿虚构需求 REQ-014 查看范围确认、协作交付、人工验收、方法审改及同一需求 v2 的后续引用。',
      section: 'resources',
      needsLifecycle: true,
      body: intro('沿同一项需求，看工作怎样继续。', '以虚构需求 REQ-014 的订单导出改进为例，观察一项工作如何从范围确认走到交付，再将经人审改的方法带入下一版。看的是连续的协作关系，不是实时产品运行。', owned('product/work-delivery/'), '了解工作交付机制')
        + section('同一份需求，保留历史，也保留尚未完成的事', `<div class="article-prose"><p>示例中的不同工位共同处理 REQ-014：先明确验收条件，再完成实现与检查；人决定接受和发布 v1。随后，AI 提出总结候选，人实际修改、确认并决定采用，方法才被保留。</p><p>下一版仍属于同一需求。它引用已经保留的方法，并更新自己的验收条件；v1 历史和方法原件继续存在，v2 不会因为引用方法就自动获得验收或发布许可。</p></div>`)
        + `<section class="workflow-story" aria-label="REQ-014 连续协作示例">${lifecycle}</section>`
        + section('第一段：先确认范围，再进入协作', `<div class="page-columns"><div><h3>起点是可判断的要求</h3><p>REQ-014 不是一句“把订单导出做好”。示例把工作范围和验收条件交给人确认，再进入协作与方案准备。已有工位接力执行，不代表此时正在培养新员工。</p><p>人确认范围，是这段示例里明确展示的决定；不能由此推断全部工作入口的每一步都强制审批。</p></div><div class="page-callout"><h3>这里的人为关口</h3><p>先确认这次要做什么、允许改什么，以及如何验收。目标偏差应在这一层被识别，而不是等到交付后用“执行成功”掩盖。</p></div></div>`, 'scope')
        + section('第二段：检查完成以后，仍需要人验收', `<div class="article-prose"><p>协作工位完成实现与验证，形成可供核对的交付依据。检查先发生，随后才是人的验收与批准发布，最终保留 v1 的交付历史。</p><p>这里需要区分三个事实：检查得到结果，人确认接受，发布获得批准。Agent 的完成状态不替代其中任何一项，也不能证明真实生产系统已经上线。</p></div><div class="page-callout"><h3>在真实研发任务中看什么？</h3><p>把摘要与变更、实际测试结果、冻结文件和真实交付链接相互核对。要查看对应操作入口，可阅读<a href="${doc('guides/observe-execution')}">观察执行与审阅结果</a>。</p></div>`, 'delivery')
        + section('第三段：方法由人审改，不是自动成为团队真理', steps([
          ['AI 提出总结候选', '候选来自已经发生的工作与反馈，不是无来源的新结论。它还不能等同于已经采用的方法。'],
          ['人实际修改并确认', '人检查适用条件、修正内容，再明确确认候选。确认与最终决定采用是不同动作，示例分别保留。'],
          ['保留方法原件与来源', '采用后留下明确的方法及其工作来源。这里表达可复用方法的形成，不是训练底层模型，也不是复制全部聊天记录。'],
        ]), 'method')
        + section('第四段：同一需求进入 v2，验收仍然待完成', `<div class="page-columns"><div><h3>引用方法，不抹掉原件</h3><p>v2 使用独立引用连接到已保留的方法，原方法和 v1 历史继续存在。新一轮先更新自己的验收条件，再开展后续工作，不把过去的决定当作新的授权。</p></div><div class="page-callout"><h3>示例结束时，v2 仍待人验收</h3><p>这不是展示遗漏，而是明确的边界：方法复用可以为工作提供依据，不能自动证明新版本正确。v2 未验收、未发布，不能把它写成已经完成第二轮上线。</p></div></div>`, 'next-version')
        + section('从这个案例进入产品操作', `<div class="table-scroll"><table class="page-comparison"><caption>案例中的问题与真实文档入口</caption><thead><tr><th scope="col">你想核对的动作</th><th scope="col">对应资料</th><th scope="col">注意边界</th></tr></thead><tbody><tr><th scope="row">交代输入与验收条件</th><td><a href="${doc('guides/create-a-task')}">创建任务</a></td><td>资料与仓库需要当前成员授权。</td></tr><tr><th scope="row">查看执行与验收依据</th><td><a href="${doc('guides/observe-execution')}">观察执行与审阅结果</a></td><td>执行完成不代表合并、部署或业务验收。</td></tr><tr><th scope="row">复用有来源的方法</th><td><a href="${doc('guides/flows-and-marketplace')}">复用角色、流程与能力</a></td><td>核对发布版本、输入契约和当前依赖。</td></tr><tr><th scope="row">进一步从经验形成员工</th><td><a href="${doc('guides/digital-employees')}">培养与雇佣数字员工</a></td><td>不是本例已有工位参与的含义；分析后仍需人确认创建。</td></tr></tbody></table></div><p>REQ-014 为虚构流程示意，不是客户成果或效果承诺。不同产品入口保留自己的运行对象、权限与策略，不能将本故事理解为覆盖全部入口的统一状态机。</p>`)
        + related([[owned('solutions/engineering/'), '将案例转为研发评估', '准备目标、仓库和实际审阅责任。'], [owned('solutions/team-reuse/'), '将方法复用转为团队评估', '用另一项真实工作检验适用性，而不只检查是否发布。']]),
    },
  ];
}
