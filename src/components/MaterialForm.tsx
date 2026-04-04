/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  InputNumber, 
  Space, 
  Typography,
  Tooltip,
  ColorPicker,
  Grid
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { Material, Profession } from '../types/material';
import type { RootState } from '../store';
import { addMaterial, updateMaterial } from '../store/materialSlice';

const { Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const professions: Profession[] = ['缝纫', '锻造', '雕刻', '炼药', '烹饪'];

interface MaterialFormProps {
  editMaterial?: Material | null;
  onClose: () => void;
  isOpen: boolean;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ editMaterial, onClose, isOpen }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  const dispatch = useDispatch();
  const allMaterials = useSelector((state: RootState) => state.materials.materials);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (editMaterial) {
        form.setFieldsValue(editMaterial);
      } else {
        form.resetFields();
        form.setFieldsValue({ 
          level: 1, 
          color: '#4f46e5', 
          requirements: [],
          successRate: 0.95,
          productionTime: 30,
          isTradable: true,
          isBound: false
        });
      }
    }
  }, [editMaterial, isOpen, form]);

  const onFinish = (values: any) => {
    const newMaterial: Material = {
      id: editMaterial?.id || Date.now().toString(),
      ...values,
      requirements: Number(values.level) === 1 ? [] : (values.requirements || []).filter((r: any) => r && r.materialId),
    };

    if (editMaterial) {
      dispatch(updateMaterial(newMaterial));
    } else {
      dispatch(addMaterial(newMaterial));
    }
    onClose();
  };

  const currentLevel = Form.useWatch('level', form);

  const availableIngredients = useMemo(() => {
    if (!currentLevel) return [];
    
    const filterByLevel = (level: number) => allMaterials.filter(m => {
      if (editMaterial && m.id === editMaterial.id) return false;
      return m.level === level;
    });

    const formatOption = (m: any) => ({
      label: (
        <span style={{ color: m.color || 'inherit', fontWeight: 500 }}>
          {m.name}
        </span>
      ),
      value: m.id,
      name: m.name, // for searching
    });

    const groups = [];
    const levelLabels: Record<number, string> = {
      1: '一级 (基础资源)',
      2: '二级 (中间产品)',
      3: '三级 (最终产品)',
    };

    for (let l = 1; l < currentLevel; l++) {
      const levelMats = filterByLevel(l);
      if (levelMats.length > 0) {
        groups.push({
          label: <Text strong style={{ fontSize: '11px', opacity: 0.5 }}>{levelLabels[l]}</Text>,
          options: levelMats.map(formatOption),
        });
      }
    }
    return groups;
  }, [allMaterials, currentLevel, editMaterial]);

  return (
    <Modal
      title={
        <Space size={8}>
          <Text strong style={{ color: 'var(--text-main)' }}>{editMaterial ? '编辑材料详情' : '创建新材料'}</Text>
          <Tooltip title="定义材料的基础属性及其颜色标识">
            <InfoCircleOutlined style={{ color: 'var(--text-sub)', opacity: 0.45 }} />
          </Tooltip>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={isMobile ? '95%' : 340}
      centered
      okText={editMaterial ? '更新' : '创建'}
      cancelText="取消"
      destroyOnClose
      styles={{
        mask: { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' },
        body: { paddingTop: '4px', paddingBottom: '4px' }
      }}
      style={{ borderRadius: '20px', padding: isMobile ? '4px' : '8px', maxWidth: '340px' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ level: 1, color: '#4f46e5' }}
        style={{ marginTop: '8px' }}
        requiredMark={false}
      >
        <div className="flex flex-col gap-2">
          <Form.Item
            name="name"
            label="材料名称"
            rules={[{ required: true, message: '请输入材料名称' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input placeholder="例如：高级电路板" className="rounded-[12px]" />
          </Form.Item>

          <div className="flex gap-2 items-end">
            <Form.Item
              name="level"
              label="材料级别"
              rules={[{ required: true }]}
              style={{ marginBottom: '8px', flex: 1 }}
            >
              <Select popupClassName="glass-popup" className="rounded-[12px]">
                <Option value={1}>一级 (基础资源)</Option>
                <Option value={2}>二级 (中间产品)</Option>
                <Option value={3}>三级 (最终产品)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="color"
              label="标识颜色"
              style={{ marginBottom: '8px' }}
              getValueFromEvent={(color) => color.toHexString()}
            >
              <ColorPicker 
                showText={!isMobile}
                disabledAlpha 
                size={isMobile ? "small" : "middle"}
                presets={[
                  {
                    label: '常用颜色',
                    colors: [
                      '#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', '#4ade80', 
                      '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', 
                      '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#94a3b8'
                    ],
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        {Number(currentLevel) > 1 && (
          <Form.Item
            name="profession"
            label="制造职业"
            rules={[{ required: true, message: '请选择制造职业' }]}
            style={{ marginBottom: '8px' }}
          >
            <Select popupClassName="glass-popup" className="rounded-[12px]" placeholder="选择职业">
              {professions.map(p => (
                <Option key={p} value={p}>{p}</Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {Number(currentLevel) > 1 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2 px-1">
              <Text strong style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-sub)', opacity: 0.5 }}>所需原料配方</Text>
            </div>
            
            <Form.List name="requirements">
              {(fields, { add, remove }) => (
                <>
                  <div className={`${isMobile ? 'max-h-[140px]' : 'max-h-[160px]'} overflow-y-auto pr-1 flex flex-col gap-2`}>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex gap-1.5 items-start">
                        <div className="flex-1 min-w-0">
                          <Form.Item
                            {...restField}
                            name={[name, 'materialId']}
                            rules={[{ required: true, message: '请选择原料' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select 
                              placeholder="原料" 
                              showSearch
                              optionFilterProp="name"
                              popupClassName="glass-popup requirement-select-popup" 
                              style={{ width: '100%', fontSize: isMobile ? '12px' : '14px' }} 
                              className="rounded-[12px]"
                              options={availableIngredients}
                            />
                          </Form.Item>
                        </div>
                        <div className={isMobile ? "w-14" : "w-16"}>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            rules={[{ required: true, message: '数量' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber min={1} placeholder="Qty" style={{ width: '100%' }} className="rounded-[12px] text-xs sm:text-sm" />
                          </Form.Item>
                        </div>
                        <Button 
                          type="text" 
                          danger 
                          size="small"
                          icon={<DeleteOutlined style={{ fontSize: isMobile ? '12px' : '14px' }} />} 
                          onClick={() => remove(name)}
                          className="mt-1 p-0"
                        />
                      </div>
                    ))}
                  </div>
                  <Form.Item className="mt-2" style={{ marginBottom: 0 }}>
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                      className="border-current/10 text-current opacity-60 hover:opacity-100 rounded-[12px]"
                    >
                      添加原料
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default MaterialForm;
