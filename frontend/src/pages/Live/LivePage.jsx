import React, { useEffect } from 'react';
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
  updatePublisher,
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

  // const [session, setSession] = useState(undefined);

  // 리덕스 변수 연동시키기
  const liveStatus = useSelector((state) => state.live.liveStatus);

  const session = useSelector((state) => state.live.session);
  const mySessionId = useSelector((state) => state.live.mySessionId);
  const myUserName = useSelector((state) => state.live.myUserName);
  // const mainStreamManager = useSelector(
  //   (state) => state.live.mainStreamManager
  // );
  // const publisher = useSelector((state) => state.live.publisher);
  // const subscribers = useSelector((state) => state.live.subscribers);

  // 임의 추가함. 기존 코드에서는 스테이트 선언 안하고서 this.state로 지정했는데...
  // const currentVideoDevice = useSelector(
  //   (state) => state.live.currentVideoDevice
  // );
  // const OV = useSelector((state) => state.live.OV);

  // 컴포넌트 마운트될 때와 파괴 될 때 실행되는 useEffect
  useEffect(() => {
    leaveSession();
    return () => {
      leaveSession();
    };
  }, []);

  /**
   * 이하 3개 함수의 내용은 연결시 인증 부분으로, 우리 서버에 맞춰 재설정 필요
   */

  // 세션 만들기
  const createSession = async (sessionId) => {
    console.log('createSession 실행');

    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions`,
      { custonSessionId: sessionId },
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // 세션 아이디 반환
  };

  // 토큰 만들기
  const createToken = async (sessionId) => {
    console.log('createToken 실행');

    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // 토큰 반환
  };

  // 토큰 가져오기
  const getToken = async () => {
    console.log('getToken 실행');
    const newSessionId = await createSession(mySessionId);
    const newToken = await createToken(newSessionId);
    return newToken;
  };

  // 세션 참여
  const joinSession = () => {
    console.log('joinSession 실행');
    dispatch(changeWaitingActive());
    const newOV = new OpenVidu();
    const mySession = newOV.initSession();

    // 임의추가
    dispatch(updateOV(newOV));

    // 세션 스트림 생성시 실행
    mySession.on('streamCreated', (e) => {
      const subscriber = mySession.subscribe(e.stream, undefined);
      dispatch(addSubscriber(subscriber));
    });

    // 세션 스트림 파괴시 실행
    mySession.on('streamDestroyed', (e) => {
      dispatch(deleteSubscriber(e.stream.streamManager));
    });

    // 세션 예외 발생시 실행
    mySession.on('exception', (exception) => {
      console.warn(exception);
    });

    // 유효한 유저 토큰으로 세션 연결
    // 유효한 유저 토큰을 받으면
    getToken().then((token) => {
      // 세션에 연결
      console.log('join에서 getToken 이후 실행');
      console.log(token);
      mySession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          // 나의 카메라 스트림 생성
          console.log('join에서 카메라스트림 만들기 실행');
          const publisher = await newOV.initPublisherAsync(undefined, {
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
          console.log(mySession);
          console.log(publisher);
          await mySession.publish(publisher);

          // 디바이스 설정 확인 후 저장
          const devices = await newOV.getDevices();
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

          dispatch(updatePublisher(publisher));
          dispatch(updateMainStreamManager(publisher));
          dispatch(updateCurrentVideoDevice(currentVideoDevice));
          console.log('join 완료');
          dispatch(changeWaitingActive());
          dispatch(addLiveStatus());
        })
        .catch((error) => {
          console.log(
            'There was an error connecting  to the session:',
            error.code,
            error.message
          );
        });
    });
    dispatch(updateSession(mySession));
  };

  // 세션 떠나기
  const leaveSession = (test) => {
    console.log(test);
    const mySession = session;

    if (mySession) mySession.disconnect();

    // 변수들 초기화
    dispatch(initAll());
    // dispatch(updateMySessionId('SessionA')); // 임시지정
    // dispatch(updateMyUserName('Participant' + Math.floor(Math.random() * 100)));
    console.log('세션떠나기 실행됨');
    // window.alert('세션떠나기 실행됨');
  };

  // 카메라 전환. 구현 안함
  // const switchCamera = async () => {};

  return (
    <div>
      라이브화면 입니다.
      <TopBar status={liveStatus} productName="임시 상품명" />
      {liveStatus === 0 ? <WaitingPage /> : null}
      {liveStatus === 1 ? <ConsultPage /> : null}
      {liveStatus === 2 ? <DrawingPage /> : null}
      {liveStatus === 3 ? <ResultPage /> : null}
      <UnderBar joinSession={joinSession} leaveSession={leaveSession} />
    </div>
  );
}

export default LivePage;
