const { questions } = require('./data.js');
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

  // 获取城市类别
  const { cities } = require('./data.js');
  const cityInfo = cities[resultCity] || {};
  const cityCategory = cityInfo.category || '';

  // 生成MBTI+生肖人格解读
  const personalityInsight = generatePersonalityInsight(userAnswers, resultCity, cityCategory);

  // 组合所有分析，生成综合文案
  const analysisPoints = [
    foodAnalysis,
    travelAnalysis,
    weatherAnalysis,
    priorityAnalysis,
    vibeAnalysis,
    wishAnalysis
  ];

  // 获取MBTI类型
  const mbtiType = mbtiAnalysis?.type || 'ENFP';

  // 计算五行属性
  const fiveElement = calculateFiveElementFromAnswers(userAnswers);

  // 获取生肖索引（第12题）
  const zodiacIndex = Number(userAnswers[11] || 0);

  // 生成为什么适合这个城市
  const whyFit = generateWhyFit(userAnswers, resultCity, analysisPoints);
  const actionTips = generateActionTips(resultCity, analysisPoints, {
    mbtiType,
    fiveElement,
    zodiacIndex
  });

  return {
    personality: foodAnalysis,       // 性格特点
    travelStyle: travelAnalysis,     // 旅行方式
    weatherPreference: weatherAnalysis, // 天气偏好
    priority: priorityAnalysis,      // 核心追求
    vibe: vibeAnalysis,              // 新年氛围
    wish: wishAnalysis,              // 新年愿望
    mbti: mbtiAnalysis,              // MBTI人格
    personalityInsight,              // MBTI+生肖人格解读
    whyFit: whyFit,                 // 为什么适合
    actionTips: actionTips,          // 今日行动建议
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
    { text: "豪爽大气", desc: "喜欢东北菜的你，为人豪爽，不拘小节" },
    { text: "清爽理性", desc: "偏爱清爽饮食的你，重视平衡与秩序感" },
    { text: "温和自律", desc: "偏好养生风格的你，重视长期稳定与身心状态" }
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
    { text: "漫步诗人", desc: "你喜欢随性自由，享受旅途中的慢时光" },
    { text: "关系连接者", desc: "你重视陪伴和关系质量，偏好轻松而有温度的旅程" },
    { text: "夜色社交家", desc: "你在人群和烟火中快速充电，社交感知力很强" }
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
    { text: "烟雨诗意", desc: "你欣赏烟雨朦胧的诗意美景" },
    { text: "海风松弛", desc: "你需要流动感与呼吸感，偏爱海风带来的松弛节奏" },
    { text: "高原自由", desc: "你向往开阔和通透，更容易在远方重启状态" }
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
    { text: "文化探寻", desc: "你热爱历史与文化的深度探索" },
    { text: "效率掌控", desc: "你在意预算和节奏控制，追求务实高效的体验" },
    { text: "缘分连接", desc: "你重视人与人的化学反应，偏好有故事的相遇" }
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
    { text: "刺激精彩", desc: "你追求精彩刺激的新年体验" },
    { text: "安稳疗愈", desc: "你需要可持续的舒适感，偏好稳定而温柔的节日状态" },
    { text: "开运感知", desc: "你对运势与信号很敏感，愿意主动创造好状态" }
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
    { text: "转运开挂", desc: "你渴望在新的一年里转运逆袭，走上人生巅峰" },
    { text: "职业成长", desc: "你重视长期成长路径，希望在事业上实现突破升级" },
    { text: "家庭团圆", desc: "你把关系稳定与亲密连接放在重要位置" }
  ];
  return analyses[answerIndex] || analyses[0];
}

/**
 * 计算五行属性
 * 根据用户答案计算得分最高的五行
 */
