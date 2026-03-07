// pages/quiz/quiz.js
const { questions } = require('../../utils/data.js');
const { trackEvent } = require('../../utils/analytics.js');

const encouragementMap = [
  ['火力全开，状态拉满！', '品味在线，生活感知力很强！', '精致感拉满，审美很稳！', '爽快直接，气场很足！', '清爽克制，节奏很高级！', '自律温柔，你很会照顾自己！'],
  ['会玩会逛，镜头感超强！', '很会享受，松弛感拿捏了！', '冒险值爆表，勇气满分！', '节奏舒服，你很会生活！', '照顾型人格上线，超靠谱！', '社交电量满格，气氛王！'],
  ['你有自己的舒适区，很棒！', '阳光心态，能量很正！', '平衡能力很强，稳稳的！', '诗意感知力上线，超会感受！', '海风体质，心态很通透！', '高原晴空感，灵魂很自由！'],
  ['你很会捕捉美好瞬间！', '人间烟火鉴赏家就是你！', '你很懂得照顾自己！', '你的精神世界很丰富！', '理性又务实，生活掌控感在线！', '缘分感知力很强，链接能力优秀！'],
  ['你自带节日氛围感！', '浪漫雷达已开启！', '松弛感天花板！', '挑战精神满分！', '治愈力很强，和你相处很舒服！', '开运磁场启动，今天会有惊喜！'],
  ['幸福感优先，很会爱自己！', '目标感很强，执行力在线！', '健康意识拉满，超赞！', '逆风翻盘气质，冲就对了！', '成长心态在线，潜力很强！', '重视家人与关系，稳定感满分！'],
  ['财运频道已连接，气场很稳！', '缘分磁场拉满，今天会有惊喜！', '探索模式激活，勇气值在线！', '疗愈系统启动，心态很高级！', '文脉能量加成，灵感稳定输出！', '人间烟火值上升，生活会更有滋味！'],
  ['你很会找搭子，社交雷达灵敏！', '你和温柔世界双向奔赴！', '慢生活审美在线，超级会选！', '文化浓度拉满，灵魂很有厚度！', '共创力很强，表达欲和行动力都在线！', '挑战默契拉满，跟你组队很爽！'],
  ['结构感很强，做事很稳！', '审美和感受力都很在线！', '行动派气质拉满，冲劲十足！', '社交张力很强，容易被喜欢！', '观察力细腻，情绪管理优秀！', '文化理解力很深，格局感很强！'],
  ['开运信号很强，状态向上！', '执行力+转运力双加成！', '稳健搞钱思维，长期主义选手！', '缘分运势在线，磁场很柔和！', '疗愈频段打开，心态非常稳！', '安定能量充足，抗压性很强！']
];
const luckySigns = [
  '好运签：今天适合做一个小决定，往往会有意外惊喜。',
  '好运签：你最近的选择会把你带到更轻松的状态。',
  '好运签：一个主动的问候，会带来不错的缘分。',
  '好运签：今天的你，适合开始一件想了很久的小事。'
];

