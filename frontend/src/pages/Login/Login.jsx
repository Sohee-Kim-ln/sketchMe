import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Google } from '../../assets/icons/Google.svg';
import { ReactComponent as Kakao } from '../../assets/icons/KakaoTalk.svg';

function Login() {
  const baseURL = 'https://kauth.kakao.com/oauth/authorize';
  const responseType = 'code';
  const clientID = 'f83fd946b4ea202b6411e9ebb1eb13c8';
  const redirectURI = 'http://25.33.59.121:8000/api/oidc/kakao';

  // 카카오로 시작하기 링크 생성
  const kakaoLoginLink = `${baseURL}?response_type=${responseType}&client_id=${clientID}&redirect_uri=${redirectURI}`;
  return (
    <div className="relative flex justify-center items-center">
      <img src="img/LoginWallPaper.jpg" alt="" className="w-full h-screen object-cover opacity-90" />
      <div className="w-[450px] h-[450px] bg-white flex flex-col items-center rounded-[30px] absolute">
        <Link to="/" className="mt-16 w-[180px]">
          <img src="favi/ms-icon-310x310.png" alt="" className="h-20 mx-auto" />
          <div id="LogoLetter" className="text-center">sketch me</div>
        </Link>
        <Link to="/login/google" className="w-[240px] flex items-center p-2 mt-8 rounded-md bg-white hover:bg-gray-100 shadow-md border border-grey hover:border-black">
          <Google className="h-7 w-7 ms-1 me-7" />
          <div className="font-bold text-black">구글로 로그인</div>
        </Link>
        <Link to={kakaoLoginLink} className="w-[240px] h-[48px] flex items-center p-2 mt-8 rounded-md hover:bg-gray-100 shadow-md border border-grey bg-kakao hover:border-black">
          <Kakao className="h-8 w-8 ms-1 me-5" />
          <div className="font-bold text-black">카카오로 시작하기</div>
        </Link>
        <div className="text-darkgrey text-sm mt-6">
          아직 회원이 아니시라면?
          <Link to="/signup" className="text-black font-bold ms-2 hover:underline">
            가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
