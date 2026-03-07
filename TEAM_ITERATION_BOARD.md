# YourCityCouple 团队执行任务板（V1）

> 目标：围绕“情绪价值 + 完成率 + 分享率 + 回访率”做 4 周迭代，不做强制支付。

## 团队分工

| 角色 | 负责人 | 核心职责 |
|---|---|---|
| 产品负责人 | 你（Owner） | 定义优先级、验收范围、每周复盘 |
| 体验设计师 | UX | 交互与文案情绪价值、信息架构 |
| 小程序前端 | FE-MP | 小程序功能实现与回归 |
| Web 前端 | FE-Web | `docs/` 与小程序能力对齐 |
| 技术负责人 | TL | 技术债治理、稳定性、埋点规范 |
| 增长分析 | Growth | 实验设计、数据口径、结论输出 |

## 本周（Week 1）执行中：P0 漏斗修复

| ID | 任务 | 负责人 | 关键文件 | 验收标准 | 估算 |
|---|---|---|---|---|---|
| W1-P0-01 | 首页主 CTA 聚焦（弱化看板入口） | FE-MP + UX | `pages/index/index.wxml`, `pages/index/index.wxss` | 首屏仅一个主按钮；看板变次级入口 | 0.5 人天 |
| W1-P0-02 | 未完成测试续测入口 | FE-MP | `pages/index/index.js`, `pages/quiz/quiz.js` | 首页可显示“继续测试（x/6）”；进入后从断点继续 | 1.0 人天 |
| W1-P0-03 | 答题支持返回上一题修改 | FE-MP | `pages/quiz/quiz.wxml`, `pages/quiz/quiz.js`, `pages/quiz/quiz.wxss` | 第2题起可返回上一题；修改后答案覆盖正确 | 1.0 人天 |
| W1-P0-04 | 漏斗埋点补齐（续测/返回/掉线） | TL + Growth | `utils/analytics.js`, `pages/index/index.js`, `pages/quiz/quiz.js` | 新事件稳定上报：`quiz_resume_entry`、`quiz_prev_question`、`quiz_drop_at_question` | 0.5 人天 |

## Week 2：结果页转化优化（P0/P1）

| ID | 任务 | 负责人 | 关键文件 | 验收标准 | 估算 |
|---|---|---|---|---|---|
| W2-P0-01 | 结果页首屏信息分层（核心结论前置） | FE-MP + UX | `pages/result/result.wxml`, `pages/result/result.wxss` | 首屏 3 秒内读完核心结论；扩展内容可折叠 | 1.5 人天 |
| W2-P0-02 | 分享动作语义修正（分享 vs 复制） | FE-MP | `pages/result/result.wxml`, `pages/result/result.js` | 用户点击行为和按钮语义一致 | 0.5 人天 |
| W2-P1-03 | 分享文案 AB（关系化文案） | Growth + FE-MP | `pages/result/result.js`, `utils/analytics.js` | 形成实验数据并可对比分享率 | 1.0 人天 |
| W2-P1-04 | Web 结果页功能同步 | FE-Web | `docs/index.html`, `docs/app.js`, `docs/styles.css` | Web 与小程序结果页交互能力一致 | 1.5 人天 |

## Week 3：回访与仪式感强化（P0/P1）

| ID | 任务 | 负责人 | 关键文件 | 验收标准 | 估算 |
|---|---|---|---|---|---|
| W3-P0-01 | 首页一键点亮今日好运 | FE-MP | `pages/index/index.wxml`, `pages/index/index.js` | 首页可直接点亮，不必进入结果页 | 1.0 人天 |
| W3-P1-02 | 3/7/14 天里程碑奖励反馈 | FE-MP + UX | `pages/index/index.js`, `pages/result/result.js` | 达成里程碑时有明确奖励反馈 | 1.0 人天 |
| W3-P1-03 | 历史结果对比增强 | FE-MP | `pages/index/index.js`, `pages/result/result.js` | 可清楚看到“这次 vs 上次”的变化解释 | 1.0 人天 |
| W3-P1-04 | Web 同步回访模块 | FE-Web | `docs/app.js`, `docs/index.html`, `docs/styles.css` | Web 提供同等回访体验 | 1.5 人天 |

## Week 4：数据闭环与技术治理（P1）

| ID | 任务 | 负责人 | 关键文件 | 验收标准 | 估算 |
|---|---|---|---|---|---|
| W4-P1-01 | 事件字典与字段校验 | TL + Growth | `utils/analytics.js`, `pages/insights/insights.js` | 关键事件字段完整，口径固定 | 1.5 人天 |
| W4-P1-02 | 结果页脚本轻拆分（服务化） | TL + FE-MP | `pages/result/result.js`, `utils/*` | `result.js` 逻辑块明显收敛，易维护 | 2.0 人天 |
| W4-P1-03 | PRD 与实现口径对齐 | 产品 + TL | `PRD.md` | 题量、页面路径、验收标准与代码一致 | 0.5 人天 |
| W4-P1-04 | 发布回归清单与周报模板 | TL + Growth | `docs/ai-autonomy-system-plan.md` 或新文档 | 每周可复盘并形成下周任务 | 0.5 人天 |

## 指标看板（每周必看）

| 指标 | 定义 | 目标趋势 |
|---|---|---|
| 完测率 | `test_complete / test_start` | 持续上升 |
| 结果页行动率 | `(share + copy + poster + restart) / result_view` | 持续上升 |
| 分享率 | `share_actions / result_view` | 持续上升 |
| D1 回访率 | 次日回访用户 / 当日新用户 | 持续上升 |
| 连续点亮占比 | 连续点亮用户 / 回访用户 | 持续上升 |

## 当前状态

- [x] W1-P0-01 首页主 CTA 聚焦（已落地）
- [x] W1-P0-02 未完成测试续测入口（已落地）
- [x] W1-P0-03 答题返回上一题修改（已落地）
- [x] W1-P0-04 漏斗埋点补齐（已落地）
- [x] W2-P0-01 结果页首屏信息分层（已落地）
- [x] W2-P0-02 分享动作语义修正（已落地）
- [x] W2-P1-04 Web 结果页同步（已落地）
- [x] W2-P1-03 分享文案 AB（已落地）

