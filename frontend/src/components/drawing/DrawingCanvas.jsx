/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable no-confusing-arrow */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-cycle */
import React, { useState, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';

import { MediaRefContext } from '../../pages/Live/LivePage';

import DrawingLayer from './DrawingLayer';
import DrawingToolBar from './DrawingToolBar';
import MediaLayer from './MediaLayer';

function DrawingCanvas({ showCanvas }) {
  // 캔버스 슬라이스 가져오기
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  const maxLayerCount = useSelector((state) => state.canvas.maxLayerCount);
  const canvasWidth = useSelector((state) => state.canvas.canvasWidth);
  const canvasHeight = useSelector((state) => state.canvas.canvasHeight);

  // 레이어 ref 저장용
  const [drawingRefs] = useState(
    Array(maxLayerCount + 2)
      .fill(null)
      .map(() => useRef(null))
  );

  // 미디어 ref 저장용
  // const mediaRef = useRef(null);
  const mediaRef = useContext(MediaRefContext);

  // 추후 레이어 최대 갯수에 따라 확장 가능하게 수정할 것. index가 z축이 되도록 수정 완료
  // const zIndex = [5, 4, 3, 2, 1];

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
      </div>
      <DrawingToolBar />
      {/* <MediaLayer
        drawingRefs={drawingRefs}
        ref={mediaRef}
        showCanvas={showCanvas}
      /> */}
    </div>
  );
}

export default DrawingCanvas;
