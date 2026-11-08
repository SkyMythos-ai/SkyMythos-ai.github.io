# SkyMythos.ai 官网

企业 AI-Native Harness 的产品官网，包含产品介绍、价格与合作、Fumadocs 产品文档和询价表单。使用 Next.js 16、React 19、Tailwind CSS 4 与自有亮暗主题。

## 本地开发

需要 Node.js 24。

```bash
npm ci
npm run dev
```

浏览器访问 `http://localhost:3000`。`npm run check` 执行 ESLint、TypeScript 和生产构建。

## 内容维护

- 首页、产品与价格：`src/components/sites/fusion/`
- 文档正文与导航：`content/docs/en/`、`content/docs/zh/`
- 品牌与字体：`public/sites/fusion/`
- 页面主题：`src/app/fusion-theme.css`
- Node 模式询价服务：`src/app/api/poc/`、`src/lib/poc-server.ts`

报价方式为 POC 与企业项目单独评估，不预设金额、免费试用、交期或服务承诺。

## 中英文

官网及完整产品文档支持英文、简体中文。无前缀路径默认英文，中文版使用 `/zh/`，例如 `/pricing/` 与 `/zh/pricing/`。语言由 URL 决定，首次访问不会按浏览器偏好自动跳转到中文。

页头和文档导航提供语言切换，保留页面路径、询价参数与章节锚点。英中文档的对应章节使用相同显式 ID；新增章节时同步维护两份正文。两种语言各自生成搜索索引，英文 `/search-index.json`，中文 `/zh/search-index.json`。

路由位于 `src/app/(en)/` 与 `src/app/zh/`，共用组件及语言内容。两个根布局在构建时分别输出正确的 `html lang`；`src/lib/i18n.ts` 负责路径与语言替代链接。表单显示与错误跟随语言，原有询价数据合同保持兼容。

## GitHub Pages

```bash
npm run build:pages
```

静态输出位于 `out/`，独立缓存为 `.next-pages/`。推送 `main` 后，`.github/workflows/deploy.yml` 自动构建并发布到已有 GitHub Pages，域名由 `public/CNAME` 保留。

Pages 没有 Node.js 服务端：文档搜索在浏览器读取构建生成的静态索引；询价页面不发送服务器 POST，也不把未发送的资料显示为已接收。企业询价入口保留查询参数及对应文案。开发用 Linear 参考页不进入静态发布。

如需真实接收申请，应使用支持服务端的部署模式，并在服务器配置 `.env.example` 所列接收渠道。密钥不应出现在静态网页、仓库或浏览器请求中。

## Node.js 部署

```bash
npm run build
npm run start
```

Node 构建保留询价接口。完整 standalone 交付还需按照 Next.js 要求提供 `public/` 与静态资源；GitHub Pages 发布不依赖 Node 服务。

## 验证与来源

`scripts/fusion/` 提供浏览器与表单验证脚本；浏览器验证额外需要本机 Playwright 与 Chromium，可通过 `PLAYWRIGHT_MODULE`、`CHROME_PATH` 指定安装位置。证据输出在 `docs/research/fusion/` 和 `docs/design-references/fusion/`，不属于网站静态内容。

`node scripts/fusion/verify-pages.mjs` 在纯静态服务上验证两种语言、文档搜索、询价状态和布局；其他既有专项脚本保留中文路由回归。

项目最初基于 [AI Website Cloner Template](https://github.com/JCodesMore/ai-website-cloner-template) 搭建，保留其 MIT 许可证。Linear 页面与素材仅为独立开发参考；SkyMythos 主站使用自有品牌与产品内容。
