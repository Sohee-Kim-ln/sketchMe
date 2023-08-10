// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';

// import { OpenVidu } from 'openvidu-browser';

// import axios from 'axios';

// import TopBar from '../../components/Live/TopBar';
// import UnderBar from '../../components/Live/UnderBar';
// import WaitingPage from './WaitingPage';
// import ConsultDrawingPage from './ConsultDrawingPage';
// import DrawingPage from './DrawingPage';
// import ResultPage from './ResultPage';

// import UserModel from '../../components/Live/UserModel';

// import {
//   initAll,
//   addLiveStatus,
//   resetLiveStatus,
//   updateHasBeenUpdated,
//   updateProductName,
//   updateMySessionId,
//   updateMyUserName,
//   updateOV,
//   updateSession,
//   updateToken,
//   updatePublisher,
//   updateLocalUser,
//   initSubscribers,
//   addSubscriber,
//   deleteSubscriber,
//   updateSubscribers,
//   updateCurrentVideoDevice,
//   updateWaitingActive,
// } from '../../reducers/LiveSlice';

// function LivePage() {
//   const dispatch = useDispatch();
//   // 차후 우리 서버 연결시 재설정 및 수정될 예정
//   const APPLICATION_SERVER_URL =
//     process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';
//   // : 'https://sketchme.ddns.net/openvidu/';

//   // 리덕스 변수 연동시키기
//   const liveStatus = useSelector((state) => state.live.liveStatus);
//   const hasBeenUpdated = useSelector((state) => state.live.hasBeenUpdated);
//   const mySessionId = useSelector((state) => state.live.mySessionId);
//   const myUserName = useSelector((state) => state.live.myUserName);
//   // const localUser = useSelector((state) => state.live.myUserName);
//   // const subscribers = useSelector((state) => state.live.subscribers);

//   const publisher = useSelector((state) => state.live.publisher);

//   const currentVideoDevice = useSelector(
//     (state) => state.live.currentVideoDevice
//   );
//   const waitingActive = useSelector((state) => state.live.waitingActive);
//   const isMic = useSelector((state) => state.video.micActive);
//   const isAudio = useSelector((state) => state.video.audioActive);
//   const isVideo = useSelector((state) => state.video.videoActive);

//   const [localUser, setLocalUser] = useState(undefined);
//   const [subscribers, setSubscribers] = useState([]);
//   const [OV, setOV] = useState(null);
//   const [session, setSession] = useState(undefined);

//   let thisOV = null;
//   let thisSession = undefined;

//   let thisLocalUser = undefined;
//   let thisSubscribers = [];

//   // // 로컬 유저 객체 저장
//   // dispatch(updateLocalUser(new UserModel()));

//   // 컴포넌트 마운트될 때와 파괴 될 때 실행되는 useEffect
//   useEffect(() => {
//     initLivePage();
//     return () => {
//       initLivePage();
//     };
//   }, []);

//   // 초기화 함수
//   const initLivePage = () => {
//     console.log('라이브 페이지 초기화 실행됨');
//     if (thisSession) thisSession.disconnect();
//     initAll();
//     thisOV = null;
//     thisSession = undefined;
//   };

//   // 오픈비두 객체 생성 및 세션 설정
//   const createOV = async () => {
//     console.log('createOV 실행');

//     const newOV = new OpenVidu();
//     const newSession = newOV.initSession();

//     // 세션의 스트림 생성시 실행
//     newSession.on('streamCreated', (e) => {
//       const subscriber = newSession.subscribe(e.stream, undefined);
//       subscriber.on('streamPlaying', (e) => {
//         // this.checkSomeoneShareScreen();
//         subscriber.videos[0].video.parentElement.classList.remove(
//           'custom-class'
//         );
//       });
//       const newUser = UserModel();
//       newUser.streamManager = subscriber;
//       newUser.connectionId = e.stream.connection.connectionId;
//       newUser.type = 'remote';
//       const nickname = e.stream.connection.data.split('%')[0];
//       newUser.nickname = JSON.parse(nickname).clientData;
//       thisSubscribers.push(newUser);
//       // dispatch(updateSubscribers(newUser));
//       sendMySignalToSubscribers();
//     });

