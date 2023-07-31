import React, { useState } from 'react';
import BaseIconBtnGrey from '../common/BaseIconBtnGrey';
import BaseTag from '../common/BaseTag';
import { ReactComponent as CancelIcon } from '../../assets/icons/Cancel.svg';

function GalleryPaintingCard() {
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const initialData = {
    title: '인물 사진 그려드려용',
    intro: '프로필 이미지 혹은 명함, 액자 제작, 애인이나 부모님께 선물용으로 추억을 만들어 드립니다.',
    tag: ['인물', '재밌는', '사실적', '반려동물'],
    price: '3000',
  };

  // 원본 데이터와 수정 중인 데이터를 상태로 관리
  const [originalData, setOriginalData] = useState(initialData);
  const [currentData, setCurrentData] = useState(initialData);

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

  const handleRemoveTag = (tag) => {
    setCurrentData({
      ...currentData,
      tag: currentData.tag.filter((item) => item !== tag),
    });
  };

  return (
    <div className="relative justify-center items-center p-10 mx-auto bg-white shadow-2xl p-1 rounded-lg mx-4 md:mx-auto min-w-1xl max-w-md md:max-w-5xl">
      <div className="flex w-full">
        {isEditing ? (
          <span className="w-2/5 bg-grey"><input name="title" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" value={currentData.title} type="text" onChange={handleChange} /></span>
        ) : (
          <h2 className="text-lg font-semibold text-black mt-1">{currentData.title}</h2>
        )}
      </div>
      <div className="flex w-full mt-2">
        {isEditing ? (
          <span className="w-3/5"><input name="intro" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" value={currentData.intro} type="text" onChange={handleChange} /></span>
        ) : (
          <div className="text-xs text-black">{currentData.intro}</div>
        )}
      </div>
      <div className="flex mt-1 justify-between">
        <span className="flex ">
          {currentData.tag.map((item) => (
            <span key={item} className="mr-2 flex">
              <span><BaseTag message={item} /></span>
              <span>
                {isEditing && (
                  <CancelIcon className="cursor-pointer pt-1 w-4 h-4" onClick={() => handleRemoveTag(item)} />
                )}
              </span>
            </span>
          ))}
        </span>
        <span className="w-fit flex">
          {isEditing ? (
            <span className="flex w-28">
              <input name="price" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" value={currentData.price} type="text" onChange={handleChange} />
              <span className="min-w-fit mt-2">원 ~</span>
            </span>
          )
            : (
              <div className="text-xs text-black">
                {currentData.price}
                원~
              </div>
            )}
        </span>
      </div>
      <div className="absolute top-10 right-4 hidden md:block">
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
          <span><BaseIconBtnGrey icon="trash" message="카테고리삭제" /></span>
        </div>
      </div>
    </div>
  );
}
export default GalleryPaintingCard;
