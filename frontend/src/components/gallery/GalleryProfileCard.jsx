import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
<<<<<<< HEAD
import Swal from 'sweetalert2';
=======
>>>>>>> 0d2f0ce07c696dc39e1c25b371bb56a2683a8592
import { setNowChatRoom } from '../../reducers/ChatSlice';
import BaseIconBtnPurple from '../common/BaseIconBtnPurple';
import BaseIconBtnWhite from '../common/BaseIconBtnWhite';
import BaseIconBtnGrey from '../common/BaseIconBtnGrey';
import { ReactComponent as StarIcon } from '../../assets/icons/Star.svg';
import API from '../../utils/api';

function GalleryProfileCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = 1;
  const artistId = 1;
  const [isEditing, setIsEditing] = useState(false);
  // input 태그(사진 업로드) 의 참조
  const imgInputRef = useRef(null);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const initialData = {
    name: '김싸피',
    raiting: '4.5',
    like: '45',
    reviews: '67',
    price: '3000',
    tag: ['인물', '재밌는', '사실적', '반려동물'],
    profileImg: 'https://source.unsplash.com/vpOeXr5wmR4/600x600',
  };
  // 원본 데이터와 수정 중인 데이터를 상태로 관리
  const [originalData, setOriginalData] = useState(initialData);
  const [currentData, setCurrentData] = useState(initialData);

  const stopArtist = async () => Swal.fire({
    icon: 'warning',
    title: '작가를 그만두시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '그만두기',
    cancelButtonText: '취소',
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        const url = '/api/artist/deactivate';
        const response = await API.delete(url);
        console.log('비활성화 성공:', response.data);
        return response.data; // 값을 반환합니다
      } catch (error) {
        console.error('비활성화에 실패했습니다.', error);
        throw error; // 에러를 다시 던져서 Promise를 reject합니다
      }
    } else {
      return null; // 취소되었을 경우에도 값을 반환합니다
    }
  });

  const deactivateArtist = () => {
    Swal.fire({
      icon: 'warning',
      title: '작가 계정을 비활성화 하시겠습니까? ',
      text: '언제든지 돌아올 수 있습니다!',
      showCancelButton: true,
      confirmButtonText: '비활성화',
      cancelButtonText: '취소',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const url = '/api/artist?isOpen=false';
          const response = await API.put(url);
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.error('비활성화에 실패했습니다.', error);
          throw error; // 에러를 다시 던져서 Promise를 reject합니다
        }
      } else {
        return null; // 취소되었을 경우에도 값을 반환합니다
      }
    });
  };

  // input 값이 변경되면 수정 중인 데이터를 업데이트
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentData({
      ...currentData,
      [name]: value,
    });
  };

  // 수정한 내용을 취소하고 원본 데이터로 되돌림
  const handleCancel = () => {
    setCurrentData(originalData);
    handleEditClick();
  };

  const handleComplete = () => {
    setOriginalData(currentData);
    handleEditClick();
  };

  // 파일 선택 버튼을 클릭하면 input 태그를 클릭합니다.
  const handleImgBtnClick = () => {
    imgInputRef.current.click();
  };

  // 이미지 업로드 처리 함수
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // 파일을 읽어서 이미지 URL을 상태에 업데이트합니다.
      setCurrentData({
        ...currentData,
        profileImg: reader.result,
      });
    };

    if (file) {
      // 파일이 존재하면 파일을 읽어옵니다.
      reader.readAsDataURL(file);
    }
  };

  const handleReservationBtnClick = () => {
    window.location.href = '/reservation';
  };

  const goChatting = async () => {
    let data;
    try {
      const url = '/api/chatroom/get';
      const requestData = {
        requestUserID: userId.toString(),
        userIDOfArtist: artistId.toString(),
      };
      const response = await API.post(url, requestData);
      data = response.data.data;
      const room = data;
      dispatch(setNowChatRoom(room));
      navigate('/chatting');
    } catch (error) {
      console.error('채팅방 생성에 실패했습니다.', error);
    }
    return data;
  };
  return (
    <div className="relative flex justify-center items-center mx-auto bg-white shadow-2xl p-1 rounded-lg mx-4 md:mx-auto min-w-1xl max-w-md md:max-w-5xl ">
      <div className="flex w-full items-start px-4 py-4">
        <div className="w-1/5 h-50 mr-4 flex flex-col justify-end overflow-hidden">
          <img className="w-50 h-40 object-cover rounded-xs mb-2 shadow" src={currentData.profileImg} alt="avatar" />
          {isEditing
            && (
              <BaseIconBtnGrey icon="pencil" message="프로필 수정" onClick={handleImgBtnClick} />
            )}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            ref={imgInputRef}
            onChange={handleImageUpload}
          />
        </div>
        <div className="">
          {isEditing ? (
            <span className="w-2/5 bg-grey"><input name="name" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" value={currentData.name} type="text" onChange={handleChange} /></span>
          ) : (
            <h2 className="flex items-center justify-between text-lg font-semibold text-gray-900 mt-1">{currentData.name}</h2>
          )}
          <div className="flex items-center hidden md:block">
            <div className="flex mr-2 text-gray-700 mr-3">
              <StarIcon />
              <span><div className="text-xs text-grey">{currentData.rating}</div></span>
              <span>
                <div className="text-xs text-grey">
                  &#40;
                  {currentData.reviews}
                  건&#41;
                </div>
              </span>
              <span>
                <div className="text-xs text-grey">
                  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  {currentData.like}
                  명이 좋아한 작가입니다
                </div>
              </span>

            </div>
          </div>
          <div className="absolute bottom-10 flex items-center mt-15 hidden md:block">
            <div className="mr-2 text-start text-gray-700 mr-3 ">
              <div className="text-xs text-black">
                {initialData.price}
                원~
              </div>
              <div className="flex text-xs text-black">
                {currentData.tag.map((item) => (
                  <span key={item} className="mr-2 flex">
                    <span>
                      &#35;
                      {' '}
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute  top-4 right-4 hidden md:block">
            <div className="flex w-fit">
              <span className="mr-1">
                {isEditing && (
                  <BaseIconBtnGrey icon="cancel" message="취소하기" onClick={handleCancel} />
                )}
              </span>
              <span className="mr-1">
                {isEditing ? (
                  <BaseIconBtnGrey icon="check" message="완료" onClick={handleComplete} />
                ) : (
                  <BaseIconBtnGrey onClick={handleEditClick} icon="pencil" message="편집" />
                )}
              </span>
            </div>
            <button type="button" className="flex text-xs mt-1 hover:bg-gray-100" onClick={stopArtist}>작가 그만두기</button>
            <button type="button" className="flex text-xs hover:bg-gray-100" onClick={deactivateArtist}>작가 비활성화</button>
          </div>
          <div className="absolute  bottom-4 right-4">
            <div className="mb-1"><BaseIconBtnPurple icon="message" message="문의하기" onClick={goChatting} /></div>
            <div><BaseIconBtnWhite icon="calendar" message="예약하기" onClick={handleReservationBtnClick} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GalleryProfileCard;
