import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import ReservationCheckCard from '../../components/reservation/ReservationCheckCard';
import API from '../../utils/api';
import MyPageSideBar from '../../components/MyPage/MyPageSideBar';

function ReservationCheckPage() {
  // 현재 경로에서 id 추출 (현재 페이지에서는 현재 유저의 모든 예약 목록 가져옴)
  // const location = useLocation();
  // const { reservationId } = location.state;
  const [meetingListAsArtist, setMeetingListAsArtist] = useState(null);
  const [meetingListAsUser, setMeetingListAsUser] = useState(null);

  const fetchData = async () => {
    try {
      const url = '/api/meeting/list';
      const response = await API.get(url);
      console.log(response.data.data);
      console.log(response.data.data.meetingListAsArtist);
      console.log(response.data.data.meetingListAsUser);
      setMeetingListAsArtist(response.data.data.meetingListAsArtist);
      setMeetingListAsUser(response.data.data.meetingListAsUser);
    } catch (error) {
      console.error('예약 내역을 가져오는데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [setMeetingListAsArtist, setMeetingListAsUser]);

  return (
    <div>
      <MyPageSideBar />
      <div className="p-4 sm:ml-64">
        <div>
          {meetingListAsArtist
            && (
              <div>
                <div className="mx-auto md:mx-auto justify-center text-center">😊 작가로 참여한 예약 😊</div>
                {meetingListAsArtist.map((reservation) => (
                  <ReservationCheckCard key={reservation.meetingID} reservation={reservation} />
                ))}
              </div>
            )}
        </div>
        <div>
          {meetingListAsUser
            ? (
              <div>
                <div className="mx-auto md:mx-auto justify-center text-center">😊 고객으로 참여한 예약 😊</div>
                {meetingListAsUser.map((reservation) => (
                  <ReservationCheckCard key={reservation.meetingID} reservation={reservation} />
                ))}
              </div>
            ) : (
              <h1>아직 참여한 예약이 없습니다. 마음에 드는 작가님께 예약 신청을 한 후 실시간 드로잉을 받아보세요!</h1>
            )}
        </div>
      </div>
    </div>
  );
}

export default ReservationCheckPage;
