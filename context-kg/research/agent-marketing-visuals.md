---
type: Research
title: Agent 协作宣传视觉对标
description: 基于官方页面实看截图，比较协作构图、角色辨认、成果表达和动画叙事，为 SkyMythos 首屏提供参考。
tags: [design, marketing, agents, animation]
status: stable
generated:
  by: ai:codex
  at: 2026-10-14T16:57:12+08:00
sources:
  - resource: https://relevanceai.com/workforce
    title: Relevance AI Workforce
  - resource: https://www.lindy.ai/
    title: Lindy 首页
  - resource: https://dust.tt/
    title: Dust 首页
  - resource: https://skywork.ai/skillhub/agent-swarm/
    title: Skywork Agent Swarm 技能目录页
  - resource: https://www.genspark.ai/blog/genspark-multiagent-orchestration
    title: Genspark 多 Agent 编排官方介绍
---

# Agent 协作宣传视觉对标

这是 2026-10-14 的历史研究和当时的协作首屏建议。当前官网已改为真实产品画面优先，首屏不挂载协作网络；现行职责和视觉以[工作、资产与治理合同](work-assets-governance-outline.md)为准。下文保留当时公开页面的观察与取舍，不作为当前实现要求。

结论：优先借鉴 Relevance 的可读分工网络、Lindy 的可见成果闭环和 Dust 的当前事件聚焦。用于 SkyMythos 时，中央是本产品的协作中枢，周围是有职责和运行时身份的 Agent；动画须表达任务流转与成果生成。第三方商标只标记执行端，不合成为新的中央标识。

## 采样方法与边界

2026-10-14 使用本机 Chrome/Playwright，以 1440 × 1000 视口访问官方页面，保存截图并逐张视觉查看。三组动态样本在同一页面位置间隔约 4.5 秒截图，能够证明这两个时刻之间的可见变化，不能证明完整播放周期或后端执行能力。

截图是本地研究材料，统一存于已被 Git 本地排除的 `.handoff/marketing-references/`，不作为网站静态资源发布。以下本地链接相对本研究文件；在独立克隆中可能不存在。研究只描述本次实际看见的页面，不将各厂商的功能和效果宣传当成本项目的事实。

## 1. Relevance AI：分工关系清晰，成果单独收束

