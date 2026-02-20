// pages/result/result.js
const { calculateResult, getCityDetail } = require('../../utils/calculator.js');
const { analyzeUserPreferences } = require('../../utils/analyzer.js');

Page({
  data: {
    result: null,
    cityDetail: null,
    analysis: null,
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
      // 没有答案，跳转到首页
      wx.redirectTo({
        url: '/pages/index/index'
      });
      return;
    }

    // 计算结果
    const result = calculateResult(answers);
    const cityDetail = getCityDetail(result.city);

    // 分析用户偏好
    const analysis = analyzeUserPreferences(answers, result.city);

    this.setData({
      result: result,
      cityDetail: cityDetail,
      analysis: analysis,
      showResult: true
    });

    // 延迟触发动画
    setTimeout(() => {
      this.setData({ showAnimations: true });
    }, 100);
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

  // 生成海报
  generatePoster() {
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
        wx.showToast({ title: '已保存到相册', icon: 'success' });
        this.setData({ showPosterModal: false });
      },
      fail: (err) => {
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

    // 创建 canvas 上下文
    const ctx = wx.createCanvasContext('posterCanvas', this);

    // 设置背景
    ctx.setFillStyle('#FFE4B5');
    ctx.fillRect(0, 0, 600, 900);

    // 添加装饰
    ctx.setFillStyle('#FFD700');
    ctx.setFontSize(30);
    ctx.setTextAlign('center');
    ctx.fillText('🧧 2026新年旺城 🧧', 300, 50);

    // 城市 emoji 和名称
    ctx.setFontSize(80);
    ctx.fillText(cityDetail.emoji, 300, 140);

    ctx.setFillStyle('#E62E2E');
    ctx.setFontSize(50);
    ctx.setTextAlign('center');
    ctx.fillText(result.city, 300, 200);

    // 城市描述
    ctx.setFillStyle('#8B0000');
    ctx.setFontSize(28);
    ctx.fillText(cityDetail.description, 300, 240);

    // 分割线
    ctx.setStrokeStyle('#FFD700');
    ctx.setLineWidth(2);
    ctx.moveTo(100, 270);
    ctx.lineTo(500, 270);
    ctx.stroke();

    // 分析文案
    if (analysis && analysis.whyFit) {
      ctx.setFillStyle('#333');
      ctx.setFontSize(22);
      const reasons = analysis.whyFit;
      let yPos = 310;
      reasons.forEach((reason, index) => {
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
      ctx.setFillStyle('#E62E2E');
      ctx.setFontSize(24);
      ctx.setTextAlign('center');
      // 自动换行处理
      const summary = analysis.summary;
      const maxWidth = 500;
      ctx.fillText(summary, 300, 470);
    }

    // 小程序码占位区域 - 使用兼容方式绘制圆角矩形
    ctx.setFillStyle('#FFF');
    ctx.setStrokeStyle('#FFD700');
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
    const { result, cityDetail, analysis } = this.data;

    let whyFitText = '';
    if (analysis && analysis.whyFit) {
      whyFitText = '\n📝 为什么适合你：\n' + analysis.whyFit.map(r => '• ' + r.desc).join('\n');
    }

    const text = `🎉 2026新年旺城测试 🎉\n\n我的开年旅游地是：【${result.city}】\n${cityDetail.description}\n\n${cityDetail.detail}\n${whyFitText}\n\n${analysis ? '💡 ' + analysis.summary + '\n' : ''}\n🧧 新年行大运，快来测测你的！`;

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
