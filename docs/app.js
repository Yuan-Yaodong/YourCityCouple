// 问题数据 - 24个城市6道题版本
const questions = [
  {
    id: 1,
    question: "新年第一顿想吃啥？",
    options: [
      { text: "🔥 火锅", weights: { "成都": 3, "重庆": 3, "长沙": 3 }, fiveElement: "火" },
      { text: "🦐 海鲜", weights: { "三亚": 3, "厦门": 3, "北海": 3, "普吉岛": 2 }, fiveElement: "水" },
      { text: "🥘 粤菜", weights: { "广州": 3 }, fiveElement: "土" },
      { text: "🥟 东北菜", weights: { "哈尔滨": 3, "雪乡": 3, "长白山": 3 }, fiveElement: "土" }
    ]
  },
  {
    id: 2,
    question: "偏好哪种旅行方式？",
    options: [
      { text: "📸 打卡网红地", weights: { "重庆": 3, "西安": 3, "厦门": 3, "长沙": 2 }, fiveElement: "火" },
      { text: "🏖️ 度假放松", weights: { "三亚": 3, "厦门": 3, "北海": 3, "普吉岛": 3 }, fiveElement: "水" },
      { text: "⛷️ 冰雪冒险", weights: { "哈尔滨": 3, "雪乡": 3, "长白山": 3 }, fiveElement: "金" },
      { text: "🚶 随意漫步", weights: { "大理": 3, "丽江": 3, "桂林": 2, "阳朔": 2, "杭州": 3, "苏州": 2, "乌镇": 2, "周庄": 2 }, fiveElement: "木" }
    ]
  },
  {
    id: 3,
    question: "喜欢什么天气？",
    options: [
      { text: "❄️ 越冷越好", weights: { "哈尔滨": 3, "雪乡": 3, "长白山": 3 }, fiveElement: "水" },
      { text: "☀️ 阳光温暖", weights: { "三亚": 3, "厦门": 3, "北海": 3, "普吉岛": 3, "广州": 2 }, fiveElement: "火" },
      { text: "🌸 不冷不热", weights: { "杭州": 3, "苏州": 3, "大理": 2, "成都": 2, "桂林": 2, "阳朔": 2 }, fiveElement: "木" },
      { text: "🌧️ 下雨也行", weights: { "杭州": 3, "大理": 2, "厦门": 2, "丽江": 2, "桂林": 2, "阳朔": 2 }, fiveElement: "水" }
    ]
  },
  {
    id: 4,
    question: "旅行中最在意什么？",
    options: [
      { text: "📷 拍照出片", weights: { "厦门": 3, "雪乡": 3, "三亚": 2, "杭州": 2, "阳朔": 2, "乌镇": 2 }, fiveElement: "火" },
      { text: "🍜 美食吃爽", weights: { "成都": 3, "重庆": 3, "广州": 3, "长沙": 3 }, fiveElement: "土" },
      { text: "🧘 放松疗愈", weights: { "大理": 3, "丽江": 3, "三亚": 2, "普吉岛": 2 }, fiveElement: "木" },
      { text: "🏛️ 文化历史", weights: { "西安": 3, "北京": 3, "南京": 3, "洛阳": 3, "杭州": 2, "苏州": 2 }, fiveElement: "土" }
    ]
  },
  {
    id: 5,
    question: "用哪个词形容你的新年？",
    options: [
      { text: "🎆 热闹", weights: { "重庆": 3, "广州": 3, "西安": 2, "长沙": 3, "北京": 2 }, fiveElement: "火" },
      { text: "✨ 浪漫", weights: { "三亚": 3, "厦门": 3, "丽江": 2, "普吉岛": 2, "乌镇": 2 }, fiveElement: "木" },
      { text: "😌 悠闲", weights: { "大理": 3, "丽江": 3, "桂林": 2, "阳朔": 2, "杭州": 2, "苏州": 2, "乌镇": 2, "周庄": 2 }, fiveElement: "木" },
      { text: "🧨 刺激", weights: { "哈尔滨": 3, "雪乡": 3, "长白山": 2, "重庆": 2 }, fiveElement: "金" }
    ]
  },
  {
    id: 6,
    question: "新年最想实现什么愿望？",
    options: [
      { text: "💕 收获爱情", weights: { "厦门": 3, "丽江": 3, "三亚": 2, "大理": 2, "普吉岛": 2 } },
      { text: "💰 暴富搞钱", weights: { "广州": 3, "杭州": 3, "重庆": 2, "北京": 2, "长沙": 2 } },
      { text: "💪 身体健康", weights: { "大理": 3, "丽江": 3, "三亚": 2, "杭州": 2, "阳朔": 2 } },
      { text: "✨ 转运开挂", weights: { "哈尔滨": 3, "雪乡": 3, "长白山": 2, "西安": 2, "北京": 2, "洛阳": 2 } }
    ]
  }
];

