---
name: SkyMythos
description: 企业 AI-Native Harness 官网的现有视觉系统
colors:
  home-ground: "#080a0e"
  home-ink: "#f4f6fb"
  home-muted: "#b5bdcc"
  home-line: "#282d38"
  home-panel: "#111722"
  home-accent: "#a9c5ff"
  light-ground: "#f7f8fa"
  light-surface: "#fff"
  light-raised: "#eef1f5"
  light-ink: "#182233"
  light-muted: "#526174"
  light-line: "#d4dce6"
  light-accent: "#315caa"
  dark-raised: "#1b2432"
  dark-line: "#303b4b"
  dark-accent-fill: "#3867b5"
  commercial-ground: "#f4f6f8"
  commercial-ink: "#2d4260"
  commercial-accent: "#4b72bc"
typography:
  display:
    fontFamily: "IBM Plex Sans, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "clamp(38px, 4.4vw, 60px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-.035em"
  body:
    fontFamily: "IBM Plex Sans, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "16px"
    lineHeight: 1.75
  home-section-title:
    fontSize: "clamp(32px, 3.3vw, 44px)"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "-.03em"
  home-section-title-mobile:
    fontSize: "30px"
    lineHeight: 1.4
  home-title-mobile:
    fontSize: "clamp(24px, 6.7vw, 34px)"
    lineHeight: 1.38
  home-body:
    fontSize: "15px"
    lineHeight: 1.8
  home-lead:
    fontSize: "17px"
    lineHeight: 1.8
  demo-hint:
    fontSize: "12px"
  home-resource-title:
    fontSize: "18px"
  home-link:
    fontSize: "14px"
  home-supporting:
    fontSize: "13px"
  demo-caption:
    fontSize: "11px"
  demo-fallback-heading:
    fontSize: "20px"
rounded:
  home-button: "6px"
  home-panel: "12px"
  commercial-button: "999px"
  scene-window: "12px"
  hero-viewport: "12px"
  demo-caption: "4px"
spacing:
  home-section: "112px"
  home-hero-top: "58px"
  home-gutter: "40px"
components:
  home-button-primary:
    backgroundColor: "{colors.home-ink}"
    textColor: "#101724"
    rounded: "{rounded.home-button}"
    height: "44px"
    padding: "0 20px"
---
# Design System: SkyMythos

## Overview

**Creative North Star: "真实的工作界面"**

中文首页以真实产品组件聚焦核心操作，解释企业能力；官网保留亮暗语义色，演示内部以产品原组件及其 CSS 为权威。

主题默认跟随系统，页头可显式切换并保存选择；中文商业内页、英文页面和文档提供主题入口及语义色适配，保留各自内容和版式。正式内页的冻结产品捕获与首页运行中的源组件演示分开。

**Key Characteristics:**
- 亮暗表面与克制的蓝色层次
- 大标题、宽间距与细分隔线
- 源组件演示与冻结产品捕获分别标注

## Colors

官网及演示外框使用 `--h-bg`、`--h-surface`、`--h-raised`、`--h-text`、`--h-muted`、`--h-line`、`--h-accent` 等语义变量；亮暗值见 frontmatter，具体映射以 `site-theme.css` 为准。状态使用绿色和琥珀色。

## Typography

官网使用 IBM Plex Sans 承担正文及标题，IBM Plex Mono 用于适用的机器信息；中文使用平台字形。源产品演示内部字体以产品 `fonts.css` 和 TDesign 为准。首页标题桌面采用 display 规格；二级标题为 `clamp(32px, 3.3vw, 44px)`、行高 1.3。520px 以下首页标题为 `clamp(24px, 6.7vw, 34px)`、行高 1.38，二级标题为 30px、行高 1.4。

## Layout

首页内容最大宽1200px，桌面两侧40px、800px及以下20px。按持续执行、经验转成员工能力、知识留存、治理和接入组织叙事。首屏标题、定义与行动入口左对齐纵向排列；完整控制台下方用三步说明工作过程。原则转场之后，持续执行、训练和知识章节共用标题与说明、媒体及功能索引骨架，章节标题说明在800px及以下单列；治理和接入延续标题与说明结构。

首屏保留完整原生控制台，桌面高700px，700px及以下高640px；手机保留960px宽产品页面、左右浏览提示，自动跟随演示且访客触碰后停止跟随。正文交付舞台高640px，训练与知识桌面高600px；700px及以下均高640px。正文 iframe 宽高匹配舞台，内部原生组件分层组织上下文和前景成果，边缘退隐用于舞台过渡；手机前景使用可用宽度自然换行，后景保留必要上下文。正式内页冻结捕获仍996×623px。

章节通常上下各留112px，800px及以下72px；首屏顶部58px，800px及以下40px。页头1000px以下隐藏CTA，保留正文入口。

## Elevation & Depth

主要使用表面、细线区分层次；主题浮层阴影亮色为 `0 16px 36px #18223318`，暗色为 `0 16px 36px #0008`。

## Shapes

首页主要按钮为6px圆角；首屏控制台外框及正文演示内部场景窗口为12px圆角，细边框组织信息。首页演示不提供播放控件。商业内页保留既有胶囊按钮与圆角浮层。

## Components

- 首页主操作为浅色实底按钮，最小高度 44px，悬停变为浅蓝；次操作为文字链接。
- 演示由原生组件、原样式及共享时钟驱动，Storage 使用内存隔离，本地示例适配 API 和 SSE；无外部业务网络、真实模型或业务写入，不构成业务验收。首屏完整控制台来自 `14f40b0fc37f7a20eeab00293e3527725552a255`，正文三个合成场景来自 `7295629889d881f3485168832359d16d141021f9` 加 dirty 工作区；正文来源记录及实际导入见 `public/product-scenes/7295629889d881f3485168832359d16d141021f9-composed-v1/source-provenance.json`。私有知识组件仅在构建 loader 中追加 export，原产品源文件只读。
- 正式内页保留冻结的 ProductDemo 与旧播放器参考，固定示例和原图入口与首页源组件演示分开；旧参照与本次源组件属于不同版本体系。
- 页头使用官方亮暗双色字标和主题切换；选择持久化于 `skymythos-theme`，未选择时跟随系统。
- 商业内页联系表单使用白色输入框、细边框和 12px 圆角。

## Do's and Don'ts

### Do:
- **Do** 明确区分首页源组件演示与正式内页冻结产品捕获。
- **Do** 按页面所属视觉面使用现有配色与组件。

### Don't:
- **Don't** 改画或虚构真实产品映射中不存在的字段和步骤，也不要把示例表述为已验证的生产业务。
- **Don't** 把固定示例表现为实时运行。

## 原生产品演示与页面叙事（当前合同）

正文 iframe 隔离依赖和原 CSS；舞台以共享时钟将真实产品组件组织为前后层，保留对象与状态关系。交付展示已接收目标，3.1–6.1秒执行详情前移，9–11.2秒面板自身滚动跟随第二项工具；15秒后同一任务报告前移，21–23秒自身滚动展示待人工验收的末尾。训练由经验选择与同一分析操作形成待确认方案，18–23秒面板自身滚动显示技能来源至确认按钮。知识演示原生检索输入、提交、结果点击，打开同一知识库、文档及版本的原文；不声称任务自动引用知识。

演示自动运行24秒，终态停留3秒后循环，无播放、暂停、重播或进度控件。离屏或后台暂停时钟和原生 CSS 动画，返回可见时继续；系统减少动态显示静态终态，不循环。框内标注“示例数据”，自动运行不接管父页面焦点；无脚本和加载失败时提供说明与功能入口，seek 仅供测试。首屏挂载 `public/product-demo/14f40b0fc37f7a20eeab00293e3527725552a255`，正文挂载 `public/product-scenes/7295629889d881f3485168832359d16d141021f9-composed-v1`，两种来源独立记录。本地示例不证明真实后台、模型、7×24运行或业务验收。
