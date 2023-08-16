import { React, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchTab from './SearchTab';
import Tag from '../../components/search/Tag';
import Reload from '../../assets/icons/Reload.jpg';
import {
  addSelectedButton,
  removeSelectedButton,
  removeAllSelectedButtons,
} from '../../reducers/SearchSlice';

function SearchPage() {
  const dispatch = useDispatch();
  const selectedButtons = useSelector((state) => state.search.selectedButtons);
  const [page, setPage] = useState(1);

  useEffect(
    () => () => {
      if (selectedButtons.length > 0) {
        dispatch(removeAllSelectedButtons());
      }
    },
    [],
  );

  const handleClick = (buttonInfo) => {
    if (selectedButtons.includes(buttonInfo)) {
      dispatch(removeSelectedButton(buttonInfo));
    } else {
      dispatch(addSelectedButton(buttonInfo));
    }
  };

  const handleClearAll = () => {
    // Clear all selected buttons using dispatch
    dispatch(removeAllSelectedButtons());
  };

  const isSelected = (buttonInfo) => (selectedButtons.includes(buttonInfo) ? 'bg-primary_2 rounded-lg text-white' : '');
  const themeButton = ['1인', '커플', '가족', '반려동물', '효도', '기념일', '사실적인'];
  const vibeButton = ['따뜻한', '귀여운', '웃긴', '산뜻한', '즐거운', '자연스러운'];
  const priceButton = ['~ 1000', '1000 ~ 5000', '5000 ~ 10000', '10000 ~ 50000', '50000 ~'];

  // Reusable function to generate grid rows for buttons

  const generateButtonGrid = (buttons) => (
    <div className="flex">
      {buttons.map((buttonText) => (
        <button
          key={buttonText}
          type="button"
          onClick={() => handleClick(buttonText)}
          className={`bg-transparent text-darkgrey rounded-xl hover:bg-primary_2 hover:text-white 2xl:mx-4 xl:mx-2 lg-mx-1 p-2 my-2 ${isSelected(buttonText)}`}
        >
          {buttonText}
        </button>
      ))}
    </div>

  );

  return (
    <div className="w-3/4 mx-auto">
      <div className="w-2/3 mx-auto mt-10">
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
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex flex-wrap" style={{ maxWidth: '1030px' }}>
            {selectedButtons.map((button, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Tag key={index} message={button} onClick={() => handleClick(button)} />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={handleClearAll} className="inline-flex items-center border font-semibold text-black pe-3 py-2 rounded min-h-10">
            <img src={Reload} alt="" className="w-6 inline mx-1 mb-1" />
            전체삭제
          </button>
        </div>
      </div>
      <SearchTab currentPage={page} setPage={setPage} />
    </div>
  );
}

export default SearchPage;
