// utils/calculator.js - 计算测试结果

const { questions, cityList, cities } = require('./data.js');
const { calculateMBTI } = require('./mbti.js');

function buildCityBalanceContext() {
  const exposure = {};
  cityList.forEach((city) => { exposure[city] = 0; });
  questions.forEach((question) => {
    const options = Array.isArray(question && question.options) ? question.options : [];
    options.forEach((option) => {
      const weights = option && option.weights ? option.weights : {};
      Object.keys(weights).forEach((city) => {
        if (exposure[city] !== undefined) {
          exposure[city] += Number(weights[city] || 0);
        }
      });
    });
  });
  const exposureValues = Object.values(exposure).filter((v) => v > 0);
  const avgExposure = exposureValues.length
    ? exposureValues.reduce((sum, v) => sum + v, 0) / exposureValues.length
    : 1;
  const factors = {};
  cityList.forEach((city) => {
    const cityExposure = exposure[city] > 0 ? exposure[city] : avgExposure;
    const rawFactor = Math.pow(avgExposure / cityExposure, 0.32);
    factors[city] = Number(Math.min(1.18, Math.max(0.88, rawFactor)).toFixed(3));
  });
  return { exposure, avgExposure, factors };
}

const CITY_BALANCE_CONTEXT = buildCityBalanceContext();

/**
 * 根据用户答案计算结果城市
 * @param {Array} userAnswers - 用户答案数组 [[问题索引, 选项索引], ...]
 * @returns {Object} 结果城市信息
 */
