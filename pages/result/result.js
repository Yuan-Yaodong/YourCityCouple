// pages/result/result.js
const { calculateResult, getCityDetail, calculateFiveElement } = require('../../utils/calculator.js');
const { analyzeUserPreferences } = require('../../utils/analyzer.js');
const { calculateMBTI } = require('../../utils/mbti.js');
const { healingQuotes, questions } = require('../../utils/data.js');
const { trackEvent, assignVariant } = require('../../utils/analytics.js');

// 海报模板配置
const posterTemplates = [
  {
    id: 'classic',
    name: '经典中国风',
    bgColors: ['#FFE4B5', '#F5DEB3', '#FFEFD5'],
    accentColor: '#FFD700',
    textColor: '#8B0000',
    emoji: '🧧'
  },
  {
    id: 'festive',
    name: '喜庆红',
    bgColors: ['#FFF0F5', '#FFE4E1', '#FFDAB9'],
    accentColor: '#DC143C',
    textColor: '#8B0000',
    emoji: '🎊'
  },
  {
    id: 'elegant',
    name: '雅致金',
    bgColors: ['#FDF5E6', '#FAF0E6', '#FFFAFA'],
    accentColor: '#DAA520',
    textColor: '#2F4F4F',
    emoji: '🏮'
  }
];

// 城市分类专属配色
const cityCategoryColors = {
  '火热美食': { bg: '#FFF5EE', accent: '#FF6347', text: '#8B4513', emoji: '🍜' },
  '海岛度假': { bg: '#E0FFFF', accent: '#00CED1', text: '#008B8B', emoji: '🏝️' },
  '冰雪奇缘': { bg: '#F0F8FF', accent: '#87CEEB', text: '#4682B4', emoji: '❄️' },
  '西南秘境': { bg: '#F5F5DC', accent: '#9ACD32', text: '#556B2F', emoji: '🏔️' },
  '历史文化': { bg: '#FAF0E6', accent: '#D2691E', text: '#8B4513', emoji: '🏯' },
  '江南诗意': { bg: '#F0FFF0', accent: '#3CB371', text: '#2E8B57', emoji: '🌿' }
};

function getPosterTemplate() {
  return posterTemplates[Math.floor(Math.random() * posterTemplates.length)];
}

function getCityCategoryColor(cityDetail) {
  const category = cityDetail && cityDetail.category ? cityDetail.category : '';
  return cityCategoryColors[category] || cityCategoryColors['火热美食'];
}

