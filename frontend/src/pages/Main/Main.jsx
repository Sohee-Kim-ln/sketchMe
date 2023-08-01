/* eslint-disable react/style-prop-object */
import React from 'react';
import Carousel from '../../components/common/Carousel';

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
      <div className="text-3xl mt-10 ml-44">
        작가
      </div>
      <br />
      <Carousel />
      <hr />
      <div className="h-40">123</div>
    </div>
  );
}

export default Main;
