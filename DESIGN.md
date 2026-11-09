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
    fontSize: 64px
    fontWeight: 550
    lineHeight: 1.22
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
  guide: 8px
  scene-mobile: 9px
  panel: 12px
  chip: 4px
spacing:
  field-label: 8px
  inline: 16px
  form-field: 24px
  copy-to-visual: 64px
  section: 112px
  section-opening: 120px
  mobile-section: 64px
  mobile-gutter: 20px
components:
  button-primary:
    backgroundColor: '{colors.action-light}'
    textColor: '#fff'
    rounded: '{rounded.control}'
    padding: 12px 20px
    typography: '{typography.body}'
  button-primary-hover:
    backgroundColor: '{colors.action-hover-light}'
  button-primary-dark:
    backgroundColor: '{colors.action-dark}'
    textColor: '#fff'
  button-secondary:
    backgroundColor: '{colors.page-light}'
    textColor: '{colors.text-light}'
    rounded: '{rounded.control}'
    padding: 12px 20px
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

**Creative North Star: "看得见的企业工作能力"**

现有视觉以 Linear 式宽幅留白和清楚的阅读层次为基础：左侧标题与右侧说明相互对应，产品场景在其后展开。SkyMythos.ai 的官方标志、TDesign 蓝色与亮暗表面承担品牌身份；页面的视觉重点是工作目标、执行依据与可检查的成果。

官网采用较低的信息密度，产品场景保留更紧凑的工作界面密度。主操作引导访客填写 POC 联系表单，文档与能力说明承担继续了解的入口。场景由 React、CSS 和本地示例状态构成，截图仅作为来源或比较证据，不是页面实现。

**Key Characteristics:**

- 宽幅留白、左对齐标题与说明对照，随后展开产品场景。
- SkyMythos.ai 官方亮暗标志与 TDesign 蓝色语义主题。
- 中性色表面、细边线和轻阴影，按状态使用蓝色、绿色与错误色。
- 官网阅读与产品界面采用不同密度；手机重排内容。
- 以联系团队开展 POC 为主要转化，保留可用的键盘和反馈状态。

当前实现权威为 `src/app/fusion-theme.css`、`src/components/sites/fusion/site.module.css`、`home.module.css`、`showcase.module.css`、`poc.module.css` 与 `src/app/layout.tsx`。新产品主题来源记录在 `docs/research/fusion/product-tokens.json`；提取文档保留产品来源值，但官网实际语义映射以已实现 CSS 为准。`.impeccable/config.json` 继续使用 `buildPath: code`。

## Colors

### Primary

品牌蓝出现在官方标志中；交互蓝用于 POC 主行动、链接、选中项、焦点与产品状态。品牌蓝与交互蓝承担不同职责，不强制改成同一个色值。

`.impeccable/design.json` 的八阶 OKLCH 色带仅是面板浏览元数据；它们按现有蓝色与状态色相合成，不是新增的应用色阶或 CSS 变量。

亮色与暗色主题使用分别定义的行动填色；暗色文字链接采用更明亮的强调色，避免直接把亮色按钮值套到全部前景。柔和蓝色表面用于选中导航、待确认标签和产品对象的小面积背景。

### Neutral

亮色页面以白色为主，浅灰用于背景衬面；暗色页面使用深灰背景，面板与抬升表面逐层变亮。主要文字、次要文字与边线分别使用语义变量。`--f-canvas` 还保留产品画布用途，不能把产品来源中的灰画布误写成官网白色页面背景。

成功绿色只表达可见的完成/证据状态；错误色用于字段和提交错误。它们是功能状态色，不构成另一套营销主题。输入错误边框目前为实现中的固定值 `#c84a43`，错误文字仍跟随 `--f-danger`。

**The Semantic Theme Rule.** 新增官网和场景表面使用现有 --f-* 语义变量；切换主题时同时更新背景、文字、边线、状态与品牌资产。

## Typography

官网标题与正文优先采用 PingFang SC、Microsoft YaHei，拉丁字符由本地 Inter Variable 回退承担。产品场景使用 PingFang SC、Microsoft YaHei、Arial。两者不是同一字体栈，Inter 不作为新产品原生字体的宣传依据。

代码与机器信息通过 `Sky Mono` 使用本地 JetBrains Mono 的常规和半粗文件。根布局仍加载 Berkeley Mono 变量以兼容既有页面，但当前 Fusion 样式不将其作为主要等宽字体。

