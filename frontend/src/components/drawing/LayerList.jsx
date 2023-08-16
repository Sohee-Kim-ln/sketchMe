/* eslint-disable indent */
import React from 'react';
import { useSelector } from 'react-redux';
import LayerCard from './LayerCard';
import LayerListBar from './LayerListBar';

function LayerList() {
  const message = useSelector((state) => state.live.message);

  const layersInfo = useSelector((state) => state.canvas.layersInfo);

  return (
    <div className="flex flex-col w-60 gap-1">
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

      <LayerListBar />
      <div>{message}</div>
    </div>
  );
}

export default LayerList;
