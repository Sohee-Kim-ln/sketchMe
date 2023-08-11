import { React, useState, useEffect } from 'react';

function GalleryTag({ tags, onTagChange }) {
  const [localTags, setLocalTags] = useState(tags);

  useEffect(() => {
    // localTags가 변경될 때마다 부모 컴포넌트로 변경된 태그 배열 전달
    onTagChange(localTags);
  }, [localTags]);

  const handleClick = (buttonInfo) => {
    if (localTags.some((tag) => tag.index === buttonInfo.index)) {
      setLocalTags(localTags.filter((tag) => tag.index !== buttonInfo.index));
    } else {
      setLocalTags([...localTags, buttonInfo]);
    }
  };

  const isSelected = (buttonInfo) => (localTags.some((tag) => tag.index === buttonInfo.index) ? 'bg-primary_2 rounded-lg text-white' : '');
  const themeButton = [
    { index: 0, label: '1인' },
    { index: 1, label: '커플' },
    { index: 2, label: '가족' },
    { index: 3, label: '반려동물' },
    { index: 4, label: '효도' },
    { index: 5, label: '기념일' },
    { index: 6, label: '사실적인' },
  ];
  const vibeButton = [
    { index: 7, label: '따뜻한' },
    { index: 8, label: '귀여운' },
    { index: 9, label: '웃긴' },
    { index: 10, label: '산뜻한' },
    { index: 11, label: '즐거운' },
    { index: 12, label: '자연스러운' },
  ];
  const priceButton = [
    { index: 13, label: '~1000' },
    { index: 14, label: '1000 ~ 5000' },
    { index: 15, label: '5000 ~ 10000' },
    { index: 16, label: '10000 ~ 50000' },
    { index: 17, label: '50000 ~' },
  ];

  const generateButtonGrid = (buttons) => (
    <div className="flex">
      {buttons.map((button) => (
        <button
          key={button.index}
          type="button"
          onClick={() => handleClick(button)}
          className={`bg-transparent text-darkgrey rounded-xl hover:bg-primary_2 hover:text-white 2xl:mx-4 xl:mx-2 lg-mx-1 p-2 my-2 ${isSelected(button)}`}
        >
          {button.label}
        </button>
      ))}
    </div>

  );

  return (
    <div className="w-4/5 mx-auto mb-5">
      <div className="mx-auto mt-10">
        <div className="grid grid-cols-2 font-semibold justify-center items-stretch text-center" style={{ gridTemplateColumns: '80px 3fr' }}>
          <div className="flex items-center border-t border-darkgrey justify-center bg-grey">
            테마
          </div>
          <div className="border-t border-darkgrey flex flex-col">
            {generateButtonGrid(themeButton)}
          </div>
          <div className="flex items-center justify-center border-y border-darkgrey bg-grey">
            분위기
          </div>
          <div className="flex flex-col border-y border-darkgrey">
            {generateButtonGrid(vibeButton)}
          </div>
          <div className="flex items-center border-b border-darkgrey justify-center bg-grey">
            가격
          </div>
          <div className="border-b border-darkgrey flex flex-col">
            {generateButtonGrid(priceButton)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryTag;
