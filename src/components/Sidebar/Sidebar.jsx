import React, { useEffect, useState } from 'react';
import gimLogo from '../../images/gim-logo.png';
import { SidebarData } from '../../data/data';
import { FaBars } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ signoutHandler }) => {
  const location = useLocation();
  const [expanded, setExpaned] = useState(true);

  const sidebarVariants = {
    true: {
      left: '0',
    },
    false: {
      left: '-60%',
    },
  };

  useEffect(() => {
    // Handler to update the expanded state
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setExpaned(false);
      } else {
        setExpaned(true);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Collapse the sidebar on initial load if the window width is less than or equal to 768px
    if (window.innerWidth <= 768) {
      setExpaned(false);
    }

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: '60%' } : { left: '5%' }}
        onClick={() => setExpaned(!expanded)}
      >
        <FaBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''}
      >
        {/* logo */}
        <div className="logo">
          <img src={gimLogo} alt="gim-logo" />
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => {
            const isActive = item.path === location.pathname;
            return (
              <Link
                to={item.path}
                className={isActive ? 'menuItem active' : 'menuItem'}
                key={index}
                onClick={item.path ? signoutHandler : null}
              >
                <item.icon />
                <span>{item.heading}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
