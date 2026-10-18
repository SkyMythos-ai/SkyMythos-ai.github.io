# 产品界面截图

## 2026-10-18：Keynote 同一工作案例

用户指定的 `fusion-harness/artifacts/presentations/2026-10-11-skymythos-product-keynote/output/SkyMythos-从MaaS到企业AI-Native-产品逻辑优化版.pptx` 提供订单导出的四个界面状态。按实际播放页码 9 / 11 / 10 / 12 提取原 PNG，组织为目标 → 方案审批 → 执行 → 交付，不执行 PPT 或提取目录中的代码，不改写图像。全部为 PPT 标注的固定演示数据；不同状态 ID、测试数及 PR 编号不能当作同一真实后端运行或客户结果。

| 文件 | PPT 内部资源 | SHA-256 |
| --- | --- | --- |
| `keynote-order-goal.png` | `ppt/media/image3.png` | `2f3e9737e61ad814861cc3fd29ada3066c3b359941e3df31d1d029e718ea6c4f` |
| `keynote-order-approval.png` | `ppt/media/image5.png` | `f185a3b1a09306da028db95b127d42c544c664ab738b56166232086191e2143c` |
| `keynote-order-execution.png` | `ppt/media/image2.png` | `461a433366e41a0ba47c30b2f94be2de12c653b289313bf7ffb4195776cb37f7` |
| `keynote-order-delivery.png` | `ppt/media/image6.png` | `aa30353513bb1b15ae7856b83f9729efa128924f16cc56fe16d073dc64af0e4d` |

原尺寸均为 3200 × 1800。工作方式页的 `order-delivery` 演示只改变取景与状态帧，保留原图放大；英文页明确说明中文 Console。方案审批是本示例的策略，不宣称所有工作每步均强制审批。此轮没有调用模型、生产控制面或真实 Git 交付。

## 2026-10-17 更新

新增截图固定来自 `fusion-harness` 已提交版本 `7dbef18003096915123a588a24067ce6340e3289`。通过 Git archive 导出 Console 源码至独立本地目录，使用现有依赖构建，未混入主产品工作区未提交的工作台实验。Chrome 视口为 1440 × 960，DPR 1；未改写产品 DOM 或 CSS。

- `employees-current.png`：Agent Employee → 其他员工，展示工作经验创建与 Marketplace 雇用入口。
- `formation-sources.png`：填写职责并选择已保存且可用的经验。
- `formation-plan.png`：分析之后、创建之前的人工确认方案，保留拟形成的 Skill 及来源。
- `formation-result.png`：确认后的示例结果，分别呈现 Skill、角色和员工入口。
- `agent-create.png`：实际新建 Agent 页面，填写示例名称与指令，模型按真实接口合同提供；未提交创建。
- `connectors.png`：统一连接入口的 Git 示例授权详情。
- `onboarding.png`：普通成员的可选个人配置，明确进入不创建 Sandbox。

原生经验流程通过实际控件连续操作；分析、确认和查询响应全部由浏览器路由拦截并返回内存示例。未调用模型、真实控制面或外部工具。其他未定义写入一律拒绝。员工演示使用上述四张当前图（目录、来源、方案、结果），替代原有旧版培养窗口分镜。旧图片保留为历史资源，不代表当前培养入口。

以下为 2026-10-15 其他界面的来源记录；未更新的对话、模型选择与知识截图仍为该日期版本的操作示例，不能用来证明最新导航布局。


2026-10-15 从同工作区 fusion-harness 当前 Console 前端源代码构建并在 Chrome 中渲染。页面、导航、控件与排版均为实际 React 实现；全部身份、工作区、员工、任务、模型配置和资料均为本地示例数据。未连接真实控制面、账号、模型或业务环境；图中的任务状态与文档索引状态不是业务验收结果。

