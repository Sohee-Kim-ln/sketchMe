import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LiveInfoBox({ meetingId }) {
  const [isExist, setIsExist] = useState(false); // 정보 존재 여부
  const [artistNickname, setArtistNickname] = useState(null); // 작가 닉네임
  const [artistEmail, setartistEmail] = useState(null); // 작가 이메일
  const [customerNickname, setCustomerNickname] = useState(null); // 구매자 닉네임
  const [customerEmail, setCustomerEmail] = useState(null); // 구매자 이메일
  const [reserveDate, setReserveDate] = useState(null); // 예약 일자, 포맷: YYYY:MM:DD:HH:MM
  const [applyDate, setApplyDate] = useState(null); // 신청 일자, 포맷: YYYY:MM:DD
  const [charge, setcharge] = useState(null); // 결제 금액

  useEffect(() => {
    getMeetingInfo(meetingId);
  }, []);

  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === 'production'
      ? ''
      : 'https://sketchme.ddns.net/dev/callapi/';

  const getMeetingInfo = async (targetMeetingId) => {
    const response = await axios.get(
      APPLICATION_SERVER_URL +
        `api/meeting/${targetMeetingId}/reservation-info`,
      {},
      {
        headers: {
          meetingId: targetMeetingId,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data) {
      setIsExist(true);
      const data = response.data;
      setArtistNickname(data.artistNickname);
      setartistEmail(data.artistEmail);
      setCustomerNickname(data.customerNickname);
      setCustomerEmail(data.customerEmail);
      setReserveDate(data.reserveDate);
      setApplyDate(data.applyDate);
      setcharge(data.charge);
    }
  };

  return (
    <div>
      <div id="guideMessage">
        안내메세지
        <div>
          상담 중 그린 밑그림은 작가의 드로잉 화면에서 볼 수 있으나, 수정할 수
          없으며 타임랩스에 포함되지 않습니다.
        </div>
      </div>
      <div id="meetingInfo">
        {isExist ? (
          <div>
            <div>작가 닉네임 : {artistNickname}</div>
            <div>작가 이메일 : {artistEmail}</div>
            <div>구매자 닉네임 : {customerNickname}</div>
            <div>구매자 이메일 : {customerEmail}</div>
            <div>예약 일자 : {reserveDate}</div>
            <div>신청 일자 : {applyDate}</div>
            <div>결제 금액 : {charge}</div>
          </div>
        ) : (
          <div>예약 정보가 없습니다</div>
        )}
      </div>
    </div>
  );
}

export default LiveInfoBox;
