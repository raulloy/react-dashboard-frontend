import * as React from 'react';
import { useState, useContext } from 'react';

import { Modal, Button } from 'react-bootstrap';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { accounts } from '../../data/data';
import { DateDropdown } from '../DatePickers/DateDropdown';
import { AdSetsDataStoreContext } from '../../data/AdSetsDataStore';
import { statusStyle } from './utils';
import './Table.css';

export default function AdSetsTable() {
  const {
    since,
    setSince,
    until,
    setUntil,
    selectedAccount,
    setSelectedAccount,
    campaignInsights,
    contacts,
  } = useContext(AdSetsDataStoreContext);

  const sortedCampaigns = campaignInsights.sort((a, b) => {
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') {
      return -1; // a comes before b
    } else if (b.status === 'ACTIVE' && a.status !== 'ACTIVE') {
      return 1; // b comes before a
    } else {
      return 0; // leave them in the same order
    }
  });

  const adsetsData = sortedCampaigns
    .map((element) => (element.adsets ? element.adsets.data : []))
    .flat();

  const contactsbyCampaign = contacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_grp=(\d+)/)?.[1]
      : null,
  }));

  // console.log('contactsbyCampaign', contactsbyCampaign);

  const contactCountsByCampaign = contactsbyCampaign.reduce((acc, contact) => {
    const campaign = adsetsData.find(
      (c) => c.id === contact.hs_analytics_first_url
    );
    const campaignId = campaign ? campaign.id : 'unknown';
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  // console.log('contactCountsByCampaign', contactCountsByCampaign);

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
                  {row?.name}
                </TableCell>
                <TableCell align="left">
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
              </TableRow>
            ))}
          </TableBody>
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
