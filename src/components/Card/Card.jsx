import React, { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Chart from 'react-apexcharts';
import './Card.css';

// parent Card

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimateSharedLayout>
      {expanded ? (
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </AnimateSharedLayout>
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
      onClick={setExpanded}
    >
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue}%`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>${param.value}</span>
        <span></span>
      </div>
    </motion.div>
  );
}

// Expanded Card
function ExpandedCard({ param, setExpanded }) {
  const data = {
    options: {
      chart: {
        type: 'area',
        height: 'auto',
      },
      dropShadow: {
        enabled: false,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: '#000',
        opacity: 0.35,
      },
      fill: {
        colors: ['#fff'],
        type: 'gradient',
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#3b3a3a'],
        },
        background: {
          enabled: false,
        },
        formatter: function (value) {
          return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['white'],
      },
      tooltip: {
        y: {
          // format y axis as money
          formatter: function (value) {
            return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          },
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: 'category',
        categories: param.accounts,
        labels: {
          style: {
            fontSize: '9px',
          },
        },
      },
      yaxis: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 576, // mobile
          options: {
            chart: {
              height: '240px',
            },
          },
        },
        {
          breakpoint: 768, // tablet
          options: {
            chart: {
              height: '260px',
            },
          },
        },
        // {
        //   breakpoint: 992, // desktop
        //   options: {
        //     chart: {
        //       height: '500px',
        //     },
        //   },
        // },
      ],
    },
  };

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: 'flex-end', cursor: 'pointer', color: 'white' }}>
        <FaTimes onClick={setExpanded} />
      </div>
      <span>{param.title}</span>
      <div className="chartContainer">
        <Chart options={data.options} series={param.series} type="area" />
      </div>
      <span>{param.dateRange}</span>
    </motion.div>
  );
}

export default Card;
