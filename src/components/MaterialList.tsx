import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Card, 
  Button, 
  Badge, 
  Empty, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Popconfirm, 
  Tooltip 
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  CloudDownloadOutlined,
  BlockOutlined,
  InboxOutlined
} from '@ant-design/icons';
import type { RootState } from '../store';
import { deleteMaterial, importMaterials } from '../store/materialSlice';
import type { Material } from '../types/material';
import MaterialForm from './MaterialForm';
import MaterialIcon from './MaterialIcon';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

const MaterialList: React.FC = () => {
  const materials = useSelector((state: RootState) => state.materials.materials);
  const dispatch = useDispatch();
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleLoadSample = () => {
    const sampleData: Material[] = [
      { id: '1', name: '铁矿', level: 1, icon: 'iron', requirements: [] },
      { id: '2', name: '煤炭', level: 1, icon: 'coal', requirements: [] },
      { id: '3', name: '铜矿', level: 1, icon: 'copper', requirements: [] },
      { id: '4', name: '铁锭', level: 2, icon: 'ingot', requirements: [{ materialId: '1', quantity: 2 }, { materialId: '2', quantity: 1 }] },
      { id: '5', name: '铜锭', level: 2, icon: 'ingot', requirements: [{ materialId: '3', quantity: 2 }, { materialId: '2', quantity: 1 }] },
      { id: '6', name: '钢材', level: 2, icon: 'ingot', requirements: [{ materialId: '4', quantity: 2 }, { materialId: '2', quantity: 2 }] },
      { id: '7', name: '齿轮', level: 3, icon: 'gear', requirements: [{ materialId: '6', quantity: 1 }, { materialId: '4', quantity: 1 }] },
      { id: '8', name: '电子元件', level: 3, icon: 'component', requirements: [{ materialId: '5', quantity: 2 }, { materialId: '2', quantity: 1 }] },
    ];
    dispatch(importMaterials(sampleData));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMaterial(id));
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const groupedMaterials = {
    1: materials.filter(m => m.level === 1),
    2: materials.filter(m => m.level === 2),
    3: materials.filter(m => m.level === 3),
  };

  return (
    <div className="space-y-8">
      <Card variant="borderless" className="bg-muted/50 border shadow-sm">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space size="middle">
              <BlockOutlined style={{ fontSize: '24px', color: '#4f46e5' }} />
              <div>
                <Title level={5} style={{ margin: 0 }}>材料库状态</Title>
                <Text type="secondary">共计 {materials.length} 种材料已定义</Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space className="w-full justify-end">
              <Popconfirm
                title="加载示例数据"
                description="加载示例数据将覆盖现有数据，确定吗？"
                onConfirm={handleLoadSample}
                okText="确定"
                cancelText="取消"
              >
                <Button icon={<CloudDownloadOutlined />}>加载示例</Button>
              </Popconfirm>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => { setEditingMaterial(null); setIsFormOpen(true); }}
              >
                新增材料
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {[1, 2, 3].map((level) => (
          <Col key={level} xs={24} md={8}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 px-2">
                <Space>
                  <div className={`w-2 h-2 rounded-full ${
                    level === 1 ? 'bg-slate-400' : level === 2 ? 'bg-blue-400' : 'bg-purple-400'
                  }`} />
                  <Text strong type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {level === 1 ? '基础材料' : level === 2 ? '中间产品' : '最终产品'}
                  </Text>
                </Space>
                <Badge count={groupedMaterials[level as keyof typeof groupedMaterials].length} showZero color="#4f46e5" />
              </div>

              <Card 
                variant="borderless" 
                className="flex-1 bg-muted/20 border-dashed border-2 min-h-[200px]"
                styles={{ body: { padding: '12px' } }}
              >
                <AnimatePresence mode="popLayout">
                  {groupedMaterials[level as keyof typeof groupedMaterials].map((m) => (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mb-3"
                    >
                      <Card 
                        hoverable 
                        className="group overflow-hidden border-none shadow-sm transition-all duration-300"
                        styles={{ body: { padding: '12px' } }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-muted rounded-xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center">
                            <MaterialIcon type={m.icon} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Text strong className="block truncate">{m.name}</Text>
                            <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 500 }}>
                              {m.level === 1 ? '基础资源' : `${m.requirements.length} 项前置`}
                            </Text>
                          </div>
                          <Space className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip title="编辑">
                              <Button 
                                type="text" 
                                size="small" 
                                shape="circle" 
                                icon={<EditOutlined className="text-primary" />} 
                                onClick={() => handleEdit(m)}
                              />
                            </Tooltip>
                            <Popconfirm
                              title="删除材料"
                              description="确定要删除这个材料吗？这将同时移除所有配方中对该材料的引用。"
                              onConfirm={() => handleDelete(m.id)}
                              okText="确定"
                              cancelText="取消"
                              okButtonProps={{ danger: true }}
                            >
                              <Tooltip title="删除">
                                <Button 
                                  type="text" 
                                  size="small" 
                                  shape="circle" 
                                  icon={<DeleteOutlined className="text-destructive" />} 
                                />
                              </Tooltip>
                            </Popconfirm>
                          </Space>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {groupedMaterials[level as keyof typeof groupedMaterials].length === 0 && (
                  <Empty 
                    image={<InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                    description={<Text type="secondary" style={{ fontSize: '12px' }}>暂无数据</Text>}
                    className="py-12"
                  />
                )}
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      <MaterialForm
        editMaterial={editingMaterial}
        onClose={() => { setIsFormOpen(false); setEditingMaterial(null); }}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default MaterialList;