// 城市数据 - 24个城市
const cities = {
  "成都": { emoji: "🐼", description: "美食之都，悠闲生活", detail: "逛宽窄巷子、吃火锅、看熊猫、泡茶馆。成都的生活节奏刚刚好，美食更是让人流连忘返！", tags: ["美食", "悠闲", "国宝"], color: "#FF7F50", category: "火热美食", wuxing: "火", title: "人间烟火客", healing: "慢慢来，比较快。", luckyColor: "红色", luckyNumber: "8", luckyThing: "火锅" },
  "重庆": { emoji: "🌶️", description: "山城雾都，火锅之城", detail: "洪崖洞看夜景、长江索道、吃重庆火锅。重庆的魔幻地形让人惊叹！", tags: ["刺激", "美食", "魔幻"], color: "#DC143C", category: "火热美食", wuxing: "火", title: "山城冒险家", healing: "生活就是要有滋有味！", luckyColor: "红色", luckyNumber: "6", luckyThing: "火锅" },
  "广州": { emoji: "🫖", description: "美食天堂，岭南风情", detail: "喝早茶、逛北京路、游珠江夜景。广州的烟火气让人感受到生活的美好！", tags: ["美食", "现代", "粤文化"], color: "#FF6347", category: "火热美食", wuxing: "土", title: "务实寻味者", healing: "民以食为天，吃饱才有力气生活。", luckyColor: "金色", luckyNumber: "3", luckyThing: "早茶" },
  "长沙": { emoji: "🍜", description: "湘菜之都，娱乐之城", detail: "逛太平街、吃臭豆腐、登岳麓山、泡解放西。长沙的夜生活火辣辣的！", tags: ["美食", "火辣", "夜生活"], color: "#FF4500", category: "火热美食", wuxing: "火", title: "夜生活达人", healing: "越夜越精彩！", luckyColor: "橙色", luckyNumber: "7", luckyThing: "臭豆腐" },
  "三亚": { emoji: "🏝️", description: "温暖海滨，度假天堂", detail: "在蜈支洲岛潜水、天涯海角看日落。新年躲避严寒，来三亚享受阳光沙滩！", tags: ["温暖", "度假", "海岛"], color: "#00CED1", category: "海岛度假", wuxing: "水", title: "阳光收集者", healing: "面朝大海，春暖花开。", luckyColor: "蓝色", luckyNumber: "9", luckyThing: "海滩" },
  "厦门": { emoji: "🌴", description: "海岛小清新，文艺之城", detail: "环岛路骑行、鼓浪屿听琴、中山路逛吃。厦门的浪漫藏在每一处细节里！", tags: ["文艺", "浪漫", "海岛"], color: "#20B2AA", category: "海岛度假", wuxing: "木", title: "文艺漫游者", healing: "慢慢走，欣赏啊。", luckyColor: "绿色", luckyNumber: "5", luckyThing: "海风" },
  "北海": { emoji: "🏖️", description: "滨海风情，疍家文化", detail: "银滩踏浪、涠洲岛看火山、侨港吃海鲜。北海是未被过度开发的静谧海岸！", tags: ["宁静", "原生态", "海鲜"], color: "#40E0D0", category: "海岛度假", wuxing: "水", title: "宁静追光者", healing: "宁静致远，淡泊明志。", luckyColor: "青色", luckyNumber: "2", luckyThing: "浪花" },
  "普吉岛": { emoji: "🏝️", description: "泰式风情，海岛天堂", detail: "芭东海滩的热闹、皮皮岛的宁静、皇帝岛的潜水。普吉岛是东南亚度假的首选！", tags: ["出境", "度假", "海岛"], color: "#FF69B4", category: "海岛度假", wuxing: "水", title: "世界漫游家", healing: "世界很大，值得去看看。", luckyColor: "紫色", luckyNumber: "4", luckyThing: "海岛" },
  "哈尔滨": { emoji: "🏰", description: "冰雪世界，童话王国", detail: "漫步在中央大街，感受俄式风情；到索菲亚教堂打卡；去冰雪大世界看冰灯展！", tags: ["冰雪", "浪漫", "异域"], color: "#87CEEB", category: "冰雪奇缘", wuxing: "水", title: "冰雪诗人", healing: "所有美好都会如约而至。", luckyColor: "白色", luckyNumber: "1", luckyThing: "雪花" },
  "雪乡": { emoji: "❄️", description: "童话世界，冰雪奇缘", detail: "厚厚的雪蘑菇、浪漫的雪景房、夜晚的红灯笼。这里是东北雪景的精华所在！", tags: ["冰雪", "童话", "拍照"], color: "#E0FFFF", category: "冰雪奇缘", wuxing: "水", title: "童话造梦师", healing: "保持童心，世界很美好。", luckyColor: "银色", luckyNumber: "6", luckyThing: "雪人" },
  "长白山": { emoji: "🗻", description: "雪域圣山，滑雪天堂", detail: "天池观景、滑雪场飞驰、温泉里赏雪。长白山让你的冬天不再单调！", tags: ["冰雪", "滑雪", "温泉"], color: "#B0E0E6", category: "冰雪奇缘", wuxing: "金", title: "极限挑战者", healing: "挑战自我，超越极限。", luckyColor: "蓝色", luckyNumber: "8", luckyThing: "滑雪" },
  "大理": { emoji: "🌸", description: "风花雪月，苍山洱海", detail: "环洱海骑行、苍山徒步、古城看云。大理是疗愈心灵的最佳目的地！", tags: ["疗愈", "自然", "文艺"], color: "#DDA0DD", category: "西南秘境", wuxing: "木", title: "灵魂摆渡人", healing: "慢下来，等等自己的灵魂。", luckyColor: "紫色", luckyNumber: "7", luckyThing: "洱海" },
  "丽江": { emoji: "🏔️", description: "艳遇古城，浪漫时光", detail: "漫步古城石板路、爬玉龙雪山、束河古镇发发呆。这里是寻找艳遇和放松的最佳目的地！", tags: ["古城", "浪漫", "雪山"], color: "#9370DB", category: "西南秘境", wuxing: "火", title: "浪漫寻梦人", healing: "艳遇不如悦己。", luckyColor: "红色", luckyNumber: "5", luckyThing: "雪山" },
  "桂林": { emoji: "⛰️", description: "山水甲天下，诗意桂林", detail: "漓江竹筏、象鼻山打卡、阳朔西街。桂林山水甲天下，绝美风光等你来！", tags: ["山水", "诗意", "喀斯特"], color: "#66CDAA", category: "西南秘境", wuxing: "木", title: "山水画家", healing: "人在画中游，画在心中留。", luckyColor: "绿色", luckyNumber: "3", luckyThing: "竹筏" },
  "阳朔": { emoji: "🎋", description: "山水田园，诗意阳朔", detail: "十里画廊骑行、遇龙河竹筏、银子岩探秘。阳朔的田园风光让人流连忘返！", tags: ["田园", "骑行", "山水"], color: "#9ACD32", category: "西南秘境", wuxing: "木", title: "田园诗人", healing: "岁月静好，现世安稳。", luckyColor: "黄色", luckyNumber: "9", luckyThing: "骑行" },
  "西安": { emoji: "🏯", description: "千年古都，盛世长安", detail: "登城墙、逛兵马俑、回民街吃泡馍。新年感受大唐盛世的文化底蕴！", tags: ["历史", "文化", "美食"], color: "#CD853F", category: "历史文化", wuxing: "土", title: "历史考古家", healing: "读史使人明智。", luckyColor: "棕色", luckyNumber: "4", luckyThing: "城墙" },
  "北京": { emoji: "🏯", description: "首都气象，皇家风范", detail: "逛故宫、登长城、颐和园赏雪。北京的庄严与厚重，值得细细品味！", tags: ["历史", "文化", "首都"], color: "#B22222", category: "历史文化", wuxing: "土", title: "京华烟云客", healing: "岁月沉淀的都是精华。", luckyColor: "红色", luckyNumber: "1", luckyThing: "长城" },
  "南京": { emoji: "🏛️", description: "六朝古都，厚重历史", detail: "中山陵追忆、夫子庙逛吃、玄武湖漫步。南京的历史藏在每一条街道！", tags: ["历史", "文化", "民国"], color: "#8B4513", category: "历史文化", wuxing: "火", title: "时光旅行者", healing: "一切都是最好的安排。", luckyColor: "深红", luckyNumber: "6", luckyThing: "梧桐" },
  "洛阳": { emoji: "🏺", description: "十三朝古都，牡丹花城", detail: "龙门石窟探秘、白马寺祈福、丽景门怀古。洛阳的年味从正月开始！", tags: ["历史", "文化", "牡丹"], color: "#D2691E", category: "历史文化", wuxing: "土", title: "文化传承者", healing: "中华文化，博大精深。", luckyColor: "粉色", luckyNumber: "8", luckyThing: "牡丹" },
  "杭州": { emoji: "🏙️", description: "西湖美景，江南诗意", detail: "断桥残雪、雷峰塔望湖、龙井问茶。杭州的诗意藏在山水之间，新年祈福好去处！", tags: ["诗意", "山水", "休闲"], color: "#3CB371", category: "江南诗意", wuxing: "水", title: "江南诗意客", healing: "偷得浮生半日闲。", luckyColor: "绿色", luckyNumber: "2", luckyThing: "西湖" },
  "苏州": { emoji: "🏡", description: "园林水乡，江南典范", detail: "游拙政园、逛平江路、听评弹、坐游船。苏州的精致让人沉醉！", tags: ["园林", "水乡", "诗意"], color: "#8FBC8F", category: "江南诗意", wuxing: "木", title: "园林收藏家", healing: "精致生活，从容以对。", luckyColor: "青色", luckyNumber: "5", luckyThing: "园林" },
  "乌镇": { emoji: "🛶", description: "枕水人家，梦里水乡", detail: "东栅晨雾、西栅夜景、木心美术馆。乌镇的慢时光让人忘记时间！", tags: ["水乡", "古镇", "文艺"], color: "#DEB887", category: "江南诗意", wuxing: "水", title: "水乡梦旅人", healing: "从前慢，车马邮件都慢。", luckyColor: "米色", luckyNumber: "3", luckyThing: "乌篷船" },
  "周庄": { emoji: "🌾", description: "第一水乡，江南烟雨", detail: "双桥映月、沈厅探富、夜游水巷。周庄是江南水乡的代表作！", tags: ["水乡", "古镇", "烟雨"], color: "#F4A460", category: "江南诗意", wuxing: "水", title: "烟雨画中人", healing: "烟雨江南，如诗如画。", luckyColor: "暖黄", luckyNumber: "7", luckyThing: "油纸伞" }
};

