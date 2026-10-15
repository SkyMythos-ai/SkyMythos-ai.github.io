# 品牌资产

原始文件来自 `fusion-harness/components/console/web/public/`，于 2026-10-14 同步，保持 SVG 原样。

- `logo-mark*.svg`：图形标识。
- `logo-wordmark*.svg`：SkyMythos.ai 官方字标。
- `-dark`：用于深色背景；无后缀版本用于浅色背景。

共享 `Wordmark` 的图标始终使用 `logo-mark.svg` 的品牌蓝，字标根据页面的 `.scope-dark` 选择版本。站点图标 `src/app/icon.svg` 复制自同目录 `favicon.svg`；`src/app/apple-icon.png` 是该文件的 180 × 180 PNG 导出。

## 数字员工主视觉

`public/images/employees/` 保留 B 方向的原创概念图。当前首页以原生 SVG 制作三个约 12 秒的动作场景，`employee-scene.tsx` 选择场景，`hero-stage.tsx` 管理播放生命周期，`employee-work-visual.tsx`、`employee-collaboration-visual.tsx` 与 `employee-knowledge-visual.tsx` 管理原创构图，`employee-emblem-motion.ts` 使用轮播唯一时钟绘制分镜。

三幕分别为日常工作沉淀为可雇佣 Agent 并接手后续工作、不同 Harness 围绕同一工作稿交接与修正并共同交付、知识库检索并返回带来源的内容。协作幕以可替换模型模块呈现开放选择，私人 Memory 与知识库分别呈现。手动选择播放一遍后保留结果；减少动态或 JavaScript 未加载时显示完整静态构图。

构图方法参考 [官方宣传视觉对标](../../context-kg/research/agent-marketing-visuals.md)，网站图形与布局为原创，不发布竞品截图。画面为机制示意，并非实时产品界面、固定模型岗位或第三方品牌背书。

## 产品概念与架构插图

两幅原生等距 SVG 位于 `src/components/anatomy/`。概念图以档案签发机展示原始工作、经验、持续员工身份、独立雇佣授权与后续交付；架构图以剖开的受控执行舱展示输入检查、环境授权、隔离执行与产物交接。实体在服务端构造，纯状态模型同时驱动动作和读数，客户端仅更新属性与实际遮挡顺序。

两图均支持四阶段选择、键盘操作、离屏停止和减少动态偏好。无脚本时显示完整成果及阶段说明。它们说明产品机制，实际操作继续与 `public/images/product/` 的真实界面截图配对；几何核心沿用已有 Anatomy MIT 许可及署名。

## 第三方执行端标识

- `claude-symbol.svg`：取自 [Claude Code 官方浅色字标 SVG](https://mintcdn.com/claude-code/c5r9_6tjPMzFdDDT/logo/light.svg) 的独立星芒图形，保留原形与原色 `#D97757`。
- `openai-blossom.svg`：取自 [OpenAI 官方品牌素材](https://openai.com/brand/) 的 [Logo ZIP](https://cdn.openai.com/brand/OpenAI-Logos-2025.zip) 中黑色 Monoblossom，以 OpenAI 身份标记 Codex 执行端。
- `kimi-symbol.svg`、`deepseek-symbol.svg`、`grok-symbol.svg`、`zai-symbol.svg`：原样取自 [LobeHub Icons 的 SVG 库](https://github.com/lobehub/lobe-icons/tree/master/packages/static-svg/icons)，分别标识 Kimi、DeepSeek、Grok 与 GLM 所属 Z.ai。保留原始路径和单色形态，显示在浅色实体铭牌上；MIT 许可全文见同目录 `lobe-icons-LICENSE`。

动画只改变标识外围的任务关系与工作内容，不拆分、扭曲、改色或把第三方标识合成为本产品标识。

## 页面与视觉层次

首页使用 1280px 共用版心，桌面图文在真实网格中占位，平板与手机上下排列。三幕使用中性石墨薄面、精确边缘与局部工作色；Memory、Skill、协作工作面和知识索引各有独立构图，减少厚彩侧边、塑料高光和奖励徽章。形状层次与品牌标识保持独立，动画仍由同一时钟驱动。

`src/components/employee-visual-material.ts` 管理插图材质；`src/styles/home.css` 管理首页与图形文字样式，`site-navigation.css` 管理单行导航和共享页的顶栏偏移，`interior.css` 管理概念与架构的薄面布局。营销采用深石墨，文档使用同一设计语言的中性浅色阅读面。手机保留关键名称、职责、资料与来源编号，精简重复的辅助说明。介绍、流程、架构与页尾均使用同一布局基线。
