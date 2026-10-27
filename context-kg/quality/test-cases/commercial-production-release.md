---
type: Test Case
title: 商业官网正式迁移与发布门禁
description: 验证中文商业站在真实 Next 静态导出中的路由、只读投影、客户端生命周期、独立保真及发布身份。
tags: [官网, 商业站, 静态导出, 发布, 保真, 只读]
status: draft
sources:
  - resource: /../scripts/check-export.cjs
    title: 正式静态产物的联合检查入口
  - resource: /../scripts/commercial/run.cjs
    title: 七套商业浏览器回归
  - resource: /../tests/product-fidelity/check.cjs
    title: 独立真实组件参照检查
  - resource: /../tests/commercial-runtime/read-asset.cjs
    title: 真实生产读取器的网络完成及流式预算回归
  - resource: /../scripts/commercial/browser-version.json
    title: 固定测试引擎及上游修复来源
  - resource: https://chromium.googlesource.com/chromium/src/+/62473ad0f747e245e514c93e741bb8e168a2a207
    title: Chromium完整流消费后误报取消的修复
  - resource: /../.github/workflows/deploy.yml
    title: 同提交构建与 Pages 发布链
  - resource: https://github.com/smontlouis/bible-strong-avatar-lab/blob/79fe9ba06e4874b11394b8e8a3f2c493c9d197ba/LICENSE
    title: 头像库固定上游版本的 AGPL 许可
  - resource: https://github.com/smontlouis/bible-strong-avatar-lab/blob/79fe9ba06e4874b11394b8e8a3f2c493c9d197ba/packages/avatar-react/src/styles.css
    title: 投影中头像样式的公开原始源码
---

# 商业官网正式迁移与发布门禁

## 适用范围与前置条件

Case ID：`COMMERCIAL-RELEASE-01`。本用例针对迁入正式 Next 工程的中文商业 V3，
不以历史本地预览的通过报告替代。使用仓内锁文件、Node22.19+、固定版本Playwright
SDK与`browser-version.json`指定的Chrome for Testing引擎；先运行`npm run install:browser`
及资源门禁和真实`npm run build`，再检查生成的`out/`。Linux先安装浏览器系统依赖。
允许显式选择本机 Chrome，但报告应注明平台，不泛化为实体设备或全浏览器验收。

产品投影固定来源版本为 `033a372f66d5f53bbc8e6b519868238976701c47`。
普通构建不得读取邻仓、自动重新捕获基线、依赖私有协作目录或发布产品业务应用。

## 操作与独立预期

1. `npm run lint`、`npm run test:locale-routes`、`npm run test:product-reference`、
   `npm run build`、`npm run typecheck` 必须返回0；故意损坏资源／改hash／注入可执行
   内容的反例必须非零，不能通过重新生成基线消除失败。
2. `npm run test:export` 对真实产物运行七套商业回归与独立保真。13个中文商业页面
   直接访问、刷新和导航有效；英文、双语docs和旧深链保留，无虚假英文商业镜像。
   中文独有页切换英文回首页，真实对应页保留适用query/hash，空与非空basePath均检查。
3. 首屏保持蓝色居中主张与完整产品图，能力区保持同窗双向上推、末项释放和自然阅读
   回退。真实字体与CSS就绪后测几何，不能用属性变化代替实际位置／可达性验证。
4. 三场景分别按0／6／12秒选择start／middle／result；加载时间不计播放时间。
   交接、非当前、离屏、后台、键盘阅读和dialog暂停；已完成结果留存。
   慢载、失败、损坏与取消保留完整终态，迟到结果不得重启或重排已阅读的跑道。
5. 产品根保持inert、空密码和原尺寸1280canvas，小窗口展示连续桌面节选、不整体缩放。
   只允许声明的同源静态读取；无模型／业务API、授权、网络写入、cookie或持久化。
   预约仅本地预览，不发送、不保存，不宣称已预约。
6. 无JS及减少动态都有三个完整、正确样式的终态；普通客户端换页、返回、重复进入
   都正确建立／释放Shadow和监听，不以抑制hydration警告代替行为验证。
7. 独立保真使用真实组件捕获的DOM与原始未适配CSS。固定内部viewport不变，只将外层
   iframe放到实测文档坐标并复制外层scroll/DPR，前后断言内部几何／样式不变；对同一
   可见区域作确定性裁切，不搜索偏移。文字、结构、样式、相对几何及0.5%像素阈值均
   保持；隐藏确认入口和改字号的真实反例必须被拒绝。静态矩阵与实际播放九状态分开
   报告，不能把终态成功泛化为全部动效保真。
8. 正常墙钟播放与录像解码另行目检；Lighthouse及载荷重新实测，报告CPU竞争、浏览器
   和服务传输条件，不借历史成绩或把严重性能回退当通过。
9. 仅拟提交文件在干净目录`npm ci`后构建／检查，证明可复现；精准暂存，不含本地
   草稿、个人工具配置或完整私有产品源。推送后只接受同head SHA的Actions与Pages成功，
   再检查正式域名页面、关键资源、canonical及应为404的私有路径。

