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
  }
}

// 监听标签页更新
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
      const result = await chrome.storage.local.get('history');
      const history = result.history || [];

      // 去重处理
      if (!history.includes(tab.url)) {
          const newHistory = [...history, {
              url: tab.url,
              timestamp: new Date().toISOString(),
              title: tab.title
          }];

          await chrome.storage.local.set({ history: newHistory });
          console.log('已记录:', tab.url);
      }
  }
});

// 初始化
initStorage();