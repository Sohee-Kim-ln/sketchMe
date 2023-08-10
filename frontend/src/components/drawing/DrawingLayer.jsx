/* eslint-disable no-unused-expressions */
import React, { useState, forwardRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

// import { updateRef } from '../../reducers/CanvasSlice';
import { updatePrevX, updatePrevY } from '../../reducers/BrushSlice';

const DrawingLayer = forwardRef(({ layerIndex, isVisible }, ref) => {
  // const [id, setId] = useState(layerIndex);
  // const [name, setName] = useState(layerName);
  // const [content, setContent] = useState();
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // 캔버스 슬라이스 가져오기
  const thisWidth = useSelector((state) => state.canvas.canvasWidth);
  const thisHeight = useSelector((state) => state.canvas.canvasHeight);
  const thisStyle = useSelector((state) => state.canvas.canvasStyle);
  const activeLayerIndex = useSelector(
    (state) => state.canvas.activeLayerIndex,
  );

  // 브러시 슬라이스 가져오기
  const brushMode = useSelector((state) => state.brush.brushMode);
  const brushSize = useSelector((state) => state.brush.brushSize);
  const brushColor = useSelector((state) => state.brush.brushColor);
  const brushOpacity = useSelector((state) => state.brush.brushOpacity);
  const prevX = useSelector((state) => state.brush.prevX);
  const prevY = useSelector((state) => state.brush.prevY);

  // 레이어 ref지정
  // const layerRef = useRef(null);
  // const thisLayer = layerRef.current;
  // saveRef(layerRef);
  const thisLayer = ref.current;

  // 원 각도 상수
  // const whole = Math.PI * 2;
  // const half = Math.PI;
  // const quarter = Math.PI / 2;

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(updateRef({ index: layerIndex, newRef:layerRef }));
  // }, []);

  const downBrush = (e) => {
    if (layerIndex !== activeLayerIndex) return;
    console.log('down');
    setIsDrawingMode(true);
    const { offsetX, offsetY } = e.nativeEvent;
    dispatch(updatePrevX(offsetX));
    dispatch(updatePrevY(offsetY));

    const ctx = thisLayer.getContext('2d');

    brushMode === 'brush'
      ? (ctx.globalCompositeOperation = 'source-over')
      : (ctx.globalCompositeOperation = 'destination-out');
    ctx.fillStyle = `rgba(${brushColor.r},${brushColor.g},${brushColor.b},${brushColor.a})`;
    ctx.globalAlpha = brushOpacity;
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };

  const moveBrush = (e) => {
    if (layerIndex !== activeLayerIndex) return;
    const ctx = thisLayer.getContext('2d');
    brushMode === 'brush'
      ? (ctx.globalCompositeOperation = 'source-over')
      : (ctx.globalCompositeOperation = 'destination-out');
    ctx.fillStyle = `rgba(${brushColor.r},${brushColor.g},${brushColor.b},${brushColor.a})`;
    ctx.globalAlpha = brushOpacity;
    // 현재 위치 변수에 저장
    const { offsetX, offsetY } = e.nativeEvent;

    // 패스 시작
    ctx.beginPath();
    // 반원 시작각도, 끝각도 계산
    const theta = -Math.atan((offsetX - prevX) / (offsetY - prevY));
    const angleStart = theta;
    const angleEnd = theta + Math.PI;
    // console.log((angleStart * 180) / Math.PI, (angleEnd * 180) / Math.PI);

    // 이전 반원 시작점 -> 이전 반원 끝점 -> 현재 반원 시작점 -> 현재 반원 끝점 -> 이전 반원 끝점
    // 반원 -> 선 -> 반원 -> 선
    ctx.arc(prevX, prevY, brushSize / 2, angleStart, angleEnd);
    ctx.arc(offsetX, offsetY, brushSize / 2, angleEnd, angleStart);

    ctx.fill();

    ctx.arc(prevX, prevY, brushSize / 2, angleEnd, angleStart);
    ctx.arc(offsetX, offsetY, brushSize / 2, angleStart, angleEnd);

    ctx.fill();

    ctx.closePath();
    // 채우기

    // 이전 위치 변수에 현재위치 저장
    dispatch(updatePrevX(offsetX));
    dispatch(updatePrevY(offsetY));
  };

  const upBrush = () => {
    if (layerIndex !== activeLayerIndex) return;
    console.log('up');
    setIsDrawingMode(false);
    const ctx = thisLayer.getContext('2d');
    ctx.beginPath();
  };

  const handleMouseDown = (e) => {
    downBrush(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingMode) return;
    moveBrush(e);
  };

  const handleMouseUp = () => {
    upBrush();
  };

  // const clearAll = () => {
  //   const ctx = thisLayer.getContext('2d');
  //   ctx.reset();
  // };

  return (
    <canvas
      ref={ref}
      width={thisWidth}
      height={thisHeight}
      style={{
        ...thisStyle,
        visibility: isVisible ? 'visible' : 'hidden',
        pointerEvents: layerIndex === activeLayerIndex ? 'auto' : 'none', // 클릭 이벤트를 무시하도록 설정
        zIndex: layerIndex,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseDownCapture={handleMouseDown}
      onMouseUpCapture={handleMouseUp}
      onMouseMoveCapture={handleMouseMove}
      className="absolute top-0 left-0"
    >
      캔버스가 지원되지 않는 브라우저입니다. 다른 브라우저를 사용해주세요.
    </canvas>
  );
});

export default DrawingLayer;
