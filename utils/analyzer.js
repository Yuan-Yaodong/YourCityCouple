// utils/analyzer.js - 分析用户答案，生成个性化分析文案

/**
 * 分析用户答案，生成个性化"为什么适合你"文案
 * @param {Array} userAnswers - 用户答案数组 [0, 1, 2, 3, 4, 5] 对应各题选项索引
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

  // 问题6: 新年愿望 -> 深层愿望分析
  const wishAnalysis = analyzeNewYearWish(userAnswers[5]);

  // MBTI分析
  const mbtiAnalysis = analyzeMBTI(userAnswers);

  // 组合所有分析，生成综合文案
  const analysisPoints = [
    foodAnalysis,
    travelAnalysis,
    weatherAnalysis,
    priorityAnalysis,
    vibeAnalysis,
    wishAnalysis
  ];

  // 生成为什么适合这个城市
  const whyFit = generateWhyFit(analysisPoints, resultCity);

  return {
    personality: foodAnalysis,       // 性格特点
    travelStyle: travelAnalysis,     // 旅行方式
    weatherPreference: weatherAnalysis, // 天气偏好
    priority: priorityAnalysis,      // 核心追求
    vibe: vibeAnalysis,              // 新年氛围
    wish: wishAnalysis,              // 新年愿望
    mbti: mbtiAnalysis,              // MBTI人格
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
 * 分析新年愿望
 */
function analyzeNewYearWish(answerIndex) {
  const analyses = [
    { text: "收获爱情", desc: "你渴望在新的一年里收获甜蜜的爱情" },
    { text: "暴富搞钱", desc: "你期待财源滚滚在新的一年里实现财务自由" },
    { text: "身体健康", desc: "你希望新的一年里身体棒棒，健康平安" },
    { text: "转运开挂", desc: "你渴望在新的一年里转运逆袭，走上人生巅峰" }
  ];
  return analyses[answerIndex] || analyses[0];
}

/**
 * 分析MBTI人格
 * 根据答案组合生成16种MBTI中的一种
 */
function analyzeMBTI(userAnswers) {
  // E/I: 问题5(热闹/浪漫/悠闲/刺激) -> E:热闹浪漫, I:悠闲刺激
  // S/N: 问题4(拍照/美食/疗愈/文化) -> S:拍照美食, N:疗愈文化
  // T/F: 问题1(火锅/海鲜/粤菜/东北菜) -> T:火锅海鲜, F:粤菜东北菜
  // J/P: 问题2(打卡/度假/冒险/漫步) -> J:打卡度假, P:冒险漫步

  const answer5 = userAnswers[4] || 0;
  const answer4 = userAnswers[3] || 0;
  const answer1 = userAnswers[0] || 0;
  const answer2 = userAnswers[1] || 0;

  // E/I: 0,1 -> E; 2,3 -> I
  const ei = (answer5 < 2) ? 'E' : 'I';

  // S/N: 0,1 -> S; 2,3 -> N
  const sn = (answer4 < 2) ? 'S' : 'N';

  // T/F: 0,1 -> T; 2,3 -> F
  const tf = (answer1 < 2) ? 'T' : 'F';

  // J/P: 0,1 -> J; 2,3 -> P
  const jp = (answer2 < 2) ? 'J' : 'P';

  const mbtiType = ei + sn + tf + jp;

  const mbtiData = {
    "ESFJ": { name: "ESFJ", title: "主人公型", desc: "你热情慷慨，喜欢照顾他人，善于社交，是大家眼中的小太阳！" },
    "ENFJ": { name: "ENFJ", title: "竞选者型", desc: "你富有魅力和同理心，天生领导者，喜欢激励他人追求更好的生活！" },
    "ESTJ": { name: "ESTJ", title: "总经理型", desc: "你务实可靠，喜欢组织和规划，是天生的管理者，执行力超强！" },
    "ENTJ": { name: "ENTJ", title: "指挥官型", desc: "你天生具有领导力，果断自信，喜欢挑战不可能的任务！" },
    "ESFP": { name: "ESFP", title: "表演者型", desc: "你活力四射，喜欢成为焦点，享受当下的快乐，是大家的开心果！" },
    "ENFP": { name: "ENFP", title: "竞选者型", desc: "你热情洋溢，创意无限，热爱自由，是永远的理想主义者！" },
    "ESTP": { name: "ESTP", title: "企业家型", desc: "你大胆行动，喜欢冒险，享受刺激的生活，是天生的行动派！" },
    "ENTP": { name: "ENTP", title: "辩论家型", desc: "你思维敏捷，喜欢辩论和创新，是永不停歇的思想家！" },
    "ISFJ": { name: "ISFJ", title: "守卫者型", desc: "你温柔体贴，默默付出，是最可靠的朋友和家人！" },
    "INFJ": { name: "INFJ", title: "提倡者型", desc: "你富有理想和同理心，天生具有洞察力，是内心的引路人！" },
    "ISTJ": { name: "ISTJ", title: "物流师型", desc: "你稳重可靠，注重细节，是值得信赖的靠得住的人！" },
    "INTJ": { name: "INTJ", title: "建筑师型", desc: "你独立理性，喜欢深度思考，是战略思维的大师！" },
    "ISFP": { name: "ISFP", title: "探险家型", desc: "你温柔敏感，追求自由与美，是生活中的艺术家！" },
    "INFP": { name: "INFP", title: "调停者型", desc: "你理想主义，内心丰富，是充满诗意的灵魂！" },
    "ISTP": { name: "ISTP", title: "鉴赏家型", desc: "你冷静理性，善于动手操作，是天生的实践家！" },
    "INTP": { name: "INTP", title: "逻辑学家型", desc: "你热爱思考，追求知识，是永不停歇的思考者！" }
  };

  return mbtiData[mbtiType] || mbtiData["ENFP"];
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

  // 新年愿望匹配
  reasons.push(analysisPoints[5].desc);

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
  const wish = analysisPoints[5].text;

  return `${personality}的${travelStyle}，追求${priority}，想要${vibe}的新年，期待${wish}`;
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
