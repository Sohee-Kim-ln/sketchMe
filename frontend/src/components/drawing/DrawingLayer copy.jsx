/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
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
    (state) => state.canvas.activeLayerIndex
  );

  // 브러시 슬라이스 가져오기
  const brushMode = useSelector((state) => state.brush.brushMode);
  const brushSize = useSelector((state) => state.brush.brushSize);
  const brushColor = useSelector((state) => state.brush.brushColor);
  const brushOpacity = useSelector((state) => state.brush.brushOpacity);
  const paintTolerance = useSelector((state) => state.brush.paintTolerance);
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
    console.log(e);

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

  // 색 채우기
  const matchColor = (rgba1, rgba2) => {
    const tolerance = paintTolerance; // 색상 일치 허용 범위
    // console.log(rgba1);
    // console.log(rgba2);
    console.log(
      Math.abs(rgba1.r - rgba2.r) <= tolerance &&
        Math.abs(rgba1.g - rgba2.g) <= tolerance &&
        Math.abs(rgba1.b - rgba2.b) <= tolerance &&
        Math.abs(rgba1.a - rgba2.a) <= tolerance
    );
    return (
      Math.abs(rgba1.r - rgba2.r) <= tolerance &&
      Math.abs(rgba1.g - rgba2.g) <= tolerance &&
      Math.abs(rgba1.b - rgba2.b) <= tolerance &&
      Math.abs(rgba1.a - rgba2.a) <= tolerance
    );
  };

  const fillConnected = (x, y, targetColor) => {
    console.log(x, y);
    const ctx = thisLayer.getContext('2d');
    const imageData = ctx.getImageData(0, 0, thisWidth, thisHeight);
    const pixelStack = [{ x, y }];

    const pixelIndex = (ax, ay) => (ay * thisWidth + ax) * 4;
    console.log(brushColor);
    // for test
    // const poped = pixelStack.pop();
    // // const { nx, ny } = pixelStack.pop();
    // console.log(poped);
    // const index = pixelIndex(poped.x, poped.y);
    // // console.log(index);
    // const [r, g, b, a] = [
    //   imageData.data[index],
    //   imageData.data[index + 1],
    //   imageData.data[index + 2],
    //   imageData.data[index + 3],
    // ];
    // console.log([r, g, b, a]);
    // console.log(targetColor.a);
    const dx = [0, 0, 1, -1];
    const dy = [1, -1, 0, 0];

    while (pixelStack.length) {
      const poped = pixelStack.pop();
      console.log(poped.x, poped.y);
      const index = pixelIndex(poped.x, poped.y);
      const [r, g, b, a] = [
        imageData.data[index],
        imageData.data[index + 1],
        imageData.data[index + 2],
        imageData.data[index + 3],
      ];

      if (matchColor({ r, g, b, a }, targetColor)) {
        console.log('matched');
        imageData.data[index] = brushColor.r;
        imageData.data[index + 1] = brushColor.g;
        imageData.data[index + 2] = brushColor.b;
        imageData.data[index + 3] = brushColor.a * 255;

        for (let i = 0; i < 4; i += 1) {
          if (
            poped.x + dx[i] >= 0 &&
            poped.x + dx[i] < thisWidth &&
            poped.y + dy[i] >= 0 &&
            poped.y + dy[i] < thisWidth
          ) {
            const nextIndex = pixelIndex(poped.x + dx[i], poped.y + dy[i]);
            const nextColor = {
              r: imageData.data[nextIndex],
              g: imageData.data[nextIndex + 1],
              b: imageData.data[nextIndex + 2],
              a: imageData.data[nextIndex + 3],
            };
            console.log('nextColor ', nextColor);

            if (
              !matchColor(nextColor, {
                r: brushColor.r,
                g: brushColor.g,
                b: brushColor.b,
                a: brushColor.a * 255,
              })
            ) {
              pixelStack.push({ x: poped.x + dx[i], y: poped.y + dy[i] });
            }
          }
        }

        // if (poped.x > 0) pixelStack.push({ x: poped.x - 1, y: poped.y });
        // if (poped.x < thisWidth - 1)

        // if (poped.y > 0) pixelStack.push({ x: poped.x, y: poped.y - 1 });
        // if (poped.y < thisHeight - 1)
        //   pixelStack.push({ x: poped.x, y: poped.y + 1 });
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const downPaint = (e) => {
    if (layerIndex !== activeLayerIndex) return;
    if (brushMode !== 'paint') return;
    console.log('paint');

    const { offsetX, offsetY } = e.nativeEvent;

    const ctx = thisLayer.getContext('2d');
    const pixel = ctx.getImageData(offsetX, offsetY, 1, 1).data;

    const pixelColor = {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      a: pixel[3], // /255 해야하나?
    };

    fillConnected(offsetX, offsetY, pixelColor);
  };

  const handleMouseDown = (e) => {
    if (brushMode === 'paint') downPaint(e);
    else downBrush(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingMode) return;
    if (brushMode === 'paint') return;
    moveBrush(e);
  };

  const handleMouseUp = () => {
    if (brushMode === 'paint') return;
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
        // pointerEvents: layerIndex === activeLayerIndex ? 'auto' : 'none', // 클릭 이벤트를 무시하도록 설정
        zIndex: layerIndex,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      // onMouseDownCapture={handleMouseDown}
      // onMouseUpCapture={handleMouseUp}
      // onMouseMoveCapture={handleMouseMove}
      className="absolute top-0 left-0"
    >
      캔버스가 지원되지 않는 브라우저입니다. 다른 브라우저를 사용해주세요.
    </canvas>
  );
});

export default DrawingLayer;
