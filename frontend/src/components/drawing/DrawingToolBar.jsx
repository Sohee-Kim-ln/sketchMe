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
  // const brushColor = useSelector((state) => state.brush.brushColor);

  const handleChangeSize = (e) => {
    dispatch(updateBrushSize(e.target.value));
  };
  const handleClickEraser = () => {
    dispatch(updateBrushMode('eraser'));
  };
  const handleClickBrush = () => {
    dispatch(updateBrushColor('#000000'));
  };
  const handleClickSpoid = () => {
    // dispatch()
  };
  const handleClickPaint = () => {
    //
  };

  return (
    <div>
      <Toolbar>
        <div>
          {/* <IconButton color="inherit" className="toolPen" id="toolPenButton">
            <Create />
          </IconButton> */}
          <IconButton
            color="inherit"
            className="toolPen"
            id="toolPenButton"
            onClick={handleClickBrush}
          >
            <Brush />
          </IconButton>
          <input
            type="number"
            value={brushSize}
            min="1"
            onChange={handleChangeSize}
          />
          <IconButton
            color="inherit"
            className="toolEraser"
            id="toolEraserButton"
            onClick={handleClickEraser}
          >
            <CallToAction />
          </IconButton>
          {/* <IconButton
            color="inherit"
            className="toolPalette"
            id="toolPaletteButton"
          >
            <ColorLens color={brushColor} />
            <input type="color"></input>
          </IconButton> */}
          <IconButton
            color="inherit"
            className="toolSpoid"
            id="toolSpoidButton"
            onClick={handleClickSpoid}
          >
            <Colorize />
          </IconButton>
          <IconButton
            color="inherit"
            className="toolPainter"
            id="toolPainterButton"
            onClick={handleClickPaint}
          >
            <FormatColorFill />
          </IconButton>
        </div>
      </Toolbar>
    </div>
  );
}

export default DrawingToolBar;
