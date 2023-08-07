import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AddCircle, DeleteForever } from '@mui/icons-material';

import { CirclePicker, SketchPicker, SliderPicker } from 'react-color';
import { Toolbar, IconButton } from '@mui/material';

import {
  addColor,
  deleteColor,
  updateBrushColor,
  updateBrushHex,
} from '../../reducers/BrushSlice';

function DrawingPallete() {
  const dispatch = useDispatch();
  const brushColor = useSelector((state) => state.brush.brushColor);
  const brushHex = useSelector((state) => state.brush.brushHex);
  const savedColors = useSelector((state) => state.brush.savedColors);

  const handleOnClick = (color) => {
    dispatch(updateBrushColor(color.rgb));
    dispatch(updateBrushHex(color.hex));
  };

  const handleClickAdd = () => {
    console.log('색상+ 버튼 click');
    dispatch(addColor(brushHex));
  };

  const handleClickDelete = () => {
    console.log('색상 삭제 버튼 click');

    dispatch(deleteColor(brushHex));
  };

  return (
    <div>
      <SketchPicker color={brushColor} onChange={handleOnClick} />

      <div>
        <Toolbar>
          <IconButton onClick={handleClickAdd}>
            <AddCircle />
          </IconButton>
          <IconButton onClick={handleClickDelete}>
            <DeleteForever />
          </IconButton>
        </Toolbar>
        <CirclePicker
          color={brushColor}
          onChange={handleOnClick}
          width="200px"
          colors={savedColors}
        />
      </div>
      <SliderPicker color={brushColor} onChange={handleOnClick} />
    </div>
  );
}

export default DrawingPallete;