//     // 세션의 스트림 파괴시 실행
//     newSession.on('streamDestroyed', (e) => {
//       thisSubscribers = thisSubscribers.filter(
//         (subs) => subs.streamManager !== e.stream.streamManager
//       );
//       // dispatch(deleteSubscriber(e.stream.streamManager));
//       e.preventDefault();
//     });

//     // 세션의 스트림 예외 발생시 실행
//     newSession.on('exception', (exception) => {
//       console.warn(exception);
//     });

//     // 세션의 스트림에서 유저정보 변화시 실행
//     newSession.on('signal:userChanged', (e) => {
//       const remoteUsers = thisSubscribers;
//       remoteUsers.forEach((user) => {
//         if (user.connectionId === e.from.connectionId) {
//           const data = JSON.parse(e.data);
//           console.log('EVENTO REMOTE: ', e.data);
//           if (data.isAudioActive !== undefined) {
//             user.audioActive = data.isAudioActive;
//           }
//           if (data.isVideoActive !== undefined) {
//             user.videoActive = data.isVideoActive;
//           }
//           if (data.nickname !== undefined) {
//             user.nickname = data.nickname;
//           }
//           if (data.isScreenShareActive !== undefined) {
//             user.screenShareActive = data.isScreenShareActive;
//           }
//         }
//       });
//       thisSubscribers = remoteUsers;
//       // dispatch(updateSubscribers(remoteUsers));
//     });

//     // OV 및 세션 정보 저장
//     setOV(newOV);
//     setSession(newSession);
//     // dispatch(updateSession(newSession));
//     // dispatch(updateOV(newOV));
//     thisOV = newOV;
//     thisSession = newSession;

//     // console.log(newSession);
//     // console.log(newOV);
//   };

//   // 생성된 스트림 구독
//   const subscribeToStreamCreated = () => {   }

//   // 세션 검색 요청
//   const searchSession = async (sessionId) => {
//     console.log('searchSession 실행');
//     // api 합의 필요
//     // const response = await axios.get(
//     //   APPLICATION_SERVER_URL + `api/sessions/${sessionId}`,
//     //   { customSessionId: sessionId },
//     //   {},
//     //   { headers: { 'Content-Type': 'application/json' } }
//     // );
//     return false; //검색 response 합의 필요. false/true 하고 싶은데.
//     // return response.data; //검색 response 합의 필요. false/true 하고 싶은데.
//   };

//   // 세션 생성 요청
//   const createSession = async (sessionId) => {
//     console.log('createSession 실행');

//     const response = await axios.post(
//       APPLICATION_SERVER_URL + 'api/sessions',
//       { customSessionId: sessionId },
//       {},
//       { headers: { 'Content-Type': 'application/json' } }
//     );
//     console.log(response);
//     return response.data; //세션 아이디 반환
//   };

//   // 연결 생성 요청
//   const getToken = async () => {
//     console.log('getToken 실행');

//     const response = await axios.post(
//       APPLICATION_SERVER_URL + 'api/sessions/' + mySessionId + '/connections',
//       // `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
//       {},
//       { headers: { 'Content-Type': 'application/json' } }
//     );
//     console.log(response);
//     return response.data; // 토큰 반환
//   };

//   // 연결 실행
//   const doConnect = async (token) => {
//     console.log('연결하기 시작');
//     await thisSession.connect(token, { clientData: myUserName });
//     // .then(async () => {
//     //   await doConnectCam();
//     // })
//     // .catch((error) => {
//     //   console.log(
//     //     'There was an error connecting  to the session:',
//     //     error.code,
//     //     error.message
//     //   );
//     // });
//     console.log('연결 완료');
//   };

