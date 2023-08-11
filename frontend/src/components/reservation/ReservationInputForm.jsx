import React, { useState } from 'react';
import Select from 'react-select';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BaseTag from '../common/BaseTag';
import BaseBtnPurple from '../common/BaseBtnPurple';
import API from '../../utils/api';

function ReservationInputForm({ selectedDate, selectedTime }) {
  const navigate = useNavigate();
  const categories = [
    { value: 1, label: '반려동물 그려드려요' },
    { value: 2, label: '커플 그려드려요' },
    { value: 3, label: '웃기게 그려드려요' },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#7532A8' : provided.borderColor,
      boxShadow: state.isFocused ? '0 0 0 2px #7532A8' : provided.boxShadow,
      '&:hover': {
        borderColor: '#7532A8',
      },
    }),
    option: (styles, {
      isSelected,
    }) => ({
      ...styles,
      backgroundColor: isSelected ? '#6f48eb' : null,
      color: isSelected ? 'white' : 'black',
      '&:active': {
        backgroundColor: '#D9C6E7',
      },
    }),
  };

  const tag = ['인물', '재밌는', '사실적', '반려동물'];

  // 선택된 값들을 state로 관리
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [requestText, setRequestText] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // 카테고리 선택 시 변경을 처리하는 함수
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  // 요청사항 입력 시 변경을 처리하는 함수
  const handleRequestTextChange = (event) => {
    setRequestText(event.target.value);
  };

  // 채팅방 목록을 가져오는 액션
  const meetingApi = async () => {
    let data;
    try {
      const date = dayjs(selectedDate).locale('ko').format('YYYY-MM-DD');
      const time = `${selectedTime}:00`;
      const datetime = `${date}T${time}`;
      const url = '/api/meeting';
      const body = {
        categoryID: 6,
        userID: 11,
        artistID: 1,
        datetime,
        content: requestText,
        isOpen: isChecked,
      };
      const response = await API.post(url, body);
      data = response.data;
      console.log(data);
      Swal.fire({
        text: '예약이 완료되었습니다!',
        confirmButtonText: '확인',
      }).then(() => {
        navigate('/reservationcheck', { state: { reservationId: data.data } });
      });
    } catch (error) {
      console.error('예약에 실패했습니다.', error);
    }
    return data;
  };

  const handleReservationClick = () => {
    if (selectedTime == null) {
      Swal.fire({
        icon: 'warning',
        title: '시간을 선택해주세요',
        confirmButtonText: '확인',
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: '예약',
        text: '예약 확실하나용?',
        showCancelButton: true,
        confirmButtonText: '예약하기',
        cancelButtonText: '취소',
      }).then((res) => {
        /* Read more about isConfirmed, isDenied below */
        if (res.isConfirmed) {
          // axios 예약 보내기
          meetingApi();
        }
      });
    }
  };

  return (
    <div className="justify-center">
      <div className="flex w-full h-16 justify-between">
        <h2 className="w-1/5">서비스명</h2>
        <Select
          className="w-3/5 border-grey"
          options={categories}
          styles={customStyles}
          value={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>
      <div className="flex w-full h-16 justify-between">
        <h2 className="w-1/5">예약일시</h2>
        <div className="w-3/5">
          {dayjs(selectedDate).locale('ko').format('YYYY-MM-DD')}
          {' '}
          {selectedTime}
        </div>
      </div>
      <div className="flex w-full h-16 justify-between">
        <h2 className="w-1/5">태그</h2>
        <div className="w-3/5">
          <div className="flex font-xs text-black">
            {tag.map((item) => (
              <span key={item} className="mr-2 flex">
                <span>
                  <BaseTag message={item} />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <h2 className="w-1/5">요청사항</h2>
        <textarea
          rows="3"
          className="w-3/5 border border-grey px-2 py-1 mb-4  rounded-md focus:outline-primary focus:black break-all"
          type="text"
          placeholder="요청사항을 입력하세요"
          value={requestText}
          onChange={handleRequestTextChange}
        />
      </div>
      <div className="flex w-full h-24 justify-between">
        <h2 className="w-4/5">작가 프로필에 사진이 공개되는 것에 동의합니다.</h2>
        <input
          type="checkbox"
          className="w-4 h-4 text-primary bg-grey border-grey rounded"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="mb-20">
        <BaseBtnPurple message="예약하기" onClick={handleReservationClick} />
      </div>
    </div>
  );
}

export default ReservationInputForm;
