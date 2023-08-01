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
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './Table.css';

export default function AccountsTable() {
  const { since, setSince, until, setUntil, accountInsights, contacts } =
    useContext(AccountsDataStoreContext);

  const fbContacts = contacts.filter((element) => {
    if (
      element.properties.hs_analytics_first_url &&
      element.properties.hs_analytics_first_url.includes('facebook.com')
    ) {
      const assignedDate = new Date(
        element.properties.hubspot_owner_assigneddate
      );
      const sinceDate = new Date(since);
      const untilDate = new Date(until);
      return assignedDate >= sinceDate && assignedDate <= untilDate;
    }
    return false;
  });

  const contactsbyCampaign = fbContacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_acc=(\d+)/)?.[1]
      : null,
    lifecyclestage: properties.lifecyclestage,
  }));

  const contactCountsByCampaign = fbContacts.reduce((acc, contact) => {
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
    const matchingContact = fbContacts.filter((contact) =>
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
                <TableCell align="left">CPA</TableCell>
                <TableCell align="left">Conversión</TableCell>
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
                    {(
                      element.actions.find(
                        (element) => element.action_type === 'lead'
                      ) || {}
                    ).value ?? 0}
                  </TableCell>
                  <TableCell align="left">
                    $
                    {(
                      (parseFloat(element.spend) || 0) /
                      parseFloat(
                        (
                          element.actions.find(
                            (element) => element.action_type === 'lead'
                          ) || {}
                        ).value ?? 0
                      )
                    ).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
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
                  <TableCell align="left">
                    $
                    {(
                      (parseFloat(element.spend) || 0) /
                        contactCountsByCampaign[element.account_id] || 0
                    ).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {(
                      ((contactCountsByCampaign[element.account_id] || 0) /
                        parseFloat(
                          (
                            element.actions.find(
                              (element) => element.action_type === 'lead'
                            ) || {}
                          ).value ?? 0
                        )) *
                      100
                    ).toFixed(0)}
                    %
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
            <div className="datagrid-container">
              <DataGrid
                rows={contactsInfo}
                columns={[
                  {
                    field: 'desarrollo',
                    headerName: 'Desarrollo',
                    width: 230,
                    valueGetter: (params) => params.row.properties.desarrollo,
                  },
                  {
                    field: 'canal_de_captacion',
                    headerName: 'Canal de captación',
                    width: 200,
                    valueGetter: (params) =>
                      params.row.properties.canal_de_captacion,
                  },
                  {
                    field: 'sub_canal_de_captacion',
                    headerName: 'Subcanal de captación',
                    width: 200,
                    valueGetter: (params) =>
                      params.row.properties.sub_canal_de_captacion,
                  },
                  {
                    field: 'hubspot_owner_assigneddate',
                    headerName: 'Fecha de asignación',
                    width: 200,
                    valueGetter: (params) =>
                      new Date(
                        params.row.properties.hubspot_owner_assigneddate
                      ).toLocaleDateString('es-MX'),
                  },
                  {
                    field: 'email',
                    headerName: 'Correo',
                    width: 240,
                    valueGetter: (params) => params.row.properties.email,
                  },
                  {
                    field: 'createdate',
                    headerName: 'Fecha de creación',
                    width: 180,
                    valueGetter: (params) =>
                      new Date(
                        params.row.properties.createdate
                      ).toLocaleDateString('es-MX'),
                  },
                  {
                    field: 'facilitador_compra_contacto',
                    headerName: 'Facilitador',
                    width: 240,
                    valueGetter: (params) =>
                      facilitadores.find(
                        (element) =>
                          element?.ID ===
                          parseInt(
                            params.row.properties.facilitador_compra_contacto
                          )
                      )?.Nombre || '',
                  },
                  {
                    field: 'hs_analytics_source',
                    headerName: 'Fuente original',
                    width: 150,
                    valueGetter: (params) =>
                      params.row.properties.hs_analytics_source,
                  },
                  {
                    field: 'lifecyclestage',
                    headerName: 'Etapa del ciclo de vida',
                    width: 200,
                    valueGetter: (params) =>
                      params.row.properties.lifecyclestage,
                  },
                  {
                    field: 'hs_lead_status',
                    headerName: 'Estado del lead',
                    width: 200,
                    valueGetter: (params) =>
                      params.row.properties.hs_lead_status,
                  },
                ]}
                checkboxSelection
                components={{ Toolbar: GridToolbar }}
              />
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
