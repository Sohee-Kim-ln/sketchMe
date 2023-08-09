import axios from 'axios';

const API = axios.create({

  baseURL: 'https://sketchme.ddns.net/dev',

});

// // 인증 토큰 설정 함수
// const setAuthToken = (token) => {
//   if (token) {
//     API.defaults.headers.common.Authorization = `Bearer ${token}`;
//   } else {
//     delete API.defaults.headers.common.Authorization;
//   }
// };

// 토큰을 바로 헤더에 넣는 방법
const token = 'eyJ0eXBlIjoiYWNjZXNzIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VySWQiOjExLCJhcnRpc3RJZCI6OSwiaWF0IjoxNjkxNDgwODkyLCJleHAiOjE2OTE0ODI2OTJ9.19Se74MTFmBZjtz5SnFXANZSQdO4_QDIS1ZGuRsD4h8';
API.defaults.headers.common.Authorization = `Bearer ${token}`;

export default API;
