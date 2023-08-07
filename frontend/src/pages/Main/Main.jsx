/* eslint-disable react/style-prop-object */
import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../../components/common/Carousel';
import { ReactComponent as MainFoot } from '../../assets/icons/MainFooter.svg';

const cards = [
  // Card 1
  {
    url: 'https://cdna.artstation.com/p/assets/images/images/023/685/508/large/bbo-art-.jpg?1580033578',
    title: 'Card Title 1',
    writer: 'Writer 1',
    tag: ['1인', '따뜻한'],
    minPrice: '1000',
    review: '',
    reviewWriter: 'Review Writer 1',
    rating: '4.3',
  },
  // Card 2
  {
    url: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjhfNDQg/MDAxNTAzODQ2NDEzMDg2.RJv8W8wIt-hLBGKE4S9CzfPp99tScZOXrKr6QdXDQMkg.wL_yxa2DxAu7RIwIEo29f7AidwZLWWaTrj6n7aLfhr0g.JPEG.beesangu/doggabi.jpg?type=w2',
    title: 'Card Title 2',
    writer: 'Writer 2',
    tag: ['커플', '귀여운'],
    minPrice: '2000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '5.0',
  },
  // Card 3
  {
    url: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjhfMTY4/MDAxNTAzODQ2NDE0OTUy.t5hHaV0BLWP1-1qVte_MVzBalvR4osAk66vJ7igq-QAg.arWNcxVIqaRQqAJpP3M5hmGP1-6Ndws_G_UDU2YFPYcg.JPEG.beesangu/hnd.jpg?type=w2',
    title: 'Card Title 3',
    writer: 'Writer 2',
    tag: ['가족', '반려동물', '자연스러운'],
    minPrice: '1000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '3.6',
  },
  // Card 4
  {
    url: 'https://thumb.mtstarnews.com/06/2015/03/2015032011590981232_1.jpg',
    title: 'Card Title 4',
    writer: 'Writer 2',
    tag: ['즐거운', '사실적인, 웃긴, 커플, 1인'],
    minPrice: '2000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '2.4',
  },
  // Card 5
  {
    url: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjhfMyAg/MDAxNTAzODQ2NDE1MDk3.uGZ9OmLbBWU8NLcP1uDvN9vgByhCtk_mI-IlLQBa9dUg.b17ZKIZhAPFLT4cj2rG0t0XHCRTUyURsO11n67cIbhAg.JPEG.beesangu/jyp.jpg?type=w2',
    title: 'Card Title 5',
    writer: 'Writer 2',
    tag: ['가족', '기념일', '사실적인', '웃긴'],
    minPrice: '10000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '5.0',
  },
  // Card 6
  {
    url: 'https://thumb.mtstarnews.com/06/2015/03/2015032011590981232_1.jpg',
    title: 'Card Title 6',
    writer: 'Writer 2',
    tag: ['즐거운', '사실적인, 웃긴, 커플, 1인'],
    minPrice: '2000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '2.4',
  },
  // Card 7
  {
    url: 'https://cdna.artstation.com/p/assets/images/images/023/685/508/large/bbo-art-.jpg?1580033578',
    title: 'Card Title 7',
    writer: 'Writer 1',
    tag: ['1인', '따뜻한'],
    minPrice: '1000',
    review: 'Review 1',
    reviewWriter: 'Review Writer 1',
    rating: '4.3',
  },
  // Card 8
  {
    url: 'https://image.newsis.com/2014/09/24/NISI20140924_0010158036_web.jpg',
    title: 'Card Title 8',
    writer: 'Writer 2',
    tag: ['1인', '커플', '따뜻한', '자연스러운', '웃긴'],
    minPrice: '2000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '4.1',
  },
  // Card 9
  {
    url: 'http://kd.pulip.kr/data/editor/2007/thumb-c930e750673075fbac003df387892cee_1594349225_5303_600x850.jpg',
    title: 'Card Title 9',
    writer: 'Writer 2',
    tag: ['사실적인', '웃긴', '산뜻한'],
    minPrice: '2000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '4.1',
  },
  // Card 10
  {
    url: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjhfMTY4/MDAxNTAzODQ2NDE0OTUy.t5hHaV0BLWP1-1qVte_MVzBalvR4osAk66vJ7igq-QAg.arWNcxVIqaRQqAJpP3M5hmGP1-6Ndws_G_UDU2YFPYcg.JPEG.beesangu/hnd.jpg?type=w2',
    title: 'Card Title 10',
    writer: 'Writer 2',
    tag: ['가족', '반려동물', '자연스러운'],
    minPrice: '1000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '3.6',
  },
];

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
      <Carousel cards={cards} />
      <hr className="w-3/4 ml-44 my-14 opacity-30" />
      <div className="text-3xl ml-44">
        작가
      </div>
      <br />
      <Carousel cards={cards} />
      <hr className="w-3/4 ml-44 my-14 opacity-30" />
      <div className="text-3xl ml-44">
        최근 리뷰
      </div>
      <br />
      <Carousel cards={cards} />
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