Page({
  data: {
    currentQuestion: 0,
    totalQuestions: questions.length,
    question: {},
    questionSourceText: '',
    answers: [],
    progressPercent: 0,
    selectedIndex: -1,
    animating: false,
    questionStartAt: 0,
    showedLuckySign: false,
    hasCompleted: false
  },

  onLoad() {
    // 初始化或读取已有答案
    const savedAnswers = wx.getStorageSync('answers');
    const answers = savedAnswers || [];

    const safeAnsweredCount = Math.min(answers.length, questions.length - 1);
    if (answers.length >= questions.length) {
      wx.redirectTo({ url: '/pages/result/result' });
      return;
    }
    this.setData({
      answers: answers,
      currentQuestion: safeAnsweredCount,
      question: questions[safeAnsweredCount] || questions[0],
      questionSourceText: this.buildQuestionSourceText(safeAnsweredCount, answers),
      progressPercent: (safeAnsweredCount / questions.length) * 100,
      questionStartAt: Date.now(),
      selectedIndex: answers[safeAnsweredCount] !== undefined ? answers[safeAnsweredCount] : -1
    });

    if (answers.length > 0 && answers.length < questions.length) {
      trackEvent('quiz_resume', {
        answeredCount: answers.length,
        totalQuestions: questions.length
      });
    }

    // 隐藏分享按钮
    wx.hideShareMenu();
  },

  onUnload() {
    if (this.data.hasCompleted) return;
    const answers = wx.getStorageSync('answers') || [];
    trackEvent('quiz_drop_at_question', {
      currentQuestion: this.data.currentQuestion,
      answeredCount: Array.isArray(answers) ? answers.length : 0,
      totalQuestions: this.data.totalQuestions
    });
  },

  onShareAppMessage() {
    return {
      title: '2026新年旺旺 - 测测你的开年旅游地',
      path: '/pages/index/index'
    };
  },

  // 选择答案
  selectOption(e) {
    if (this.data.animating) return;

    const index = e.currentTarget.dataset.index;
    this.setData({ selectedIndex: index });
    this.showEncouragement(this.data.currentQuestion, index);
    this.maybeShowLuckySign(this.data.currentQuestion, index);

    // 动画效果后进入下一题
    this.setData({ animating: true });

    setTimeout(() => {
      this.nextQuestion(index);
    }, 300);
  },

  // 进入下一题
  nextQuestion(selectedIndex) {
    const { currentQuestion, totalQuestions, answers } = this.data;
    const elapsedMs = Date.now() - (this.data.questionStartAt || Date.now());
    trackEvent('question_answered', {
      questionIndex: currentQuestion,
      optionIndex: selectedIndex,
      elapsedMs
    });

    // 保存答案。若是返回修改题目，则覆盖当前答案并截断后续，避免脏状态。
    const newAnswers = answers.slice(0, currentQuestion);
    if (answers[currentQuestion] !== undefined && answers[currentQuestion] !== selectedIndex) {
      trackEvent('answer_change', {
        questionIndex: currentQuestion,
        fromOption: answers[currentQuestion],
        toOption: selectedIndex
      });
    }
    newAnswers[currentQuestion] = selectedIndex;
    wx.setStorageSync('answers', newAnswers);
    this.setData({ answers: newAnswers });

    // 判断是否完成
    if (currentQuestion >= totalQuestions - 1) {
      this.setData({ hasCompleted: true });
      trackEvent('test_complete', {
        questionCount: totalQuestions
      });
      // 测试完成，跳转结果页
      wx.redirectTo({
        url: '/pages/result/result'
      });
      return;
    }

    // 进入下一题 - 先滑出当前题目
    this.setData({ slideDirection: 'slide-out' });

    setTimeout(() => {
      const nextQ = currentQuestion + 1;
      this.setData({
        currentQuestion: nextQ,
        question: questions[nextQ],
        questionSourceText: this.buildQuestionSourceText(nextQ, newAnswers),
        progressPercent: (nextQ / totalQuestions) * 100,
        selectedIndex: newAnswers[nextQ] !== undefined ? newAnswers[nextQ] : -1,
        slideDirection: 'slide-in',
        questionStartAt: Date.now()
      });

      // 滑入完成后清除动画类
      setTimeout(() => {
        this.setData({ slideDirection: '', animating: false });
      }, 300);
    }, 300);
  },

  prevQuestion() {
    if (this.data.animating || this.data.currentQuestion <= 0) return;
    const prevQ = this.data.currentQuestion - 1;
    const answers = wx.getStorageSync('answers') || this.data.answers || [];
    this.setData({
      currentQuestion: prevQ,
      question: questions[prevQ],
      questionSourceText: this.buildQuestionSourceText(prevQ, answers),
      progressPercent: (prevQ / this.data.totalQuestions) * 100,
      selectedIndex: answers[prevQ] !== undefined ? answers[prevQ] : -1,
      questionStartAt: Date.now()
    });
    trackEvent('quiz_prev_question', { currentQuestion: prevQ });
  },

  buildQuestionSourceText(questionIndex, answers) {
    if (questionIndex !== 6) return '';
    const history = Array.isArray(answers) ? answers : [];
    const baseAnswers = history.slice(0, 6);
    const base = `yc_${questionIndex}_${baseAnswers.join('-')}`;
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = (hash << 5) - hash + base.charCodeAt(i);
      hash |= 0;
    }
    const seq = Math.abs(hash);
    if (questionIndex === 6) {
      const signLabels = ['财神协议签', '桃花共振签', '冒险开挂签', '云端疗愈签', '古运文脉签', '人间烟火签'];
      const sign = signLabels[seq % signLabels.length];
      const energy = 60 + (seq % 40);
      return `赛博算命来源：系统仅基于你前6题的本地偏好向量计算，主签建议「${sign}」，当前能量值 ${energy}（同样答案下固定不变）。`;
    }
  },

  showEncouragement(questionIndex, optionIndex) {
    const row = encouragementMap[questionIndex] || [];
    const text = row[optionIndex] || '已记录你的选择，继续探索你的缘分城市';
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 900
    });
  },

  maybeShowLuckySign(questionIndex, optionIndex) {
    if (this.data.showedLuckySign) return;
    // 第3题作答后触发一次彩蛋
    if (questionIndex !== 2) return;
    const daySeed = new Date().getDate();
    const sign = luckySigns[(questionIndex + optionIndex + daySeed) % luckySigns.length];
    this.setData({ showedLuckySign: true });
    setTimeout(() => {
      wx.showModal({
        title: '🎴 好运签',
        content: sign,
        showCancel: false,
        confirmText: '收下好运'
      });
      trackEvent('lucky_sign_popup', { questionIndex });
    }, 120);
  }
})
