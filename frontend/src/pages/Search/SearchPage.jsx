import React, { useState } from 'react';

function Search() {
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleClick = (buttonInfo) => {
    setSelectedButtons((prevSelectedButtons) => {
      if (prevSelectedButtons.includes(buttonInfo)) {
        // 이미 선택된 버튼을 클릭한 경우 해당 버튼의 스타일을 제거
        return prevSelectedButtons.filter((btn) => btn !== buttonInfo);
      }
      // 선택되지 않은 버튼을 클릭한 경우 해당 버튼의 스타일을 추가
      return [...prevSelectedButtons, buttonInfo];
    });
  };

  const isSelected = (buttonInfo) => (selectedButtons.includes(buttonInfo) ? 'bg-primary text-white' : '');

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 border-y" style={{ gridTemplateColumns: '100px 500px' }}>
        <div className="w-100">
          테마
        </div>
        <button
          type="button"
          onClick={() => handleClick('버튼 1')}
          className={`bg-transparent text-black ${isSelected('버튼 1')}`}
        >
          버튼 1
        </button>
        <div className="w-100">
          분위기
        </div>
        <button
          type="button"
          onClick={() => handleClick('버튼 7')}
          className={`bg-transparent text-black ${isSelected('버튼 7')}`}
        >
          버튼 7
        </button>
      </div>
      <div>
        {/* 클릭한 버튼들의 정보 표시 */}
        {selectedButtons.map((buttonInfo, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="flex">
            <p className="mr-2">{buttonInfo}</p>
            <button type="button" onClick={() => setSelectedButtons((prevSelectedButtons) => prevSelectedButtons.filter((btn) => btn !== buttonInfo))} className="text-red-500">
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
