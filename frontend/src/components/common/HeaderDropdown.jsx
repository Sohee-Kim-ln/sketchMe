/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DropdownMenu({ onSelectOption }) {
  return (
    <div className="absolute top-[81px] right-0 w-40 bg-white shadow-md rounded-md z-50">
      <ul className="py-2">
        <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => onSelectOption('/mypage')}>
          마이페이지
        </li>
        <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => onSelectOption('/reservation')}>
          예약관리
        </li>
        <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => onSelectOption('/profile')}>
          작가 프로필
        </li>
        <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => onSelectOption('/logout')}>
          로그아웃
        </li>
      </ul>
    </div>
  );
}

async function logout() {
  try {
    const accessToken = sessionStorage.getItem('access_token');
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await axios.post('http://25.33.59.121:8000/api/user/logout', null, { headers });
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
    throw error;
  }
}

function HeaderDropdown({ name, setProfileData }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionSelect = (option) => {
    if (option === '/logout') {
      console.log(sessionStorage.getItem('access_token'));
      try {
        logout();

        // 세션 스토리지의 토큰 비우기
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('memberID');

        setProfileData(null);
        // 로그아웃 후 홈페이지로 이동
        navigate('/');
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    } else {
      setSelectedOption(option);
      setShowDropdown(false);
      navigate(option); // Navigate to the selected option
    }
  };

  return (
    <div className="flex sticky top-0 h-20 bg-white z-40 align-middle">
      <div className="relative flex items-center">
        <div className="pr-8 cursor-pointer" onClick={handleDropdownClick}>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{name}</span>
          님
          <span
            className={`ml-1 ${showDropdown ? 'transform rotate-180' : ''}`}
            style={{ display: 'inline-block' }}
          >
            ▼
          </span>
        </div>
        {showDropdown && <DropdownMenu onSelectOption={handleOptionSelect} />}
      </div>
    </div>
  );
}

export default HeaderDropdown;
