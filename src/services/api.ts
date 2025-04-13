import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { HistoryItem } from '../types';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 历史记录相关 API
export const historyApi = {
  // 获取所有历史记录
  getAllHistories: async (): Promise<HistoryItem[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HISTORIES);
      return response.data;
    } catch (error) {
      console.error('获取历史记录失败:', error);
      return [];
    }
  },

  // 检查 URL 是否存在于数据库中
  checkUrlExists: async (url: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.HISTORIES}/check?url=${encodeURIComponent(url)}`);
      return response.data.exists;
    } catch (error) {
      console.error('检查 URL 是否存在失败:', error);
      return false;
    }
  },

  // 创建历史记录
  createHistory: async (history: Omit<HistoryItem, 'id'>): Promise<HistoryItem | null> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.HISTORIES, history);
      return response.data;
    } catch (error) {
      console.error('创建历史记录失败:', error);
      return null;
    }
  },

  // 删除历史记录
  deleteHistory: async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.HISTORIES}/${id}`);
      return true;
    } catch (error) {
      console.error('删除历史记录失败:', error);
      return false;
    }
  },

  // 删除所有历史记录
  deleteAllHistories: async (): Promise<boolean> => {
    try {
      await apiClient.delete(API_ENDPOINTS.HISTORIES);
      return true;
    } catch (error) {
      console.error('删除所有历史记录失败:', error);
      return false;
    }
  },
};
