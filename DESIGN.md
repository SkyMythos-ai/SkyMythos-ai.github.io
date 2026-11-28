---
name: SkyMythos.ai
description: 以真实品牌、TDesign 语义主题与宽幅产品场景呈现企业 AI-Native Harness。
colors:
  brand-blue: '#3156FF'
  action-light: '#0052d9'
  action-hover-light: '#366ef4'
  action-dark: '#2667d4'
  accent-dark: '#699ef5'
  accent-soft-light: '#f2f3ff'
  accent-soft-dark: '#1b2f51'
  page-light: '#fff'
  raised-light: '#f3f3f3'
  text-light: '#191919'
  muted-light: '#666'
  line-light: '#ddd'
  page-dark: '#181818'
  surface-dark: '#242424'
  raised-dark: '#2c2c2c'
  text-dark: '#e8e8e8'
  muted-dark: '#b0b0b0'
  line-dark: '#393939'
  positive-light: '#2ba471'
  positive-dark: '#72c9a3'
  danger-light: '#b9433d'
  danger-dark: '#f49c96'
typography:
  display:
    fontFamily: '"PingFang SC", "Microsoft YaHei", var(--font-inter), sans-serif'
    fontSize: "clamp(48px, 4.6vw, 68px)"
    fontWeight: 600
    lineHeight: 1.32
    letterSpacing: -.035em
  headline:
    fontFamily: '"PingFang SC", "Microsoft YaHei", var(--font-inter), sans-serif'
    fontSize: 44px
    fontWeight: 550
    lineHeight: 1.35
    letterSpacing: -.03em
  lead:
    fontFamily: '"PingFang SC", "Microsoft YaHei", var(--font-inter), sans-serif'
    fontSize: 18px
    lineHeight: 1.9
  body:
    fontFamily: '"PingFang SC", "Microsoft YaHei", var(--font-inter), sans-serif'
    fontSize: 15px
    lineHeight: 1.75
  label:
    fontFamily: '"PingFang SC", "Microsoft YaHei", var(--font-inter), sans-serif'
    fontSize: 13px
    lineHeight: 22px
  product-ui:
    fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif'
    fontSize: 13px
    lineHeight: 1.5
  mono:
    fontFamily: '"Sky Mono", monospace'
    fontWeight: 400
rounded:
  control: 6px
  pill: 999px
  guide: 8px
  scene-mobile: 9px
  panel: 12px
  chip: 4px
spacing:
  field-label: 8px
  inline: 16px
  form-field: 24px
  copy-to-visual: 64px
  hero-to-product: 24px
  section: 112px
  section-opening: 120px
  mobile-section: 64px
  mobile-gutter: 20px
components:
  button-primary:
    backgroundColor: '{colors.action-light}'
    textColor: '#fff'
    rounded: '{rounded.pill}'
    padding: 12px 24px
    typography: '{typography.body}'
  button-primary-hover:
    backgroundColor: '{colors.action-hover-light}'
  button-primary-dark:
    backgroundColor: '{colors.action-dark}'
    textColor: '#fff'
  button-secondary:
    backgroundColor: '{colors.page-light}'
    textColor: '{colors.text-light}'
    rounded: '{rounded.pill}'
    padding: 12px 24px
  input-field:
    backgroundColor: '{colors.page-light}'
    textColor: '{colors.text-light}'
    rounded: '{rounded.control}'
    padding: 10px 12px
  product-scene:
    backgroundColor: '{colors.page-light}'
    textColor: '{colors.text-light}'
    rounded: '{rounded.panel}'
    height: 510px
  state-chip:
    backgroundColor: '{colors.accent-soft-light}'
    textColor: '{colors.action-light}'
    rounded: '{rounded.chip}'
    padding: 2px 6px
  poc-form:
    backgroundColor: '{colors.page-light}'
    textColor: '{colors.text-light}'
    rounded: '{rounded.panel}'
    padding: 36px
---
# Design System: SkyMythos.ai

## Overview

**Creative North Star: "电光蓝动态首屏底座 × WorkBuddy 企业版清爽架构"**

官网延续纯净白底（`#fff`）与电光蓝（`--f-accent: #0052d9`、`--f-action-hover: #366ef4`、柔蓝衬底 `#f2f3ff`；暗色 `#181818` / `#699ef5`）科技视觉体系，完整保留首屏双椭圆蓝色氛围光、四周悬浮呼吸节点与流动连线、3D 翻转胶囊标题、飞行 `S` 导览助手（`BrandCompanion`）以及随滚屏 3D 展开的 12 秒自动推演工作台（`ProductShowcase`）。

