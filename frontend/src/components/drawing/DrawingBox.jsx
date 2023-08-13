/* eslint-disable import/no-cycle */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LayerList from './LayerList';
import DrawingPallete from './DrawingPallete';
import DrawingCanvas from './DrawingCanvas';
import DrawingPicker from './DrawingPicker';

import { addRough } from '../../reducers/CanvasSlice';

import LiveInfoBox from '../Live/LiveInfoBox';

function DrawingBox({ showCanvas }) {
  const liveState = useSelector((state) => state.live.liveState);
  useEffect(() => {
    addRough();
  }, []);
  return (
    <div>
      <div className="w-80 min-w-fit flex flex-col justify-center content-center">
        {/* 상담화면이면 예약정보, 드로잉화면이면 레이어목록 */}
        {liveState === 1 ? <LiveInfoBox /> : <LayerList />}
        <DrawingPicker />
      </div>
      <div>
        <DrawingCanvas showCanvas={showCanvas} />
        <DrawingPallete />
      </div>
    </div>
  );
}

export default DrawingBox;
