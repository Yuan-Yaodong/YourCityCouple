// pages/quiz/quiz.js
const { questions } = require('../../utils/data.js');

Page({
  data: {
    currentQuestion: 0,
    totalQuestions: 5,
    question: {},
    answers: [],
    progressPercent: 0,
    selectedIndex: -1,
    animating: false
  },

  onLoad() {
    // 初始化或读取已有答案
    const savedAnswers = wx.getStorageSync('answers');
    const answers = savedAnswers || [];

    this.setData({
      answers: answers,
      currentQuestion: answers.length,
      question: questions[answers.length] || questions[0],
      progressPercent: (answers.length / questions.length) * 100
    });

    // 隐藏分享按钮
    wx.hideShareMenu();
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

    // 动画效果后进入下一题
    this.setData({ animating: true });

    setTimeout(() => {
      this.nextQuestion(index);
    }, 300);
  },

  // 进入下一题
  nextQuestion(selectedIndex) {
    const { currentQuestion, totalQuestions, answers } = this.data;

    // 保存答案
    const newAnswers = [...answers, selectedIndex];
    wx.setStorageSync('answers', newAnswers);

    // 判断是否完成
    if (currentQuestion >= totalQuestions - 1) {
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
        progressPercent: ((nextQ + 1) / totalQuestions) * 100,
        selectedIndex: -1,
        slideDirection: 'slide-in'
      });

      // 滑入完成后清除动画类
      setTimeout(() => {
        this.setData({ slideDirection: '', animating: false });
      }, 300);
    }, 300);
  }
})
