import { HistoryItem } from "../types";

console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})
// 初始化存储
async function initStorage() {
  const data = await chrome.storage.local.get('history');

  if (!data.history) {
      await chrome.storage.local.set({ history: [] });
  } else {
    const history = data.history || [];
    const historyMap = new Map();
    history.forEach((item: HistoryItem) => {
        const existingItem = historyMap.get(item.url);
        if (!existingItem || new Date(item.timestamp) > new Date(existingItem.timestamp)) {
            historyMap.set(item.url, item);
        }
    });
    const updatedHistory = Array.from(historyMap.values());
    await chrome.storage.local.set({ history: updatedHistory });
  }
}

// 监听标签页更新
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await initStorage();
  if (changeInfo.status === 'complete' && tab.url) {
    const res = await chrome.storage.local.get('history');
    debugger
    const history = res.history || [];

    const bool = history.some((item: HistoryItem) => {
      return item.url === tab.url;
    });
    if (bool === false) {
      const newHistory = [...history, {
        url: tab.url,
        timestamp: new Date().toISOString(),
        title: tab.title,
        icon: tab.favIconUrl,
      }];
      await chrome.storage.local.set({ history: newHistory });
    }
  }
});