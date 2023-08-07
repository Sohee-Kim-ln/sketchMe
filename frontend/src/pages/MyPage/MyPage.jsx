import React from 'react';

import DrawingCanvas from '../../components/drawing/DrawingCanvas';
import DrawingPallete from '../../components/drawing/DrawingPallete';
import LayerList from '../../components/drawing/LayerList';

import { useSelector, useDispatch } from 'react-redux';
import DrawingBox from '../../components/drawing/DrawingBox';

function MyPage() {
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  return (
    <div>
      마이페이지 입니다.
      {/* {layersInfo[0]} */}
      <DrawingBox />

    </div>
  );
}

export default MyPage;
