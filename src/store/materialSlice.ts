import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Material } from '../types/material';

interface MaterialState {
  materials: Material[];
}

// 从 LocalStorage 加载初始数据
const loadState = (): MaterialState => {
  try {
    const serializedState = localStorage.getItem('material_data');
    if (serializedState === null) {
      return { materials: [] };
    }
    return JSON.parse(serializedState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { materials: [] };
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
    }
  },
});

export const { addMaterial, updateMaterial, deleteMaterial, importMaterials } = materialSlice.actions;

export default materialSlice.reducer;