const cityList = Object.keys(cities);

// 五行属性数据
const fiveElementData = {
  "金": { emoji: "⚔️", name: "金", color: "#D4AF37", luckyColors: ["白色", "金色", "银色"], luckyNumbers: [4, 9], direction: "西方", fortune: "金代表刚强与锐气。你在新的一年里将迎来事业上的突破，财运亨通！但要记得保持谦逊，避免过度锋芒毕露。", compatible: ["土", "水"], avoid: ["火", "木"] },
  "木": { emoji: "🌿", name: "木", color: "#228B22", luckyColors: ["绿色", "青色", "蓝色"], luckyNumbers: [3, 8], direction: "东方", fortune: "木代表生长与活力。你将在新的一年里遇到意想不到的惊喜，人际关系和谐，身体健康！适合多参与户外活动。", compatible: ["水", "火"], avoid: ["金", "土"] },
  "水": { emoji: "🌊", name: "水", color: "#4169E1", luckyColors: ["蓝色", "黑色", "白色"], luckyNumbers: [1, 6], direction: "北方", fortune: "水代表智慧与流动。你的新的一年将充满机遇与挑战，思维敏捷，适合学习新技能或进行投资。但要避免冲动决策。", compatible: ["金", "木"], avoid: ["土", "火"] },
  "火": { emoji: "🔥", name: "火", color: "#FF4500", luckyColors: ["红色", "紫色", "橙色"], luckyNumbers: [2, 7], direction: "南方", fortune: "火代表热情与能量。你将在新的一年里充满活力，适合主动出击！但要学会控制情绪，避免与他人发生冲突。", compatible: ["木", "土"], avoid: ["水", "金"] },
  "土": { emoji: "🏔️", name: "土", color: "#8B4513", luckyColors: ["黄色", "棕色", "金色"], luckyNumbers: [5, 0], direction: "中央", fortune: "土代表稳重与踏实。你将在新的一年里收获稳定的成果，适合稳步发展。财运不错，适合进行长期投资。", compatible: ["火", "金"], avoid: ["木", "水"] }
};

