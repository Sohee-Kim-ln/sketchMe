import React from 'react';
import { useDispatch } from 'react-redux';

import { Toolbar, IconButton } from '@mui/material';
import { AddBox, DeleteForever } from '@mui/icons-material';

import { addLayer, deleteLayer } from '../../reducers/CanvasSlice';

function layerListBar() {
  const dispatch = useDispatch();

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
