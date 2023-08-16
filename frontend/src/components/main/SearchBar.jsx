import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Dotbogi } from '../../assets/icons/Dotbogi.svg';

function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const [category, setCategory] = useState('artist'); // 드롭다운에서 선택한 값을 상태로 관리
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // 엔터키를 누를 때 '/artist/value' 또는 '/pic/value'로 이동
      navigate(`/search/${category}/?keyword=${searchValue}&orderBy=recent`);
    }
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center flex-1 border border-gray-300 rounded-lg py-2 pr-4">
        <select
          className="px-2 border-r border-gray-300 focus:outline-none"
          defaultValue="artist"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="pic">그림</option>
          <option value="artist">작가</option>
        </select>
        <input
          type="text"
          className="px-2 focus:outline-none"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </div>
      {/* 검색 버튼 */}
      <Link to={`/search/${category}/?keyword=${searchValue}&orderBy=recent`} className="mr-6">
        <button type="button" className="bg-gray-200 rounded-full p-2 focus:outline-none">
          <Dotbogi className="w-5   h-5" />
        </button>
      </Link>
    </div>
  );
}

export default SearchBar;
