import type { Material, CalculationResult, DecomposedMaterial } from '../types/material';

/**
 * 递归计算生产指定数量材料所需的所有基础材料（Level 1）
 */
export const calculateBaseMaterials = (
  materials: Material[],
  targetMaterialId: string,
  targetQuantity: number
): CalculationResult[] => {
  const result: Record<string, number> = {};

  const recurse = (materialId: string, quantity: number) => {
    const material = materials.find((m) => m.id === materialId);
    if (!material) return;

    if (material.level === 1) {
      result[materialId] = (result[materialId] || 0) + quantity;
      return;
    }

    material.requirements.forEach((req) => {
      recurse(req.materialId, req.quantity * quantity);
    });
  };

  recurse(targetMaterialId, targetQuantity);

  return Object.entries(result).map(([id, quantity]) => {
    const material = materials.find((m) => m.id === id);
    return {
      materialId: id,
      name: material?.name || '未知材料',
      quantity,
    };
  });
};

/**
 * 生成详细的分解报告（树状结构）
 */
export const decomposeMaterial = (
  materials: Material[],
  targetMaterialId: string,
  targetQuantity: number
): DecomposedMaterial | null => {
  const material = materials.find((m) => m.id === targetMaterialId);
  if (!material) return null;

  const node: DecomposedMaterial = {
    materialId: material.id,
    name: material.name,
    quantity: targetQuantity,
    level: material.level,
  };

  if (material.level > 1 && material.requirements.length > 0) {
    node.requirements = material.requirements.map((req) => {
      const child = decomposeMaterial(materials, req.materialId, req.quantity * targetQuantity);
      return child!;
    });
  }

  return node;
};

/**
 * 批量计算多种产品的总需求（仅针对基础材料）
 */
export const calculateBatchBaseMaterials = (
  materials: Material[],
  targets: { materialId: string; quantity: number }[]
): CalculationResult[] => {
  const totalResult: Record<string, number> = {};

  targets.forEach((target) => {
    const singleResult = calculateBaseMaterials(materials, target.materialId, target.quantity);
    singleResult.forEach((res) => {
      totalResult[res.materialId] = (totalResult[res.materialId] || 0) + res.quantity;
    });
  });

  return Object.entries(totalResult).map(([id, quantity]) => {
    const material = materials.find((m) => m.id === id);
    return {
      materialId: id,
      name: material?.name || '未知材料',
      quantity,
    };
  });
};
