/* eslint-disable import/no-cycle */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LayerList from './LayerList';
import DrawingPallete from './DrawingPallete';
import DrawingCanvas from './DrawingCanvas';

import { addRough } from '../../reducers/CanvasSlice';

import LiveInfoBox from '../Live/LiveInfoBox';

function DrawingBox() {
  const liveState = useSelector((state) => state.live.liveState);
  useEffect(() => {
    addRough();
  }, []);
  return (
    <div>
      {/* 상담화면이면 예약정보, 드로잉화면이면 레이어목록 */}
      <div>{liveState === 1 ? <LiveInfoBox /> : <LayerList />}</div>
      <DrawingCanvas />
      <DrawingPallete />
    </div>
  );
}

export default DrawingBox;
