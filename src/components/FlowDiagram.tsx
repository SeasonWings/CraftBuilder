import React, { useMemo, useState, useRef } from 'react';
import { Typography, Button, Space, Tag, Grid } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, RestOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { FlowEdge } from '../utils/calculation';
import { motion, useMotionValue } from 'framer-motion';

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface FlowDiagramProps {
  edges: FlowEdge[];
  tasks: { id: string; name: string }[];
}

const TASK_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#06b6d4', // Cyan
];

const FlowDiagram: React.FC<FlowDiagramProps> = ({ edges, tasks }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  const [scale, setScale] = useState(1);
  const [hiddenTaskIds, setHiddenTaskIds] = useState<Set<number>>(new Set());
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 定义职业节点的固定位置
  const nodes = useMemo(() => {
    const pNodes: Record<string, { x: number; y: number; color: string }> = {
      '缝纫': { x: 160, y: 30, color: '#60a5fa' },
      '锻造': { x: 10, y: 30, color: '#f87171' },
      '雕刻': { x: 160, y: 130, color: '#a78bfa' },
      '炼药': { x: 10, y: 130, color: '#fb923c' },
      '烹饪': { x: 85, y: 230, color: '#facc15' },
      '最终目标': { x: 85, y: 330, color: '#ef4444' }
    };
    return pNodes;
  }, []);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.3));
  const handleReset = () => {
    setScale(1);
    x.set(0);
    y.set(0);
  };

  // 处理滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (e.altKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(Math.min(prev + delta, 3), 0.3));
    }
  };

  // 切换任务可见性
  const toggleTaskVisibility = (taskId: number) => {
    setHiddenTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const filteredEdges = useMemo(() => {
    return edges.filter(edge => !hiddenTaskIds.has(edge.taskId));
  }, [edges, hiddenTaskIds]);

  if (edges.length === 0) return null;

  return (
    <div className={`glass rounded-[20px] ${isMobile ? 'p-2' : 'p-4'} overflow-hidden relative`} onWheel={handleWheel}>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .flow-line {
          animation: dash 1s linear infinite;
        }
      `}</style>
      
      <div className="mb-4 flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Text style={{ fontSize: '10px', opacity: 0.5, marginLeft: isMobile ? '4px' : '8px' }}>
              {isMobile ? '双指/拖动查看' : 'Alt+滚轮缩放 | 拖拽查看'}
            </Text>
          </div>
          
          <Space size={4}>
            <Button size="small" shape="circle" icon={<ZoomInOutlined />} onClick={handleZoomIn} />
            <Button size="small" shape="circle" icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
            <Button size="small" shape="circle" icon={<RestOutlined />} onClick={handleReset} />
          </Space>
        </div>

        {/* 任务图例 */}
        <div className={`flex flex-wrap gap-1 ${isMobile ? 'p-1' : 'p-2'} bg-black/5 dark:bg-white/5 rounded-[12px]`}>
          {tasks.map((task, idx) => {
            const isHidden = hiddenTaskIds.has(idx);
            const color = TASK_COLORS[idx % TASK_COLORS.length];
            return (
              <Tag
                key={`legend-${idx}`}
                icon={isHidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                color={isHidden ? 'default' : color}
                className={`cursor-pointer transition-all border-none ${isHidden ? 'opacity-40' : 'opacity-100 shadow-sm'} m-0`}
                onClick={() => toggleTaskVisibility(idx)}
                style={{ 
                  borderRadius: '6px', 
                  fontSize: isMobile ? '9px' : '10px', 
                  padding: '0 4px',
                  background: isHidden ? undefined : `${color}20`,
                  color: isHidden ? undefined : color,
                  fontWeight: 'bold'
                }}
              >
                {task.name}
              </Tag>
            );
          })}
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative bg-black/5 dark:bg-white/5 rounded-[16px] cursor-move touch-none overflow-hidden" 
        style={{ width: '100%', height: isMobile ? '350px' : '400px' }}
      >
        <motion.div
          style={{ 
            width: '300px', 
            height: '400px', 
            x, 
            y, 
            scale,
            originX: 0.5,
            originY: 0.5,
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-150px',
            marginTop: '-200px'
          }}
          drag
          dragConstraints={{ left: -500, right: 500, top: -600, bottom: 600 }}
        >
          <svg width="300" height="400" viewBox="0 0 300 400" className="overflow-visible">
            <defs>
              {TASK_COLORS.map((color, idx) => (
                <marker key={`arrow-${idx}`} id={`arrowhead-${idx}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                </marker>
              ))}
            </defs>

            {/* 渲染连线 */}
            {filteredEdges.map((edge, i) => {
              const start = nodes[edge.from] || nodes['最终目标'];
              const end = nodes[edge.to] || nodes['最终目标'];
              const taskColor = TASK_COLORS[edge.taskId % TASK_COLORS.length];
              
              const startX = start.x + 40;
              const startY = start.y + 20;
              const endX = end.x + 40;
              const endY = end.y + 20;

              // 统计当前两点之间的连线数量，用于偏移
              const sameEdgeCount = filteredEdges.slice(0, i).filter(e => 
                (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
              ).length;
              
              let pathD = "";
              let cpX = 0;
              let cpY = 0;

              if (edge.from === edge.to) {
                // 自环 (Self-loop) - 动态调整方向，使其出现在外侧
                const loopRadius = 25 + sameEdgeCount * 12;
                const isLeftSide = start.x < 50; // 锻造、炼药在左侧
                const isRightSide = start.x > 120; // 缝纫、雕刻在右侧
                
                if (isLeftSide) {
                  // 向左绕出
                  const sX = startX - 18;
                  const sY = startY - 10;
                  const eX = startX - 18;
                  const eY = startY + 10;
                  // 稍微增加弧线弯曲度，使箭头角度更自然地指向节点
                  pathD = `M ${sX} ${sY} A ${loopRadius} ${loopRadius} 0 1 0 ${eX} ${eY}`;
                  cpX = startX - 55 - sameEdgeCount * 25;
                  cpY = startY;
                } else if (isRightSide) {
                  // 向右绕出
                  const sX = startX + 18;
                  const sY = startY - 10;
                  const eX = startX + 18;
                  const eY = startY + 10;
                  pathD = `M ${sX} ${sY} A ${loopRadius} ${loopRadius} 0 1 1 ${eX} ${eY}`;
                  cpX = startX + 55 + sameEdgeCount * 25;
                  cpY = startY;
                } else {
                  // 中间节点 (烹饪、最终目标) 向上绕出
                  const sX = startX - 10;
                  const sY = startY - 18;
                  const eX = startX + 10;
                  const eY = startY - 18;
                  pathD = `M ${sX} ${sY} A ${loopRadius} ${loopRadius} 0 1 1 ${eX} ${eY}`;
                  cpX = startX;
                  cpY = startY - 60 - sameEdgeCount * 25;
                }
              } else {
                // 普通连线
                const offset = 0.2 + sameEdgeCount * 0.1;
                cpX = (startX + endX) / 2 + (startY - endY) * offset;
                cpY = (startY + endY) / 2 + (endX - startX) * offset;
                pathD = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
              }
              
              return (
                <motion.g 
                  key={`edge-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <path
                    d={pathD}
                    stroke="var(--text-sub)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.05"
                  />
                  <path
                    d={pathD}
                    className="flow-line"
                    stroke={taskColor}
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                    opacity="0.8"
                    markerEnd={`url(#arrowhead-${edge.taskId % TASK_COLORS.length})`}
                  />
                  <g transform={`translate(${cpX}, ${cpY})`}>
                    <rect x="-35" y="-12" width="70" height="24" rx="6" fill="var(--glass-bg)" stroke={taskColor} strokeWidth="1" className="shadow-lg" />
                    <text textAnchor="middle" dy="0" fontSize="9" fill="var(--text-main)" fontWeight="bold">
                      {edge.materialName}
                    </text>
                    <text textAnchor="middle" dy="9" fontSize="7" fill={taskColor} fontWeight="bold">
                      {edge.quantity} {edge.transferType}
                    </text>
                  </g>
                </motion.g>
              );
            })}

            {/* 渲染节点 */}
            {Object.entries(nodes).map(([name, pos]) => (
              <g key={name} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle cx="40" cy="20" r="22" fill={pos.color} opacity="0.15" stroke={pos.color} strokeWidth="1.5" />
                <circle cx="40" cy="20" r="18" fill="var(--glass-bg)" opacity="0.8" />
                <text x="40" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-main)">
                  {name === '最终目标' ? '🎯' : name.slice(0, 2)}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default FlowDiagram;
