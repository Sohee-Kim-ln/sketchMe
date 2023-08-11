import React from 'react';

import { Toolbar, IconButton } from '@mui/material';

import {
  Brush,
  CallToAction,
  Colorize,
  FormatColorFill,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import {
  updateBrushMode,
  updateBrushSize,
  updateBrushColor,
} from '../../reducers/BrushSlice';

function DrawingToolBar() {
  const dispatch = useDispatch();
  const brushSize = useSelector((state) => state.brush.brushSize);
  const brushMode = useSelector((state) => state.brush.brushMode);

  const handleChangeSize = (e) => {
    dispatch(updateBrushSize(e.target.value));
  };
  const handleClickEraser = () => {
    dispatch(updateBrushMode('eraser'));
  };
  const handleClickBrush = () => {
    dispatch(updateBrushColor('#000000'));
    dispatch(updateBrushMode('brush'));
  };
  const handleClickSpoid = () => {
    dispatch(updateBrushMode('spoid'));
  };
  const handleClickPaint = () => {
    dispatch(updateBrushMode('paint'));
  };

  return (
    <div>
      <Toolbar>
        <div>
          브러쉬 크기
          <input
            type="number"
            value={brushSize}
            min="1"
            onChange={handleChangeSize}
            className="mx-2 w-20 text-center outline outline-1 outline-black"
          />
          <IconButton
            color="inherit"
            className="toolPen"
            id="toolPenButton"
            onClick={handleClickBrush}
          >
            {brushMode === 'brush' ? (
              <Brush style={{ color: '#A77CC7' }} />
            ) : (
              <Brush />
            )}
          </IconButton>
          <IconButton
            color="inherit"
            className="toolEraser"
            id="toolEraserButton"
            onClick={handleClickEraser}
          >
            {brushMode === 'eraser' ? (
              <CallToAction style={{ color: '#A77CC7' }} />
            ) : (
              <CallToAction />
            )}
          </IconButton>
          <IconButton
            color="inherit"
            className="toolSpoid"
            id="toolSpoidButton"
            onClick={handleClickSpoid}
          >
            {brushMode === 'spoid' ? (
              <Colorize style={{ color: '#A77CC7' }} />
            ) : (
              <Colorize />
            )}
          </IconButton>
          <IconButton
            color="inherit"
            className="toolPainter"
            id="toolPainterButton"
            onClick={handleClickPaint}
          >
            {brushMode === 'paint' ? (
              <FormatColorFill style={{ color: '#A77CC7' }} />
            ) : (
              <FormatColorFill />
            )}
          </IconButton>
        </div>
      </Toolbar>
    </div>
  );
}

export default DrawingToolBar;
