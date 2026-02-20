// pages/index/index.js
Page({
  data: {
    hasUserInfo: false
  },

  onLoad() {
    // 检查是否已有缓存的测试结果
    const result = wx.getStorageSync('testResult');
    if (result) {
      // 已有测试结果，跳转到结果页
      wx.redirectTo({
        url: '/pages/result/result'
      });
    }
  },

  startTest() {
    // 清除旧数据，重新开始
    wx.removeStorageSync('answers');
    wx.removeStorageSync('testResult');

    wx.navigateTo({
      url: '/pages/quiz/quiz'
    });
  },

  // 用户授权（可选）
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于展示',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  }
})