- `chat-workbench.png`：Fusion Bot 的新建 Agent 会话，展示需求输入与当前运行工具／模型入口。
- `employees.png`：Fusion Bot → 员工，展示员工目录、从经验培养和从 Agent Hub 雇用入口。
- `agent-setup.png`：新建 Agent 会话的运行工具选择器，展示 Codex／Claude Code 的当前部署示例。不是任务创建表单，也不是全量兼容矩阵。
- `task-detail.png`：任务详情，展示同一任务的对话、工作流、节点配置和继续工作入口。
- `knowledge.png`：知识库文档页，展示虚构资料的来源、发布及索引状态。

截图使用 1440 × 900 桌面视口、1.5 倍像素密度。对话、员工目录和选择器通过浏览器原生截图范围截取有效区域；不修改产品 DOM、CSS 或图像内容。宽高由 `src/content/console-screens.ts` 记录，避免图片载入后布局跳动。英文页面明确标明截图是中文界面，所有页面均标明示例数据。

复现依据为 Console 现有 `my-ai-memory-preview.mjs` 固定数据服务及 `workspace-chat-page.test.tsx`、`task-chat-browser.js`、`knowledge-page.test.tsx` 的接口合同。组件 `ConsoleFigure` 在网页内统一提供原图链接、原生对话框放大、键盘退出与来源说明。更新截图时应重新核对入口与文档步骤，不能用手绘占位图冒充产品页面。

## 连续界面状态演示

`demos/` 中的三组图片同样来自当前 Console 的真实组件，全部通过原生控件切换状态后截图。每组四帧保持相同的桌面视口与裁剪位置：1440 × 900 CSS 像素视口，裁剪主工作区域 `(238, 60, 1202, 740)`，DPR 1.5，输出均为 1803 × 1110 PNG。没有覆盖产品 DOM、修改产品 CSS、重绘按钮或合成结果卡片。

- `employees-*`：主管的原生工作记录与执行依据 → 填写培养目标的原生对话框 → 形成回执、角色／技能和员工入口 → 同一员工的就绪与开始协作入口。培养的示例回执已包含形成员工；没有虚构培养后必须再去市场雇用的步骤。新员工没有被填入主管的历史工作记录。
- `agent-setup-*`：填写目标 → 打开运行工具选择器 → 切换到 Claude Code 后打开独立模型选择器 → 已确认的工具与模型组合。模型目录依据实际请求的 `runtimeId` 返回示例候选，Codex 使用 OpenAI Responses，Claude Code 使用 Anthropic Messages。模型名明确带“示例”，图片不构成品牌兼容矩阵，也未启动模型执行。
- `knowledge-*`：已发布文档目录 → 原生检索测试问题 → 带版本和片段标识的原生命中结果 → 点击标题打开命中对应的发布版本正文。返回的片段与该版本原文一致；未使用虚构的 AI 回答字段，也没有把未发布草稿展示为检索结果。

捕获使用单独的 `127.0.0.1:4181` 固定数据服务。所有 `/api/**` 请求由浏览器捕获层拦截，未定义写入口直接拒绝；培养和检索请求只返回内存中的示例响应，不访问真实控制面、模型或业务数据。员工就绪、来源覆盖、索引状态与命中分数全部为说明操作的虚构数据，不代表实际培养、检索质量或工作验收。

原生组件和合同依据：`my-ai-page.tsx`、`employee-components.tsx`、`colleague-api.ts`、`chat-model-picker.tsx`、`knowledge-base-page.tsx`、`knowledge-document-page.tsx` 及其测试。截图热点来自原生元素的实际 `getBoundingClientRect()`；对正文与短文本使用 DOM Range 获取可见字形范围，避免把空白容器当作内容区域。最终区域坐标以每张新截图为准，不复用旧图的百分比。

官网以 `src/content/product-demo-stories.ts` 记录双语步骤、原图尺寸和焦点。英文展示明确说明 Console 使用中文，所有演示均标明示例数据。播放器只移动查看区域、显示指针并切换真实状态帧，图片中的产品内容保持原样；自动轮播，鼠标悬停不停，不显示播放或阶段切换按钮，键盘聚焦和打开原图时暂停。
