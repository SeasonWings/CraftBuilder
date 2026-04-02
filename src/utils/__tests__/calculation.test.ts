import { describe, it, expect } from 'vitest';
import { calculateBaseMaterials, calculateBatchBaseMaterials } from '../calculation';
import type { Material } from '../../types/material';

const mockMaterials: Material[] = [
  { id: '1', name: '铁矿', level: 1, requirements: [] },
  { id: '2', name: '煤炭', level: 1, requirements: [] },
  { id: '3', name: '铁锭', level: 2, requirements: [{ materialId: '1', quantity: 2 }, { materialId: '2', quantity: 1 }] },
  { id: '4', name: '钢材', level: 2, requirements: [{ materialId: '3', quantity: 2 }, { materialId: '2', quantity: 2 }] },
  { id: '5', name: '齿轮', level: 3, requirements: [{ materialId: '4', quantity: 1 }, { materialId: '3', quantity: 1 }] },
];

describe('Material Calculation Logic', () => {
  it('should correctly calculate base materials for level 2 item', () => {
    // 1个铁锭 = 2个铁矿 + 1个煤炭
    const result = calculateBaseMaterials(mockMaterials, '3', 1);
    expect(result).toHaveLength(2);
    expect(result.find(r => r.materialId === '1')?.quantity).toBe(2);
    expect(result.find(r => r.materialId === '2')?.quantity).toBe(1);
  });

  it('should correctly calculate base materials for level 3 item with nested requirements', () => {
    // 1个齿轮 = 1个钢材 + 1个铁锭
    // 1个钢材 = 2个铁锭 + 2个煤炭 = (2*(2铁矿+1煤炭)) + 2煤炭 = 4铁矿 + 4煤炭
    // 1个铁锭 = 2铁矿 + 1煤炭
    // 总计: (4铁矿 + 4煤炭) + (2铁矿 + 1煤炭) = 6铁矿 + 5煤炭
    const result = calculateBaseMaterials(mockMaterials, '5', 1);
    expect(result.find(r => r.materialId === '1')?.quantity).toBe(6);
    expect(result.find(r => r.materialId === '2')?.quantity).toBe(5);
  });

  it('should correctly handle batch calculations', () => {
    const targets = [
      { materialId: '3', quantity: 2 }, // 4铁矿 + 2煤炭
      { materialId: '4', quantity: 1 }, // 4铁矿 + 4煤炭
    ];
    // 总计: 8铁矿 + 6煤炭
    const result = calculateBatchBaseMaterials(mockMaterials, targets);
    expect(result.find(r => r.materialId === '1')?.quantity).toBe(8);
    expect(result.find(r => r.materialId === '2')?.quantity).toBe(6);
  });
});