顶栏采用旗舰企业左流式全景架构（`68px` 固定页头，`max-width: 1240px`，首页首屏无痕透明、滚屏或展开下拉时平滑切换为磨砂玻璃 `var(--f-header)` + 细底线；内页及 `/docs/**` 始终保持磨砂顶栏）：
- **左流区**：`SkyMythos.ai` 官方字标 + `1px × 18px` 竖线分隔 + `产品能力 ∨`（左对齐 `880px` 全景下拉：左侧 `2 × 3` 核心平台能力矩阵 + 右侧 Harness 架构与安全边界焦点卡片） · `解决方案 ∨`（双栏分类岗位矩阵：**业务与职能协同** 与 **产研与技术治理** 8 大角色 + 行业总览/企业试点页脚入口） · `定价` · `安全合规`（独立 `/security` 专页） · `MaaS`（外链 `https://apigo.ai`）
- **右功能区（统一 `999px` 胶囊家族）**：`[语言切换 | 主题切换]` 紧凑双效子胶囊 + `1px × 16px` 竖线分隔 + 描边次级胶囊 `产品文档`（`/docs`） + 电光蓝实心胶囊主按钮 `预约演示`（`/poc`）

首页下屏贯彻「零冗余章节副标题、低密度留白、平实商业语言」原则，依次展开：一个 Agent 底座矩阵（四角纯图标短词白卡 + 中央双环 `SMH` 核心 + 底部竖线分隔四支柱） → 8 大核心岗位交互预览 → 平台能力交互探索（`CapabilityExplorer`） → 三步等轴测安全治理时间轴（`01 数据不出域 · 02 行为有边界 · 03 全程可审计`） → 席位授权概览与预约演示收口。

独立 `/security` 专页采用浅蓝正交电路网格大圆角容器（`安全合规 PRIVACY & SECURITY` + `隐私与安全` + `2 × 2` 几何图标白卡）衔接深海蓝人工确认边界演示面板。角色解决方案覆盖 8 大岗位（`hr`、`finance`、`sales`、`legal`、`operations`、`product`、`engineering`、`it-admin`），详情页采用左侧纵向场景 Tab + 右侧交付成果预览与一键复制提问示例切换。Pricing 采用纯净无中英混排的「私有化部署，按团队席位授权」（`场景试点验证` + `企业正式部署` 双卡 + 三项费用边界 + 四步推进流程），不虚构未确认的公开金额。`/docs/` 继续由 Fumadocs 驱动且保持技术文档独立性。

**Key Characteristics:**

- 宽幅留白、首页居中首屏与工作胶囊，随后展开产品场景。
- SkyMythos.ai 官方亮暗标志与 TDesign 蓝色语义主题。
- 中性色表面、细边线和轻阴影，按状态使用蓝色、绿色与错误色。
- 官网阅读与产品界面采用不同密度；手机重排内容。
- 以联系团队开展 POC 为主要转化，保留可用的键盘和反馈状态。

当前实现权威为 `src/app/fusion-theme.css`、`src/components/sites/fusion/site.module.css`、`home.module.css`、`site-motion.tsx`、`hero-motion.tsx`、`hero-motion.module.css`、`brand-mark.tsx`、`brand-mark.module.css`、`brand-shape.ts`、`brand-companion.tsx`、`brand-companion.module.css`、`governance-scene.tsx`、`capability-explorer.tsx`、`capability-explorer.module.css`、`capability-scenes.tsx`、`capability-scenes.module.css`、`showcase.module.css`、`poc.module.css` 与 `src/app/layout.tsx`。新产品主题来源记录在 `docs/research/fusion/product-tokens.json`；提取文档保留产品来源值，但官网实际语义映射以已实现 CSS 为准。`.impeccable/config.json` 继续使用 `buildPath: code`。

## Colors

### Primary

品牌蓝出现在官方标志中；交互蓝用于 POC 主行动、链接、选中项、焦点与产品状态。品牌蓝与交互蓝承担不同职责，不强制改成同一个色值。

`.impeccable/design.json` 的八阶 OKLCH 色带仅是面板浏览元数据；它们按现有蓝色与状态色相合成，不是新增的应用色阶或 CSS 变量。

