/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable no-confusing-arrow */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-cycle */
import React, { useRef, useContext } from 'react';
import { useSelector } from 'react-redux';

import { MediaRefContext } from '../../pages/Live/LivePage';

import DrawingLayer from './DrawingLayer';
import DrawingToolBar from './DrawingToolBar';
import MediaLayer from './MediaLayer';
import BrushLayer from './BrushLayer';

function DrawingCanvas({ drawingRefs, showCanvas }) {
  // 캔버스 슬라이스 가져오기
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  const canvasWidth = useSelector((state) => state.canvas.canvasWidth);
  const canvasHeight = useSelector((state) => state.canvas.canvasHeight);

  // 브러쉬 ref
  const brushRef = useRef(null);
  // 미디어 ref
  const mediaRef = useContext(MediaRefContext);

  // // 특정 인덱스 ref 맨 뒤로 돌리기(레이어 위아래 이동 시 마저 사용 예정)
  // const moveBackRef = (index) => {
  //   const target = drawingRefs[index];
  //   const removed = [...drawingRefs].splice(index, 1);
  //   setDrawingRefs([...removed, target]);
  // };

  return (
    <div>
      <div
        className="relative top-0 left-0"
        style={{ width: canvasWidth, height: canvasHeight }}
      >
        {layersInfo.length !== 0
          ? layersInfo.map((layer, i) =>
              layer !== undefined ? (
                <DrawingLayer
                  key={layer.id}
                  ref={drawingRefs[i]}
                  layerIndex={i}
                  layerName={layer.name}
                  isVisible={layer.visible}
                />
              ) : null
            )
          : null}
        <BrushLayer drawingRefs={drawingRefs} ref={brushRef} />
        <MediaLayer
          drawingRefs={drawingRefs}
          ref={mediaRef}
          showCanvas={showCanvas}
        />
      </div>
      <DrawingToolBar drawingRefs={drawingRefs} />
    </div>
  );
}

export default DrawingCanvas;
