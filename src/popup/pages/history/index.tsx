import { useState, useEffect } from 'react'

import './index.css'
import { Tooltip, Button, Spin, message } from 'antd'
import { HistoryItem } from '../../../types'
import { historyApi } from '../../../services/api'

export const History = () => {
  const [count, setCount] = useState(0)
  const link = 'https://github.com/guocaoyi/create-chrome-ext'

  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  // 从后端获取历史记录
  const fetchHistoriesFromBackend = async () => {
    setLoading(true)
    try {
      const data = await historyApi.getAllHistories()
      setHistory(data)
    } catch (error) {
      console.error('获取后端历史记录失败:', error)
      message.error('获取历史记录失败，请检查后端服务是否正常运行')
      // 如果后端获取失败，则从本地存储获取
      chrome.storage.local.get('history').then((result) => {
        setHistory(result.history || [])
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 获取历史记录
    fetchHistoriesFromBackend()
  }, [])

  const minus = () => {
    if (count > 0) setCount(count - 1)
  }

  const add = () => setCount(count + 1)

  useEffect(() => {
    chrome.storage.sync.get(['count'], (result) => {
      setCount(result.count || 0)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ count })
    chrome.runtime.sendMessage({ type: 'COUNT', count })
  }, [count])

  // 清空历史记录
  const clearAllHistories = async () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      setLoading(true)
      try {
        // 清空后端历史记录
        await historyApi.deleteAllHistories()
        // 清空本地存储
        await chrome.storage.local.set({ history: [] })
        setHistory([])
        message.success('历史记录已清空')
      } catch (error) {
        console.error('清空历史记录失败:', error)
        message.error('清空历史记录失败')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <main>
      <h3>浏览历史记录</h3>
      <div className="history-controls">
        <Button type="primary" onClick={fetchHistoriesFromBackend} disabled={loading}>
          刷新
        </Button>
        <Button danger onClick={clearAllHistories} disabled={loading}>
          清空
        </Button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <Spin tip="加载中..." />
        </div>
      ) : (
        <>
          {history.length === 0 ? (
            <div className="empty-history">
              <p>暂无历史记录</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item: HistoryItem) => (
                <div key={item.id || item.timestamp} className='history-item'>
                  <div className='history-item-content'>
                    <Tooltip title={item.title}>
                      <h3>{item.title?.substring(0, 25) || '无标题'}</h3>
                    </Tooltip>
                    <div className="history-item-actions">
                      <span className="history-time">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      <a href='' onClick={(e) => {
                        e.preventDefault();
                        chrome.tabs.create({ url: item.url });
                      }}>访问</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default History
