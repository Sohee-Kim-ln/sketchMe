import React, { useState } from 'react';
import GalleryPaintingCard from '../../components/gallery/GalleryPaintingCard';
import { ReactComponent as PlusIcon } from '../../assets/icons/Plus.svg';
import GalleryNewCategoryCard from '../../components/gallery/GalleryNewCategoryCard';

function GalleryPaintingPage() {
  const [showNewCard, setShowNewCard] = useState(false);
  const handleNewCardBtnClick = () => {
    setShowNewCard(!showNewCard);
  };
  return (
    <div className="justify-center items-center mx-auto mt-10 mb-10 pt-10 pb-10 bg-white">
      <div className="mb-5"><GalleryPaintingCard /></div>
      <div className="mb-5"><GalleryPaintingCard /></div>
      <div className="mb-5"><GalleryPaintingCard /></div>
      {showNewCard && <GalleryNewCategoryCard onBtnClick={handleNewCardBtnClick} />}
      {!showNewCard && (
      <button type="button" className="mx-auto flex justify-center" onClick={handleNewCardBtnClick}>
        <PlusIcon />
      </button>
      )}
    </div>
  );
}
export default GalleryPaintingPage;
