import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Table.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

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
  const id = '930432200705578';
  const [since, setSince] = useState('2023-02-01');
  const [until, setUntil] = useState('2023-02-03');

  const [campaignInsights, setCampaignInsights] = useState([]);
  // const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await axios.get(
          `/api/campaign-insights/act_${id}?since=${since}&until=${until}`
        );
        setCampaignInsights(campaignsResponse.data.campaigns.data);

        // Fetch Contacts
        // const contactsResponse = await axios.get(
        //   `/api/contacts-by-time-range?since=${since}&until=${until}`
        // );
        // setContacts(contactsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, since, until]);

  // console.log(campaignInsights);
  // console.log(contacts);

  return (
    <div className="Table">
      <h3>Campaign Insights</h3>
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
              <TableCell align="left">Objective</TableCell>
              <TableCell align="left">Spend</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Assigments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: 'white' }}>
            {campaignInsights.map((row) => (
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
                <TableCell align="left" className="Details">
                  Details
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
