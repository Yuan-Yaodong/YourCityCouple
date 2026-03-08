# 项目协议 - YourCityCouple 微信小程序

> 本文件仅包含项目特定配置，通用配置请参考全局 CLAUDE.md

---

## 项目技术栈

- 微信小程序 + Web双端（GitHub Pages）
- 原生开发

## 项目结构

```
YourCityCouple/
├── pages/           # 小程序页面
│   ├── index/       # 首页/引导页
│   ├── quiz/        # 答题页
│   ├── result/      # 结果页
│   └── insights/    # 数据洞察页
├── utils/           # 小程序工具函数
│   ├── analyzer.js # 分析逻辑（MBTI/五行/生肖）
│   ├── data.js     # 题目数据
│   └── analytics.js# 埋点追踪
├── docs/           # Web端代码
│   ├── app.js      # Web主逻辑
│   ├── index.html  # Web首页
│   └── lib/        # 共享代码副本
└── images/         # 静态资源
```

## 开发规范

- 遵循全局Vibe Coding Quality Guidelines
- 团队协作使用4人精简版（team-lead, @backend, @frontend, @qa）
- 双端代码治理：`docs/lib/` 同步 `utils/` 核心模块

## 核心功能模块

### 1. 测试系统
- 14道选择题，覆盖饮食偏好、旅行方式、气候偏好、核心追求、新年氛围、新年愿望等维度
- MBTI人格测试（自选+推断）
- 五行属性计算
- 生肖运势关联
- 城市推荐算法（多维度加权）

### 2. 结果展示
- 个性化城市推荐及理由
- MBTI+生肖人格深度解读
- 五行运势详情
- 城市专属称号
- 今日好运签和仪式

### 3. 分享系统
- 微信小程序分享（onShareAppMessage/onShareTimeline）
- 海报生成（3套模板 + 6种城市配色）
- 复制分享文案（3种变体：warm/direct/relation）

### 4. 数据存储
- wx.setStorageSync 本地缓存
- 测试记录 historyResults（最多10条）
- 每日仪式记录 dailyRitual

### 5. 激励系统
- 历史摘要卡片（累计测试、探索城市）
- 连续测试徽章（初测学者/好运达人/连续大师）

---

## 启动命令

```bash
# 开发小程序
npm run dev

# Web端调试
# 直接用浏览器打开 docs/index.html
```

---

> 本文件最后更新: 2026-03-08
