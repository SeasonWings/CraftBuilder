export type MaterialLevel = 1 | 2 | 3;

export interface MaterialRequirement {
  materialId: string;
  quantity: number;
}

export interface Material {
  id: string;
  name: string;
  level: MaterialLevel;
  icon?: string;
  requirements: MaterialRequirement[];
}

export interface CalculationResult {
  materialId: string;
  name: string;
  quantity: number;
}

export interface DecomposedMaterial extends CalculationResult {
  level: MaterialLevel;
  requirements?: DecomposedMaterial[];
}