// 治愈语录
const healingQuotes = [
  "你值得拥有一场美好的旅行，来犒劳努力的自己。",
  "放慢脚步，让心灵跟上身体的节奏。",
  "沿途的风景很重要，但更重要的是看风景的心情。",
  "给自己一个GAP WEEK，去遇见更好的自己。",
  "旅行不需要理由，只需要一颗出发的心。",
  "你本身就是一道风景，何必去远方寻找。",
  "最好的旅行，是找回内心的平静与喜悦。",
  "世界很大，先从让自己开心开始。",
  "每一次出发，都是对自己的奖赏。",
  "慢慢来，比较快。",
  "你的新年，值得一场美好的旅行。",
  "走出去，世界会向你走来。"
];

// ==================== 交互逻辑（Web 对齐小程序） ====================
const STORAGE_KEYS = {
  HISTORY: 'yc_history_results',
  RITUAL: 'yc_daily_ritual',
  LAST_RESULT: 'yc_last_result'
};

let currentQuestion = 0;
let userAnswers = [];
let currentComputedResult = null;

function startTest() {
  userAnswers = [];
  currentQuestion = 0;
  currentComputedResult = null;
  showPage('page-quiz');
  renderQuiz();
}

function renderQuiz() {
  const question = questions[currentQuestion];
  document.getElementById('question-num').textContent = `第${currentQuestion + 1}题`;
  document.getElementById('question-text').textContent = question.question;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById('progress-inner').style.width = progress + '%';
  document.getElementById('progress-text').textContent = `${currentQuestion + 1} / ${questions.length}`;

  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = '';
  question.options.forEach((option, index) => {
    const btn = document.createElement('div');
    btn.className = 'option-item';
    btn.textContent = option.text;
    btn.style.animationDelay = `${index * 0.1}s`;
    btn.onclick = () => selectOption(index);
    optionsList.appendChild(btn);
  });
}

