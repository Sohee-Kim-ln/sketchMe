const LayerModel = (newName, newId, newType) => {
  return {
    visible: true,
    id: newId,
    name: newName,
    type: newType, //'background' | 'rough' | 'layer'
  };
};

export default LayerModel;
