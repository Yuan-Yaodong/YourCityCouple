// docs/lib/mbti.js - MBTI旅行人格分析（从 utils/mbti.js 复制）

/**
 * MBTI旅行人格分析
 * 根据6道题答案生成16种旅行人格
 */

const { questions } = require('./data.js');

/**
 * MBTI人格定义
 */
const mbtiTypes = {
  // 理性者 (NT)
  "INTJ": {
    name: "战略家",
    shortName: "战略家",
    description: "你善于规划，旅行前会做详尽攻略，追求深度体验",
    travelStyle: "喜欢探索小众目的地，注重旅行的意义和成长",
    emoji: "🎯"
  },
  "INTP": {
    name: "探险家",
    shortName: "探险家",
    description: "你好奇心强，喜欢研究和发现旅行中的新奇事物",
    travelStyle: "热衷于解构当地文化，寻找独特的旅行体验",
    emoji: "🔍"
  },
  "INFJ": {
    name: "提倡者",
    shortName: "提倡者",
    description: "你内心温暖，旅行是为了寻找灵感和精神共鸣",
    travelStyle: "喜欢有故事、有深度的旅行目的地",
    emoji: "💫"
  },
  "INFP": {
    name: "治愈者",
    shortName: "治愈者",
    description: "你追求内心的平静与和谐，旅行是自我疗愈的过程",
    travelStyle: "偏爱宁静、有艺术氛围的旅行地",
    emoji: "🌙"
  },

  // 守卫者 (SJ)
  "ISTJ": {
    name: "执行者",
    shortName: "执行者",
    description: "你务实可靠，旅行计划周密，喜欢经典的旅游路线",
    travelStyle: "追求安全感和确定性，注重旅行的实用性",
    emoji: "📋"
  },
  "ISFJ": {
    name: "守护者",
    shortName: "守护者",
    description: "你体贴细心，旅行中善于照顾同行伙伴的感受",
    travelStyle: "喜欢舒适温暖的旅行体验，重视回忆的珍藏",
    emoji: "🛡️"
  },
  "ISTP": {
    name: "冒险家",
    shortName: "冒险家",
    description: "你冷静务实，喜欢动手体验，旅行中追求刺激与挑战",
    travelStyle: "偏爱户外运动和探险类旅行目的地",
    emoji: "🧗"
  },
  "ISFP": {
    name: "艺术家",
    shortName: "艺术家",
    description: "你审美独特，旅行中善于发现美、感受美",
    travelStyle: "喜欢有艺术氛围和自然美景的目的地",
    emoji: "🎨"
  },

  // 外交者 (NF)
  "ENFJ": {
    name: "领袖",
    shortName: "领袖",
    description: "你天生具有领导力，旅行中善于组织同行伙伴",
    travelStyle: "喜欢能让自己发光发热的有趣目的地",
    emoji: "⭐"
  },
  "ENTP": {
    name: "创新者",
    shortName: "创新者",
    description: "你思维活跃，旅行中总是能发现新的可能性",
    travelStyle: "喜欢充满活力和创意的旅行目的地",
    emoji: "💡"
  },
  "ENTJ": {
    name: "指挥官",
    shortName: "指挥官",
    description: "你目标清晰，行动果断，旅行中擅长做决策和统筹全局",
    travelStyle: "偏爱节奏明确、效率高、目标导向的旅行路线",
    emoji: "🧭"
  },
  "ENFP": {
    name: "自由者",
    shortName: "自由者",
    description: "你热情洋溢，旅行中永远充满活力和创意",
    travelStyle: "喜欢新鲜有趣的体验，拒绝一成不变的旅行",
    emoji: "🦋"
  },

  // 活泼者 (SP)
  "ESTJ": {
    name: "管理者",
    shortName: "管理者",
    description: "你高效务实，旅行中善于安排行程和时间",
    travelStyle: "喜欢井井有条的旅行体验，追求高效完成景点打卡",
    emoji: "🏆"
  },
  "ESFJ": {
    name: "美食家",
    shortName: "美食家",
    description: "你热情好客，旅行中最大的乐趣就是品尝美食",
    travelStyle: "为了美食可以跨越千里，注重当地的烟火气",
    emoji: "🍜"
  },
  "ESTP": {
    name: "挑战者",
    shortName: "挑战者",
    description: "你大胆冲动，喜欢即时行乐，旅行充满刺激",
    travelStyle: "偏爱极限运动和冒险类旅行体验",
    emoji: "⚡"
  },
  "ESFP": {
    name: "表演者",
    shortName: "表演者",
    description: "你活泼开朗，旅行中永远是气氛组的担当",
    travelStyle: "喜欢热闹有趣的地方，享受旅途中的欢乐时光",
    emoji: "🎉"
  }
};

