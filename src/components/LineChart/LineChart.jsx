import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CampaignsByMonthDataStoreContext } from '../../data/CampaignsByMonthDataStore';
import { Chart } from 'react-google-charts';
import { Dropdown, Form } from 'react-bootstrap';
import './LineChart.css';

const LineChart = () => {
  const { campaignInsights } = useContext(CampaignsByMonthDataStoreContext);
  const [selectedParameters, setSelectedParameters] = useState(['Reach']);

  // const fbContacts = contacts.filter((element) => {
  //   if (
  //     element.properties.hs_analytics_first_url &&
  //     element.properties.hs_analytics_first_url.includes('facebook.com')
  //   ) {
  //     const assignedDate = new Date(
  //       element.properties.hubspot_owner_assigneddate
  //     );
  //     const sinceDate = new Date('2023-04-01');
  //     const untilDate = new Date('2023-06-30');
  //     return assignedDate >= sinceDate && assignedDate <= untilDate;
  //   }
  //   return false;
  // });
  // console.log(fbContacts);

  const [data, setData] = useState([['Month', 'Parametro']]);
  const months = useMemo(
    () => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    []
  );
  const parameters = [
    'Reach',
    'Spend',
    'Leads',
    'Clicks',
    'Impressions',
    'CPC',
    'CPL',
  ];

  useEffect(() => {
    // Function to update the data whenever campaignInsights or selectedParameter changes
    const updateChartData = () => {
      const newData = [['Month', ...selectedParameters]];

      campaignInsights.forEach((account, index) => {
        const reach = parseInt(account.reach);
        const spend = parseFloat(account.spend);
        const clicks = parseInt(account.clicks);
        const impressions = parseInt(account.impressions);
        const cpc = parseInt(account.cpc);
        const leads = parseInt(
          (
            account.actions.find((account) => account.action_type === 'lead') ||
            {}
          ).value ?? 0
        );
        const cpl = parseFloat(
          (
            account.cost_per_action_type.find(
              (account) => account.action_type === 'lead'
            ) || {}
          ).value ?? 0
        );

        const selectedValues = selectedParameters.map((param) => {
          if (param === 'Reach') {
            return reach;
          } else if (param === 'Spend') {
            return spend;
          } else if (param === 'Leads') {
            return leads;
          } else if (param === 'Clicks') {
            return clicks;
          } else if (param === 'Impressions') {
            return impressions;
          } else if (param === 'CPC') {
            return cpc;
          } else if (param === 'CPL') {
            return cpl;
          }
          return 0; // If the parameter is not found, return 0
        });

        newData.push([months[index], ...selectedValues]);
      });

      setData(newData);
    };

    updateChartData();
  }, [campaignInsights, selectedParameters, months]);

  const options = {
    // title: 'Parameter by month',
    curveType: 'function',
    legend: { position: 'top' },
    backgroundColor: 'transparent',
    vAxis: {
      gridlines: { color: 'transparent' },
    },
    series: {
      0: { lineWidth: 4 },
      1: { lineWidth: 4 },
      2: { lineWidth: 4 },
      3: { lineWidth: 4 },
      4: { lineWidth: 4 },
    },
  };

  if (campaignInsights.length === 0) {
    return <div>Getting data...</div>;
  }

  return (
    <div>
      <div className="dropdown-button">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {`Parámetros: ${selectedParameters.join(', ')}`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {parameters.map((parameter) => (
              <Form.Check
                key={parameter}
                type="checkbox"
                id={`checkbox-${parameter}`}
                label={parameter}
                checked={selectedParameters.includes(parameter)}
                onChange={(e) => {
                  const { checked } = e.target;
                  setSelectedParameters((prevSelected) =>
                    checked
                      ? [...prevSelected, parameter]
                      : prevSelected.filter((param) => param !== parameter)
                  );
                }}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="chart-container">
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default LineChart;
