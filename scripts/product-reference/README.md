# 固定产品投影的消费与刷新

## 日常构建

`npm run build` 的 `prebuild` 只检查仓内
`public/product-reference/033a372f66d5f53bbc8e6b519868238976701c47/`。
`baseline.json` 固定经审阅的 manifest SHA-256，manifest 再固定资源内容。
新增、丢失、损坏、符号链接、不安全 HTML/CSS 或几何漂移均阻断构建。
`npm run test:product-reference` 同时执行这些边界的反例回归。

产品数据是合成示例。九帧均来自指定版本真实组件的只读导出，不是当前产品
HEAD 的自动镜像。三个 result 终态由网站静态 HTML 提供，六个非终态由浏览器
读取并校验后播放；没有产品业务 JavaScript、模型调用、凭据或授权写入。
普通构建不读取相邻产品仓库，不自动重采或修改基线。

## 显式生成候选

仅在需要升级参照、且有已安装依赖的授权产品工作树时，运行维护工具：

```bash
node scripts/product-reference/capture.cjs \
  --product-root /absolute/path/to/product-web \
  --output /absolute/path/to/new-candidate-directory \
  --playwright-module /absolute/path/to/playwright/index.js \
  --chromium /absolute/path/to/browser-executable
```

所有参数均须显式提供。输出目录必须是新的目录；工具只读核对产品源码与
编译输入，在候选输出内构建隔离参照。候选包含本地来源审计及应用构建，
**不得整包复制到 public 或提交**。不要从下载的未知目录运行解释器或构建工具。

刷新必须人工检查真实组件、合成数据、inert、空密码、DOM/CSS、固定尺寸、
资源来源及许可，再有意识地选择最小公开资源并审阅基线差异。不得从官网
renderer 生成独立预期，也不得通过重写基线或放宽阈值消除失败。
当前发布资源没有未审阅的 logo 外置转换；`transformation.json` 记录其状态。

## 独立检查

`tests/product-fidelity/` 使用另存的真实组件 DOM 和**未适配的原始 CSS**作预期，
比较静态回退与实际播放状态的文字、结构、样式、相对几何和像素。
独立参照刷新有单独的显式导入入口，绝不由 build 自动执行。
播放时序、暂停、网络失败和零副作用合同由商业回归另行检查。
这些检查不证明当前产品业务、认证或真实写入端到端验收。
