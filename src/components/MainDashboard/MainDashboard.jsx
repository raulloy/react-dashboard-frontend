import React from 'react';
// import Cards from '../Cards/Cards';

import Campaigns from '../Table/Campaigns';
import './MainDashboard.css';

const MainDashboard = () => {
  return (
    <div className="MainDash">
      {/* <Cards /> */}
      <Campaigns />
    </div>
  );
};

export default MainDashboard;