const DEFAULT_MBTI_TYPE_ORDER = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

function extractTypeFromOptionText(text) {
  if (typeof text !== 'string') return '';
  const match = text.match(/^([A-Z]{4})（/);
  return match ? match[1] : '';
}

function getSelfReportedTypeOrder() {
  const mbtiQuestion = Array.isArray(questions) ? questions.find((item) => item && item.id === 11) : null;
  const typesFromQuestion = mbtiQuestion && Array.isArray(mbtiQuestion.options)
    ? mbtiQuestion.options.map((opt) => extractTypeFromOptionText(opt && opt.text)).filter(Boolean)
    : [];
  const unique = Array.from(new Set(typesFromQuestion));
  const isValid = unique.length === 16 && unique.every((type) => mbtiTypes[type]);
  return isValid ? unique : DEFAULT_MBTI_TYPE_ORDER;
}

/**
 * 根据用户答案计算MBTI类型
 * @param {Array} userAnswers - 用户答案数组 [0, 1, 2, 3, 4, 5]
 * @returns {Object} MBTI分析结果
 */
function calculateMBTI(userAnswers) {
  // 优先使用用户自报MBTI（第11题，索引10）
  const selfReportedMap = getSelfReportedTypeOrder();
  const selfAnswer = Number(userAnswers && userAnswers[10]);
  if (!Number.isNaN(selfAnswer) && selfReportedMap[selfAnswer]) {
    const selfType = selfReportedMap[selfAnswer];
    const selfInfo = mbtiTypes[selfType] || mbtiTypes.ENFP;
    return {
      type: selfType,
      name: selfInfo.name,
      shortName: selfInfo.shortName,
      description: selfInfo.description,
      travelStyle: selfInfo.travelStyle,
      emoji: selfInfo.emoji,
      dimensions: null,
      source: 'self_reported',
      allTypes: mbtiTypes
    };
  }

  // E/I: 问题2(旅行方式) + 问题6(愿望)
  // 打卡/冒险 → E，度假/漫步 → I
  // 爱情 → E，暴富/健康 → I，转运 → E
  let eScore = 0;
  let iScore = 0;

  // 问题2: 旅行方式
  if (userAnswers[1] === 0) eScore += 2;  // 打卡网红地 → E
  else if (userAnswers[1] === 1) iScore += 1;  // 度假放松 → I
  else if (userAnswers[1] === 2) eScore += 2;  // 冰雪冒险 → E
  else if (userAnswers[1] === 3) iScore += 2;  // 随意漫步 → I
  else if (userAnswers[1] === 4) iScore += 2;  // 亲友轻松游 → I
  else if (userAnswers[1] === 5) eScore += 2;  // 夜生活社交局 → E

  // 问题6: 愿望
  if (userAnswers[5] === 0) eScore += 1;  // 收获爱情 → E
  else if (userAnswers[5] === 1) iScore += 1;  // 暴富搞钱 → I
  else if (userAnswers[5] === 2) iScore += 1;  // 身体健康 → I
  else if (userAnswers[5] === 3) eScore += 1;  // 转运开挂 → E
  else if (userAnswers[5] === 4) eScore += 1;  // 职业成长 → E
  else if (userAnswers[5] === 5) iScore += 1;  // 家庭团圆 → I

  const EI = eScore >= iScore ? 'E' : 'I';

  // S/N: 问题1(饮食) + 问题3(天气)
  // 火锅/海鲜 → S，粤菜/东北菜 → N
  // 冷/温暖 → S，不冷不热/下雨 → N
  let sScore = 0;
  let nScore = 0;

  // 问题1: 饮食偏好
  if (userAnswers[0] === 0) sScore += 1;  // 火锅 → S
  else if (userAnswers[0] === 1) sScore += 1;  // 海鲜 → S
  else if (userAnswers[0] === 2) nScore += 1;  // 粤菜 → N
  else if (userAnswers[0] === 3) sScore += 1;  // 东北菜 → S
  else if (userAnswers[0] === 4) nScore += 1;  // 清爽轻食 → N
  else if (userAnswers[0] === 5) nScore += 1;  // 素食养生锅 → N

  // 问题3: 天气偏好
  if (userAnswers[2] === 0) sScore += 1;  // 越冷越好 → S
  else if (userAnswers[2] === 1) sScore += 1;  // 阳光温暖 → S
  else if (userAnswers[2] === 2) nScore += 1;  // 不冷不热 → N
  else if (userAnswers[2] === 3) nScore += 1;  // 下雨也行 → N
  else if (userAnswers[2] === 4) sScore += 1;  // 海风微咸 → S
  else if (userAnswers[2] === 5) nScore += 1;  // 高原晴空 → N

  const SN = sScore >= nScore ? 'S' : 'N';

  // T/F: 问题4(在意什么) + 问题6(愿望)
  // 拍照/美食 → T，文化 → F，放松 → F
  // 爱情/健康 → F，暴富/转运 → T
  let tScore = 0;
  let fScore = 0;

  // 问题4: 在意什么
  if (userAnswers[3] === 0) tScore += 1;  // 拍照出片 → T
  else if (userAnswers[3] === 1) tScore += 2;  // 美食吃爽 → T
  else if (userAnswers[3] === 2) fScore += 2;  // 放松疗愈 → F
  else if (userAnswers[3] === 3) fScore += 1;  // 文化历史 → F
  else if (userAnswers[3] === 4) tScore += 2;  // 预算友好 → T
  else if (userAnswers[3] === 5) fScore += 2;  // 缘分社交 → F

  // 问题6: 愿望
  if (userAnswers[5] === 0) fScore += 2;  // 收获爱情 → F
  else if (userAnswers[5] === 1) tScore += 2;  // 暴富搞钱 → T
  else if (userAnswers[5] === 2) fScore += 2;  // 身体健康 → F
  else if (userAnswers[5] === 3) tScore += 1;  // 转运开挂 → T
  else if (userAnswers[5] === 4) tScore += 1;  // 职业成长 → T
  else if (userAnswers[5] === 5) fScore += 1;  // 家庭团圆 → F

  const TF = tScore >= fScore ? 'T' : 'F';

  // J/P: 问题3(天气) + 问题5(新年关键词)
  // 冷/温暖 → J，不冷不热/下雨 → P
  // 热闹/浪漫 → J，悠闲/刺激 → P
  let jScore = 0;
  let pScore = 0;

  // 问题3: 天气
  if (userAnswers[2] === 0) jScore += 1;  // 越冷越好 → J
  else if (userAnswers[2] === 1) jScore += 1;  // 阳光温暖 → J
  else if (userAnswers[2] === 2) pScore += 1;  // 不冷不热 → P
  else if (userAnswers[2] === 3) pScore += 1;  // 下雨也行 → P
  else if (userAnswers[2] === 4) pScore += 1;  // 海风微咸 → P
  else if (userAnswers[2] === 5) pScore += 1;  // 高原晴空 → P

  // 问题5: 新年关键词
  if (userAnswers[4] === 0) jScore += 2;  // 热闹 → J
  else if (userAnswers[4] === 1) jScore += 1;  // 浪漫 → J
  else if (userAnswers[4] === 2) pScore += 2;  // 悠闲 → P
  else if (userAnswers[4] === 3) pScore += 2;  // 刺激 → P
  else if (userAnswers[4] === 4) pScore += 1;  // 疗愈 → P
  else if (userAnswers[4] === 5) jScore += 1;  // 开运 → J

  const JP = jScore >= pScore ? 'J' : 'P';

  // 组合MBTI类型
  const mbtiType = EI + SN + TF + JP;
  const mbtiInfo = mbtiTypes[mbtiType] || mbtiTypes["ENFP"];

  // 计算四个维度的得分（用于展示）
  const dimensions = {
    EI: { value: EI, eScore: eScore, iScore: iScore },
    SN: { value: SN, sScore: sScore, nScore: nScore },
    TF: { value: TF, tScore: tScore, fScore: fScore },
    JP: { value: JP, jScore: jScore, pScore: pScore }
  };

  return {
    type: mbtiType,
    name: mbtiInfo.name,
    shortName: mbtiInfo.shortName,
    description: mbtiInfo.description,
    travelStyle: mbtiInfo.travelStyle,
    emoji: mbtiInfo.emoji,
    dimensions: dimensions,
    source: 'inferred',
    allTypes: mbtiTypes
  };
}

/**
 * 获取完整的MBTI类型列表（用于展示）
 */
function getAllMBTITypes() {
  return mbtiTypes;
}

module.exports = {
  calculateMBTI,
  getAllMBTITypes,
  mbtiTypes,
  getSelfReportedTypeOrder
};
