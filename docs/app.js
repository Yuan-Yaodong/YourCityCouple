// 问题数据
const questions = [
  {
    id: 1,
    question: "新年第一顿想吃啥？",
    options: [
      { text: "🔥 火锅", weights: { "成都": 3, "重庆": 3, "广州": 1, "厦门": 1 } },
      { text: "🦐 海鲜", weights: { "青岛": 3, "厦门": 3, "三亚": 2, "杭州": 1 } },
      { text: "🥘 粤菜", weights: { "广州": 3, "厦门": 2, "杭州": 1, "成都": 1 } },
      { text: "🥟 东北菜", weights: { "哈尔滨": 3, "雪乡": 3, "青岛": 1, "西安": 1 } }
    ]
  },
  {
    id: 2,
    question: "偏好哪种旅行方式？",
    options: [
      { text: "📸 打卡网红地", weights: { "西安": 2, "厦门": 3, "杭州": 2, "重庆": 2 } },
      { text: "🏖️ 度假放松", weights: { "三亚": 3, "丽江": 3, "大理": 2, "青岛": 2 } },
      { text: "⛷️ 冰雪冒险", weights: { "哈尔滨": 3, "雪乡": 3, "成都": 1, "重庆": 1 } },
      { text: "🚶 随意漫步", weights: { "大理": 3, "杭州": 3, "丽江": 2, "成都": 2 } }
    ]
  },
  {
    id: 3,
    question: "喜欢什么天气？",
    options: [
      { text: "❄️ 越冷越好", weights: { "哈尔滨": 3, "雪乡": 3, "青岛": 1, "杭州": 1 } },
      { text: "☀️ 阳光温暖", weights: { "三亚": 3, "厦门": 3, "广州": 2, "丽江": 2 } },
      { text: "🌸 不冷不热", weights: { "杭州": 3, "大理": 2, "成都": 2, "西安": 2 } },
      { text: "🌧️ 下雨也行", weights: { "杭州": 3, "大理": 2, "厦门": 2, "丽江": 2 } }
    ]
  },
  {
    id: 4,
    question: "旅行中最在意什么？",
    options: [
      { text: "📷 拍照出片", weights: { "厦门": 3, "雪乡": 3, "杭州": 2, "丽江": 2 } },
      { text: "🍜 美食吃爽", weights: { "成都": 3, "重庆": 3, "广州": 2, "青岛": 2 } },
      { text: "🧘 放松疗愈", weights: { "大理": 3, "丽江": 3, "三亚": 2, "杭州": 2 } },
      { text: "🏛️ 文化历史", weights: { "西安": 3, "杭州": 2, "广州": 2, "成都": 1 } }
    ]
  },
  {
    id: 5,
    question: "用哪个词形容你的新年？",
    options: [
      { text: "🎆 热闹", weights: { "重庆": 3, "广州": 3, "西安": 2, "青岛": 2 } },
      { text: "✨ 浪漫", weights: { "厦门": 3, "三亚": 3, "丽江": 2, "杭州": 2 } },
      { text: "😌 悠闲", weights: { "大理": 3, "丽江": 3, "成都": 2, "青岛": 2 } },
      { text: "🧨 刺激", weights: { "哈尔滨": 3, "雪乡": 3, "重庆": 2, "西安": 1 } }
    ]
  }
];

// 城市数据
const cities = {
  "哈尔滨": { emoji: "🏰", description: "冰雪世界，童话王国", detail: "漫步在中央大街，感受俄式风情；到索菲亚教堂打卡；去冰雪大世界看冰灯展。新年的哈尔滨就是现实版的冰雪奇缘！", tags: ["冰雪", "浪漫", "异域"] },
  "三亚": { emoji: "🏝️", description: "温暖海滨，度假天堂", detail: "在蜈支洲岛潜水、天涯海角看日落、亚特兰蒂斯玩水。新年躲避严寒，来三亚享受阳光沙滩！", tags: ["温暖", "度假", "海岛"] },
  "成都": { emoji: "🐼", description: "美食之都，悠闲生活", detail: "逛宽窄巷子、吃火锅、看熊猫、泡茶馆。成都的生活节奏刚刚好，美食更是让人流连忘返！", tags: ["美食", "悠闲", "国宝"] },
  "西安": { emoji: "🏯", description: "千年古都，盛世长安", detail: "登城墙、逛兵马俑、回民街吃泡馍。新年感受大唐盛世的文化底蕴，历史与现代在这里交汇！", tags: ["历史", "文化", "美食"] },
  "丽江": { emoji: "🏔️", description: "艳遇古城，浪漫时光", detail: "漫步古城石板路、爬玉龙雪山、束河古镇发发呆。这里是寻找艳遇和放松的最佳目的地！", tags: ["古城", "浪漫", "雪山"] },
  "厦门": { emoji: "🌴", description: "海岛小清新，文艺之城", detail: "环岛路骑行、鼓浪屿听琴、中山路逛吃。厦门的浪漫藏在每一处细节里！", tags: ["文艺", "浪漫", "海岛"] },
  "杭州": { emoji: "🏙️", description: "西湖美景，江南诗意", detail: "断桥残雪、雷峰塔望湖、龙井问茶。杭州的诗意藏在山水之间，新年祈福好去处！", tags: ["诗意", "山水", "休闲"] },
  "青岛": { emoji: "🍺", description: "海滨城市，啤酒之城", detail: "栈桥看海、八大关漫步、啤酒街喝青岛。面朝大海，春暖花开！", tags: ["海鲜", "啤酒", "休闲"] },
  "雪乡": { emoji: "❄️", description: "童话世界，冰雪奇缘", detail: "厚厚的雪蘑菇、浪漫的雪景房、夜晚的红灯笼。这里是东北雪景的精华所在！", tags: ["冰雪", "童话", "拍照"] },
  "大理": { emoji: "🌸", description: "风花雪月，苍山洱海", detail: "环洱海骑行、苍山徒步、古城看云。大理是疗愈心灵的最佳目的地！", tags: ["疗愈", "自然", "文艺"] },
  "广州": { emoji: "🫖", description: "美食天堂，岭南风情", detail: "喝早茶、逛北京路、游珠江夜景。广州的烟火气让人感受到生活的美好！", tags: ["美食", "现代", "粤文化"] },
  "重庆": { emoji: "🌶️", description: "山城雾都，火锅之城", detail: "洪崖洞看夜景、长江索道、吃重庆火锅。重庆的魔幻地形让人惊叹！", tags: ["刺激", "美食", "魔幻"] }
};

