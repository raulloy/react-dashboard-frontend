import * as React from 'react';
import { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { accounts } from '../../data/data';
import { DateDropdown } from '../DatePickers/DateDropdown';
import { AdsDataStoreContext } from '../../data/AdsDataStore';
import { statusStyle } from './utils';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AdsCards from '../Cards/AdsCards';
import { saveAs } from 'file-saver';
import { facilitadores } from '../../facilitadores';
import './Table.css';

export default function AdsTable() {
  const {
    since,
    setSince,
    until,
    setUntil,
    selectedAccount,
    setSelectedAccount,
    campaignInsights,
    contacts,
  } = useContext(AdsDataStoreContext);

  const adSetsInsights = campaignInsights
    .map((element) => element.adsets)
    .filter((element) => element !== undefined)
    .map((element) => element.data)
    .flat()
    .map((element) => element.ads && element.ads.data)
    .filter(Boolean)
    .flat();
  // console.log(adSetsInsights);

  const grandTotalSpend = adSetsInsights.reduce((total, element) => {
    if (element.insights) {
      return total + parseFloat(element.insights.data[0].spend);
    }
    return total;
  }, 0);

  const adsData = campaignInsights
    .map((element) => element.adsets)
    .filter((element) => element !== undefined)
    .map((element) => element.data)
    .flat()
    .map((element) => (element.ads ? element.ads.data : []))
    .flat();

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
      ? properties.hs_analytics_first_url.match(/hsa_ad=(\d+)/)?.[1]
      : null,
  }));

  // console.log('contactsbyCampaign', contactsbyCampaign);

  const contactCountsByCampaign = contactsbyCampaign.reduce((acc, contact) => {
    const campaign = adsData.find(
      (c) => c.id === contact.hs_analytics_first_url
    );
    const campaignId = campaign ? campaign.id : 'unknown';
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  // console.log('contactCountsByCampaign', contactCountsByCampaign);

  const [show, setShow] = useState(false);
  const [contactsInfo, setContactsInfo] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = (campaignID, filter) => {
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
    setShow(true);
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

  const columns = [
    { field: 'adset', headerName: 'Conjunto de anuncios', width: 400 },
    { field: 'ad', headerName: 'Anuncio', width: 400 },
    { field: 'objective', headerName: 'Objetivo', width: 200 },
    { field: 'spent', headerName: 'Gastado', width: 200 },
    { field: 'results', headerName: 'Resultados', width: 200 },
    { field: 'costByResults', headerName: 'Costo/Resultado', width: 200 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 100,
      renderCell: (params) => (
        <span className="status" style={statusStyle(params.row.status)}>
          {params.row.status}
        </span>
      ),
    },
    {
      field: 'assignments',
      headerName: 'Asignaciones',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button
          variant="link"
          className="Details"
          onClick={() => handleShow(params.row.id)}
        >
          {contactCountsByCampaign[params.row.id] || 0}
        </Button>
      ),
    },
    { field: 'reach', headerName: 'Alcance', width: 100 },
    { field: 'impressions', headerName: 'Impresiones', width: 100 },
    { field: 'clicks', headerName: 'Clics', width: 100 },
    { field: 'cpc', headerName: 'CPC', width: 100 },
    { field: 'ctr', headerName: 'CTR', width: 100 },
  ];

  const rows = adsData.map((row) => ({
    id: row.id,
    adset: row.adset.name,
    ad: row.name,
    objective: row.campaign.objective,
    spent: `$${parseFloat(
      row.insights ? row.insights.data[0].spend : 0
    ).toLocaleString('en-US')}`,
    results:
      row.campaign.objective === 'MESSAGES' &&
      row.insights &&
      row.insights.data &&
      row.insights.data[0].actions
        ? (
            row.insights.data[0].actions.find(
              (element) =>
                element.action_type ===
                'onsite_conversion.messaging_conversation_started_7d'
            ) || {}
          ).value + ' Msgs'
        : row.campaign.objective === 'OUTCOME_ENGAGEMENT' &&
          row.insights &&
          row.insights.data &&
          row.insights.data[0].actions
        ? (
            row.insights.data[0].actions.find(
              (element) =>
                element.action_type ===
                'onsite_conversion.messaging_conversation_started_7d'
            ) || {}
          ).value + ' Msgs'
        : (row.campaign.objective === 'OUTCOME_LEADS' ||
            row.campaign.objective === 'LEAD_GENERATION') &&
          row.insights &&
          row.insights.data &&
          row.insights.data[0].actions
        ? (
            row.insights.data[0].actions.find(
              (element) => element.action_type === 'lead'
            ) || {}
          ).value + ' Leads'
        : (row.campaign.objective === 'LINK_CLICKS' ||
            row.campaign.objective === 'OUTCOME_TRAFFIC') &&
          row.insights &&
          row.insights.data &&
          row.insights.data[0].actions
        ? (
            row.insights.data[0].actions.find(
              (element) => element.action_type === 'link_click'
            ) || {}
          ).value + ' Clicks'
        : 0,
    costByResults: `$${(
      (row.insights ? row.insights.data[0].spend : 0) /
      parseFloat(
        row.campaign.objective === 'MESSAGES' &&
          row.insights &&
          row.insights.data &&
          row.insights.data[0].actions
          ? (
              row.insights.data[0].actions.find(
                (element) =>
                  element.action_type ===
                  'onsite_conversion.messaging_conversation_started_7d'
              ) || {}
            ).value
          : row.campaign.objective === 'OUTCOME_ENGAGEMENT' &&
            row.insights &&
            row.insights.data &&
            row.insights.data[0].actions
          ? (
              row.insights.data[0].actions.find(
                (element) =>
                  element.action_type ===
                  'onsite_conversion.messaging_conversation_started_7d'
              ) || {}
            ).value
          : (row.campaign.objective === 'OUTCOME_LEADS' ||
              row.campaign.objective === 'LEAD_GENERATION') &&
            row.insights &&
            row.insights.data &&
            row.insights.data[0].actions
          ? (
              row.insights.data[0].actions.find(
                (element) => element.action_type === 'lead'
              ) || {}
            ).value
          : (row.campaign.objective === 'LINK_CLICKS' ||
              row.campaign.objective === 'OUTCOME_TRAFFIC') &&
            row.insights &&
            row.insights.data &&
            row.insights.data[0].actions
          ? (
              row.insights.data[0].actions.find(
                (element) => element.action_type === 'link_click'
              ) || {}
            ).value
          : 1
      )
    ).toFixed(2)}`,
    status: row.status,
    assignments: [contactCountsByCampaign].reduce(
      (acc, obj) => (row.id in obj ? obj[row.id] : acc),
      0
    ),
    reach: parseInt(
      row.insights ? row.insights.data[0].reach : 0
    ).toLocaleString('en-US'),
    impressions: parseInt(
      row.insights ? row.insights.data[0].impressions : 0
    ).toLocaleString('en-US'),
    clicks: parseInt(
      row.insights ? row.insights.data[0].clicks : 0
    ).toLocaleString('en-US'),
    cpc: parseFloat(row.insights ? row.insights.data[0].cpc : 0).toFixed(2),
    ctr: parseFloat(row.insights ? row.insights.data[0].ctr : 0).toFixed(2),
  }));

  const footerRow = {
    id: 'grand-total',
    campaign: 'Grand Total',
    objective: '',
    spent: `$${grandTotalSpend.toLocaleString('en-US')}`,
  };

  return (
    <div>
      <AdsCards />
      <div className="Table">
        <DateDropdown
          since={since}
          setSince={setSince}
          until={until}
          setUntil={setUntil}
          accounts={accounts}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
        />

        <div className="table-container">
          <DataGrid
            rows={[...rows, footerRow]}
            columns={columns}
            checkboxSelection
            components={{ Toolbar: GridToolbar }}
          />
        </div>

        <Modal show={show} onHide={handleClose} className="fullscreen-modal">
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