Page({
  data: {
    result: null,
    cityDetail: null,
    analysis: null,
    displayWhyFit: [],
    runnerUpCity: null,
    compareText: '',
    coreSummaryText: '',
    questionCount: 0,
    shareVariant: 'warm',
    actionOrder: 'share_first',
    dailyQuote: '',
    dailyRitualDone: false,
    dailyRitualText: '',
    ritualStreakDays: 0,
    showExtendedDetails: false,
    fiveElementLuckyColorsText: '',
    fiveElementLuckyNumbersText: '',
    luckyPlan: null,
    mbti: null,
    fiveElement: null,
    zodiacProfile: null,
    showResult: false,
    showAnimations: false,
    posterGenerated: false,
    posterImage: '',
    showPosterModal: false
  },

  onLoad() {
    // 获取用户答案
    const answers = wx.getStorageSync('answers') || [];

    if (answers.length === 0) {
      const loaded = this.loadFromCacheResult();
      if (!loaded) {
        // 没有答案且没有历史结果，跳转到首页
        wx.redirectTo({
          url: '/pages/index/index'
        });
      }
      return;
    }

    // 计算结果
    const result = calculateResult(answers);
    const cityDetail = getCityDetail(result.city);

    // 分析用户偏好
    const analysis = analyzeUserPreferences(answers, result.city);

    // 计算MBTI旅行人格
    const mbti = calculateMBTI(answers);

    // 计算五行属性
    const fiveElement = calculateFiveElement(answers);
    const displayWhyFit = this.getDisplayWhyFit(analysis.whyFit);
    const runnerUpCity = result.runnerUp ? getCityDetail(result.runnerUp.city) : null;
    const compareText = this.getCompareText(result.city);
    const historySummary = this.getHistorySummary(result.city);
    const shareVariant = assignVariant('share_copy_v2', ['warm', 'direct', 'relation']) || 'warm';
    const actionOrder = assignVariant('result_button_order_v1', ['share_first', 'restart_first']) || 'share_first';
    const dailyQuote = this.getDailyQuote(result.city);
    const ritualKey = this.getTodayRitualKey();
    const ritualRecord = wx.getStorageSync('dailyRitual') || {};
    const dailyRitualDone = ritualRecord[ritualKey] === result.city;
    const ritualStreakDays = this.getRitualStreakDays(ritualRecord);

    const luckyPlan = this.buildLuckyPlan(cityDetail, fiveElement);
    const baseFiveElementNumbers = fiveElement && fiveElement.detail && Array.isArray(fiveElement.detail.luckyNumbers)
      ? fiveElement.detail.luckyNumbers.map((n) => String(n))
      : [];
    const normalizedMainNumber = luckyPlan && luckyPlan.number ? String(luckyPlan.number) : '';
    const mergedFiveElementNumbers = normalizedMainNumber
      ? [normalizedMainNumber].concat(baseFiveElementNumbers.filter((n) => n !== normalizedMainNumber))
      : baseFiveElementNumbers;

    this.setData({
      result: result,
      cityDetail: cityDetail,
      analysis: analysis,
      displayWhyFit: displayWhyFit,
      runnerUpCity: runnerUpCity,
      compareText: compareText,
      historySummary: historySummary,
      coreSummaryText: analysis && analysis.summary
        ? analysis.summary
        : `${result.city}很适合你当前的节奏，先分享给朋友看看吧。`,
      questionCount: Array.isArray(questions) ? questions.length : 14,
      shareVariant: shareVariant,
      actionOrder,
      dailyQuote: dailyQuote,
      dailyRitualDone: dailyRitualDone,
      dailyRitualText: dailyRitualDone
        ? this.buildRitualEncouragement(ritualStreakDays)
        : '点亮今日好运，给自己一个好开始',
      ritualStreakDays,
      showExtendedDetails: false,
      fiveElementLuckyColorsText: fiveElement && fiveElement.detail && Array.isArray(fiveElement.detail.luckyColors)
        ? fiveElement.detail.luckyColors.join('、')
        : '',
      fiveElementLuckyNumbersText: mergedFiveElementNumbers.join('、'),
      luckyPlan,
      mbti: mbti,
      fiveElement: fiveElement,
      zodiacProfile: result.zodiacProfile || null,
      personalityInsight: analysis && analysis.personalityInsight ? analysis.personalityInsight : null,
      showResult: true
    });

    this.saveResultHistory(result.city, analysis ? analysis.summary : '');
    trackEvent('result_view', {
      city: result.city,
      variant: shareVariant,
      actionOrder
    });

    // 延迟触发动画
    setTimeout(() => {
      this.setData({ showAnimations: true });
    }, 100);
  },

  loadFromCacheResult() {
    const latest = wx.getStorageSync('testResult');
    if (!latest || !latest.city) return false;
    const cityDetail = getCityDetail(latest.city);
    if (!cityDetail) return false;

    const shareVariant = assignVariant('share_copy_v2', ['warm', 'direct', 'relation']) || 'warm';
    const actionOrder = assignVariant('result_button_order_v1', ['share_first', 'restart_first']) || 'share_first';
    const historySummary = this.getHistorySummary(latest.city);
    this.setData({
      result: { city: latest.city, score: 0, runnerUp: null },
      cityDetail,
      analysis: null,
      displayWhyFit: [],
      runnerUpCity: null,
      compareText: '这是你上次保存的结果，重新测试可获得最新分析。',
      historySummary: historySummary,
      coreSummaryText: latest.summary || `${latest.city}很适合你当前的状态，重新测试可获得完整解析。`,
      questionCount: Array.isArray(questions) ? questions.length : 14,
      shareVariant,
      actionOrder,
      dailyQuote: this.getDailyQuote(latest.city),
      dailyRitualDone: false,
      dailyRitualText: '重新测试后可点亮今日好运',
      showExtendedDetails: false,
      fiveElementLuckyColorsText: '',
      fiveElementLuckyNumbersText: '',
      luckyPlan: null,
      mbti: null,
      fiveElement: null,
      zodiacProfile: null,
      personalityInsight: null,
      showResult: true
    });
    trackEvent('result_view_from_cache', { city: latest.city, actionOrder });
    setTimeout(() => {
      this.setData({ showAnimations: true });
    }, 100);
    return true;
  },

  onReady() {
    // 开启原生分享入口，提升自然传播
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    const { cityDetail, result, shareVariant } = this.data;
    let title = `我测到的新年旺城是${cityDetail ? cityDetail.description : '杭州'}，快来测测你的！`;
    if (shareVariant === 'direct') {
      title = `${this.data.questionCount || 14}题测出开年旺城，我是${result ? result.city : '杭州'}，你来试试？`;
    } else if (shareVariant === 'relation') {
      title = `我测到了${result ? result.city : '杭州'}，你也测测看我们是不是同路人？`;
    }
    trackEvent('share_app_message', {
      variant: shareVariant,
      city: result ? result.city : ''
    });
    return {
      title,
      path: '/pages/index/index',
      imageUrl: '/images/share-bg.png' // 可以配置分享图片
    };
  },

  onShareTimeline() {
    const { result, shareVariant } = this.data;
    trackEvent('share_timeline', {
      variant: shareVariant,
      city: result ? result.city : ''
    });
    return {
      title: shareVariant === 'direct'
        ? `我的开年旺城是${result ? result.city : '杭州'}，你也来测一个`
        : shareVariant === 'relation'
          ? `我测到${result ? result.city : '杭州'}，你看看我们是不是同一挂`
          : `新年运势小测试：${this.data.questionCount || 14}题测出你的开年旺城`
    };
  },

  // 重新测试
  restartTest() {
    trackEvent('click_restart_test', {
      city: this.data.result ? this.data.result.city : '',
      actionOrder: this.data.actionOrder,
      variant: this.data.shareVariant
    });
    wx.removeStorageSync('answers');
    wx.removeStorageSync('testResult');

    wx.redirectTo({
      url: '/pages/index/index'
    });
  },

  onTapShareButton() {
    trackEvent('click_wechat_share_button', {
      city: this.data.result ? this.data.result.city : '',
      actionOrder: this.data.actionOrder,
      variant: this.data.shareVariant
    });
  },

  toggleExtendedDetails() {
    const next = !this.data.showExtendedDetails;
    this.setData({ showExtendedDetails: next });
    trackEvent('toggle_result_details', {
      open: next,
      city: this.data.result ? this.data.result.city : ''
    });
  },

  // 生成海报
  generatePoster() {
    const template = getPosterTemplate();
    const cityColor = getCityCategoryColor(this.data.cityDetail);
    trackEvent('click_generate_poster', {
      city: this.data.result ? this.data.result.city : '',
      actionOrder: this.data.actionOrder,
      variant: this.data.shareVariant,
      templateId: template.id,
      cityCategory: this.data.cityDetail ? this.data.cityDetail.category : ''
    });
    this.savePoster();
  },

  // 关闭海报弹窗
  closePosterModal() {
    this.setData({ showPosterModal: false });
  },

  // 阻止关闭
  preventClose() {},

  // 保存海报到相册
  savePosterToAlbum() {
    const { posterImage } = this.data;
    if (!posterImage) {
      wx.showToast({ title: '请先生成海报', icon: 'none' });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: posterImage,
      success: () => {
        trackEvent('poster_save_success');
        wx.showToast({ title: '已保存到相册', icon: 'success' });
        this.setData({ showPosterModal: false });
      },
      fail: (err) => {
        trackEvent('poster_save_fail', { errMsg: err.errMsg || '' });
        console.error('保存失败', err);
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要授权保存到相册',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }
    });
  },

  // 生成并保存海报
  savePoster() {
    const { result, cityDetail, analysis } = this.data;
    if (!result || !cityDetail) return;

    wx.showLoading({ title: '生成中...' });

    // 获取模板和城市配色
    const template = getPosterTemplate();
    const cityColor = getCityCategoryColor(cityDetail);

    // 随机选择背景色
    const bgColor = template.bgColors[Math.floor(Math.random() * template.bgColors.length)];

    // 创建 canvas 上下文
    const ctx = wx.createCanvasContext('posterCanvas', this);

    // 设置背景
    ctx.setFillStyle(bgColor);
    ctx.fillRect(0, 0, 600, 900);

    // 添加装饰元素
    ctx.setFillStyle(cityColor.accent);
    ctx.setFontSize(30);
    ctx.setTextAlign('center');
    ctx.fillText(`${template.emoji} 2026新年旺城 ${template.emoji}`, 300, 50);

    // 城市 emoji 和名称
    ctx.setFontSize(80);
    ctx.fillText(cityDetail.emoji, 300, 140);

    ctx.setFillStyle(cityColor.text);
    ctx.setFontSize(50);
    ctx.setTextAlign('center');
    ctx.fillText(result.city, 300, 200);

    // 城市描述
    ctx.setFillStyle(cityColor.accent);
    ctx.setFontSize(28);
    ctx.fillText(cityDetail.description, 300, 240);

    // 分割线
    ctx.setStrokeStyle(template.accentColor);
    ctx.setLineWidth(2);
    ctx.moveTo(100, 270);
    ctx.lineTo(500, 270);
    ctx.stroke();

    // 分析文案
    const posterReasons = this.getDisplayWhyFit(analysis ? analysis.whyFit : []);
    if (posterReasons.length > 0) {
      ctx.setFillStyle('#333');
      ctx.setFontSize(22);
      let yPos = 310;
      posterReasons.forEach((reason, index) => {
        if (index < 4) {
          // reason 是对象，需要取 desc 字段
          const text = reason.desc || reason.text || reason;
          ctx.fillText('• ' + text, 300, yPos);
          yPos += 35;
        }
      });
    }

    // 简短总结
    if (analysis && analysis.summary) {
      ctx.setFillStyle(cityColor.text);
      ctx.setFontSize(24);
      ctx.setTextAlign('center');
      // 自动换行处理
      const summary = analysis.summary;
      const maxWidth = 500;
      ctx.fillText(summary, 300, 470);
    }

    // 小程序码占位区域 - 使用兼容方式绘制圆角矩形
    ctx.setFillStyle('#FFF');
    ctx.setStrokeStyle(template.accentColor);
    ctx.setLineWidth(3);
    this.drawRoundedRect(ctx, 225, 500, 150, 150, 15);

    // 小程序码文字
    ctx.setFillStyle('#999');
    ctx.setFontSize(16);
    ctx.fillText('小程序码', 300, 580);

    // 提示文字
    ctx.setFillStyle('#666');
    ctx.setFontSize(20);
    ctx.fillText('长按识别小程序码', 300, 830);
    ctx.fillText('测试你的新年旺城', 300, 860);

    // 绘制完成
    ctx.draw(false, () => {
      // 导出图片
      wx.canvasToTempFilePath({
        canvasId: 'posterCanvas',
        success: (res) => {
          this.setData({
            posterImage: res.tempFilePath,
            showPosterModal: true
          });
          wx.hideLoading();
        },
        fail: (err) => {
          wx.hideLoading();
          wx.showToast({ title: '生成失败', icon: 'none' });
          console.error('canvasToTempFilePath error:', err);
        }
      }, this);
    });
  },

  // 兼容方式绘制圆角矩形
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  // 复制结果文案
  copyResult() {
    trackEvent('click_copy_result', {
      city: this.data.result ? this.data.result.city : '',
      actionOrder: this.data.actionOrder,
      variant: this.data.shareVariant
    });
    const { result, cityDetail, analysis, mbti, fiveElement, zodiacProfile, shareVariant } = this.data;

    let whyFitText = '';
    const reasonList = this.getDisplayWhyFit(analysis ? analysis.whyFit : []);
    if (reasonList.length > 0) {
      whyFitText = '\n📝 为什么适合你：\n' + reasonList.map((r) => {
        const title = r.text ? `【${r.text}】` : '';
        return `• ${title}${r.desc || ''}`;
      }).join('\n');
    }

    let mbtiText = '';
    if (mbti) {
      mbtiText = `\n\n🔮 我的MBTI旅行人格：${mbti.type} ${mbti.emoji} ${mbti.name}\n${mbti.description}\n旅行风格：${mbti.travelStyle}`;
    }

    let fiveElementText = '';
    if (fiveElement && fiveElement.detail) {
      const fe = fiveElement.detail;
      const mainLuckyNumber = this.data.luckyPlan && this.data.luckyPlan.number
        ? this.data.luckyPlan.number
        : (Array.isArray(fe.luckyNumbers) && fe.luckyNumbers.length ? fe.luckyNumbers[0] : '');
      fiveElementText = `\n\n🧭 我的五行属性：${fe.emoji} ${fe.name}\n幸运色：${fe.luckyColors.join('、')}\n幸运数字范围：${fe.luckyNumbers.join('、')}${mainLuckyNumber !== '' ? `（主号 ${mainLuckyNumber}）` : ''}\n贵人方位：${fe.direction}\n${fe.fortune}`;
    }

    let zodiacText = '';
    if (zodiacProfile && zodiacProfile.label) {
      zodiacText = `\n\n🧿 生肖运势倾向：${zodiacProfile.animal}系 · ${zodiacProfile.label}\n主运势轴：${zodiacProfile.focusAxisLabel || zodiacProfile.focusAxis}\n签文共振：${zodiacProfile.signAxisLabel || zodiacProfile.signAxis}\n开运动作轴：${zodiacProfile.ritualAxisLabel || zodiacProfile.ritualAxis || ''}`;
    }

    let actionTipsText = '';
    if (analysis && Array.isArray(analysis.actionTips) && analysis.actionTips.length > 0) {
      actionTipsText = '\n\n✅ 今日行动建议：\n' + analysis.actionTips.map((tip) => '• ' + tip).join('\n');
    }

    let opening = '🎉 2026新年旺城测试 🎉';
    if (shareVariant === 'direct') {
      opening = `${this.data.questionCount || 14}题测出我的开年旺城，你也来测测！`;
    } else if (shareVariant === 'relation') {
      opening = '我先测到了我的开年旺城，你也测一下我们是不是同路人！';
    }
    const text = `${opening}\n\n我的开年旅游地是：【${result.city}】\n${cityDetail.description}\n\n${cityDetail.detail}\n${whyFitText}\n${mbtiText}\n${fiveElementText}\n${zodiacText}\n${actionTipsText}\n\n${analysis ? '💡 ' + analysis.summary + '\n' : ''}\n🧧 新年行大运，快来测测你的！`;

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  },

  buildLuckyPlan(cityDetail, fiveElement) {
    if (!cityDetail || !fiveElement || !fiveElement.detail) return null;
    const fe = fiveElement.detail;
    const cityColor = cityDetail.luckyColor || '';
    const cityNumber = cityDetail.luckyNumber || '';
    const feColors = Array.isArray(fe.luckyColors) ? fe.luckyColors : [];
    const feNumbers = Array.isArray(fe.luckyNumbers) ? fe.luckyNumbers.map((n) => String(n)) : [];

    const finalColor = feColors.includes(cityColor) ? cityColor : (feColors[0] || cityColor || '红色');
    const finalNumber = feNumbers.includes(String(cityNumber)) ? String(cityNumber) : (feNumbers[0] || String(cityNumber || '8'));

    return {
      color: finalColor,
      number: finalNumber,
      thing: cityDetail.luckyThing || '旅行手账',
      note: `规则：幸运色和幸运数字以你的五行为主，结合${cityDetail.emoji}${cityDetail.description}场景做微调。`
    };
  },

  getDisplayWhyFit(whyFit) {
    const list = Array.isArray(whyFit) ? whyFit : [];
    return list;
  },

  lightUpToday() {
    if (this.data.dailyRitualDone) {
      wx.showToast({ title: '今天已经点亮过啦', icon: 'none' });
      return;
    }
    const ritualKey = this.getTodayRitualKey();
    const ritualRecord = wx.getStorageSync('dailyRitual') || {};
    ritualRecord[ritualKey] = this.data.result.city;
    wx.setStorageSync('dailyRitual', ritualRecord);
    const ritualStreakDays = this.getRitualStreakDays(ritualRecord);
    this.setData({
      dailyRitualDone: true,
      dailyRitualText: this.buildRitualEncouragement(ritualStreakDays),
      ritualStreakDays
    });
    trackEvent('daily_ritual_light_up', {
      city: this.data.result.city,
      streakDays: ritualStreakDays
    });
    wx.showToast({ title: '好运已点亮', icon: 'success' });
  },

  getTodayRitualKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  getRitualStreakDays(ritualRecord) {
    const record = ritualRecord || {};
    let days = 0;
    let cursor = new Date();
    while (true) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, '0');
      const d = String(cursor.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${d}`;
      if (!record[key]) break;
      days += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return days;
  },

  buildRitualEncouragement(streakDays) {
    if (streakDays >= 7) return `连续点亮 ${streakDays} 天，状态稳稳在线！`;
    if (streakDays >= 3) return `连续点亮 ${streakDays} 天，好运习惯正在形成。`;
    if (streakDays >= 1) return `连续点亮 ${streakDays} 天，继续保持好心情！`;
    return '今日好运已点亮，继续保持好心情！';
  },

  saveResultHistory(city, summary) {
    const previous = wx.getStorageSync('historyResults') || [];
    const current = {
      city,
      summary: summary || '',
      ts: Date.now()
    };
    const merged = [current, ...previous.filter((item) => !(item && item.city === city && item.ts === current.ts))];
    wx.setStorageSync('historyResults', merged.slice(0, 10));
    wx.setStorageSync('testResult', current);
  },

  getCompareText(currentCity) {
    const history = wx.getStorageSync('historyResults') || [];
    const previous = Array.isArray(history) && history.length > 0 ? history[0] : null;
    if (!previous || !previous.city) {
      return '这是你第一次测试，欢迎开启好运旅程！';
    }
    if (previous.city === currentCity) {
      return `连续命中${currentCity}，你的旅行偏好非常稳定。`;
    }
    return `上一次是${previous.city}，这次切换到${currentCity}，你的状态正在变化。`;
  },

  // 获取历史摘要数据
  getHistorySummary(currentCity) {
    const history = wx.getStorageSync('historyResults') || [];
    if (!Array.isArray(history) || history.length === 0) {
      return {
        hasHistory: false,
        totalTests: 0,
        uniqueCities: 0,
        streakBadge: null,
        recentCities: []
      };
    }

    const totalTests = history.length;
    const uniqueCities = new Set(history.map(h => h && h.city).filter(Boolean)).size;

    // 计算连续测试天数（基于时间戳）
    let streakDays = 0;
    let lastDate = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    history.forEach(item => {
      if (!item || !item.ts) return;
      const itemDate = new Date(item.ts);
      itemDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - itemDate) / (24 * 60 * 60 * 1000));

      if (diffDays === streakDays || (diffDays === streakDays + 1 && streakDays === 0)) {
        if (!lastDate || itemDate.getTime() === lastDate.getTime() - 86400000) {
          streakDays = diffDays;
          lastDate = itemDate;
        }
      }
    });

    // 生成徽章
    let streakBadge = null;
    if (totalTests >= 7) {
      streakBadge = { level: 'legendary', label: '连续测试大师', emoji: '🏆' };
    } else if (totalTests >= 5) {
      streakBadge = { level: 'gold', label: '好运达人', emoji: '🥇' };
    } else if (totalTests >= 3) {
      streakBadge = { level: 'silver', label: '初测学者', emoji: '🥈' };
    }

    // 最近测试的城市列表
    const recentCities = history.slice(0, 5).map(item => ({
      city: item.city,
      time: this.formatHistoryTime(item.ts)
    }));

    return {
      hasHistory: true,
      totalTests,
      uniqueCities,
      streakBadge,
      recentCities,
      isSameCity: history[0] && history[0].city === currentCity
    };
  },

  formatHistoryTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return `${Math.floor(diffDays / 7)}周前`;
  },

  getDailyQuote(seedCity) {
    if (!Array.isArray(healingQuotes) || healingQuotes.length === 0) {
      return '今天也会有小确幸。';
    }
    const now = new Date();
    const dateSeed = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${seedCity || ''}`;
    let hash = 0;
    for (let i = 0; i < dateSeed.length; i++) {
      hash = (hash << 5) - hash + dateSeed.charCodeAt(i);
      hash |= 0;
    }
    return healingQuotes[Math.abs(hash) % healingQuotes.length];
  }
})