const cityList = Object.keys(cities);

// 状态
let answers = [];
let currentQuestion = 0;

// 页面元素
const pageIndex = document.getElementById('page-index');
const pageQuiz = document.getElementById('page-quiz');
const pageResult = document.getElementById('page-result');

// 显示页面
function showPage(pageId) {
  pageIndex.classList.remove('active');
  pageQuiz.classList.remove('active');
  pageResult.classList.remove('active');
  document.getElementById('page-' + pageId).classList.add('active');
}

// 开始测试
function startTest() {
  answers = [];
  currentQuestion = 0;
  showPage('quiz');
  renderQuestion();
}

// 渲染问题
function renderQuestion() {
  const question = questions[currentQuestion];
  document.getElementById('question-num').textContent = `第${currentQuestion + 1}题`;
  document.getElementById('question-text').textContent = question.question;
  document.getElementById('progress-text').textContent = `${currentQuestion + 1}/${questions.length}`;
  document.getElementById('progress-inner').style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';

  question.options.forEach((option, index) => {
    const div = document.createElement('div');
    div.className = 'option-item';
    div.innerHTML = `<span class="option-text">${option.text}</span>`;
    div.onclick = () => selectOption(index);
    optionsList.appendChild(div);
  });
}

// 选择答案
function selectOption(index) {
  answers.push(index);

  if (currentQuestion >= questions.length - 1) {
    showResult();
  } else {
    currentQuestion++;
    renderQuestion();
  }
}

// 计算结果
function calculateResult() {
  const scores = {};
  cityList.forEach(city => scores[city] = 0);

  answers.forEach((answer, qIndex) => {
    if (qIndex < questions.length) {
      const question = questions[qIndex];
      if (answer < question.options.length) {
        const option = question.options[answer];
        Object.keys(option.weights).forEach(city => {
          if (scores[city] !== undefined) {
            scores[city] += option.weights[city];
          }
        });
      }
    }
  });

  let maxScore = -1;
  let resultCity = cityList[0];

  cityList.forEach(city => {
    if (scores[city] > maxScore) {
      maxScore = scores[city];
      resultCity = city;
    }
  });

  return resultCity;
}

// 显示结果
function showResult() {
  const resultCity = calculateResult();
  const cityDetail = cities[resultCity];

  document.getElementById('result-emoji').textContent = cityDetail.emoji;
  document.getElementById('result-city').textContent = resultCity;
  document.getElementById('city-desc').textContent = cityDetail.description;
  document.getElementById('city-detail').textContent = cityDetail.detail;

  // 渲染标签
  const tagsEl = document.getElementById('tags');
  tagsEl.innerHTML = '';
  cityDetail.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagsEl.appendChild(span);
  });

  showPage('result');
}

// 复制结果
function copyResult() {
  const resultCity = document.getElementById('result-city').textContent;
  const cityDetail = cities[resultCity];
  const text = `🎉 2026新年旺旺测试结果 🎉\n\n我的开年旅游地是：【${resultCity}】\n${cityDetail.description}\n\n${cityDetail.detail}\n\n🧧 新年行大运，快来测测你的！`;

  navigator.clipboard.writeText(text).then(() => {
    alert('已复制到剪贴板！');
  }).catch(() => {
    alert('复制失败，请手动复制');
  });
}

// 重新测试
function restartTest() {
  startTest();
}

// 页面加载时检查本地存储
window.onload = function() {
  const saved = localStorage.getItem('testResult');
  if (saved) {
    // 可以选择恢复或重新开始
  }
};
