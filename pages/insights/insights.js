const { getEventLogs, clearEventLogs, trackEvent } = require('../../utils/analytics.js');

function countByName(events, name) {
  return events.filter((item) => item && item.eventName === name).length;
}

function matchesFilter(eventName, filterKey) {
  if (filterKey === 'all') return true;
  if (filterKey === 'core') {
    return ['app_open', 'test_start', 'test_complete', 'result_view', 'result_view_from_cache'].includes(eventName);
  }
  if (filterKey === 'share') {
    return ['click_copy_result', 'click_generate_poster', 'share_app_message', 'share_timeline', 'poster_save_success'].includes(eventName);
  }
  if (filterKey === 'ritual') {
    return ['daily_ritual_light_up', 'lucky_sign_popup'].includes(eventName);
  }
  return true;
}

Page({
  data: {
    stats: {
      totalEvents: 0,
      testStart: 0,
      testComplete: 0,
      resultView: 0,
      shareCount: 0,
      ritualCount: 0,
      completionRate: '0.0%',
      shareRate: '0.0%'
    },
    eventPreview: [],
    filterKey: 'all',
    experimentSummary: {
      shareWarmViews: 0,
      shareDirectViews: 0,
      shareWarmActions: 0,
      shareDirectActions: 0,
      orderShareFirstViews: 0,
      orderRestartFirstViews: 0,
      orderShareFirstRestart: 0,
      orderRestartFirstRestart: 0
    },
    behaviorSummary: {
      activeDays7: 0,
      topCities: [],
      cityStats: [],
      biasWarning: 'none'  // none, yellow, red
    }
  },

  onLoad() {
    this.refreshData();
  },

  onPullDownRefresh() {
    this.refreshData();
    wx.stopPullDownRefresh();
  },

  refreshData() {
    const logs = getEventLogs();
    const testStart = countByName(logs, 'test_start');
    const testComplete = countByName(logs, 'test_complete');
    const resultView = countByName(logs, 'result_view') + countByName(logs, 'result_view_from_cache');
    const shareCount =
      countByName(logs, 'click_copy_result') +
      countByName(logs, 'click_generate_poster') +
      countByName(logs, 'share_app_message') +
      countByName(logs, 'share_timeline');
    const ritualCount = countByName(logs, 'daily_ritual_light_up');
    const completionRate = testStart > 0 ? `${((testComplete / testStart) * 100).toFixed(1)}%` : '0.0%';
    const shareRate = resultView > 0 ? `${((shareCount / resultView) * 100).toFixed(1)}%` : '0.0%';

    const preview = logs
      .slice(-20)
      .reverse()
      .map((item) => ({
        name: item.eventName,
        time: this.formatTime(item.ts),
        props: JSON.stringify(item.props || {})
      }));
    const filteredPreview = preview.filter((item) => matchesFilter(item.name, this.data.filterKey));
    const experimentSummary = this.buildExperimentSummary(logs);
    const behaviorSummary = this.buildBehaviorSummary(logs);

    this.setData({
      stats: {
        totalEvents: logs.length,
        testStart,
        testComplete,
        resultView,
        shareCount,
        ritualCount,
        completionRate,
        shareRate
      },
      eventPreview: filteredPreview,
      experimentSummary,
      behaviorSummary
    });
  },

  setFilter(e) {
    const key = e.currentTarget.dataset.key || 'all';
    this.setData({ filterKey: key });
    this.refreshData();
    trackEvent('insights_set_filter', { filter: key });
  },

  clearLogs() {
    wx.showModal({
      title: '确认清空',
      content: '将删除所有本地事件日志，是否继续？',
      success: (res) => {
        if (!res.confirm) return;
        const ok = clearEventLogs();
        if (!ok) {
          wx.showToast({ title: '清空失败', icon: 'none' });
          return;
        }
        trackEvent('insights_clear_logs');
        this.refreshData();
        wx.showToast({ title: '已清空', icon: 'success' });
      }
    });
  },

  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '将删除测试历史与每日点亮记录，是否继续？',
      success: (res) => {
        if (!res.confirm) return;
        wx.removeStorageSync('historyResults');
        wx.removeStorageSync('testResult');
        wx.removeStorageSync('dailyRitual');
        trackEvent('insights_clear_history');
        wx.showToast({ title: '历史已清空', icon: 'success' });
      }
    });
  },

  exportSummary() {
    const { stats, filterKey, experimentSummary, behaviorSummary } = this.data;
    const summary = [
      '【体验数据摘要】',
      `当前筛选：${filterKey}`,
      `事件总数：${stats.totalEvents}`,
      `开始测试：${stats.testStart}`,
      `完成测试：${stats.testComplete}`,
      `结果曝光：${stats.resultView}`,
      `分享行为：${stats.shareCount}`,
      `点亮次数：${stats.ritualCount}`,
      `完成率：${stats.completionRate}`,
      `分享率：${stats.shareRate}`,
      '---',
      `分享文案 warm: 曝光 ${experimentSummary.shareWarmViews}, 分享动作 ${experimentSummary.shareWarmActions}`,
      `分享文案 direct: 曝光 ${experimentSummary.shareDirectViews}, 分享动作 ${experimentSummary.shareDirectActions}`,
      `按钮顺序 share_first: 曝光 ${experimentSummary.orderShareFirstViews}, 再测 ${experimentSummary.orderShareFirstRestart}`,
      `按钮顺序 restart_first: 曝光 ${experimentSummary.orderRestartFirstViews}, 再测 ${experimentSummary.orderRestartFirstRestart}`,
      '---',
      `近7天活跃天数：${behaviorSummary.activeDays7}`,
      `热门城市Top3：${behaviorSummary.topCities.join(' / ') || '暂无'}`,
      `城市命中总数：${behaviorSummary.totalHits || 0}`,
      `偏置预警：${behaviorSummary.biasWarning === 'red' ? '红色预警 - 分布严重不均' : behaviorSummary.biasWarning === 'yellow' ? '黄色预警 - 分布偏斜' : '正常'}`,
      `---`,
      `城市命中分布：`,
      ...(behaviorSummary.cityStats || []).slice(0, 5).map(s => `  ${s.city}: ${s.count}次 (${s.percentage}%)`)
    ].join('\n');

    wx.setClipboardData({
      data: summary,
      success: () => {
        trackEvent('insights_export_summary');
        wx.showToast({ title: '摘要已复制', icon: 'success' });
      }
    });
  },

  formatTime(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  },

  buildExperimentSummary(logs) {
    const summary = {
      shareWarmViews: 0,
      shareDirectViews: 0,
      shareWarmActions: 0,
      shareDirectActions: 0,
      orderShareFirstViews: 0,
      orderRestartFirstViews: 0,
      orderShareFirstRestart: 0,
      orderRestartFirstRestart: 0
    };

    logs.forEach((log) => {
      if (!log || !log.eventName) return;
      const props = log.props || {};
      if (log.eventName === 'result_view') {
        if (props.variant === 'warm') summary.shareWarmViews += 1;
        if (props.variant === 'direct') summary.shareDirectViews += 1;
        if (props.actionOrder === 'share_first') summary.orderShareFirstViews += 1;
        if (props.actionOrder === 'restart_first') summary.orderRestartFirstViews += 1;
      }

      if (['click_copy_result', 'click_generate_poster', 'share_app_message', 'share_timeline'].includes(log.eventName)) {
        if (props.variant === 'warm') summary.shareWarmActions += 1;
        if (props.variant === 'direct') summary.shareDirectActions += 1;
      }

      if (log.eventName === 'click_restart_test') {
        if (props.actionOrder === 'share_first') summary.orderShareFirstRestart += 1;
        if (props.actionOrder === 'restart_first') summary.orderRestartFirstRestart += 1;
      }
    });

    return summary;
  },

  buildBehaviorSummary(logs) {
    const now = new Date();
    const dayKeys = new Set();
    const cityCount = {};
    const history = wx.getStorageSync('historyResults') || [];

    logs.forEach((log) => {
      if (!log || !log.ts) return;
      const d = new Date(log.ts);
      const diffDays = Math.floor((now - d) / (24 * 60 * 60 * 1000));
      if (diffDays >= 0 && diffDays < 7) {
        dayKeys.add(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
      }
    });

    if (Array.isArray(history)) {
      history.forEach((item) => {
        if (!item || !item.city) return;
        cityCount[item.city] = (cityCount[item.city] || 0) + 1;
      });
    }

    const topCities = Object.keys(cityCount)
      .sort((a, b) => cityCount[b] - cityCount[a])
      .slice(0, 3)
      .map((city) => `${city}(${cityCount[city]})`);

    // 城市命中统计（Top 10 + Bottom 5）
    const totalHits = Object.values(cityCount).reduce((sum, count) => sum + count, 0);
    const sortedCities = Object.keys(cityCount)
      .sort((a, b) => cityCount[b] - cityCount[a])
      .map((city, index) => ({
        city,
        count: cityCount[city],
        percentage: totalHits > 0 ? ((cityCount[city] / totalHits) * 100).toFixed(1) : '0.0'
      }));

    const cityStats = sortedCities.slice(0, 10).concat(sortedCities.slice(-5));

    // 偏置预警计算
    let biasWarning = 'none';
    if (sortedCities.length > 0 && totalHits > 0) {
      const top1Percentage = (sortedCities[0].count / totalHits) * 100;
      if (top1Percentage > 30) {
        biasWarning = 'red';  // 红色预警
      } else if (top1Percentage > 20) {
        biasWarning = 'yellow';  // 黄色预警
      }
    }

    return {
      activeDays7: dayKeys.size,
      topCities,
      cityStats,
      biasWarning,
      totalHits
    };
  }
});
