import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../main/SearchBar';
import HeaderDropdown from './HeaderDropdown';

function Header() {
  return (
    <div className="flex sticky top-0 h-20 bg-white z-40 align-middle whitespace-nowrap">
      <Link to="/">
        <img src="favi/ms-icon-310x310.png" alt="" className="h-16 inline-block absolute top-2 left-10" />
        <span id="LogoLetter" className="absolute left-24 top-4 ps-4">sketch me</span>
      </Link>
      <header className="flex flex-1 justify-end items-center">
        <ul className="flex item-center pt-7 text-center">
          <li className="flex-1">
            <Link to="/search">검색</Link>
          </li>
          <li className="flex-1 w-20">
            <Link to="/gallery">갤러리</Link>
          </li>
          <li className="flex-1 w-20">
            <Link to="/chatting">채팅</Link>
          </li>
          <li className="flex-1 w-20 mr-10">
            <Link to="/live">라이브</Link>
          </li>
        </ul>
        <div className="flex">
          <SearchBar />
        </div>
      </header>
      <div className="flex items-center pr-8">
        <Link to="/login">로그인</Link>
      </div>
      <div className="flex items-center pr-8">
        <Link to="/signup">회원가입</Link>
      </div>
      <Link to="/mypage" className="flex items-center pr-8">
        <img className="w-16 rounded-full" src="https://ynoblesse.com/wp-content/uploads/2022/08/297975306_1008248209844272_696700848492592655_n.jpg" alt="" />
      </Link>
      <HeaderDropdown name="고영희" />
    </div>
  );
}

export default Header;