首页首屏与 POC 章节以主题强调色混合背景形成淡蓝氛围；治理章节局部使用 `#111624` 背景和 `#1b2132` 表面及对应文字、边线变量，不替换全站暗色主题。

亮色与暗色主题使用分别定义的行动填色；暗色文字链接采用更明亮的强调色，避免直接把亮色按钮值套到全部前景。柔和蓝色表面用于选中导航、待确认标签和产品对象的小面积背景。

### Neutral

亮色页面以白色为主，浅灰用于背景衬面；暗色页面使用深灰背景，面板与抬升表面逐层变亮。主要文字、次要文字与边线分别使用语义变量。`--f-canvas` 还保留产品画布用途，不能把产品来源中的灰画布误写成官网白色页面背景。

成功绿色只表达可见的完成/证据状态；错误色用于字段和提交错误。它们是功能状态色，不构成另一套营销主题。输入错误边框目前为实现中的固定值 `#c84a43`，错误文字仍跟随 `--f-danger`。

**The Semantic Theme Rule.** 新增官网和场景表面使用现有 --f-* 语义变量；切换主题时同时更新背景、文字、边线、状态与品牌资产。

## Typography

官网标题与正文优先采用 PingFang SC、Microsoft YaHei，拉丁字符由本地 Inter Variable 回退承担。产品场景使用 PingFang SC、Microsoft YaHei、Arial。两者不是同一字体栈，Inter 不作为新产品原生字体的宣传依据。

代码与机器信息通过 `Sky Mono` 使用本地 JetBrains Mono 的常规和半粗文件。根布局仍加载 Berkeley Mono 变量以兼容既有页面，但当前 Fusion 样式不将其作为主要等宽字体。

- **Display**：首页居中两行大标题，对应前言 display；900px 以下为 52px，640px 以下使用 `clamp(30px, 7.8vw, 46px)` 与 1.45 行高。
- **Headline**：章节标题，对应前言 headline；1024px 以下缩至 38px，手机为 32px。引导语、CTA 和内页标题有各自已实现刻度，不将所有标题机械统一。
- **Lead / Body**：大段说明与正文保留明显层级；文档正文通常 16px、1.9 行高，阅读段落最大约 68ch。
- **Label / Product UI**：导航、说明标记与表单标签小于正文。产品场景内部存在 8–13px 辅助信息，以自身尺度展示工作界面；不推广到官网正文。

**The Two Densities Rule.** 官网用宽间距解释价值，产品场景用紧凑工作面展示状态；不把场景中的微型字号用作正文或表单字号。

## Layout

网站版心最大宽 1280px，默认宽度为视口减去 96px；手机为视口减去 40px。页头固定，桌面内部高 80px；手机高 72px，页面和锚点留出对应偏移。

首页首段上方留出 174px，1800px 以上为 200px；首屏说明最大宽 660px；行动后保留品牌助手着陆锚点（桌面高 88px、手机高 80px，顶部不另显示角色），工作台相机容器在锚点后局部留白 24px。能力章节最大宽 1440px，标题最大 44px；桌面左侧为竖向能力导航及说明，右侧为成果场景，默认列宽 310px、间距 48px；其他章节仍按自身实现排版。常用章节上下间距为 112–128px。常规章节在 900px 以下将标题与说明转为单列；首页能力区在 1100px 及以下转为横向 Tab 与自然流单列。640px 以下章节通常以 64px 为主要纵向间距；首页行动链接按内容宽度换行，避免窄屏文字溢出。

导航在1100px以下切换为全屏原生对话框，避免200%文字放大时拥挤裁切；正文区块仍保留900px断点。产品场景在1100px以下去掉右侧上下文，900px以下收起重复的顶部产品导航，767px以下折叠为主内容工作面；不是缩小一张桌面截图。首页原型宽度为 `calc(100% - 96px)`、最大 1280px；手机两侧 20px。桌面首屏工作台高度为clamp(600px, 44vw, 780px)；其他沿用工作台场景默认高510px；手机工作台场景高440px，首屏原型在360px以下增高至464px以容纳标题换行。

POC 页面桌面采用说明与表单双栏，比例 .85 / 1.15，间隔 100px；800px 以下单列，480px 以下字段也转单列。表单手机内边距缩为 24px / 20px，保证输入框与说明保持可读。

## Elevation & Depth

