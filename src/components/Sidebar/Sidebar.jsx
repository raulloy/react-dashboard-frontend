import React, { useState } from 'react';
import gimLogo from '../../images/gim-logo.png';
import './Sidebar.css';
import { SidebarData } from '../../data.js';

const Sidebar = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="Sidebars">
      {/* Logo */}
      <div className="logo">
        <img src={gimLogo} alt="gim-logo" />
        {/* <span>GIM</span> */}
      </div>

      {/* Menu */}
      <div className="menu">
        {SidebarData.map((item, index) => {
          return (
            <div
              className={
                selected === index && item.heading !== 'Logout'
                  ? 'menuItem active'
                  : 'menuItem'
              }
              key={index}
              onClick={() => setSelected(index)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