function calculateResult(userAnswers) {
  // 初始化各城市得分
  const scores = {};
  const hitCounts = {};
  const tieFineScores = {};
  const affinityBonusScores = {};
  cityList.forEach(city => {
    scores[city] = 0;
    hitCounts[city] = 0;
    tieFineScores[city] = 0;
    affinityBonusScores[city] = { mbtiBonus: 0, zodiacBonus: 0, total: 0 };
  });

  const hashValue = (input) => {
    let hash = 0;
    const str = String(input || '');
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  // 统计每个城市的得分
  userAnswers.forEach((answer, qIndex) => {
    if (qIndex < questions.length) {
      const question = questions[qIndex];
      if (answer < question.options.length) {
        const option = question.options[answer];
        // 累加各城市的权重
        Object.keys(option.weights).forEach(city => {
          if (scores[city] !== undefined) {
            scores[city] += option.weights[city];
            hitCounts[city] += 1;
            // 小数级别细分分，避免大量同分时过度依赖城市顺序
            tieFineScores[city] += (hashValue(`${city}_${qIndex}_${answer}`) % 7) / 1000;
          }
        });
      }
    }
  });

  // 额外关联加分：MBTI性格匹配 + 生肖运势匹配（分值较小，用于修正“违和结果”）
  const mbti = calculateMBTI(userAnswers || []);
  const zodiacProfile = calculateZodiacProfile(userAnswers || []);
  cityList.forEach((city) => {
    const affinity = calculateCityAffinityBonus(city, mbti, zodiacProfile, userAnswers || []);
    affinityBonusScores[city] = affinity;
    scores[city] += affinity.total;
  });

  const answerSeed = Array.isArray(userAnswers) ? userAnswers.join('-') : '';

  // 城市按得分排序，便于展示“差一点就是”
  const sortedCities = cityList
    .map(city => ({
      city,
      score: Number(scores[city].toFixed(3)),
      balanceFactor: CITY_BALANCE_CONTEXT.factors[city] || 1,
      balancedScore: Number((scores[city] * (CITY_BALANCE_CONTEXT.factors[city] || 1)).toFixed(3)),
      effectiveScore: Number(((scores[city] * (CITY_BALANCE_CONTEXT.factors[city] || 1)) + tieFineScores[city]).toFixed(3)),
      hitCount: hitCounts[city],
      tieBreaker: hashValue(`${answerSeed}_${city}`)
    }))
    .sort((a, b) => {
      if (b.effectiveScore !== a.effectiveScore) return b.effectiveScore - a.effectiveScore;
      if (b.hitCount !== a.hitCount) return b.hitCount - a.hitCount;
      return b.tieBreaker - a.tieBreaker;
    });
  const top1 = sortedCities[0] || { city: cityList[0], score: 0 };
  const top2 = sortedCities[1] || null;

  return {
    city: top1.city,
    score: top1.effectiveScore,
    allScores: scores,
    balanceFactors: CITY_BALANCE_CONTEXT.factors,
    tieFineScores,
    hitCounts,
    affinityBonusScores,
    zodiacProfile,
    mbtiType: mbti && mbti.type ? mbti.type : '',
    sortedCities,
    runnerUp: top2
  };
}

function calculateZodiacProfile(userAnswers) {
  const q10 = Number(userAnswers[9] || 0);
  const q7 = Number(userAnswers[6] || 0);
  const zodiacConfigs = [
    { animal: '龙', label: '龙系开运', focusAxis: 'rise', favoredElements: ['土', '火'], favoredCategories: ['历史文化', '火热美食'], compatibleSignAxes: ['culture', 'lifestyle'] },
    { animal: '虎', label: '木火生发', focusAxis: 'action', favoredElements: ['木', '火'], favoredCategories: ['火热美食', '西南秘境'], compatibleSignAxes: ['adventure', 'lifestyle'] },
    { animal: '蛇', label: '金水守财', focusAxis: 'wealth', favoredElements: ['金', '水'], favoredCategories: ['江南诗意', '历史文化', '海岛度假'], compatibleSignAxes: ['wealth', 'culture'] },
    { animal: '兔', label: '桃花和合', focusAxis: 'relation', favoredElements: ['木', '水', '火'], favoredCategories: ['江南诗意', '西南秘境', '海岛度假'], compatibleSignAxes: ['relation', 'healing'] },
    { animal: '鱼', label: '水气养心', focusAxis: 'healing', favoredElements: ['水', '木'], favoredCategories: ['海岛度假', '西南秘境', '江南诗意'], compatibleSignAxes: ['healing', 'relation'] },
    { animal: '牛', label: '土气安家', focusAxis: 'stability', favoredElements: ['土', '金'], favoredCategories: ['历史文化', '江南诗意'], compatibleSignAxes: ['culture', 'lifestyle'] }
  ];
  const signAxes = ['wealth', 'relation', 'adventure', 'healing', 'culture', 'lifestyle'];
  const axisLabels = {
    rise: '开运上扬',
    action: '行动突破',
    wealth: '财运守成',
    relation: '缘分和合',
    healing: '疗愈养心',
    stability: '安稳长线',
    culture: '文化积累',
    lifestyle: '生活充电',
    adventure: '探索冒险'
  };
  const focusAxis = (zodiacConfigs[q10] || zodiacConfigs[0]).focusAxis;
  const signAxis = signAxes[q7] || signAxes[0];
  return {
    ...(zodiacConfigs[q10] || zodiacConfigs[0]),
    q10Index: q10,
    signAxis,
    focusAxisLabel: axisLabels[focusAxis] || focusAxis,
    signAxisLabel: axisLabels[signAxis] || signAxis
  };
}

function calculateCityAffinityBonus(cityName, mbti, zodiacProfile) {
  const detail = cities[cityName] || {};
  const category = detail.category || '';
  const wuxing = detail.wuxing || '';
  const tags = Array.isArray(detail.tags) ? detail.tags : [];
  let mbtiBonus = 0;
  let zodiacBonus = 0;
  const mbtiType = mbti && mbti.type ? mbti.type : 'ENFP';

  if (mbtiType[0] === 'E' && (category === '火热美食' || tags.includes('夜生活') || tags.includes('美食'))) mbtiBonus += 0.4;
  if (mbtiType[0] === 'I' && ['江南诗意', '西南秘境', '海岛度假'].includes(category)) mbtiBonus += 0.4;
  if (mbtiType[1] === 'N' && ['西南秘境', '江南诗意', '历史文化'].includes(category)) mbtiBonus += 0.3;
  if (mbtiType[1] === 'S' && ['火热美食', '海岛度假', '冰雪奇缘'].includes(category)) mbtiBonus += 0.3;
  if (mbtiType[2] === 'T' && (['金', '土'].includes(wuxing) || category === '历史文化')) mbtiBonus += 0.3;
  if (mbtiType[2] === 'F' && (['木', '水'].includes(wuxing) || category === '西南秘境')) mbtiBonus += 0.3;
  if (mbtiType[3] === 'J' && (category === '历史文化' || ['北京', '南京', '洛阳', '西安'].includes(cityName))) mbtiBonus += 0.3;
  if (mbtiType[3] === 'P' && ['海岛度假', '西南秘境', '江南诗意'].includes(category)) mbtiBonus += 0.3;

  if (zodiacProfile && Array.isArray(zodiacProfile.favoredElements) && zodiacProfile.favoredElements.includes(wuxing)) zodiacBonus += 0.8;
  if (zodiacProfile && Array.isArray(zodiacProfile.favoredCategories) && zodiacProfile.favoredCategories.includes(category)) zodiacBonus += 0.6;

  const cityAxesByCategory = {
    '火热美食': ['lifestyle', 'action'],
    '海岛度假': ['healing', 'relation'],
    '冰雪奇缘': ['adventure', 'action'],
    '西南秘境': ['healing', 'relation'],
    '历史文化': ['culture', 'stability'],
    '江南诗意': ['relation', 'healing']
  };
  const cityAxes = cityAxesByCategory[category] || [];
  if (zodiacProfile && zodiacProfile.focusAxis && cityAxes.includes(zodiacProfile.focusAxis)) zodiacBonus += 0.25;
  if (zodiacProfile && Array.isArray(zodiacProfile.compatibleSignAxes) && zodiacProfile.compatibleSignAxes.includes(zodiacProfile.signAxis)) zodiacBonus += 0.25;

  return {
    mbtiBonus: Number(mbtiBonus.toFixed(2)),
    zodiacBonus: Number(zodiacBonus.toFixed(2)),
    total: Number((mbtiBonus + zodiacBonus).toFixed(2))
  };
}

/**
 * 获取城市详细信息
 * @param {string} cityName - 城市名称
 * @returns {Object} 城市详细信息
 */
function getCityDetail(cityName) {
  const { cities } = require('./data.js');
  return cities[cityName] || null;
}

/**
 * 根据用户答案计算五行属性
 * @param {Array} userAnswers - 用户答案数组
 * @returns {Object} 五行属性信息
 */
function calculateFiveElement(userAnswers) {
  const { fiveElementData } = require('./data.js');

  // 统计各五行得分
  const elementScores = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };

  userAnswers.forEach((answer, qIndex) => {
    if (qIndex < questions.length) {
      const question = questions[qIndex];
      if (answer < question.options.length) {
        const option = question.options[answer];
        if (option.fiveElement && elementScores[option.fiveElement] !== undefined) {
          elementScores[option.fiveElement] += 1;
        }
      }
    }
  });

  // 找出得分最高的五行
  let maxScore = -1;
  let resultElement = "土"; // 默认

  Object.keys(elementScores).forEach(element => {
    if (elementScores[element] > maxScore) {
      maxScore = elementScores[element];
      resultElement = element;
    }
  });

  return {
    element: resultElement,
    detail: fiveElementData[resultElement] || fiveElementData["土"],
    allScores: elementScores
  };
}

/**
 * 获取五行详细信息
 * @param {string} elementName - 五行名称
 * @returns {Object} 五行详细信息
 */
function getFiveElementDetail(elementName) {
  const { fiveElementData } = require('./data.js');
  return fiveElementData[elementName] || null;
}

module.exports = {
  calculateResult,
  getCityDetail,
  calculateFiveElement,
  getFiveElementDetail
};
