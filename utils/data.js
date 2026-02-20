// utils/data.js - 问题数据和城市数据

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
      { text: "💕 收获爱情", weights: { "厦门": 3, "丽江": 3, "三亚": 2, "大理": 2, "普吉岛": 2 }, fiveElement: "火" },
      { text: "💰 暴富搞钱", weights: { "广州": 3, "杭州": 3, "重庆": 2, "北京": 2, "长沙": 2 }, fiveElement: "金" },
      { text: "💪 身体健康", weights: { "大理": 3, "丽江": 3, "三亚": 2, "杭州": 2, "阳朔": 2 }, fiveElement: "木" },
      { text: "✨ 转运开挂", weights: { "哈尔滨": 3, "雪乡": 3, "长白山": 2, "西安": 2, "北京": 2, "洛阳": 2 }, fiveElement: "金" }
    ]
  }
];

// 五行属性数据
const fiveElementData = {
  "金": {
    emoji: "⚔️",
    name: "金",
    color: "#D4AF37",
    luckyColors: ["白色", "金色", "银色"],
    luckyNumbers: [4, 9],
    direction: "西方",
    fortune: "金代表刚强与锐气。你在新的一年里将迎来事业上的突破，财运亨通！但要记得保持谦逊，避免过度锋芒毕露。",
    compatible: ["土", "水"],
    avoid: ["火", "木"]
  },
  "木": {
    emoji: "🌿",
    name: "木",
    color: "#228B22",
    luckyColors: ["绿色", "青色", "蓝色"],
    luckyNumbers: [3, 8],
    direction: "东方",
    fortune: "木代表生长与活力。你将在新的一年里遇到意想不到的惊喜，人际关系和谐，身体健康！适合多参与户外活动。",
    compatible: ["水", "火"],
    avoid: ["金", "土"]
  },
  "水": {
    emoji: "🌊",
    name: "水",
    color: "#4169E1",
    luckyColors: ["蓝色", "黑色", "白色"],
    luckyNumbers: [1, 6],
    direction: "北方",
    fortune: "水代表智慧与流动。你的新的一年将充满机遇与挑战，思维敏捷，适合学习新技能或进行投资。但要避免冲动决策。",
    compatible: ["金", "木"],
    avoid: ["土", "火"]
  },
  "火": {
    emoji: "🔥",
    name: "火",
    color: "#FF4500",
    luckyColors: ["红色", "紫色", "橙色"],
    luckyNumbers: [2, 7],
    direction: "南方",
    fortune: "火代表热情与能量。你将在新的一年里充满活力，适合主动出击！但要学会控制情绪，避免与他人发生冲突。",
    compatible: ["木", "土"],
    avoid: ["水", "金"]
  },
  "土": {
    emoji: "🏔️",
    name: "土",
    color: "#8B4513",
    luckyColors: ["黄色", "棕色", "金色"],
    luckyNumbers: [5, 0],
    direction: "中央",
    fortune: "土代表稳重与踏实。你将在新的一年里收获稳定的成果，适合稳步发展。财运不错，适合进行长期投资。",
    compatible: ["火", "金"],
    avoid: ["木", "水"]
  }
};

