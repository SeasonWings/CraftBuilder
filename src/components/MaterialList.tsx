/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Button, 
  Badge, 
  Space, 
  Typography, 
  Popconfirm,
  Popover
} from 'antd';
import { 
  DeleteOutlined, 
  PlusOutlined, 
  CloudDownloadOutlined
} from '@ant-design/icons';
import type { RootState } from '../store';
import { deleteMaterial, importMaterials } from '../store/materialSlice';
import type { Material } from '../types/material';
import MaterialForm from './MaterialForm';
import { motion, AnimatePresence } from 'framer-motion';

const { Text } = Typography;

const MaterialList: React.FC = () => {
  const materials = useSelector((state: RootState) => state.materials.materials);
  const dispatch = useDispatch();
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [popoverVisibleId, setPopoverVisibleId] = useState<string | null>(null);
  const longPressTimer = useRef<any>(null);
  const touchStartPos = useRef<{ x: number, y: number } | null>(null);
  const isLongPress = useRef(false);

  // 全局点击监听，用于关闭 Popover
  useEffect(() => {
    const handleGlobalClick = () => {
      // 只有当没有正在进行长按操作时，才在全局点击时关闭
      if (!isLongPress.current) {
        setPopoverVisibleId(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleLoadSample = () => {
    const sampleData: Material[] = [
      { id: "1775196258034", name: "点翠晶", level: 1, color: "#4ade80", requirements: [] },
      { id: "1775196286012", name: "海藻", level: 1, color: "#38bdf8", requirements: [] },
      { id: "1775196303048", name: "蚌壳", level: 1, color: "#38bdf8", requirements: [] },
      { id: "1775196310010", name: "珍珠", level: 1, color: "#38bdf8", requirements: [] },
      { id: "1775202464208", name: "绯云石", level: 1, color: "#4ade80", requirements: [] },
      { id: "1775202508210", name: "九穗花", level: 1, color: "#4ade80", requirements: [] },
      { id: "1775202537205", name: "灯芯枝", level: 1, color: "#4ade80", requirements: [] },
      { id: "1775202622902", name: "玄脉髓", level: 1, color: "#38bdf8", requirements: [] },
      { id: "1775202633839", name: "玄脉晶", level: 1, color: "#e879f9", requirements: [] },
      { id: "1775202668354", name: "玄芝根", level: 1, color: "#e879f9", requirements: [] },
      { id: "1775202684976", name: "玄芝叶", level: 1, color: "#38bdf8", requirements: [] },
      { id: "1775202756319", name: "点翠晶石", level: 2, color: "#38bdf8", profession: "雕刻", requirements: [{ materialId: "1775196258034", quantity: 15 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196286012", quantity: 2 }] },
      { id: "1775202797740", name: "绯云晶石", level: 2, color: "#38bdf8", profession: "雕刻", requirements: [{ materialId: "1775202464208", quantity: 20 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196286012", quantity: 2 }] },
      { id: "1775202840962", name: "点翠髓", level: 2, color: "#38bdf8", profession: "锻造", requirements: [{ materialId: "1775196258034", quantity: 15 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196303048", quantity: 2 }] },
      { id: "1775202871975", name: "绯云髓", level: 2, color: "#38bdf8", profession: "锻造", requirements: [{ materialId: "1775202464208", quantity: 20 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196310010", quantity: 2 }] },
      { id: "1775202944788", name: "九穗革", level: 2, color: "#38bdf8", profession: "缝纫", requirements: [{ materialId: "1775202508210", quantity: 15 }, { materialId: "1775196310010", quantity: 2 }, { materialId: "1775196286012", quantity: 1 }] },
      { id: "1775202971886", name: "灯芯革", level: 2, color: "#38bdf8", profession: "缝纫", requirements: [{ materialId: "1775202537205", quantity: 20 }, { materialId: "1775196310010", quantity: 2 }, { materialId: "1775196286012", quantity: 1 }] },
      { id: "1775203038017", name: "九穗花·精", level: 2, color: "#38bdf8", profession: "炼药", requirements: [{ materialId: "1775202508210", quantity: 15 }, { materialId: "1775196286012", quantity: 1 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196310010", quantity: 1 }] },
      { id: "1775203077289", name: "灯芯枝·精", level: 2, color: "#38bdf8", profession: "炼药", requirements: [{ materialId: "1775202537205", quantity: 20 }, { materialId: "1775196286012", quantity: 1 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196310010", quantity: 1 }] },
      { id: "1775203119444", name: "珍之精髓", level: 1, color: "#38bdf8", requirements: [] },
      { id: "1775203127595", name: "灵之精髓", level: 1, color: "#e879f9", requirements: [] },
      { id: "1775203212983", name: "灵晶魄", level: 3, color: "#e879f9", profession: "雕刻", requirements: [{ materialId: "1775202756319", quantity: 1 }, { materialId: "1775202840962", quantity: 1 }, { materialId: "1775203119444", quantity: 10 }, { materialId: "1775202622902", quantity: 2 }] },
      { id: "1775204681686", name: "仙灵魄", level: 3, color: "#e879f9", profession: "雕刻", requirements: [{ materialId: "1775202797740", quantity: 1 }, { materialId: "1775202871975", quantity: 1 }, { materialId: "1775203127595", quantity: 10 }, { materialId: "1775202633839", quantity: 2 }] },
      { id: "1775205236696", name: "刃芒石", level: 3, color: "#e879f9", profession: "锻造", requirements: [{ materialId: "1775202756319", quantity: 1 }, { materialId: "1775202840962", quantity: 1 }, { materialId: "1775203119444", quantity: 10 }, { materialId: "1775202622902", quantity: 2 }] },
      { id: "1775205434558", name: "流星石", level: 3, color: "#e879f9", profession: "锻造", requirements: [{ materialId: "1775202797740", quantity: 1 }, { materialId: "1775202871975", quantity: 1 }, { materialId: "1775203127595", quantity: 10 }, { materialId: "1775202633839", quantity: 2 }] },
      { id: "1775205491297", name: "玄武片", level: 3, color: "#e879f9", profession: "缝纫", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202944788", quantity: 1 }, { materialId: "1775203119444", quantity: 10 }, { materialId: "1775202684976", quantity: 2 }] },
      { id: "1775205547410", name: "镇岳片", level: 3, color: "#e879f9", profession: "缝纫", requirements: [{ materialId: "1775202797740", quantity: 1 }, { materialId: "1775202871975", quantity: 1 }, { materialId: "1775203127595", quantity: 10 }, { materialId: "1775202668354", quantity: 2 }] },
      { id: "1775205782529", name: "会心药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202944788", quantity: 1 }, { materialId: "1775202684976", quantity: 2 }] },
      { id: "1775205823831", name: "调息药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202944788", quantity: 1 }, { materialId: "1775202633839", quantity: 2 }] },
      { id: "1775206009131", name: "专精药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202756319", quantity: 1 }, { materialId: "1775202684976", quantity: 2 }] },
      { id: "1775206044088", name: "破甲药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202756319", quantity: 1 }, { materialId: "1775202684976", quantity: 2 }] },
      { id: "1775206162465", name: "会心药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202971886", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }] },
      { id: "1775206198616", name: "调息药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202971886", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }] },
      { id: "1775206238666", name: "专精药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202797740", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }] },
      { id: "1775206265737", name: "破甲药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202797740", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }] },
    ];
    dispatch(importMaterials(sampleData));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMaterial(id));
    setPopoverVisibleId(null);
  };

  const handleEdit = (material: Material) => {
    // 如果已经开启了长按菜单，且不是正在进行中的长按操作，再次点击任何地方都应该先关闭菜单
    if (popoverVisibleId) {
      if (!isLongPress.current) {
        setPopoverVisibleId(null);
      }
      return;
    }

    // 如果正在进行长按操作，则不进入编辑
    if (isLongPress.current) return;

    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const startPress = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    isLongPress.current = false;
    
    // 记录初始位置
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    touchStartPos.current = pos;

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setPopoverVisibleId(id);
      // 触觉反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 600); // 略微增加长按时间以减少误触
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!touchStartPos.current || !longPressTimer.current) return;

    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    const dx = Math.abs(pos.x - touchStartPos.current.x);
    const dy = Math.abs(pos.y - touchStartPos.current.y);

    // 如果移动距离超过20px，判定为滑动而非长按，清除定时器
    if (dx > 20 || dy > 20) {
      endPress();
    }
  };

  const endPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    touchStartPos.current = null;
    // 延迟重置 isLongPress，确保 onClick 事件能正确拦截
    setTimeout(() => {
      isLongPress.current = false;
    }, 50);
  };

  const groupedMaterials = {
    1: materials.filter(m => m.level === 1),
    2: materials.filter(m => m.level === 2),
    3: materials.filter(m => m.level === 3),
  };

  return (
    <div 
      style={{margin: '8px'}} 
      className="flex flex-col gap-2"
    >
      <div className="glass rounded-[20px] p-2 flex items-center justify-between">
        <div className="flex items-center gap-2 px-1">
          <div className="flex flex-col">
            <Text strong style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.2 }}>材料库管理</Text>
            <Text style={{ color: 'var(--text-sub)', fontSize: '10px' }}>共计 {materials.length} 种</Text>
          </div>
        </div>
        <div className="flex gap-1">
          <Popconfirm
            title="加载示例数据"
            onConfirm={handleLoadSample}
            okText="确定"
            cancelText="取消"
          >
            <Button ghost size="small" icon={<CloudDownloadOutlined />} className="border-current/10 rounded-[10px] text-[11px]">示例数据</Button>
          </Popconfirm>
          <Button 
            type="primary" 
            size="small"
            icon={<PlusOutlined />} 
            onClick={(e) => { 
              e.stopPropagation();
              setPopoverVisibleId(null);
              setEditingMaterial(null); 
              setIsFormOpen(true); 
            }}
            className="rounded-[10px] text-[11px]"
          >
            新增材料
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((level) => (
          <div key={level} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2">
              <Space size={6}>
                <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px_rgba(79,70,229,0.4)] ${
                  level === 1 ? 'bg-slate-400' : level === 2 ? 'bg-blue-400' : 'bg-purple-400'
                }`} />
                <Text strong style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-sub)', letterSpacing: '0.02em' }}>
                  {level === 1 ? '基础材料' : level === 2 ? '中间产品' : '最终产品'}
                </Text>
              </Space>
              <Badge count={groupedMaterials[level as keyof typeof groupedMaterials].length} showZero color="#4f46e5" style={{ fontSize: '9px', height: '16px', minWidth: '16px', lineHeight: '16px' }} />
            </div>

            <div className="grid grid-cols-5 gap-1 px-1">
              <AnimatePresence mode="popLayout">
                {groupedMaterials[level as keyof typeof groupedMaterials].map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                  >
                    <Popover
                      content={
                        <div className="flex flex-col gap-1.5 p-1 min-w-[80px]">
                          <div className="text-[10px] text-red-500/80 font-bold px-1 uppercase tracking-wider">操作</div>
                          <Button 
                            danger 
                            type="primary" 
                            size="small" 
                            icon={<DeleteOutlined style={{ fontSize: '10px' }} />} 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(m.id);
                            }}
                            className="h-7 text-[11px] rounded-[6px] flex items-center justify-center gap-1 border-none shadow-sm shadow-red-500/20"
                            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                          >
                            删除材料
                          </Button>
                        </div>
                      }
                      open={popoverVisibleId === m.id}
                      onOpenChange={(visible) => {
                        if (!visible) {
                          setPopoverVisibleId(null);
                        }
                      }}
                      overlayClassName="delete-popover"
                      placement="top"
                      arrow={false}
                      align={{ offset: [0, 8] }}
                    >
                      <div 
                        style={{height:'34px',marginRight:"4px"}}
                        className={`glass group flex items-center gap-1 p-1 rounded-[8px] transition-all active:scale-95 active:bg-black/10 dark:active:bg-white/10 h-8 relative border border-current/5 cursor-pointer ${popoverVisibleId === m.id ? 'ring-2 ring-red-500/50 shadow-lg shadow-red-500/10' : ''}`}
                        onMouseDown={(e) => startPress(e, m.id)}
                        onMouseMove={handleMove}
                        onMouseUp={endPress}
                        onMouseLeave={endPress}
                        onTouchStart={(e) => startPress(e, m.id)}
                        onTouchMove={handleMove}
                        onTouchEnd={endPress}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(m);
                        }}
                      >
                        <div className="w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm" style={{ backgroundColor: m.color || 'var(--text-sub)', opacity: 0.9 }}>
                          <div className="w-0.5 h-0.5 rounded-full bg-white/80" />
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center min-w-0 w-full">                        
                          <Text strong className="block truncate text-[12px]" style={{ color: m.color || 'var(--text-main)', lineHeight: 1 }}>{m.name}</Text>
                          <Text style={{ fontSize: '8px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-sub)', opacity: 0.6, lineHeight: 1 }}>
                            {m.level === 1 ? 'L1' : `L${m.level} ${m.requirements.length}项`}
                          </Text>
                        </div>
                      </div>
                    </Popover>
                  </motion.div>
                ))}
              </AnimatePresence>

              {groupedMaterials[level as keyof typeof groupedMaterials].length === 0 && (
                <div className="col-span-5 glass rounded-[12px] py-3 flex flex-col items-center justify-center border-dashed border border-current/10">
                  <Text style={{ fontSize: '9px', color: 'var(--text-sub)', opacity: 0.4 }}>无数据</Text>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <MaterialForm
        editMaterial={editingMaterial}
        onClose={() => { setIsFormOpen(false); setEditingMaterial(null); }}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default MaterialList;
