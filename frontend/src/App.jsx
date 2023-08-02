import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainPage from './pages/Main/Main';
import LoginPage from './pages/Login/Login';
import SignupPage from './pages/Signup/Signup';
import RegisterPage from './pages/Register/Register';
import SearchPage from './pages/Search/SearchPage';
import GalleryPage from './pages/Gallery/GalleryPage';
import ChattingPage from './pages/Chatting/ChattingBigPage';
import LivePage from './pages/Live/LivePage';
import MyPage from './pages/MyPage/MyPage';
import Header from './components/common/Header';
import ReservationPage from './pages/Reservation/ReservationPage';
import ChatIcon from './components/chatting/ChattingIcon';

import './App.css';

function App() {
  const location = useLocation();
  // 현재 경로가 /chatting 인지 여부를 확인하여 변수로 저장
  const isChattingRoute = location.pathname === '/chatting';
  const isLoginOrSignup = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');

  return (
    <div className="h-screen overscroll-hidden">
      {!isLoginOrSignup && <Header />}
      <hr />
      <main>
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/signup" element={<SignupPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/search" element={<SearchPage />} />
          <Route exact path="/gallery" element={<GalleryPage />} />
          <Route exact path="/chatting" element={<ChattingPage />} />
          <Route exact path="/live" element={<LivePage />} />
          <Route exact path="/mypage" element={<MyPage />} />
          <Route exact path="/reservation" element={<ReservationPage />} />
        </Routes>
      </main>
      {/* ChatIcon을 렌더링할 때 조건부 렌더링 사용 */}
      {!isChattingRoute && <ChatIcon />}
      {' '}

    </div>
  );
}

export default App;
