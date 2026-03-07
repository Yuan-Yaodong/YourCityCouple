// utils/analytics.js - 轻量本地埋点工具（MVP）

const EVENT_STORAGE_KEY = 'eventLogs';
const ANONYMOUS_ID_KEY = 'anonymousId';
const AB_VARIANT_KEY = 'abVariants';

function getAnonymousId() {
  let id = wx.getStorageSync(ANONYMOUS_ID_KEY);
  if (!id) {
    id = `anon_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    wx.setStorageSync(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

function trackEvent(eventName, props = {}) {
  try {
    const logs = wx.getStorageSync(EVENT_STORAGE_KEY) || [];
    logs.push({
      eventName,
      props,
      ts: Date.now(),
      anonymousId: getAnonymousId()
    });
    // 只保留最近500条，避免本地存储过大
    if (logs.length > 500) {
      logs.splice(0, logs.length - 500);
    }
    wx.setStorageSync(EVENT_STORAGE_KEY, logs);
  } catch (e) {
    // MVP阶段忽略埋点异常，不影响主流程
  }
}

function getEventLogs() {
  try {
    return wx.getStorageSync(EVENT_STORAGE_KEY) || [];
  } catch (e) {
    return [];
  }
}

function clearEventLogs() {
  try {
    wx.removeStorageSync(EVENT_STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

function hashString(input) {
  let hash = 0;
  const str = String(input || '');
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function assignVariant(experimentName, variants) {
  const list = Array.isArray(variants) ? variants : [];
  if (!experimentName || list.length === 0) return null;

  const stored = wx.getStorageSync(AB_VARIANT_KEY) || {};
  if (stored[experimentName] && list.includes(stored[experimentName])) {
    return stored[experimentName];
  }

  const seed = `${getAnonymousId()}_${experimentName}`;
  const idx = hashString(seed) % list.length;
  const selected = list[idx];
  stored[experimentName] = selected;
  wx.setStorageSync(AB_VARIANT_KEY, stored);
  return selected;
}

module.exports = {
  trackEvent,
  getAnonymousId,
  assignVariant,
  getEventLogs,
  clearEventLogs
};
