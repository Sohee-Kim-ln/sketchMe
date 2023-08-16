import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import MyPageSideBar from '../../components/MyPage/MyPageSideBar';
import Card from '../../components/common/Card';

function FavoriteArtistPage() {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const fetchData = async () => {
    try {
      const url = '/api/user/artist';
      const response = await API.get(url);
      console.log(response.data.data);
      const rawData = response.data.data;
      // Card에 넣기 위한 데이터 가공 로직
      const processedData = rawData.map((item) => {
        // 작가 데이터에 대한 가공 로직
        const processedItem = {
          ...item,
          cardUrl: item.imgUrlResponse.imgUrl,
        };
        return processedItem;
      });
      console.log('processedData : ', processedData);
      setFavoriteArtists(processedData);
    } catch (error) {
      console.error('관심 작가 목록을 가져오는데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <MyPageSideBar />
      <div className="p-4 sm:ml-64">
        {favoriteArtists ? (
          <div className="flex flex-wrap w-full items-start px-4 py-4">
            {favoriteArtists.map((artist) => (
              <div className="flex mr-10 mb-4" key={artist.id}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Card {...artist} />
              </div>
            ))}
          </div>
        ) : (
          <h1>아직 관심 작가로 등록된 작가가 없습니다. 관심 작가로 등록하면 이 곳에서 한 눈에 모아볼 수 있습니다!👻</h1>
        )}
      </div>
    </div>
  );
}

export default FavoriteArtistPage;
