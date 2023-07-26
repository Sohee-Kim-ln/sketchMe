import React from 'react';
// import ChattingBigPage from './pages/Chatting/ChattingBigPage';
// import ChattingSmallPage from './pages/Chatting/ChattingSmallPage';
import GalleryProfileCard from './components/gallery/GalleryProfileCard';
import './App.css';

function App() {
  return (
    <div className="App h-screen overflow-y-hidden">
      <div className="h-1/7 bg-white">여기에 헤더(NavBar) 놓을 거예요</div>
      <div className="h-screen bg-primary relative">
        <GalleryProfileCard />
      </div>
    </div>
  );
}

export default App;