function selectOption(optionIndex) {
  if (userAnswers.length !== currentQuestion) return;
  userAnswers.push(optionIndex);

  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuiz();
  } else {
    showResult();
  }
}

function calculateResult(answers) {
  const scores = {};
  cityList.forEach(city => { scores[city] = 0; });

  answers.forEach((answer, qIndex) => {
    const question = questions[qIndex];
    const option = question && question.options ? question.options[answer] : null;
    if (!option || !option.weights) return;
    Object.keys(option.weights).forEach(city => {
      if (scores[city] !== undefined) scores[city] += option.weights[city];
    });
  });

  const sortedCities = Object.keys(scores)
    .map(city => ({ city, score: scores[city] }))
    .sort((a, b) => b.score - a.score);

  return {
    city: sortedCities[0] ? sortedCities[0].city : cityList[0],
    score: sortedCities[0] ? sortedCities[0].score : 0,
    allScores: scores,
    runnerUp: sortedCities[1] || null
  };
}

function calculateFiveElement(answers) {
  const elementScores = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
  answers.forEach((answer, qIndex) => {
    const question = questions[qIndex];
    const option = question && question.options ? question.options[answer] : null;
    if (!option || !option.fiveElement) return;
    if (elementScores[option.fiveElement] !== undefined) {
      elementScores[option.fiveElement] += 1;
    }
  });

  let resultElement = '土';
  let maxScore = -1;
  Object.keys(elementScores).forEach(element => {
    if (elementScores[element] > maxScore) {
      maxScore = elementScores[element];
      resultElement = element;
    }
  });

  return {
    element: resultElement,
    detail: fiveElementData[resultElement] || fiveElementData['土'],
    allScores: elementScores
  };
}

function calculateMBTI(answers) {
  let eScore = 0; let iScore = 0;
  if (answers[1] === 0) eScore += 2;
  else if (answers[1] === 1) iScore += 1;
  else if (answers[1] === 2) eScore += 2;
  else if (answers[1] === 3) iScore += 2;
  if (answers[5] === 0) eScore += 1;
  else if (answers[5] === 1) iScore += 1;
  else if (answers[5] === 2) iScore += 1;
  else if (answers[5] === 3) eScore += 1;
  const EI = eScore >= iScore ? 'E' : 'I';

  let sScore = 0; let nScore = 0;
  if (answers[0] === 0 || answers[0] === 1 || answers[0] === 3) sScore += 1;
  else if (answers[0] === 2) nScore += 1;
  if (answers[2] === 0 || answers[2] === 1) sScore += 1;
  else if (answers[2] === 2 || answers[2] === 3) nScore += 1;
  const SN = sScore >= nScore ? 'S' : 'N';

  let tScore = 0; let fScore = 0;
  if (answers[3] === 0) tScore += 1;
  else if (answers[3] === 1) tScore += 2;
  else if (answers[3] === 2) fScore += 2;
  else if (answers[3] === 3) fScore += 1;
  if (answers[5] === 0) fScore += 2;
  else if (answers[5] === 1) tScore += 2;
  else if (answers[5] === 2) fScore += 2;
  else if (answers[5] === 3) tScore += 1;
  const TF = tScore >= fScore ? 'T' : 'F';

  let jScore = 0; let pScore = 0;
  if (answers[2] === 0 || answers[2] === 1) jScore += 1;
  else if (answers[2] === 2 || answers[2] === 3) pScore += 1;
  if (answers[4] === 0) jScore += 2;
  else if (answers[4] === 1) jScore += 1;
  else if (answers[4] === 2) pScore += 2;
  else if (answers[4] === 3) pScore += 2;
  const JP = jScore >= pScore ? 'J' : 'P';

  const type = EI + SN + TF + JP;
  const map = {
    "INTJ": { name: "战略家", description: "你善于规划，旅行前会做详尽攻略，追求深度体验", travelStyle: "喜欢探索小众目的地，注重旅行的意义和成长", emoji: "🎯" },
    "INTP": { name: "探险家", description: "你好奇心强，喜欢研究和发现旅行中的新奇事物", travelStyle: "热衷于解构当地文化，寻找独特的旅行体验", emoji: "🔍" },
    "INFJ": { name: "梦想家", description: "你内心温暖，旅行是为了寻找灵感和精神共鸣", travelStyle: "喜欢有故事、有深度的旅行目的地", emoji: "💫" },
    "INFP": { name: "治愈者", description: "你追求内心的平静与和谐，旅行是自我疗愈的过程", travelStyle: "偏爱宁静、有艺术氛围的旅行地", emoji: "🌙" },
    "ISTJ": { name: "执行者", description: "你务实可靠，旅行计划周密，喜欢经典的旅游路线", travelStyle: "追求安全感和确定性，注重旅行的实用性", emoji: "📋" },
    "ISFJ": { name: "守护者", description: "你体贴细心，旅行中善于照顾同行伙伴的感受", travelStyle: "喜欢舒适温暖的旅行体验，重视回忆的珍藏", emoji: "🛡️" },
    "ISTP": { name: "冒险家", description: "你冷静务实，喜欢动手体验，旅行中追求刺激与挑战", travelStyle: "偏爱户外运动和探险类旅行目的地", emoji: "🧗" },
    "ISFP": { name: "艺术家", description: "你审美独特，旅行中善于发现美、感受美", travelStyle: "喜欢有艺术氛围和自然美景的目的地", emoji: "🎨" },
    "ENFJ": { name: "领袖", description: "你天生具有领导力，旅行中善于组织同行伙伴", travelStyle: "喜欢能让自己发光发热的有趣目的地", emoji: "⭐" },
    "ENTP": { name: "创新者", description: "你思维活跃，旅行中总是能发现新的可能性", travelStyle: "喜欢充满活力和创意的旅行目的地", emoji: "💡" },
    "ENTJ": { name: "指挥官", description: "你目标清晰，行动果断，旅行中擅长做决策和统筹全局", travelStyle: "偏爱节奏明确、效率高、目标导向的旅行路线", emoji: "🧭" },
    "ENFP": { name: "自由者", description: "你热情洋溢，旅行中永远充满活力和创意", travelStyle: "喜欢新鲜有趣的体验，拒绝一成不变的旅行", emoji: "🦋" },
    "ESTJ": { name: "管理者", description: "你高效务实，旅行中善于安排行程和时间", travelStyle: "喜欢井井有条的旅行体验，追求高效完成景点打卡", emoji: "🏆" },
    "ESFJ": { name: "美食家", description: "你热情好客，旅行中最大的乐趣就是品尝美食", travelStyle: "为了美食可以跨越千里，注重当地的烟火气", emoji: "🍜" },
    "ESTP": { name: "挑战者", description: "你大胆冲动，喜欢即时行乐，旅行充满刺激", travelStyle: "偏爱极限运动和冒险类旅行体验", emoji: "⚡" },
    "ESFP": { name: "表演者", description: "你活泼开朗，旅行中永远是气氛组的担当", travelStyle: "喜欢热闹有趣的地方，享受旅途中的欢乐时光", emoji: "🎉" }
  };
  const info = map[type] || map.ENFP;
  return { type, ...info };
}

