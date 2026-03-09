# YourCityCouple - 你的城市 CP

> 2026 新年旺旺 · 测测你的开年旅游地

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yuan-yaodong/YourCityCouple)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📖 项目简介

**YourCityCouple** 是一个"轻测试 + 情绪价值"工具，通过 14 道精心设计的选择题，在约 1 分钟内为用户推荐最适合的开年旅游城市，并提供 MBTI 人格、五行运势、生肖解读等个性化内容。

### ✨ 核心特性

- 🎯 **14 道测试题**：涵盖饮食偏好、旅行方式、天气偏好、新年愿望等多维度
- 🏙️ **23 座推荐城市**：分为 6 大类（火热美食/海岛度假/冰雪奇缘/西南秘境/历史文化/江南诗意）
- 🔮 **MBTI 人格分析**：16 型人格旅行风格解读
- 🧭 **五行运势**：金木水火土属性计算，提供幸运色/数字/方位
- 🐾 **生肖解读**：12 生肖运势倾向分析
- 📱 **双端支持**：微信小程序 + Web（GitHub Pages）

---

## 🚀 快速开始

### 微信小程序

1. 使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开项目目录
2. 填入你的 AppID（或使用测试号）
3. 编译运行即可

### Web 端（GitHub Pages）

1. 访问：https://yuan-yaodong.github.io/YourCityCouple/
2. 或在浏览器中打开 `docs/index.html`

---

## 📁 项目结构

```
YourCityCouple/
├── pages/                    # 小程序页面
│   ├── index/               # 首页（启动/历史/续做）
│   ├── quiz/                # 答题页（14 题）
│   ├── result/              # 结果页（城市推荐 + 分析）
│   └── insights/            # 洞察页（数据统计）
│
├── utils/                    # 小程序工具模块
│   ├── data.js              # 题库 + 城市数据 + 五行属性
│   ├── calculator.js        # 结果计算引擎
│   ├── mbti.js              # MBTI 人格计算
│   ├── analyzer.js          # 个性化分析文案生成
│   └── analytics.js         # 埋点统计
│
├── docs/                     # 📚 项目文档 + Web 端
│   ├── README.md            # 📖 文档索引
│   ├── documents/           # 📚 项目文档
│   │   ├── PRD.md           # ⭐ 产品需求文档
│   │   ├── CHANGELOG.md     # ⭐ 版本更新日志
│   │   ├── TEAM_ITERATION_BOARD.md  # ⭐ 团队迭代看板
│   │   ├── project-backlog.md  # 待办事项
│   │   ├── city-bias-heatmap.md  # 热力图
│   │   └── llm-handoff-memory.md # 交接文档
│   ├── web/                 # 🌐 Web 端代码
│   │   ├── index.html       # Web 主页面
│   │   ├── app.js           # Web 入口逻辑
│   │   ├── styles.css       # Web 样式
│   │   └── lib/             # 共享代码库
│   └── archive/             # 🗂️ 归档文档
│
├── images/                   # 图片资源
├── app.js                    # 小程序入口
├── app.json                  # 小程序配置
├── CLAUDE.md                 # AI 助手配置
└── README.md                 # 本文件
```

---

## 🧮 评分模型

结果计算采用多层评分机制：

```
总分 = 基础分 + 关联分 + 平衡分 + 细分分

1. 基础分：选项权重累加（来自 utils/data.js）
2. 关联分：MBTI + 生肖匹配加分（轻量纠偏）
3. 平衡分：城市曝光归一化（抑制头部过热）
4. 细分分：小数级别细分（避免同分依赖城市顺序）
```

---

## 🛠️ 开发与验证

### 语法检查

```bash
node --check "utils/mbti.js"
node --check "utils/calculator.js"
node --check "docs/web/app.js"
node --check "pages/result/result.js"
```

### 随机烟测

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

## 📚 核心文档

**所有项目文档统一存放在 `docs/documents/` 文件夹:**

| 文档 | 说明 |
|------|------|
| [docs/documents/PRD.md](docs/documents/PRD.md) | 产品需求文档 |
| [docs/documents/CHANGELOG.md](docs/documents/CHANGELOG.md) | 版本更新日志 |
| [docs/documents/TEAM_ITERATION_BOARD.md](docs/documents/TEAM_ITERATION_BOARD.md) | 团队迭代看板 |
| [docs/documents/project-backlog.md](docs/documents/project-backlog.md) | 待办事项清单 |
| [docs/documents/city-bias-heatmap.md](docs/documents/city-bias-heatmap.md) | 城市偏置热力图 |
| [docs/documents/llm-handoff-memory.md](docs/documents/llm-handoff-memory.md) | 项目交接文档 |

**文档索引**: [docs/README.md](docs/README.md)

---

## 🎨 城市分类

| 分类 | 城市 | 特色 |
|------|------|------|
| 🔥 火热美食 | 成都、重庆、广州、长沙 | 美食之都，烟火气息 |
| 🏝️ 海岛度假 | 三亚、厦门、北海、普吉岛 | 阳光沙滩，度假天堂 |
| ❄️ 冰雪奇缘 | 哈尔滨、雪乡、长白山 | 冰雪世界，童话王国 |
| 🏔️ 西南秘境 | 大理、丽江、桂林、阳朔 | 风花雪月，山水田园 |
| 🏯 历史文化 | 西安、北京、南京、洛阳 | 千年古都，文化底蕴 |
| 🌿 江南诗意 | 杭州、苏州、乌镇、周庄 | 西湖美景，水乡古镇 |

---

## 📝 版本历史

详见 [docs/documents/CHANGELOG.md](docs/documents/CHANGELOG.md)

### v1.0.0 (2026-03-09)
- ✅ 14 题题库 + 23 城推荐
- ✅ MBTI/五行/生肖解读
- ✅ 微信小程序 + Web 双端
- ✅ 分享海报 + 复制文案
- ✅ 历史记录 + 回访激励

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

---

## 📄 开源协议

MIT License

---

## 📞 联系方式

- GitHub: [@yuan-yaodong](https://github.com/yuan-yaodong)
- 项目地址：https://github.com/yuan-yaodong/YourCityCouple

---

**🧧 新年行大运，快来测测你的开年旺城！**
