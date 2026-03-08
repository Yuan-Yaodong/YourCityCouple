# YourCityCouple LLM Handoff Memory

本文件用于让下一位大模型（如 Claude Code / MiniMax）快速接手项目，减少重复探索。

## 1) Project Snapshot
- 项目名：`YourCityCouple`
- 形态：微信小程序 + Web（`docs/`，用于 GitHub Pages）
- 目标：情绪价值导向的“缘分城市测试”工具
- 当前规模：14 题，23 城
- 当前分支：`feature/wechat-miniprogram-ready`

## 2) Core Product Rules
- 当前阶段不做支付能力。
- 不接入评论/社交轨迹等隐私敏感数据。
- 结果必须“可解释、可复现、可本地计算”。
- 小程序与 Web 主链路体验需一致。

## 3) Scoring Model (Current)
- 基础分：选项对城市的显式权重累加（来自 `utils/data.js`）。
- 关联分：MBTI + 生肖/运势关联小幅加分（用于纠偏，不覆盖主问卷意图）。
- 平衡分：城市曝光归一化系数，抑制头部过热，提升长尾命中机会。
- 同分机制：细分分 + 命中题数 + 稳定 tie-breaker。

## 4) Key Files (Read First)
- 数据源：`utils/data.js`
- 核心计算：`utils/calculator.js`
- MBTI 计算：`utils/mbti.js`
- 解释生成：`utils/analyzer.js`
- 小程序答题页：`pages/quiz/quiz.js`
- 小程序结果页：`pages/result/result.js`, `pages/result/result.wxml`
- Web 同步实现：`docs/app.js`, `docs/index.html`
- 文档：`PRD.md`, `docs/project-backlog.md`, `docs/city-bias-heatmap.md`, `CHANGELOG.md`

## 5) Important Implementation Decisions
- MBTI 自选映射已改为“从第 11 题动态解析”，避免硬编码顺序漂移。
  - 小程序：`utils/mbti.js#getSelfReportedTypeOrder()`
  - Web：`docs/app.js#getMBTITypeOrderFromQuestions()`
- 结果页题目数口径统一为 14 题（包含 fallback）。
- 幸运数字展示采用两层语义：
  - 五行卡：幸运数字范围
  - 综合建议：主幸运数字
- Q7（赛博签文）来源文案稳定；Q8 已替换为主观同路人偏好题。

## 6) Current Known Risks / To Improve
- 城市分布虽已收敛，但仍需周期性复审偏置（见 `docs/city-bias-heatmap.md`）。
- MBTI/生肖关联分仍是“轻量纠偏”，可继续做更细粒度模板化解释。
- Web 与小程序双端逻辑重复度仍高，后续可考虑抽共享配置层（谨慎改动）。

## 7) Suggested Next Tasks (P0 -> P2)
- P0：
  - 跑一次全量或高采样分布审计，确认 14 题口径下无新增极端偏置。
  - 补关键回归测试：MBTI 自选顺序变化、题目数展示、分享文案口径。
- P1：
  - 强化结果解释模板（按城市类别 × MBTI × 生肖轴输出差异化建议）。
  - 增强回访链路：历史结果对比维度更丰富（不引入隐私数据）。
- P2：
  - 治理双端重复逻辑，抽取可复用配置和生成脚本。

## 8) Quick Validation Commands
在项目根目录执行：

```bash
node --check "utils/mbti.js"
node --check "utils/calculator.js"
node --check "docs/app.js"
node --check "pages/result/result.js"
```

随机烟测示例：

```bash
node -e "const {questions}=require('./utils/data.js'); const {calculateResult}=require('./utils/calculator.js'); const {calculateMBTI}=require('./utils/mbti.js'); for(let i=0;i<3000;i++){const ans=questions.map(q=>Math.floor(Math.random()*q.options.length)); const r=calculateResult(ans); const m=calculateMBTI(ans); if(!r.city||!m.type) throw new Error('bad '+i);} console.log('ok');"
```

## 9) Collaboration Notes
- 修改 `Q11` 选项顺序时，不需要再手改 MBTI 映射数组（已动态化）。
- 任何涉及结果口径的改动，都需要同步更新：
  - `PRD.md`
  - `CHANGELOG.md`
  - （必要时）`docs/city-bias-heatmap.md`
