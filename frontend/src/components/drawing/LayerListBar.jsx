import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Toolbar, IconButton } from '@mui/material';
import { AddBox, DeleteForever } from '@mui/icons-material';

import { addLayer, deleteLayer } from '../../reducers/CanvasSlice';
import { updateMessage } from '../../reducers/LiveSlice';

function layerListBar() {
  const liveStatus = useSelector((state) => state.live.liveStatus);
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  const maxLayerCount = useSelector((state) => state.canvas.maxLayerCount);
  const dispatch = useDispatch();

  const handleClickAdd = () => {
    if (liveStatus === 2) {
      if (layersInfo.length === maxLayerCount + 2) {
        dispatch(updateMessage('레이어 최대 갯수에 도달했습니다'));
        return;
      }
      dispatch(addLayer('layer'));
      return;
    }
    dispatch(updateMessage('상담화면에서는 레이어를 추가할 수 없습니다'));
  };

  const handleClickDelete = () => {
    if (liveStatus === 2) dispatch(deleteLayer());
    else dispatch(updateMessage('상담화면에서는 레이어를 삭제할 수 없습니다'));
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
