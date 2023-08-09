import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const MediaLayer = forwardRef(function MediaLayer({ drawingRefs }, ref) {
  const thisWidth = useSelector((state) => state.canvas.canvasWidth);
  const thisHeight = useSelector((state) => state.canvas.canvasHeight);

  const layerRef = useRef(null);
  const thisLayer = layerRef.current;
  //   const thisLayer = ref.current;
  const ctx = thisLayer.getContext('2d');

  const zipLayers = () => {
    drawingRefs.map((thisRef) => {
      ctx.drawImage(thisRef, 0, 0);
    });
  };

  return (
    <div>
      <canvas
        ref={thisLayer}
        width={thisWidth}
        height={thisHeight}
        style={{
          ...thisStyle,
        }}
      >
        캔버스가 지원되지 않는 브라우저입니다. 다른 브라우저를 사용해주세요.
      </canvas>
      <button onClick={zipLayers}>복사하기</button>
    </div>
  );
});

export default MediaLayer;
