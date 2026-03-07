// pages/quiz/quiz.js
const { questions } = require('../../utils/data.js');
const { trackEvent } = require('../../utils/analytics.js');

const encouragementMap = [
  ['火力全开，状态拉满！', '品味在线，生活感知力很强！', '精致感拉满，审美很稳！', '爽快直接，气场很足！'],
  ['会玩会逛，镜头感超强！', '很会享受，松弛感拿捏了！', '冒险值爆表，勇气满分！', '节奏舒服，你很会生活！'],
  ['你有自己的舒适区，很棒！', '阳光心态，能量很正！', '平衡能力很强，稳稳的！', '诗意感知力上线，超会感受！'],
  ['你很会捕捉美好瞬间！', '人间烟火鉴赏家就是你！', '你很懂得照顾自己！', '你的精神世界很丰富！'],
  ['你自带节日氛围感！', '浪漫雷达已开启！', '松弛感天花板！', '挑战精神满分！'],
  ['幸福感优先，很会爱自己！', '目标感很强，执行力在线！', '健康意识拉满，超赞！', '逆风翻盘气质，冲就对了！']
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
      progressPercent: (prevQ / this.data.totalQuestions) * 100,
      selectedIndex: answers[prevQ] !== undefined ? answers[prevQ] : -1,
      questionStartAt: Date.now()
    });
    trackEvent('quiz_prev_question', { currentQuestion: prevQ });
  },

  showEncouragement(questionIndex, optionIndex) {
    const row = encouragementMap[questionIndex] || [];
    const text = row[optionIndex];
    if (!text) return;
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
