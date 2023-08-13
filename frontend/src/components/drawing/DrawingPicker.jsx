import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SketchPicker, SliderPicker } from 'react-color';

import { updateBrushColor, updateBrushHex } from '../../reducers/BrushSlice';

function DrawingPallete() {
  const dispatch = useDispatch();
  const brushColor = useSelector((state) => state.brush.brushColor);

  const handleOnClick = (color) => {
    dispatch(updateBrushColor(color.rgb));
    dispatch(updateBrushHex(color.hex));
  };

  return (
    <div className="flex flex-col justify-around">
      <SketchPicker color={brushColor} onChange={handleOnClick} />
      <SliderPicker
        color={brushColor}
        onChange={handleOnClick}
        className="w-[220px] h-14 min-h-fit"
      />
    </div>
  );
}

export default DrawingPallete;
