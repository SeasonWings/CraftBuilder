import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Button, theme, Space, Typography, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  DatabaseOutlined, 
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
          borderRadius: 12,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="min-h-screen transition-colors duration-300">
        <Header className="sticky top-0 z-40 w-full flex items-center justify-between px-4 sm:px-8 bg-background/80 backdrop-blur-md border-b leading-none h-16" style={{ background: isDarkMode ? '#141414' : '#fff' }}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('calculate')}>
            <div className="p-2 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <DatabaseOutlined className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <Title level={4} style={{ margin: 0, lineHeight: 1 }}>CraftBuilder</Title>
              <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Production Tool</Text>
            </div>
          </div>

          <Space size="middle">
            <Button
              type="text"
              shape="circle"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setIsDarkMode(!isDarkMode)}
            />
            
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Button type="text" shape="circle" icon={<MoreOutlined style={{ fontSize: '20px' }} />} />
            </Dropdown>
          </Space>
        </Header>

        {/* Removed Mobile Navigation Menu */}

        <Content className="p-4 sm:p-8">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-200px)]">
            <AnimatePresence mode="wait">
              {activeTab === 'manage' ? (
                <motion.div
                  key="manage"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-10 text-center md:text-left">
                    <Title level={1} style={{ marginBottom: '12px' }}>材料库管理</Title>
                    <Text type="secondary" style={{ fontSize: '18px' }}>
                      可视化管理基础材料及其多级合成配方，构建您的生产蓝图。
                    </Text>
                  </div>
                  <MaterialList />
                </motion.div>
              ) : (
                <motion.div
                  key="calculate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <div className="text-center md:text-left">
                    {/* <Title level={1} style={{ marginBottom: '12px' }}>生产清单计算</Title>
                    <Text type="secondary" style={{ fontSize: '18px' }}>
                      规划您的生产任务，实时汇总多层级材料需求。
                    </Text> */}
                  </div>
                  <BatchCalculator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Content>

        <Footer className="text-center py-12 border-t bg-muted/30 mt-20">
          <Space direction="vertical" align="center">
            <Space className="opacity-50">
              <DatabaseOutlined />
              <Text strong>CraftBuilder Pro</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              © 2026 Crafted with precision for master builders.
            </Text>
          </Space>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
