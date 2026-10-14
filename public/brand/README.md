# 品牌资产

原始文件来自 `fusion-harness/components/console/web/public/`，于 2026-10-14 同步，保持 SVG 原样。

- `logo-mark*.svg`：图形标识。
- `logo-wordmark*.svg`：SkyMythos.ai 官方字标。
- `-dark`：用于深色背景；无后缀版本用于浅色背景。

共享 `Wordmark` 根据页面的 `.scope-dark` 选择版本。站点图标 `src/app/icon.svg` 复制自同目录 `favicon.svg`；`src/app/apple-icon.png` 是该文件的 180 × 180 PNG 导出。

## 数字员工主视觉

`public/images/employees/` 保留 B 方向的原创概念图。当前首页以原生 SVG 制作三个约 12 秒的动作场景，`employee-scene.tsx` 管理播放生命周期，`employee-work-visual.tsx` 与 `employee-knowledge-visual.tsx` 管理原创构图，`employee-emblem-motion.ts` 使用轮播唯一时钟绘制分镜。

三幕分别为 Agent 自动工作并沉淀/复用 Skill 与 Memory、Claude/Codex 执行端围绕协作中枢形成方案/代码/审查/验证成果、知识库检索并返回带来源的内容。RSI 标为持续改进方向，私人 Memory 与知识库分别呈现。手动选择播放一遍后保留结果；减少动态或 JavaScript 未加载时显示完整静态构图。

构图方法参考 [官方宣传视觉对标](../../context-kg/research/agent-marketing-visuals.md)，网站图形与布局为原创，不发布竞品截图。画面为机制示意，并非实时产品界面、固定模型岗位或第三方品牌背书。

## 第三方执行端标识

- `claude-symbol.svg`：取自 [Claude Code 官方浅色字标 SVG](https://mintcdn.com/claude-code/c5r9_6tjPMzFdDDT/logo/light.svg) 的独立星芒图形，保留原形与原色 `#D97757`。
- `openai-blossom.svg`：取自 [OpenAI 官方品牌素材](https://openai.com/brand/) 的 [Logo ZIP](https://cdn.openai.com/brand/OpenAI-Logos-2025.zip) 中黑色 Monoblossom，以 OpenAI 身份标记 Codex 执行端。

动画只改变标识外围的任务关系与工作内容，不拆分、扭曲、改色或把第三方标识合成为本产品标识。

## 页面与视觉层次

首页使用 1280px 共用版心，桌面图文在真实网格中占位，平板与手机上下排列。三幕以实体内沿、细蓝边缘、文档折角和固定空间刻度体现数字材质；形状层次与品牌标识保持独立，动画仍由同一时钟驱动。

`src/styles/home.css` 管理首页与图形文字样式；`site-navigation.css` 管理单行导航和共享页的顶栏偏移。手机保留关键名称、职责、资料与来源编号，精简重复的辅助说明。介绍、流程、架构与页尾均使用同一布局基线。
