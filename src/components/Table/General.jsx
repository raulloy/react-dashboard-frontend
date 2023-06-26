import * as React from 'react';
import { useContext } from 'react';
import DateRangeInput from '../DatePickers/DateRangeInput';
import { AccountsDataStoreContext } from '../../data/AccountsDataStore';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { accounts, googleAccounts } from '../../data/data';
import { GoogleSpendByAccount } from '../../data/GoogleCampaignsData';
import './Table.css';

export default function GeneralTable() {
  const { since, setSince, until, setUntil, accountInsights } = useContext(
    AccountsDataStoreContext
  );

  // Calculate Grand Total Spend
  const grandTotalSpend = accountInsights.reduce((total, element) => {
    return total + parseFloat(element?.spend);
  }, 0);

  // Calculate Grand Total CPC
  const grandTotalCPC =
    accountInsights.reduce((acc, curr) => acc + parseFloat(curr?.cpc ?? 0), 0) /
    accountInsights.length;

  console.table(grandTotalCPC);

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

  if (accountInsights.length === 0) {
    return <div>Getting data...</div>;
  }

  const fbColumns = [
    {
      field: 'channel',
      headerName: 'Canal',
      width: 150,
      renderHeader: () => <div className="header-bold">Canal</div>,
    },
    {
      field: 'company',
      headerName: 'Campaña',
      width: 300,
      renderHeader: () => <div className="header-bold">Campaña</div>,
    },
    {
      field: 'totalSpend',
      headerName: 'Gastado',
      width: 160,
      renderHeader: () => <div className="header-bold">Gastado</div>,
    },
  ];

  const fbRows = Object.entries(totalSpendByCompany).map(
    ([company, totalSpend]) => ({
      id: company,
      channel: 'FACEBOOK',
      company,
      totalSpend: `$${totalSpend.toLocaleString('en-US')}`,
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
  }));

  const totalSpendSum = googleAccounts.reduce((sum, company) => {
    const totalSpend = (
      GoogleSpendByAccount(since, until, company.id) / 1000000
    ).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return sum + parseFloat(totalSpend.replace(',', ''));
  }, 0);

  const fbFooterRow = {
    id: 'grand-total',
    channel: 'GRAND TOTAL',
    totalSpend: `$${(grandTotalSpend + totalSpendSum).toLocaleString('en-US')}`,
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
            rows={[...fbRows, ...googleRows, fbFooterRow]}
            columns={fbColumns}
            checkboxSelection
            components={{ Toolbar: GridToolbar }}
          />
        </div>
      </div>
    </div>
  );
}
