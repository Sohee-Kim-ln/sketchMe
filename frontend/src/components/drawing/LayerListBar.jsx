import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Toolbar, IconButton, Button } from '@mui/material';
import { AddCircle,AddBox, DeleteForever } from '@mui/icons-material';

import {
  initAll,
  addLayer,
  deleteLayer,
  selectLayer,
  updateRef,
  changeVisible,
  changeSelected,
  updateName,
  updateType,
} from '../../reducers/CanvasSlice';

function layerListBar() {
  const dispatch = useDispatch();

  const layersInfo = useSelector((state) => state.canvas.layersInfo);

  const handleClickAdd = () => {
    console.log('레이어+ 버튼 click');
    dispatch(addLayer('layer'));
  };

  const handleClickDelete = () => {
    console.log('레이어 삭제 버튼 click');

    dispatch(deleteLayer());
  };

  return (
    <div>
      <Toolbar>
        <div>
          <IconButton onClick={handleClickAdd}>
            <AddBox />
          </IconButton>
          <IconButton onClick={handleClickDelete}>
            <DeleteForever />
          </IconButton>
        </div>
      </Toolbar>
    </div>
  );
}

export default layerListBar;
