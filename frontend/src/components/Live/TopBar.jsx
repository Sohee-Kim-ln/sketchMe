import React from 'react';
// import logo from '@/assets/Logo.png';
import logo from 'src/assets/Logo.png';

function TopBar() {
  return (
    <div>
      <img src={logo} className="logo" alt="logo" />
    </div>
  );
}

export default TopBar;
