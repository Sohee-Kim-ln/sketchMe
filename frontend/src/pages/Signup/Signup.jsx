import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Google } from '../../assets/icons/Google.svg';
import { ReactComponent as Kakao } from '../../assets/icons/KakaoTalk.svg';

function Signup() {
  return (
    <div className="relative flex justify-center items-center">
      <img src="img/LoginWallPaper.jpg" alt="" className="w-full h-screen object-cover opacity-90" />
      <div className="w-[450px] h-[450px] bg-white flex flex-col items-center rounded-[30px] absolute">
        <Link to="/" className="mt-16 w-[180px]">
          <img src="favi/ms-icon-310x310.png" alt="" className="h-20 mx-auto" />
          <div id="LogoLetter" className="text-center">sketch me</div>
        </Link>
        <Link to="/signup/google" className="w-[240px] flex items-center p-2 mt-8 rounded-md bg-white hover:bg-gray-100 shadow-md border border-grey hover:border-black">
          <Google className="h-7 w-7 ms-1 me-7" />
          <div className="font-bold text-black">구글로 가입하기</div>
        </Link>
        <Link to="/signup/kakao" className="w-[240px] h-[48px] flex items-center p-2 mt-8 rounded-md hover:bg-gray-100 shadow-md border border-grey bg-kakao hover:border-black">
          <Kakao className="h-8 w-8 ms-1 me-5" />
          <div className="font-bold text-black">카카오로 가입하기</div>
        </Link>
        <div className="text-darkgrey text-sm mt-6">
          이미 회원이시라면?
          <Link to="/login" className="text-black font-bold ms-2 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
