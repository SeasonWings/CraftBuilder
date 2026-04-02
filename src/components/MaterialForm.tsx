/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  InputNumber, 
  Space, 
  Typography,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { Material } from '../types/material';
import type { RootState } from '../store';
import { addMaterial, updateMaterial } from '../store/materialSlice';
import MaterialIcon from './MaterialIcon';

const { Text } = Typography;
const { Option } = Select;

interface MaterialFormProps {
  editMaterial?: Material | null;
  onClose: () => void;
  isOpen: boolean;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ editMaterial, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const allMaterials = useSelector((state: RootState) => state.materials.materials);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (editMaterial) {
        form.setFieldsValue(editMaterial);
      } else {
        form.resetFields();
        form.setFieldsValue({ level: 1, icon: 'box', requirements: [] });
      }
    }
  }, [editMaterial, isOpen, form]);

  const onFinish = (values: any) => {
    const newMaterial: Material = {
      id: editMaterial?.id || Date.now().toString(),
      ...values,
      requirements: values.level === 1 ? [] : (values.requirements || []).filter((r: any) => r && r.materialId),
    };

    if (editMaterial) {
      dispatch(updateMaterial(newMaterial));
    } else {
      dispatch(addMaterial(newMaterial));
    }
    onClose();
  };

  const currentLevel = Form.useWatch('level', form);

  const availableIngredients = (level: number) => {
    return allMaterials.filter(m => {
      if (editMaterial && m.id === editMaterial.id) return false;
      return m.level < level;
    });
  };

  const icons = ['box', 'iron', 'coal', 'copper', 'water', 'ingot', 'component', 'gear', 'diamond', 'energy', 'tool'];

  return (
    <Modal
      title={
        <Space>
          <Text strong>{editMaterial ? '编辑材料详情' : '创建新材料'}</Text>
          <Tooltip title="定义材料的基础属性及其合成配方">
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
          </Tooltip>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={600}
      okText={editMaterial ? '更新材料' : '立即创建'}
      cancelText="取消"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ level: 1, icon: 'box' }}
        style={{ marginTop: '20px' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="材料名称"
              rules={[{ required: true, message: '请输入材料名称' }]}
            >
              <Input placeholder="例如：高级电路板" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="level"
              label="材料级别"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value={1}>一级材料 (基础资源)</Option>
                <Option value={2}>二级材料 (中间产品)</Option>
                <Option value={3}>三级材料 (最终产品)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="视觉标识 (图标)" name="icon">
          <div className="grid grid-cols-6 sm:grid-cols-11 gap-2 p-3 border rounded-xl bg-muted/30">
            {icons.map((i) => (
              <Form.Item noStyle key={i}>
                {({ getFieldValue, setFieldsValue }) => (
                  <button
                    type="button"
                    onClick={() => setFieldsValue({ icon: i })}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                      getFieldValue('icon') === i 
                        ? 'bg-primary text-white shadow-md scale-110' 
                        : 'hover:bg-background text-muted-foreground'
                    }`}
                  >
                    <MaterialIcon type={i} />
                  </button>
                )}
              </Form.Item>
            ))}
          </div>
        </Form.Item>

        {currentLevel > 1 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Text strong type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>所需原料配方</Text>
            </div>
            
            <Form.List name="requirements">
              {(fields, { add, remove }) => (
                <>
                  <div className="max-h-[300px] overflow-y-auto pr-2">
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={8} align="middle" className="mb-3">
                        <Col flex="auto">
                          <Form.Item
                            {...restField}
                            name={[name, 'materialId']}
                            rules={[{ required: true, message: '请选择原料' }]}
                            noStyle
                          >
                            <Select placeholder="选择前置原料..." style={{ width: '100%' }}>
                              {availableIngredients(currentLevel).map(m => (
                                <Option key={m.id} value={m.id}>{m.name} (L{m.level})</Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col flex="100px">
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            rules={[{ required: true, message: '数量' }]}
                            noStyle
                          >
                            <InputNumber min={1} placeholder="数量" style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col flex="none">
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    ))}
                  </div>
                  <Form.Item>
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                      style={{ marginTop: fields.length > 0 ? '8px' : 0 }}
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
