import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../main/SearchBar';
import HeaderDropdown from './HeaderDropdown';
import API from '../../utils/api';

function Header() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/api/user/profile?member=user', {
        });
        setProfileData(response.data.data);
        const id = response.data.data.memberID;
        sessionStorage.setItem('memberID', id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching profile:', error);
      }
    };

    fetchData();
  }, []);

  const renderHeaderContent = () => {
    // Check if user is logged in
    const isLoggedIn = profileData && profileData.memberStatus === 'user' && profileData.logined;

    if (isLoggedIn) {
      return (
        <div className="flex">
          <Link to="/mypage" className="flex items-center pr-8">
            <img className="w-16 rounded-full" src={`http://25.4.167.82:8000/api/display?imgURL=${profileData.profileImgUrl}`} alt="" />
          </Link>
          <HeaderDropdown name={profileData.nickname} />
        </div>
      );
    }
    return (
      <div className="flex items-center px-8">
        <Link to="/login">로그인</Link>
      </div>
    );
  };

  return (
    <div className="flex sticky top-0 h-20 bg-white z-40 align-middle whitespace-nowrap">
      <Link to="/">
        <img src="favi/ms-icon-310x310.png" alt="" className="h-16 inline-block absolute top-2 left-10" />
        <span id="LogoLetter" className="absolute left-24 top-4 ps-4">sketch me</span>
      </Link>
      <header className="flex flex-1 justify-end items-center">
        <ul className="flex item-center pt-7 text-center">
          <li className="flex-1">
            <Link to="/search/pic/">검색</Link>
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
      {renderHeaderContent()}
    </div>
  );
}

export default Header;
