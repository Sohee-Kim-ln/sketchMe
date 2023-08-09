import React, { useEffect, forwardRef } from 'react';

import { useSelector} from 'react-redux';

const MediaLayer = forwardRef(function MediaLayer({ drawingRefs }, ref) {
  //캔버스 슬라이스 가져오기
  const thisWidth = useSelector((state) => state.canvas.canvasWidth);
  const thisHeight = useSelector((state) => state.canvas.canvasHeight);
  const thisStyle = useSelector((state) => state.canvas.canvasStyle);
  const mediaLayerFPS = useSelector((state) => state.canvas.mediaLayerFPS);

  //레이어 ref지정
  const thisLayer = ref.current;

  // 1초마다 zipLayers 함수를 실행하는 interval 설정
  useEffect(() => {
    const interval = setInterval(zipLayers, Math.floor(1000 / mediaLayerFPS));

    return () => {
      clearInterval(interval);
    };
  }, [thisLayer]);

  // 레이어들을 하나의 이미지로 만드는 함수
  const zipLayers = () => {
    if (thisLayer === null) return;
    const ctx = thisLayer.getContext('2d');
    ctx.reset();
    drawingRefs.map((thisRef) => {
      if (thisRef.current !== null) ctx.drawImage(thisRef.current, 0, 0);
    });
  };

  return (
    <canvas
      ref={ref}
      width={thisWidth}
      height={thisHeight}
      style={{
        ...thisStyle,
        // visibility: isVisible ? 'visible' : 'hidden',
        // pointerEvents: 'none', // 클릭 이벤트를 무시하도록 설정
        // zIndex: layerIndex,
      }}
    >
      캔버스가 지원되지 않는 브라우저입니다. 다른 브라우저를 사용해주세요.
    </canvas>
  );
});

export default MediaLayer;
