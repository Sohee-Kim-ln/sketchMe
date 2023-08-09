import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LayerCard from './LayerCard';
import LayerListBar from './LayerListBar';

function LayerList() {
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  const activeIndex = useSelector((state) => {
    state.canvas.activeLayerIndex;
  });

  useEffect(() => {
    console.log(layersInfo);
    if (layersInfo.length !== 0) console.log(layersInfo[0]);
  }, [layersInfo]);

  return (
    <div>
      <div>
        {layersInfo.length !== 0
          ?(
            layersInfo.map((layer, i) => (
              <div>
                {activeIndex}
                <LayerCard
                  key={i}
                  index={i}
                  visible={layer.visible}
                  selected={false}
                  name={layer.name}
                  type={layer.type}
                />
              </div>
            ))
          ).reverse()
          : null}
      </div>
      <LayerListBar />
    </div>
  );
}

export default LayerList;
