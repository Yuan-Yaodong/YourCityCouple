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

  // 找出得分最高的城市
  let maxScore = -1;
  let resultCity = cityList[0];

  cityList.forEach(city => {
    if (scores[city] > maxScore) {
      maxScore = scores[city];
      resultCity = city;
    }
  });

  return {
    city: resultCity,
    score: maxScore,
    allScores: scores
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

module.exports = {
  calculateResult,
  getCityDetail
};
