// pages/result/result.js
const { calculateResult, getCityDetail } = require('../../utils/calculator.js');

Page({
  data: {
    result: null,
    cityDetail: null,
    showResult: false
  },

  onLoad() {
    // 获取用户答案
    const answers = wx.getStorageSync('answers') || [];

    if (answers.length === 0) {
      // 没有答案，跳转到首页
      wx.redirectTo({
        url: '/pages/index/index'
      });
      return;
    }

    // 计算结果
    const result = calculateResult(answers);
    const cityDetail = getCityDetail(result.city);

    this.setData({
      result: result,
      cityDetail: cityDetail,
      showResult: true
    });
  },

  onReady() {
    // 隐藏分享按钮
    wx.hideShareMenu();
  },

  onShareAppMessage() {
    const { cityDetail } = this.data;
    return {
      title: `我的新年旺城是${cityDetail ? cityDetail.description : '杭州'}，快来测测你的！`,
      path: '/pages/index/index',
      imageUrl: '/images/share-bg.png' // 可以配置分享图片
    };
  },

  // 重新测试
  restartTest() {
    wx.removeStorageSync('answers');
    wx.removeStorageSync('testResult');

    wx.redirectTo({
      url: '/pages/index/index'
    });
  },

  // 保存到相册（生成海报）
  savePoster() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 复制结果文案
  copyResult() {
    const { result, cityDetail } = this.data;
    const text = `🎉 2026新年旺旺测试结果 🎉\n\n我的开年旅游地是：【${result.city}】\n${cityDetail.description}\n\n${cityDetail.detail}\n\n🧧 新年行大运，快来测测你的！`;

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  }
})
