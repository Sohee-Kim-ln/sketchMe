/* eslint-disable react/style-prop-object */
import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../../components/common/Carousel';
import { ReactComponent as MainFoot } from '../../assets/icons/MainFooter.svg';

function Main() {
  return (
    <div>
      <div className="relative">
        <img src="img/WallPaper.jpg" alt="" className="opacity-70 z-0" />
        <div className="absolute top-1/3 left-1/4 flex z-10">
          <div className="hidden md:block md:text-5xl font-bold text-black line-height-1_2">
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
      <div className="text-3xl mt-36 ml-44">
        최근그림
      </div>
      <br />
      <Carousel />
      <hr className="w-3/4 ml-44 my-14 opacity-30" />
      <div className="text-3xl ml-44">
        작가
      </div>
      <br />
      <Carousel />
      <hr className="w-3/4 ml-44 my-14 opacity-30" />
      <div className="text-3xl ml-44">
        최근 리뷰
      </div>
      <br />
      <Carousel />
      <div className="flex justify-around w-100% h-[330px] bg-darkgrey">
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
            { '>' }
          </Link>
        </span>
        <MainFoot className="w-60" style={{ height: 'auto' }} />
      </div>
    </div>
  );
}

export default Main;
