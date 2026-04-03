export type MaterialLevel = 1 | 2 | 3;

export interface MaterialRequirement {
  materialId: string;
  quantity: number;
}

export type Profession = '缝纫' | '锻造' | '雕刻' | '炼药' | '烹饪';

export interface Material {
  id: string;
  name: string;
  level: MaterialLevel;
  color?: string;
  profession?: Profession; // 制作该材料所需的职业
  requirements: MaterialRequirement[];
  // 新增属性
  productionTime?: number; // 制作耗时 (秒)
  isBound?: boolean; // 是否绑定 (不可交易)
  successRate?: number; // 制作成功率 (0-1)
  isTradable?: boolean; // 是否可交易 (如果是绑定材料则通常不可交易)
}

export interface CalculationResult {
  materialId: string;
  name: string;
  quantity: number;
  profession?: Profession | '无职业';
  totalLoss?: number; // 损耗数量
  bufferQuantity?: number; // 缓冲库存
  finalQuantity: number; // 最终需求总量 (含损耗和缓冲)
}

export interface DecomposedMaterial extends CalculationResult {
  level: MaterialLevel;
  requirements?: DecomposedMaterial[];
}
