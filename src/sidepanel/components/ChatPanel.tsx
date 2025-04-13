import React, { useState, useRef, useEffect } from 'react';
import { Empty, Spin, Divider, Typography, message, Button, Space } from 'antd';
import ChatMessage, { MessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import chatService from '../../services/chatService';
import './ChatPanel.css';

const { Title, Text } = Typography;

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the latest message
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle regular message sending - using regular AI chat interface
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: MessageProps = {
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    
    try {
      // Send message to backend
      const response = await chatService.sendMessage(content);
      
      // Add AI reply
      const aiMessage: MessageProps = {
        content: response.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      message.error('Failed to send message, please try again later');
      
      // Add error message
      const errorMessage: MessageProps = {
        content: 'Sorry, I encountered an issue and cannot respond to your message. Please try again later.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle smart suggestion request - using summary with search interface
  const handleSmartSuggestion = async () => {
    const content = "Please analyze my browsing history and provide personalized suggestions with web search";
    
    // Add user message
    const userMessage: MessageProps = {
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // Send request to backend - using summary with search interface
      const response = await chatService.getSummaryWithSearch(content);
      
      // Add AI reply
      const aiMessage: MessageProps = {
        content: response.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get smart suggestions:', error);
      message.error('Failed to get smart suggestions, please try again later');
      
      // Add error message
      const errorMessage: MessageProps = {
        content: 'Sorry, I encountered an issue and cannot generate smart suggestions. Please try again later.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <Title level={4}>Browsing Assistant</Title>
        <Text type="secondary">I can help analyze your browsing history and provide personal development suggestions</Text>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <Empty 
              description="No messages yet. Start chatting!" 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
            <div className="suggestions">
              <Text type="secondary">You can ask me:</Text>
              <ul>
                <li>What websites did I browse today?</li>
                <li>Based on my browsing history, what development suggestions do you have?</li>
                <li>Which websites do I visit most frequently?</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} {...msg} />
          ))
        )}
        {loading && <Spin tip="Thinking..." />}
        <div ref={messagesEndRef} />
      </div>
      
      <Divider style={{ margin: '0' }} />
      
      <div className="chat-operate-container">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onSmartSuggestion={handleSmartSuggestion}
          disabled={loading}
          value={inputValue}
          onChange={setInputValue}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
