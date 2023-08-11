import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LayerCard from './LayerCard';
import LayerListBar from './LayerListBar';
import { addRough } from '../../reducers/CanvasSlice';

function LayerList() {
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  // const activeIndex = useSelector((state) => state.canvas.activeLayerIndex);

  const dispatch = useDispatch();

  useEffect(() => {
    if (layersInfo.length === 0) dispatch(addRough());
  }, [layersInfo]);

  return (
    <div className="flex flex-col w-60">
      <div>
        {layersInfo.length !== 0
          ? layersInfo
            .map((layer, i) => (
              <LayerCard
                key={layer.name}
                index={i}
                visible={layer.visible}
                selected={false}
                name={layer.name}
                type={layer.type}
              />
            ))
            .reverse()
          : null}
      </div>
      <LayerListBar />
    </div>
  );
}

export default LayerList;
