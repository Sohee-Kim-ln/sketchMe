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

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

import Card from './Card';

function Carousel() {
  return (
    <div className="ml-44 w-3/4">
      <Swiper
        slidesPerView={5}
        spaceBetween={200}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        autoHeight={true}
      >
        <SwiperSlide>
          <Card url="https://designmong.kr/web/product/big/201707/203_shop1_902066.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <Card />
        </SwiperSlide>
        <SwiperSlide>
          <Card />
        </SwiperSlide>
        <SwiperSlide>
          <Card />
        </SwiperSlide>
        <SwiperSlide>
          <Card />
        </SwiperSlide>
        <SwiperSlide>
          <Card />
        </SwiperSlide>
        <SwiperSlide>
          <Card />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Carousel;
