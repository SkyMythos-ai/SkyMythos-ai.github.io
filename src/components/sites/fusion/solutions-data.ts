import type { Locale } from "@/lib/i18n";

export type RoleSlug =
  | "hr"
  | "finance"
  | "sales"
  | "legal"
  | "operations"
  | "product"
  | "engineering"
  | "it-admin";

export type RoleScenario = {
  id: string;
  label: string;
  situation: string;
  approach: string;
  boundary: string;
  deliverableTitle: string;
  deliverableTag: string;
  deliverablePoints: string[];
  sources: string[];
  templateRole: string;
  promptExample: string;
};

export type RoleSubgroup = {
  id: string;
  name: string;
  thesis: string;
  scenarios: RoleScenario[];
};

export type RoleSolution = {
  slug: RoleSlug;
  name: string;
  shortLabel: string;
  tagline: string;
  summary: string;
  heroDescription: string;
  bullets: string[];
  highlights: { label: string; detail: string }[];
  tags: string[];
  subgroups: RoleSubgroup[];
  relatedCapabilities: string[];
  ctaTitle: string;
  ctaDescription: string;
  pocScenario: string;
};

const zhSolutions: RoleSolution[] = [
  {
    slug: "hr",
    name: "HR",
    shortLabel: "HR",
    tagline: "让日常人事办理有清单，制度核对有依据。",
    summary: "覆盖招聘初筛、劳动用工文书草拟、算薪数据核对与员工制度问答。",
    heroDescription:
      "关联企业规章制度、岗位要求与人事台账，辅助完成简历比对、合规文书起草与月度算薪核查，将最终录用、用印签发与定级决策留给 HR 团队。",
    bullets: [
      "岗位简历结构化初筛与匹配对照",
      "劳动合规文书初稿起草与条款核查",
      "月度考勤、异动与算薪数据比对",
    ],
    highlights: [
      { label: "主要人事场景覆盖", detail: "招聘获取 · 员工关系 · 薪酬绩效 · 员工服务与培训" },
      { label: "制度与合同原文关联", detail: "每项规则引用与核对结论均标明内部规章或合同条款出处" },
      { label: "关键决定人工把关", detail: "录用淘汰、合规文书签发与算薪终审均需 HR 确认后生效" },
    ],
    tags: ["招聘筛选", "用工合规", "算薪核对", "制度答疑"],
    relatedCapabilities: ["employees", "knowledge", "automations"],
    ctaTitle: "围绕真实人事场景，验证数字员工协作效果",
    ctaDescription: "选取招聘筛选、合规文书或算薪核对等一项高频工作，共同确认资料边界与验收标准。",
    pocScenario: "数字员工与业务工作",
    subgroups: [
      {
        id: "employee-relations",
        name: "员工关系与用工合规",
        thesis: "对照内部规章与合同约定，提前理清程序要点与书面材料。",
        scenarios: [
          {
            id: "compliance-doc",
            label: "劳动合规文书起草",
            situation: "调岗协商、续签提醒或解除通知涉及多项规章与合同约定，手工翻查条款容易遗漏程序细节。",
            approach: "关联员工合同要素与现行《员工手册》对应章节，按企业模板起草文书初稿并附程序核对清单。",
            boundary: "正式用印、送达员工及沟通方案必须由 HR 负责人与法务审核确认。",
            deliverableTitle: "协商变更岗位确认书（初稿）及程序清单",
            deliverableTag: "人事合规 · 待人工审定",
            deliverablePoints: [
              "引用的《员工手册》具体章节与合同依据对照",
              "沟通纪要归档与员工签收时间节点清单",
              "薪酬结构衔接等需人事重点复核的条款提示",
            ],
            sources: ["员工手册现行版", "标准劳动合同范本", "人事办理流程规范"],
            templateRole: "HR 员工关系助手",
            promptExample:
              "请结合《员工手册》考勤与调岗规定及附件沟通纪要，起草一份《协商变更岗位确认书》初稿，并列出需人事提前核实的证明材料清单。",
          },
          {
            id: "offboarding-check",
            label: "离职交接与合规核查",
            situation: "员工离职涉及工作文档移交、权限回收、竞业限制确认与假期折算，跨部门协同环节多。",
            approach: "按岗位类别生成标准化交接核对单，自动核算剩余年假折算口径并提示保密与竞业协议状态。",
            boundary: "离职证明开具、经济补偿或竞业启动决定由 HRBP 与部门负责人签批。",
            deliverableTitle: "离职办理与权限回收核对单",
            deliverableTag: "交接核查 · 附制度依据",
            deliverablePoints: [
              "业务资料、设备与各系统权限回收核对表",
              "未休年假与考勤截止日核算明细",
              "保密及竞业限制协议生效状态提示",
            ],
            sources: ["离职管理制度", "年休假折算规则"],
            templateRole: "人事办理核查助手",
            promptExample:
              "请根据《离职管理制度》与该员工入职合同信息，生成研发岗位离职交接核对单，并核对本年度剩余年假折算天数。",
          },
        ],
      },
      {
        id: "talent-acquisition",
        name: "招聘与人才获取",
        thesis: "把岗位要求、简历初筛与面试记录整理为一致的评估参考。",
        scenarios: [
          {
            id: "resume-screening",
            label: "批量简历初筛对照",
            situation: "集中招聘期简历量大，HR 与用人部门对齐筛选标准耗时，仅靠关键词容易漏掉合适人选。",
            approach: "拆解岗位说明书中的必备经验与项目要求，逐份提取候选人履历生成结构化匹配表与追问建议。",
            boundary: "初筛排序仅作辅助参考，进入面试名单与最终录用结论由用人主管及 HR 决定。",
            deliverableTitle: "候选人匹配度对照表与追问提纲",
            deliverableTag: "招聘辅助 · 附履历摘录",
            deliverablePoints: [
              "按硬性条件与核心项目经历逐人对齐的评估表",
              "高匹配候选人亮点摘录与待核实履历空窗期",
              "针对性一面业务核实问题建议",
            ],
            sources: ["部门岗位说明书", "岗位面试评估表"],
            templateRole: "招聘筛选专员",
            promptExample:
              "请对照《高级供应链计划岗位说明书》，梳理本批 15 份候选人简历的核心项目匹配情况，并标出每位高匹配人选一面需重点核实的细节。",
          },
          {
            id: "interview-summary",
            label: "多轮面试评价汇总",
            situation: "多位面试官反馈格式不一，综合比较候选人优劣势与定级依据时需要反复整理。",
            approach: "汇总业务面、交叉面与 HR 面记录，按岗位胜任力维度对齐各方评价并标出分歧点。",
            boundary: "录用定级、薪酬方案与 Offer 发放须经用人部门及薪酬负责人审批。",
            deliverableTitle: "候选人多轮面试综合评估简报",
            deliverableTag: "录用参考 · 待审批",
            deliverablePoints: [
              "各轮面试官核心正面评价与顾虑对照",
              "胜任力维度匹配摘要与待背调核实事项",
              "同岗位候选人横向对比概览",
            ],
            sources: ["各轮面试记录单", "职级胜任力标准"],
            templateRole: "招聘评估整理助手",
            promptExample:
              "请汇总这位候选人的三轮面试记录，对照 P6 职级标准整理优势、风险顾虑及背景调查需重点核实的事项。",
          },
        ],
      },
      {
        id: "comp-service",
        name: "薪酬核对与员工服务",
        thesis: "统一考勤异动核对口径，标准化解答日常人事咨询。",
        scenarios: [
          {
            id: "payroll-audit",
            label: "月度考勤与算薪核对",
            situation: "算薪前需交叉核对考勤异常、入离职折算与调薪生效日，多表手工比对容易出现口径疏漏。",
            approach: "按企业算薪规则自动比对当月人员异动表、考勤汇总表与上月基线，列出变动差异明细。",
            boundary: "最终薪资表定稿、个税申报及银行发放指令须由薪酬主管与财务复核签批。",
            deliverableTitle: "月度算薪变动差异核对清单",
            deliverableTag: "薪酬核查 · 待复核",
            deliverablePoints: [
              "新入职、离职及调薪人员折算天数逐笔核对",
              "考勤补卡与假期抵扣异常记录提示",
              "部门人力成本环比变动简要说明",
            ],
            sources: ["薪酬福利管理办法", "当月人事异动表", "考勤月度汇总"],
            templateRole: "薪酬核算核对助手",
            promptExample:
              "请依据《薪酬福利管理办法》比对本月人事异动表与考勤汇总表，列出所有环比变动超出常规范围的人员明细及原因供复核。",
          },
          {
            id: "onboarding-qa",
            label: "入职指引与制度问答",
            situation: "新员工关于报销、考勤、福利申领的重复问询密集，分散占用人事日常精力。",
            approach: "连接现行行政人事制度与入职手册，按员工所在部门提供带制度原文链接的办理清单与解答。",
            boundary: "超出常规制度的例外申请，自动提示转交对应 HRBP 人工处理。",
            deliverableTitle: "带制度出处的入职首周办理清单",
            deliverableTag: "员工服务 · 原文溯源",
            deliverablePoints: [
              "首周必办事项与办公系统开通指引",
              "关联生效制度章节的常见政策解答",
              "需人工审批事项的对应流程入口",
            ],
            sources: ["新员工入职指南", "行政与福利管理制度"],
            templateRole: "员工制度问答助手",
            promptExample:
              "请为本周入职产品部门的新同事生成首周办理清单，并附上弹性考勤与设备申领规定的对应制度章节出处。",
          },
        ],
      },
    ],
  },
  {
    slug: "finance",
    name: "财务",
    shortLabel: "财务",
    tagline: "减少跨表手工核对，让每笔差异直达原始单据。",
    summary: "围绕报销票据初审、多渠道往来对账与月度经营简报，提升单据核查与底稿整理效率。",
    heroDescription:
      "连接财务报销规范、采购合同台账与业务流水，辅助财务团队完成日常票据初审、跨系统对账差异定位与经营分析底稿汇总，资金支付与正式入账严格保留人工终审。",
    bullets: [
      "日常费用报销票据与合同付款条款初审",
      "多渠道结算单与订单台账差异自动定位",
      "月度预算执行偏差归因与分析底稿整理",
    ],
    highlights: [
      { label: "准则与单据逐笔对应", detail: "每条差异结论直接关联原始台账行号、发票与合同条款" },
      { label: "统一跨期对账口径", detail: "将退货、折让与分批付款核对规则固化为可复用流程" },
      { label: "支付与入账人工签批", detail: "仅输出核对清单与底稿草案，不直接触发资金划转或总账记账" },
    ],
    tags: ["报销初审", "往来对账", "经营分析"],
    relatedCapabilities: ["automations", "knowledge", "employees"],
    ctaTitle: "用一份真实的对账或审核规则，验证财务提效空间",
    ctaDescription: "选取一项高频对账或票据核查流程，共同确认脱敏样例、核对口径与验收标准。",
    pocScenario: "数字员工与业务工作",
    subgroups: [
      {
        id: "reconcile-audit",
        name: "费用初审与往来对账",
        thesis: "先把规则明确的单据比对与差异归类做扎实，让财务人员聚焦异常判断。",
        scenarios: [
          {
            id: "channel-reconcile",
            label: "多渠道结算对账核查",
            situation: "月末需比对多平台结算明细与内部出库订单台账，跨期入账与促销折让手工排查耗时。",
            approach: "按订单号与财务确认口径自动对齐多源台账，筛出金额不一致记录并按差异原因归组。",
            boundary: "调账凭证录入与最终结算单签字确认由财务主管审核执行。",
            deliverableTitle: "月度往来对账差异核查表",
            deliverableTag: "对账核查 · 附原始行号",
            deliverablePoints: [
              "自动核平订单统计与未核平差异单明细",
              "按跨期结算、退货及折让分类的差异原因说明",
              "每笔差异关联的原始结算单与订单行号索引",
            ],
            sources: ["渠道结算明细表", "内部订单出库台账", "收入确认核算规范"],
            templateRole: "财务往来对账助手",
            promptExample:
              "请按《收入确认核算规范》比对 3 月渠道结算明细与内部出库台账，列出所有金额不一致订单并按差异原因分类汇总。",
          },
          {
            id: "expense-check",
            label: "费用报销与付款合同初审",
            situation: "大量差旅与采购付款申请需逐单核对职级标准、发票要素及合同付款节点。",
            approach: "对照费用管理制度与采购合同台账，核查票据金额、标准上限与验收附件完备性。",
            boundary: "超标豁免审批、付款放行与账务处理由财务审核岗人工决定。",
            deliverableTitle: "报销与付款单据合规初审单",
            deliverableTag: "单据初审 · 待复核",
            deliverablePoints: [
              "差旅及业务招待标准符合性逐项检查记录",
              "关联合同累计已付比例与本次申请核对",
              "缺少验收单或超标需补充说明的单据列表",
            ],
            sources: ["差旅与费用报销制度", "采购合同付款台账"],
            templateRole: "费用合规初审助手",
            promptExample:
              "请对照《费用报销制度》核查本批市场活动付款申请与对应供应商合同付款条款，标出缺少验收附件或超预算科目的单据。",
          },
        ],
      },
      {
        id: "fpna-report",
        name: "预算与经营分析",
        thesis: "快速汇总各部门预算执行波动，把时间留给业务原因深挖。",
        scenarios: [
          {
            id: "budget-variance",
            label: "月度预算执行偏差简报",
            situation: "各部门月度费用科目众多，逐一对比预算基线并整理波动说明占用大量报表周期。",
            approach: "汇总部门实际发生额与预算表，定位超支或显著偏离科目并关联当月主要项目支出记录。",
            boundary: "预算调整审批与正式经营分析报告定稿由财务分析负责人确认。",
            deliverableTitle: "部门预算执行偏差分析底稿",
            deliverableTag: "经营分析 · 数据溯源",
            deliverablePoints: [
              "各部门核心科目预算执行率与环比变动表",
              "主要超支科目关联的大额支出明细摘录",
              "待业务部门补充说明的异常波动问题清单",
            ],
            sources: ["年度部门预算基线表", "月度科目明细账"],
            templateRole: "经营分析整理助手",
            promptExample:
              "请对比本季度各部门研发与市场费用实际发生额与预算基线，整理偏差超过 10% 的科目明细及关联大额项目记录。",
          },
        ],
      },
    ],
  },
  {
    slug: "sales",
    name: "销售",
    shortLabel: "销售",
    tagline: "快速准备客户简报与标书应答，把精力聚焦客户沟通。",
    summary: "整合产品资料库与过往案例，辅助客户背景梳理、招标技术应答起草与拜访复盘。",
    heroDescription:
      "面向大客户销售、售前方案与商务支持团队。SkyMythos 连接官方产品文档、标准应答库与项目记录，辅助准备客户研究简报、标书点对点响应初稿与跟进纪要，商务报价与投标承诺始终由管理层审定。",
    bullets: [
      "目标客户业务动态与历史合作背景梳理",
      "招标文件评分点拆解与技术应答初稿生成",
      "客户拜访纪要结构化提炼与跟进事项汇总",
    ],
    highlights: [
      { label: "严格基于核准产品库", detail: "方案与应答内容均引用已发布产品白皮书与核准案例" },
      { label: "售前经验团队共享", detail: "将优秀标书应答章节与异议解答沉淀为销售团队共用资产" },
      { label: "报价与承诺人工审批", detail: "商务折扣、定制开发承诺与正式封标递交须经管理层签批" },
    ],
    tags: ["客户背调", "标书响应", "商机复盘"],
    relatedCapabilities: ["skybot", "knowledge", "employees"],
    ctaTitle: "带一份真实的产品资料与招标需求，体验售前协同提效",
    ctaDescription: "围绕标书拆解或方案准备场景，验证知识引用准确度与成稿质量。",
    pocScenario: "数字员工与业务工作",
    subgroups: [
      {
        id: "rfp-proposal",
        name: "方案与标书响应",
        thesis: "把繁琐的条款拆解与标准章节撰写交给数字员工，售前专家专注核心架构设计。",
        scenarios: [
          {
            id: "rfp-draft",
            label: "招标文件拆解与技术应答",
            situation: "大型项目招标书动辄数百页，短时间内人工排查废标项、对齐评分点并撰写应答极易疏漏。",
            approach: "提取招标书资格要求、评分细则与技术需求表，匹配企业产品知识库生成点对点应答初稿并标出偏离项。",
            boundary: "定制开发承诺、商务报价及最终投标文件递交必须由售前及销售负责人评审签批。",
            deliverableTitle: "标书评分点对照表与技术应答初稿",
            deliverableTag: "售前响应 · 附产品库出处",
            deliverablePoints: [
              "实质性废标项与高分值评分项定位清单",
              "关联官方产品白皮书的点对点技术应答初稿",
              "需研发或法务额外确认的技术与合同偏离项",
            ],
            sources: ["产品功能白皮书", "标准招投标技术应答库"],
            templateRole: "售前标书响应助手",
            promptExample:
              "请拆解附件招标文件第三章技术要求与评分标准，对照产品知识库生成点对点技术应答初稿，并单独列出需研发确认的定制需求。",
          },
          {
            id: "account-brief",
            label: "客户背景梳理与拜访提纲",
            situation: "首次拜访重点客户前，需要跨多处搜集客户业务布局、历史接触记录与同行业痛点参考。",
            approach: "整合内部历史商机记录、公开年报动态与同类型解决方案资料，生成一页式客户简报与沟通提纲。",
            boundary: "对外发送的定制演示材料与合作条件由客户经理确认。",
            deliverableTitle: "目标客户背景简报与拜访提纲",
            deliverableTag: "商机准备 · 快速对齐",
            deliverablePoints: [
              "客户业务重点、数字化现状与历史沟通摘要",
              "建议切入的 3 个高相关业务场景与参考案例",
              "高层拜访核心提问清单与待核实需求点",
            ],
            sources: ["历史商机沟通记录", "核准行业解决方案库"],
            templateRole: "大客户研究助手",
            promptExample:
              "请结合内部过往沟通纪要与制造行业解决方案库，整理下周拜访该客户信息部负责人的背景简报与需求调研提纲。",
          },
        ],
      },
    ],
  },
  {
    slug: "legal",
    name: "法务",
    shortLabel: "法务",
    tagline: "对照企业标准范本，快速识别合同风险条款。",
    summary: "辅助日常采购与销售合同比对、内部制度合规检索及关键履约节点梳理。",
    heroDescription:
      "面向企业法务与合规风控团队。严格依据法务部维护的标准合同范本与审查红线清单，逐条比对相对方合同文本、提示风险条款并给出示范修改措辞，正式法律意见与用印放行由法务人员把关。",
    bullets: [
      "非标合同对照审查红线逐条比对预警",
      "附带企业标准示范条款的修订建议初稿",
      "长周期合同关键履约与违约责任节点提取",
    ],
    highlights: [
      { label: "严格对齐审查红线", detail: "按企业自有范本与法务口径比对，不输出脱离制度的泛泛建议" },
      { label: "原条款逐句对照", detail: "每条修改意见直接对应原合同具体条款编号与风险等级" },
      { label: "法律意见由人出具", detail: "商业风险豁免决策与最终合同用印审批均由法务顾问确认" },
    ],
    tags: ["合同预审", "条款比对", "合规检索"],
    relatedCapabilities: ["knowledge", "employees", "skybot"],
    ctaTitle: "用一份企业标准范本，验证日常合同预审准确度",
    ctaDescription: "选取一类高频采购或销售合同，验证红线条款识别与修订建议质量。",
    pocScenario: "数字员工与业务工作",
    subgroups: [
      {
        id: "contract-review",
        name: "日常合同审查与履约管理",
        thesis: "将常规条款核对标准化前置，让法务顾问专注高复杂度商业谈判。",
        scenarios: [
          {
            id: "vendor-contract",
            label: "采购与销售合同条款比对",
            situation: "业务提交的外部格式合同数量大，逐份排查违约上限、知识产权与争议管辖耗时。",
            approach: "将对方文本与公司标准范本及《合同审查指引》逐条对比，定位不对等或缺失条款并生成修订批注初稿。",
            boundary: "核心风险让步、最终法律意见出具与用印审批由法务顾问决定。",
            deliverableTitle: "合同风险条款比对与修订建议单",
            deliverableTag: "法务预审 · 附指引依据",
            deliverablePoints: [
              "命中企业红线或不对等责任的条款编号与风险说明",
              "对应公司标准范本的替换措辞建议",
              "需业务部门同步核实的验收与付款前置条件",
            ],
            sources: ["企业标准合同范本库", "合同法律审查指引"],
            templateRole: "合同合规预审助手",
            promptExample:
              "请对照公司《采购合同法律审查指引》，逐条检查本份供应商合同中的保密期限、知识产权归属与违约责任条款，输出修订建议表。",
          },
        ],
      },
    ],
  },
  {
    slug: "operations",
    name: "市场与运营",
    shortLabel: "市场与运营",
    tagline: "归集多渠道客户声音，沉淀标准运营与传播流程。",
    summary: "覆盖产品传播物料多端改写、多渠道客户反馈聚类分析与日常运营 SOP 整理。",
    heroDescription:
      "面向市场传播、用户运营与客户体验团队。整合产品白皮书、品牌口径规范与客服工单数据，辅助快速准备多渠道宣传初稿、周度客户反馈归因报告与标准化服务手册，对外发布与客诉承诺由负责人审定。",
    bullets: [
      "多渠道客服工单与用户评价自动去重聚类",
      "遵循品牌术语规范的多平台内容改写初稿",
      "高频客诉处置与门店渠道巡检 SOP 整理",
    ],
    highlights: [
      { label: "口径对齐官方资料", detail: "内容生成严格关联最新产品发布说明与品牌规范库" },
      { label: "反馈结论直达原话", detail: "每类体验问题均保留原始工单编号与客户原话依据" },
      { label: "公开发布人工终审", detail: "对外发稿、活动承诺与客诉赔付方案须经运营负责人审批" },
    ],
    tags: ["内容筹备", "反馈归因", "运营 SOP"],
    relatedCapabilities: ["skybot", "automations", "knowledge"],
    ctaTitle: "结合真实运营周报或内容筹备流程，验证团队提效效果",
    ctaDescription: "选取客户反馈汇总或物料准备场景，验证分类准确度与品牌口径一致性。",
    pocScenario: "数字员工与业务工作",
    subgroups: [
      {
        id: "voc-content",
        name: "客户声音归因与内容协同",
        thesis: "把繁杂的信息汇总与初稿改写交给数字员工，运营团队聚焦策略创意与服务决策。",
        scenarios: [
          {
            id: "ticket-clustering",
            label: "多渠道客户反馈聚类周报",
            situation: "工单、社群与问卷中的客户声音分散杂乱，每周人工分类统计并摘录典型案例耗时。",
            approach: "按业务环节自动去重归类当周反馈，统计高频问题变化并附带原始工单编号与原话摘录。",
            boundary: "改进排期建议与对外正式答复口径由运营及产品负责人确认。",
            deliverableTitle: "周度客户体验反馈归因简报",
            deliverableTag: "体验运营 · 原文可查",
            deliverablePoints: [
              "按业务流程分类的高频问题占比与环比变化",
              "前三类焦点问题关联的真实工单编号与原话",
              "建议跨部门协同跟进的优先改进清单",
            ],
            sources: ["客服工单周度导出表", "产品服务说明手册"],
            templateRole: "客户声音分析助手",
            promptExample:
              "请汇总本周 180 条客户服务工单，按账号开通、权限配置、账单开票等主题归类，并附上高频问题的典型工单编号。",
          },
        ],
      },
    ],
  },
  {
    slug: "product",
    name: "产品",
    shortLabel: "产品",
    tagline: "带着真实客户依据规划需求，减少跨团队评审返工。",
    summary: "衔接多源需求反馈与历史方案文档，辅助需求归因、PRD 边界自检与跨部门发布同步。",
    heroDescription:
      "面向产品规划、业务分析与项目管理角色。在统一项目空间中关联客户反馈、历史需求归档与权限规范，辅助整理迭代优先级依据、评审前排查遗漏异常分支，并生成面向销售与客服的发布材料。",
    bullets: [
      "多源客户需求去重归因与优先级证据整理",
      "PRD 权限边界与异常状态分支完整性预检",
      "面向业务与客服团队的版本更新说明生成",
    ],
    highlights: [
      { label: "每条建议挂回来源", detail: "需求分析直接关联原始客户访谈、工单与历史版本决策" },
      { label: "评审前暴露遗漏点", detail: "对照既有系统规则提前检查空状态、权限与兼容影响" },
      { label: "排期与取舍归人", detail: "产品路线图、需求取舍与上线窗口始终由产品负责人拍板" },
    ],
    tags: ["需求归因", "方案预检", "发布同步"],
    relatedCapabilities: ["skybot", "employees", "knowledge"],
    ctaTitle: "用一份真实需求或反馈材料，体验有据可查的产品协同",
    ctaDescription: "选取一个迭代周期的需求整理或方案预检场景，验证团队知识复用效果。",
    pocScenario: "数字员工与业务工作",
    subgroups: [
      {
        id: "prd-readiness",
        name: "方案预检与跨部门同步",
        thesis: "在进入研发排期前把异常分支和历史约束理清，降低迭代返工成本。",
        scenarios: [
          {
            id: "prd-boundary-check",
            label: "PRD 异常分支与权限预检",
            situation: "复杂 B 端功能涉及多级角色权限与历史状态兼容，评审会上容易因遗漏边界反复修改。",
            approach: "对照平台既有权限规范与关联模块文档审阅 PRD 初稿，列出未明确的异常流程与口径冲突点。",
            boundary: "业务规则定稿与技术实现取舍由产品经理与研发负责人评审决定。",
            deliverableTitle: "PRD 边界完整性预检清单",
            deliverableTag: "评审准备 · 关联历史规范",
            deliverablePoints: [
              "成员调岗、配额耗尽等未覆盖边界场景提示",
              "与现行线上计费或权限规则存在潜在冲突的条款",
              "建议在评审前对齐的数据埋点与验收指标",
            ],
            sources: ["工作空间权限设计规范", "历史版本需求归档"],
            templateRole: "产品方案预检助手",
            promptExample:
              "请结合《工作空间权限设计规范》，检查本篇《部门配额管理 PRD 初稿》是否遗漏了跨部门调岗、配额超限及降级回收时的处理逻辑。",
          },
        ],
      },
    ],
  },
  {
    slug: "engineering",
    name: "软件研发",
    shortLabel: "软件研发",
    tagline: "在独立受控环境中推进需求实现、验证与变更预审。",
    summary: "结合代码仓库约定分阶段完成方案梳理、编码测试与风险预审，主干合入由工程师把关。",
    heroDescription:
      "面向业务研发、架构与平台工程团队。将需求说明、代码仓库与团队工程规范组织为清晰的多阶段流程，在独立隔离环境中执行修改与自动化测试，交付完整变更摘要与检查日志。",
    bullets: [
      "结合仓库规范生成可审查代码变更与测试记录",
      "大型提交潜在回归风险与测试缺口前置预审",
      "线上异常变更线索聚合与架构决策沉淀入库",
    ],
    highlights: [
      { label: "任务级独立隔离环境", detail: "每个研发任务在独立受控环境中构建验证，不触碰生产网络" },
      { label: "附带完整验证证据", detail: "以逐文件变更对比、构建记录与单测结果完成交接" },
      { label: "合并与上线权归团队", detail: "自动化检查通过不代表自动合入，代码审查与发布由工程师确认" },
    ],
    tags: ["需求到变更", "代码预审", "工程知识"],
    relatedCapabilities: ["flows", "environments", "knowledge"],
    ctaTitle: "带一个真实研发模块，验证从需求分析到变更审查的完整流程",
    ctaDescription: "选取一项边界清晰的功能开发或单测补齐任务，共同核对隔离环境与验收标准。",
    pocScenario: "自主研发与工程交付",
    subgroups: [
      {
        id: "feature-delivery",
        name: "功能开发与变更预审",
        thesis: "让代码上下文、团队规范与自动化检查沿标准阶段推进，减轻高频重复劳动。",
        scenarios: [
          {
            id: "req-to-change",
            label: "业务需求实现与验证交付包",
            situation: "推进跨模块需求时，工程师需反复查阅历史接口约定、编写单测并整理评审说明。",
            approach: "关联需求文档与仓库规范，在独立环境中依次完成方案梳理、代码修改与单测验证，打包输出变更对比与检查日志。",
            boundary: "代码审查通过、合入主干分支及生产发布严格由研发工程师确认。",
            deliverableTitle: "代码变更草案与验证记录包",
            deliverableTag: "研发交付 · 待人工 Review",
            deliverablePoints: [
              "对应需求项的逐文件代码变更对比与影响面说明",
              "独立环境内实际运行的构建与单元测试输出日志",
              "显式标注的未覆盖边界与待维护者确认点",
            ],
            sources: ["需求规格文档", "仓库工程规范", "单元测试检查记录"],
            templateRole: "工程交付协作助手",
            promptExample:
              "请阅读订单导出需求说明与当前服务目录约定，在隔离环境中实现按部门筛选导出接口，补充对应单元测试并输出变更影响摘要。",
          },
          {
            id: "pr-precheck",
            label: "大型变更风险前置预审",
            situation: "跨文件大型变更人工评审耗时长，容易被琐碎格式分散精力而遗漏边界回归风险。",
            approach: "对照团队编码规范与历史故障反例扫描变更内容，标出潜在空指针、并发边界与缺失测试项。",
            boundary: "预审清单仅作评审辅助参考，最终是否批准合入由模块维护者决定。",
            deliverableTitle: "代码变更风险预审清单",
            deliverableTag: "评审辅助 · 附规范出处",
            deliverablePoints: [
              "按影响程度排序的逻辑边界与兼容性风险提示",
              "关联团队既有规范或历史复盘的具体条款出处",
              "建议补充的回归测试用例清单",
            ],
            sources: ["团队代码评审规范", "历史故障复盘库"],
            templateRole: "代码预审助手",
            promptExample:
              "请对照《后端服务评审规范》与支付模块历史复盘记录，检查本次提交在幂等处理、超时重试与异常回滚上的潜在遗漏。",
          },
        ],
      },
    ],
  },
  {
    slug: "it-admin",
    name: "IT 与管理",
    shortLabel: "IT 与管理",
    tagline: "统一管控私有化环境、分级权限与内部服务支持。",
    summary: "提供私有集群接入治理、部门级权限巡检、多模型配额管理与内部 IT 自助答疑。",
    heroDescription:
      "面向企业数字化负责人、信息安全团队与系统管理员。将私有化环境边界、企业账号权限同步、大模型服务接入与全链路操作日志收敛在同一管理视图中，保障全公司稳健受控推广。",
    bullets: [
      "部门工作空间资料隔离与调岗权限变动巡检",
      "企业自建与商业大模型接口统一接入与配额统计",
      "常见办公软件、网络与账号工单自助答疑分流",
    ],
    highlights: [
      { label: "架构与数据流清晰", detail: "模型接口、内部资料库与办公工具连接范围逐项可控" },
      { label: "权限与个人密钥分离", detail: "团队共享数字员工配置不暴露个人凭据，系统密钥集中加密托管" },
      { label: "安全策略管理员审批", detail: "跨部门权限开通与外部连接放行均须经 IT 管理员核准" },
    ],
    tags: ["私有化治理", "权限审计", "IT 服务台"],
    relatedCapabilities: ["environments", "automations", "knowledge"],
    ctaTitle: "与我们的架构团队核对私有化环境与安全接入清单",
    ctaDescription: "围绕现有集群基础设施、身份系统与模型服务条件，共同明确部署与治理方案。",
    pocScenario: "私有部署与企业治理",
    subgroups: [
      {
        id: "access-governance",
        name: "组织权限与操作合规巡检",
        thesis: "让多部门规模化使用时的权限边界、模型消耗与外部调用始终清晰可控。",
        scenarios: [
          {
            id: "permission-audit",
            label: "跨部门权限与操作日志巡检",
            situation: "多团队共用平台后，IT 需定期核查跨部门知识库隔离状态、人员调岗权限回收及关键审批记录。",
            approach: "汇总各工作空间成员变动、知识库授权范围与外部工具调用日志，筛出待回收席位与越权尝试记录。",
            boundary: "权限回收、账号冻结及安全策略变更由企业 IT 管理员核准执行。",
            deliverableTitle: "月度权限合规与用量巡检简报",
            deliverableTag: "平台治理 · 审计留痕",
            deliverablePoints: [
              "各部门工作空间成员与角色变动核对表",
              "调岗或离职后待收敛的历史访问权限提示",
              "各部门大模型调用消耗与关键操作审批统计",
            ],
            sources: ["企业信息安全管理规范", "平台访问与操作审计日志"],
            templateRole: "IT 权限与审计助手",
            promptExample:
              "请梳理本月各部门工作空间的成员调岗记录与访问日志，列出调岗后仍保留原部门知识库读取权限的账号名单供管理员复核。",
          },
        ],
      },
    ],
  },
];

