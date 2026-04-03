import type { Material, CalculationResult, DecomposedMaterial, Profession } from '../types/material';

/**
 * 递归计算生产指定数量材料所需的所有基础材料（Level 1）
 * 同时记录每个基础材料是由哪个职业的中间产品所需要的。
 * 直接使用原始数据计算，不包含损耗与缓冲。
 */
export const calculateBaseMaterialsWithProfession = (
  materials: Material[],
  targetMaterialId: string,
  targetQuantity: number,
  parentProfession?: Profession
): Record<string, Record<string, number>> => {
  const result: Record<string, Record<string, number>> = {
    '缝纫': {}, '锻造': {}, '雕刻': {}, '炼药': {}, '烹饪': {}
  };

  const recurse = (
    materialId: string,
    quantity: number,
    currentProfession?: Profession
  ) => {
    const material = materials.find((m) => m.id === materialId);
    if (!material) return;

    if (material.level === 1) {
      if (currentProfession) {
        if (!result[currentProfession][materialId]) {
          result[currentProfession][materialId] = 0;
        }
        result[currentProfession][materialId] += quantity;
      }
      return;
    }

    const nextProfession = material.profession || currentProfession;

    material.requirements.forEach((req) => {
      recurse(req.materialId, req.quantity * quantity, nextProfession);
    });
  };

  const initialMaterial = materials.find((m) => m.id === targetMaterialId);
  const initialProfession = initialMaterial?.profession || parentProfession;
  
  recurse(targetMaterialId, targetQuantity, initialProfession);

  return result;
};

/**
 * 递归计算生产指定数量材料所需的所有基础材料（Level 1）
 * (旧版本，不带职业信息，保留兼容性或简单场景)
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
      finalQuantity: quantity
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
    finalQuantity: targetQuantity,
  };

  if (material.level > 1 && material.requirements.length > 0) {
    node.requirements = material.requirements.map((req) => {
      const child = decomposeMaterial(materials, req.materialId, req.quantity * targetQuantity);
      return child!;
    });
  }

  return node;
};

export interface ProfessionBatchResult {
  profession: Profession;
  materials: CalculationResult[];
}

/**
 * 批量计算多种产品的总需求，并按职业分组（仅针对基础材料）
 */
export const calculateBatchBaseMaterialsByProfession = (
  materials: Material[],
  targets: { materialId: string; quantity: number }[]
): ProfessionBatchResult[] => {
  const professionAggregatedMaterials: Record<string, Record<string, number>> = {
    '缝纫': {}, '锻造': {}, '雕刻': {}, '炼药': {}, '烹饪': {}
  };

  targets.forEach((target) => {
    const targetMaterial = materials.find(m => m.id === target.materialId);
    if (!targetMaterial) return;

    const singleTargetProfessionResults = calculateBaseMaterialsWithProfession(
      materials,
      target.materialId,
      target.quantity,
      targetMaterial.profession
    );

    Object.entries(singleTargetProfessionResults).forEach(([profession, materialQuantities]) => {
      Object.entries(materialQuantities).forEach(([materialId, quantity]) => {
        if (!professionAggregatedMaterials[profession][materialId]) {
          professionAggregatedMaterials[profession][materialId] = 0;
        }
        professionAggregatedMaterials[profession][materialId] += quantity;
      });
    });
  });

  const groupedByProfession: ProfessionBatchResult[] = [];

  Object.entries(professionAggregatedMaterials).forEach(([profession, materialQuantities]) => {
    const materialsList: CalculationResult[] = Object.entries(materialQuantities).map(([id, quantity]) => {
      const material = materials.find((m) => m.id === id);
      return {
        materialId: id,
        name: material?.name || '未知材料',
        quantity: quantity,
        finalQuantity: Math.ceil(quantity),
        profession: profession as Profession
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    if (materialsList.length > 0) {
      groupedByProfession.push({
        profession: profession as Profession,
        materials: materialsList,
      });
    }
  });

  return groupedByProfession.sort((a, b) => a.profession.localeCompare(b.profession));
};

export interface DemandMatrix {
  professions: string[];
  materials: string[];
  data: Record<string, Record<string, number>>;
}

/**
 * 计算“角色-材料”二维需求矩阵（针对中间材料 L2）
 */
export const calculateDemandMatrix = (
  materials: Material[],
  targets: { materialId: string; quantity: number }[]
): DemandMatrix => {
  const matrix: Record<string, Record<string, number>> = {};
  const professions = new Set<string>();
  const materialNames = new Set<string>();

  const recurse = (materialId: string, currentTotalQty: number, currentProfession?: string) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    if (material.level === 2) {
      const prof = material.profession || currentProfession;
      if (prof) {
        professions.add(prof);
        materialNames.add(material.name);
        
        if (!matrix[prof]) matrix[prof] = {};
        matrix[prof][material.name] = (matrix[prof][material.name] || 0) + currentTotalQty;
      }
    }

    material.requirements.forEach(req => {
      recurse(req.materialId, req.quantity * currentTotalQty, material.profession || currentProfession);
    });
  };

  targets.forEach(target => {
    const targetMaterial = materials.find(m => m.id === target.materialId);
    if (targetMaterial) {
      recurse(target.materialId, target.quantity, targetMaterial.profession);
    }
  });

  return {
    professions: Array.from(professions).sort(),
    materials: Array.from(materialNames).sort(),
    data: matrix
  };
};

export interface FlowEdge {
  from: string;
  to: string;
  materialName: string;
  quantity: number;
  transferType: '交易' | '邮件' | '共享仓库' | '自行生产';
  taskId: number; // 用于区分不同生产任务的颜色
}

/**
 * 构建材料流转 DAG
 */
export const calculateFlowDAG = (
  materials: Material[],
  targets: { materialId: string; quantity: number }[]
): FlowEdge[] => {
  const edges: FlowEdge[] = [];
  
  const recurse = (materialId: string, currentTotalQty: number, userProfession: string, taskId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    if (material.level > 1) {
      const producerProfession = material.profession;
      
      if (producerProfession && userProfession && producerProfession !== userProfession) {
        const transferType = material.isTradable === false ? '自行生产' : '交易';
        
        edges.push({
          from: producerProfession,
          to: userProfession,
          materialName: material.name,
          quantity: Math.ceil(currentTotalQty),
          transferType,
          taskId
        });
      }

      material.requirements.forEach(req => {
        recurse(req.materialId, req.quantity * currentTotalQty, producerProfession || userProfession, taskId);
      });
    }
  };

  targets.forEach((target, index) => {
    const targetMaterial = materials.find(m => m.id === target.materialId);
    if (targetMaterial) {
      recurse(target.materialId, target.quantity, '最终目标', index);
    }
  });

  return edges;
};