//   // 카메라를 스트림에 연결 및 퍼블리셔 지정
//   const doConnectCam = async () => {
//     console.log('카메라 연결 만들기 실행');
//     const publisher = await thisOV.initPublisherAsync(undefined, {
//       // 오디오소스 undefined시 기본 마이크, 비디오소스 undefined시 웹캠 디폴트
//       audioSource: undefined,
//       videoSource: undefined,
//       publishAudio: true,
//       publishVideo: true,
//       resolution: '640x480',
//       frameRate: 30,
//       insertMode: 'APPEND',
//       mirror: true,
//     });
//     console.log('테스트1');
//     console.log(publisher);
//     //이부분 원 코드 다시 볼 것
//     if (thisSession.capabilities.publish) {
//       publisher.on('accessAllowed', () => {
//         thisSession.publish(publisher).then(() => {
//           sendMySignalToSubscribers();
//           // if (this.props.joinSession) {
//           //     this.props.joinSession();
//           // }
//         });
//       });
//       console.log('테스트2');
//     }

//     // await session.publish(publisher);

//     //디바이스 설정 확인 후 저장
//     console.log('디바이스 설정 시작');
//     await thisOV.getUserMedia({
//       audioSource: undefined,
//       videoSource: undefined,
//     });
//     const devices = await thisOV.getDevices();
//     const videoDevices = devices.filter(
//       (device) => device.kind === 'videoinput'
//     );
//     const currentVideoDeviceId = publisher.stream
//       .getMediaStream()
//       .getVideoTracks()[0]
//       .getSettings().deviceId;
//     const currentVideoDevice = videoDevices.find(
//       (device) => device.deviceId === currentVideoDeviceId
//     );
//     const newLocalUser = UserModel();

//     newLocalUser.connectionId = thisSession.connection.connectionId;
//     newLocalUser.micActive = isMic;
//     newLocalUser.audioActive = isAudio;
//     newLocalUser.videoActive = isVideo;
//     newLocalUser.screenShareActive = false;
//     newLocalUser.nickname = myUserName;
//     newLocalUser.streamManager = publisher;
//     newLocalUser.type = 'local';
//     console.log(newLocalUser);
//     thisLocalUser = newLocalUser;
//     // dispatch(updateLocalUser(newLocalUser));
//     dispatch(updatePublisher(publisher));
//     dispatch(updateCurrentVideoDevice(currentVideoDevice));

//     console.log(publisher);
//     console.log(currentVideoDevice);
//   };

//   // // 변화한 유저 구독
//   // const subscribeToUserCanged = () => {
//   //   session.on('signal:userChanged', (e) => {
//   //     const remoteUsers = subscribers;
//   //     remoteUsers.forEach((user) => {
//   //       if (user.getConnectionId() === e.from.connectionId) {
//   //         const data = JSON.parse(e.data);
//   //         console.log('EVENTO REMOTE: ', e.data);
//   //         if (data.isAudioActive !== undefined) {
//   //           user.setAudioActive(data.isAudioActive);
//   //         }
//   //         if (data.isVideoActive !== undefined) {
//   //           user.setVideoActive(data.isVideoActive);
//   //         }
//   //         if (data.nickname !== undefined) {
//   //           user.setNickname(data.nickname);
//   //         }
//   //         if (data.isScreenShareActive !== undefined) {
//   //           user.setScreenShareActive(data.isScreenShareActive);
//   //         }
//   //       }
//   //     });

//   //     dispatch(updateSubscribers(remoteUsers));
//   //   });
//   // };

//   //데이터 변화 신호 보내기
//   const sendSignalUserChanged = (data) => {
//     const signalOptions = {
//       data: JSON.stringify(data),
//       type: 'userChanged',
//     };
//     if (session) session.signal(signalOptions);
//     else if (thisSession) thisSession.signal(signalOptions);
//   };

//   const sendMySignalToSubscribers = () => {
//     if (thisSession && thisLocalUser) {
//       sendSignalUserChanged({
//         isAudioActive: thisLocalUser.audioActive,
//         isVideoActive: thisLocalUser.videoActive,
//         nickname: thisLocalUser.nickname,
//         isScreenShareActive: thisLocalUser.screenShareActive,
//       });
//     }
//   };

