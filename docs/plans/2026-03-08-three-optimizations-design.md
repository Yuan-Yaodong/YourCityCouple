# YourCityCouple 三项优化设计文档

> 日期：2026-03-08
> 状态：待用户批准

---

## 概述

本文档涵盖三项优化的设计方案：
1. 城市偏置监控面板
2. MBTI/生肖解释细化
3. 双端代码治理

---

## 优化项 1：城市偏置监控面板

### 背景
- 现有 `docs/city-bias-heatmap.md` 需要手动运行脚本更新
- PRD 要求周期性复审城市偏置

### 方案设计

#### 1.1 数据结构扩展
在本地存储中增加命中统计：
```javascript
// 新增存储结构
{
  cityHitStats: {
    "杭州": { count: 156, last30Days: [...] },
    "重庆": { count: 89, last30Days: [...] },
    // ...
  }
}
```

#### 1.2 insights 页面改造
在现有 `pages/insights/insights.js` 中增加：

1. **Top/Bottom 城市趋势图**
   - 近 7 天 / 近 30 天命中趋势
   - 折线图展示 Top 5 城市变化

2. **偏置预警机制**
   - Top1 城市占比 > 20% 触发黄色预警
   - Top1 城市占比 > 30% 触发红色预警
   - 配置阈值可调

#### 1.3 关键文件修改
- `pages/insights/insights.js` - 增加监控逻辑
- `pages/insights/insights.wxml` - 增加图表展示
- `pages/insights/insights.wxss` - 样式调整

### 验收标准
- [ ] 一眼识别是否出现结构性偏置
- [ ] 与当前本地数据结构兼容，无需服务端改造
- [ ] 预警阈值可配置

---

## 优化项 2：MBTI/生肖解释细化

### 背景
- 当前 `analyzer.js` 中 `analyzeMBTI` 和 `generateWhyFit` 解释较通用
- 需要基于用户 MBTI + 生肖 + 用户答案 解释为什么这个城市适合他

### 方案设计

#### 2.1 解释结构改造
保留现有 "证据驱动" 逻辑，新增 **人格解读** 维度：

```javascript
// 新增解释数据结构
{
  personalityInsight: {
    mbti: "INTJ",
    zodiac: "鼠",
    cityCategory: "历史文化",
    // 新增：基于 MBTI + 生肖 的解读
    whyFitExplanation: "作为INTJ的你，理性规划型人格...",
    personalityTips: ["适合有深度的文化之旅", "注意：...", "..."]
  }
}
```

#### 2.2 模板规则设计
按 **城市类别 × MBTI 维度 × 生肖轴** 组合生成：

| 维度 | 取值 | 解读方向 |
|------|------|----------|
| MBTI E/I | E外向 / I内向 | 社交偏好 |
| MBTI S/N | S务实 / N理想 | 旅行风格 |
| MBTI T/F | T理性 / F情感 | 决策方式 |
| MBTI J/P | J计划 / P灵活 | 行程偏好 |
| 生肖轴 | 财富/行动/疗愈/文化 | 运势倾向 |

#### 2.3 实施步骤

**Step 1: 定义 MBTI 维度解读**
- `utils/analyzer.js` 新增 `analyzeMBTIDimension` 函数
- 16 种 MBTI 映射到 4 个维度的解读

**Step 2: 定义生肖轴解读**
- `utils/analyzer.js` 新增 `analyzeZodiacAxis` 函数
- 12 生肖映射到 6 个轴向的解读

**Step 3: 组合生成解释**
- `utils/analyzer.js` 新增 `generatePersonalityInsight` 函数
- 基于城市类别 + MBTI 维度 + 生肖轴组合生成差异化文案

**Step 4: 结果页集成**
- `pages/result/result.js` 接入新解释模块
- `pages/result/result.wxml` 增加展示区域

#### 2.4 关键文件修改
- `utils/analyzer.js` - 新增解释函数
- `pages/result/result.js` - 接入新解释
- `pages/result/result.wxml` - 展示新增内容

### 验收标准
- [ ] 同城不同 MBTI/生肖 用户的解释文案有可读差异
- [ ] 文案逻辑自洽，不违和
- [ ] 不影响首屏加载效率

---

## 优化项 3：双端代码治理

### 背景
- 小程序端：`utils/data.js`, `utils/calculator.js`, `utils/mbti.js`
- Web端：`docs/app.js` 包含大量重复的题库和计算逻辑
- 维护成本高，容易出现不一致

### 方案设计

#### 3.1 共享代码目录
创建 `docs/lib/` 目录，复制小程序端核心模块：

```
docs/
├── app.js              # Web 入口（精简，只做 UI 逻辑）
├── lib/
│   ├── data.js         # 复制自 utils/data.js
│   ├── calculator.js   # 复制自 utils/calculator.js
│   ├── mbti.js         # 复制自 utils/mbti.js
│   └── analyzer.js     # 复制自 utils/analyzer.js
└── index.html          # Web 页面
```

#### 3.2 同步机制
- 修改 `utils/` 下的文件后，需要手动同步到 `docs/lib/`
- 在 `CHANGELOG.md` 中标注需要同步的文件

#### 3.3 Web 入口改造
重构 `docs/app.js`，将计算逻辑委托给 `docs/lib/`：

```javascript
// 改造后的 docs/app.js
const { questions, cities } = require('./lib/data.js');
const { calculateResult } = require('./lib/calculator.js');
const { calculateMBTI } = require('./lib/mbti.js');
const { analyzeUserPreferences } = require('./lib/analyzer.js');

// 只保留 UI 渲染逻辑
function renderResult(userAnswers) {
  const result = calculateResult(userAnswers);
  const analysis = analyzeUserPreferences(userAnswers, result.city);
  // 展示逻辑
}
```

#### 3.4 关键文件修改
- 新增 `docs/lib/` 目录及文件
- 修改 `docs/app.js` - 引用 lib 模块
- 更新 `CHANGELOG.md` - 添加同步说明

### 验收标准
- [ ] Web 端功能与小程序的计算结果一致
- [ ] 修改可追溯，CHANGELOG 记录同步点
- [ ] 无功能回归

---

## 实施顺序建议

```
第 1 轮：优化项 3（双端代码治理）
        └─> 先建立共享代码基础，后续修改只需改一处

第 2 轮：优化项 2（MBTI/生肖解释细化）
        └─> 基于共享代码，在 analyzer.js 中扩展解释逻辑

第 3 轮：优化项 1（城市偏置监控面板）
        └─> 在 insights 页面增加监控可视化
```

---

## 待用户批准后

1. 批准本设计文档
2. 确认实施顺序
3. 开始进入实施阶段
