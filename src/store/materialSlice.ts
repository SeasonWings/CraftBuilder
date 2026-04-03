import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Material } from '../types/material';

interface MaterialState {
  materials: Material[];
}

const DEFAULT_MATERIALS: Material[] = [
  { id: "1775196258034", name: "点翠晶", level: 1, color: "#4ade80", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775196286012", name: "海藻", level: 1, color: "#38bdf8", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775196303048", name: "蚌壳", level: 1, color: "#38bdf8", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775196310010", name: "珍珠", level: 1, color: "#38bdf8", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202464208", name: "绯云石", level: 1, color: "#4ade80", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202508210", name: "九穗花", level: 1, color: "#4ade80", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202537205", name: "灯芯枝", level: 1, color: "#4ade80", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202622902", name: "玄脉髓", level: 1, color: "#38bdf8", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202633839", name: "玄脉晶", level: 1, color: "#e879f9", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202668354", name: "玄芝根", level: 1, color: "#e879f9", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202684976", name: "玄芝叶", level: 1, color: "#38bdf8", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775202756319", name: "点翠晶石", level: 2, color: "#38bdf8", profession: "雕刻", requirements: [{ materialId: "1775196258034", quantity: 15 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196286012", quantity: 2 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775202797740", name: "绯云晶石", level: 2, color: "#38bdf8", profession: "雕刻", requirements: [{ materialId: "1775202464208", quantity: 20 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196286012", quantity: 2 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775202840962", name: "点翠髓", level: 2, color: "#38bdf8", profession: "锻造", requirements: [{ materialId: "1775196258034", quantity: 15 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196303048", quantity: 2 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775202871975", name: "绯云髓", level: 2, color: "#38bdf8", profession: "锻造", requirements: [{ materialId: "1775202464208", quantity: 20 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196310010", quantity: 2 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775202944788", name: "九穗革", level: 2, color: "#38bdf8", profession: "缝纫", requirements: [{ materialId: "1775202508210", quantity: 15 }, { materialId: "1775196310010", quantity: 2 }, { materialId: "1775196286012", quantity: 1 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775202971886", name: "灯芯革", level: 2, color: "#38bdf8", profession: "缝纫", requirements: [{ materialId: "1775202537205", quantity: 20 }, { materialId: "1775196310010", quantity: 2 }, { materialId: "1775196286012", quantity: 1 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775203038017", name: "九穗花·精", level: 2, color: "#38bdf8", profession: "炼药", requirements: [{ materialId: "1775202508210", quantity: 15 }, { materialId: "1775196286012", quantity: 1 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196310010", quantity: 1 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775203077289", name: "灯芯枝·精", level: 2, color: "#38bdf8", profession: "炼药", requirements: [{ materialId: "1775202537205", quantity: 20 }, { materialId: "1775196286012", quantity: 1 }, { materialId: "1775196303048", quantity: 1 }, { materialId: "1775196310010", quantity: 1 }], productionTime: 30, successRate: 0.95, isTradable: true },
  { id: "1775203119444", name: "珍之精髓", level: 1, color: "#38bdf8", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775203127595", name: "灵之精髓", level: 1, color: "#e879f9", requirements: [], isTradable: true, successRate: 1 },
  { id: "1775203212983", name: "灵晶魄", level: 3, color: "#e879f9", profession: "雕刻", requirements: [{ materialId: "1775202756319", quantity: 1 }, { materialId: "1775202840962", quantity: 1 }, { materialId: "1775203119444", quantity: 10 }, { materialId: "1775202622902", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: false },
  { id: "1775204681686", name: "仙灵魄", level: 3, color: "#e879f9", profession: "雕刻", requirements: [{ materialId: "1775202797740", quantity: 1 }, { materialId: "1775202871975", quantity: 1 }, { materialId: "1775203127595", quantity: 10 }, { materialId: "1775202633839", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: false },
  { id: "1775205236696", name: "刃芒石", level: 3, color: "#e879f9", profession: "锻造", requirements: [{ materialId: "1775202756319", quantity: 1 }, { materialId: "1775202840962", quantity: 1 }, { materialId: "1775203119444", quantity: 10 }, { materialId: "1775202622902", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: false },
  { id: "1775205434558", name: "流星石", level: 3, color: "#e879f9", profession: "锻造", requirements: [{ materialId: "1775202797740", quantity: 1 }, { materialId: "1775202871975", quantity: 1 }, { materialId: "1775203127595", quantity: 10 }, { materialId: "1775202633839", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: false },
  { id: "1775205491297", name: "玄武片", level: 3, color: "#e879f9", profession: "缝纫", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202944788", quantity: 1 }, { materialId: "1775203119444", quantity: 10 }, { materialId: "1775202684976", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: false },
  { id: "1775205547410", name: "镇岳片", level: 3, color: "#e879f9", profession: "缝纫", requirements: [{ materialId: "1775202797740", quantity: 1 }, { materialId: "1775202871975", quantity: 1 }, { materialId: "1775203127595", quantity: 10 }, { materialId: "1775202668354", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: false },
  { id: "1775205782529", name: "会心药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202944788", quantity: 1 }, { materialId: "1775202684976", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
  { id: "1775205823831", name: "调息药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202944788", quantity: 1 }, { materialId: "1775202633839", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
  { id: "1775206009131", name: "专精药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202756319", quantity: 1 }, { materialId: "1775202684976", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
  { id: "1775206044088", name: "破甲药(20)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203038017", quantity: 1 }, { materialId: "1775202756319", quantity: 1 }, { materialId: "1775202684976", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
  { id: "1775206162465", name: "会心药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202971886", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
  { id: "1775206198616", name: "调息药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202971886", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
  { id: "1775206238666", name: "专精药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202797740", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
  { id: "1775206265737", name: "破甲药(25)", level: 3, color: "#e879f9", profession: "炼药", requirements: [{ materialId: "1775203077289", quantity: 1 }, { materialId: "1775202797740", quantity: 1 }, { materialId: "1775202668354", quantity: 2 }], productionTime: 60, successRate: 0.9, isTradable: true },
];

// 从 LocalStorage 加载初始数据
const loadState = (): MaterialState => {
  try {
    const serializedState = localStorage.getItem('material_data');
    if (serializedState === null) {
      return { materials: DEFAULT_MATERIALS };
    }
    return JSON.parse(serializedState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { materials: DEFAULT_MATERIALS };
  }
};

const initialState: MaterialState = loadState();

export const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    addMaterial: (state, action: PayloadAction<Material>) => {
      state.materials.push(action.payload);
      localStorage.setItem('material_data', JSON.stringify(state));
    },
    updateMaterial: (state, action: PayloadAction<Material>) => {
      const index = state.materials.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.materials[index] = action.payload;
        localStorage.setItem('material_data', JSON.stringify(state));
      }
    },
    deleteMaterial: (state, action: PayloadAction<string>) => {
      state.materials = state.materials.filter((m) => m.id !== action.payload);
      // 同时清理其他材料对该材料的依赖
      state.materials.forEach(m => {
        m.requirements = m.requirements.filter(req => req.materialId !== action.payload);
      });
      localStorage.setItem('material_data', JSON.stringify(state));
    },
    importMaterials: (state, action: PayloadAction<Material[]>) => {
      state.materials = action.payload;
      localStorage.setItem('material_data', JSON.stringify(state));
    },
    clearAllMaterials: (state) => {
      state.materials = [];
      localStorage.removeItem('material_data');
    }
  },
});

export const { addMaterial, updateMaterial, deleteMaterial, importMaterials } = materialSlice.actions;

export default materialSlice.reducer;
