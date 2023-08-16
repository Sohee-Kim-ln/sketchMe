/* eslint-disable no-console */
/* eslint-disable react/style-prop-object */
import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../../components/common/Carousel';
import { ReactComponent as MainFoot } from '../../assets/icons/MainFooter.svg';
import cardHook from '../../utils/cardHook';

function Main() {
  const { Data: recentPictures, Loading: recentPicturesLoading, Error: recentPicturesError } = cardHook('/api/search/drawing?keyword=&orderBy=recent');
  const { Data: artists, Loading: artistsLoading, Error: artistsError } = cardHook('/api/search/artist?keyword=&orderBy=recent');
  if (recentPicturesLoading || artistsLoading) {
    return <div>로딩중</div>; // 또는 로딩 상태에 맞게 처리
  }

  if (recentPicturesError || artistsError) {
    return <div>그림 또는 작가 불러오기 실패</div>; // 또는 에러 상태에 맞게 처리
  }
  return (
    <div>
      <div className="relative">
        <img src="img/WallPaper.jpg" alt="" className="opacity-70 z-0" />
        <div className="absolute top-1/3 left-1/4 flex z-10">
          <div className="hidden select-none md:block md:text-5xl font-bold text-black line-height-1_2">
            순간을 그림으로
            <br />
            남기세요
            <br />
            <div className="hidden md:block md:text-3xl font-normal pl-1 pt-7">
              반려동물, 친구와 함께!
            </div>
          </div>
        </div>
      </div>
      <br />
      {recentPictures && <Carousel title="최근그림" cards={recentPictures} />}
      <hr className="w-3/4 ml-44 my-14 opacity-30" />
      <br />
      {artists && <Carousel title="작가" cards={artists} />}
      <div className="flex mt-20 justify-around w-100% h-[330px] bg-darkgrey">
        <span className="mt-20 text-2xl font-bold text-white">
          <div className="text-4xl font-bold mb-3">
            <span className="text-beige">캐리커처 작가</span>
            로 활동하면서 수익을 만들어보세요!
          </div>
          <div>
            Sketch Me에서는 누구나 작가로 활동할 수 있어요!
          </div>
          <div className="mb-10">
            캐리커처를 기다리는 사람, 여기 다 모여있어요.
          </div>
          <Link to="/register" className="hover:underline hover:cursor-pointer">
            작가 등록하기 -
            {'>'}
          </Link>
        </span>
        <MainFoot className="w-60" style={{ height: 'auto' }} />
      </div>
    </div>
  );
}

export default Main;