## 覆盖状态与边界

当前整体发布门禁尚未通过。2026-10-27，用户获知下列检查失败、性能及分发许可未决后明确要求“直接提交，先不考虑，继续”，因此先提交、推送并触发现有Actions；这不是检查通过或许可核定，不修改CI和既有断言。下述未提交／暂缓表述属于该指令之前的检查状态，实际部署仍需对应提交的Actions证据。

该次实际提交为`b531970137f0e8c2ee915879e4231dc058839223`，对应[Actions 40440195105](https://github.com/SkyMythos-ai/SkyMythos-ai.github.io/actions/runs/40440195105)生产构建及类型通过、浏览器验收失败、Pages部署跳过。2026-10-27用户要求修复，范围为真实静态读取完成事件与hash历史导航。CI归档stack确认超时在Back后的hash／当前项联合等待；失败时methods已是当前项，但URL丢失fragment。这只确定失败位置和表现，不证明控制器或测试准备的根因。修复必须保留真实字节上限、独立网络完成断言及原有导航预期，不以增加等待时限替代定位。

2026-10-27修复定位：Chromium上游提交`62473ad0…`说明了完全相同的no-store响应／手动读到EOF后错误发出`Network.loadingFailed`的情况，原因是通知消费方前未记录流的终态。已核对157.0.8103.15标签源码包含修复顺序，测试引擎改为这一精确版本；不修改生产读取器、1MB／64KB上限、15秒期限、hash或网络失败断言。新回归直接执行生产读取器，真实七资源在六个独立context中需字节／SHA相同、全部requestfinished且零异常失败；另覆盖12个受控字节／取消边界及准确15秒后的迟到安装拒绝。本地受控边界已通过，新引擎下载超时，实际新引擎及完整联合结果待Linux CI验证，不凭上游源码就宣称本项目通过。

hash历史缺陷已独立红→绿：以6倍CPU节流重复三次，确认测试在初始hydration前创建片段导航，随后Next首次canonical replace擦除该历史项；Back恢复的是本来已丢锚点的项。测试准备仅增加初始stage真实挂载就绪等待，同一复现三次通过、普通CPU三次通过；原等待期限、hash／当前项／几何与资源断言不变，生产控制器未改。手动／键盘／wheel仍保持URL不变，不将hash改成持续状态源。

以下为修复前的迁移验收记录，失败及未决事项保留历史身份；不作为修复后的通过证据。

2026-10-27正式冻结候选的已执行覆盖：生产构建75页、类型、有效lint（0错误／16warning）、
资源8组及语言／68条sitemap的双basePath检查通过；运行时10项检查（含汇总）及完整
独立保真38项通过。后者包括36个静态／真实播放状态的像素比较（均0差异）与2个真实
突变拒绝；不能由此推导发布完成。手机Lighthouse在gzip冷加载条件下仍为73分、
LCP5.785秒（桌面95／1.443秒），性能验收未通过。超大hero图是报告中明确的改进机会，
不能把预测节省或本地无压缩／压缩差异直接当作生产收益。

干净目录的联合入口实际为exit1：451.34秒完成，七套4过3失败。scroll、通用UI、多页与
B通过；hero、pinned、native存在尚未解释的静态产品请求ERR_ABORTED，因此联合入口
没有执行下游runtime／fidelity。根目录独立10项／38项通过不能替代这次联合入口成功。
运行期间源与产物起止身份相同，并非测试中途漂移。有界最小探针已确认事件可发生在
200响应、全量读取完成、没有signal.abort之后；手动reader与有界pipeTo均复现，原生
arrayBuffer对照不复现。不能因此放弃1MB流预算或添加泛化忽略规则；未证明安全修复
之前仍按失败处理，未提交、推送或部署。此结果不证明帧数据丢失或全部播放坏掉。

公开分发另需核对固化资源中的第三方头像／CSS许可和适用源码义务。已核对实际包为
`@bible-strong/avatar-core@0.1.0`与`@bible-strong/avatar-react@0.1.0`，上游固定提交
`79fe9ba06e4874b11394b8e8a3f2c493c9d197ba`声明AGPL-3.0-only；原始头像CSS公开可得，
没有发现额外的CC0／商业许可／SVG输出例外。AGPL §2本身仅在输出内容构成covered work
时才覆盖输出，因此不能仅因使用生成器就断言整个官网自动变为AGPL或必须公开完整
私有产品源。当前缺口是适用范围及分发方案尚未核定，不是已证实侵权；单独NOTICE
也不能作为该决策已完成的证明。确认前不公开推送相关资产。
原本地参照最后35项27过8失败保留历史身份；其source body摄影机失效不能自动等同
官网缺陷，也不能被新报告改写为成功。新的正式检查拥有独立来源及产物身份。

源码检查、静态页面、浏览器合成事件与冻结组件参照均不证明实时产品业务、真实
认证／写入、实体设备、完整WCAG或实际BFCache命中。部署成功也不等同业务验收。
