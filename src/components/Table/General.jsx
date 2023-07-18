import * as React from 'react';
import { useContext } from 'react';
import DateRangeInput from '../DatePickers/DateRangeInput';
import { AccountsDataStoreContext } from '../../data/AccountsDataStore';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { accounts, googleAccounts } from '../../data/data';
import {
  GoogleCPCByAccount,
  GoogleDataByAccount,
  GoogleLeadsByAccount,
  GoogleSpendByAccount,
} from '../../data/GoogleCampaignsData';
import './Table.css';

export default function GeneralTable() {
  const { since, setSince, until, setUntil, accountInsights, contacts } =
    useContext(AccountsDataStoreContext);

  // Calculate Grand Total Spend
  const grandTotalSpend = accountInsights.reduce((total, element) => {
    return total + parseFloat(element?.spend);
  }, 0);

  const fbContacts = contacts.filter(
    (element) =>
      element.properties.hs_analytics_first_url &&
      element.properties.hs_analytics_first_url.includes('facebook.com')
  );

  const contactsbyCampaign = fbContacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_acc=(\d+)/)?.[1]
      : null,
    lifecyclestage: properties.lifecyclestage,
  }));

  const huAccounts = accountInsights.filter((insight) => {
    return accounts.some(
      (account) =>
        account.id.substring(4) === insight.account_id &&
        account.company === 'HOGARES UNION'
    );
  });

  const googleContacts = contacts.filter(
    (element) =>
      element.properties.hs_analytics_first_url &&
      element.properties.hs_analytics_first_url.includes('ads.google.com')
  );

  const contactsbyGoogleCampaign = googleContacts.map(({ id, properties }) => ({
    id,
    hs_analytics_first_url: properties.hs_analytics_first_url
      ? properties.hs_analytics_first_url.match(/hsa_cam=(\d+)/)?.[1]
      : null,
    lifecyclestage: properties.lifecyclestage,
  }));

  const huAssignments = huAccounts
    .map((item) => {
      const result = contactsbyCampaign.filter(
        (account) => account.hs_analytics_first_url === item.account_id
      );
      return result;
    })
    .flat().length;

  const huLifestyleAccounts = accountInsights.filter((insight) => {
    return accounts.some(
      (account) =>
        account.id.substring(4) === insight.account_id &&
        account.company === 'HU LIFESTYLE'
    );
  });

  const huLifestyleAssignments = huLifestyleAccounts
    .map((item) => {
      const result = contactsbyCampaign.filter(
        (account) => account.hs_analytics_first_url === item.account_id
      );
      return result;
    })
    .flat().length;

  const gimAccounts = accountInsights.filter((insight) => {
    return accounts.some(
      (account) =>
        account.id.substring(4) === insight.account_id &&
        account.company === 'GIM LIVINGSPACES'
    );
  });

  const gimAssignments = gimAccounts
    .map((item) => {
      const result = contactsbyCampaign.filter(
        (account) => account.hs_analytics_first_url === item.account_id
      );
      return result;
    })
    .flat().length;

  const huLeads = huAccounts.reduce(
    (acc, curr) =>
      acc +
      parseFloat(
        (curr?.actions.find((element) => element.action_type === 'lead') || {})
          .value ?? 0
      ),
    0
  );

  const huLifestyleLeads = huLifestyleAccounts.reduce(
    (acc, curr) =>
      acc +
      parseFloat(
        (curr?.actions.find((element) => element.action_type === 'lead') || {})
          .value ?? 0
      ),
    0
  );

  const gimLeads = gimAccounts.reduce(
    (acc, curr) =>
      acc +
      parseFloat(
        (curr?.actions.find((element) => element.action_type === 'lead') || {})
          .value ?? 0
      ),
    0
  );

  // const googleAssignments = googleAccounts
  //   .map((company) => {
  //     const googleContacts = GoogleDataByAccount(since, until, company.id).map(
  //       (company) => {
  //         const result = contactsbyGoogleCampaign.filter(
  //           (campaign) =>
  //             campaign.hs_analytics_first_url === company.campaign.id.toString()
  //         );
  //         return result;
  //       }
  //     );
  //     return googleContacts;
  //   })
  //   .flat()
  //   .reduce((acc, arr) => acc + arr.length, 0);

  // console.log(googleAssignments);

  // console.log(
  //   GoogleDataByAccount(since, until, '5347167145')
  //     .map((company) => {
  //       const result = contactsbyGoogleCampaign.filter(
  //         (campaign) =>
  //           campaign.hs_analytics_first_url === company.campaign.id.toString()
  //       );
  //       return result;
  //     })
  //     .flat().length
  // );

  const totalSpendByCompany = accountInsights.reduce((result, element) => {
    const { account_name, spend } = element;
    const account = accounts.find((acc) => acc.name === account_name);
    if (account) {
      const { company } = account;
      if (!result.hasOwnProperty(company)) {
        result[company] = 0;
      }
      result[company] += parseFloat(spend);
    }
    return result;
  }, {});

  // if (accountInsights.length === 0) {
  //   return <div>Getting data...</div>;
  // }

  const fbColumns = [
    {
      field: 'channel',
      headerName: 'Canal',
      width: 150,
      renderHeader: () => <div className="header-bold">Canal</div>,
    },
    {
      field: 'company',
      headerName: 'Compañia',
      width: 280,
      renderHeader: () => <div className="header-bold">Compañia</div>,
    },
    {
      field: 'totalSpend',
      headerName: 'Gastado',
      type: 'number',
      width: 160,
      renderHeader: () => <div className="header-bold">Gastado</div>,
    },
    {
      field: 'cpc',
      headerName: 'Gastado',
      type: 'number',
      width: 160,
      renderHeader: () => <div className="header-bold">CPC promedio</div>,
    },
    {
      field: 'leads',
      headerName: 'Leads',
      type: 'number',
      width: 160,
      renderHeader: () => <div className="header-bold">Leads</div>,
    },
    {
      field: 'cpl',
      headerName: 'CPL',
      type: 'number',
      width: 160,
      renderHeader: () => <div className="header-bold">CPL</div>,
    },
    {
      field: 'assignments',
      headerName: 'Asignaciones',
      type: 'number',
      width: 160,
      renderHeader: () => <div className="header-bold">Asignaciones</div>,
    },
  ];

  const fbRows = Object.entries(totalSpendByCompany).map(
    ([company, totalSpend]) => ({
      id: company,
      channel: 'FACEBOOK',
      company,
      totalSpend: `$${totalSpend.toLocaleString('en-US')}`,
      cpc: `$${
        company === 'HOGARES UNION'
          ? (
              huAccounts.reduce(
                (acc, curr) => acc + parseFloat(curr?.cpc ?? 0),
                0
              ) / huAccounts.length
            ).toFixed(2)
          : company === 'HU LIFESTYLE'
          ? (
              huLifestyleAccounts.reduce(
                (acc, curr) => acc + parseFloat(curr?.cpc ?? 0),
                0
              ) / huLifestyleAccounts.length
            ).toFixed(2)
          : company === 'GIM LIVINGSPACES'
          ? (
              gimAccounts.reduce(
                (acc, curr) => acc + parseFloat(curr?.cpc ?? 0),
                0
              ) / gimAccounts.length
            ).toFixed(2)
          : 0
      }`,
      leads:
        company === 'HOGARES UNION'
          ? huLeads
          : company === 'HU LIFESTYLE'
          ? huLifestyleLeads
          : company === 'GIM LIVINGSPACES'
          ? gimLeads
          : 0,
      cpl: `$${
        company === 'HOGARES UNION'
          ? (totalSpend / huLeads).toFixed(2)
          : company === 'HU LIFESTYLE'
          ? (totalSpend / huLifestyleLeads).toFixed(2)
          : company === 'GIM LIVINGSPACES'
          ? (totalSpend / gimLeads).toFixed(2)
          : 0
      }`,
      assignments:
        company === 'HOGARES UNION'
          ? huAssignments
          : company === 'HU LIFESTYLE'
          ? huLifestyleAssignments
          : company === 'GIM LIVINGSPACES'
          ? gimAssignments
          : 0,
    })
  );

  const googleRows = googleAccounts.map((company) => ({
    id: company.id,
    channel: 'GOOGLE',
    company: company.name,
    totalSpend: `$${(
      GoogleSpendByAccount(since, until, company.id) / 1000000
    ).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    cpc: `$${(
      GoogleCPCByAccount(since, until, company.id) / 1000000
    ).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    leads: GoogleLeadsByAccount(since, until, company.id).toFixed(0),
    cpl: `$${(
      GoogleSpendByAccount(since, until, company.id) /
      1000000 /
      GoogleLeadsByAccount(since, until, company.id)
    ).toFixed(2)}`,
    assignments: GoogleDataByAccount(since, until, company.id)
      .map((company) => {
        const result = contactsbyGoogleCampaign.filter(
          (campaign) =>
            campaign.hs_analytics_first_url === company.campaign.id.toString()
        );
        return result;
      })
      .flat().length,
  }));

  const totalGoogleLeads = parseInt(
    googleAccounts
      .map((company) => GoogleLeadsByAccount(since, until, company.id))
      .reduce((acc, curr) => acc + curr, 0)
  );

  const totalGoogleAssignments = googleAccounts
    .map((company) => {
      const googleContacts = GoogleDataByAccount(since, until, company.id).map(
        (company) => {
          const result = contactsbyGoogleCampaign.filter(
            (campaign) =>
              campaign.hs_analytics_first_url === company.campaign.id.toString()
          );
          return result;
        }
      );
      return googleContacts;
    })
    .flat()
    .reduce((acc, arr) => acc + arr.length, 0);

  const totalSpendSum = googleAccounts.reduce((sum, company) => {
    const totalSpend = (
      GoogleSpendByAccount(since, until, company.id) / 1000000
    ).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return sum + parseFloat(totalSpend.replace(',', ''));
  }, 0);

  const FooterRow = {
    id: 'grand-total',
    channel: 'GRAND TOTAL',
    totalSpend: `$${(grandTotalSpend + totalSpendSum).toLocaleString('en-US')}`,
    leads: huLeads + huLifestyleLeads + gimLeads + totalGoogleLeads,
    cpl: `$${(
      (grandTotalSpend + totalSpendSum) /
      (huLeads + huLifestyleLeads + gimLeads + totalGoogleLeads)
    ).toFixed(2)}`,
    assignments:
      huAssignments +
      huLifestyleAssignments +
      gimAssignments +
      totalGoogleAssignments,
  };

  return (
    <div>
      {/* <Cards /> */}

      <div className="Table">
        <DateRangeInput
          since={since}
          setSince={setSince}
          until={until}
          setUntil={setUntil}
        />

        <div className="table-container">
          <DataGrid
            rows={[...fbRows, ...googleRows, FooterRow]}
            columns={fbColumns}
            checkboxSelection
            components={{ Toolbar: GridToolbar }}
          />
        </div>
      </div>
    </div>
  );
}
