import React, { useState, useRef, useEffect } from 'react';
import { Empty, Spin, Divider, Typography } from 'antd';
import ChatMessage, { MessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import './ChatPanel.css';

const { Title } = Typography;

interface ChatPanelProps {
  title?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ title = '聊天' }) => {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      content: 'Trump administration issues demands on Harvard as conditions for billions in federal money',
      sender: 'ai',
      timestamp: new Date().toISOString(),
    },
    {
      content: '当地时间 4 月 3 日，特朗普政府要求哈佛大学放弃多元化、平等和包容 (DEI) 项目，并止在校园内汉语教学，否则 90 亿美元的联邦资金可能就与该校无缘了。',
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
  const handleSendMessage = (content: string) => {
    // 添加用户消息
    const userMessage: MessageProps = {
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // 模拟AI响应
    setLoading(true);
    
    // 延迟模拟AI思考时间
    setTimeout(() => {
      const aiMessage: MessageProps = {
        content: `这是对 "${content}" 的回复。在实际应用中，这里会调用后端API获取真实回复。`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
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
