import React from 'react';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import ChatPanel from './components/ChatPanel';
import './SidePanel.css';

const SidePanel: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <div className="side-panel-container">
        <ChatPanel title="浏览器 AI 助手" />
      </div>
    </ConfigProvider>
  );
};

export default SidePanel;
