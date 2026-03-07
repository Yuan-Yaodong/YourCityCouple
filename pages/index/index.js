// pages/index/index.js
const { trackEvent } = require('../../utils/analytics.js');
const { healingQuotes } = require('../../utils/data.js');

Page({
  data: {
    hasUserInfo: false,
    hasHistory: false,
    historyCity: '',
    dailyQuote: '',
    dailyMission: '',
    recentHistory: [],
    ritualStreakDays: 0,
    ritualLastCity: ''
  },

  onLoad() {
    trackEvent('app_open');
    this.refreshHomeData();
  },

  onShow() {
    this.refreshHomeData();
  },

  startTest() {
    trackEvent('test_start');

    // 清除旧数据，重新开始
    wx.removeStorageSync('answers');
    wx.removeStorageSync('testResult');

    wx.navigateTo({
      url: '/pages/quiz/quiz'
    });
  },

  continueLastResult() {
    trackEvent('return_user_open_last_result');
    wx.navigateTo({
      url: '/pages/result/result'
    });
  },

  openInsights() {
    trackEvent('open_insights');
    wx.navigateTo({
      url: '/pages/insights/insights'
    });
  },

  openHistoryResult(e) {
    const index = Number(e.currentTarget.dataset.index);
    const history = this.data.recentHistory || [];
    const selected = history[index];
    if (!selected || !selected.city) return;
    wx.setStorageSync('testResult', {
      city: selected.city,
      summary: selected.summary || '',
      ts: selected.ts || Date.now()
    });
    trackEvent('open_history_result', { city: selected.city, index });
    wx.navigateTo({
      url: '/pages/result/result'
    });
  },

  refreshHomeData() {
    const dailyQuote = this.getDailyQuote();
    const result = wx.getStorageSync('testResult');
    const history = wx.getStorageSync('historyResults') || [];
    const anchorCity = (result && result.city) || (Array.isArray(history) && history[0] ? history[0].city : '');
    const dailyMission = this.getDailyMission(anchorCity);
    const ritualRecord = wx.getStorageSync('dailyRitual') || {};
    const streakInfo = this.getRitualStreak(ritualRecord);
    const recentHistory = Array.isArray(history)
      ? history.slice(0, 3).map((item) => ({
          city: item.city,
          summary: item.summary || '',
          ts: item.ts,
          displayTime: this.formatDate(item.ts)
        }))
      : [];

    this.setData({
      hasHistory: !!(result && result.city),
      historyCity: result && result.city ? result.city : '',
      dailyQuote,
      dailyMission,
      recentHistory,
      ritualStreakDays: streakInfo.days,
      ritualLastCity: streakInfo.lastCity
    });
  },

  getDailyQuote() {
    if (!Array.isArray(healingQuotes) || healingQuotes.length === 0) {
      return '今天也要好好爱自己。';
    }
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return healingQuotes[dayOfYear % healingQuotes.length];
  },

  getDailyMission(city) {
    const missions = [
      city ? `打开地图收藏一个「${city}」相关地点` : '打开地图收藏一个想去的城市地点',
      '给自己留 20 分钟慢节奏时间，不刷短视频',
      '把今天最开心的一件小事写进备忘录',
      '主动给一个重要的人发一句问候',
      '喝一杯热饮，告诉自己“今天也很棒”'
    ];
    const now = new Date();
    const daySeed = now.getFullYear() * 1000 + now.getMonth() * 31 + now.getDate();
    const citySeed = (city || '').length;
    return missions[(daySeed + citySeed) % missions.length];
  },

  copyDailyCard() {
    const city = this.data.historyCity || '未知城市';
    const text = [
      '【今日好运卡】',
      `今日好运签：${this.data.dailyQuote}`,
      `今日好运任务：${this.data.dailyMission}`,
      this.data.hasHistory ? `我的最近好运城市：${city}` : '我还在探索我的好运城市',
      `连续点亮：${this.data.ritualStreakDays} 天`
    ].join('\n');
    wx.setClipboardData({
      data: text,
      success: () => {
        trackEvent('copy_daily_card', {
          city,
          streak: this.data.ritualStreakDays
        });
        wx.showToast({ title: '好运卡已复制', icon: 'success' });
      }
    });
  },

  formatDate(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${m}-${day} ${hh}:${mm}`;
  },

  getRitualStreak(ritualRecord) {
    const keys = Object.keys(ritualRecord || {}).sort();
    if (keys.length === 0) {
      return { days: 0, lastCity: '' };
    }

    let days = 0;
    let cursor = new Date();
    while (true) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, '0');
      const d = String(cursor.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${d}`;
      if (!ritualRecord[key]) break;
      days += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const lastKey = keys[keys.length - 1];
    return {
      days,
      lastCity: ritualRecord[lastKey] || ''
    };
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
