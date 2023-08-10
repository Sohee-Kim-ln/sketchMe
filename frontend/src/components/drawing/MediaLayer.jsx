import React, { useEffect, forwardRef } from 'react';
// import React, { useEffect, forwardRef, useContext } from 'react';

import { useSelector } from 'react-redux';
// import { MediaRefContext } from '../../pages/MyPage/MyPage';

const MediaLayer = forwardRef(function MediaLayer({ drawingRefs }, ref) {
  //캔버스 슬라이스 가져오기
  const thisWidth = useSelector((state) => state.canvas.canvasWidth);
  const thisHeight = useSelector((state) => state.canvas.canvasHeight);
  const thisStyle = useSelector((state) => state.canvas.canvasStyle);
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  const mediaLayerFPS = useSelector((state) => state.canvas.mediaLayerFPS);

  //레이어 ref지정
  // const mediaRef = useContext(MediaRefContext);
  // const thisLayer = mediaRef.current;
  const thisLayer = ref.current;

  // 1초마다 zipLayers 함수를 실행하는 interval 설정
  useEffect(() => {
    // console.log(thisLayer);
    const interval = setInterval(zipLayers, Math.floor(1000 / mediaLayerFPS));

    return () => {
      clearInterval(interval);
    };
  }, [thisLayer,layersInfo]);

  // 레이어들을 하나의 이미지로 만드는 함수
  const zipLayers = () => {
    if (thisLayer) {
      const ctx = thisLayer.getContext('2d');
      ctx.reset();

      drawingRefs.map((thisRef, index) => {
        if (
          // thisRef.current !== null
          thisRef.current !== null &&
          index !== 0 &&
          layersInfo[index] &&
          layersInfo[index].visible
        ) {
          console.log(layersInfo);
          // console.log(layersInfo[index].visible);
          ctx.drawImage(thisRef.current, 0, 0);
        }
      });
    }
  };

  return (
    // <div></div>
    <canvas
      // ref={mediaRef}
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
