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
    contacts,
  } = useContext(CampaignsDataStoreContext);

  const fbContacts = contacts.filter(
    (element) =>
      element.properties.hs_analytics_first_url &&
      element.properties.hs_analytics_first_url.includes('facebook.com')
  );

  const contactsbyCampaign = fbContacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_cam=(\d+)/)?.[1]
      : null,
    lifecyclestage: properties.lifecyclestage,
  }));

  const contactCountsByCampaign = fbContacts.reduce((acc, contact) => {
    const campaignId =
      contact.properties.hs_analytics_first_url?.match(/hsa_cam=(\d+)/)?.[1] ||
      null;
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  const matchingCampaign = campaignInsights.map((item) => {
    const result = contactsbyCampaign.filter(
      (campaign) => campaign.hs_analytics_first_url === item.id
    );
    return result;
  });

  const campaignResults = campaignInsights.map((campaign) => {
    const { objective, insights: { data } = { data: [] } } = campaign;
    const spend = parseFloat(data[0] ? data[0].spend : 0);

    let objectiveName,
      assignments,
      result = 0;

    switch (objective) {
      case 'OUTCOME_LEADS':
      case 'LEAD_GENERATION':
        objectiveName = 'Leads';
        assignments = matchingCampaign
          .flat()
          .filter((item) => item.hs_analytics_first_url === campaign.id).length;
        result = data[0]
          ? data[0].actions.reduce((acc, action) => {
              if (action.action_type === 'lead') {
                return acc + parseInt(action.value);
              }
              return acc;
            }, 0)
          : 0;
        break;
      case 'LINK_CLICKS':
      case 'OUTCOME_TRAFFIC':
        objectiveName = 'Traffic';
        assignments = [contactCountsByCampaign].reduce(
          (acc, obj) => (campaign.id in obj ? obj[campaign.id] : acc),
          0
        );
        result = data[0]
          ? data[0].actions.reduce((acc, action) => {
              if (action.action_type === 'link_click') {
                return acc + parseInt(action.value);
              }
              return acc;
            }, 0)
          : 0;
        break;
      case 'MESSAGES':
        objectiveName = 'Messages';
        assignments = [contactCountsByCampaign].reduce(
          (acc, obj) => (campaign.id in obj ? obj[campaign.id] : acc),
          0
        );
        result = data[0]
          ? data[0].actions.reduce((acc, action) => {
              if (
                action.action_type ===
                'onsite_conversion.messaging_conversation_started_7d'
              ) {
                return acc + parseInt(action.value);
              }
              return acc;
            }, 0)
          : 0;
        break;
      case 'POST_ENGAGEMENT':
        objectiveName = 'Interaction';
        assignments = [contactCountsByCampaign].reduce(
          (acc, obj) => (campaign.id in obj ? obj[campaign.id] : acc),
          0
        );
        result = data[0]
          ? data[0].actions.reduce((acc, action) => {
              if (action.action_type === 'video_view') {
                return acc + parseInt(action.value);
              } else if (action.action_type === 'link_click') {
                return acc + parseInt(action.value);
              }
              return acc;
            }, 0)
          : 0;
        break;
      case 'OUTCOME_ENGAGEMENT':
        objectiveName = 'Engagement';
        assignments = [contactCountsByCampaign].reduce(
          (acc, obj) => (campaign.id in obj ? obj[campaign.id] : acc),
          0
        );
        result = data[0]
          ? data[0].actions.reduce((acc, action) => {
              if (action.action_type === 'like') {
                return acc + parseInt(action.value);
              } else if (
                action.action_type ===
                'onsite_conversion.messaging_conversation_started_7d'
              ) {
                return acc + parseInt(action.value);
              }
              return acc;
            }, 0)
          : 0;
        break;
      case 'OUTCOME_AWARENESS':
        objectiveName = 'Awareness';
        assignments = [contactCountsByCampaign].reduce(
          (acc, obj) => (campaign.id in obj ? obj[campaign.id] : acc),
          0
        );
        result = data
          ? data.reduce((acc, curr) => {
              return acc + parseInt(curr.reach);
            }, 0)
          : 0;
        break;
      default:
        objectiveName = 'Unknown';
        break;
    }

    return { spend, objective: objectiveName, assignments, result };
  });

  const campaignResultsSum = campaignResults
    .filter((obj) => Object.keys(obj).length > 0 && obj.objective !== 'Unknown')
    .reduce((acc, obj) => {
      const index = acc.findIndex((item) => item.objective === obj.objective);
      if (index !== -1) {
        acc[index].result += obj.result;
        acc[index].spend += obj.spend;
        acc[index].assignments += obj.assignments;
      } else {
        acc.push(obj);
      }
      return acc;
    }, []);

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
        sx={{ maxHeight: 450 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Objetivo</TableCell>
              <TableCell align="center">Gastado</TableCell>
              <TableCell align="center">Resultados</TableCell>
              <TableCell align="center">Costo por resultado</TableCell>
              <TableCell align="center">Gasto %</TableCell>
              <TableCell align="center">Asignaciones</TableCell>
              <TableCell align="center">Costo por asignación</TableCell>
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
                  $
                  {(element.spend / element.result || 0)
                    .toFixed(2)
                    .toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center">
                  {((element.spend / grandTotalSpend) * 100).toFixed(1)}%
                </TableCell>
                <TableCell align="center">{element.assignments || 0}</TableCell>
                <TableCell align="center">
                  $
                  {element.assignments !== 0
                    ? (element.spend / element.assignments).toLocaleString(
                        'en-US',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : '0.00'}
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
