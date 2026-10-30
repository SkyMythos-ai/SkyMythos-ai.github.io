# SkyMythos 官网

SkyMythos 产品官网的源码。采用 Next.js 静态导出（`output: 'export'`），产出纯静态 HTML，可直接部署到 GitHub Pages，同时保持完整的 SEO 能力。

## 技术形态

站点在构建期把每个路由预渲染为完整 HTML，因此搜索引擎抓取到的是成品页面而不是空壳。代价是不能使用服务端渲染、增量静态再生成和 Next 的按需图片优化——对本站没有影响。

| 关注点 | 做法 |
| --- | --- |
| 静态导出 | `output: 'export'`，产物在 `out/` |
| 样式 | Tailwind CSS v4（CSS-first `@theme`） |
| 字体 | IBM Plex Sans / IBM Plex Mono，构建期自托管；中文使用系统字体栈 |
| 视觉 | 中文首页采用 Linear + Blueflame 参考的深色工作轨迹与能力沉淀叙事；中文商业内页、英文和文档保留各自版式 |
| 主视觉 | 首页直接运行本地产品的真实 React 组件与原 CSS/TDesign，组合真实组件连续演示任务执行、经验形成员工方案及知识检索打开原文；旧版冻结参照保留在产品内页，完整 B 生命周期保留在工作方式页 |
| 文档正文 | Markdown 字符串 + `react-markdown`，构建期渲染 |
| 语言 | 中文商业站 13 页；英文首页、概念与架构，以及双语文档保留。只为真实对应页生成语言镜像 |
| SEO | 每页预渲染 HTML、canonical、hreflang、sitemap、robots、JSON-LD |

## 本地体验

```bash
./scripts/preview.sh          # 开发模式，改代码即时热更新
./scripts/preview.sh static   # 生产预览，与 GitHub Pages 上线效果一致
```

打开 http://localhost:3000/zh/ （中文）或 http://localhost:3000/en/ （英文）。端口可用 `PORT=4000 ./scripts/preview.sh` 修改。

脚本会先检查 Node 版本（需 22.19+，与 CI 及固定版本 Lighthouse 工具链兼容），并检测 `node_modules` 是否为当前平台安装。Next.js 的编译器是平台相关的原生二进制，在别的系统（例如 Linux 容器）装的依赖拿到 macOS 上会报 `Failed to load SWC binary`；脚本发现不匹配时会自动清掉重装。

等价的 npm 命令是 `npm run local` 与 `npm run preview`。不经脚本时，`npm install && npm run dev` 也可以，前提是依赖是在本机装的。

访问 `/zh` 会被 308 跳转到 `/zh/`，这是 `trailingSlash: true` 的预期行为，与 GitHub Pages 上的地址形式保持一致。

类型检查与 lint：

```bash
npm run lint
npm run test:product-reference
npm run build
npm run typecheck
npm run test:browser-installer
npm run test:export-runner
npm run install:browser
npm run test:export
```

`test:export` 启动只绑定本机的静态服务器，对真实 `out/` 串行执行资源读取／取消边界、商业页／演示回归、运行时重复换页与独立产品保真检查，各独立组即使有失败也继续串行收集结果，任一失败最终返回非零并阻止部署；收到中断信号则立即停止后续组。`test:export-runner` 直接执行实际入口的隔离编排回归，验证失败汇总、中断和服务器释放。`test:runtime` 与 `test:fidelity` 也可对已运行的 `PREVIEW_URL` 单独执行。`EVIDENCE_DIR` 可指定报告目录，默认位于系统临时目录，不进入 Pages 产物。

