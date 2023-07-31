import React from 'react';
import UserVideo from '../../components/Live/UserVideo';
import { useSelector } from 'react-redux';

function ConsultPage() {
  const thisMainStreamManager = useSelector(
    (state) => state.live.mainStreamManager
  );
  const thisSubscribers = useSelector((state) => state.live.subscribers);
  const thisPublisher = useSelector((state) => state.live.publisher);
  console.log(thisMainStreamManager);

  return (
    <div>
      상담화면 입니다
      {/* <UserVideo streamManager={thisMainStreamManager} /> */}
      <UserVideo streamManager={thisPublisher} />
      {thisSubscribers.length === 0
        ? thisSubscribers.map((sub, i) => (
            <UserVideoComponent streamManager={sub} />
          ))
        : null}
    </div>
  );
}

export default ConsultPage;
