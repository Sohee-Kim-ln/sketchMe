import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import MyPageSideBar from '../../components/MyPage/MyPageSideBar';
import API from '../../utils/api';
import BaseIconBtnGrey from '../../components/common/BaseIconBtnGrey';

function MyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileImgEdited, setIsProfileImgEdited] = useState(false);
  const imgInputRef = useRef(null);

  const initData = {
    nickname: '',
    profileImg: '',
  };

  // 원본 데이터와 수정 중인 데이터를 상태로 관리
  const [originalData, setOriginalData] = useState(initData);
  const [currentData, setCurrentData] = useState(initData);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Data URL을 Blob으로 변환
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n > 0) {
      n -= 1;
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const editProfile = () => {
    Swal.fire({
      icon: 'warning',
      title: '프로필 정보를 수정 하시겠습니까? ',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          // 1) 닉네임 수정
          const url = '/api/user/info';
          const body = {
            nickname: currentData.nickname,
          };
          const result = await API.put(url, body);
          console.log(result.data);

          // 2) 프로필 이미지 수정
          if (isProfileImgEdited) {
            console.log('프로필 이미지 수정 요청도 보내야 함');
            const profileUrl = '/api/user/profile-image?member=user';
            const profileBody = new FormData();
            const blobImage = dataURLtoBlob(currentData.profileImg);
            // 파일 추가
            profileBody.append(
              'uploadFile',
              new File([blobImage], 'profile.jpg', { type: blobImage.type }),
            );
            const profileResult = await API.put(profileUrl, profileBody, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log(profileResult.data);
          }

          setOriginalData(currentData);
          return result.data;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('프로필 수정에 실패했습니다.', error);
          setCurrentData(originalData);
          throw error;
        }
      } else {
        setCurrentData(originalData);
        return null;
      }
    });
    setIsProfileImgEdited(false);
    handleEditClick();
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
    setIsProfileImgEdited(false);
    handleEditClick();
  };

  const handleComplete = () => {
    setOriginalData(currentData);
    editProfile(); // 프로필 수정 axios
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
      setIsProfileImgEdited(true);
    };

    if (file) {
      // 파일이 존재하면 파일을 읽어옵니다.
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = '/api/user/profile?member=user';
        const response = await API.get(url);
        const { data } = response.data;
        console.log(data);
        setOriginalData((prevData) => ({
          ...prevData,
          nickname: data.nickname,
          profileImg: `https://sketchme.ddns.net/api/display?imgURL=${data.profileImgUrl}`,
        }));
        setCurrentData((prevData) => ({
          ...prevData,
          nickname: data.nickname,
          profileImg: `https://sketchme.ddns.net/api/display?imgURL=${data.profileImgUrl}`,
        }));
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다.', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <MyPageSideBar />
      <div className="p-4 sm:ml-64">
        <div className="bg-white shadow-2xl p-1 rounded-lg mx-4 md:mx-auto min-w-1xl max-w-md md:max-w-5xl mx-auto ">
          <div className="relative justify-center items-center">
            <div className="flex w-full items-start px-4 py-4">
              <div>
                <img
                  className="object-contain w-96 h-auto rounded-full"
                  src={currentData.profileImg}
                  alt="User_Profile_Image"
                />
                <div className="mr-1">
                  {isEditing && (
                    <BaseIconBtnGrey
                      icon="pencil"
                      message="프로필 이미지 선택"
                      onClick={handleImgBtnClick}
                    />
                  )}
                </div>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  ref={imgInputRef}
                  onChange={handleImageUpload}
                />
              </div>
              <div>
                <div>닉네임</div>
                {isEditing ? (
                  <span className="w-2/5 bg-grey">
                    <input
                      name="nickname"
                      className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                      value={currentData.nickname}
                      type="text"
                      onChange={handleChange}
                    />
                  </span>
                ) : (
                  <h2 className="flex items-center justify-between text-xl font-semibold text-gray-900 mt-1">
                    {currentData.nickname}
                  </h2>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center w-full px-4 py-4">
              <span className="mr-1">
                {isEditing && (
                  <BaseIconBtnGrey
                    icon="cancel"
                    message="취소하기"
                    onClick={handleCancel}
                  />
                )}
              </span>
              <span className="mr-1">
                {isEditing ? (
                  <BaseIconBtnGrey
                    icon="check"
                    message="완료"
                    onClick={handleComplete}
                  />
                ) : (
                  <BaseIconBtnGrey
                    onClick={handleEditClick}
                    icon="pencil"
                    message="편집"
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
