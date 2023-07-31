import React from 'react';
import {
  Link, Route, Routes,
} from 'react-router-dom';
import MainPage from './pages/Main/Main';
import SearchPage from './pages/Search/SearchPage';
import GalleryPage from './pages/Gallery/GalleryPage';
import ChattingPage from './pages/Chatting/ChattingBigPage';
import LivePage from './pages/Live/LivePage';
import MyPage from './pages/MyPage/MyPage';
import ReservationPage from './pages/Reservation/ReservationPage';

import './App.css';

function App() {
  return (
    <div className="h-screen overscroll-hidden">
      <header>
        <ul className="flex item-center">
          <li className="flex-1">
            <Link to="/">메인화면</Link>
          </li>
          <li className="flex-1">
            <Link to="/search">검색페이지</Link>
          </li>
          <li className="flex-1">
            <Link to="/gallery">작가갤러리</Link>
          </li>
          <li className="flex-1">
            <Link to="/chatting">채팅</Link>
          </li>
          <li className="flex-1">
            <Link to="/live">라이브</Link>
          </li>
          <li className="flex-1">
            <Link to="/mypage">마이페이지</Link>
          </li>
        </ul>
      </header>
      <hr />
      <main>
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/search" element={<SearchPage />} />
          <Route exact path="/gallery" element={<GalleryPage />} />
          <Route exact path="/chatting" element={<ChattingPage />} />
          <Route exact path="/live" element={<LivePage />} />
          <Route exact path="/mypage" element={<MyPage />} />
          <Route exact path="/reservation" element={<ReservationPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
