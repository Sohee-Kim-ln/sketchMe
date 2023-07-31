// 백업용
import React, { useEffect, useState } from 'react';

import { OpenVidu } from 'openvidu-browser';

import axios from 'axios';

import TopBar from '../../components/Live/TopBar';
import UnderBar from '../../components/Live/UnderBar';
import ConsultPage from './ConsultPage';
import DrawingPage from './DrawingPage';
import ResultPage from './ResultPage';

// import UserModel from '../models/user-model';

function LivePage() {
  //차후 우리 서버 연결시 재설정 및 수정될 예정
  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';

  //초기값 state 설정
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState(
    'Participant' + Math.floor(Math.random() * 100)
  );
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  //임의 추가함. 기존 코드에서는 스테이트 선언 안하고서 this.state로 지정했는데...
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
  const [OV, setOV] = useState(null);

  //라이브 화면 전환용 스테이터스 변수
  const [liveStatus, setLiveStatus] = useState(0);

  //컴포넌트 마운트될 때, 실행되는 useEffect
  useEffect(() => {
    window.addEventListener('beforeunload', onbeforeunload);
    return () => {
      window.addEventListener('beforeunload', onbeforeunload);
    };
  }, []);

  //컴포넌트 마운트될 때, 업데이트 될 때 세션 종료
  const onbeforeunload = (e) => {
    leaveSession();
  };

  //유저세션 설정 이벤트 핸들러
  const handleChangeSession = (e) => {
    setMySessionId(e.target.value);
  };

  //유저네임 설정 이벤트 핸들러
  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  //메인 비디오 스트림 핸들러
  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  //구독자 목록에서 삭제
  const deleteSubscriber = (streamManager) => {
    const updatedSubscribers = subscribers.filter(
      (subs) => subs !== streamManager
    );
    setSubscribers(updatedSubscribers);
  };

  /**
   * 이하 3개 함수의 내용은 연결시 인증 부분으로, 우리 서버에 맞춰 재설정 필요
   */

  //토큰 가져오기
  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  //세션 만들기
  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions',
      { custonSessionId: sessionId },
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; //세션 아이디 반환
  };

  //토큰 만들기
  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; //토큰 반환
  };

  //세션 참여
  const joinSession = () => {
    const newOV = new OpenVidu();
    const mySession = newOV.initSession();

    //임의추가
    setOV(newOV);

    //세션 스트림 생성시 실행
    mySession.on('streamCreated', (e) => {
      const subscriber = mySession.subscribe(e.stream, undefined);
      setSubscribers([...subscribers, subscriber]);
    });

    //세션 스트림 파괴시 실행
    mySession.on('streamDestroyed', (e) => {
      deleteSubscriber(e.stream.streamManager);
    });

    //세션 예외 발생시 실행
    mySession.on('exception', (exception) => {
      console.warn(exception);
    });

    //유효한 유저 토큰으로 세션 연결
    getToken().then((token) => {
      mySession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          const publisher = await OV.initPublisherAsync(undefined, {
            //오디오소스 undefined시 기본 마이크, 비디오소스 undefined시 웹캠 디폴트
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false,
          });

          mySession.publish(publisher);

          //디바이스 설정 확인 후 저장
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

          setPublisher(publisher);
          setMainStreamManager(publisher);
          setCurrentVideoDevice(currentVideoDevice);
        })
        .catch((error) => {
          console.log(
            'There was an error connecting  to the session:',
            error.code,
            error.message
          );
        });
    });
    setSession(mySession);
  };

  //세션 떠나기
  const leaveSession = () => {
    const mySession = session;

    if (mySession) {
      mySession.disconnect();
    }

    //모든 값 삭제
    setMySessionId('SessionA');
      setMyUserName('Participant' + Math.floor(Math.random() * 100));
      setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);

    setCurrentVideoDevice(null);
    setOV(null);
  };

  //카메라 전환
  const witchCamera = async () => {
    //구현 안해도 되나?
  };

  return (
    <div>
      라이브화면 입니다.
      <TopBar status={liveStatus} productName={'임시 상품명'} />
      {liveStatus === 0 ? <ConsultPage /> : null}
      {liveStatus === 1 ? <DrawingPage /> : null}
      {liveStatus === 2 ? <ResultPage /> : null}
      <UnderBar />
    </div>
  );
}

export default LivePage;
