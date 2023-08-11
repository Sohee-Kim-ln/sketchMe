import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tag from './Tag';
import Star from './Star';

// 아이콘명, 가로길이, 세로길이, 메시지를 props 로 받는다.
function Card({
  url, title, writer, tag, minPrice, review, reviewWriter, rating,
}) {
  const imgCss = 'w-[200px] h-[200px] flex rounded-2xl border-4 border-grey';
  const divCss = 'w-[200px] flex flex-col'; // Add 'flex-col' for vertical arrangement
  const wrapperCss1 = 'w-[200px] flex justify-start';
  const wrapperCss2 = 'w-[200px] flex-wrap flex justify-start';

  // 리뷰가 비워져있다면 리뷰, 리뷰작성자, 별점이 렌더링되지 않는다.
  const renderReviewSection = () => {
    if (review !== '') {
      return (
        <>
          <div className="w-[200px]">
            <img src="img/DdaomStart.png" alt="" className="w-4 opacity-50" />
          </div>
          <div className={wrapperCss2}>
            <p>
              {review}
            </p>
          </div>
          <div className="w-[200px] flex justify-end">
            <img src="img/DdaomEnd.png" alt="" className="w-4 opacity-50" />
          </div>
          <div className="w-[200px] flex justify-start">
            <span className="me-3 text-darkgrey">{reviewWriter}</span>
            <Star rate={rating} />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className={divCss}>
      <img src={url} alt="" className={imgCss} />
      <div className={wrapperCss1}>
        <span className="text-[25px] me-3">{title}</span>
        <span className="text-[18px] pt-3">{writer}</span>
      </div>
      <div className={wrapperCss2}>
        {tag.map((item) => (
          <span className="me-4" key={uuidv4()}>
            <Tag message={item} />
          </span>
        ))}
      </div>
      <div className="my-4 text-[18px]">
        {minPrice}
        원~
      </div>
      {renderReviewSection()}
      <p className="mb-20"> </p>
    </div>
  );
}

Card.defaultProps = {
  url: 'https://cdn.spotvnews.co.kr/news/photo/202301/580829_806715_1352.jpg',
  title: '제목',
  writer: '작가이름',
  tag: ['인물', '사실적', '연예인', '포토'],
  minPrice: '1000',
  review: '매우 훌륭한 사진이네요! 다음에 또 그려주세요ㅎㅎ',
  reviewWriter: '리뷰작성자',
  rating: '3.6',
};

export default Card;
