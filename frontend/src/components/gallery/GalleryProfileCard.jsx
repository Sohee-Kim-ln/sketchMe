import React from 'react';
import BaseIconBtnPurple from '../common/BaseIconBtnPurple';
import BaseIconBtnWhite from '../common/BaseIconBtnWhite';
import BaseIconBtnGrey from '../common/BaseIconBtnGrey';
import { ReactComponent as StarIcon } from '../../assets/icons/Star.svg';

function GalleryProfileCard() {
  return (
    <div className="relative flex justify-center items-center mx-auto bg-white shadow-2xl p-1 rounded-lg mx-4 md:mx-auto min-w-1xl max-w-md md:max-w-5xl ">
      <div className="flex w-full items-start px-4 py-4">
        <img className="w-1/5 h-full rounded-xs object-cover mr-4 shadow" src="https://source.unsplash.com/vpOeXr5wmR4/600x600" alt="avatar" />
        <div className="">
          <h2 className="flex items-center justify-between text-lg font-semibold text-gray-900 mt-1">김싸피</h2>
          <div className="flex items-center hidden md:block">
            <div className="flex mr-2 text-gray-700 mr-3">
              <StarIcon />
              <span><div className="text-xs text-grey">4.5</div></span>
              <span><div className="text-xs text-grey">&#40;67건&#41;</div></span>
              <span><div className="text-xs text-grey">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;32명이 좋아한 작가입니다</div></span>

            </div>
          </div>
          <div className="absolute bottom-5 flex items-center mt-15 hidden md:block">
            <div className="mr-2 text-start text-gray-700 mr-3 ">
              <div className="text-xs text-black">3000원~</div>
              <div className="text-xs text-black">#동물 #츤데레남 #친구 #연인</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute  top-4 right-4 hidden md:block">
        <div><BaseIconBtnGrey icon="pencil" message="수정하기" /></div>
        <div className="text-xs mt-1">작가 그만두기</div>
        <div className="text-xs">작가 비활성화</div>
      </div>
      <div className="absolute  bottom-4 right-4">
        <div className="mb-1"><BaseIconBtnPurple icon="message" message="문의하기" /></div>
        <div><BaseIconBtnWhite icon="calendar" message="예약하기" /></div>
      </div>
    </div>
  );
}
export default GalleryProfileCard;
