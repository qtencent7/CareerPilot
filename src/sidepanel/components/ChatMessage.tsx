import React from 'react';
import { Avatar, Typography, Space, Tooltip } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import './ChatMessage.css';

const { Text, Paragraph } = Typography;

export interface MessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  reference?: string;
}

const ChatMessage: React.FC<MessageProps> = ({ content, sender, timestamp, reference }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-container">
        <div className="message-header">
          <Space>
            <Avatar 
              icon={isUser ? <UserOutlined /> : <RobotOutlined />} 
              style={{ backgroundColor: isUser ? '#1890ff' : '#52c41a' }}
            />
            <Text strong>{isUser ? '用户' : '浏览器 AI 助手'}</Text>
            <Text type="secondary" className="message-time">
              {new Date(timestamp).toLocaleString()}
            </Text>
          </Space>
        </div>
        
        <div className="message-content">
          <Paragraph>{content}</Paragraph>
          
          {reference && (
            <div className="message-reference">
              <Text type="secondary">参考来源: </Text>
              <a href={reference} target="_blank" rel="noopener noreferrer">
                {reference}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