function analyzeUserPreferences(answers, resultCity) {
  const food = [
    { text: "热情似火", desc: "喜欢火锅的你，性格热烈直接，爱憎分明" },
    { text: "追求品质", desc: "热爱海鲜的你，注重生活品质，懂得享受" },
    { text: "精致生活", desc: "偏爱粤菜的你，追求精致与格调" },
    { text: "豪爽大气", desc: "喜欢东北菜的你，为人豪爽，不拘小节" }
  ][answers[0] || 0];
  const travel = [
    { text: "打卡达人", desc: "你热爱探索网红地点，喜欢分享精彩瞬间" },
    { text: "度假玩家", desc: "你懂得放松自己，追求舒适的旅行体验" },
    { text: "冒险勇者", desc: "你喜欢挑战未知，追求刺激与新鲜感" },
    { text: "漫步诗人", desc: "你喜欢随性自由，享受旅途中的慢时光" }
  ][answers[1] || 0];
  const priority = [
    { text: "影像记录", desc: "你热爱用镜头捕捉旅途中的美好" },
    { text: "美食探索", desc: "你把品尝美食作为旅行的重中之重" },
    { text: "心灵疗愈", desc: "你追求身心的放松与平静" },
    { text: "文化探寻", desc: "你热爱历史与文化的深度探索" }
  ][answers[3] || 0];
  const vibe = [
    { text: "热闹欢腾", desc: "你喜欢热闹非凡的新年氛围" },
    { text: "浪漫温馨", desc: "你向往浪漫的新年时光" },
    { text: "悠闲自在", desc: "你喜欢轻松悠闲的节日节奏" },
    { text: "刺激精彩", desc: "你追求精彩刺激的新年体验" }
  ][answers[4] || 0];
  const wish = [
    { text: "收获爱情", desc: "你渴望在新的一年里收获甜蜜的爱情" },
    { text: "暴富搞钱", desc: "你期待财源滚滚在新的一年里实现财务自由" },
    { text: "身体健康", desc: "你希望新的一年里身体棒棒，健康平安" },
    { text: "转运开挂", desc: "你渴望在新的一年里转运逆袭，走上人生巅峰" }
  ][answers[5] || 0];

  const whyFit = [
    { text: "性格契合", desc: food.desc },
    { text: "旅行方式契合", desc: travel.desc },
    { text: "核心追求契合", desc: priority.desc },
    { text: "节日氛围契合", desc: vibe.desc },
    { text: `与${resultCity}气质契合`, desc: wish.desc }
  ];

  const actionTips = [
    `今天做一件和${resultCity}有关的小事：查一张机票或收藏一条攻略`,
    `给自己安排30分钟轻旅行时刻，按照“${travel.text}”的方式放松`,
    `把“${wish.text}”写成一句新年承诺，今晚睡前读一遍`
  ];

  return {
    whyFit,
    actionTips,
    summary: `${food.text}的${travel.text}，追求${priority.text}，想要${vibe.text}的新年，期待${wish.text}`
  };
}

