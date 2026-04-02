import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Select, 
  InputNumber, 
  Typography, 
  Row, 
  Col, 
  Button, 
  List, 
  Space, 
  Empty,
  Divider,
  Badge
} from 'antd';
import { 
  ShoppingCartOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  CarryOutOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import type { RootState } from '../store';
import { calculateBatchBaseMaterials } from '../utils/calculation';
import MaterialIcon from './MaterialIcon';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

const BatchCalculator: React.FC = () => {
  const materials = useSelector((state: RootState) => state.materials.materials);
  const [targets, setTargets] = useState<{ materialId: string; quantity: number }[]>([]);

  const targetOptions = useMemo(() => {
    return materials.filter(m => m.level > 1);
  }, [materials]);

  const handleAddTarget = () => {
    setTargets([...targets, { materialId: '', quantity: 1 }]);
  };

  const handleRemoveTarget = (index: number) => {
    setTargets(targets.filter((_, i) => i !== index));
  };

  const handleTargetChange = (index: number, field: 'materialId' | 'quantity', value: string | number) => {
    const newTargets = [...targets];
    if (field === 'quantity') {
      newTargets[index].quantity = Number(value);
    } else {
      newTargets[index].materialId = value as string;
    }
    setTargets(newTargets);
  };

  const totalBaseMaterials = useMemo(() => {
    const validTargets = targets.filter(t => t.materialId !== '' && t.quantity > 0);
    if (validTargets.length === 0) return [];
    return calculateBatchBaseMaterials(materials, validTargets);
  }, [materials, targets]);

  return (
    <Card variant="borderless" className="shadow-xl shadow-green-500/5 bg-background overflow-hidden">
      <div className="p-8 border-b bg-green-500/5">
        <Space className="text-green-600">
          <div className="p-2 bg-green-500/10 rounded-lg flex items-center justify-center">
            <ShoppingCartOutlined style={{ fontSize: '20px' }} />
          </div>
          <Title level={4} style={{ margin: 0 }}>合并生产清单</Title>
        </Space>
      </div>

      <div className="p-8">
        <Row gutter={40}>
          <Col xs={24} lg={14}>
            <Divider style={{ margin: '12px 0 24px 0' }}>
              <div className="flex justify-between items-center w-full">
                <Space>
                  <CarryOutOutlined className="text-muted-foreground" />
                  <Title level={5} style={{ margin: 0 }}>待生产任务</Title>
                </Space>
                <Button
                  type="dashed"
                  size="small"
                  onClick={handleAddTarget}
                  icon={<PlusOutlined />}
                  style={{ fontSize: '12px',margin: '0px 0px 0px 8px' }}
                >
                  添加任务
                </Button>
              </div>
            </Divider>
            
            <div className="min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {targets.map((target, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-3"
                  >
                    <Card size="small" className="bg-muted/30 hover:border-green-500/20 transition-all rounded-2xl">
                      <Row gutter={12} align="middle">
                        <Col flex="auto">
                          <Select
                            showSearch
                            placeholder="选择目标物品..."
                            style={{ width: '100%' }}
                            value={target.materialId || undefined}
                            onChange={(val) => handleTargetChange(index, 'materialId', val)}
                            filterOption={(input, option) =>
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (option?.children as any || '').toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            {targetOptions.map(m => (
                              <Option key={m.id} value={m.id}>{m.name} (L{m.level})</Option>
                            ))}
                          </Select>
                        </Col>
                        <Col flex="100px">
                          <InputNumber
                            min={1}
                            value={target.quantity}
                            onChange={(val) => handleTargetChange(index, 'quantity', val || 1)}
                            style={{ width: '100%' }}
                            className="font-mono font-bold"
                          />
                        </Col>
                        <Col flex="none">
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveTarget(index)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {targets.length === 0 && (
                <Empty
                  image={<ShoppingCartOutlined style={{ fontSize: '48px', color: 'rgba(0,0,0,0.05)' }} />}
                  description={<Text type="secondary" style={{ fontSize: '14px' }}>清单为空。点击上方按钮开始规划您的生产任务。</Text>}
                  className="py-16 border-2 border-dashed rounded-3xl"
                />
              )}
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <Divider style={{ margin: '0 0 24px 0' }}>
              <Space>
                <CalculatorOutlined className="text-green-500" />
                <Title level={5} style={{ margin: 0 }}>全量基础材料汇总</Title>
              </Space>
            </Divider>

            <div className="bg-green-500/5 rounded-3xl p-6 border-2 border-dashed border-green-500/10 min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {totalBaseMaterials.length > 0 ? (
                  <List
                    dataSource={totalBaseMaterials}
                    renderItem={(res) => {
                      const material = materials.find(m => m.id === res.materialId);
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mb-3"
                        >
                          <Card size="small" className="bg-background border-green-500/10 shadow-sm rounded-2xl">
                            <div className="flex justify-between items-center">
                              <Space>
                                <div className="p-2 bg-muted rounded-xl flex items-center justify-center">
                                  <MaterialIcon type={material?.icon} className="w-5 h-5 text-green-600" />
                                </div>
                                <Text strong>{res.name}</Text>
                              </Space>
                              <Space align="baseline" size={4}>
                                <Text strong style={{ fontSize: '20px', fontFamily: 'monospace', color: '#10b981' }}>{res.quantity}</Text>
                                <Badge count="Qty" style={{ backgroundColor: 'transparent', color: 'rgba(0,0,0,0.25)', boxShadow: 'none', fontSize: '9px' }} />
                              </Space>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    }}
                  />
                ) : (
                  <Empty
                    image={<CarryOutOutlined style={{ fontSize: '48px', color: 'rgba(0,0,0,0.05)' }} />}
                    description={<Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>等待计算结果</Text>}
                    className="py-10"
                  />
                )}
              </AnimatePresence>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default BatchCalculator;