- **Display**：首页大标题，对应前言 display；1024px 以下缩至 56px，手机使用 `clamp(32px,8.8vw,40px)` 与 1.35 行高。
- **Headline**：章节标题，对应前言 headline；1024px 以下缩至 38px，手机为 32px。引导语、CTA 和内页标题有各自已实现刻度，不将所有标题机械统一。
- **Lead / Body**：大段说明与正文保留明显层级；文档正文通常 16px、1.9 行高，阅读段落最大约 68ch。
- **Label / Product UI**：导航、说明标记与表单标签小于正文。产品场景内部存在 8–13px 辅助信息，以自身尺度展示工作界面；不推广到官网正文。

**The Two Densities Rule.** 官网用宽间距解释价值，产品场景用紧凑工作面展示状态；不把场景中的微型字号用作正文或表单字号。

## Layout

网站版心最大宽 1280px，默认宽度为视口减去 96px；手机为视口减去 40px。页头固定，桌面内部高 80px；手机高 72px，页面和锚点留出对应偏移。

首页首段上方留出 180px，超宽视口为 208px。章节采用标题与说明两栏、80px 栏间距，首页原型与按钮间隔 48px（超宽视口 64px），首屏说明以最长780px的自然换行文案交代产品形态、交付与经验复用，正文场景与上方说明间隔 64px；常用章节上下间距为 112–128px。900px 以下标题说明转单列，段落之间保持 24–28px 的呼吸；640px 以下章节通常以 64px 为主要纵向间距。

导航在1100px以下切换为全屏原生对话框，避免200%文字放大时拥挤裁切；正文区块仍保留900px断点。产品场景在1100px以下去掉右侧上下文，900px以下收起重复的顶部产品导航，767px以下折叠为主内容工作面；不是缩小一张桌面截图。首页原型独立于1280px正文容器，宽度为calc(100% - clamp(48px, 10vw, 192px))、最大1600px；手机两侧20px。桌面首屏工作台高度为clamp(600px, 44vw, 780px)、正文场景高510px；手机两者高440px，首屏原型在360px以下增高至464px以容纳标题换行。

POC 页面桌面采用说明与表单双栏，比例 .85 / 1.15，间隔 100px；800px 以下单列，480px 以下字段也转单列。表单手机内边距缩为 24px / 20px，保证输入框与说明保持可读。

## Elevation & Depth

现有系统以中性色表面和细边线组织深度，阴影只轻微提示浮层与前景，不依赖大面积辉光。页头用半透明主题表面和 20px 背景模糊保持滚动时的层次。导航菜单使用轻阴影，产品工作台、员工方案与紧凑报告采用更轻的局部阴影；具体值保存在 sidecar 的 shadows，不扩展成新的高度体系。

**The Quiet Depth Rule.** 默认用表面与细边线区分层级，只在导航浮层和产品内部前景使用现有轻阴影。

## Shapes

按钮和输入框以控制圆角为主，面板与表单使用较宽的面板圆角。产品场景手机圆角缩小；报告和工具对象按自身层级使用较细的轮廓。状态标签紧凑，圆点与完成标记用于状态识别。布局主要保持矩形工作面的清楚边界，不将所有内容包装成独立卡片。

## Components

### Buttons

主按钮采用行动蓝与白色文字，使用前言 button-primary 的留白；POC 提交按钮独立固定高 46px。悬停切换到当前主题行动色，键盘焦点使用强调色轮廓；发送中禁用重复操作并降低不透明度。次按钮为主题表面与细边框，文字链接只改变颜色，带箭头的链接在悬停时小幅前移。

主要行动文字是“申请 POC”。表单按钮依据真实通道显示提交、生成邮件或发送中；这些是联系动作，不是产品试用入口。此处只记录视觉与反馈合同，接收渠道是否已配置由实际实现与运行结果证明。

### Chips

蓝色浅表面、强调文字和细描边构成待确认状态标签；选中导航、经验来源与标签沿用该语义。完成状态配合勾选图标或文字，不能只依赖颜色。

### Cards / Containers

产品工作台与场景是此站的主要视觉容器。页头、侧栏、上下文、Tab 和报告通过真实 HTML/CSS 层次形成；React 状态切换项目、任务、自动化、来源经验与知识内容。场景保留示例说明，避免被理解为在线生产操作。资源列表采用轻量图形背景和自然文字流，不为每个段落增加面板。

### Inputs / Fields

