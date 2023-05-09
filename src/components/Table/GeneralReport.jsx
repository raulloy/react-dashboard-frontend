import * as React from 'react';
import { useContext } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableFooter } from '@mui/material';

import { accounts } from '../../data/data';
import { DateDropdown } from '../DatePickers/DateDropdown';
import { CampaignsDataStoreContext } from '../../data/CampaignsDataStore';
import './Table.css';

export default function CampaignsTable() {
  const {
    since,
    setSince,
    until,
    setUntil,
    selectedAccount,
    setSelectedAccount,
    campaignInsights,
    // contacts,
  } = useContext(CampaignsDataStoreContext);

  // console.log(campaignInsights.filter((element) => element.objective === 'OUTCOME_ENGAGEMENT'));

  const campaignResults = [];
  campaignInsights
    .filter((element) => element.insights !== undefined)
    .forEach((campaign) => {
      let spend, objective, result;

      if (
        campaign.objective === 'OUTCOME_LEADS' ||
        campaign.objective === 'LEAD_GENERATION'
      ) {
        spend = parseFloat(campaign.insights.data[0].spend);
        objective = 'Leads';
        result = campaign.insights.data[0].actions.reduce((acc, action) => {
          if (action.action_type === 'lead') {
            return acc + parseInt(action.value);
          } else {
            return acc;
          }
        }, 0);
      } else if (
        campaign.objective === 'LINK_CLICKS' ||
        campaign.objective === 'OUTCOME_TRAFFIC'
      ) {
        spend = parseFloat(campaign.insights.data[0].spend);
        objective = 'Traffic';
        result = campaign.insights.data[0].actions.reduce((acc, action) => {
          if (action.action_type === 'link_click') {
            return acc + parseInt(action.value);
          } else {
            return acc;
          }
        }, 0);
      } else if (campaign.objective === 'MESSAGES') {
        spend = parseFloat(campaign.insights.data[0].spend);
        objective = 'Messages';
        result = campaign.insights.data[0].actions.reduce((acc, action) => {
          if (
            action.action_type ===
            'onsite_conversion.messaging_conversation_started_7d'
          ) {
            return acc + parseInt(action.value);
          } else {
            return acc;
          }
        }, 0);
      } else if (campaign.objective === 'POST_ENGAGEMENT') {
        spend = parseFloat(campaign.insights.data[0].spend);
        objective = 'Interaction';
        result =
          campaign.insights.data[0].actions.reduce((acc, action) => {
            if (action.action_type === 'video_view') {
              return acc + parseInt(action.value);
            } else {
              return acc;
            }
          }, 0) +
          campaign.insights.data[0].actions.reduce((acc, action) => {
            if (action.action_type === 'link_click') {
              return acc + parseInt(action.value);
            } else {
              return acc;
            }
          }, 0);
      } else if (campaign.objective === 'OUTCOME_ENGAGEMENT') {
        spend = parseFloat(campaign.insights.data[0].spend);
        objective = 'Engagement';
        result =
          campaign.insights.data[0].actions.reduce((acc, action) => {
            if (action.action_type === 'like') {
              return acc + parseInt(action.value);
            } else {
              return acc;
            }
          }, 0) +
          campaign.insights.data[0].actions.reduce((acc, action) => {
            if (
              action.action_type ===
              'onsite_conversion.messaging_conversation_started_7d'
            ) {
              return acc + parseInt(action.value);
            } else {
              return acc;
            }
          }, 0);
      } else if (campaign.objective === 'OUTCOME_AWARENESS') {
        spend = parseFloat(campaign.insights.data[0].spend);
        objective = 'Awareness';
        result = campaign.insights.data.reduce((acc, curr) => {
          return acc + parseInt(curr.reach);
        }, 0);
      }

      campaignResults.push({ spend, objective, result });
    });

  const campaignResultsSum = campaignResults
    .filter((obj) => Object.keys(obj).length > 0)
    .reduce((acc, obj) => {
      const index = acc.findIndex((item) => item.objective === obj.objective);
      if (index !== -1) {
        acc[index].result += obj.result;
        acc[index].spend += obj.spend;
      } else {
        acc.push(obj);
      }
      return acc;
    }, []);

  // console.log(campaignResultsSum);

  const grandTotalSpend = campaignResultsSum.reduce(
    (total, obj) => total + obj.spend,
    0
  );

  return (
    <div className="Table">
      <h3>Reporte General</h3>

      <DateDropdown
        since={since}
        setSince={setSince}
        until={until}
        setUntil={setUntil}
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />

      <TableContainer
        component={Paper}
        style={{
          boxShadow: '0px 13px 20px 0px #80808029',
          overflow: 'auto',
          backgroundColor: 'transparent',
        }}
        sx={{ maxHeight: 350, maxWidth: 1000 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Objetivo</TableCell>
              <TableCell align="center">Gastado</TableCell>
              <TableCell align="center">Resultados</TableCell>
              <TableCell align="center">Costo</TableCell>
              <TableCell align="center">Gasto %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: 'white' }}>
            {campaignResultsSum.map((element) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{element.objective}</TableCell>
                <TableCell align="center">
                  ${element.spend.toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center">
                  {element.result.toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center">
                  {(element.spend / element.result)
                    .toFixed(2)
                    .toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center">
                  {((element.spend / grandTotalSpend) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                Grand Total
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                ${grandTotalSpend.toLocaleString('en-US')}
              </TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
