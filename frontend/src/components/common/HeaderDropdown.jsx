/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      </ul>
    </div>
  );
}

function HeaderDropdown({ name }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    navigate(option); // Navigate to the selected option
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
