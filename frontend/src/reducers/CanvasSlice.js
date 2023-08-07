import { createSlice } from '@reduxjs/toolkit';
// import useLayerModel from '../components/drawing/useLayerModel';
import LayerModel from '../components/drawing/LayerModel';
// import { React } from 'react';

const initialState = {
  layersInfo: [],
  activeLayerIndex: -1, //현재 활성화된 레이어 인덱스. -1이면 활성화된 레이어 없음
  deleteTargetIndex: -1,

  lastCreatedLayer: 0,
  canvasWidth: 300,
  canvasHeight: 300,
  canvasStyle: { border: '1px solid black' },
  maxLayerCount: 5,
};

const CanvasSlice = createSlice({
  name: 'DrawingSlice',
  initialState,
  reducers: {
    initAll: (state, action) => {
      state = initialState;
    },
    addLayer: (state, action) => {
      if (state.layersInfo.length === 5) {
        window.alert(`레이어는 최대 ${state.maxLayerCount}개입니다`);
        return;
      }

      const newLayer = LayerModel(
        `레이어${state.lastCreatedLayer + 1}`,
        state.lastCreatedLayer + 1,
        action.payload
      );
      state.lastCreatedLayer++;
      // state.layersInfo = state.layersInfo.concat(newLayer);
      state.layersInfo.push(newLayer);
      console.log(state.layersInfo);
    },
    deleteLayer: (state, action) => {
      if (state.activeLayerIndex === -1) return;
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
    changeSelected: (state, action) => {
      //
    },
    updateName: (state, action) => {
      const { index, value } = action.payload;
      state.layersInfo[index].name = value;
    },
    updateType: (state, action) => {
      //
    },
  },
});

export default CanvasSlice;
export const {
  initAll,
  addLayer,
  deleteLayer,
  selectLayer,
  updateRef,
  changeVisible,
  changeSelected,
  updateName,
  updateType,
} = CanvasSlice.actions;
