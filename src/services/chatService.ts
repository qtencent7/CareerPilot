import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  reference?: string;
}

export interface ChatRequest {
  message: string;
  user_id?: string;
}

export interface ChatResponse {
  answer: string;
  type: string;
  data?: any;
}

export interface HistorySummary {
  date: string;
  total_count: number;
  top_domains: [string, number][];
  histories: {
    url: string;
    title: string;
    timestamp: string;
  }[];
}

const chatService = {
  /**
   * 发送聊天消息到后端
   * @param message 用户消息
   * @returns 后端响应
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, {
        message,
      });
      return response.data;
    } catch (error) {
      console.error('发送消息失败:', error);
      return {
        answer: '抱歉，我无法连接到服务器，请稍后再试。',
        type: 'error',
      };
    }
  },

  /**
   * 获取今日浏览历史摘要
   * @returns 历史摘要数据
   */
  async getHistorySummary(): Promise<HistorySummary> {
    try {
      const response = await axios.get<HistorySummary>(`${API_BASE_URL}/chat/history-summary`);
      return response.data;
    } catch (error) {
      console.error('获取历史摘要失败:', error);
      throw error;
    }
  },

  /**
   * 检查消息是否是关于浏览历史的查询
   * @param message 用户消息
   * @returns 是否是历史查询
   */
  isHistoryQuery(message: string): boolean {
    const historyKeywords = ['浏览', '历史', '网页', '访问', '看了', '打开', '网站', '总结', '汇总', '分析', '今天', '昨天', '记录'];
    const lowerMessage = message.toLowerCase();
    return historyKeywords.some(keyword => lowerMessage.includes(keyword));
  },

  /**
   * 生成关于个人发展的建议
   * @param message 用户消息
   * @param historySummary 历史摘要
   * @returns 生成的建议
   */
  generateDevelopmentSuggestion(message: string, historySummary: HistorySummary): string {
    // 这里是一个简单的模板，实际应用中可以使用更复杂的逻辑或调用AI服务
    const domains = historySummary.top_domains.map(([domain]) => domain).join('、');
    const interests = historySummary.histories
      .slice(0, 3)
      .map(h => h.title)
      .join('、');

    return `
根据您今天的浏览历史分析：

您今天访问了 ${historySummary.total_count} 个网页，主要访问的网站包括 ${domains}。
您浏览的内容主要涉及：${interests}。

基于您的浏览习惯，我有以下建议：

1. 您似乎对这些主题很感兴趣，可以考虑深入学习相关知识，拓展专业技能。

2. 为了更有效地获取信息，建议您可以使用专业的学习平台或订阅相关领域的专业内容。

3. 结合您的兴趣，可以尝试参与相关社区或项目，这将有助于您的个人发展。

4. 定期回顾和整理浏览的内容，形成自己的知识体系，会让学习更有效率。

希望这些建议对您有所帮助！如需更详细的分析和建议，请提供更具体的问题。
`;
  }
};

export default chatService;