function showResult() {
  showPage('page-result');
  createCelebration();

  const result = calculateResult(userAnswers);
  const city = cities[result.city];
  const fiveElement = calculateFiveElement(userAnswers);
  const mbti = calculateMBTI(userAnswers);
  const analysis = analyzeUserPreferences(userAnswers, result.city);
  const compareText = getCompareText(result.city);
  const ritual = getRitualState();
  const dailyQuote = getDailyQuote(result.city);

  currentComputedResult = {
    result,
    city,
    fiveElement,
    mbti,
    analysis,
    compareText,
    dailyQuote,
    ritual
  };

  saveHistory(result.city, analysis.summary);

  renderResult(currentComputedResult);
  renderUserAnswers();
}

function renderResult(payload) {
  const { result, city, fiveElement, mbti, analysis, compareText, dailyQuote, ritual } = payload;

  document.getElementById('result-emoji').textContent = city.emoji;
  document.getElementById('result-city').textContent = result.city;
  document.getElementById('result-city').style.color = city.color;
  document.getElementById('city-desc').textContent = city.description;
  document.getElementById('city-detail').textContent = city.detail;

  const tagsContainer = document.getElementById('tags');
  tagsContainer.innerHTML = '';
  city.tags.forEach((tag, i) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    span.style.animationDelay = `${0.5 + i * 0.1}s`;
    tagsContainer.appendChild(span);
  });

  const analysisSection = document.getElementById('analysis-section');
  analysisSection.style.display = 'block';
  document.getElementById('why-fit').innerHTML = analysis.whyFit
    .map(item => `<div class="analysis-item"><strong>${item.text}</strong>：${item.desc}</div>`)
    .join('');
  document.getElementById('analysis-summary').textContent = analysis.summary;

  document.getElementById('mbti-display').style.display = 'block';
  document.getElementById('mbti-display').innerHTML = `
    <div class="mbti-card-mini">
      <div class="mbti-line-1">${mbti.emoji} ${mbti.type} · ${mbti.name}</div>
      <div class="mbti-line-2">${mbti.description}</div>
      <div class="mbti-line-3">旅行风格：${mbti.travelStyle}</div>
    </div>
  `;

  const runner = document.getElementById('runnerup-display');
  if (result.runnerUp && cities[result.runnerUp.city]) {
    const runnerCity = cities[result.runnerUp.city];
    runner.style.display = 'block';
    runner.innerHTML = `<div class="runnerup-inner">差一点就是：${runnerCity.emoji} ${result.runnerUp.city} · ${runnerCity.description}</div>`;
  } else {
    runner.style.display = 'none';
  }

  const compare = document.getElementById('compare-display');
  compare.style.display = 'block';
  compare.innerHTML = `<div class="compare-inner">和上次相比：${compareText}</div>`;

  const actionTipsBlock = document.getElementById('action-tips-display');
  actionTipsBlock.style.display = 'block';
  actionTipsBlock.innerHTML = `
    <div class="action-title">今日好运行动建议</div>
    ${analysis.actionTips.map(t => `<div class="action-item">✅ ${t}</div>`).join('')}
  `;

  const quoteBlock = document.getElementById('daily-quote-display');
  quoteBlock.style.display = 'block';
  quoteBlock.innerHTML = `<div class="quote-inner">今日好运签：${dailyQuote}</div>`;

  const ritualBlock = document.getElementById('ritual-display');
  ritualBlock.style.display = 'block';
  ritualBlock.innerHTML = `
    <div class="ritual-title-mini">今日好运仪式</div>
    <div class="ritual-text-mini" id="ritual-text-mini">连续点亮：${ritual.streakDays} 天</div>
    <button class="btn-toggle" id="ritual-btn">${ritual.todayDone ? '✨ 今日已点亮' : '✨ 点亮今日好运'}</button>
  `;
  document.getElementById('ritual-btn').onclick = lightUpToday;

  const fe = fiveElement.detail;
  document.getElementById('five-element-display').innerHTML = `
    <div class="five-element-result">
      <span class="fe-emoji">${fe.emoji}</span>
      <span class="fe-name">${fe.name}属</span>
    </div>
    <div class="fe-lucky">
      <span>幸运色：${fe.luckyColors.join('、')}</span>
      <span>幸运数字：${fe.luckyNumbers.join('、')}</span>
      <span>贵人方位：${fe.direction}</span>
    </div>
    <div class="fe-fortune">${fe.fortune}</div>
  `;

  document.getElementById('title-display').innerHTML = `
    <div class="user-title">${city.title}</div>
    <div class="healing-quote">${city.healing}</div>
  `;

  document.getElementById('lucky-display').innerHTML = `
    <div class="lucky-item"><span>幸运色</span><span>${city.luckyColor}</span></div>
    <div class="lucky-item"><span>幸运数字</span><span>${city.luckyNumber}</span></div>
    <div class="lucky-item"><span>幸运物</span><span>${city.luckyThing}</span></div>
  `;
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function restartTest() {
  userAnswers = [];
  currentQuestion = 0;
  currentComputedResult = null;
  showPage('page-index');
}

