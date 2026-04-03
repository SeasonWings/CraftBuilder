import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Select, 
  InputNumber, 
  Typography, 
  Button, 
  Space, 
  Popconfirm,
  Tabs
} from 'antd';
import { 
  ShoppingCartOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  CarryOutOutlined,
  CalculatorOutlined,
  PartitionOutlined,
  TableOutlined
} from '@ant-design/icons';
import type { RootState } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  calculateBatchBaseMaterialsByProfession, 
  calculateDemandMatrix, 
  calculateFlowDAG 
} from '../utils/calculation';
import FlowDiagram from './FlowDiagram';

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

  const handleClearTargets = () => {
    setTargets([]);
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

  const validTargets = useMemo(() => targets.filter(t => 
    t.materialId !== '' && 
    t.quantity > 0 && 
    materials.some(m => m.id === t.materialId)
  ), [targets, materials]);

  const groupedResults = useMemo(() => {
    if (validTargets.length === 0) return [];
    return calculateBatchBaseMaterialsByProfession(materials, validTargets);
  }, [materials, validTargets]);

  const demandMatrix = useMemo(() => {
    if (validTargets.length === 0) return null;
    return calculateDemandMatrix(materials, validTargets);
  }, [materials, validTargets]);

  const flowEdges = useMemo(() => {
    if (validTargets.length === 0) return [];
    return calculateFlowDAG(materials, validTargets);
  }, [materials, validTargets]);

  const taskList = useMemo(() => {
    return validTargets.map(t => {
      const mat = materials.find(m => m.id === t.materialId);
      return { id: t.materialId, name: mat?.name || '未知' };
    });
  }, [validTargets, materials]);

  return (
    <div style={{margin: '8px'}} className="p-2 flex flex-col gap-4">
      <Card variant="borderless" className="glass border-none shadow-none overflow-hidden rounded-[20px]" styles={{ body: { padding: '0px' } }}>
        <div style={{margin: '8px'}} className="p-2 border-b border-current/10">
          <Space size={8} className="text-primary px-2">
            <div className="p-2 bg-primary/20 rounded-[16px] flex items-center justify-center">
              <ShoppingCartOutlined style={{ fontSize: '18px', color: '#4f46e5' }} />
            </div>
            <Title level={5} style={{ margin: 0, color: 'inherit' }}>合并生产清单</Title>
          </Space>
        </div>

        <div style={{margin: '8px'}} className="p-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div style={{paddingBottom: '8px'}} className="flex justify-between items-center w-full px-2">
                <Space size={8}>
                  <CarryOutOutlined style={{ color: 'var(--text-sub)', opacity: 0.6 }} />
                  <Text strong style={{ color: 'var(--text-sub)', fontSize: '13px' }}>待生产任务</Text>
                </Space>
                <div className="flex gap-1">
                  <Popconfirm
                    title="确定清空清单吗？"
                    onConfirm={handleClearTargets}
                    okText="清空"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      ghost
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{marginRight: '8px'}}
                      className="h-7 px-3 text-xs rounded-[12px] border-red-500/20"
                    >
                      清空
                    </Button>
                  </Popconfirm>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleAddTarget}
                    icon={<PlusOutlined />}
                    className="h-7 px-3 text-xs rounded-[12px]"
                  >
                    添加任务
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 min-h-[60px]">
                <AnimatePresence mode="popLayout">
                  {targets.map((target, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card variant="borderless" className="bg-black/5 dark:bg-white/5 border border-current/10 rounded-[20px]" styles={{ body: { padding: '4px 8px' } }}>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <Select
                              showSearch
                              placeholder="选择物品"
                              variant="borderless"
                              style={{ width: '100%', color: 'inherit' }}
                              value={target.materialId || undefined}
                              onChange={(val) => handleTargetChange(index, 'materialId', val)}
                              popupClassName="glass-popup"
                            >
                              {targetOptions.map(m => (
                                <Option key={m.id} value={m.id}>{m.name}</Option>
                              ))}
                            </Select>
                          </div>
                          <div className="w-16">
                            <InputNumber
                              min={1}
                              variant="borderless"
                              value={target.quantity}
                              onChange={(val) => handleTargetChange(index, 'quantity', val || 1)}
                              style={{ width: '100%' }}
                              className="font-mono font-bold text-right text-sm"
                            />
                          </div>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveTarget(index)}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {targets.length === 0 && (
                  <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-current/5 rounded-[20px]">
                    <ShoppingCartOutlined style={{ fontSize: '24px', color: 'var(--text-sub)', opacity: 0.1 }} />
                    <Text style={{ fontSize: '11px', color: 'var(--text-sub)', opacity: 0.3, marginTop: '4px' }}>点击上方按钮添加任务</Text>
                  </div>
                )}
              </div>
            </div>

            {groupedResults.length > 0 && (
              <div style={{marginTop:'10px'}} className="mt-2">
                <Tabs
                  defaultActiveKey="1"
                  centered
                  className="glass-tabs"
                  items={[
                    {
                      key: '1',
                      label: (
                        <Space size={4}>
                          <CalculatorOutlined />
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>基础材料汇总</span>
                        </Space>
                      ),
                      children: (
                        <div className="flex flex-col gap-3 pt-2">
                          <div className="bg-black/5 dark:bg-white/5 rounded-[20px] p-2 min-h-[100px]">
                            <div className="flex flex-col gap-3">
                              {groupedResults.map((group) => (
                                <div key={group.profession} className="flex flex-col gap-2">
                                  <Text strong style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-sub)', opacity: 0.7 }}>
                                    {group.profession}
                                  </Text>
                                  <div className="flex flex-col gap-2">
                                    {group.materials.map((res) => {
                                      const material = materials.find(m => m.id === res.materialId);
                                      return (
                                        <motion.div
                                          key={res.materialId}
                                          layout
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                        >
                                          <div className="flex flex-col bg-black/5 dark:bg-white/5 p-2 px-3 rounded-[16px] border border-current/5">
                                            <div className="flex justify-between items-center">
                                              <Space size={8}>
                                                <div className="w-6 h-6 rounded-[8px] flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: material?.color || 'var(--text-sub)', opacity: 0.8 }}>
                                                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                                                </div>
                                                <Text strong style={{ color: material?.color || 'inherit', fontSize: '13px' }}>{res.name}</Text>
                                              </Space>
                                              <div className="flex items-baseline gap-1">
                                                <Text strong style={{ fontSize: '16px', fontFamily: 'monospace', color: '#10b981' }}>{res.finalQuantity}</Text>
                                                <Text style={{ fontSize: '9px', color: 'var(--text-sub)', opacity: 0.5 }}>PCS</Text>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    },
                    {
                      key: '2',
                      label: (
                        <Space size={4}>
                          <PartitionOutlined />
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>需求矩阵流转图</span>
                        </Space>
                      ),
                      children: (
                        <div className="flex flex-col gap-4 pt-2">
                          {/* 需求矩阵 */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-2">
                              <TableOutlined style={{ color: '#3b82f6' }} />
                              <Text strong style={{ color: 'var(--text-sub)', fontSize: '13px' }}>角色-材料需求矩阵 (L2)</Text>
                            </div>
                            <div className="glass rounded-[20px] overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="w-full text-[10px] text-center border-collapse">
                                  <thead>
                                    <tr className="bg-black/5 dark:bg-white/5">
                                      <th className="p-2 border-b border-current/10">职业</th>
                                      {demandMatrix?.materials.map(m => (
                                        <th key={m} className="p-2 border-b border-current/10 whitespace-nowrap">{m}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {demandMatrix?.professions.map(p => (
                                      <tr key={p}>
                                        <td className="p-2 font-bold border-b border-current/5">{p}</td>
                                        {demandMatrix.materials.map(m => (
                                          <td key={`${p}-${m}`} className="p-2 border-b border-current/5">
                                            {demandMatrix.data[p]?.[m] ? Math.ceil(demandMatrix.data[p][m]) : '-'}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* 流程图 */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-2">
                              <PartitionOutlined style={{ color: '#8b5cf6' }} />
                              <Text strong style={{ color: 'var(--text-sub)', fontSize: '13px' }}>生产流转图</Text>
                            </div>
                            <FlowDiagram edges={flowEdges} tasks={taskList} />
                          </div>
                        </div>
                      )
                    }
                  ]}
                />
              </div>
            )}

            {!groupedResults.length && (
              <div className="py-8 flex flex-col items-center justify-center">
                <CalculatorOutlined style={{ fontSize: '24px', color: 'var(--text-sub)', opacity: 0.1 }} />
                <Text style={{ fontSize: '11px', color: 'var(--text-sub)', opacity: 0.3, marginTop: '4px' }}>暂无计算结果</Text>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BatchCalculator;
