import React, { useState, useRef, useEffect } from 'react';
import { Empty, Spin, Divider, Typography, message } from 'antd';
import ChatMessage, { MessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import chatService, { ChatResponse, HistorySummary } from '../../services/chatService';
import './ChatPanel.css';

const { Title } = Typography;

interface ChatPanelProps {
  title?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ title = '聊天' }) => {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      content: '您好，我是您的浏览器 AI 助手。我可以帮您分析浏览历史并提供个人发展建议。请问有什么可以帮您的？',
      sender: 'ai',
      timestamp: new Date().toISOString(),
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    const userMessage: MessageProps = {
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // 发送消息到后端
      const response = await chatService.sendMessage(content);
      
      // 添加AI回复
      const aiMessage: MessageProps = {
        content: response.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败，请稍后再试');
      
      // 添加错误消息
      const errorMessage: MessageProps = {
        content: '抱歉，我遇到了一些问题，无法回答您的问题。请稍后再试。',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // 处理本地历史查询（当后端不可用时的备选方案）
  const handleLocalHistoryQuery = async () => {
    try {
      // 获取历史摘要
      const summary = await chatService.getHistorySummary();
      
      if (summary.total_count === 0) {
        return '您今天还没有浏览任何网页，无法提供分析和建议。';
      }
      
      // 生成本地建议
      return chatService.generateDevelopmentSuggestion('', summary);
    } catch (error) {
      console.error('获取历史摘要失败:', error);
      return '抱歉，我无法获取您的浏览历史，请确保后端服务正常运行。';
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <Title level={4}>{title}</Title>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <Empty description="暂无消息" />
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={index}
              content={msg.content}
              sender={msg.sender}
              timestamp={msg.timestamp}
              reference={msg.reference}
            />
          ))
        )}
        
        {loading && (
          <div className="loading-indicator">
            <Spin size="small" />
            <span className="loading-text">AI 正在思考...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <Divider style={{ margin: '0' }} />
      
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatPanel;
