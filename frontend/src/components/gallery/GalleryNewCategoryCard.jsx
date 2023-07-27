import React from 'react';
import BaseIconBtnPurple from '../common/BaseIconBtnPurple';
import BaseIconBtnWhite from '../common/BaseIconBtnWhite';

// eslint-disable-next-line react/prop-types
function GalleryNewCategoryCard({ onBtnClick }) {
  const handleCancleBtnClick = () => {
    onBtnClick();
  };
  const handleAddBtnClick = () => {
    onBtnClick();
  };
  return (
    <div className="relative justify-center items-center p-10 mx-auto mb-5 bg-white shadow-2xl p-1 rounded-lg mx-4 md:mx-auto min-w-1xl max-w-md md:max-w-5xl">
      <div className="flex w-full">
        <span className="w-2/5"><input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="제목을 입력해주세요" type="text" /></span>
        <span className="mt-2 mx-5 text-xs font-grey">15자 이내로 입력해주세요</span>
      </div>
      <div className="flex w-full mt-2">
        <span className="w-3/5"><input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="카테고리 소개를 입력해주세요" type="text" /></span>
        <span className="mt-2 mx-5 text-xs font-grey align-middle">
          <div>50자 이내로 입력해주세요</div>
        </span>
      </div>
      <div className="flex w-full mt-2">
        <span className="w-1/5"><input className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="가격을 입력해주세요" type="text" /></span>
        <span className="mt-2 mx-5 text-xs font-grey align-middle">
          <div>100,000원 이하로 입력해주세요</div>
        </span>
      </div>
      <div className="absolute bottom-4 right-10 hidden md:block">
        <div className="flex w-fit">
          <span className="mr-1">
            <button type="button" onClick={handleCancleBtnClick}>
              <BaseIconBtnWhite icon="cancel" message="취소" />
            </button>
          </span>
          <span className="mr-1">
            <button type="button" onClick={handleAddBtnClick}>
              <BaseIconBtnPurple icon="check" message="추가" />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
export default GalleryNewCategoryCard;
