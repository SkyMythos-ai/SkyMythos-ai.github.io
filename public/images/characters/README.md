# 已确认的人与 Agent 形象

- `person.svg`：用户于 2026-10-18 选定的「02 极简半身」，无五官、圆领；保留设计稿的路径、颜色和 120 × 156 比例。
- `agent.svg`：按用户要求直接使用 Grok Bot 存档造型，不是本站原创角色。来源为 [iduu/grokbot-animation 的 original-data.js](https://github.com/iduu/grokbot-animation/blob/6c27d9640c37e02e1eab0c4f7d98fa01196c66b8/component/original-data.js)，固定版本 `6c27d9640c37e02e1eab0c4f7d98fa01196c66b8`。使用 `HEAD_PATH` 与默认 idle 表情 `EXPRESSIONS[0]` 的两组 48 点坐标，保持眼形、位置和 `viewBox="-15 -15 259 259"`。源文件 SHA-256：`8bc24b492b486afeada7c5093c7dead4de59e47e82270fc4c3077cf22950b45d`。
- 该公开仓库注明数据提取自 x.ai 公开脚本；获取时 x.ai 官网返回 HTTP 403，未能与当前官网实时比对。未执行下载的 JavaScript，仅解析数据字面量。来源说明不等于单独的授权声明。
- Grok Bot 在这里仅代表 Agent 角色，不表示产品仅支持 Grok、使用 Grok 服务或获得 xAI 背书。

`character-parts.tsx` 原样复用两张同源 SVG。首页 `WorkSystemOverview` 使用人、通用 Agent、工作产物和方法档案表达平台价值；人在整理确认位，方法按授权支持下一项工作，不把培养数字员工当作任何工作的前置条件。完整培养图只出现在工作方式页（保留 `/concept` 路由）：`workflowFrame` 从日常工作开始，先留下记录与经验，经人整理确认后才形成员工，随后委派新任务并由人审阅交付。来源记录在形成员工后仍保留，不声称自动训练模型。人物不再有机械肢体或身体组装动作。

运行 `node scripts/check-work-system.cjs` 验证当前首页的工作、记录、人工确认、方法保留及授权复用；`node scripts/check-product-story.cjs` 保留旧协作模型的 601 个位置回归，不代表当前首页挂载。

运行 `node scripts/check-home-workflow.cjs` 可验证 1001 个位置的来源、确认、员工形成与后续任务顺序，防止回退为「先有员工、后补经验」。

场景由 Server Component 直接输出，角色图片由浏览器缓存复用。旧的立体概念图导出脚本和整图 SVG 已移除；不再需要「构建 → 导出整图 → 再构建」。运行 `npm run build` 即可更新本地静态版本。

播放规则保持：自动轮播、鼠标悬停不停、不显示动画控制按钮；键盘聚焦、减少动态、离屏及后台边界保留。无脚本时保留完整静态图和阶段说明。
