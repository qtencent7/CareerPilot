import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  reference?: string;
}

export interface ChatRequest {
  query: string;
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
   * Send chat message to backend
   * @param query User message
   * @returns Backend response
   */
  async sendMessage(query: string): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat/query`, {
        query: query,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        answer: 'Sorry, I cannot connect to the server. Please try again later.',
        type: 'error',
      };
    }
  },

  /**
   * Get today's browsing history summary
   * @returns History summary data
   */
  async getHistorySummary(): Promise<HistorySummary> {
    try {
      const response = await axios.get<HistorySummary>(`${API_BASE_URL}/chat/summary`);
      return response.data;
    } catch (error) {
      console.error('Failed to get history summary:', error);
      throw error;
    }
  },

  /**
   * Check if message is about browsing history
   * @param query User message
   * @returns Whether it's a history query
   */
  isHistoryQuery(query: string): boolean {
    const historyKeywords = ['browse', 'history', 'webpage', 'visit', 'saw', 'open', 'website', 'summary', 'analyze', 'today', 'yesterday', 'record'];
    const lowerQuery = query.toLowerCase();
    return historyKeywords.some(keyword => lowerQuery.includes(keyword));
  },

  /**
   * Generate development suggestions
   * @param query User message
   * @param historySummary History summary
   * @returns Generated suggestions
   */
  generateDevelopmentSuggestion(query: string, historySummary: HistorySummary): string {
    // This is a simple template, in actual application you can use more complex logic or call AI service
    const domains = historySummary.top_domains.map(([domain]) => domain).join(', ');
    const interests = historySummary.histories
      .slice(0, 3)
      .map(h => h.title)
      .join(', ');

    return `
Based on your browsing history analysis today:

You visited ${historySummary.total_count} webpages, mainly on sites including ${domains}.
Your browsing content mainly involves: ${interests}.

Based on your browsing habits, I have the following suggestions:

1. You seem interested in these topics, consider learning more about them to expand your professional skills.

2. To get information more effectively, I suggest using professional learning platforms or subscribing to specialized content in these areas.

3. Based on your interests, try participating in related communities or projects, which will help your personal development.

4. Regularly review and organize the content you browse to form your own knowledge system, which will make learning more efficient.

I hope these suggestions are helpful! For more detailed analysis and suggestions, please provide more specific questions.
`;
  },

  /**
   * Get summary with search functionality
   * @param query Search keywords
   * @returns Summary data
   */
  async getSummaryWithSearch(query: string): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat/summary-with-search`, {
        query: query
      });
      return response.data;
    } catch (error) {
      console.error('Error getting summary and suggestions:', error);
      return {
        answer: 'Sorry, there was an error getting summary and suggestions. Please try again later.',
        type: 'error'
      };
    }
  }
};

export default chatService;
