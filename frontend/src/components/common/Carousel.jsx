/* eslint-disable eol-last */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable import/no-unresolved */
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { v4 as uuidv4 } from 'uuid';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

import Card from './Card';

function Carousel({ cards }) {
  const responsiveBreakpoints = {
    // 반응형 설정: 작은 화면에서 1개, 중간 화면에서 3개, 데스크톱 화면에서 5개
    200: {
      slidesPerView: 1,
    },
    600: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 4,
    },
    1536: {
      slidesPerView: 5,
    },
  };

  return (
    <div className="ml-44 w-3/4">
      <Swiper
        spaceBetween={5} // 카드 사이 여백
        breakpoints={responsiveBreakpoints}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        autoHeight={true}
      >
        {cards.map((card) => (
          <SwiperSlide key={uuidv4()}>
            <Card
              url={card.url}
              title={card.title}
              writer={card.writer}
              tag={card.tag}
              minPrice={card.minPrice}
              review={card.review}
              reviewWriter={card.reviewWriter}
              rating={card.rating}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;