官方页面：[AI Workforce](https://relevanceai.com/workforce)。本地证据：[首屏](../../.handoff/marketing-references/relevance-hero.png)、[后续版块](../../.handoff/marketing-references/relevance-detail.png)、[动态起点](../../.handoff/marketing-references/relevance-motion-0.png)、[4.5 秒后](../../.handoff/marketing-references/relevance-motion-1.png)。

**观察**：标题和说明在上方分列，下面一张大幅点阵工作画布承担主要解释。画布从触发事件进入，连接到带头像、职责名和小工具标识的 Agent；连线分叉后再次汇合。角色节点以短名区分研究、文案、发送、预约等工作，不需要长段说明。右下角独立呈现业务成果。动态样本中，蓝色虚线从上游迁移到下一段分支、对应节点边框变亮，末端结果数量改变。后续版块还用一个工作手册连接三个员工头像，说明分工来自共同方法。[来源](https://relevanceai.com/workforce)

**设计推论**：SkyMythos 可保留“中枢—分工—汇合”关系，分别在四个执行端绘出需求摘要、代码变更、审查标记与检查清单。克制使用蓝色执行线，其他连接保持浅灰，让当前步骤一眼可辨。不能照搬销售职责、会议数量或提升承诺；成果应是可审查变更与验证证据。图的逻辑比节点卡片的外观更值得借鉴，无需复制完整流程编辑器。

## 2. Lindy：具体工作从请求走到文件

官方页面：[Lindy](https://www.lindy.ai/)。本地证据：[首屏](../../.handoff/marketing-references/lindy-hero.png)、[文件成果](../../.handoff/marketing-references/lindy-detail.png)、[动态起点](../../.handoff/marketing-references/lindy-motion-0.png)、[4.5 秒后](../../.handoff/marketing-references/lindy-motion-1.png)。

**观察**：首屏大标题居中，两侧集成工具标识低对比排列，主视觉是下面的团队聊天场景。人物提出具体问题，Agent 带标识回复，先呈现操作清单；后续状态变为简短结论、PDF 文件与可操作按钮。相隔 4.5 秒的样本从第一项执行结果推进到最终文件，工具符号是过程线索，文件才是结果。人物头像与 Agent 图标区分了发起者和执行者。[来源](https://www.lindy.ai/)

**设计推论**：本项目每个 Agent 邻近应有属于它的微型工作成果，例如新增的代码行、校验勾选、批注；最后汇入统一的交付包。应借鉴清楚的前后变化，不搬运完整聊天窗口、营销数字、真人身份或大量按钮。仅让 Claude/Codex 图标漂浮，无法表达“完成了什么”。

## 3. Dust：稳定空间配合当前事件

官方页面：[Dust](https://dust.tt/)。本地证据：[首屏](../../.handoff/marketing-references/dust-hero.png)、[下方流程](../../.handoff/marketing-references/dust-detail.png)、[清除 Cookie 遮挡后的动态起点](../../.handoff/marketing-references/dust-motion-0.png)、[4.5 秒后](../../.handoff/marketing-references/dust-motion-1.png)。

**观察**：左侧标题，右侧等距视角的几个彩色平台组成共同空间，圆形人员节点分布其中；一个浮起的消息框表达当前人物与 Agent 的协作事件。动态样本中消息保持在同一空间，后续出现表情反馈。页面更下方用四个纵向步骤明确表达收到问题、分类处理、更新记录、回复的结果链。图像具有空间感，但并没有让每个角色同时说话。[来源](https://dust.tt/)

**设计推论**：SkyMythos 可以借用稳定布局和单一当前事件的节奏：其他 Agent 保持可辨认但低活跃，当前输出更突出；四端协作也不需要所有线一起闪烁。不要照搬 Dust 的品牌几何平台、配色和长消息框。其底层多人共同空间是传播隐喻，不应推导为本产品共享所有私人数据或执行环境。

## 4. 已核查但不作为视觉正样本的页面

**Skywork Agent Swarm**：[官方技能页](https://skywork.ai/skillhub/agent-swarm/)，本地[首屏](../../.handoff/marketing-references/skywork-hero.png)、[详情](../../.handoff/marketing-references/skywork-detail.png)。实际页面是标题、说明、功能卡片和三步使用说明，没有看到用户参考图里的中央中枢与多角色网络。页面图片列表只有导航 Logo，因此本次不能确认用户参考图出自该页；不要将其冒称原图来源。

**Genspark**：[官方多 Agent 编排文章](https://www.genspark.ai/blog/genspark-multiagent-orchestration)。浏览器停在 Cloudflare 安全验证页，证据为[阻断截图](../../.handoff/marketing-references/genspark-hero.png)。搜索可读取官方文章文字，但本次未实际查看其宣传图，不将它计入已完成的视觉对标，也不从文字推断构图。

## 转化为本项目的动画约束

以下为设计建议，而非上述竞品的事实：

1. **角色稳定**：中央保留 SkyMythos，四端显示不同职责和 Claude/Codex 执行标识。运行时标识说明工具身份，职责说明分工，两者不可互相替代。
2. **动作有因果**：需求到达中枢；有效分支亮起；执行端绘制不同成果；成果经集成与验证收束。编码、审查和验证有依赖，不能把任意四个步骤都暗示为同时完成。
3. **结果可识别**：代码不是装饰横线，检查清单应有明确勾选，报告有标题/段落层级。成品在末段停留一小段时间，用户能读出完成状态。
4. **一次一个重点**：控制当前高亮线与输出数量；头像、名牌、成果之间保留留白，防止大面积卡片堆砌。
5. **继承产品边界**：动画为机制示意，不伪造真实任务、量化收益、生产发布成功或已经完整实现的 RSI 收益。不同页面示意不能混淆 Knowledge、Memory、Skill 与 Agent Runtime。
6. **保持原创**：借鉴信息层级和运动因果，重新设计角色布局、线形和成果造型；不搬运竞品整图、用户身份、品牌主图或视觉资产。
