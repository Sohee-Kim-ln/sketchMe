import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

/* eslint-disable react/react-in-jsx-scope */
function GalleryIntroPage() {
  const [desc, setDesc] = useState('');
  const artistId = 10;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/artist/desc/${artistId}`;
        const response = await API.get(url);
        const { data } = response;
        console.log(data);
        setDesc(data.data);
      } catch (error) {
        console.error('작가 소개글을 가져오는 데 실패했습니다.', error);
      }
    };
    fetchData();
  }, [artistId]); // artistId가 변경될 때마다 fetchData 함수를 호출합니다.
  return (
    <div className="flex justify-start items-center mx-auto mt-10 mb-10 pt-10 bg-white mx-4 md:mx-auto min-w-1xl max-w-md md:max-w-5xl">
      {desc}
    </div>
  );
}

export default GalleryIntroPage;
