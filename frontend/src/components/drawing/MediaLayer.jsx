/* eslint-disable operator-linebreak */
/* eslint-disable array-callback-return */
import React, { useEffect, forwardRef } from 'react';
// import React, { useEffect, forwardRef, useContext } from 'react';

import { useSelector } from 'react-redux';
// import { MediaRefContext } from '../../pages/MyPage/MyPage';
// import { OpenVidu } from 'openvidu-browser';
// import { OpenVidu } from 'openvidu-browser';
// import API from '../../utils/api';

const MediaLayer = forwardRef(({ drawingRefs, showCanvas }, ref) => {
  // 캔버스 슬라이스 가져오기
  const thisWidth = useSelector((state) => state.canvas.canvasWidth);
  const thisHeight = useSelector((state) => state.canvas.canvasHeight);
  const thisStyle = useSelector((state) => state.canvas.canvasStyle);
  const layersInfo = useSelector((state) => state.canvas.layersInfo);
  const mediaLayerFPS = useSelector((state) => state.canvas.mediaLayerFPS);
  // const thisMeetingId = useSelector((state) => state.live.meetingId);

  // 레이어 ref지정
  // const mediaRef = useContext(MediaRefContext);
  // const thisLayer = mediaRef.current;
  const thisLayer = ref.current;

  // 레이어들을 하나의 이미지로 만드는 함수
  const zipLayers = () => {
    if (thisLayer) {
      const ctx = thisLayer.getContext('2d');
      ctx.reset();

      drawingRefs.map((thisRef, index) => {
        if (
          // thisRef.current !== null
          thisRef.current !== null &&
          index !== 1 &&
          layersInfo[index] &&
          layersInfo[index].visible
        ) {
          // console.log(layersInfo);
          // console.log(layersInfo[index].visible);
          ctx.drawImage(thisRef.current, 0, 0);
        }
      });
    }
  };

  // 1초마다 zipLayers 함수를 실행하는 interval 설정
  useEffect(() => {
    const interval = setInterval(zipLayers, Math.floor(1000 / mediaLayerFPS));
    return () => {
      clearInterval(interval);
    };
  }, [thisLayer, layersInfo]);

  // const showCanvasTemp = async () => {
  //   const canvasStream = thisLayer.captureStream();
  //   console.log(canvasStream);

  //   const newOV = new OpenVidu();
  //   const newSession = newOV.initSession();

  //   const url = `api/meeting/${thisMeetingId}/videoconference/get-into-room`;
  //   const response = await API.get(url);
  //   const { token } = response.data.data;

  //   await newSession.connect(token, 'canvas');
  //   console.log('캔버스 세션 연결 완료');

  //   const publisher = await newOV.initPublisherAsync(undefined, {
  //     // 오디오소스 undefined시 기본 마이크, 비디오소스 undefined시 웹캠 디폴트
  //     audioSource: false,
  //     videoSource: canvasStream,
  //     publishAudio: false,
  //     publishVideo: true,
  //     resolution: '640x480',
  //     frameRate: 30,
  //     insertMode: 'APPEND',
  //     mirror: false,
  //   });
  //   console.log(publisher);

  //   if (newSession.capabilities.publish) {
  //     publisher.on('accessAllowed', async () => {
  //       await newSession.publish(publisher);
  //       // 데이터 변화 신호 보내기
  //       const signalOptions = {
  //         data: JSON.stringify({
  //           audioActive: false,
  //           videoActive: true,
  //           nickname: 'canvas',
  //           screenShareActive: false,
  //         }),
  //         type: 'userChanged',
  //       };
  //       newSession.signal(signalOptions);
  //     });
  //   }
  //   const newCanvasUser = UserModel();
  //   console.log(session.connection);
  //   newCanvasUser.connectionId = session.connection.connectionId;
  //   newCanvasUser.micActive = false;
  //   newCanvasUser.audioActive = false;
  //   newCanvasUser.videoActive = true;
  //   newCanvasUser.screenShareActive = false;
  //   newCanvasUser.nickname = `${myUserName}_canvas`;
  //   newCanvasUser.streamManager = publisher;
  //   newCanvasUser.type = 'local';
  //   newCanvasUser.role = 'canvas';
  //   setSharedCanvas(newCanvasUser);
  //   console.log(newCanvasUser);
  // };

  useEffect(() => {
    showCanvas();
  }, []);

  return (
    // <div></div>
    <canvas
      // ref={mediaRef}
      ref={ref}
      width={thisWidth}
      height={thisHeight}
      style={{
        ...thisStyle,
        // visibility: isVisible ? 'visible' : 'hidden',
        // pointerEvents: 'none', // 클릭 이벤트를 무시하도록 설정
        // zIndex: layerIndex,
      }}
    >
      캔버스가 지원되지 않는 브라우저입니다. 다른 브라우저를 사용해주세요.
    </canvas>
  );
});

export default MediaLayer;
