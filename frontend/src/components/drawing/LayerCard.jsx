/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-expressions */
import { React, useState } from 'react';

import {
  CheckBox,
  CheckBoxOutlineBlank,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { IconButton, TextField, Card } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLayer,
  changeVisible,
  updateName,
} from '../../reducers/CanvasSlice';

function LayerCard({ index, visible, name }) {
  const dispatch = useDispatch();

  const activeIndex = useSelector((state) => state.canvas.activeLayerIndex);

  const [isEditing, setIsEditing] = useState(false);
  const [changedName, setChangedName] = useState(name);

  const handleCardClick = () => {
    index === activeIndex
      ? dispatch(selectLayer(-1))
      : dispatch(selectLayer(index));
  };
  const handleNameDblClick = () => {
    if (!isEditing) setIsEditing(true);
    if (isEditing) {
      dispatch(updateName({ index, value: changedName }));
      setIsEditing(false);
    }
  };
  const handleNameChange = (e) => {
    setChangedName(e.target.value);
  };
  const handleNameEnter = (e) => {
    if (!isEditing) return;

    if (e.keyCode === 13) {
      dispatch(updateName({ index, value: changedName }));
      setIsEditing(false);
    }
  };

  const handleClickEye = () => {
    dispatch(changeVisible({ index, value: !visible }));
  };

  return (
    <div>
      <Card className="flex flex-row justify-around">
        <button
          type="button"
          onClick={handleCardClick}
          className="flex flex-row justify-start px-1 grow align-middle "
        >
          {index === activeIndex ? <CheckBox /> : <CheckBoxOutlineBlank />}
          {isEditing ? (
            <TextField
              hiddenLabel
              id="outlined-size-small"
              defaultValue={name}
              variant="filled"
              size="small"
              onChange={handleNameChange}
              onKeyDown={handleNameEnter}
              onDoubleClick={handleNameDblClick}
            />
          ) : (
            <div
              onDoubleClick={handleNameDblClick}
              className="flex justify-center items-center h-100"
            >
              {name}
            </div>
          )}
        </button>

        <IconButton onClick={handleClickEye}>
          {visible ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </Card>
    </div>
  );
}

export default LayerCard;