//   // 마이크 변화 감지 시 신호 전송 실행
//   const sendMicSignal = () => {
//     if (localUser) {
//       const prevLocalUser = localUser;
//       prevLocalUser.micActive = isMic;
//       setLocalUser(prevLocalUser);
//       sendSignalUserChanged({ micActive: isMic });
//     }
//   };

//   // 오디오 변화 감지 시 신호 전송 실행
//   const sendAudioSignal = () => {
//     if (localUser) {
//       const prevLocalUser = localUser;
//       prevLocalUser.audioActive = isAudio;
//       setLocalUser(prevLocalUser);
//       sendSignalUserChanged({ audioActive: isAudio });
//     }
//   };

//   // 화면 변화 감지 시 신호 전송 실행
//   const sendVideoSignal = () => {
//     if (localUser) {
//       const prevLocalUser = localUser;
//       prevLocalUser.videoActive = isVideo;
//       setLocalUser(prevLocalUser);
//       sendSignalUserChanged({ videoActive: isVideo });
//     }
//   };

//   // 세션 참여
//   const joinSession = async (sessionId) => {
//     console.log('joinSession 실행');
//     dispatch(updateWaitingActive(true));

//     // OV 객체 및 세션 객체 생성 후 저장
//     await createOV()
//       .then(async () => {
//         // 세션이 존재하는 지 검색
//         const isExistSession = searchSession(sessionId);

//         //세션이 존재하지 않으면 세션 생성 요청
//         // if (!isExistSession) {
//         console.log('세션 없음');
//         await createSession(sessionId);
//         // }
//       })
//       .then(async () => {
//         // 유효한 유저 토큰으로 세션 연결
//         const newToken = await getToken(sessionId);
//         return newToken;
//       })
//       .then(async (token) => {
//         console.log('토큰 수령 후 연결 시작');
//         console.log(token);
//         await doConnect(token, thisSession);
//       })
//       .then(async () => {
//         console.log('연결 완료 후 캠 연결 시작');
//         await doConnectCam(thisOV, thisSession);
//       })
//       .then(() => {
//         console.log('join 완료');
//         // console.log(OV);
//         // console.log(thisLocalUser.streamM);
//         setLocalUser(thisLocalUser);
//         setSubscribers(thisSubscribers);
//         dispatch(updateWaitingActive(false));
//         dispatch(addLiveStatus());
//       })
//       .catch((error) => {
//         console.log(
//           'There was an error connecting to the session:',
//           error.code,
//           error.message
//         );
//       });
//   };

//   // 세션 종료 알림 요청
//   const endSession = async (sessionId) => {
//     console.log('세션 종료 알림 요청 실행');

//     const response = await axios.post(
//       `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/end`,
//       {},
//       { headers: { 'Content-Type': 'application/json' } }
//     );
//   };

//   // 세션 떠나기
//   const leaveSession = () => {
//     console.log('세션떠나기 실행됨');
//     // if (session && subscribers) endSession(mySessionId);
//     if (thisSession) thisSession.disconnect();

//     // 페이지 초기화
//     initLivePage();
//     // dispatch(updateMySessionId('SessionA')); // 임시지정
//     // dispatch(updateMyUserName('Participant' + Math.floor(Math.random() * 100)));
//   };

//   return (
//     <div>
//       라이브화면 입니다.
//       <TopBar status={liveStatus} productName="임시 상품명" />
//       {liveStatus === 0 ? <WaitingPage /> : null}
//       {liveStatus === 1 ? (
//         <ConsultDrawingPage localUser={localUser} subscribers={subscribers} />
//       ) : null}
//       {liveStatus === 2 ? <DrawingPage /> : null}
//       {liveStatus === 3 ? <ResultPage /> : null}
//       <UnderBar
//         joinSession={joinSession}
//         leaveSession={leaveSession}
//         sendMicSignal={sendMicSignal}
//         sendAudioSignal={sendAudioSignal}
//         sendVideoSignal={sendVideoSignal}
//         // sendSignal={sendSignalUserChanged}
//       />
//     </div>
//   );
// }

// export default LivePage;
