import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Button, theme, Space, Typography, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  AppstoreOutlined, 
  SunOutlined, 
  MoonOutlined, 
  GithubOutlined,
  MoreOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import MaterialList from './components/MaterialList';
import BatchCalculator from './components/BatchCalculator';
import { motion, AnimatePresence } from 'framer-motion';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'calculate'>('calculate');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'manage',
      label: activeTab === 'manage' ? '返回计算页面' : '材料库管理',
      icon: activeTab === 'manage' ? <CalculatorOutlined /> : <AppstoreOutlined />,
      onClick: () => setActiveTab(activeTab === 'manage' ? 'calculate' : 'manage'),
    },
    {
      type: 'divider',
    },
    {
      key: 'github',
      label: 'GitHub 仓库',
      icon: <GithubOutlined />,
      onClick: () => window.open('https://github.com', '_blank'),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 20,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="min-h-0 transition-colors duration-300 bg-transparent">
        <Header style={{ margin: '8px 8px 0 8px' }} className="sticky top-0 z-40 flex items-center justify-between px-2 glass leading-none h-14 border-b-0 rounded-[20px]">
          <div className="flex items-center gap-2 cursor-pointer px-2" onClick={() => setActiveTab('calculate')}>
            <div>
              <Title level={5} style={{ margin: 0, color: 'inherit' }}>CraftBuilder</Title>
            </div>
          </div>

          <Space size={8}>
            <Button
              type="text"
              shape="circle"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ color: 'inherit' }}
            />
            
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Button type="text" shape="circle" icon={<MoreOutlined style={{ fontSize: '20px', color: 'inherit' }} />} />
            </Dropdown>
          </Space>
        </Header>

        {/* Removed Mobile Navigation Menu */}

        <Content className="p-2 overflow-y-visible">
          <div className="max-w-full mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'manage' ? (
                <motion.div
                  key="manage"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  <MaterialList />
                </motion.div>
              ) : (
                <motion.div
                  key="calculate"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  <BatchCalculator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Content>

        <Footer className="text-center py-2 border-t bg-muted/30 mt-2">
          <Space direction="vertical" align="center" size={8}>
            <Text type="secondary" style={{ fontSize: '10px' }}>CraftBuilder &copy; 2026</Text>
          </Space>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
