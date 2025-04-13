import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SendOutlined, AudioOutlined, PictureOutlined, SmileOutlined } from '@ant-design/icons';
import './ChatInput.css';

const { TextArea } = Input;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="发消息、输入 @ 或 /选择按钮"
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={disabled}
        />
        <div className="chat-input-actions">
          <Space>
            <Button 
              type="text" 
              icon={<SmileOutlined />} 
              className="action-button"
              title="表情"
            />
            <Button 
              type="text" 
              icon={<PictureOutlined />} 
              className="action-button"
              title="图片"
            />
            <Button 
              type="text" 
              icon={<AudioOutlined />} 
              className="action-button"
              title="语音"
            />
          </Space>
        </div>
      </div>
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="send-button"
      />
    </div>
  );
};

export default ChatInput;
