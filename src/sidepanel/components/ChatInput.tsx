import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Input, Button, Space, Dropdown, MenuProps } from 'antd';
import { SendOutlined, AudioOutlined, PictureOutlined, SmileOutlined, RobotOutlined } from '@ant-design/icons';
import './ChatInput.css';

const { TextArea } = Input;

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSmartSuggestion?: () => void;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onSmartSuggestion,
  disabled = false,
  value,
  onChange
}) => {
  const [message, setMessage] = useState('');
  
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setMessage(newValue);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleSend = () => {
    const messageToSend = value !== undefined ? value : message;
    if (messageToSend.trim()) {
      onSendMessage(messageToSend);
      if (!onChange) {
        setMessage('');
      }
    }
  };

  // Menu items
  const items: MenuProps['items'] = [
    {
      key: 'smart',
      label: 'Smart Suggestions',
      icon: <RobotOutlined />,
      disabled: disabled,
    },
  ];

  // Menu click handler
  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'smart' && onSmartSuggestion) {
      onSmartSuggestion();
    }
  };
  
  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <TextArea
          value={value !== undefined ? value : message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message, @ or / for options"
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={disabled}
        />
        <div className="chat-input-actions">
          <Space>
            <Button 
              type="text" 
              icon={<SmileOutlined />} 
              className="action-button"
              title="Emoji"
            />
            <Button 
              type="text" 
              icon={<PictureOutlined />} 
              className="action-button"
              title="Image"
            />
            <Button 
              type="text" 
              icon={<AudioOutlined />} 
              className="action-button"
              title="Voice"
            />
          </Space>
        </div>
      </div>
      <Dropdown.Button 
        type="primary"
        icon={<SendOutlined />}
        menu={{ items, onClick: onMenuClick }}
        onClick={handleSend}
        disabled={!((value !== undefined ? value : message).trim()) || disabled}
        className="send-button"
        buttonsRender={([leftButton, rightButton]) => [
          React.cloneElement(leftButton as React.ReactElement, {
            className: 'send-button-main'
          }),
          React.cloneElement(rightButton as React.ReactElement, {
            className: 'send-button-dropdown'
          })
        ]}
      />
    </div>
  );
};

export default ChatInput;
