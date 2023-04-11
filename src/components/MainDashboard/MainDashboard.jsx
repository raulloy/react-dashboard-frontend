import React from 'react';
import Cards from '../Cards/Cards';
import Table from '../Table/Table';
import './MainDashboard.css';

const MainDashboard = () => {
  return (
    <div className="MainDash">
      <h1>Admin Dashboard</h1>
      <Cards />
      <Table />
    </div>
  );
};

export default MainDashboard;
