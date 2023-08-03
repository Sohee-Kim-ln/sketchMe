import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { OpenVidu } from 'openvidu-browser';

import axios from 'axios';

import TopBar from '../../components/Live/TopBar';
import UnderBar from '../../components/Live/UnderBar';
import ConsultPage from './ConsultPage';
import DrawingPage from './DrawingPage';
import ResultPage from './ResultPage';

// import UserModel from '../models/user-model';

import {
  initAll,
  addLiveStatus,
  // resetLiveStatus,
  // updateProductName,
  // updateMySessionId,
  // updateMyUserName,
  updateSession,
  updateMainStreamManager,
  updatePublisherStream,
  // initSubscribers,
  addSubscriber,
  deleteSubscriber,
  updateCurrentVideoDevice,
  updateOV,
  // updateLocalUser,
  changeWaitingActive,
} from '../../reducers/LiveSlice';
import WaitingPage from './WaitingPage';

function LivePage() {
  const dispatch = useDispatch();

  // 차후 우리 서버 연결시 재설정 및 수정될 예정
  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';
  // : 'https://sketchme.ddns.net/openvidu/';

  // 리덕스 변수 연동시키기
  const liveStatus = useSelector((state) => state.live.liveStatus);
  const mySessionId = useSelector((state) => state.live.mySessionId);
  const myUserName = useSelector((state) => state.live.myUserName);
  const mainStreamManager = useSelector(
    (state) => state.live.mainStreamManager
  );
  const publisher = useSelector((state) => state.live.publisher);
  const subscribers = useSelector((state) => state.live.subscribers);
  const currentVideoDevice = useSelector(
    (state) => state.live.currentVideoDevice
  );

  const [myOV, setMyOV] = useState(null);
  const [mySession, setMySession] = useState(undefined);

  // 컴포넌트 마운트될 때와 파괴 될 때 실행되는 useEffect
  useEffect(() => {
    initLivePage();
    return () => {
      initLivePage();
    };
  }, []);

  // 초기화 함수
  const initLivePage = () => {
    console.log('라이브 페이지 초기화 실행됨');
    if (mySession) mySession.disconnect();
    initAll();
    setMyOV(null);
    setMySession(undefined);
  };

  // 오픈비두 객체 생성 및 세션 설정
  const createOV = async () => {
    console.log('createOV 실행');

    const newOV = new OpenVidu();
    const newSession = newOV.initSession();

    // 세션의 스트림 생성시 실행
    newSession.on('streamCreated', (e) => {
      const subscriber = newSession.subscribe(e.stream, undefined);
      dispatch(addSubscriber(subscriber));
    });

    // 세션의 스트림 파괴시 실행
    newSession.on('streamDestroyed', (e) => {
      dispatch(deleteSubscriber(e.stream.streamManager));
    });

    // 세션의 예외 발생시 실행
    newSession.on('exception', (exception) => {
      console.warn(exception);
    });

    // OV 및 세션 정보 저장
    // dispatch(updateSession(newSession));
    // dispatch(updateOV(newOV));

    console.log(newSession);
    console.log(newOV);
    return [newOV, newSession];
  };

  // 세션 검색 요청
  const searchSession = async (sessionId) => {
    console.log('searchSession 실행');
    // api 합의 필요
    // const response = await axios.get(
    //   APPLICATION_SERVER_URL + `api/sessions/${sessionId}`,
    //   { customSessionId: sessionId },
    //   {},
    //   { headers: { 'Content-Type': 'application/json' } }
    // );
    return false; //검색 response 합의 필요. false/true 하고 싶은데.
    // return response.data; //검색 response 합의 필요. false/true 하고 싶은데.
  };

  // 세션 생성 요청
  const createSession = async (sessionId) => {
    console.log('createSession 실행');

    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions',
      { customSessionId: sessionId },
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log(response);
    return response.data; //세션 아이디 반환
  };

  // 연결 생성 요청
  const getToken = async (sessionId) => {
    console.log('createToken 실행');

    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
      // `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log(response);
    return response.data; // 토큰 반환
  };

  // 연결 실행
  const doConnect = async (token, session) => {
    console.log('연결하기 시작');
    await session.connect(token, { clientData: myUserName }).catch((error) => {
      console.log(
        'There was an error connecting  to the session:',
        error.code,
        error.message
      );
    });
    console.log('연결 완료');
  };

  // 카메라를 스트림에 연결 및 퍼블리셔 지정
  const doConnectCam = async (OV, session) => {
    console.log('카메라 연결 만들기 실행');
    console.log(OV);
    console.log(session);
    const publisher = await OV.initPublisherAsync(undefined, {
      // 오디오소스 undefined시 기본 마이크, 비디오소스 undefined시 웹캠 디폴트
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: false,
    });
    console.log('테스트');
    console.log(publisher);
    await session.publish(publisher);

    //디바이스 설정 확인 후 저장
    console.log('디바이스 설정 시작');
    const devices = await OV.getDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    );
    const currentVideoDeviceId = publisher.stream
      .getMediaStream()
      .getVideoTracks()[0]
      .getSettings().deviceId;
    const currentVideoDevice = videoDevices.find(
      (device) => device.deviceId === currentVideoDeviceId
    );

    dispatch(updatePublisherStream(publisher));
    dispatch(updateMainStreamManager(publisher));
    dispatch(updateCurrentVideoDevice(currentVideoDevice));

    console.log(publisher);
    console.log(currentVideoDevice);
  };

  // 세션 참여
  const joinSession = async (sessionId) => {
    console.log('joinSession 실행');
    dispatch(changeWaitingActive());

    // OV 객체 및 세션 객체 생성 후 저장
    const [newOV, newSession] = await createOV();
    console.log(newSession);
    console.log(newOV);
    // 세션이 존재하는 지 검색
    const isExistSession = searchSession(sessionId);

    //세션이 존재하지 않으면 세션 생성 요청
    console.log('세션 없음');
    await createSession(sessionId);

    // if (!isExistSession) {
    //   console.log('세션 없음')
    //   await createSession(sessionId);
    // }

    // 유효한 유저 토큰으로 세션 연결
    await getToken(sessionId)
      .then(async (token) => {
        console.log('토큰 수령 후 연결 시작');
        console.log(token);
        await doConnect(token, newSession);
      })
      .then(async () => {
        console.log('연결 완료 후 캠 연결 시작');
        await doConnectCam(newOV, newSession);
      })
      .then(() => {
        console.log('join 완료');
        console.log(newOV);
        console.log(newSession);
        setMyOV(newOV);
        setMySession(newSession);
        dispatch(changeWaitingActive());
        dispatch(addLiveStatus());
      })
      .catch((error) => {
        console.log(
          'There was an error connecting to the session:',
          error.code,
          error.message
        );
      });
  };

  //

  // 세션 종료 알림 요청
  const endSession = async (sessionId) => {
    console.log('세션 종료 알림 요청 실행');

    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/end`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
  };

  // 세션 떠나기
  const leaveSession = () => {
    console.log('세션떠나기 실행됨');
    // if (session && subscribers) endSession(mySessionId);
    if (mySession) mySession.disconnect();

    // 페이지 초기화
    initLivePage();
    // dispatch(updateMySessionId('SessionA')); // 임시지정
    // dispatch(updateMyUserName('Participant' + Math.floor(Math.random() * 100)));
  };

  return (
    <div>
      라이브화면 입니다.
      <TopBar status={liveStatus} productName={'임시 상품명'} />
      {liveStatus === 0 ? <WaitingPage /> : null}
      {liveStatus === 1 ? <ConsultPage /> : null}
      {liveStatus === 2 ? <DrawingPage /> : null}
      {liveStatus === 3 ? <ResultPage /> : null}
      <UnderBar joinSession={joinSession} leaveSession={leaveSession} />
    </div>
  );
}

export default LivePage;
