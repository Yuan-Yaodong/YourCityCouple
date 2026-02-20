// utils/analyzer.js - 分析用户答案，生成个性化分析文案

/**
 * 分析用户答案，生成个性化"为什么适合你"文案
 * @param {Array} userAnswers - 用户答案数组 [0, 1, 2, 3, 4] 对应各题选项索引
 * @param {string} resultCity - 匹配结果城市
 * @returns {Object} 分析结果
 */
function analyzeUserPreferences(userAnswers, resultCity) {
  // 问题1: 饮食偏好 -> 性格分析
  const foodAnalysis = analyzeFoodPreference(userAnswers[0]);

  // 问题2: 旅行方式 -> 方式分析
  const travelAnalysis = analyzeTravelStyle(userAnswers[1]);

  // 问题3: 天气偏好 -> 氛围分析
  const weatherAnalysis = analyzeWeatherPreference(userAnswers[2]);

  // 问题4: 在意什么 -> 追求分析
  const priorityAnalysis = analyzePriority(userAnswers[3]);

  // 问题5: 新年关键词 -> 氛围分析
  const vibeAnalysis = analyzeVibe(userAnswers[4]);

  // 组合所有分析，生成综合文案
  const analysisPoints = [
    foodAnalysis,
    travelAnalysis,
    weatherAnalysis,
    priorityAnalysis,
    vibeAnalysis
  ];

  // 生成为什么适合这个城市
  const whyFit = generateWhyFit(analysisPoints, resultCity);

  return {
    personality: foodAnalysis,       // 性格特点
    travelStyle: travelAnalysis,     // 旅行方式
    weatherPreference: weatherAnalysis, // 天气偏好
    priority: priorityAnalysis,      // 核心追求
    vibe: vibeAnalysis,              // 新年氛围
    whyFit: whyFit,                 // 为什么适合
    summary: generateSummary(analysisPoints) // 简短总结
  };
}

/**
 * 分析饮食偏好对应的性格
 */
function analyzeFoodPreference(answerIndex) {
  const analyses = [
    { text: "热情似火", desc: "喜欢火锅的你，性格热烈直接，爱憎分明" },
    { text: "追求品质", desc: "热爱海鲜的你，注重生活品质，懂得享受" },
    { text: "精致生活", desc: "偏爱粤菜的你，追求精致与格调" },
    { text: "豪爽大气", desc: "喜欢东北菜的你，为人豪爽，不拘小节" }
  ];
  return analyses[answerIndex] || analyses[0];
}

/**
 * 分析旅行方式
 */
function analyzeTravelStyle(answerIndex) {
  const analyses = [
    { text: "打卡达人", desc: "你热爱探索网红地点，喜欢分享精彩瞬间" },
    { text: "度假玩家", desc: "你懂得放松自己，追求舒适的旅行体验" },
    { text: "冒险勇者", desc: "你喜欢挑战未知，追求刺激与新鲜感" },
    { text: "漫步诗人", desc: "你喜欢随性自由，享受旅途中的慢时光" }
  ];
  return analyses[answerIndex] || analyses[0];
}

/**
 * 分析天气偏好
 */
function analyzeWeatherPreference(answerIndex) {
  const analyses = [
    { text: "冰雪情缘", desc: "你钟爱银装素裹的冰雪世界" },
    { text: "阳光行者", desc: "你向往温暖阳光，追逐春日的温度" },
    { text: "舒适宜人", desc: "你喜欢不冷不热的舒适气候" },
    { text: "烟雨诗意", desc: "你欣赏烟雨朦胧的诗意美景" }
  ];
  return analyses[answerIndex] || analyses[0];
}

/**
 * 分析核心追求
 */
function analyzePriority(answerIndex) {
  const analyses = [
    { text: "影像记录", desc: "你热爱用镜头捕捉旅途中的美好" },
    { text: "美食探索", desc: "你把品尝美食作为旅行的重中之重" },
    { text: "心灵疗愈", desc: "你追求身心的放松与平静" },
    { text: "文化探寻", desc: "你热爱历史与文化的深度探索" }
  ];
  return analyses[answerIndex] || analyses[0];
}

/**
 * 分析新年氛围偏好
 */
function analyzeVibe(answerIndex) {
  const analyses = [
    { text: "热闹欢腾", desc: "你喜欢热闘非凡的新年氛围" },
    { text: "浪漫温馨", desc: "你向往浪漫的新年时光" },
    { text: "悠闲自在", desc: "你喜欢轻松悠闲的节日节奏" },
    { text: "刺激精彩", desc: "你追求精彩刺激的新年体验" }
  ];
  return analyses[answerIndex] || analyses[0];
}

/**
 * 生成为什么适合该城市
 */
function generateWhyFit(analysisPoints, resultCity) {
  const reasons = [];

  // 性格匹配
  reasons.push(analysisPoints[0].desc);

  // 旅行方式匹配
  reasons.push(analysisPoints[1].desc);

  // 核心追求匹配
  reasons.push(analysisPoints[3].desc);

  // 新年氛围匹配
  reasons.push(analysisPoints[4].desc);

  return reasons;
}

/**
 * 生成简短总结
 */
function generateSummary(analysisPoints) {
  const personality = analysisPoints[0].text;
  const travelStyle = analysisPoints[1].text;
  const priority = analysisPoints[3].text;
  const vibe = analysisPoints[4].text;

  return `${personality}的${travelStyle}，追求${priority}，想要${vibe}的新年`;
}

/**
 * 分析用户答案（符合要求接口）
 * @param {Array} userAnswers - 用户答案数组 [0, 1, 2, 3, 4] 对应各题选项索引
 * @returns {Object} 分析结果
 */
function analyzeUser(userAnswers) {
  // 默认使用成都作为结果城市
  return analyzeUserPreferences(userAnswers, '成都');
}

module.exports = {
  analyzeUserPreferences,
  analyzeUser
};
