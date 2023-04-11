// Sidebar imports
import { FaRegBuilding, FaRegFolder } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { MdOutlineSpaceDashboard } from 'react-icons/md';

// Recent Card Imports
import img1 from './images/profile.png';
// Sidebar Data
export const SidebarData = [
  {
    icon: MdOutlineSpaceDashboard,
    heading: 'Dashboard',
  },
  {
    icon: FaRegBuilding,
    heading: 'Accounts',
  },
  {
    icon: FaRegFolder,
    heading: 'Campaigns',
  },
  {
    icon: FiLogIn,
    heading: 'Logout',
  },
];

// Analytics Cards Data
export const cardsData = [
  {
    id: '1',
    title: 'Sales',
    color: {
      backGround: 'linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)',
      boxShadow: '0px 10px 20px 0px #e0c6f5',
    },
    barValue: 70,
    value: '25,970',
    png: FaRegBuilding,
    series: [
      {
        name: 'Sales',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    id: '2',
    title: 'Revenue',
    color: {
      backGround: 'linear-gradient(180deg, #FF919D 0%, #FC929D 100%)',
      boxShadow: '0px 10px 20px 0px #FDC0C7',
    },
    barValue: 80,
    value: '14,270',
    png: FaRegBuilding,
    series: [
      {
        name: 'Revenue',
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  {
    id: '3',
    title: 'Expenses',
    color: {
      backGround:
        'linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)',
      boxShadow: '0px 10px 20px 0px #F9D59B',
    },
    barValue: 60,
    value: '4,270',
    png: FaRegBuilding,
    series: [
      {
        name: 'Expenses',
        data: [10, 25, 15, 30, 12, 15, 20],
      },
    ],
  },
];

// Recent Update Card Data
export const UpdatesData = [
  {
    img: img1,
    name: 'Andrew Thomas',
    noti: 'has ordered Apple smart watch 2500mh battery.',
    time: '25 seconds ago',
  },
  {
    img: img1,
    name: 'James Bond',
    noti: 'has received Samsung gadget for charging battery.',
    time: '30 minutes ago',
  },
  {
    img: img1,
    name: 'Iron Man',
    noti: 'has ordered Apple smart watch, samsung Gear 2500mh battery.',
    time: '2 hours ago',
  },
];
