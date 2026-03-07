// utils/calculator.js - 计算测试结果

const { questions, cityList } = require('./data.js');

/**
 * 根据用户答案计算结果城市
 * @param {Array} userAnswers - 用户答案数组 [[问题索引, 选项索引], ...]
 * @returns {Object} 结果城市信息
 */
function calculateResult(userAnswers) {
  // 初始化各城市得分
  const scores = {};
  cityList.forEach(city => {
    scores[city] = 0;
  });

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
          }
        });
      }
    }
  });

  // 城市按得分排序，便于展示“差一点就是”
  const sortedCities = cityList
    .map(city => ({ city, score: scores[city] }))
    .sort((a, b) => b.score - a.score);
  const top1 = sortedCities[0] || { city: cityList[0], score: 0 };
  const top2 = sortedCities[1] || null;

  return {
    city: top1.city,
    score: top1.score,
    allScores: scores,
    sortedCities,
    runnerUp: top2
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
