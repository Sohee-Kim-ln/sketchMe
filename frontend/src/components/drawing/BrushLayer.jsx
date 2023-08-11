// import React, { useRef, useSelector } from 'react';

// function BrushLayer({ drawingRefs }) {
//   // 캔버스 슬라이스 가져오기
//   const thisWidth = useSelector((state) => state.canvas.canvasWidth);
//   const thisHeight = useSelector((state) => state.canvas.canvasHeight);
//   const thisStyle = useSelector((state) => state.canvas.canvasStyle);
// //   const layersInfo = useSelector((state) => state.canvas.layersInfo);
//   const brushRef = useRef(null);
//   const thisLayer = brushRef.current;

//   return (
//     <canvas
//       // ref={mediaRef}
//       ref={brushRef}
//       width={thisWidth}
//       height={thisHeight}
//       style={{
//         ...thisStyle,
//         // visibility: isVisible ? 'visible' : 'hidden',
//         // pointerEvents: 'none', // 클릭 이벤트를 무시하도록 설정
//         // zIndex: layerIndex,
//       }}
//     >
//       캔버스가 지원되지 않는 브라우저입니다. 다른 브라우저를 사용해주세요.
//     </canvas>
//   );
// }
// export default BrushLayer;
