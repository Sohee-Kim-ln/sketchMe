/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Card from '../../components/common/Card';

// 카드더미 데이터. title, writer, tag, review, reviewWriter는 꼭 명시해줘야 에러 안남
const cards = [
  // Card 1
  {
    url: 'https://cdna.artstation.com/p/assets/images/images/023/685/508/large/bbo-art-.jpg?1580033578',
    title: '마동석',
    writer: '김싸피님',
    tag: ['1인', '따뜻한'],
    minPrice: '1000',
    review: '',
    reviewWriter: 'Review Writer 1',
    rating: '4.3',
  },
  // Card 2
  {
    url: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjhfNDQg/MDAxNTAzODQ2NDEzMDg2.RJv8W8wIt-hLBGKE4S9CzfPp99tScZOXrKr6QdXDQMkg.wL_yxa2DxAu7RIwIEo29f7AidwZLWWaTrj6n7aLfhr0g.JPEG.beesangu/doggabi.jpg?type=w2',
    title: '공유 2',
    writer: '작가 2',
    tag: ['커플', '귀여운'],
    minPrice: '2000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '5.0',
  },
  // Card 3
  {
    url: 'https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjhfMTY4/MDAxNTAzODQ2NDE0OTUy.t5hHaV0BLWP1-1qVte_MVzBalvR4osAk66vJ7igq-QAg.arWNcxVIqaRQqAJpP3M5hmGP1-6Ndws_G_UDU2YFPYcg.JPEG.beesangu/hnd.jpg?type=w2',
    title: '호날두',
    writer: '씨몽키',
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
    tag: ['즐거운', '사실적인', '웃긴', '커플', '1인'],
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
    tag: ['즐거운', '사실적인', '웃긴', '커플', '1인'],
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
  // Card 11
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
  // Card 12
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
  // Card 13
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
  // Card 14
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
  // Card 15
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
  // Card 16
  {
    url: 'https://thumb.mtstarnews.com/06/2015/03/2015032011590981232_1.jpg',
    title: 'Card Title 4',
    writer: 'Writer 2',
    tag: ['즐거운', '사실적인', '웃긴', '커플', '1인'],
    minPrice: '2000',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    rating: '2.4',
  },
  // Card 17
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
  // Card 18
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
  // Card 19
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
  // Card 20
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
  // Card 21
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

const artistCards = [
  {
    url: 'https://d2v80xjmx68n4w.cloudfront.net/gigs/yupLh1617701571.jpg',
    title: '김싸피',
    writer: '1',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    tag: ['가족', '반려동물', '자연스러운'],
  },
  {
    url: 'https://d2v80xjmx68n4w.cloudfront.net/gigs/EojX31685028291.jpg',
    title: '홍길동',
    writer: '2',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    tag: ['사실적인', '웃긴', '산뜻한'],
  },
  {
    url: 'https://d2v80xjmx68n4w.cloudfront.net/gigs/05vus1677505259.jpg',
    title: '이순신',
    writer: '3',
    review: 'Review 2',
    reviewWriter: 'Review Writer 2',
    tag: ['1인', '커플', '따뜻한', '자연스러운', '웃긴'],
  },
];

function SearchTab({ currentPage, setPage }) {
  const selectedButtons = useSelector((state) => state.search.selectedButtons);

  // 현재 주소를 /search/{category}/{keyword}/ 와 같은 식으로 해석하여 초기 탭 및 검색 키워드 설정
  const { pathname } = useLocation();
  // pathname을 '/'를 기준으로 분리하여 category와 keyword를 추출
  const [, category, encodedKeyword] = pathname.split('/').slice(1);
  const keyword = decodeURI(encodedKeyword);
  const initialTab = category === 'artist' ? 1 : 0;

  // 현재 선택된 탭의 인덱스를 관리하는 상태
  const [activeTab, setActiveTab] = useState(initialTab);

  const ITEMS_PER_PAGE = 10; // 페이지당 아이템 개수

  // Function to filter cards based on selectedButtons and selectedTags
  const filteredCards = (activeTab === 0 ? cards : artistCards).filter((card) => {
    const hasAllSelectedButtons = selectedButtons.every((button) => card.tag.includes(button));
    const keywordMatches = (
      card.title.includes(keyword)
      || card.writer.includes(keyword)
      || card.review.includes(keyword)
      || card.reviewWriter.includes(keyword)
    );
    return hasAllSelectedButtons && keywordMatches;
  });

  useEffect(() => {
    // 헤더에서 현재 탭과 다른 탭을 요청했을 때 탭 변경하게 하는 훅
    const newTab = category === 'artist' ? 1 : 0;
    setActiveTab(newTab);
  }, [category]);

  // 현재 페이지에 해당하는 아이템들을 계산하는 함수
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCards.slice(startIndex, endIndex);
  };

  // Tab click handler
  const handleTabClick = (index) => {
    setActiveTab(index);
    setPage(1); // Reset to the first page when tab is clicked
  };

  return (
    <div>
      {/* 탭 메뉴 */}
      <ul className="flex justify-center items-center flex-wrap mt-5 -mb-px">
        <li className="mr-4">
          <Link to={`/search/pic/${keyword}`}>
            <button
              type="button"
              className={`py-2 px-4 font-semibold ${activeTab === 0 ? 'inline-block text-primary hover:border-primary_2 rounded-t-lg py-4 px-4 text-sm font-bold text-center border-transparent border-b-2 active' : 'inline-block rounded-t-lg py-4 px-4 text-sm font-medium text-center  bg-gray-200 text-gray-700'}`}
              onClick={() => handleTabClick(0)}
            >
              그림
            </button>
          </Link>
        </li>
        <li className="mr-4">
          <Link to={`/search/artist/${keyword}`}>
            <button
              type="button"
              className={`py-2 px-4 font-semibold ${activeTab === 1 ? 'inline-block text-primary  hover:border-primary_2 rounded-t-lg py-4 px-4 text-sm font-bold text-center border-transparent border-b-2 active' : 'inline-block rounded-t-lg py-4 px-4 text-sm font-medium text-center  bg-gray-200 text-gray-700'}`}
              onClick={() => handleTabClick(1)}
            >
              작가
            </button>
          </Link>
        </li>
      </ul>

      <div className="flex mt-4 flex-wrap">
        {getCurrentPageItems().map((card) => (
          <div key={uuidv4()} className="px-2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
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
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredCards.length / ITEMS_PER_PAGE) }, (_, index) => (
          <button
            type="button"
            key={index}
            className={`mx-2 px-4 py-2 font-medium rounded-full ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
            }`}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchTab;
