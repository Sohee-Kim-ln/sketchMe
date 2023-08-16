/* eslint-disable import/no-cycle */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LayerList from './LayerList';
import DrawingPallete from './DrawingPallete';
import DrawingCanvas from './DrawingCanvas';
import DrawingPicker from './DrawingPicker';

import {
  addBackground,
  addRough,
  selectLayer,
} from '../../reducers/CanvasSlice';

import LiveInfoBox from '../Live/LiveInfoBox';

function DrawingBox({ showCanvas }) {
  const layersInfo = useSelector((state) => state.canvas.layersInfo);

  const liveStatus = useSelector((state) => state.live.liveStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (layersInfo.length === 0) {
      dispatch(addBackground());
    }
    if (layersInfo.length === 1) {
      dispatch(addRough());
      dispatch(selectLayer(1));
    }
  }, [layersInfo]);
  return (
    <div className="flex">
      {liveStatus}
      <div className="w-80 min-w-[220px] flex flex-col justify-center content-center">
        {/* 상담화면이면 예약정보 추가로 띄움 */}
        {liveStatus === 1 ? <LiveInfoBox /> : <LayerList />}

        <DrawingPicker />
      </div>
      <div className="flex flex-col">
        <DrawingCanvas showCanvas={showCanvas} />
        <DrawingPallete />
      </div>
    </div>
  );
}

export default DrawingBox;
