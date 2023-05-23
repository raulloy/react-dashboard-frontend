import * as React from 'react';
import { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { accounts } from '../../data/data';
import { DateDropdown } from '../DatePickers/DateDropdown';
import { AdSetsDataStoreContext } from '../../data/AdSetsDataStore';
import { statusStyle } from './utils';
import './Table.css';
import { Link } from 'react-router-dom';
import AdSetsCards from '../Cards/AdSetsCards';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';

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

  const adSetsInsights = campaignInsights
    .map((element) => element.adsets && element.adsets.data)
    .filter(Boolean)
    .flat();

  const grandTotalSpend = adSetsInsights.reduce((total, element) => {
    if (element.insights) {
      return total + parseFloat(element.insights.data[0].spend);
    }
    return total;
  }, 0);

  // console.log(campaignInsights.slice(0, 3));

  const adsetsData = campaignInsights
    .map((element) => (element.adsets ? element.adsets.data : []))
    .flat()
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

  const transformedCampaigns = campaignInsights
    .map((campaign) => {
      const adsetData = campaign.adsets.data.map((adset) => {
        const { name, account_id, campaign_id, status, insights, id } = adset;

        const campaignObjective = campaign.objective;
        const campaignData = adset.campaign;

        return {
          name,
          account_id,
          campaign_id,
          objective: campaignObjective,
          campaign: campaignData,
          status,
          insights,
          id,
        };
      });

      return adsetData;
    })
    .flat();

  // console.log(transformedCampaigns);

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
    { field: 'campaign', headerName: 'Campaña', width: 400 },
    {
      field: 'adset',
      headerName: 'Conjunto de anuncios',
      width: 400,
      // headerClassName: 'header-bold',
      // renderHeader: () => <div className="header-bold">Campaña</div>,
      renderCell: (params) => (
        <Link className="Details" to={`/ads/${params.row.id}`}>
          {params.value}
        </Link>
      ),
    },
    {
      field: 'objective',
      headerName: 'Objetivo',
      width: 200,
      headerClassName: 'header-bold',
    },
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

  const rows = transformedCampaigns.map((row) => ({
    id: row.id,
    campaign: row.campaign.name,
    adset: row.name,
    objective: row.objective,
    spent: `$${parseFloat(
      row.insights ? row.insights.data[0].spend : 0
    ).toLocaleString('en-US')}`,
    results:
      row.objective === 'MESSAGES' &&
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
        : row.objective === 'OUTCOME_ENGAGEMENT' &&
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
        : (row.objective === 'OUTCOME_LEADS' ||
            row.objective === 'LEAD_GENERATION') &&
          row.insights &&
          row.insights.data &&
          row.insights.data[0].actions
        ? (
            row.insights.data[0].actions.find(
              (element) => element.action_type === 'lead'
            ) || {}
          ).value + ' Leads'
        : (row.objective === 'LINK_CLICKS' ||
            row.objective === 'OUTCOME_TRAFFIC') &&
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
        row.objective === 'MESSAGES' &&
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
          : row.objective === 'OUTCOME_ENGAGEMENT' &&
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
          : (row.objective === 'OUTCOME_LEADS' ||
              row.objective === 'LEAD_GENERATION') &&
            row.insights &&
            row.insights.data &&
            row.insights.data[0].actions
          ? (
              row.insights.data[0].actions.find(
                (element) => element.action_type === 'lead'
              ) || {}
            ).value
          : (row.objective === 'LINK_CLICKS' ||
              row.objective === 'OUTCOME_TRAFFIC') &&
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
      <AdSetsCards />
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

        <div style={{ height: 380, width: '100%' }}>
          <DataGrid
            rows={[...rows, footerRow]}
            columns={columns}
            checkboxSelection
            components={{ Toolbar: GridToolbar }}
          />
        </div>

        <Modal show={show} onHide={handleClose} className="fullscreen-modal">
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
            <Button variant="primary" onClick={generateCSV}>
              Descargar CSV
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
