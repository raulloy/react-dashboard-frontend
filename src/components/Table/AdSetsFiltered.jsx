import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableFooter } from '@mui/material';
import Paper from '@mui/material/Paper';
import { AdSetsDataStoreContext } from '../../data/AdSetsDataStore';
import { statusStyle } from './utils';
import DateRangeInput from '../DatePickers/DateRangeInput';
import './Table.css';

export default function AdSetsTable() {
  const { since, setSince, until, setUntil, campaignInsights, contacts } =
    useContext(AdSetsDataStoreContext);

  const params = useParams();
  const { campaign_id } = params;

  const adSetsInsights = campaignInsights
    .filter(
      (element) =>
        element.adsets && element.adsets.data[0].campaign_id === campaign_id
    )
    .map((element) => element.adsets && element.adsets.data)
    .flat();

  const grandTotalSpend = adSetsInsights.reduce((total, element) => {
    if (element.insights) {
      return total + parseFloat(element.insights.data[0].spend);
    }
    return total;
  }, 0);

  const adsetsData = campaignInsights
    .map((element) => (element.adsets ? element.adsets.data : []))
    .flat()
    .filter((element) => element.campaign_id === campaign_id)
    .sort((a, b) => {
      if (
        a.insights &&
        a.insights.data &&
        a.insights.data[0] &&
        parseFloat(a.insights.data[0].spend) > 0
      ) {
        return -1;
      } else if (
        b.insights &&
        b.insights.data &&
        b.insights.data[0] &&
        parseFloat(b.insights.data[0].spend) > 0
      ) {
        return 1;
      } else {
        return 0;
      }
    });

  const contactsbyCampaign = contacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_grp=(\d+)/)?.[1]
      : null,
  }));

  const contactCountsByCampaign = contactsbyCampaign.reduce((acc, contact) => {
    const campaign = adsetsData.find(
      (c) => c.id === contact.hs_analytics_first_url
    );
    const campaignId = campaign ? campaign.id : 'unknown';
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  const [show, setShow] = useState(false);
  const [contactsInfo, setContactsInfo] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (campaignID) => {
    const matchingCampaign = contactsbyCampaign.filter(
      (campaign) => campaign.hs_analytics_first_url === campaignID
    );

    const matchingContact = contacts.filter((contact) =>
      matchingCampaign.some((campaign) => campaign.id === contact.id)
    );

    setShow(true);

    if (matchingContact) {
      setContactsInfo(matchingContact);
    } else {
      console.log('No matching contact found.');
    }
  };

  return (
    <div className="Table">
      <h3>Ad Sets Insights</h3>

      <DateRangeInput
        since={since}
        setSince={setSince}
        until={until}
        setUntil={setUntil}
      />

      <TableContainer
        component={Paper}
        style={{
          boxShadow: '0px 13px 20px 0px #80808029',
          overflow: 'auto',
          backgroundColor: 'transparent',
        }}
        sx={{ maxHeight: 350 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Campaña</TableCell>
              <TableCell align="left">Conjuntos de anuncios</TableCell>
              <TableCell align="left">Gastado</TableCell>
              <TableCell align="left">Estado</TableCell>
              <TableCell align="left">Asignaciones</TableCell>
              <TableCell align="left">Alcance</TableCell>
              <TableCell align="left">Impresiones</TableCell>
              <TableCell align="left">Clics</TableCell>
              <TableCell align="left">CPC</TableCell>
              <TableCell align="left">CTR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: 'white' }}>
            {adsetsData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.campaign?.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link to={`/ads/${row.id}`}>{row?.name}</Link>
                </TableCell>
                <TableCell align="center">
                  ${row.insights ? row.insights.data[0].spend : 0}
                </TableCell>
                <TableCell align="left">
                  <span className="status" style={statusStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="center" className="Details">
                  <Button variant="link" onClick={() => handleShow(row.id)}>
                    {[contactCountsByCampaign].reduce(
                      (acc, obj) => (row.id in obj ? obj[row.id] : acc),
                      0
                    )}
                  </Button>
                </TableCell>
                <TableCell align="center">
                  {parseInt(
                    row.insights ? row.insights.data[0].reach : 0
                  ).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center">
                  {parseInt(
                    row.insights ? row.insights.data[0].impressions : 0
                  ).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center">
                  {parseInt(
                    row.insights ? row.insights.data[0].clicks : 0
                  ).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center">
                  {parseFloat(
                    row.insights ? row.insights.data[0].cpc : 0
                  ).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  {parseFloat(
                    row.insights ? row.insights.data[0].ctr : 0
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="left" style={{ fontWeight: 'bold' }}>
                Grand Total
              </TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>
                ${grandTotalSpend.toLocaleString('en-US')}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Asignaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ overflowX: 'auto' }}>
            <table className="popup-table">
              <thead>
                <tr>
                  <th>Desarrollo</th>
                  <th>Canal de captación</th>
                  <th>Subcanal de captación</th>
                  <th>Fecha de asignación</th>
                  <th>Correo</th>
                  <th>Fecha de creación</th>
                  <th>Facilitador</th>
                  <th>Fuente original</th>
                  <th>Etapa del ciclo de vida</th>
                  <th>Estado del lead</th>
                </tr>
              </thead>
              <tbody>
                {contactsInfo.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.properties.desarrollo}</td>
                    <td>{contact.properties.canal_de_captacion}</td>
                    <td>{contact.properties.sub_canal_de_captacion}</td>
                    <td>
                      {new Date(
                        contact.properties.hubspot_owner_assigneddate
                      ).toLocaleDateString('es-MX')}
                    </td>
                    <td>{contact.properties.email}</td>
                    <td>
                      {new Date(
                        contact.properties.createdate
                      ).toLocaleDateString('es-MX')}
                    </td>
                    <td>{contact.properties.facilitador_compra_contacto}</td>
                    <td>{contact.properties.hs_analytics_source}</td>
                    <td>{contact.properties.lifecyclestage}</td>
                    <td>{contact.properties.hs_lead_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// const campaignInsights = [
//   {
//     name: 'Lomas de la Plata-Oro/IGStoriesCon/Leads/26-04-2023',
//     account_id: '930432200705578',
//     campaign_id: '23854211679280359',
//     campaign: {
//       name: 'Lomas de la Plata-Oro/IGStoriesCam/Leads/26-04-2023',
//       id: '23854211679280359',
//     },
//     status: 'ACTIVE',
//     id: '23854211679290359',
//   },
//   {
//     name: 'Lomas de la Plata-General/FbCon/Leads/20-04-23',
//     account_id: '930432200705578',
//     campaign_id: '23854126524780359',
//     campaign: {
//       name: 'Lomas de la Plata-General/FbCam/Leads/20-04-23',
//       id: '23854126524780359',
//     },
//     status: 'ACTIVE',
//     insights: {
//       data: [
//         {
//           reach: '53509',
//           clicks: '534',
//           impressions: '76121',
//           spend: '2241.12',
//           cpc: '4.196854',
//           ctr: '0.701515',
//         },
//       ],
//     },
//     id: '23854126525510359',
//   },
//   {
//     name: 'Lomas de la Plata- Platino/FBCon/Leads/RMK/01-03-23',
//     account_id: '930432200705578',
//     campaign_id: '23854112376210359',
//     campaign: {
//       name: 'Lomas de la Plata- Platino/FBCam/Leads/RMK/01-03-23',
//       id: '23854112376210359',
//     },
//     status: 'ACTIVE',
//     insights: {
//       data: [
//         {
//           reach: '15200',
//           clicks: '412',
//           impressions: '19839',
//           spend: '2289.83',
//           cpc: '5.55784',
//           ctr: '2.076718',
//         },
//       ],
//     },
//     id: '23854112398650359',
//   },
// ];
