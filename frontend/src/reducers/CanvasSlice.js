import { createSlice } from '@reduxjs/toolkit';
// import useLayerModel from '../components/drawing/useLayerModel';
import LayerModel from '../components/drawing/LayerModel';
// import { React } from 'react';

const initialState = {
  layersInfo: [],
  activeLayerIndex: -1, //현재 활성화된 레이어 인덱스. -1이면 활성화된 레이어 없음

  lastCreatedLayer: 0,
  canvasWidth: 300,
  canvasHeight: 300,
  canvasStyle: { border: '1px solid black' },
  maxLayerCount: 5,

  mediaLayerFPS: 30,
};

const CanvasSlice = createSlice({
  name: 'DrawingSlice',
  initialState,
  reducers: {
    initAll: (state, action) => {
      state = initialState;
    },
    addRough: (state, action) => {
      const newLayer = LayerModel(
        `밑그림`,
        0,
        'rough'
      );
      state.layersInfo.splice(0, 0, newLayer);
    },
    addLayer: (state, action) => {
      if (state.layersInfo.length === state.maxLayerCount + 1) {
        window.alert(`레이어 최대 갯수에 도달했습니다`);
        return;
      }

      const newLayer = LayerModel(
        `레이어${state.lastCreatedLayer + 1}`,
        state.lastCreatedLayer + 1,
        action.payload
      );
      state.lastCreatedLayer++;
      // state.layersInfo = state.layersInfo.concat(newLayer);
      // state.layersInfo.push(newLayer);
      state.layersInfo.splice(1, 0, newLayer);
      console.log(state.layersInfo);
    },
    deleteLayer: (state, action) => {
      if (state.activeLayerIndex === -1) return;
      if (state.activeLayerIndex === 0) return;

      if (!state.layersInfo[state.activeLayerIndex]) return;
      // state.layersInfo[state.activeLayerIndex].name=undefined;
      const targetId = state.layersInfo[state.activeLayerIndex].id;
      // state.layersInfo.splice(state.activeLayerIndex, 1);
      state.layersInfo = state.layersInfo.filter(
        (layer) => layer.id !== targetId
      );
    },
    selectLayer: (state, action) => {
      state.activeLayerIndex = action.payload;
      console.log(state.activeLayerIndex);
    },
    updateRef: (state, action) => {
      const { index, newRef } = action.payload;
      state.layersInfo[index].ref = newRef;
    },
    changeVisible: (state, action) => {
      const { index, value } = action.payload;
      state.layersInfo[index].visible = value;
    },
    updateName: (state, action) => {
      const { index, value } = action.payload;
      state.layersInfo[index].name = value;
    },
    changeNeedDeleteRef: (state, action) => {
      state.needDeleteRef = action.payload;
    },
  },
});

export default CanvasSlice;
export const {
  initAll,
  addRough,
  addLayer,
  deleteLayer,
  selectLayer,
  updateRef,
  changeVisible,
  updateName,
  changeNeedDeleteRef,
} = CanvasSlice.actions;
