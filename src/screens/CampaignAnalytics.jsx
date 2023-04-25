import React, { useEffect, useState } from 'react';
import { accounts } from '../data/data';
import { campaignsData } from '../data/facebook';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Chart from 'react-google-charts';

const CampaignAnalytics = () => {
  const [since, setSince] = useState('2023-04-01');
  const [until, setUntil] = useState('2023-04-15');

  const [selectedAccount, setSelectedAccount] = useState(accounts[0].id);
  const [campaignInsights, setCampaignInsights] = useState([]);

  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await campaignsData(
          selectedAccount,
          since,
          until
        );
        setCampaignInsights(campaignsResponse.campaigns.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [selectedAccount, since, until]);

  // console.log(campaignInsights);

  const chartData = [['Campaigns', selectedInsight]];
  campaignInsights.forEach((campaign) => {
    chartData.push([
      campaign.name,
      // campaign.insights ? parseFloat(campaign.insights.data[0].spend) : 0,
      selectedInsight
        ? campaign.insights
          ? parseFloat(campaign.insights.data[0][selectedInsight])
          : 0
        : null,
    ]);
  });

  const uniqueInsights = campaignInsights.reduce((acc, curr) => {
    curr.insights?.data?.forEach((insight) => {
      Object.keys(insight).forEach((key) => {
        if (!acc.includes(key)) {
          acc.push(key);
        }
      });
    });
    return acc;
  }, []);

  return (
    <div>
      <Form>
        <Row>
          <Col sm={4} md={3} className="my-2">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Desde</InputGroup.Text>
              <Form.Control
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col sm={4} md={3} className="my-2">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Hasta</InputGroup.Text>
              <Form.Control
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <div className="dropdown-button">
        <DropdownButton
          id="dropdown-basic-button"
          title={`${
            accounts.find((account) => account.id === selectedAccount)?.name
          }`}
        >
          {accounts.map((account) => (
            <Dropdown.Item
              key={account.id}
              onClick={() => setSelectedAccount(account.id)}
            >
              {account.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      <div className="dropdown-button">
        <DropdownButton
          id="dropdown-basic-button"
          title={`${selectedInsight ? selectedInsight : 'Select Insight'}`}
        >
          {uniqueInsights.map((insight) => (
            <Dropdown.Item
              key={insight}
              onClick={() => setSelectedInsight(insight)}
            >
              {insight ? insight : 'All Insights'}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      <div style={{ width: '100%', height: '0', paddingBottom: '60%' }}>
        <Chart
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            title: `Campaign ${selectedInsight} by Time Range`,
            hAxis: { title: 'Campaign' },
            vAxis: { title: `${selectedInsight}` },
            legend: 'none',
            backgroundColor: 'transparent',
          }}
          width="100%"
          height="400px"
          legendToggle
        />
      </div>
    </div>
  );
};

export default CampaignAnalytics;
