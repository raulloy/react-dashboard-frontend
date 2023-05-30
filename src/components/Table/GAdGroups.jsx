import * as React from 'react';
import { useState, useEffect } from 'react';
import { googleAdGroupsData, googleCampaignsData } from '../../data/google';
import DateRangeInput from '../DatePickers/DateRangeInput';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { contactsData } from '../../data/hubspot';
import { Modal, Button } from 'react-bootstrap';
import { facilitadores } from '../../facilitadores';
import { saveAs } from 'file-saver';
import './Table.css';

export default function GoogleAdGroupsTable() {
  const [since, setSince] = useState(
    localStorage.getItem('since') || '2023-04-15'
  );
  const [until, setUntil] = useState(
    localStorage.getItem('until') || '2023-04-30'
  );

  const [googleCampaignInsights, setGoogleCampaignInsights] = useState([]);
  const [googleAdGroupInsights, setgoogleAdGroupInsights] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await googleCampaignsData(since, until);
        setGoogleCampaignInsights(campaignsResponse);

        // Fetch AdGroups Insights
        const adGroupsResponse = await googleAdGroupsData(since, until);
        setgoogleAdGroupInsights(adGroupsResponse);

        // Fetch Contacts
        const contactsResponse = await contactsData(since, until);
        setContacts(contactsResponse);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [since, until]);

  const googleContacts = contacts.filter(
    (element) =>
      element.properties.hs_analytics_first_url &&
      element.properties.hs_analytics_first_url.includes('ads.google.com')
  );

  const contactsbyCampaign = googleContacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_grp=(\d+)/)?.[1]
      : null,
    lifecyclestage: properties.lifecyclestage,
  }));

  const contactCountsByCampaign = googleContacts.reduce((acc, contact) => {
    const campaignId =
      contact.properties.hs_analytics_first_url?.match(/hsa_grp=(\d+)/)?.[1] ||
      null;
    acc[campaignId] = (acc[campaignId] || 0) + 1;
    return acc;
  }, {});

  const [show, setShow] = useState(false);
  const [contactsInfo, setContactsInfo] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = (campaignID, filter) => {
    const matchingCampaign = contactsbyCampaign.filter(
      (campaign) => campaign.hs_analytics_first_url === campaignID.toString()
    );
    const matchingContact = googleContacts.filter((contact) =>
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
    { field: 'campaign', headerName: 'Campaña', width: 400 },
    { field: 'ad_group', headerName: 'Grupos de anucios', width: 360 },
    { field: 'ad_groupType', headerName: 'Tipo de grupo', width: 180 },
    { field: 'spent', headerName: 'Gastado', width: 140 },
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
    { field: 'impressions', headerName: 'Impresiones', width: 120 },
    { field: 'clicks', headerName: 'Clics', width: 100 },
    { field: 'cpc', headerName: 'CPC', width: 100 },
    { field: 'ctr', headerName: 'CTR', width: 100 },
    {
      field: 'conversions',
      headerName: 'Conversiones',
      headerAlign: 'center',
      align: 'center',
      width: 120,
    },
    {
      field: 'cost_per_conversion',
      headerName: 'Costo/conversion',
      headerAlign: 'center',
      align: 'center',
      width: 160,
    },
  ];

  const rows = googleAdGroupInsights.map((row) => ({
    id: row.ad_group.id,
    campaign: googleCampaignInsights.filter(
      (item) =>
        item.campaign.id === parseInt(row.ad_group.campaign.split('/')[3])
    )[0]?.campaign?.name,
    ad_group: row.ad_group.name,
    ad_groupType:
      row.ad_group.type === 16
        ? 'Video responsivo'
        : row.ad_group.type === 2
        ? 'Estándar'
        : row.ad_group.type === 3
        ? 'Red de display'
        : '',
    spent: `$${(parseFloat(row.metrics.cost_micros) / 1000000).toLocaleString(
      'en-US'
    )}`,
    assignments: [contactCountsByCampaign].reduce(
      (acc, obj) => (row.ad_group.id in obj ? obj[row.ad_group.id] : acc),
      0
    ),
    impressions: parseInt(row.metrics.impressions).toLocaleString('en-US'),
    clicks: parseInt(row.metrics.clicks).toLocaleString('en-US'),
    cpc: `$${(parseFloat(row.metrics.average_cpc) / 1000000).toFixed(2)}`,
    ctr: `${(parseFloat(row.metrics.ctr) * 100).toFixed(2)} %`,
    conversions: parseFloat(row.metrics.conversions).toLocaleString('en-US'),
    cost_per_conversion: `$${(
      parseFloat(row.metrics.cost_per_conversion ?? 0) / 1000000
    )
      .toFixed(2)
      .toLocaleString('en-US')}`,
  }));

  return (
    <div>
      <div className="Table">
        <DateRangeInput
          since={since}
          setSince={setSince}
          until={until}
          setUntil={setUntil}
        />

        <div className="table-container ">
          <DataGrid
            rows={[...rows]}
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
