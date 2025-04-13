import { HistoryItem } from "../types";
import { historyApi } from "../services/api";

console.log('background 脚本已启动，正在监听标签页事件...');

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
});

// 处理标签页信息的函数
async function processTab(tab: chrome.tabs.Tab) {
  if (!tab.url) return;
  
  // 创建历史记录对象
  const historyItem = {
    url: tab.url,
    timestamp: new Date().toISOString(),
    title: tab.title || '',
  };
  
  try {
    // 检查 URL 是否已存在于数据库中
    const urlExists = await historyApi.checkUrlExists(tab.url);
    
    if (!urlExists) {
      // URL 不存在于数据库中，发送到后端保存
      await historyApi.createHistory(historyItem);
      console.log('历史记录已发送到后端保存:', tab.url);
      
      // 同时更新本地存储
      const res = await chrome.storage.local.get('history');
      const history = res.history || [];
      const newHistory = [...history, historyItem];
      await chrome.storage.local.set({ history: newHistory });
    } else {
      console.log('URL 已存在于数据库中，不重复保存:', tab.url);
    }
  } catch (error) {
    console.error('与后端交互失败:', error);
    
    // 后端交互失败时，回退到本地存储逻辑
    const res = await chrome.storage.local.get('history');
    const history = res.history || [];
    
    const urlExistsLocally = history.some((item: HistoryItem) => item.url === tab.url);
    
    if (!urlExistsLocally) {
      const newHistory = [...history, historyItem];
      await chrome.storage.local.set({ history: newHistory });
      console.log('后端交互失败，已保存到本地存储:', tab.url);
    }
  }
}

// 监听标签页创建事件
chrome.tabs.onCreated.addListener(async (tab) => {
  console.log('新标签页已创建:', tab.id);
  
  // 有些标签页创建时可能没有 URL，需要等待加载完成
  if (tab.url && !tab.url.startsWith('chrome://')) {
    await processTab(tab);
  }
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 只在页面完成加载且有 URL 时处理
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    console.log('标签页已更新:', tabId, tab.url);
    await processTab(tab);
  }
});