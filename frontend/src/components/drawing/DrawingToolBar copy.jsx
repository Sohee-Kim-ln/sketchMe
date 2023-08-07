import React from 'react';

import { Toolbar, IconButton, Button } from '@mui/material';

import {
  Create,
  Brush,
  CallToAction,
  ColorLens,
  Colorize,
  FormatColorFill,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import {
  updateBrushSize,
  updateBrushIndex,
  updateBrushColor,
  changeIsEraser,
  updateBrushOpacity,
} from '../../reducers/BrushSlice';

function DrawingToolBar() {
  const dispatch = useDispatch();
  const brushSize = useSelector((state) => state.brush.brushSize);
  const brushColor = useSelector((state) => state.brush.brushColor);

  const handleChangeSize = (e) => {
    console.log(e.target.value);
    dispatch(updateBrushSize(e.target.value));
  };
  const handleClickEraser = ()=>{
    dispatch(changeIsEraser());
  }
  const handleClickBrush = ()=>{
    dispatch(updateBrushColor('#000000'));
  }

  return (
    <div>
      <Toolbar>
        <div>
          {/* <IconButton color="inherit" className="toolPen" id="toolPenButton">
            <Create />
          </IconButton> */}
          <IconButton color="inherit" className="toolPen" id="toolPenButton" onClick={handleClickBrush}>
            <Brush />
          </IconButton>
          <input type="number" value={brushSize} min="1" onChange={handleChangeSize}/>
          <IconButton
            color="inherit"
            className="toolEraser"
            id="toolEraserButton"
            onClick={handleClickEraser}
          >
            <CallToAction />
          </IconButton>
          <IconButton
            color="inherit"
            className="toolPalette"
            id="toolPaletteButton"
          >
            <ColorLens color={brushColor} />
            <input type='color'></input>
          </IconButton>
          <IconButton
            color="inherit"
            className="toolSpoid"
            id="toolSpoidButton"
          >
            <Colorize />
          </IconButton>
          <IconButton
            color="inherit"
            className="toolPainter"
            id="toolPainterButton"
          >
            <FormatColorFill />
          </IconButton>
        </div>
      </Toolbar>
    </div>
  );
}

export default DrawingToolBar;
