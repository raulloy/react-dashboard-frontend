import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Modal, Button } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Table.css';
import { accounts } from '../../data';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { campaignsData } from '../../data/facebook';
import { contactsData } from '../../data/hubspot';

const makeStyle = (status) => {
  if (status === 'ACTIVE') {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    };
  } else if (status === 'PAUSED') {
    return {
      background: '#ffadad8f',
      color: 'red',
    };
  } else {
    return {
      background: '#59bfff',
      color: 'white',
    };
  }
};

export default function BasicTable() {
  const [since, setSince] = useState('2023-03-01');
  const [until, setUntil] = useState('2023-03-31');

  const [selectedAccount, setSelectedAccount] = useState(accounts[0].id);
  const [campaignInsights, setCampaignInsights] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await campaignsData(
          selectedAccount,
          since,
          until
        );
        setCampaignInsights(campaignsResponse.data.campaigns.data);

        // Fetch Contacts
        const contactsResponse = await contactsData(since, until);
        setContacts(contactsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [selectedAccount, since, until]);

  const sortedCampaigns = campaignInsights.sort((a, b) => {
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') {
      return -1; // a comes before b
    } else if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') {
      return 1; // b comes before a
    } else {
      return 0; // leave them in the same order
    }
  });

  const contactsbyCampaign = contacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_cam=(\d+)/)?.[1]
      : null,
  }));

  // console.log('contactsbyCampaign', contactsbyCampaign);

  const contactCountsByCampaign = contactsbyCampaign.reduce((acc, contact) => {
    const campaign = campaignInsights.find(
      (c) => c.id === contact.hs_analytics_first_url
    );
    const campaignId = campaign ? campaign.id : 'unknown';
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  // console.log('contactCountsByCampaign', contactCountsByCampaign);

  return (
    <div className="Table">
      <h3>Campaign Insights</h3>

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

      <TableContainer
        component={Paper}
        style={{
          boxShadow: '0px 13px 20px 0px #80808029',
          overflow: 'auto',
        }}
        sx={{ maxHeight: 400 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Campaña</TableCell>
              <TableCell align="left">Objetivo</TableCell>
              <TableCell align="left">Gastado</TableCell>
              <TableCell align="left">Estado</TableCell>
              <TableCell align="left">Asignaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: 'white' }}>
            {sortedCampaigns.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.objective}</TableCell>
                <TableCell align="left">
                  ${row.insights ? row.insights.data[0].spend : 0}
                </TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="center" className="Details">
                  <Button variant="primary">
                    {[contactCountsByCampaign].reduce(
                      (acc, obj) => (row.id in obj ? obj[row.id] : acc),
                      0
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