const enSolutions: RoleSolution[] = [
  {
    slug: "hr",
    name: "HR",
    shortLabel: "HR",
    tagline: "Structured checklists and cited policy backing for everyday HR work.",
    summary: "Cover candidate screening, compliance document drafting, payroll checks and employee policy Q&A.",
    heroDescription:
      "Connect internal HR policies, job requirements and personnel ledgers to assist with structured resume comparison, labor compliance drafts and monthly payroll verification, keeping hiring, issuance and grading decisions firmly with HR.",
    bullets: [
      "Structured candidate screening against role criteria",
      "Labor compliance document drafts backed by internal policy",
      "Monthly attendance, changes and payroll cross-checks",
    ],
    highlights: [
      { label: "4 core HR domains", detail: "Recruiting · Employee relations · Payroll & performance · Employee service" },
      { label: "Cited policy passages", detail: "Every rule check links directly to the active handbook or contract clause" },
      { label: "Human sign-off on HR calls", detail: "Hiring, formal notices and final payroll release require HR approval" },
    ],
    tags: ["Recruiting", "Compliance", "Payroll checks", "Policy Q&A"],
    relatedCapabilities: ["employees", "knowledge", "automations"],
    ctaTitle: "Validate an HR workflow with your real policy handbook",
    ctaDescription: "Pick one high-frequency recruiting, compliance or payroll check workflow to verify accuracy and boundaries.",
    pocScenario: "AI employees & operational work",
    subgroups: [
      {
        id: "employee-relations",
        name: "Employee Relations & Compliance",
        thesis: "Verify handbook rules and contract clauses upfront before issuing formal HR documents.",
        scenarios: [
          {
            id: "compliance-doc",
            label: "Compliance document drafting",
            situation: "Role transfers, renewals and formal notices require cross-checking contract terms and handbook rules under tight timelines.",
            approach: "Reference contract terms and the active Employee Handbook to draft standardized notices alongside a procedural checklist.",
            boundary: "Formal sealing, delivery to employees and communication plans require HR lead and legal sign-off.",
            deliverableTitle: "Role Transfer Confirmation Draft & Checklist",
            deliverableTag: "HR Compliance · Awaiting review",
            deliverablePoints: [
              "Exact Employee Handbook clauses and contract terms cited",
              "Required acknowledgment steps and filing checklist",
              "Compensation transition items flagged for HR verification",
            ],
            sources: ["Employee Handbook", "Standard Employment Contract", "HR SOP"],
            templateRole: "HR Compliance Assistant",
            promptExample:
              "Using Chapter 4 of the Employee Handbook and the attached transfer meeting notes, draft a Role Transfer Confirmation notice and list the supporting records HR must verify beforehand.",
          },
          {
            id: "offboarding-check",
            label: "Offboarding & handover verification",
            situation: "Employee offboarding spans document handover, access revocation, leave calculation and NDA checks across teams.",
            approach: "Generate a role-specific offboarding checklist, calculate unused leave balances and surface confidentiality terms.",
            boundary: "Release letters, severance terms and non-compete activation are approved by HRBP and management.",
            deliverableTitle: "Offboarding & Access Revocation Checklist",
            deliverableTag: "Handover · Policy-cited",
            deliverablePoints: [
              "Asset, document and system access revocation checklist",
              "Unused annual leave calculation against attendance cutoff",
              "Confidentiality and non-compete agreement status summary",
            ],
            sources: ["Offboarding Policy", "Leave Calculation Rules"],
            templateRole: "HR Operations Coordinator",
            promptExample:
              "Generate an engineering offboarding checklist per our Offboarding Policy and calculate remaining unused annual leave up to the departure date.",
          },
        ],
      },
      {
        id: "talent-acquisition",
        name: "Recruiting & Talent Acquisition",
        thesis: "Turn job specs, resumes and interview notes into consistent evaluation references.",
        scenarios: [
          {
            id: "resume-screening",
            label: "Batch resume comparison",
            situation: "High-volume hiring makes aligning screening criteria across recruiters and hiring managers slow and inconsistent.",
            approach: "Break job requirements into core criteria, extract candidate project history into a comparison matrix and suggest follow-up questions.",
            boundary: "Shortlists and hiring decisions remain entirely with hiring managers and recruiters.",
            deliverableTitle: "Candidate Match Matrix & Interview Prompts",
            deliverableTag: "Recruiting · Cited excerpts",
            deliverablePoints: [
              "Candidate-by-candidate comparison against required experience",
              "Relevant project highlights and timeline gaps to verify",
              "Suggested first-round interview verification questions",
            ],
            sources: ["Role Job Description", "Interview Rubric"],
            templateRole: "Talent Screening Assistant",
            promptExample:
              "Compare these 15 resumes against the Senior Supply Chain Planner JD, build a structured match summary and highlight key project details to probe in round one.",
          },
        ],
      },
      {
        id: "comp-service",
        name: "Payroll Checks & Employee Service",
        thesis: "Standardize monthly payroll cross-checks and everyday policy answers.",
        scenarios: [
          {
            id: "payroll-audit",
            label: "Monthly attendance & payroll check",
            situation: "Reconciling attendance exceptions, prorated hires and salary adjustments across spreadsheets is error-prone.",
            approach: "Cross-check monthly personnel changes and attendance logs against the prior payroll baseline to flag variances.",
            boundary: "Final payroll sign-off, tax filing and bank disbursement require compensation and finance approval.",
            deliverableTitle: "Monthly Payroll Variance Checklist",
            deliverableTag: "Payroll · Awaiting sign-off",
            deliverablePoints: [
              "Prorated day checks for new hires, departures and transfers",
              "Attendance exception and leave deduction flags",
              "Month-over-month department headcount cost variance summary",
            ],
            sources: ["Compensation Policy", "Monthly Roster Changes", "Attendance Summary"],
            templateRole: "Payroll Verification Assistant",
            promptExample:
              "Cross-check this month’s roster changes and attendance summary against our Compensation Policy and list every variance above threshold for review.",
          },
        ],
      },
    ],
  },
  {
    slug: "finance",
    name: "Finance",
    shortLabel: "Finance",
    tagline: "Cut manual spreadsheet reconciliation with every variance traced to source.",
    summary: "Streamline expense pre-audits, multi-channel ledger reconciliation and monthly variance briefs.",
    heroDescription:
      "Connect expense policies, vendor contract ledgers and transaction statements to assist finance teams with voucher pre-checks, cross-ledger variance localization and monthly reporting workpapers, keeping disbursements and journal entries under human approval.",
    bullets: [
      "Expense voucher pre-checks against policy & contract milestones",
      "Automated multi-channel settlement vs. order ledger matching",
      "Monthly budget variance attribution & reporting workpapers",
    ],
    highlights: [
      { label: "Row-level provenance", detail: "Every flagged discrepancy links back to exact ledger rows and vouchers" },
      { label: "Consistent cutoff rules", detail: "Codify refunds, rebates and cross-period rules into reusable workflows" },
      { label: "Human payment sign-off", detail: "Outputs audit checklists only; never triggers disbursements or ledger postings" },
    ],
    tags: ["Expense audit", "Reconciliation", "FP&A briefs"],
    relatedCapabilities: ["automations", "knowledge", "employees"],
    ctaTitle: "Validate a finance reconciliation or audit rule with sample ledgers",
    ctaDescription: "Bring one recurring reconciliation workflow to align on data boundaries and verification criteria.",
    pocScenario: "AI employees & operational work",
    subgroups: [
      {
        id: "reconcile-audit",
        name: "Expense Pre-Audit & Reconciliation",
        thesis: "Automate rule-based matching first so finance specialists focus on resolving true exceptions.",
        scenarios: [
          {
            id: "channel-reconcile",
            label: "Multi-channel settlement reconciliation",
            situation: "Month-end matching across channel statements and internal order ledgers takes hours of manual lookup.",
            approach: "Align statements by order ID and revenue rules, isolating mismatched entries grouped by root cause.",
            boundary: "Adjustment entries and settlement sign-off are executed by finance supervisors.",
            deliverableTitle: "Monthly Reconciliation Variance Schedule",
            deliverableTag: "Reconciliation · Row-indexed",
            deliverablePoints: [
              "Matched order totals alongside itemized discrepancy records",
              "Variances grouped by timing cutoffs, returns and promotional rebates",
              "Exact source statement and order ledger row references",
            ],
            sources: ["Channel Settlement Statement", "Order Shipment Ledger", "Revenue Policy"],
            templateRole: "Reconciliation Analyst Assistant",
            promptExample:
              "Reconcile the March channel settlement statement against our internal shipment ledger per Revenue Policy, grouping all mismatched orders by cause.",
          },
        ],
      },
    ],
  },
  {
    slug: "sales",
    name: "Sales",
    shortLabel: "Sales",
    tagline: "Prepare account briefs and RFP responses faster with approved product facts.",
    summary: "Connect approved product docs and case libraries for account research, RFP responses and call follow-ups.",
    heroDescription:
      "Built for enterprise account executives and solutions consultants. Reference official whitepapers, security FAQs and historical deal notes to draft account briefs and point-by-point RFP responses while keeping pricing and contractual commitments human-approved.",
    bullets: [
      "Account background briefs combining history & public updates",
      "RFP requirement breakdown & cited technical response drafts",
      "Structured meeting takeaways and next-step preparation",
    ],
    highlights: [
      { label: "Grounded in approved docs", detail: "Answers cite released product documentation and approved case studies" },
      { label: "Shared presales playbook", detail: "Turn winning RFP answers into reusable templates for the whole team" },
      { label: "Human approval on quotes", detail: "Discounts, custom roadmap promises and formal bid submissions require sign-off" },
    ],
    tags: ["Account briefs", "RFP responses", "Deal follow-up"],
    relatedCapabilities: ["skybot", "knowledge", "employees"],
    ctaTitle: "Test presales RFP response drafting against your product library",
    ctaDescription: "Bring a sample RFP questionnaire and product documentation to evaluate citation accuracy.",
    pocScenario: "AI employees & operational work",
    subgroups: [
      {
        id: "rfp-proposal",
        name: "RFP Responses & Account Preparation",
        thesis: "Automate requirement mapping and baseline answers so presales engineers focus on solution architecture.",
        scenarios: [
          {
            id: "rfp-draft",
            label: "RFP breakdown & technical response",
            situation: "Enterprise RFPs contain hundreds of compliance and technical items requiring rapid cross-checking.",
            approach: "Extract mandatory gates and scoring items, draft point-by-point answers citing official docs and flag gaps.",
            boundary: "Custom commitments, pricing terms and final bid submission require sales leadership approval.",
            deliverableTitle: "RFP Compliance Matrix & Draft Response",
            deliverableTag: "Presales · Doc-cited",
            deliverablePoints: [
              "Mandatory qualification gates and weighted scoring items mapped",
              "Point-by-point technical answers citing official whitepapers",
              "Deviations flagged for engineering or legal confirmation",
            ],
            sources: ["Product Whitepaper", "Approved RFP Answer Bank"],
            templateRole: "Presales RFP Assistant",
            promptExample:
              "Break down Section 3 of the attached RFP, draft point-by-point technical responses citing our Product Whitepaper and flag custom integration items for engineering.",
          },
        ],
      },
    ],
  },
  {
    slug: "legal",
    name: "Legal",
    shortLabel: "Legal",
    tagline: "Spot non-standard contract risks quickly against your playbook.",
    summary: "Compare third-party contracts against standard templates, surface redlines and track obligations.",
    heroDescription:
      "Built for in-house legal and compliance teams. Compare counterparty agreements clause-by-clause against your standard templates and review guidelines to flag risk deviations and suggest fallback language, keeping legal sign-off and sealing with counsel.",
    bullets: [
      "Clause-by-clause redline checks against company guidelines",
      "Suggested fallback wording from approved standard templates",
      "Key obligation, renewal and liability milestone extraction",
    ],
    highlights: [
      { label: "Aligned to your playbook", detail: "Evaluates terms strictly against your legal team’s approved positions" },
      { label: "Clause-level citations", detail: "Every flagged risk maps directly to the exact counterparty clause" },
      { label: "Counsel owns legal sign-off", detail: "Risk waivers, formal legal opinions and contract sealing stay human" },
    ],
    tags: ["Contract review", "Playbook redlines", "Obligation tracking"],
    relatedCapabilities: ["knowledge", "employees", "skybot"],
    ctaTitle: "Validate contract pre-screening against your legal playbook",
    ctaDescription: "Select one recurring procurement or sales agreement type to verify redline precision.",
    pocScenario: "AI employees & operational work",
    subgroups: [
      {
        id: "contract-review",
        name: "Routine Contract Pre-Screening",
        thesis: "Standardize first-pass clause comparison so legal counsel can focus on complex negotiations.",
        scenarios: [
          {
            id: "vendor-contract",
            label: "Procurement & sales contract comparison",
            situation: "High volumes of vendor paper consume counsel time on routine indemnity, IP and liability checks.",
            approach: "Compare counterparty drafts against company templates and review guidelines, outputting risk flags and fallback clauses.",
            boundary: "Commercial risk waivers, final legal opinions and contract approval remain with legal counsel.",
            deliverableTitle: "Contract Redline Summary & Fallback Clauses",
            deliverableTag: "Legal Pre-Check · Playbook-cited",
            deliverablePoints: [
              "Clauses breaching company liability, IP or confidentiality thresholds",
              "Approved standard fallback language ready for insertion",
              "Delivery and acceptance terms flagged for business owner check",
            ],
            sources: ["Standard Contract Templates", "Legal Review Playbook"],
            templateRole: "Contract Review Assistant",
            promptExample:
              "Compare this supplier agreement against our Software Procurement Review Playbook, flagging confidentiality, IP ownership and liability cap deviations with fallback wording.",
          },
        ],
      },
    ],
  },
  {
    slug: "operations",
    name: "Marketing & Ops",
    shortLabel: "Marketing & Ops",
    tagline: "Synthesize customer voice across channels and standardize team SOPs.",
    summary: "Cluster multi-channel customer feedback, adapt campaign assets to brand guidelines and maintain SOPs.",
    heroDescription:
      "For marketing, customer experience and business operations teams. Connect brand guidelines, release notes and support tickets to prepare multi-channel copy drafts, weekly feedback attribution briefs and operational SOPs with human publishing approval.",
    bullets: [
      "Multi-channel support ticket & feedback clustering with citations",
      "Campaign copy adaptation aligned to approved brand terminology",
      "Standardized customer support and channel inspection SOPs",
    ],
    highlights: [
      { label: "Consistent brand voice", detail: "Drafts reference approved product messaging and terminology guides" },
      { label: "Backed by raw tickets", detail: "Feedback themes retain ticket IDs and verbatim customer quotes" },
      { label: "Human publishing gate", detail: "External publication, campaigns and customer commitments require approval" },
    ],
    tags: ["Campaign prep", "Voice of customer", "Team SOPs"],
    relatedCapabilities: ["skybot", "automations", "knowledge"],
    ctaTitle: "Bring a weekly feedback or content workflow to test with your team",
    ctaDescription: "Validate clustering accuracy and brand consistency on real operational materials.",
    pocScenario: "AI employees & operational work",
    subgroups: [
      {
        id: "voc-content",
        name: "Customer Voice & Campaign Operations",
        thesis: "Automate repetitive aggregation and formatting so operators focus on strategy and execution.",
        scenarios: [
          {
            id: "ticket-clustering",
            label: "Weekly customer feedback synthesis",
            situation: "Feedback across tickets, chats and surveys takes hours to deduplicate and categorize manually each week.",
            approach: "Group weekly tickets by workflow stage, quantify top recurring issues and attach ticket IDs with verbatim quotes.",
            boundary: "Roadmap priorities and external customer communications are approved by operations leads.",
            deliverableTitle: "Weekly Customer Feedback Attribution Brief",
            deliverableTag: "Operations · Ticket-cited",
            deliverablePoints: [
              "Issue distribution by workflow stage with week-over-week trends",
              "Verbatim quotes and ticket IDs for the top three themes",
              "Recommended cross-team follow-up items for review",
            ],
            sources: ["Weekly Support Ticket Export", "Product Service Guide"],
            templateRole: "Customer Insights Assistant",
            promptExample:
              "Group this week’s 180 support tickets across onboarding, permissions and billing, and include representative ticket IDs for the top three recurring issues.",
          },
        ],
      },
    ],
  },
  {
    slug: "product",
    name: "Product",
    shortLabel: "Product",
    tagline: "Plan roadmaps with cited user evidence and catch spec gaps early.",
    summary: "Synthesize multi-source feedback, pre-check PRD edge cases and generate cross-team release briefs.",
    heroDescription:
      "For product managers and business analysts. Organize customer feedback, historical specs and permission rules inside shared project workspaces to back up roadmap proposals, catch missing edge cases before review and align GTM teams.",
    bullets: [
      "Multi-source feedback synthesis linked to original user quotes",
      "PRD permission & edge-case completeness pre-checks",
      "Tailored release briefs for sales, support and operations",
    ],
    highlights: [
      { label: "Evidence-backed specs", detail: "Every insight links back to customer interviews, tickets or past ADRs" },
      { label: "Fewer review round-trips", detail: "Surface missing empty states and permission edge cases upfront" },
      { label: "PMs own the roadmap", detail: "Scope trade-offs, prioritization and release timing stay human decisions" },
    ],
    tags: ["Feedback synthesis", "Spec pre-check", "Release alignment"],
    relatedCapabilities: ["skybot", "employees", "knowledge"],
    ctaTitle: "Validate spec pre-checks or feedback synthesis on a real iteration",
    ctaDescription: "Bring one upcoming feature spec or feedback batch to evaluate context continuity.",
    pocScenario: "AI employees & operational work",
    subgroups: [
      {
        id: "prd-readiness",
        name: "Spec Readiness & Release Alignment",
        thesis: "Surface edge cases and historical constraints before engineering kickoff.",
        scenarios: [
          {
            id: "prd-boundary-check",
            label: "PRD edge-case & permission pre-check",
            situation: "Enterprise features span multi-tier roles and legacy states that are easy to miss during drafting.",
            approach: "Review draft PRDs against existing permission rules and module docs to flag uncovered states and conflicts.",
            boundary: "Final business rules and scope decisions rest with product and engineering leads.",
            deliverableTitle: "PRD Completeness Pre-Check Checklist",
            deliverableTag: "Spec Review · Doc-cited",
            deliverablePoints: [
              "Uncovered role transfer, quota exhaustion and downgrade states",
              "Potential conflicts with active billing or permission rules",
              "Suggested acceptance criteria to confirm before kickoff",
            ],
            sources: ["Workspace Permission Spec", "Historical Feature Archive"],
            templateRole: "Product Spec Reviewer",
            promptExample:
              "Check this draft Department Quota PRD against our Workspace Permission Spec for missing edge cases around role transfers, quota limits and seat reclamation.",
          },
        ],
      },
    ],
  },
  {
    slug: "engineering",
    name: "Engineering",
    shortLabel: "Engineering",
    tagline: "Deliver scoped code changes, tests and pre-reviews in isolated sandboxes.",
    summary: "Run staged analysis, implementation and automated checks in isolated environments with human merge control.",
    heroDescription:
      "Built for application, platform and architecture teams. Organize requirements, repositories and team conventions into repeatable stages inside isolated environments, handing off clean diffs and test logs while keeping merges and releases human-controlled.",
    bullets: [
      "Scoped requirement implementation with build & unit test logs",
      "Pre-review risk scanning on large multi-file pull requests",
      "Incident clue aggregation and architectural decision capture",
    ],
    highlights: [
      { label: "Per-task isolated environment", detail: "Every task builds and tests in an isolated environment away from production" },
      { label: "Verifiable handoff evidence", detail: "Deliver file-by-file diffs, check outputs and explicit review notes" },
      { label: "Engineers control merges", detail: "Passing checks never auto-merges or deploys without maintainer sign-off" },
    ],
    tags: ["Scoped delivery", "PR pre-check", "Repo knowledge"],
    relatedCapabilities: ["flows", "environments", "knowledge"],
    ctaTitle: "Validate requirement-to-PR delivery on a real repository",
    ctaDescription: "Scope one focused feature or test task to verify sandbox isolation and review gates.",
    pocScenario: "Autonomous R&D & engineering delivery",
    subgroups: [
      {
        id: "feature-delivery",
        name: "Feature Delivery & Pre-Review",
        thesis: "Move from requirement spec to tested, reviewable code changes along explicit stages.",
        scenarios: [
          {
            id: "req-to-change",
            label: "Requirement to verified PR draft",
            situation: "Implementing cross-module features requires piecing together repo conventions, writing tests and summarizing impact.",
            approach: "Pair requirement specs with repo conventions inside an isolated sandbox to implement changes, run unit tests and package diffs.",
            boundary: "Code review approval, branch merges and production deployments remain strictly with engineers.",
            deliverableTitle: "Code Change Draft & Verification Bundle",
            deliverableTag: "Engineering · Awaiting review",
            deliverablePoints: [
              "File-by-file diff summary mapped to requirement items",
              "Build and unit test execution logs from the isolated environment",
              "Uncovered edge cases flagged explicitly for maintainer review",
            ],
            sources: ["Requirement Spec", "Repo Architecture Guide", "Unit Test Logs"],
            templateRole: "Engineering Delivery Assistant",
            promptExample:
              "Using the order export spec and service conventions, implement department-filtered export in an isolated sandbox, add unit tests and summarize the change scope.",
          },
        ],
      },
    ],
  },
  {
    slug: "it-admin",
    name: "IT & Admin",
    shortLabel: "IT & Admin",
    tagline: "Govern private infrastructure, workspace permissions and model usage in one place.",
    summary: "Manage self-hosted deployment boundaries, department access audits, model routing and internal IT support.",
    heroDescription:
      "Built for CIOs, security officers and platform administrators. Centralize private environment controls, directory-aligned workspace permissions, approved LLM endpoints and end-to-end audit logs for confident organization-wide adoption.",
    bullets: [
      "Department workspace isolation & role-change access audits",
      "Central routing and quota tracking for private & commercial LLMs",
      "Self-service internal IT helpdesk answers citing runbooks",
    ],
    highlights: [
      { label: "Transparent data boundaries", detail: "Model endpoints, knowledge stores and tool connectors stay explicitly scoped" },
      { label: "Isolated credentials", detail: "Sharing AI employees never exposes personal keys; secrets stay centrally managed" },
      { label: "Admin-approved policies", detail: "Cross-department access and external connectors require administrator approval" },
    ],
    tags: ["Private governance", "Access audits", "IT helpdesk"],
    relatedCapabilities: ["environments", "automations", "knowledge"],
    ctaTitle: "Review private deployment prerequisites with our architecture team",
    ctaDescription: "Align on cluster infrastructure, SSO directory integration and model endpoint policies.",
    pocScenario: "Private deployment & enterprise governance",
    subgroups: [
      {
        id: "access-governance",
        name: "Access Governance & Operational Audits",
        thesis: "Keep workspace boundaries, model consumption and external tool calls auditable across departments.",
        scenarios: [
          {
            id: "permission-audit",
            label: "Cross-department access & audit review",
            situation: "Scaling across departments requires periodic checks on workspace isolation, transfer revocations and approval logs.",
            approach: "Aggregate membership changes, knowledge scopes and tool audit logs to flag stale seats or unauthorized attempts.",
            boundary: "Access revocations, account freezes and policy changes are executed by IT administrators.",
            deliverableTitle: "Monthly Access & Usage Governance Brief",
            deliverableTag: "Governance · Audit-logged",
            deliverablePoints: [
              "Workspace membership and role-change reconciliation table",
              "Stale permissions flagged following department transfers",
              "Department LLM usage and human-approved action summary",
            ],
            sources: ["Enterprise Security Policy", "Platform Access & Audit Logs"],
            templateRole: "IT Governance Assistant",
            promptExample:
              "Review this month’s workspace transfer records and access logs to list any transferred members still holding read access to their former department’s knowledge base.",
          },
        ],
      },
    ],
  },
];

export function getRoleSolutions(locale: Locale = "en"): RoleSolution[] {
  return locale === "zh" ? zhSolutions : enSolutions;
}

export function getRoleSolution(slug: string, locale: Locale = "en"): RoleSolution | undefined {
  return getRoleSolutions(locale).find((item) => item.slug === slug);
}

export function getRoleSlugs(): RoleSlug[] {
  return zhSolutions.map((item) => item.slug);
}
