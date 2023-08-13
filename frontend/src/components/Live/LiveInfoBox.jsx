/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import API from '../../utils/api';

function LiveInfoBox({ meetingId }) {
  const [isExist, setIsExist] = useState(false); // 정보 존재 여부
  const [artistNickname, setArtistNickname] = useState(null); // 작가 닉네임
  const [artistEmail, setartistEmail] = useState(null); // 작가 이메일
  const [customerNickname, setCustomerNickname] = useState(null); // 구매자 닉네임
  const [customerEmail, setCustomerEmail] = useState(null); // 구매자 이메일
  const [reserveDate, setReserveDate] = useState(null); // 예약 일자, 포맷: YYYY:MM:DD:HH:MM
  const [applyDate, setApplyDate] = useState(null); // 신청 일자, 포맷: YYYY:MM:DD
  const [charge, setcharge] = useState(null); // 결제 금액

  // const APPLICATION_SERVER_URL =
  //   process.env.NODE_ENV === 'production'
  //     ? ''
  //     : 'https://sketchme.ddns.net/dev/callapi/';

  const getMeetingInfo = async (targetMeetingId) => {
    const url = `api/meeting/${targetMeetingId}/reservation-info`;
    const response = await API.get(url);

    // const response = await axios.get(
    //   `${APPLICATION_SERVER_URL}api/meeting/${targetMeetingId}/reservation-info`,
    //   {},
    //   {
    //     headers: {
    //       meetingId: targetMeetingId,
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );

    if (response.data) {
      setIsExist(true);
      setArtistNickname(response.data.artistNickname);
      setartistEmail(response.data.artistEmail);
      setCustomerNickname(response.data.customerNickname);
      setCustomerEmail(response.data.customerEmail);
      setReserveDate(response.data.reserveDate);
      setApplyDate(response.data.applyDate);
      setcharge(response.data.charge);
    }
  };

  useEffect(() => {
    getMeetingInfo(meetingId);
  }, []);

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
            <div>
              <span>작가 닉네임 : </span>
              {artistNickname}
            </div>
            <div>
              <span>작가 이메일 : </span>
              {artistEmail}
            </div>
            <div>
              <span>구매자 닉네임 : </span>
              {customerNickname}
            </div>
            <div>
              <span>구매자 이메일 : </span>
              {customerEmail}
            </div>
            <div>
              <span>예약 일자 : </span>
              {reserveDate}
            </div>
            <div>
              <span>신청 일자 : </span>
              {applyDate}
            </div>
            <div>
              <span>결제 금액 : </span>
              {charge}
            </div>
          </div>
        ) : (
          <div>예약 정보가 없습니다</div>
        )}
      </div>
    </div>
  );
}

export default LiveInfoBox;