浏览器默认固定为 `scripts/commercial/browser-version.json` 中的 Chrome for Testing **157.0.8103.15（Beta）**，Playwright SDK 仍为固定稳定版。156 存在将已完整消费的流误报为取消的[上游缺陷及修复](https://chromium.googlesource.com/chromium/src/+/62473ad0f747e245e514c93e741bb8e168a2a207)，故暂用已核对源码包含修复的157，不以忽略网络错误绕过。`npm run install:browser` 需要 Python3，把下载／解压分别隔离到仓外新空目录，校验归档并缓存；Linux还需先运行 `npx playwright install-deps chromium`。安装器不执行归档中的脚本，测试启动时核对实际引擎版本。后续稳定版包含该修复时再显式更新固定版本。`BROWSER_CHANNEL` 或 `BROWSER_EXECUTABLE_PATH` 仍可显式选择诊断浏览器，报告会记录实际版本和覆盖设置，不能把旧引擎上的诊断等同默认CI验收。

产品演示是固定版本的示例数据、只读状态，不调用模型或产品业务 API；预约表单也只提供本地需求预览，不发送或保存资料。生产构建校验仓内冻结资源，不依赖相邻产品仓库、`.handoff` 或个人缓存。独立保真夹具来自真实组件捕获的 DOM 与原始 CSS，不导入官网 renderer 定义预期；其通过不等于实时产品或业务 E2E 通过。

新启用的 ESLint 保留两个既有演示组件的限定 compiler-rule warning 基线；新商业代码仍使用 error 级规则。ESLint 9 固定版本是当前 Next lint 插件共同支持的版本，待插件支持 ESLint 10 时再同步迁移，不用无效 peer 依赖维持 CI。


## 部署到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。首次部署需要在仓库设置中把 Pages 的来源选为 **GitHub Actions**。

工作流自动判断站点类型：仓库根存在 `public/CNAME` 时按自定义域名部署（根路径），否则按项目站点部署（`/<仓库名>/` 子路径）。推送 `main` 仍在全部检查通过后自动部署。手动运行可设置 `deploy=false`，在指定分支完成相同完整检查但不发布；这不跳过任何构建或测试。

### 环境变量

| 变量 | 作用 | 默认 |
| --- | --- | --- |
| `BASE_PATH` | 站点部署的子路径，留空表示根路径 | 空 |
| `NEXT_PUBLIC_BASE_PATH` | 同上，供客户端代码读取 | 空 |
| `NEXT_PUBLIC_SITE_URL` | 生成 canonical、sitemap 与 Open Graph 时使用的正式域名 | `https://skymythos.ai` |

在 GitHub 仓库的 **Settings → Secrets and variables → Actions → Variables** 中设置 `SITE_URL`，即可覆盖默认域名，无需改动代码。

### GitHub Pages 的两个注意事项

**子路径**：项目站点部署在 `https://<用户>.github.io/<仓库>/`，所有资源路径都需要前缀。`BASE_PATH` 会在构建时注入，`next.config.mjs` 与站内链接都从该变量派生。

**Jekyll**：GitHub Pages 默认用 Jekyll 处理站点，而 Jekyll 会忽略以下划线开头的目录，也就是 `_next/`。工作流会生成 `out/.nojekyll` 来关闭该行为。手动部署时不要漏掉这一步。

## 目录结构

```
src/
  app/
    (gateway)/                    根地址的静态语言入口
    (localized)/[locale]/
      layout.tsx                  正确语言的 document root
      (marketing)/                中文商业页与既有英文营销页
      docs/                       双语文档目录与正文
    global-not-found.tsx          独立双语 404
    robots.ts / sitemap.ts        SEO 元数据路由
  components/
    commercial/                   商业外壳、只读产品展示与局部控制器
    hero-lifecycle/               复用的 B 生命周期模型、SVG 与播放
  content/
    commercial/                   中文商业页作者源与注册表
    dictionary.ts                 既有双语界面文案
    docs/{zh,en}/                 双语文档正文
  lib/                            路由能力、i18n、SEO 与资源合同
  styles/                         独立商业样式与原有文档／营销样式
public/product-reference/         版本化只读产品展示资源
scripts/product-reference/        资源校验及显式刷新工具
scripts/commercial/               可移植浏览器回归
tests/fixtures/product-reference/  独立冻结的真实组件参照（非 public）
```

## 内容维护

**改界面文案**：中文首页正文编辑 `src/components/commercial/harness-home.tsx`，SEO 定位编辑 `src/content/commercial/home.ts`；中文商业内页编辑 `src/content/commercial/`；既有英文营销页与双语共享界面编辑 `src/content/dictionary.ts`。后者是带类型约束的完整记录，漏译会导致编译失败，而不是在页面上留下一块空白。

**改文档**：编辑 `src/content/docs/<语言>/<章节>.ts`。正文是 Markdown 字符串。

新增文档页时必须同时做三件事：在两个语言树里添加同一个 `slug`；在对应的 `index.ts` 里导出；确认 `readingOrder` 唯一。两个语言树的 slug 列表必须完全一致——语言切换和 sitemap 都依赖这一点。

`##` 与 `###` 标题会自动生成锚点 id，并出现在右侧的「本页内容」里。标题文本重复会导致锚点冲突，请在同一个文件内保持标题唯一。

**改设计令牌**：共享令牌位于 `src/styles/globals.css` 的 `@theme` 区块。中文商业页在 `src/styles/commercial.css` 中以 `.commercial-site` 限定浅色版式；既有英文营销面保留其原有样式，文档使用独立中性阅读面。不要将商业页的全局元素规则泄漏到英文或 docs。

**改首页与产品演示**：中文首页使用 harness-home.tsx 与 source-product-demo.tsx。首屏保持原左对齐文案与14f40完整控制台（public/product-demo/），手机保留原桌面界面的左右浏览。首屏之后的持续执行、训练、知识三章统一标题、说明、媒体舞台与功能索引；这些章节的iframe仅隔离产品依赖和原CSS，内部直接组合真实产品的消息、工具、报告、经验来源、员工方案、知识检索与原文组件，不挂完整ProductShell或裁桌面工作台。`scripts/product-scenes/`以共享时钟和对象关系组织24秒原生连续过程，终态3秒后循环；首屏先完整交代已接收目标，再推进工具和报告，超出局部面板的调用与结果随同一时钟滚动。手机主面板使用可用宽度自然换行，不要求横向浏览960px桌面页。

运行 `node scripts/product-scenes/build.cjs` 构建锁定的真实控制台来源，当前输出为 `public/product-scenes/7295629889d881f3485168832359d16d141021f9-composed-v1/`。来源记录包含dirty工作区、源树before/after、实际导入和适配摘要；知识私有组件仅通过构建时追加export暴露，不改产品源。Storage独立内存，数据与API为白名单本地示例，无真实模型、外网或业务写；不构成7×24业务验收。`public/product-demo/14f40.../`仍用于首屏完整控制台；三个正文场景使用新合成产物。正式内页冻结参照独立保留。

`node scripts/commercial/check-home-hero.cjs`验证首屏完整控制台、来源、亮暗/手机及自然周期；`node scripts/commercial/check-composed-scenes.cjs`验证首屏之后的原生场景、自然周期、主题/手机、减少动态、无脚本、焦点/Storage和恢复；`npm run test:commercial -- --suites harness`也映射到该套件。`scripts/product-scenes/check.cjs`用于源组件受控时钟和实际可见矩形检查，不能替代完整自然播放与设计复核。



**改亮暗模式**：`site-theme.tsx`、`site-theme.css` 与 `document-shell.tsx` 共同管理 `html[data-site-theme]`。默认跟随系统，显式切换仅保存 `skymythos-theme`。真实产品演示映射到其原生 `data-theme` 与 `theme-mode`，使用原 TDesign 色板，不用官网色板重画产品。存储不可用时仍可切换，无脚本时通过 CSS 跟随系统。

**维护既有三幕动画**：`src/components/employee-visual-material.ts` 管理石墨材质，`employee-work-visual.tsx` 与 `employee-knowledge-visual.tsx` 管理原生 SVG 构图，`employee-emblem-motion.ts` 管理确定性分镜。`HeroStage` 持有唯一播放时间，`EmployeeScene` 只跟随该时间绘制。此套实现保留给既有页面，不是新版中文能力舞台的入口。

既有营销首页、共享导航和内页样式仍由 `src/styles/home.css`、`site-navigation.css` 和 `interior.css` 维护。

## 许可

许可条款以主仓库中的实际声明为准。本仓库当前未包含独立的 LICENSE 文件。产品投影的第三方材料及许可文本见版本目录内的 `NOTICE.txt`；其中包含由标注为 AGPL-3.0-only 的 `@bible-strong/avatar-core`／`@bible-strong/avatar-react` 0.1.0 生成的 SVG 和相关 CSS。上游源码固定于 [`79fe9ba`](https://github.com/smontlouis/bible-strong-avatar-lab/tree/79fe9ba06e4874b11394b8e8a3f2c493c9d197ba)。来源与保真校验不等于已核定输出及组合范围的分发许可／适用源码义务，公开发布前须单独完成此项审查；不能仅因使用生成器就断言整个官网自动采用 AGPL。

## 当前首页回归范围

首页首屏由 `scripts/commercial/check-home-hero.cjs` 检查完整控制台与自然周期；首屏之后的连续场景由 `scripts/commercial/check-composed-scenes.cjs` 检查真实来源、原组件 DOM 与样式、操作过程、亮暗同步、只读边界及播放时钟。默认商业套件为 `harness,site,native-demos,lifecycle`，其中 `harness` 对应 composed-scenes。生命周期在正式工作方式页检查；旧冻结产品参照的独立保真及解析／资源边界仍在对应产品内页检查，不与新版源组件演示混淆。

首页产品演示不提供播放、暂停、重播或进度控件。可见时自动运行24秒操作链，终态停留3秒后循环；离屏/后台停止并取消循环计时器，回到可见继续，系统减少动态时显示静态终态。回归覆盖自动输入/执行/报告/新周期、原组件来源与隔离、循环重置期间离屏、父焦点保持、桌面/手机亮暗及无脚本回退。测试消息协议仅用于时钟采样；既有工作方式页的手动步骤与跨页生命周期仍独立检查。模拟后台检查不替代真实后台标签页或所有硬件的性能验收。
