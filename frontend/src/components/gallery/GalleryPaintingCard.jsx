/* eslint-disable react/no-array-index-key */
import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import BaseIconBtnGrey from '../common/BaseIconBtnGrey';
import BaseTag from '../common/BaseTag';
import GalleryTag from './GalleryTag';
import API from '../../utils/api';

function GalleryPaintingCard() {
  const categoryId = 3;
  const initialData = {
    title: '인물 사진 그려드려용',
    intro: '프로필 이미지 혹은 명함, 액자 제작, 애인이나 부모님께 선물용으로 추억을 만들어 드립니다.',
    price: '3000',
    images: [
      'https://cdna.artstation.com/p/assets/images/images/023/685/508/large/bbo-art-.jpg?1580033578',
      'https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjhfNDQg/MDAxNTAzODQ2NDEzMDg2.RJv8W8wIt-hLBGKE4S9CzfPp99tScZOXrKr6QdXDQMkg.wL_yxa2DxAu7RIwIEo29f7AidwZLWWaTrj6n7aLfhr0g.JPEG.beesangu/doggabi.jpg?type=w2',
      'https://image.newsis.com/2014/09/24/NISI20140924_0010158036_web.jpg'],
    tags: [{ index: 7, label: '따뜻한' },
      { index: 8, label: '귀여운' },
      { index: 9, label: '웃긴' }],
  };

  // 원본 데이터와 수정 중인 데이터를 상태로 관리
  const [originalData, setOriginalData] = useState(initialData);
  const [currentData, setCurrentData] = useState(initialData);
  const imgInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleTagChange = (newTags) => {
    setCurrentData({
      ...currentData,
      tags: newTags,
    });
  };
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // input 값이 변경되면 수정 중인 데이터를 업데이트
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title' && value.length > 15) {
      return;
    }
    if (name === 'intro' && value.length > 50) {
      return;
    }
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

  const editCategory = async () => {
    Swal.fire({
      icon: 'warning',
      title: '카테고리를 수정 하시겠습니까? ',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const url = '/api/category';
          const body = {
            categoryID: categoryId,
            name: currentData.title,
            description: currentData.intro,
            approximatePrice: currentData.price,
            hashtags: currentData.tags.map((tag) => tag.index),
          };
          const response = await API.put(url, body);
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.log('Error data:', error.response);
          throw error;
        }
      } else {
        return null;
      }
    });
  };

  const handleComplete = () => {
    editCategory();
    setOriginalData(currentData);
    handleEditClick();
  };

  const deleteCategory = async () => {
    Swal.fire({
      icon: 'warning',
      title: '카테고리를 삭제 하시겠습니까? ',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const url = '/api/category';
          const body = {
            categoryID: categoryId,
          };
          const response = await API.delete(url, { data: body });
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.log('Error data:', error.response);
          throw error;
        }
      } else {
        return null;
      }
    });
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
        images: [...currentData.images, reader.result],
      });
    };

    if (file) {
      // 파일이 존재하면 파일을 읽어옵니다.
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (index) => {
    setCurrentData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
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
          {currentData.tags.map((item) => (
            <span key={item.index} className="mr-2 flex mt-1">
              <span><BaseTag message={item.label} /></span>
            </span>
          ))}
        </span>
        <span className="w-fit flex">
          {isEditing ? (
            <span className="flex w-28">
              <input name="price" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" value={currentData.price} type="number" onChange={handleChange} />
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
      <div className="image-list flex">
        <span className="flex overflow-x-auto">
          {currentData.images && currentData.images.map((image, index) => (
            <div key={index} className="flex-shrink-0 m-2">
              <img src={image} className="w-32 h-32 object-cover rounded" alt={`${image}`} />
              {isEditing
                && (
                  <button type="button" onClick={() => handleDeleteImage(index)}>X</button>
                )}
            </div>
          ))}
        </span>
        <span className="flex items-center">
          {isEditing
            && (
              <BaseIconBtnGrey icon="pencil" message="그림 추가" onClick={handleImgBtnClick} />
            )}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            ref={imgInputRef}
            onChange={handleImageUpload}
          />
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
          <span><BaseIconBtnGrey icon="trash" message="카테고리삭제" onClick={deleteCategory} /></span>
        </div>
      </div>
      {isEditing && <GalleryTag tags={currentData.tags} onTagChange={handleTagChange} />}
    </div>
  );
}
export default GalleryPaintingCard;