现有系统以中性色表面和细边线组织深度；首页首屏以淡蓝径向渐变形成氛围，工作胶囊带轻柔蓝色阴影，浮层与产品前景仍使用克制的局部阴影。页头用半透明主题表面和 20px 背景模糊保持滚动时的层次。导航菜单使用轻阴影，产品工作台、员工方案与紧凑报告采用更轻的局部阴影；具体值保存在 sidecar 的 shadows，不扩展成新的高度体系。

**The Quiet Depth Rule.** 默认用表面与细边线区分层级；首页氛围和工作胶囊、导航浮层及产品内部前景使用已实现的局部渐变或轻阴影。

## Shapes

导航及主次行动链接使用 999px 胶囊圆角；POC 输入框仍为 6px，产品工作面和表单面板为 12px。产品场景手机圆角缩小；报告和工具对象按自身层级使用较细的轮廓。状态标签紧凑，圆点与完成标记用于状态识别。布局主要保持矩形工作面的清楚边界，不将所有内容包装成独立卡片。

## Components

### Buttons

主行动链接采用行动蓝、白色文字和胶囊圆角，使用前言 button-primary 的留白；POC 提交按钮独立固定高 46px。悬停切换到当前主题行动色，键盘焦点使用强调色轮廓；发送中禁用重复操作并降低不透明度。次按钮为主题表面与细边框，文字链接只改变颜色，带箭头的链接在悬停时小幅前移。

主要行动文字是“申请 POC”。表单按钮依据真实通道显示提交、生成邮件或发送中；这些是联系动作，不是产品试用入口。此处只记录视觉与反馈合同，接收渠道是否已配置由实际实现与运行结果证明。

### Chips

蓝色浅表面、强调文字和细描边构成待确认状态标签；选中导航、经验来源与标签沿用该语义。完成状态配合勾选图标或文字，不能只依赖颜色。

### Cards / Containers

产品工作台与场景是此站的主要视觉容器。页头、侧栏、上下文、Tab 和报告通过真实 HTML/CSS 层次形成；React 状态切换项目、任务、自动化、来源经验与知识内容。场景保留示例说明，避免被理解为在线生产操作。资源列表采用轻量图形背景和自然文字流，不为每个段落增加面板。

### Inputs / Fields

POC 表单使用主题背景、细边线、控制圆角；字段最小高 44px，textarea 最小高 124px。640px 以下的可编辑字段统一为 16px / 26px，保留手机填写时的可读性，避免较小字号引发的聚焦放大。焦点显示强调边框与柔和外轮廓。必填与选填由标签说明，错误文本位于对应字段下方；错误、等待、邮件准备和完成消息各有可见反馈。未经接收通道确认的申请不显示伪造成功。

### Navigation

固定页头（`68px`）采用左流式品牌紧邻结构，包含官方品牌、`1px × 18px` 竖线分隔与主导航（`产品能力 ∨` · `解决方案 ∨` · `定价` · `安全合规` · `MaaS` 外链至 `https://apigo.ai`）；右区统一为 `999px` 胶囊家族（`[语言切换 | 主题切换]` 工具子胶囊 + `产品文档` 描边次级胶囊 + `预约演示` 主行动胶囊）。首页首屏顶部透明融合氛围光，滚屏 > 24px、打开下拉或位于内页与文档页时自动转为磨砂面板并带轻阴影。`产品能力` 与 `解决方案` 采用左对齐 `880px` 分类全景下拉菜单（带 `140ms` 防误触延时、`18px` 顶部悬浮桥接与柔和背景聚光遮罩）；1100px 以下切换为原生全屏 `<dialog>` 抽屉，保留关闭、键盘焦点约束与返回触发点焦点。主题默认跟随系统，显式选择保存在 `skymythos-theme`，并同步品牌资产与场景表面。

### Brand Companion

导航左上角官方 S 标志随滚动脱离并变为官网导览角色，回到顶部后合回。页头仍使用原始 master SVG：按 `1200 × 306` viewBox 中 S 宽 256 的比例，只用 `--brand-mark-cut` 裁去 S，字标与首页链接的几何保持稳定；离开页面时清除裁切。共用角色从真实 S 的屏幕位置起飞，滚动 16–240px 沿弧线移动并以弹簧改变形态；S 的两条原路径经过几何采样及上下轮廓插值形成完整身体，而非切换两张图标。暗色主题的白色 S 随形态过渡为品牌蓝。回顶时角色轮廓和位置归位，同帧恢复页头 S 并隐藏角色。顶部没有独立助手或额外 Tab 停靠，形态完成后才开放导览交互；返航失去交互前将焦点交回首页链接。