function calculateFiveElementFromAnswers(userAnswers) {
  const { questions } = require('./data.js');
  const elementScores = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };

  userAnswers.forEach((answer, qIndex) => {
    if (qIndex < questions.length) {
      const question = questions[qIndex];
      if (question && question.options && answer < question.options.length) {
        const option = question.options[answer];
        if (option.fiveElement && elementScores[option.fiveElement] !== undefined) {
          elementScores[option.fiveElement] += 1;
        }
      }
    }
  });

  // 找出得分最高的五行
  let maxScore = -1;
  let resultElement = "土";

  Object.keys(elementScores).forEach(element => {
    if (elementScores[element] > maxScore) {
      maxScore = elementScores[element];
      resultElement = element;
    }
  });

  return resultElement;
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
function generateWhyFit(userAnswers, resultCity, analysisPoints) {
  const dimensionTitles = [
    "饮食偏好命中",
    "旅行方式命中",
    "气候偏好命中",
    "核心追求命中",
    "节日氛围命中",
    "新年愿望命中",
    "赛博签文命中",
    "同路人偏好命中",
    "人格镜像命中",
    "生肖八字偏好命中",
    "MBTI自选命中",
    "生肖自选命中",
    "缘分信号命中",
    "开运动作命中"
  ];

  const evidence = [];
  (userAnswers || []).forEach((answerIndex, qIndex) => {
    const question = questions[qIndex];
    if (!question || !Array.isArray(question.options)) return;
    const option = question.options[answerIndex];
    if (!option || !option.weights) return;
    const cityWeight = Number(option.weights[resultCity] || 0);
    if (cityWeight <= 0) return;
    evidence.push({
      text: dimensionTitles[qIndex] || `题目${qIndex + 1}命中`,
      weight: cityWeight,
      desc: `你在「${question.question}」选择了「${option.text}」，为${resultCity}增加${cityWeight}分。`
    });
  });

  evidence.sort((a, b) => b.weight - a.weight);
  const topEvidence = evidence.slice(0, 5).map((item) => ({
    text: item.text,
    desc: item.desc
  }));

  if (topEvidence.length > 0) {
    return topEvidence;
  }

  return [
    { text: "性格契合", desc: analysisPoints[0].desc },
    { text: "旅行方式契合", desc: analysisPoints[1].desc },
    { text: "核心追求契合", desc: analysisPoints[3].desc },
    { text: "节日氛围契合", desc: analysisPoints[4].desc },
    { text: `与${resultCity}气质契合`, desc: analysisPoints[5].desc }
  ];
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
 * 生成今日行动建议（用于情绪价值增强）
 */
function generateActionTips(resultCity, analysisPoints) {
  const tips = [
    `今天做一件和${resultCity}有关的小事：查一张机票或收藏一条攻略`,
    `给自己安排30分钟轻旅行时刻，按照“${analysisPoints[1].text}”的方式放松`,
    `把“${analysisPoints[5].text}”写成一句新年承诺，今晚睡前读一遍`
  ];
  return tips;
}

/**
 * 分析用户答案（符合要求接口）
 * @param {Array} userAnswers - 用户答案数组 [0, 1, ...] 对应各题选项索引
 * @returns {Object} 分析结果
 */
function analyzeUser(userAnswers) {
  // 默认使用成都作为结果城市
  return analyzeUserPreferences(userAnswers, '成都');
}

/**
 * 分析MBTI四个维度的解读
 * @param {string} mbtiType - MBTI类型
 * @returns {Object} 维度解读
 */
function analyzeMBTIDimension(mbtiType) {
  const dimensionData = {
    "E": { dimension: "E外向", title: "能量在外向", desc: "你从外部世界获取能量，喜欢社交、行动和探索", travelTip: "适合热闹、有互动、有活力的目的地" },
    "I": { dimension: "I内向", title: "能量在内向", desc: "你从内心世界获取能量，喜欢独处、思考和深度体验", travelTip: "适合宁静、有深度、有故事的目的地" },
    "S": { dimension: "S务实", title: "感知偏务实", desc: "你关注具体、实际和可体验的事物", travelTip: "适合美食、打卡、真实体验丰富的目的地" },
    "N": { dimension: "N理想", title: "感知偏理想", desc: "你关注可能性、抽象和未来的意义", travelTip: "适合文艺、浪漫、有意境的目的地" },
    "T": { dimension: "T理性", title: "决策偏理性", desc: "你基于逻辑和客观分析做决定", travelTip: "适合规划清晰、效率高的旅行方式" },
    "F": { dimension: "F情感", title: "决策偏情感", desc: "你基于价值观和他人感受做决定", travelTip: "适合有温度、有关怀、有情感连接的目的地" },
    "J": { dimension: "J计划", title: "生活偏计划", desc: "你喜欢有序、结构化和可预期的生活", travelTip: "适合行程明确、攻略详尽的目的地" },
    "P": { dimension: "P灵活", title: "生活偏灵活", desc: "你喜欢灵活、开放和随性的生活", travelTip: "适合随性探索、偶遇惊喜的旅行方式" }
  };
  const ei = mbtiType ? mbtiType[0] : 'E';
  const sn = mbtiType ? mbtiType[1] : 'S';
  const tf = mbtiType ? mbtiType[2] : 'T';
  const jp = mbtiType ? mbtiType[3] : 'J';
  return { ei: dimensionData[ei], sn: dimensionData[sn], tf: dimensionData[tf], jp: dimensionData[jp] };
}

/**
 * 分析生肖轴的解读
 * @param {number} zodiacIndex - 生肖索引 (0-11)
 * @returns {Object} 生肖解读
 */
function analyzeZodiacAxis(zodiacIndex) {
  const zodiacData = [
    { animal: '鼠', axis: 'wealth', label: '财运达人', desc: '你自带财运体质，对财富机会敏感', travelTip: '适合商业氛围浓、金融发达的城市' },
    { animal: '牛', axis: 'stability', label: '稳健行者', desc: '你踏实可靠，喜欢稳定长期的发展', travelTip: '适合历史悠久、文化底蕴深的目的地' },
    { animal: '虎', axis: 'action', label: '行动派', desc: '你虎虎生风，敢于冒险和挑战', travelTip: '适合刺激、有挑战、能释放能量的目的地' },
    { animal: '兔', axis: 'relation', label: '缘分派', desc: '你温和细腻，重视关系和情感连接', travelTip: '适合浪漫、温暖、有故事的目的地' },
    { animal: '龙', axis: 'rise', label: '事业型', desc: '你自带气场，追求成就和认可', travelTip: '适合大气、有格局、能展示实力的城市' },
    { animal: '蛇', axis: 'wealth', label: '智慧型', desc: '你深沉内敛，善于思考和筹谋', travelTip: '适合文化深、有历史故事的目的地' },
    { animal: '马', axis: 'action', label: '奔放族', desc: '你热情奔放，向往自由和远方', travelTip: '适合草原、海岸、开阔壮丽的目的地' },
    { animal: '羊', axis: 'healing', label: '疗愈派', desc: '你柔和敏感，需要舒适和放松', travelTip: '适合宁静、舒适、能治愈心灵的目的地' },
    { animal: '猴', axis: 'lifestyle', label: '活力派', desc: '你聪明灵活，追求生活品质', travelTip: '适合时尚、繁华、玩乐丰富的地方' },
    { animal: '鸡', axis: 'culture', label: '文化人', desc: '你注重品质和文化内涵', travelTip: '适合有文化、有艺术、有底蕴的目的地' },
    { animal: '狗', axis: 'stability', label: "忠义派", desc: '你忠诚可靠，重视信任和稳定', travelTip: '适合传统、有温情、让人安心的地方' },
    { animal: '猪', axis: 'healing', label: '享乐派', desc: '你乐观随和，懂得享受生活', travelTip: '适合舒适、惬意、让人放松的目的地' }
  ];
  const axisData = {
    'wealth': { axisName: '财运', tip: '财富运势引导你走向繁荣之地' },
    'stability': { axisName: '稳定', tip: '稳健特质让你更适应沉淀之地' },
    'action': { axisName: '行动', tip: '行动力驱动你探索未知领域' },
    'relation': { axisName: '关系', tip: '人际关系是你的核心动力' },
    'rise': { axisName: '上升', tip: '事业心指引你走向巅峰' },
    'healing': { axisName: '疗愈', tip: '你需要放松和治愈的空间' },
    'lifestyle': { axisName: '生活', tip: '生活品质是你关注的重点' },
    'culture': { axisName: '文化', tip: '文化内涵能滋养你的精神' }
  };
  const zodiac = zodiacData[zodiacIndex] || zodiacData[0];
  return { animal: zodiac.animal, axis: zodiac.axis, label: zodiac.label, desc: zodiac.desc, travelTip: zodiac.travelTip, axisInfo: axisData[zodiac.axis] || { axisName: '未知', tip: '' } };
}

/**
 * 生成基于MBTI+生肖的人格解读
 * @param {Array} userAnswers - 用户答案数组
 * @param {string} resultCity - 结果城市
 * @param {string} cityCategory - 城市类别
 * @returns {Object} 人格解读结果
 */
function generatePersonalityInsight(userAnswers, resultCity, cityCategory) {
  const answer5 = userAnswers[4] || 0;
  const answer4 = userAnswers[3] || 0;
  const answer1 = userAnswers[0] || 0;
  const answer2 = userAnswers[1] || 0;
  const ei = (answer5 < 2) ? 'E' : 'I';
  const sn = (answer4 < 2) ? 'S' : 'N';
  const tf = (answer1 < 2) ? 'T' : 'F';
  const jp = (answer2 < 2) ? 'J' : 'P';
  const mbtiType = ei + sn + tf + jp;
  const zodiacIndex = Number(userAnswers[11] || 0);
  const mbtiDimension = analyzeMBTIDimension(mbtiType);
  const zodiacInsight = analyzeZodiacAxis(zodiacIndex);
  const categoryInsights = {
    '火热美食': { desc: '这里的烟火气与你的性格完美契合', detail: '热闹的美食氛围让你的外向特质得到释放' },
    '海岛度假': { desc: '海岛的休闲感与你的气质天然匹配', detail: '轻松的度假节奏让你能够真正放松' },
    '冰雪奇缘': { desc: '冰雪世界的纯粹与你的特质相呼应', detail: '独特的体验激发你的探索欲望' },
    '西南秘境': { desc: '秘境的宁静与你的内心世界共鸣', detail: '这里的空间让你能够倾听自己的声音' },
    '历史文化': { desc: '厚重的历史与你的理性思维契合', detail: '文化的深度能满足你的求知欲' },
    '江南诗意': { desc: '江南的意境与你的浪漫情怀呼应', detail: '诗意的氛围让你的情感得到滋养' }
  };
  const catInsight = categoryInsights[cityCategory] || { desc: '这个城市有着独特的魅力与你相配', detail: '在这里你能找到属于自己的节奏' };
  const whyFitExplanation = `${mbtiDimension.ei.title}的${mbtiDimension.sn.title}的你，${zodiacInsight.desc}。${catInsight.desc}`;
  const personalityTips = [
    `按照你的${mbtiDimension.jp.dimension}特质，这座城市适合${mbtiDimension.jp.travelTip}`,
    `作为${zodiacInsight.label}，${zodiacInsight.travelTip}`,
    catInsight.detail
  ];
  return { mbtiType, mbtiDimension, zodiacInsight, cityCategory, whyFitExplanation, personalityTips };
}

module.exports = {
  analyzeUserPreferences,
  analyzeUser,
  analyzeMBTIDimension,
  analyzeZodiacAxis,
  generatePersonalityInsight
};
