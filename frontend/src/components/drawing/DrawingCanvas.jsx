import React from 'react';
import DrawingLayer from './DrawingLayer';
import DrawingToolBar from './DrawingToolBar';
import { useSelector } from 'react-redux';

function DrawingCanvas() {
  //캔버스 슬라이스 가져오기
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  const activeLayerIndex = useSelector(
    (state) => state.canvas.activeLayerIndex
  );
  const canvasWidth = useSelector((state) => state.canvas.canvasWidth);
  const canvasHeight = useSelector((state) => state.canvas.canvasHeight);

  // 추후 레이어 최대 갯수에 따라 확장 가능하게 수정할 것.
  const zIndex = [5, 4, 3, 2, 1];
  return (
    <div>
      <div
        className="relative top-0 left-0 "
        style={{ width: canvasWidth, height: canvasHeight }}
      >
        {layersInfo.length !== 0
          ? layersInfo.map((layer, i) =>
              layer !== undefined ? (
                <DrawingLayer
                  key={layer.id}
                  layerIndex={i}
                  layerName={layer.name}
                  isVisible={layer.visible}
                  isSelected={false}
                  style={{ zIndex: zIndex[i] }}
                />
              ) : null
            )
          : null}
      </div>
      {/* <DrawingLayer
        layerIndex={1}
        layerName={'드로잉 테스트용 임시레이어'}
        isVisible={true}
        isSelected={true}
      /> */}
      <DrawingToolBar />
    </div>
  );
}

export default DrawingCanvas;
