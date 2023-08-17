/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Rating, TextField } from '@mui/material';
import API, { URL } from '../../utils/api';

function ResultPage() {
  // 라이브 리덕스 변수 연동시키기
  const localUserRole = useSelector((state) => state.live.localUserRole);
  const thisMeetingId = useSelector((state) => state.live.meetingId);

  const [rating, setRate] = useState(5);
  const [content, setContent] = useState('');

  const [imgURL, setImgURL] = useState(null);
  const [timelapseURL, setTimelapseURL] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  // 그림 가져오기
  const getImg = async () => {
    const url = `api/final-picture?meetingId=${thisMeetingId}`;
    const resImg = await API.get(url);
    setImgURL(resImg);
  };

  // 타임랩스 가져오기
  const getTimelapse = async () => {
    const url = `api/timelapse?meetingId=${thisMeetingId}`;
    const resTimelapse = await API.get(url);
    console.log(resTimelapse.data.data.timelapseUrl);
    setTimelapseURL(resTimelapse.data.data.timelapseUrl);
  };

  // 후기 등록 버튼 클릭 핸들러
  const handleRegistClick = () => {
    const url = 'api/review';
    const data = { meetingID: thisMeetingId, rating, content };
    const response = API.post(url, data);
  };

  // 최초 렌더링 시 그림, 타임랩스 가져오기
  useEffect(() => {
    getImg();
    getTimelapse();
  }, []);

  return (
    <div className="w-4/5 h-full flex flex-col  gap-y-20">
      <div className="mt-4 md:mt-36 border-2">
        {localUserRole === 'guest' ? (
          <div>
            <Rating
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => {
                setRate(newValue);
              }}
            />
            <TextField
              label="후기"
              placeholder="Placeholder"
              multiline
              rows={4}
              defaultValue={content}
              onChange={(event, newValue) => {
                setContent(newValue);
              }}
            />
            <button type="button" onClick={handleRegistClick}>
              후기 등록하기
            </button>
          </div>
        ) : (
          <div className="text-center">후기 위치</div>
        )}
      </div>
      <div className="text-center text-2xl">예쁜 작품이 완성되었어요!</div>
      <div className="border flex justify-evenly">
        <div className="">
          {timelapseURL ? (
            <img
              src={`${URL}/api/display?imgURL=${timelapseURL}`}
              alt="완성 타임랩스"
              // onClick={handleClickGIF}
            />
          ) : (
            <div>타임랩스를 가져오지 못했습니다</div>
          )}
        </div>
        <div>
          {imgURL ? (
            <img src={`${URL}/api/display?imgURL=${imgURL}`} alt="완성 그림" />
          ) : (
            <div>그림을 가져오지 못했습니다</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
