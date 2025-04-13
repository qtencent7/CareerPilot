import React from 'react';
import { Layout, Tabs } from 'antd';
import ChatPanel from './components/ChatPanel';
import './SidePanel.css';

const { Content } = Layout;
const { TabPane } = Tabs;

const SidePanel: React.FC = () => {
  return (
    <Layout className="side-panel-container">
      <Content style={{textAlign: 'initial', margin: '0'}}>
        <Tabs defaultActiveKey="chat" className="side-panel-tabs">
          <TabPane tab="Chat" key="chat">
            <ChatPanel />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default SidePanel;
