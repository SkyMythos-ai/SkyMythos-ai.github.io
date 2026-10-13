# SkyMythos 官网

SkyMythos 产品官网的源码。采用 Next.js 静态导出（`output: 'export'`），产出纯静态 HTML，可直接部署到 GitHub Pages，同时保持完整的 SEO 能力。

## 技术形态

站点在构建期把每个路由预渲染为完整 HTML，因此搜索引擎抓取到的是成品页面而不是空壳。代价是不能使用服务端渲染、增量静态再生成和 Next 的按需图片优化——对本站没有影响。

| 关注点 | 做法 |
| --- | --- |
| 静态导出 | `output: 'export'`，产物在 `out/` |
| 样式 | Tailwind CSS v4（CSS-first `@theme`） |
| 字体 | IBM Plex Sans / IBM Plex Mono，构建期自托管；中文使用系统字体栈 |
| 文档正文 | Markdown 字符串 + `react-markdown`，构建期渲染 |
| 语言 | 中文（默认，`/zh`）与英文（`/en`）两套完整路由树 |
| SEO | 每页预渲染 HTML、canonical、hreflang、sitemap、robots、JSON-LD |

## 本地体验

```bash
./scripts/preview.sh          # 开发模式，改代码即时热更新
./scripts/preview.sh static   # 生产预览，与 GitHub Pages 上线效果一致
```

打开 http://localhost:3000/zh/ （中文）或 http://localhost:3000/en/ （英文）。端口可用 `PORT=4000 ./scripts/preview.sh` 修改。

脚本会先检查 Node 版本（需 20.9+），并检测 `node_modules` 是否为当前平台安装。Next.js 的编译器是平台相关的原生二进制，在别的系统（例如 Linux 容器）装的依赖拿到 macOS 上会报 `Failed to load SWC binary`；脚本发现不匹配时会自动清掉重装。

等价的 npm 命令是 `npm run local` 与 `npm run preview`。不经脚本时，`npm install && npm run dev` 也可以，前提是依赖是在本机装的。

访问 `/zh` 会被 308 跳转到 `/zh/`，这是 `trailingSlash: true` 的预期行为，与 GitHub Pages 上的地址形式保持一致。

类型检查与 lint：

```bash
npm run typecheck
npm run lint
```

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。首次部署需要在仓库设置中把 Pages 的来源选为 **GitHub Actions**。

工作流自动判断站点类型：仓库根存在 `public/CNAME` 时按自定义域名部署（根路径），否则按项目站点部署（`/<仓库名>/` 子路径）。

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
    layout.tsx                    根布局：字体与全局样式
    page.tsx                      根路径重定向到默认语言
    not-found.tsx                 404（双语文案）
    icon.tsx / apple-icon.tsx     构建期生成的站点图标
    robots.ts / sitemap.ts        SEO 元数据路由
    [locale]/
      layout.tsx                  语言与站点外壳
      page.tsx                    首页
      concept/page.tsx            产品概念
      architecture/page.tsx       架构
      docs/
        page.tsx                  手册目录
        [...slug]/page.tsx        文档正文
  components/                     页面区块与可复用组件
  content/
    dictionary.ts                 界面文案（中英）
    types.ts                      内容模型
    registry.ts                   文档注册表
    docs/{zh,en}/                 文档正文，按章节分文件
  lib/                            工具：i18n、SEO、字体、标题锚点
  styles/globals.css              设计令牌与全局样式
```

## 内容维护

**改界面文案**：编辑 `src/content/dictionary.ts`。它是带类型约束的完整记录，漏译会导致编译失败，而不是在页面上留下一块空白。

**改文档**：编辑 `src/content/docs/<语言>/<章节>.ts`。正文是 Markdown 字符串。

新增文档页时必须同时做三件事：在两个语言树里添加同一个 `slug`；在对应的 `index.ts` 里导出；确认 `readingOrder` 唯一。两个语言树的 slug 列表必须完全一致——语言切换和 sitemap 都依赖这一点。

`##` 与 `###` 标题会自动生成锚点 id，并出现在右侧的「本页内容」里。标题文本重复会导致锚点冲突，请在同一个文件内保持标题唯一。

**改设计令牌**：编辑 `src/styles/globals.css` 的 `@theme` 区块。站点只有一条结构性规则：中性灰承载全部结构，只有一个信号色用于可操作与执行中状态。绿色既不是品牌色也不是成功色。

## 许可

许可条款以主仓库中的实际声明为准。本仓库当前未包含独立的 LICENSE 文件。