function renderUserAnswers() {
  const container = document.getElementById('user-answers-list');
  if (!container) return;
  container.innerHTML = '';

  userAnswers.forEach((answerIndex, qIndex) => {
    const question = questions[qIndex];
    const selectedOption = question && question.options ? question.options[answerIndex] : null;
    if (!question || !selectedOption) return;
    const item = document.createElement('div');
    item.className = 'answer-item';
    item.innerHTML = `
      <div class="answer-q">${qIndex + 1}. ${question.question}</div>
      <div class="answer-a">${selectedOption.text}</div>
    `;
    container.appendChild(item);
  });

  const toggleBtn = document.getElementById('toggle-answers');
  const answersSection = document.getElementById('answers-section');
  if (toggleBtn && answersSection) {
    answersSection.style.display = 'none';
    toggleBtn.textContent = '查看我的答案';
  }
}

function toggleAnswers() {
  const section = document.getElementById('answers-section');
  const btn = document.getElementById('toggle-answers');
  if (section.style.display === 'none') {
    section.style.display = 'block';
    btn.textContent = '收起我的答案';
  } else {
    section.style.display = 'none';
    btn.textContent = '查看我的答案';
  }
}

function copyResult() {
  if (!currentComputedResult) return;
  const { result, city, fiveElement, mbti, analysis } = currentComputedResult;
  const fe = fiveElement.detail;

  const text = `🎉 2026新年旺城测试 🎉

我的开年旅游地是：【${result.city}】${city.emoji}
${city.description}

${city.detail}

📝 为什么适合你：
${analysis.whyFit.map(item => `• ${item.text}：${item.desc}`).join('\n')}

🔮 我的MBTI旅行人格：${mbti.type} ${mbti.emoji} ${mbti.name}
${mbti.description}
旅行风格：${mbti.travelStyle}

🧭 五行属性：${fe.emoji} ${fe.name}
幸运色：${fe.luckyColors.join('、')}
幸运数字：${fe.luckyNumbers.join('、')}
贵人方位：${fe.direction}

💡 ${analysis.summary}

🧧 新年行大运，快来测测你的！`;

  navigator.clipboard.writeText(text).then(() => {
    alert('已复制到剪贴板！');
  });
}

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getRitualState() {
  const record = JSON.parse(localStorage.getItem(STORAGE_KEYS.RITUAL) || '{}');
  const todayKey = getTodayKey();
  const todayDone = !!record[todayKey];

  let streakDays = 0;
  const cursor = new Date();
  while (true) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, '0');
    const d = String(cursor.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    if (!record[key]) break;
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { todayDone, streakDays, record };
}

function lightUpToday() {
  if (!currentComputedResult) return;
  const state = getRitualState();
  if (state.todayDone) {
    alert('今天已经点亮过啦');
    return;
  }
  const key = getTodayKey();
  state.record[key] = currentComputedResult.result.city;
  localStorage.setItem(STORAGE_KEYS.RITUAL, JSON.stringify(state.record));
  const next = getRitualState();
  const text = document.getElementById('ritual-text-mini');
  const btn = document.getElementById('ritual-btn');
  if (text) text.textContent = `连续点亮：${next.streakDays} 天`;
  if (btn) btn.textContent = '✨ 今日已点亮';
}

function saveHistory(city, summary) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
  const current = { city, summary: summary || '', ts: Date.now() };
  const merged = [current, ...list].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(merged));
  localStorage.setItem(STORAGE_KEYS.LAST_RESULT, JSON.stringify(current));
}

function getCompareText(currentCity) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
  const previous = history[1];
  if (!previous || !previous.city) return '这是你第一次测试，欢迎开启好运旅程！';
  if (previous.city === currentCity) return `连续命中${currentCity}，你的旅行偏好非常稳定。`;
  return `上一次是${previous.city}，这次切换到${currentCity}，你的状态正在变化。`;
}

function getDailyQuote(seedCity) {
  if (!Array.isArray(healingQuotes) || healingQuotes.length === 0) return '今天也会有小确幸。';
  const now = new Date();
  const seed = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${seedCity || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return healingQuotes[Math.abs(hash) % healingQuotes.length];
}
