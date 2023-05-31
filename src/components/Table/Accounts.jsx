import * as React from 'react';
import { useState, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal, Button } from 'react-bootstrap';
import DateRangeInput from '../DatePickers/DateRangeInput';
import { AccountsDataStoreContext } from '../../data/AccountsDataStore';
import Cards from '../Cards/Cards';
import { saveAs } from 'file-saver';
import { facilitadores } from '../../facilitadores';
import './Table.css';

export default function AccountsTable() {
  const { since, setSince, until, setUntil, accountInsights, contacts } =
    useContext(AccountsDataStoreContext);

  const contactsbyCampaign = contacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_acc=(\d+)/)?.[1]
      : null,
    lifecyclestage: properties.lifecyclestage,
  }));

  const contactCountsByCampaign = contacts.reduce((acc, contact) => {
    const campaignId =
      contact.properties.hs_analytics_first_url?.match(/hsa_acc=(\d+)/)?.[1] ||
      null;
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  const [showContacts, setShowContacts] = useState(false);
  const [contactsInfo, setContactsInfo] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  const handleCloseContacts = () => setShowContacts(false);
  const handleShowContacts = (campaignID, filter) => {
    const matchingCampaign = contactsbyCampaign.filter(
      (campaign) => campaign.hs_analytics_first_url === campaignID
    );
    const matchingContact = contacts.filter((contact) =>
      matchingCampaign.some(
        (campaign) =>
          campaign.id === contact.id &&
          (filter ? filter === contact.properties.lifecyclestage : true)
      )
    );
    setShowContacts(true);
    setContactsInfo(matchingContact);

    const modalTitle = filter ? `Asignaciones - ${filter}` : 'Asignaciones';
    setModalTitle(modalTitle);
  };

  const generateCSV = () => {
    const headers = [
      'Desarrollo',
      'Canal de captación',
      'Subcanal de captación',
      'Fecha de asignación',
      'Correo',
      'Fecha de creación',
      'Facilitador',
      'Fuente original',
      'Etapa del ciclo de vida',
      'Estado del lead',
    ];

    const csvContent = [
      headers.join(','),
      ...contactsInfo.map((contact) =>
        [
          contact.properties.desarrollo,
          contact.properties.canal_de_captacion,
          contact.properties.sub_canal_de_captacion,
          new Date(
            contact.properties.hubspot_owner_assigneddate
          ).toLocaleDateString('es-MX'),
          contact.properties.email,
          new Date(contact.properties.createdate).toLocaleDateString('es-MX'),
          contact.properties.facilitador_compra_contacto,
          contact.properties.hs_analytics_source,
          contact.properties.lifecyclestage,
          contact.properties.hs_lead_status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'contacts.csv');
  };

  const [show, setShow] = useState(false);
  const [actions, setActions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (accountID) => {
    const account = accountInsights.find(
      (item) => item.account_id === accountID
    );
    setShow(true);
    setActions(account.actions);
  };

  if (accountInsights.length === 0) {
    return <div>Getting data...</div>;
  }

  return (
    <div>
      <Cards />

      <div className="Table">
        <DateRangeInput
          since={since}
          setSince={setSince}
          until={until}
          setUntil={setUntil}
        />

        <TableContainer
          component={Paper}
          style={{
            width: '100%',
            boxShadow: '0px 13px 20px 0px #80808029',
            overflow: 'auto',
            backgroundColor: 'transparent',
          }}
          sx={{ maxHeight: 350 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Desarrollo</TableCell>
                <TableCell align="left">Alcance</TableCell>
                <TableCell align="left">Impresiones</TableCell>
                <TableCell align="left">Clics</TableCell>
                <TableCell align="left">Gastado</TableCell>
                <TableCell align="left">CPC</TableCell>
                <TableCell align="left">CTR</TableCell>
                <TableCell align="left">Leads</TableCell>
                <TableCell align="left">CPL</TableCell>
                <TableCell align="left">Asignaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: 'white' }}>
              {accountInsights.map((element) => (
                <TableRow
                  key={element.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {element.account_name}
                  </TableCell>
                  <TableCell align="left">
                    {parseInt(element.reach).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    {parseInt(element.impressions).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    {parseInt(element.clicks).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    ${parseFloat(element.spend).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    $
                    {parseFloat(element.cpc).toFixed(2).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    $
                    {parseFloat(element.ctr).toFixed(2).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    {
                      (
                        element.actions.find(
                          (element) => element.action_type === 'lead'
                        ) || {}
                      ).value
                    }
                  </TableCell>
                  <TableCell align="left">
                    $
                    {(
                      parseFloat(element.spend) /
                      parseFloat(
                        (
                          element.actions.find(
                            (element) => element.action_type === 'lead'
                          ) || {}
                        ).value
                      )
                    )
                      .toFixed(2)
                      .toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleShowContacts(element.account_id)}
                      variant="link"
                      className="Details"
                    >
                      {contactCountsByCampaign[element.account_id] || 0}
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleShow(element.account_id)}
                      style={{
                        backgroundColor: '#52b1ff',
                        borderColor: 'transparent',
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Interacciones</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <thead>
                  <tr style={{ textAlign: 'center' }}>
                    <th>Tipos de interacción</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.length ? (
                    actions.map((action, index) => (
                      <tr key={index} style={{ textAlign: 'center' }}>
                        <td>{action.action_type}</td>
                        <td>
                          {parseInt(action.value).toLocaleString('en-US')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No actions found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showContacts}
          onHide={handleCloseContacts}
          className="fullscreen-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {modalTitle} ({contactsInfo.length})
            </Modal.Title>
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
                      <td>
                        {facilitadores.find(
                          (element) =>
                            element?.ID ===
                            parseInt(
                              contact.properties.facilitador_compra_contacto
                            )
                        )?.Nombre || ''}
                      </td>
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
            <Button variant="primary" onClick={generateCSV}>
              Descargar CSV
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
