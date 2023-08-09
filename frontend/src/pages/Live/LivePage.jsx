import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { OpenVidu } from 'openvidu-browser';

import axios from 'axios';

import TopBar from '../../components/Live/TopBar';
import UnderBar from '../../components/Live/UnderBar';
import WaitingPage from './WaitingPage';
import ConsultPage from './ConsultPage';
import DrawingPage from './DrawingPage';
import ResultPage from './ResultPage';

import UserModel from '../../components/Live/UserModel';

import {
  initAll,
  addLiveStatus,
  resetLiveStatus,
  updateHasBeenUpdated,
  updateProductName,
  updateMySessionId,
  updateMyUserName,
  updateOV,
  updateSession,
  updateToken,
  updatePublisher,
  updateLocalUser,
  initSubscribers,
  addSubscriber,
  deleteSubscriber,
  updateSubscribers,
  updateCurrentVideoDevice,
  updateWaitingActive,
} from '../../reducers/LiveSlice';

function LivePage() {
  const dispatch = useDispatch();
  // 차후 우리 서버 연결시 재설정 및 수정될 예정
  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';
  // : 'https://sketchme.ddns.net/openvidu/';

  // 리덕스 변수 연동시키기
  const liveStatus = useSelector((state) => state.live.liveStatus);
  const hasBeenUpdated = useSelector((state) => state.live.hasBeenUpdated);
  const mySessionId = useSelector((state) => state.live.mySessionId);
  const myUserName = useSelector((state) => state.live.myUserName);
  // const OV = useSelector((state) => state.live.OV);
  // const session = useSelector((state) => state.live.session);
  // const token = useSelector((state)=>state.live.token);
  const publisher = useSelector((state) => state.live.publisher);
  // const localUser = useSelector((state) => state.live.localUser);
  // const subscribers = useSelector((state) => state.live.subscribers);
  const currentVideoDevice = useSelector(
    (state) => state.live.currentVideoDevice
  );
  const waitingActive = useSelector((state) => state.live.waitingActive);

  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  let OV = null;
  let session = undefined;

  let thisLocalUser = undefined;
  let thisSubscribers = [];

  // // 로컬 유저 객체 저장
  // dispatch(updateLocalUser(new UserModel()));

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
    if (session) session.disconnect();
    initAll();
    OV = null;
    session = undefined;
  };

  // 오픈비두 객체 생성 및 세션 설정
  const createOV = async () => {
    console.log('createOV 실행');

    const newOV = new OpenVidu();
    const newSession = newOV.initSession();

    // 세션의 스트림 생성시 실행
    newSession.on('streamCreated', (e) => {
      const subscriber = newSession.subscribe(e.stream, undefined);
      subscriber.on('streamPlaying', (e) => {
        // this.checkSomeoneShareScreen();
        subscriber.videos[0].video.parentElement.classList.remove(
          'custom-class'
        );
      });
      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(e.stream.connection.connectionId);
      newUser.setType('remote');
      const nickname = e.stream.connection.data.split('%')[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      thisSubscribers.push(newUser);
      // dispatch(updateSubscribers(newUser));
      sendMySignalToSubscribers();
    });

    // 세션의 스트림 파괴시 실행
    newSession.on('streamDestroyed', (e) => {
      thisSubscribers = thisSubscribers.filter(
        (subs) => subs.streamManager !== e.stream.streamManager
      );
      // dispatch(deleteSubscriber(e.stream.streamManager));
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
        if (user.getConnectionId() === e.from.connectionId) {
          const data = JSON.parse(e.data);
          console.log('EVENTO REMOTE: ', e.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive);
          }
        }
      });
      thisSubscribers = remoteUsers;
      // dispatch(updateSubscribers(remoteUsers));
    });

    // OV 및 세션 정보 저장
    dispatch(updateSession(newSession));
    dispatch(updateOV(newOV));
    OV = newOV;
    session = newSession;

    // console.log(newSession);
    // console.log(newOV);
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
  const getToken = async () => {
    console.log('getToken 실행');

    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions/' + mySessionId + '/connections',
      // `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log(response);
    return response.data; // 토큰 반환
  };

  // 연결 실행
  const doConnect = async (token) => {
    console.log('연결하기 시작');
    await session.connect(token, { clientData: myUserName });
    // .then(async () => {
    //   await doConnectCam();
    // })
    // .catch((error) => {
    //   console.log(
    //     'There was an error connecting  to the session:',
    //     error.code,
    //     error.message
    //   );
    // });
    console.log('연결 완료');
  };

  // 카메라를 스트림에 연결 및 퍼블리셔 지정
  const doConnectCam = async () => {
    console.log('카메라 연결 만들기 실행');
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
    console.log('테스트1');
    console.log(publisher);
    //이부분 원 코드 다시 볼 것
    if (session.capabilities.publish) {
      publisher.on('accessAllowed', () => {
        session.publish(publisher).then(() => {
          sendMySignalToSubscribers();
          // if (this.props.joinSession) {
          //     this.props.joinSession();
          // }
        });
      });
      console.log('테스트2');
    }

    // await session.publish(publisher);

    //디바이스 설정 확인 후 저장
    console.log('디바이스 설정 시작');
    await OV.getUserMedia({
      audioSource: undefined,
      videoSource: undefined,
    });
    console.log('테스트3');
    const devices = await OV.getDevices();
    console.log('테스트4');
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    );
    console.log('테스트5');
    const currentVideoDeviceId = publisher.stream
      .getMediaStream()
      .getVideoTracks()[0]
      .getSettings().deviceId;
    const currentVideoDevice = videoDevices.find(
      (device) => device.deviceId === currentVideoDeviceId
    );
    console.log('테스트6');
    const newLocalUser = new UserModel();
    newLocalUser.setNickname(myUserName);
    console.log('테스트7');
    newLocalUser.setConnectionId(session.connection.connectionId);
    newLocalUser.setScreenShareActive(false);
    newLocalUser.setStreamManager(publisher);
    console.log(newLocalUser);
    thisLocalUser = newLocalUser;
    // dispatch(updateLocalUser(newLocalUser));
    dispatch(updatePublisher(publisher));
    dispatch(updateCurrentVideoDevice(currentVideoDevice));

    console.log(publisher);
    console.log(currentVideoDevice);
  };

  // // 변화한 유저 구독
  // const subscribeToUserCanged = () => {
  //   session.on('signal:userChanged', (e) => {
  //     const remoteUsers = subscribers;
  //     remoteUsers.forEach((user) => {
  //       if (user.getConnectionId() === e.from.connectionId) {
  //         const data = JSON.parse(e.data);
  //         console.log('EVENTO REMOTE: ', e.data);
  //         if (data.isAudioActive !== undefined) {
  //           user.setAudioActive(data.isAudioActive);
  //         }
  //         if (data.isVideoActive !== undefined) {
  //           user.setVideoActive(data.isVideoActive);
  //         }
  //         if (data.nickname !== undefined) {
  //           user.setNickname(data.nickname);
  //         }
  //         if (data.isScreenShareActive !== undefined) {
  //           user.setScreenShareActive(data.isScreenShareActive);
  //         }
  //       }
  //     });

  //     dispatch(updateSubscribers(remoteUsers));
  //   });
  // };

  //데이터 변화 신호 보내기
  const sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };
    session.signal(signalOptions);
  };

  const sendMySignalToSubscribers = () => {
    if (thisLocalUser) {
      sendSignalUserChanged({
        isAudioActive: thisLocalUser.isAudioActive(),
        isVideoActive: thisLocalUser.isVideoActive(),
        nickname: thisLocalUser.getNickname(),
        // isScreenShareActive: this.state.localUser.isScreenShareActive(),
      });
    }
  };

  // 세션 참여
  const joinSession = async (sessionId) => {
    console.log('joinSession 실행');
    dispatch(updateWaitingActive(true));

    // OV 객체 및 세션 객체 생성 후 저장
    await createOV()
      .then(async () => {
        console.log(session);
        console.log(OV);

        // 세션이 존재하는 지 검색
        const isExistSession = searchSession(sessionId);

        //세션이 존재하지 않으면 세션 생성 요청
        // if (!isExistSession) {
        console.log('세션 없음');
        await createSession(sessionId);
        // }
      })
      .then(async () => {
        // 유효한 유저 토큰으로 세션 연결
        const newToken = await getToken(sessionId);
        return newToken;
      })
      .then(async (token) => {
        console.log('토큰 수령 후 연결 시작');
        console.log(token);
        await doConnect(token, session);
      })
      .then(async () => {
        console.log('연결 완료 후 캠 연결 시작');
        await doConnectCam(OV, session);
      })
      .then(() => {
        console.log('join 완료');
        console.log(OV);
        console.log(session);
        setLocalUser(thisLocalUser);
        setSubscribers(thisSubscribers);
        dispatch(updateWaitingActive(false));
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
    if (session) session.disconnect();

    // 페이지 초기화
    initLivePage();
    // dispatch(updateMySessionId('SessionA')); // 임시지정
    // dispatch(updateMyUserName('Participant' + Math.floor(Math.random() * 100)));
  };

  return (
    <div>
      라이브화면 입니다.
      <TopBar status={liveStatus} productName="임시 상품명" />
      {liveStatus === 0 ? <WaitingPage /> : null}
      {liveStatus === 1 ? (
        <ConsultPage localUser={localUser} subscribers={subscribers} />
      ) : null}
      {liveStatus === 2 ? <DrawingPage /> : null}
      {liveStatus === 3 ? <ResultPage /> : null}
      <UnderBar
        joinSession={joinSession}
        leaveSession={leaveSession}
        sendSignal={sendSignalUserChanged}
      />
    </div>
  );
};

export default LivePage;