POC 表单使用主题背景、细边线、控制圆角；字段最小高 44px，textarea 最小高 124px。640px 以下的可编辑字段统一为 16px / 26px，保留手机填写时的可读性，避免较小字号引发的聚焦放大。焦点显示强调边框与柔和外轮廓。必填与选填由标签说明，错误文本位于对应字段下方；错误、等待、邮件准备和完成消息各有可见反馈。未经接收通道确认的申请不显示伪造成功。

### Navigation

固定页头包含官方品牌、产品能力菜单、文档/企业接入及 POC 行动，主题按钮独立可达。桌面导航菜单双栏排列标题和说明；手机对话框使用纵向链接，保留关闭、键盘约束和返回触发点的焦点。主题默认跟随系统，显式选择保存在 `skymythos-theme`，并同步品牌资产与场景表面。

### Product Scenes

场景用紧凑工作面展示目标、工具调用、报告、待确认员工方案与可打开的知识原文。首页以客户反馈贯穿交付、验收、经验复用与来源核对；合并重复的宣言与产品词条，技术指南通过导航和上下文链接进入。首屏原型约12秒展示目标、资料、执行、交付与等待确认，单次播放后保留成果，研发任务与自动化由访客手动切换。工作台外侧提供暂停、继续、重播与直接查看成果的操作，并注明本地示例；产品页头仍仅保留产品导航。焦点进入工作内容、离屏或后台时暂停，减少动态偏好直接显示完整报告。正文交付场景可切换交付报告、来源证据与人工确认事项。底部用三个有顺序的步骤说明POC如何开展。它们是本地示例状态，不证明产品后台或真实模型已经运行。

### Documentation

文档采用Fumadocs UI/Core 16.18.1与Fumadocs MDX 15.5.0，使用框架的DocsLayout、DocsPage、侧栏、本文目录、前后篇、代码块与搜索弹窗。内容以content/docs中的MDX为唯一来源；首页通过部署说明与导航进入文档，不重复展示指南卡片。

文档为Read模式：固定字号、16px正文与1.9行高，桌面显示分组侧栏和本文目录，手机折叠为文档导航及目录弹层。框架色板映射到自有f-token，主题与官网共享data-theme和skymythos-theme存储键；Shiki深色语法颜色通过该主题属性同步。手机导航保持非模态语义，键盘焦点离开导航时同步关闭遮罩。

搜索使用框架默认ZBSearch多语言索引，提供中文正文与章节结果、键盘选择和无结果反馈；无需外部搜索账号。现有六篇指南URL保留，索引、目录和导航由MDX构建生成。

### Pricing

价格作为既有官网的商业信息扩展，沿用自有主题与留白。按用户提供的Comma截图降低信息密度：/pricing最大宽度1040px，小标题与一句说明之后是两张灰底报价卡，每张只保留用途、单独报价、三条沟通范围与咨询按钮；底部一行费用说明及文档入口。删除费用长表、流程、FAQ和重复CTA，桌面首屏可同时比较两类报价。首页概览保留。金额、免费规则、交期与SLA没有确认值，不构造套餐数字或承诺。

官网桌面/手机导航、页脚与文档导航均可进入价格页。POC咨询沿用/poc，企业项目进入/poc?enquiry=enterprise，表单显示对应目标与提交文案，并将企业询价类型传递给接收端。接收通道状态仍遵守已有真实确认规则。

## Do's and Don'ts

### Do:

- **Do** 保留官方 SkyMythos.ai 标志比例，随主题切换亮暗资产。
- **Do** 使用 --f-* 语义变量，让官网、产品场景与 POC 表单共享亮暗主题。
- **Do** 在宽幅产品场景前保留清楚的标题与说明，用工作对象和可见成果解释能力。
- **Do** 让手机内容自然重排，并保留焦点、错误说明、等待反馈与减少动态支持。
- **Do** 把主要行动统一为 POC 联系申请；按真实接收通道呈现发送、失败或待发送状态。

### Don't:

- **Don't** 将 Linear 品牌、客户背书或截图直接当作 SkyMythos 的产品实现。
- **Don't** 把旧官网石墨配色、IBM Plex 字体或旧播放器样式当作当前视觉权威。
- **Don't** 用主题切换只改变页面背景，留下产品面板、输入框或标志的错误主题。
- **Don't** 用展示中的待确认方案、完成图标或模拟结果暗示真实后台任务已完成。
- **Don't** 把联系 POC 改写成自助试用，或在接收通道未就绪时显示提交成功。
