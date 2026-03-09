# YourCityCouple 项目交接文档

> 最后更新：2026-03-09  
> 用途：帮助开发者快速理解项目结构和核心逻辑  
> 存放位置：docs/documents/llm-handoff-memory.md

---

## 一、项目概览

| 项目 | 说明 |
|------|------|
| **名称** | YourCityCouple（你的城市 CP） |
| **形态** | 微信小程序 + Web（GitHub Pages） |
| **定位** | 轻测试 + 情绪价值工具 |
| **规模** | 14 道题，23 个城市 |
| **核心体验** | 1 分钟测试 → 个性化城市推荐 + MBTI/五行/生肖解读 |

---

## 二、核心规则

### 2.1 产品边界
- ✅ 做：情绪价值、轻测试、可分享结果
- ❌ 不做：支付商业化、隐私敏感数据（评论/社交轨迹）

### 2.2 结果计算原则
- **可解释**：用户能看到"为什么适合我"的证据链
- **可复现**：同样答案得到同样结果
- **可本地计算**：无需服务端，纯前端计算

### 2.3 评分模型
```
总分 = 基础分 + 关联分 + 平衡分 + 细分分

1. 基础分：选项权重累加（来自 utils/data.js）
2. 关联分：MBTI + 生肖匹配加分（轻量纠偏）
3. 平衡分：城市曝光归一化（抑制头部过热）
4. 细分分：小数级别细分（避免同分依赖城市顺序）
```

---

## 三、关键文件

### 3.1 核心逻辑
| 文件 | 用途 |
|------|------|
| `utils/data.js` | 题库 + 城市数据 + 五行属性 |
| `utils/calculator.js` | 结果计算引擎 |
| `utils/mbti.js` | MBTI 人格计算 |
| `utils/analyzer.js` | 个性化分析文案生成 |

### 3.2 页面入口
| 文件 | 用途 |
|------|------|
| `pages/index/index.js` | 首页（启动/历史/续做） |
| `pages/quiz/quiz.js` | 答题页（14 题，支持回退） |
| `pages/result/result.js` | 结果页（城市推荐 + 分析） |
| `pages/insights/insights.js` | 洞察页（数据统计） |

### 3.3 Web 端
| 文件 | 用途 |
|------|------|
| `docs/web/index.html` | Web 主页面 |
| `docs/web/app.js` | Web 入口逻辑 |
| `docs/web/lib/` | 共享代码库（从 utils/ 复制） |

### 3.4 文档
| 文件 | 用途 |
|------|------|
| `docs/README.md` | 项目说明文档 |
| `docs/documents/PRD.md` | 产品需求文档 |
| `docs/documents/CHANGELOG.md` | 版本更新日志 |
| `docs/documents/project-backlog.md` | 待办事项清单 |
| `docs/documents/city-bias-heatmap.md` | 城市偏置热力图 |
| `docs/documents/llm-handoff-memory.md` | 本交接文档 |

---

## 四、重要实现决策

### 4.1 MBTI 动态映射
- **问题**：第 11 题（MBTI 自选题）选项顺序调整时，避免硬编码映射失效
- **方案**：从题目选项动态解析映射关系
- **实现**：
  - 小程序：`utils/mbti.js#getSelfReportedTypeOrder()`
  - Web：`docs/web/app.js#getMBTITypeOrderFromQuestions()`

### 4.2 题目数口径
- 统一为 **14 题**（包含 fallback 兜底）

### 4.3 幸运数字展示
- **两层语义**：
  - 五行卡：幸运数字范围（如 1、6）
  - 综合建议：主幸运数字（如 6）

### 4.4 题目优化
- **Q7 赛博签文**：来源文案稳定（同答案下能量值固定）
- **Q8 旅途默契题**：已替换为主观同路人偏好（移除隐私敏感来源逻辑）

---

## 五、已知风险与改进方向

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 城市分布偏置 | 中 | 周期性复审（见 city-bias-heatmap.md） |
| MBTI/生肖解释通用 | 低 | 继续细化模板（按城市类别×MBTI×生肖轴） |
| 双端逻辑重复 | 中 | docs/web/lib/ 共享代码库（需手动同步） |

---

## 六、快速验证

### 6.1 语法检查
```bash
node --check "utils/mbti.js"
node --check "utils/calculator.js"
node --check "docs/web/app.js"
node --check "pages/result/result.js"
```

### 6.2 随机烟测
```bash
node -e "
const {questions}=require('./utils/data.js');
const {calculateResult}=require('./utils/calculator.js');
const {calculateMBTI}=require('./utils/mbti.js');
for(let i=0;i<3000;i++){
  const ans=questions.map(q=>Math.floor(Math.random()*q.options.length));
  const r=calculateResult(ans);
  const m=calculateMBTI(ans);
  if(!r.city||!m.type) throw new Error('bad '+i);
}
console.log('ok');
"
```

---

## 七、协作注意事项

1. **修改 Q11 选项顺序**：无需手改 MBTI 映射数组（已动态化）
2. **结果口径改动**：同步更新 `PRD.md` + `CHANGELOG.md`
3. **城市权重调整**：运行偏置审计并更新 `city-bias-heatmap.md`
4. **utils/ 修改**：同步复制到 `docs/web/lib/`（保持 Web 端一致）

---

## 八、下一步建议

### P0（优先）
- [ ] 跑一次全量分布审计（14 题口径）
- [ ] 补关键回归测试（MBTI 自选顺序、题目数展示、分享文案）

### P1（重要）
- [ ] 强化结果解释模板（城市类别 × MBTI × 生肖轴）
- [ ] 增强回访链路（历史结果对比）

### P2（增强）
- [ ] 治理双端重复逻辑（抽取共享配置层）