const cities = {
  // 火热美食
  "成都": {
    emoji: "🐼",
    description: "美食之都，悠闲生活",
    detail: "逛宽窄巷子、吃火锅，看熊猫、泡茶馆。成都的生活节奏刚刚好，美食更是让人流连忘返！",
    tags: ["美食", "悠闲", "国宝"],
    color: "#FF7F50",
    category: "火热美食",
    wuxing: "火",
    title: "人间烟火客",
    healing: "慢慢来，比较快。",
    luckyColor: "红色",
    luckyNumber: "8",
    luckyThing: "火锅"
  },
  "重庆": {
    emoji: "🌶️",
    description: "山城雾都，火锅之城",
    detail: "洪崖洞看夜景、长江索道、吃重庆火锅。重庆的魔幻地形让人惊叹！",
    tags: ["刺激", "美食", "魔幻"],
    color: "#DC143C",
    category: "火热美食",
    wuxing: "火",
    title: "山城冒险家",
    healing: "生活就是要有滋有味！",
    luckyColor: "红色",
    luckyNumber: "6",
    luckyThing: "火锅"
  },
  "广州": {
    emoji: "🫖",
    description: "美食天堂，岭南风情",
    detail: "喝早茶、逛北京路、游珠江夜景。广州的烟火气让人感受到生活的美好！",
    tags: ["美食", "现代", "粤文化"],
    color: "#FF6347",
    category: "火热美食",
    wuxing: "土",
    title: "务实寻味者",
    healing: "民以食为天，吃饱才有力气生活。",
    luckyColor: "金色",
    luckyNumber: "3",
    luckyThing: "早茶"
  },
  "长沙": {
    emoji: "🍜",
    description: "湘菜之都，娱乐之城",
    detail: "逛太平街、吃臭豆腐、登岳麓山、泡解放西。长沙的夜生活火辣辣的！",
    tags: ["美食", "火辣", "夜生活"],
    color: "#FF4500",
    category: "火热美食",
    wuxing: "火",
    title: "夜生活达人",
    healing: "越夜越精彩！",
    luckyColor: "橙色",
    luckyNumber: "7",
    luckyThing: "臭豆腐"
  },
  // 海岛度假
  "三亚": {
    emoji: "🏝️",
    description: "温暖海滨，度假天堂",
    detail: "在蜈支洲岛潜水、天涯海角看日落。新年躲避严寒，来三亚享受阳光沙滩！",
    tags: ["温暖", "度假", "海岛"],
    color: "#00CED1",
    category: "海岛度假",
    wuxing: "水",
    title: "阳光收集者",
    healing: "面朝大海，春暖花开。",
    luckyColor: "蓝色",
    luckyNumber: "9",
    luckyThing: "海滩"
  },
  "厦门": {
    emoji: "🌴",
    description: "海岛小清新，文艺之城",
    detail: "环岛路骑行、鼓浪屿听琴、中山路逛吃。厦门的浪漫藏在每一处细节里！",
    tags: ["文艺", "浪漫", "海岛"],
    color: "#20B2AA",
    category: "海岛度假",
    wuxing: "木",
    title: "文艺漫游者",
    healing: "慢慢走，欣赏啊。",
    luckyColor: "绿色",
    luckyNumber: "5",
    luckyThing: "海风"
  },
  "北海": {
    emoji: "🏖️",
    description: "滨海风情，疍家文化",
    detail: "银滩踏浪、涠洲岛看火山、侨港吃海鲜。北海是未被过度开发的静谧海岸！",
    tags: ["宁静", "原生态", "海鲜"],
    color: "#40E0D0",
    category: "海岛度假",
    wuxing: "水",
    title: "宁静追光者",
    healing: "宁静致远，淡泊明志。",
    luckyColor: "青色",
    luckyNumber: "2",
    luckyThing: "浪花"
  },
  "普吉岛": {
    emoji: "🏝️",
    description: "泰式风情，海岛天堂",
    detail: "芭东海滩的热闹、皮皮岛的宁静、皇帝岛的潜水。普吉岛是东南亚度假的首选！",
    tags: ["出境", "度假", "海岛"],
    color: "#FF69B4",
    category: "海岛度假",
    wuxing: "水",
    title: "世界漫游家",
    healing: "世界很大，值得去看看。",
    luckyColor: "紫色",
    luckyNumber: "4",
    luckyThing: "海岛"
  },
  // 冰雪奇缘
  "哈尔滨": {
    emoji: "🏰",
    description: "冰雪世界，童话王国",
    detail: "漫步在中央大街，感受俄式风情；到索菲亚教堂打卡；去冰雪大世界看冰灯展！",
    tags: ["冰雪", "浪漫", "异域"],
    color: "#87CEEB",
    category: "冰雪奇缘",
    wuxing: "水",
    title: "冰雪诗人",
    healing: "所有美好都会如约而至。",
    luckyColor: "白色",
    luckyNumber: "1",
    luckyThing: "雪花"
  },
  "雪乡": {
    emoji: "❄️",
    description: "童话世界，冰雪奇缘",
    detail: "厚厚的雪蘑菇、浪漫的雪景房、夜晚的红灯笼。这里是东北雪景的精华所在！",
    tags: ["冰雪", "童话", "拍照"],
    color: "#E0FFFF",
    category: "冰雪奇缘",
    wuxing: "水",
    title: "童话造梦师",
    healing: "保持童心，世界很美好。",
    luckyColor: "银色",
    luckyNumber: "6",
    luckyThing: "雪人"
  },
  "长白山": {
    emoji: "🗻",
    description: "雪域圣山，滑雪天堂",
    detail: "天池观景、滑雪场飞驰、温泉里赏雪。长白山让你的冬天不再单调！",
    tags: ["冰雪", "滑雪", "温泉"],
    color: "#B0E0E6",
    category: "冰雪奇缘",
    wuxing: "金",
    title: "极限挑战者",
    healing: "挑战自我，超越极限。",
    luckyColor: "蓝色",
    luckyNumber: "8",
    luckyThing: "滑雪"
  },
  // 西南秘境
  "大理": {
    emoji: "🌸",
    description: "风花雪月，苍山洱海",
    detail: "环洱海骑行、苍山徒步、古城看云。大理是疗愈心灵的最佳目的地！",
    tags: ["疗愈", "自然", "文艺"],
    color: "#DDA0DD",
    category: "西南秘境",
    wuxing: "木",
    title: "灵魂摆渡人",
    healing: "慢下来，等等自己的灵魂。",
    luckyColor: "紫色",
    luckyNumber: "7",
    luckyThing: "洱海"
  },
  "丽江": {
    emoji: "🏔️",
    description: "艳遇古城，浪漫时光",
    detail: "漫步古城石板路、爬玉龙雪山、束河古镇发发呆。这里是寻找艳遇和放松的最佳目的地！",
    tags: ["古城", "浪漫", "雪山"],
    color: "#9370DB",
    category: "西南秘境",
    wuxing: "火",
    title: "浪漫寻梦人",
    healing: "艳遇不如悦己。",
    luckyColor: "红色",
    luckyNumber: "5",
    luckyThing: "雪山"
  },
  "桂林": {
    emoji: "⛰️",
    description: "山水甲天下，诗意桂林",
    detail: "漓江竹筏、象鼻山打卡、阳朔西街。桂林山水甲天下，绝美风光等你来！",
    tags: ["山水", "诗意", "喀斯特"],
    color: "#66CDAA",
    category: "西南秘境",
    wuxing: "木",
    title: "山水画家",
    healing: "人在画中游，画在心中留。",
    luckyColor: "绿色",
    luckyNumber: "3",
    luckyThing: "竹筏"
  },
  "阳朔": {
    emoji: "🎋",
    description: "山水田园，诗意阳朔",
    detail: "十里画廊骑行、遇龙河竹筏、银子岩探秘。阳朔的田园风光让人流连忘返！",
    tags: ["田园", "骑行", "山水"],
    color: "#9ACD32",
    category: "西南秘境",
    wuxing: "木",
    title: "田园诗人",
    healing: "岁月静好，现世安稳。",
    luckyColor: "黄色",
    luckyNumber: "9",
    luckyThing: "骑行"
  },
  // 历史文化
  "西安": {
    emoji: "🏯",
    description: "千年古都，盛世长安",
    detail: "登城墙、逛兵马俑，回民街吃泡馍。新年感受大唐盛世的文化底蕴！",
    tags: ["历史", "文化", "美食"],
    color: "#CD853F",
    category: "历史文化",
    wuxing: "土",
    title: "历史考古家",
    healing: "读史使人明智。",
    luckyColor: "棕色",
    luckyNumber: "4",
    luckyThing: "城墙"
  },
  "北京": {
    emoji: "🏯",
    description: "首都气象，皇家风范",
    detail: "逛故宫、登长城、颐和园赏雪。北京的庄严与厚重，值得细细品味！",
    tags: ["历史", "文化", "首都"],
    color: "#B22222",
    category: "历史文化",
    wuxing: "土",
    title: "京华烟云客",
    healing: "岁月沉淀的都是精华。",
    luckyColor: "红色",
    luckyNumber: "1",
    luckyThing: "长城"
  },
  "南京": {
    emoji: "🏛️",
    description: "六朝古都，厚重历史",
    detail: "中山陵追忆、夫子庙逛吃、玄武湖漫步。南京的历史藏在每一条街道！",
    tags: ["历史", "文化", "民国"],
    color: "#8B4513",
    category: "历史文化",
    wuxing: "火",
    title: "时光旅行者",
    healing: "一切都是最好的安排。",
    luckyColor: "深红",
    luckyNumber: "6",
    luckyThing: "梧桐"
  },
  "洛阳": {
    emoji: "🏺",
    description: "十三朝古都，牡丹花城",
    detail: "龙门石窟探秘、白马寺祈福、丽景门怀古。洛阳的年味从正月开始！",
    tags: ["历史", "文化", "牡丹"],
    color: "#D2691E",
    category: "历史文化",
    wuxing: "土",
    title: "文化传承者",
    healing: "中华文化，博大精深。",
    luckyColor: "粉色",
    luckyNumber: "8",
    luckyThing: "牡丹"
  },
  // 江南诗意
  "杭州": {
    emoji: "🏙️",
    description: "西湖美景，江南诗意",
    detail: "断桥残雪、雷峰塔望湖、龙井问茶。杭州的诗意藏在山水之间，新年祈福好去处！",
    tags: ["诗意", "山水", "休闲"],
    color: "#3CB371",
    category: "江南诗意",
    wuxing: "水",
    title: "江南诗意客",
    healing: "偷得浮生半日闲。",
    luckyColor: "绿色",
    luckyNumber: "2",
    luckyThing: "西湖"
  },
  "苏州": {
    emoji: "🏡",
    description: "园林水乡，江南典范",
    detail: "游拙政园、逛平江路、听评弹、坐游船。苏州的精致让人沉醉！",
    tags: ["园林", "水乡", "诗意"],
    color: "#8FBC8F",
    category: "江南诗意",
    wuxing: "木",
    title: "园林收藏家",
    healing: "精致生活，从容以对。",
    luckyColor: "青色",
    luckyNumber: "5",
    luckyThing: "园林"
  },
  "乌镇": {
    emoji: "🛶",
    description: "枕水人家，梦里水乡",
    detail: "东栅晨雾、西栅夜景、木心美术馆。乌镇的慢时光让人忘记时间！",
    tags: ["水乡", "古镇", "文艺"],
    color: "#DEB887",
    category: "江南诗意",
    wuxing: "水",
    title: "水乡梦旅人",
    healing: "从前慢，车马邮件都慢。",
    luckyColor: "米色",
    luckyNumber: "3",
    luckyThing: "乌篷船"
  },
  "周庄": {
    emoji: "🌾",
    description: "第一水乡，江南烟雨",
    detail: "双桥映月、沈厅探富、夜游水巷。周庄是江南水乡的代表作！",
    tags: ["水乡", "古镇", "烟雨"],
    color: "#F4A460",
    category: "江南诗意",
    wuxing: "水",
    title: "烟雨画中人",
    healing: "烟雨江南，如诗如画。",
    luckyColor: "暖黄",
    luckyNumber: "7",
    luckyThing: "油纸伞"
  }
};

const cityList = Object.keys(cities);

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

module.exports = {
  questions,
  cities,
  cityList,
  fiveElementData,
  healingQuotes
};
