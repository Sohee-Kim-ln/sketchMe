import React from 'react';
import PropTypes from 'prop-types';
// import logo from '@/assets/Logo.png';
// import logo from '../../../public/favi/android-icon-192x192.png';

function TopBar({ status, productName }) {
  let message = '';
  if (status === 0) {
    message = '드로잉 상담';
  } else if (status === 1) {
    message = '드로잉 중';
  } else {
    message = '드로잉 결과';
  }
  const roomTitle = `${message}: ${productName}`;

  return (
    <div className="flex sticky top-0 h-20 bg-primary_3 z-50 align-middle whitespace-nowrap">
      <img
        src="favi/ms-icon-310x310.png"
        alt="스케치미 로고"
        className="h-16 inline-block absolute top-2 left-10"
      />
      <span id="LogoLetter" className="absolute left-24 top-4 ps-4">
        {roomTitle}
      </span>
    </div>
  );
}

TopBar.propTypes = {
  status: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
};

export default TopBar;
