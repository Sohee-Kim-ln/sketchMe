import React from 'react';
import {
  Route, Routes,
} from 'react-router-dom';
import MainPage from './pages/Main/Main';
import SearchPage from './pages/Search/SearchPage';
import GalleryPage from './pages/Gallery/GalleryPage';
import ChattingPage from './pages/Chatting/ChattingBigPage';
import LivePage from './pages/Live/LivePage';
import MyPage from './pages/MyPage/MyPage';
import Header from './components/common/Header';
import ReservationPage from './pages/Reservation/ReservationPage';

import './App.css';

function App() {
  return (
    <div className="h-screen overscroll-hidden">
      <Header />
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