完整角色身体为 60 × 54px，独立单张脸为 36 × 26px。之后随原生滚动经过工作台、能力区边侧和治理区边侧，较窄屏幕使用简化路径；能力区宽侧边留白时位于左侧外部，留白不足时移至右侧画布内边距以避让 Tab。弹簧使用 stiffness 115、damping 16，速度驱动最多 ±14° 倾斜与最大 1.24 的保面积拉伸。眼神平滑跟随指针或飞行速度，随机间隔 1600–3400ms 短眨眼 140ms；2200ms 内快速反向滚动四次触发 3 秒晕眼。悬停、焦点或菜单打开时暂停位移，页面暂停或后台停止循环；减少动态时 portal 保持稳定，根据位置直接显示静态 S 或停靠角色，不播放飞行或中间形态。
导览是品牌蓝的非模态 Base UI Popover，提供工作演示、产品能力、文档和 POC 四个真实入口，支持 Escape 或外部点击关闭；导航离开时不抢回焦点。菜单从当前身体几何展开（460ms）并收回（300ms），同一张脸移至菜单头部再返回，底部不保留第二个头像；菜单位置使用居中对齐及 -58px 偏移，使起始身体对齐角色底部。形变层沿角色相同路径拉伸，展开前约 28% 与面板层交接，收回末约 38% 反向交接；始终使用同一张脸。手动暂停页面动效或减少动态时，菜单直接到可操作终态；页面进入后台时暂停 WAAPI、CSS 与阶段计时，回到前台后从当前进度继续。菜单打开期间切换减少动态偏好会恢复可见外壳与面部位置，菜单尺寸变化会更新收回目标。浮动角色和弹层使用 portal 避免首屏层叠遮挡。

该动作借鉴参考站的角色飞行与展开体验，并以自有角色、路线和内容适配，不表示复刻了参考站全部行为。公开源码与录屏仅作分析证据，见 `output/playwright/brand-motion/source-essence/`。

### 首页能力切换

首页将工作交付、数字员工与企业知识整合为左侧竖向能力导航和说明、右侧成果画布。浅蓝画布中使用单层主题表面文档：交付计划可切换计划、来源依据和确认事项；工作记录可切换对应数字员工方案；来源可切换并查看原文。内容直接可读，不嵌套微型完整应用或内部滚动；首屏 ProductShowcase 保持独立。

导航支持方向键、Home/End、焦点轮廓和章节锚点。宽度至少 1280px、高度至少 900px 且页面动效启用时，250svh 轨道中的场景以 `top: clamp(104px, 10svh, 160px)` 粘滞，原生滚动正反向选择三个场景；点击或键盘选择也滚动到对应位置，面板内有焦点时保留当前场景。Tab 指示器与场景入场均为 450ms。1100px 及以下改为可横向滚动的 Tab 和自然流；其他不满足粘滞条件的尺寸、减少动态或页面暂停时也采用自然高度的手动切换。640px 及以下隐藏章节标题旁的重复说明，保留当前能力摘要；文档顶部标签允许换行并优先完整占行。能力区锚点使用全局 100px scroll-padding，不叠加章节 scroll-margin。

### 首页动效

品牌助手的标志接力、飞行和表情遵循上方 Brand Companion 规则。首屏工作胶囊的三个词每 2800ms 轮换，悬停、焦点进入、离屏或页面进入后台时暂停；切换的 transform、opacity、filter 分别为 650ms、480ms、520ms。工具、知识、流程和数字员工节点以 5s 浮动，SVG 连线以 6s 流动，并随滚动向两侧散开；离屏或后台时停止循环。工作台随原生滚动以 rotateX 和 scale 展开，手机改用轻微位移与缩放；这是适配本站产品工作台的效果。深蓝治理章节随滚动展开裁切边界，确认面板最多上移 28px，不自动改变验收状态。

首屏的“暂停页面动效”控制装饰与滚动效果；工作台示例播放仍使用自己的暂停、继续和重播控制。减少动态偏好显示静态内容。所有这些效果仅为展示，不调用后台或改变验收状态。动效参考与验证截图见 `output/playwright/aipay-motion/`；参考站抓取代码仅用于分析，未复制其 bundle。

### Product Scenes

