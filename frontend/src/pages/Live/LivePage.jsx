/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef-init */
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import TopBar from '../../components/Live/TopBar';
import UnderBar from '../../components/Live/UnderBar';
import WaitingPage from './WaitingPage';
// eslint-disable-next-line import/no-cycle
import ConsultDrawingPage from './ConsultDrawingPage';
import WaitingTimelapsePage from './WaitingTimelapsePage';
import ResultPage from './ResultPage';
import UserModel from '../../components/Live/UserModel';
import API from '../../utils/api';

import {
  initAll,
  addLiveStatus,
  updateWaitingActive,
  changeLocalUserAccessAllowed,
} from '../../reducers/LiveSlice';

export const MediaRefContext = createContext();

function LivePage() {
  const dispatch = useDispatch();
  // 차후 우리 서버 연결시 재설정 및 수정될 예정
  // eslint-disable-next-line operator-linebreak
  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === 'production' ? '' : 'http://25.4.167.82:8000/';

  // 라이브 리덕스 변수 연동시키기
  const liveStatus = useSelector((state) => state.live.liveStatus);
  const mySessionId = useSelector((state) => state.live.mySessionId);
  const myUserName = useSelector((state) => state.live.myUserName);
  const localUserRole = useSelector((state) => state.live.localUserRole);
  const thisMeetingId = useSelector((state) => state.live.meetingId);
  // 비디오 리덕스 변수 연동시키기
  const isMic = useSelector((state) => state.video.micActive);
  const isAudio = useSelector((state) => state.video.audioActive);
  const isVideo = useSelector((state) => state.video.videoActive);
  const isSpeaking = useSelector((state) => state.video.isSpeaking);
  // 캔버스 리덕스 변수 연동시키기
  const mediaLayerFPS = useSelector((state) => state.canvas.mediaLayerFPS);

  // 미팅 변수 연동시키기
  // const meetingId = useSelector((state)=>state);
  const meetingId = null;

  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [sharedCanvas, setSharedCanvas] = useState(undefined);
  const [myOV, setOV] = useState(null);
  const [mySession, setSession] = useState(undefined);
  const [canvasOV, setCanvasOV] = useState(null);
  const [canvasSession, setCanvasSession] = useState(undefined);

  let thisOV = null;
  let thisSession = undefined;

  let thisCanvasOV = null;
  let thisCanvasSession = undefined;

  let thisLocalUser = undefined;
  let thisSubscribers = [];

  const mediaRef = useRef(null);

  // 초기화 함수
  const initLivePage = () => {
    console.log('라이브 페이지 초기화 실행됨');
    const sessionIn = mySession || thisSession;
    const canvasSessionIn = canvasSession || thisCanvasSession;
    if (sessionIn) sessionIn.disconnect();
    if (canvasSessionIn) canvasSessionIn.disconnect();

    initAll();

    thisOV = null;
    thisSession = undefined;

    thisCanvasOV = null;
    thisCanvasSession = undefined;

    thisLocalUser = undefined;
    thisSubscribers = [];
  };

  // 데이터 변화 신호 보내기
  const sendSignalUserChanged = (data, inputSession) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };
    inputSession.signal(signalOptions);
  };

  // 페이지 전환 신호 보내기
  const sendSignalPageChanged = (inputSession) => {
    const signalOptions = {
      data: null,
      type: 'pageChanged',
    };
    inputSession.signal(signalOptions);
  };

  // 내 시그널 보내기
  const sendMySignal = () => {
    if (mySession && localUser) {
      sendSignalUserChanged(
        {
          micActive: localUser.micActive,
          audioActive: localUser.audioActive,
          videoActive: localUser.videoActive,
          isSpeaking: false,
          nickname: localUser.nickname,
          role: localUser.role,
        },
        mySession
      );
    }
  };

  // 내 캔버스 시그널 보내기
  const sendCanvasSignal = () => {
    if (canvasSession && sharedCanvas) {
      sendSignalUserChanged(
        {
          micActive: false,
          audioActive: false,
          videoActive: true,
          nickname: `${localUser.nickname}_canvas`,
          role: 'canvas',
        },
        canvasSession
      );
    }
  };

  // 오픈비두 객체 생성 및 세션 설정
  const createOV = async () => {
    console.log('createOV 실행');

    const newOV = new OpenVidu();
    const newSession = newOV.initSession();

    // 세션의 스트림 생성시 실행. 구독자에 추가됨
    newSession.on('streamCreated', (e) => {
      console.log('EVENT streamCreated: ', e);
      const subscriber = newSession.subscribe(e.stream, undefined);

      // 구독자가 스트림 플레이할 때
      subscriber.on('streamPlaying', (e) => {
        console.log('EVENT streamPlaying: ', e);

        subscriber.videos[0].video.parentElement.classList.remove(
          'custom-class'
        );
      });

      // 구독자가 말 시작할 때
      subscriber.on('publisherStartSpeaking', (event) => {
        console.log(event);
        console.log(
          '구독자 ' + event.connection.connectionId + ' start speaking'
        );

        const remoteUsers = thisSubscribers;
        remoteUsers.forEach((user) => {
          if (user.connectionId === e.connection.connectionId) {
            console.log('EVENTO REMOTE: ', e.data);
            // 수신된 이벤트에 대해 처리
            user.isSpeaking = true;
          }
        });
        thisSubscribers = remoteUsers;
      });

      // 구독자가 말 끝낼 때
      subscriber.on('publisherStopSpeaking', (event) => {
        console.log(event);

        console.log(
          '구독자 ' + event.connection.connectionId + ' stop speaking'
        );
        const remoteUsers = thisSubscribers;
        remoteUsers.forEach((user) => {
          if (user.connectionId === e.connection.connectionId) {
            console.log('EVENTO REMOTE: ', e.data);
            // 수신된 이벤트에 대해 처리
            user.isSpeaking = false;
          }
        });
        thisSubscribers = remoteUsers;
      });

      const newUser = UserModel();
      // console.log(e.stream.connection);
      // console.log(e.stream.connection.connectionId);
      // console.log(e.stream.connection.data);
      newUser.connectionId = e.stream.connection.connectionId;
      const userData = JSON.parse(e.stream.connection.data.split('%')[0]);
      newUser.micActive = userData.micActive;
      newUser.audioActive = userData.audioActive;
      newUser.videoActive = userData.videoActive;
      newUser.isSpeaking = userData.isSpeaking;
      newUser.nickname = userData.nickname;
      newUser.streamManager = subscriber;
      newUser.type = 'remote';
      newUser.role = userData.role;

      const remotes = [...thisSubscribers, newUser];
      thisSubscribers = remotes;
      setSubscribers(thisSubscribers);
      // if (localUserAccessAllowed) {
      sendMySignal(); // 원본 코드에 없음. 임의추가
      console.log(thisSubscribers);
      // }
    });

    // 세션의 스트림 파괴시 실행
    newSession.on('streamDestroyed', (e) => {
      console.log('EVENT streamDestroyed: ', e);

      thisSubscribers = thisSubscribers.filter(
        (subs) => subs.streamManager !== e.stream.streamManager
      );
      setSubscribers(thisSubscribers);
      e.preventDefault();
    });

    // 세션의 스트림 예외 발생시 실행
    newSession.on('exception', (exception) => {
      console.warn(exception);
    });

    // 세션의 스트림에서 유저정보 변화시 실행
    newSession.on('signal:userChanged', (e) => {
      const remoteUsers = thisSubscribers;
      remoteUsers.forEach((user) => {
        if (user.connectionId === e.from.connectionId) {
          const data = JSON.parse(e.data);
          console.log('EVENTO REMOTE: ', e.data);
          // 수신된 이벤트에 대해 처리
          if (data.micActive !== undefined) {
            user.micActive = data.micActive;
          }
          if (data.audioActive !== undefined) {
            user.audioActive = data.audioActive;
          }
          if (data.videoActive !== undefined) {
            user.videoActive = data.videoActive;
          }
          if (data.role !== undefined) {
            user.role = data.role;
          }
        }
      });
      thisSubscribers = remoteUsers;
    });

    // 페이지 전환 시그널 시 실행
    newSession.on('signal:pageChanged', (e) => {
      const localUserIn = localUser || thisLocalUser;
      if (localUserIn.connectionId !== e.from.connectionId) {
        dispatch(addLiveStatus());
        e.preventDefault();
      }
    });

    // 세션 퍼블리시 하는 당사자가 말하는지 감지
    newSession.on('publisherStartSpeaking', (event) => {
      console.log(event);
      console.log('User ' + event.connection.connectionId + ' start speaking');
    });

    // 세션 퍼블리시 하는 당사자가 말하는지 감지
    newSession.on('publisherStopSpeaking', (event) => {
      console.log('User ' + event.connection.connectionId + ' stop speaking');
    });

    // // 음성 감지 시그널 시 실행
    // newSession.on('publisherStartSpeaking', (e) => {
    //   thisLocalUser.isSpeaking = true;
    //   setLocalUser(thisLocalUser);
    //   mySession || thisSession;
    //   sendSpeakingSignal(isSpeaking);
    // });

    // // 음성 감지 시그널 시 실행
    // newSession.on('publisherStopSpeaking', (e) => {
    //   const remoteUsers = thisSubscribers;
    //   remoteUsers.forEach((user) => {
    //     if (user.connectionId === e.connection.connectionId) {
    //       const data = JSON.parse(e.data);
    //       console.log('EVENTO SPEAKING: ', e.data);
    //       // 수신된 이벤트에 대해 처리
    //       user.isSpeaking = false;
    //     }
    //   });
    //   thisSubscribers = remoteUsers;
    // });

    // OV 및 세션 정보 저장
    setOV(newOV);
    setSession(newSession);
    thisOV = newOV;
    thisSession = newSession;
  };

  // 미팅id에 따른 연결 생성 요청
  const getToken = async (targetMeetingId) => {
    console.log('getToken 실행');
    // meeting/{meetingId}/videoconference/get-into-room
    const url = `api/meeting/${targetMeetingId}/videoconference/get-into-room`;
    const response = await API.get(url);
    console.log(response.data);
    return response.data; // 토큰 반환
  };

  // 연결 실행
  const doConnect = async (token, inputData, inputSession) => {
    console.log('doConnect 실행');

    if (inputSession) {
      await inputSession.connect(token, inputData);
      console.log('연결 완료');
    } else console.log('세션 없음');
  };

  // 카메라를 스트림에 연결 및 퍼블리셔 지정
  const doConnectCam = async (inputOV, inputSession) => {
    console.log('카메라 연결 만들기 실행');
    const publisher = await inputOV.initPublisherAsync(undefined, {
      // 오디오소스 undefined시 기본 마이크, 비디오소스 undefined시 웹캠 디폴트
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: true,
    });

    // 디바이스 설정 확인 후 저장
    console.log('디바이스 설정 시작');
    await inputOV.getUserMedia({
      audioSource: undefined,
      videoSource: undefined,
    });
    // const devices = await thisOV.getDevices();
    // const videoDevices = devices.filter(
    //   (device) => device.kind === 'videoinput'
    // );
    const newLocalUser = UserModel();

    newLocalUser.connectionId = thisSession.connection.connectionId;
    newLocalUser.micActive = isMic;
    newLocalUser.audioActive = isAudio;
    newLocalUser.videoActive = isVideo;
    newLocalUser.isSpeaking = false;
    newLocalUser.nickname = myUserName;
    newLocalUser.streamManager = publisher;
    newLocalUser.type = 'local';
    newLocalUser.role = localUserRole;

    setLocalUser(newLocalUser);
    thisLocalUser = newLocalUser;

    // 이부분 원 코드 다시 볼 것
    if (inputSession.capabilities.publish) {
      publisher.on('accessAllowed', () => {
        inputSession.publish(publisher).then(() => {
          changeLocalUserAccessAllowed();
          sendMySignal();
        });
      });
    }
  };

  // 마이크 변화 감지 시 신호 전송 실행
  const sendMicSignal = (inputSession) => {
    if (localUser) {
      const prevLocalUser = localUser;
      prevLocalUser.micActive = isMic;
      setLocalUser(prevLocalUser);
      sendSignalUserChanged({ micActive: isMic }, inputSession);
    }
  };

  // 오디오 변화 감지 시 신호 전송 실행
  const sendAudioSignal = (inputSession) => {
    if (localUser) {
      const prevLocalUser = localUser;
      prevLocalUser.audioActive = isAudio;
      setLocalUser(prevLocalUser);
      sendSignalUserChanged({ audioActive: isAudio }, inputSession);
    }
  };

  // 화면 변화 감지 시 신호 전송 실행
  const sendVideoSignal = (inputSession) => {
    if (localUser) {
      const prevLocalUser = localUser;
      prevLocalUser.videoActive = isVideo;
      setLocalUser(prevLocalUser);
      sendSignalUserChanged({ videoActive: isVideo }, inputSession);
    }
  };

  const sendSpeakingSignal = (inputSession) => {
    if (localUser) {
      const prevLocalUser = localUser;
      prevLocalUser.isSpeaking = isSpeaking;
      setLocalUser(prevLocalUser);
      sendSignalUserChanged(isSpeaking, inputSession);
    }
  };

  // 캔버스용 오픈비두 객체 생성 및 세션 설정
  const createCanvasOV = async () => {
    console.log('createCanvasOV 실행');

    const newOV = new OpenVidu();
    const newSession = newOV.initSession();

    // 세션의 스트림 생성시 실행. 구독자에 추가됨
    newSession.on('streamCreated', (e) => {
      const subscriber = newSession.subscribe(e.stream, undefined);
      subscriber.on('streamPlaying', (e) => {
        subscriber.videos[0].video.parentElement.classList.remove(
          'custom-class'
        );
      });
      const newUser = UserModel();

      newUser.connectionId = e.stream.connection.connectionId;
      const nickname = e.stream.connection.data.split('%')[0];
      newUser.nickname = JSON.parse(nickname).clientData;
      newUser.streamManager = subscriber;
      newUser.type = 'remote';
      // newUser.role = localUser.role === 'artist' ? 'guest' : 'artist';
      const remotes = [...thisSubscribers, newUser];
      thisSubscribers = remotes;
      // if (localUserAccessAllowed) {
      sendMySignal(); // 원본 코드에 없음. 임의추가
      // }
    });

    // 세션의 스트림 파괴시 실행
    newSession.on('streamDestroyed', (e) => {
      thisSubscribers = thisSubscribers.filter(
        (subs) => subs.streamManager !== e.stream.streamManager
      );
      e.preventDefault();
    });

    // 세션의 스트림 예외 발생시 실행
    newSession.on('exception', (exception) => {
      console.warn(exception);
    });

    // OV 및 세션 정보 저장
    setCanvasOV(newOV);
    setCanvasSession(newSession);
    thisCanvasOV = newOV;
    thisCanvasSession = newSession;
  };

  // 테스트용 임시
  const videoRef = useRef(null);

  // 작가가 추가로 캔버스를 방송
  const showCanvas = async () => {
    // 작가가 아니라면 캔버스 방송 안함
    if (localUserRole !== 'artist') return;

    try {
      // 캔버스용 OV, session 생성
      createCanvasOV();

      // 캔버스 미디어스트림 따오기
      console.log('캔버스 연결 시작');
      const mediaLayer = mediaRef.current;
      const canvasStream = mediaLayer.captureStream(mediaLayerFPS);

      // 토큰 받아오기
      const res = await getToken(thisMeetingId);

      const sessionIn = canvasSession || thisCanvasSession;
      // 연결 생성
      const data = {
        micActive: false,
        audioActive: false,
        videoActive: true,
        isSpeaking: false,
        nickname: `${myUserName}_canvas`,
        role: 'canvas',
      };
      await doConnect(res.data.token, data, sessionIn);

      const OVIn = canvasOV || thisCanvasOV;

      const publisher = await OVIn.initPublisherAsync(undefined, {
        // 오디오소스 undefined시 기본 마이크, 비디오소스 undefined시 웹캠 디폴트
        audioSource: false,
        videoSource: canvasStream.getVideoTracks()[0],
        publishAudio: false,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });

      // 캔버스 정보 저장
      const newCanvasUser = UserModel();
      newCanvasUser.connectionId = sessionIn.connection.connectionId;
      newCanvasUser.micActive = false;
      newCanvasUser.audioActive = false;
      newCanvasUser.videoActive = true;
      newCanvasUser.nickname = `${myUserName}_canvas`;
      newCanvasUser.streamManager = publisher;
      newCanvasUser.type = 'local';
      newCanvasUser.role = 'canvas';
      setSharedCanvas(newCanvasUser);
      console.log(newCanvasUser);

      // 세션에 퍼블리시 할 수 있으면 신호 보내기
      if (sessionIn.capabilities.publish) {
        publisher.on('accessAllowed', () => {
          sessionIn.publish(publisher).then(() => {
            sendCanvasSignal();
          });
        });
      }

      // videoRef.current.srcObject = new MediaStream(
      //   canvasStream.getVideoTracks()[0]
      // );
      // videoRef.current.play();
    } catch (error) {
      console.log('캔버스 연결 에러: ', error.code, error.message);
    }
  };

  // 세션 참여
  const joinSession = async (meetingId) => {
    console.log('joinSession 실행');
    dispatch(updateWaitingActive(true));

    try {
      // OV 객체 및 세션 객체 생성 후 저장
      await createOV();

      // 미팅 아이디로 연결용 토큰 요청
      const res = await getToken(meetingId);

      // 수령한 토큰으로 연결 시작
      console.log('토큰 수령 후 연결 시작');
      // 있는 Session 전달
      const sessionIn = mySession || thisSession;

      const data = {
        micActive: isMic,
        audioActive: isAudio,
        videoActive: isVideo,
        nickname: myUserName,
        role: localUserRole,
      };
      await doConnect(res.data.token, data, sessionIn);

      console.log('연결 완료 후 캠 연결 시작');
      await doConnectCam(thisOV, sessionIn);

      console.log('join 완료');
      setLocalUser(thisLocalUser);
      setSubscribers(thisSubscribers);
      dispatch(updateWaitingActive(false));
      dispatch(addLiveStatus());

      // if (localUserRole === 'artist') await showCanvas();
    } catch (error) {
      console.log('화면 연결 에러:', error.code, error.message);
      dispatch(updateWaitingActive(false));
    }
  };

  // 세션 종료 알림 요청 (미구현)
  const endSession = async (targetMeetingId) => {
    console.log('세션 종료 알림 요청 실행');

    const url = `api/meeting/${targetMeetingId}/videoconference`;
    const data = { sessionId: mySessionId }; // 이따 질문할 것
    const response = await API.post(url, data);
  };

  // 세션 떠나기
  const leaveSession = (inputSession) => {
    console.log('세션떠나기 실행됨');
    if (inputSession) inputSession.disconnect();

    // 페이지 초기화
    initLivePage();
  };

  // 컴포넌트 마운트될 때와 파괴 될 때 실행되는 useEffect
  useEffect(() => {
    initLivePage();
    return () => {
      initLivePage();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen item-center justify-between">
      <TopBar status={liveStatus} productName="임시 상품명" />

      {/* <div>비디오스트림 테스트</div>
      <div>
        <video ref={videoRef} autoPlay playsInline />
      </div> */}

      <div className="flex item-center justify-center h-full w-full">
        {liveStatus === 0 ? <WaitingPage /> : null}
        {liveStatus === 1 || liveStatus === 2 ? (
          <MediaRefContext.Provider value={mediaRef}>
            <ConsultDrawingPage
              localUser={localUser}
              subscribers={subscribers}
              sharedCanvas={sharedCanvas}
              showCanvas={showCanvas}
            />
          </MediaRefContext.Provider>
        ) : null}
        {liveStatus === 3 ? <WaitingTimelapsePage /> : null}
        {liveStatus === 4 ? <ResultPage /> : null}
      </div>
      <UnderBar
        joinSession={joinSession}
        leaveSession={leaveSession}
        sendMicSignal={sendMicSignal}
        sendAudioSignal={sendAudioSignal}
        sendVideoSignal={sendVideoSignal}
        sendSignalPageChanged={sendSignalPageChanged}
        session={mySession || thisSession}
        // endSession = {endSession}
      />
    </div>
  );
}

export default LivePage;
