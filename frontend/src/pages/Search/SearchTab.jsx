/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Card from '../../components/common/Card';
import cardHook from '../../utils/cardHook';

function SearchTab({ currentPage, setPage }) {
  // 현재 주소를 /search/{category}/{keyword}로 받아온다
  const { pathname, search } = useLocation();
  const [, category] = pathname.split('/').slice(1);
  const queryParams = new URLSearchParams(search);
  const keyword = queryParams.get('keyword');
  const orderBy = queryParams.get('orderBy') || 'recent';
  const selectedButtons = useSelector((state) => state.search.selectedButtons);
  const initialTab = category === 'artist' ? 1 : 0;

  let endpoint;
  if (category === 'drawing') {
    endpoint = `/api/search/drawing?keyword=${keyword}&orderBy=${orderBy}`;
  } else {
    endpoint = `/api/search/artist?keyword=${keyword}&orderBy=${orderBy}`;
  }

  // 커스텀 훅을 이용하여 api 요청
  const { Data: cards, Loading, Error } = cardHook(endpoint);
  const [activeTab, setActiveTab] = useState(initialTab);

  // 헤더에서 현재 탭과 다른 탭을 요청했을 때 탭 변경하게 하는 훅
  useEffect(() => {
    const newTab = category === 'artist' ? 1 : 0;
    setActiveTab(newTab);
  }, [category]);

  if (Loading) {
    return <div>로딩중</div>; // 또는 로딩 상태에 맞게 처리
  }

  if (Error) {
    return <div>검색결과 불러오기 실패</div>; // 또는 에러 상태에 맞게 처리
  }
  const ITEMS_PER_PAGE = 10; // 페이지당 아이템 개수

  // 선택한 태그들 and 조건으로 필터링
  let filteredCards = [...cards]; // 기본적으로 모든 카드를 포함하도록 설정

  // 테마, 분위기 필터링
  if (selectedButtons.length > 0) {
    filteredCards = cards.filter((card) => {
      if (card.hashtags) {
        const cardHashtags = card.hashtags.map((hashtag) => hashtag.name); // card의 해시태그 이름들을 모아놓은 배열 생성
        const allButtonsIncluded = selectedButtons.every((button) => cardHashtags.includes(button)); // 모든 버튼이 포함되는지 확인
        return allButtonsIncluded;
      }
      return false;
    });
  }
  // 가격 필터링
  if (selectedButtons.includes('~ 1000')) {
    filteredCards = filteredCards.filter((card) => (card.price === null || card.price <= 1000));
  }
  if (selectedButtons.includes('1000 ~ 5000')) {
    filteredCards = filteredCards.filter((card) => card.price >= 1000 && card.price <= 5000);
  }
  if (selectedButtons.includes('5000 ~ 10000')) {
    filteredCards = filteredCards.filter((card) => card.price >= 5000 && card.price <= 10000);
  }
  if (selectedButtons.includes('10000 ~ 50000')) {
    filteredCards = filteredCards.filter((card) => card.price >= 10000 && card.price <= 50000);
  }
  if (selectedButtons.includes('50000 ~')) {
    filteredCards = filteredCards.filter((card) => card.price >= 50000);
  }
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
          <Link to={`/search/drawing/?keyword=${keyword}&orderBy=recent`}>
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
          <Link to={`/search/artist/?keyword=${keyword}&orderBy=recent`}>
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
            <Card {...card} />
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
