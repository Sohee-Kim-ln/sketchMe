/* eslint-disable no-unused-vars */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSelectedButton } from '../../reducers/SearchSlice';
import Tag from './Tag';
import { URL } from '../../utils/api';
// 아이콘명, 가로길이, 세로길이, 메시지를 props 로 받는다.
function Card({
  id,
  categoryID,
  title,
  cardUrl,
  writerUrl,
  description,
  writer,
  hashtags,
  price,
  rating,
  review,
  reviewWriter,
}) {
  const baseURL = `${URL}/api/display?imgURL=`;
  const imgCss = 'w-[200px] h-[200px] flex rounded-2xl border-4 border-grey';
  const divCss = 'w-[200px] flex flex-col select-none'; // Add 'flex-col' for vertical arrangement
  const wrapperCss2 = 'w-[200px] flex-wrap flex justify-start';
  const fallbackImageUrl = 'https://us.123rf.com/450wm/orla/orla1303/orla130300033/18437114-3d-%EC%82%AC%EB%9E%8C-%EC%82%AC%EB%9E%8C-%EC%82%AC%EB%9E%8C%EA%B3%BC-%EB%AC%BC%EC%9D%8C%ED%91%9C-%EC%82%AC%EC%97%85%EA%B0%80.jpg?ver=6';

  // description의 길이를 체크하여 10자 이상이면 줄여주는 함수
  const filterDescription = (text) => {
    if (text && text.length > 12) {
      return (
        <span className="cursor-pointer text-sm">
          {`${text.slice(0, 12)}...`}
          {' '}
          <span className="font-semibold hover:underline text-xs hover:font-bold">  더보기</span>
        </span>
      );
    }
    return text;
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedButtons = useSelector((state) => state.search.selectedButtons);

  const handleTagClick = (item) => {
    if (!selectedButtons.includes(item)) {
      // 이동 및 Redux 액션 디스패치
      dispatch(addSelectedButton(item));
    }
    navigate('/search/drawing/?keyword=&orderBy=recent');
  };
  const handleKeyPress = (event, item) => {
    if (event.key === 'Enter') {
      handleTagClick(item);
    }
  };
  // 리뷰가 비워져있다면 리뷰, 리뷰작성자, 별점이 렌더링되지 않는다.
  const renderReviewSection = () => {
    if (review !== null) {
      return (
        <>
          <div className="w-[200px]">
            <img src="img/DdaomStart.png" alt="" className="w-2 opacity-50" />
          </div>
          <div className={wrapperCss2}>
            <p>
              {review}
            </p>
          </div>
          <div className="w-[200px] flex justify-end">
            <img src="img/DdaomEnd.png" alt="" className="w-2 opacity-50" />
          </div>
          <div className="w-[200px] flex justify-start">
            <span className="me-3 text-xs text-darkgrey">{reviewWriter}</span>
            <Rating value={parseFloat(rating)} precision={0.1} readOnly />
            {rating}
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className={divCss}>
      <div className="h-80">
        {cardUrl && (
          <img
            src={baseURL + cardUrl}
            alt="이미지가 로드되지 않았을 때 표시될 대체 텍스트"
            onError={(e) => {
              e.target.src = fallbackImageUrl;
            }}
            className={imgCss}
          />
        )}
        <div className="flex items-center mt-1">
          <span>
            {writerUrl && (<img className="w-7 h-7 rounded-full flex-none" src={`${baseURL + writerUrl}`} alt="artistProfileImg" />)}
          </span>
          <span className="ml-3 text-sm flex-grow">{writer}</span>
          {price !== 0 ? (
            <span className="ml-3 text-xs text-right">
              {price}
              {' '}
              원~
            </span>
          ) : (
            <span className="ml-3 text-xs text-right">
              무료~
            </span>
          )}
        </div>
        <div className="font-semibold text-sm my-2">{title}</div>
        <div>{filterDescription(description)}</div>
        <div className={wrapperCss2}>
          {hashtags.map((tag) => (
            <span role="button" className="me-1" key={uuidv4()} onClick={() => handleTagClick(tag.name)} onKeyDown={(event) => handleKeyPress(event, tag.name)} tabIndex={0}>
              <Tag message={tag.name} />
            </span>
          ))}
        </div>
      </div>
      {renderReviewSection()}
      <p className="mb-20"> </p>
    </div>
  );
}

Card.defaultProps = {
  id: null,
  categoryID: null,
  title: null,
  url: null,
  description: null,
  writer: null,
  hashtags: [],
  price: null,
  rating: null,
  review: null,
  reviewWriter: null,
};

export default Card;
