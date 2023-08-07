import React from 'react';
import LayerList from './LayerList';
import DrawingPallete from './DrawingPallete';
import DrawingCanvas from './DrawingCanvas';

function DrawingBox() {
  return (
    <div>
      <LayerList />
      <DrawingCanvas />
      <DrawingPallete />
    </div>
  );
}

export default DrawingBox;