场景用紧凑工作面展示目标、工具调用、报告、待确认员工方案与可打开的知识原文。首页以客户反馈贯穿交付、验收、经验复用与来源核对；合并重复的宣言与产品词条，技术指南通过导航和上下文链接进入。首屏原型约12秒展示目标、资料、执行、交付与等待确认，单次播放后保留成果，研发任务与自动化由访客手动切换。工作台外侧提供暂停、继续、重播与直接查看成果的操作，并注明本地示例；产品页头仍仅保留产品导航。焦点进入工作内容、离屏或后台时暂停，减少动态偏好直接显示完整报告。能力区交付文档可切换交付计划、来源证据与人工确认事项。底部用三个有顺序的步骤说明POC如何开展。它们是本地示例状态，不证明产品后台或真实模型已经运行。

### Documentation

文档采用Fumadocs UI/Core 16.18.1与Fumadocs MDX 15.5.0，使用框架的DocsLayout、DocsPage、多级可折叠分组侧栏（含二级嵌套子目录）、本文目录、前后篇、代码块、`Steps`、`Tabs`、`Callout`、`Accordions` 与检索弹窗，并内置5套响应式产品白皮书架构/数据流图组件（`src/components/docs/diagrams.tsx`）以及带高亮标注框与编号图例的真实控制台截图组件（`src/components/docs/doc-screenshot.tsx`，对应11组中英双语标注截图 `public/sites/fusion/docs/{zh,en}/*.png`）。内容以`content/docs/{en,zh}`中的MDX为唯一来源，参考企业级渐进式产品手册结构组织为：简介与入门指南（6篇动作化指引） → 从入门到精通指南（环境部署 / 功能说明含二级子夹 / 7篇独立实践案例 / 10个上手技巧与精选能力 / FAQ与异常排查） → 白皮书、授权与支持，共42篇双语文档（完整保留既有21条公开URL并扩展至全场景）。

文档为Read模式：固定字号、16px正文与1.9行高，桌面显示可折叠分组侧栏和本文目录，手机折叠为文档导航及目录弹层。框架色板映射到自有f-token，主题与官网共享data-theme和skymythos-theme存储键；Shiki深色语法颜色通过该主题属性同步。手机导航保持非模态语义，键盘焦点离开导航时同步关闭遮罩。

搜索使用框架默认内置多语言索引，提供中英文正文与章节结果、键盘选择和无结果反馈；无需外部搜索账号。全部42篇双语指南URL、章节锚点、索引、目录和导航由MDX构建生成。

### Pricing

价格作为既有官网的商业信息扩展，沿用自有主题与留白。按用户提供的Comma截图降低信息密度：/pricing最大宽度1040px，小标题与一句说明之后是两张灰底报价卡，每张只保留用途、单独报价、三条沟通范围与咨询按钮；底部一行费用说明及文档入口。删除费用长表、流程、FAQ和重复CTA，桌面首屏可同时比较两类报价。首页概览保留。金额、免费规则、交期与SLA没有确认值，不构造套餐数字或承诺。

官网桌面/手机导航、页脚与文档导航均可进入价格页。POC咨询沿用/poc，企业项目进入/poc?enquiry=enterprise，表单显示对应目标与提交文案，并将企业询价类型传递给接收端。接收通道状态仍遵守已有真实确认规则。

## Do's and Don'ts

### Do:

- **Do** 保留官方 SkyMythos.ai 标志比例，随主题切换亮暗资产。
- **Do** 使用 --f-* 语义变量，让官网、产品场景与 POC 表单共享亮暗主题。
- **Do** 在产品场景前保留清楚的标题与说明，用工作对象和可见成果解释能力；首页首屏使用居中标题与工作胶囊。
- **Do** 让手机内容自然重排，并保留焦点、错误说明、等待反馈、页面动效暂停与减少动态支持。
- **Do** 把主要行动统一为 POC 联系申请；按真实接收通道呈现发送、失败或待发送状态。

### Don't:

- **Don't** 将 Linear 品牌、客户背书或截图直接当作 SkyMythos 的产品实现。
- **Don't** 把旧官网石墨配色、IBM Plex 字体或旧播放器样式当作当前视觉权威。
- **Don't** 将首页治理色或导航胶囊圆角推广为全站暗主题或表单、产品控件规范。
- **Don't** 用主题切换只改变页面背景，留下产品面板、输入框或标志的错误主题。
- **Don't** 用展示中的待确认方案、完成图标或模拟结果暗示真实后台任务已完成。
- **Don't** 把联系 POC 改写成自助试用，或在接收通道未就绪时显示提交成功。
