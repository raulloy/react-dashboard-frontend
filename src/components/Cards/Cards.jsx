import React, { useContext } from 'react';
import { AccountsDataStoreContext } from '../../data/AccountsDataStore';
import { FaRegBuilding } from 'react-icons/fa';
import Card from '../Card/Card';
import './Cards.css';

const Cards = () => {
  const { accountInsights } = useContext(AccountsDataStoreContext);

  // Calculate Grand Total Spend
  const grandTotalSpend = accountInsights.reduce((total, element) => {
    return total + parseFloat(element?.spend);
  }, 0);

  // Calculate the Average CPC
  const avgCPC =
    accountInsights.reduce((acc, curr) => acc + parseFloat(curr?.cpc ?? 0), 0) /
    accountInsights.length;

  // Calculate the Average Leads
  const avgLeads =
    accountInsights.reduce(
      (acc, curr) =>
        acc +
        parseFloat(
          (
            curr?.actions.find((element) => element.action_type === 'lead') ||
            {}
          ).value ?? 0
        ),
      0
    ) / accountInsights.length;

  const costPerLeadArray = accountInsights.map((element) => {
    const leadAction = element?.actions.find(
      (action) => action.action_type === 'lead'
    );
    if (leadAction) {
      return element?.spend / parseFloat(leadAction.value);
    } else {
      return 0; // or any other default value you want to use
    }
  });

  const totalCostPerLead = costPerLeadArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );
  const avgCPL = totalCostPerLead / costPerLeadArray.length;

  const accounts = accountInsights.map((element) => element?.account_name);
  const spendByAccount = accountInsights.map((element) => element?.spend);
  const cpcByAccount = accountInsights.map((element) => element?.cpc ?? 0);
  const leadsByAccount = accountInsights.map(
    (element) =>
      (element.actions.find((element) => element.action_type === 'lead') || {})
        .value ?? 0
  );
  const cplByAccount = accountInsights.map(
    (element) =>
      parseFloat(element?.spend) ||
      0 /
        parseFloat(
          (
            element?.actions.find(
              (element) => element.action_type === 'lead'
            ) || {}
          ).value ?? 0
        )
  );

  return (
    <div className="Cards">
      <div className="parentContainer">
        <Card
          title="Total Gastado"
          color={{
            backGround: 'linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)',
            boxShadow: '0px 10px 20px 0px #e0c6f5',
          }}
          barValue={60}
          value={grandTotalSpend.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })}
          png={FaRegBuilding}
          series={[
            {
              name: 'Spend',
              data: spendByAccount,
            },
          ]}
          accounts={accounts}
          format="money"
        />
      </div>
      <div className="parentContainer">
        <Card
          title="CPC (avg)"
          color={{
            backGround: 'linear-gradient(180deg, #FF919D 0%, #FC929D 100%)',
            boxShadow: '0px 10px 20px 0px #FDC0C7',
          }}
          barValue={60}
          value={avgCPC.toFixed(2)}
          png={FaRegBuilding}
          series={[
            {
              name: 'CPC',
              data: cpcByAccount,
            },
          ]}
          accounts={accounts}
          format="money"
        />
      </div>
      <div className="parentContainer">
        <Card
          title="Leads (avg)"
          color={{
            backGround: 'linear-gradient(180deg, #919DFF 0%, #929DFC 100%)',
            boxShadow: '0px 10px 20px 0px #C0C7FD',
          }}
          barValue={60}
          value={avgLeads.toFixed(0)}
          png={FaRegBuilding}
          series={[
            {
              name: 'Leads',
              data: leadsByAccount,
            },
          ]}
          accounts={accounts}
          format="integer" // or format="money"
        />
      </div>
      <div className="parentContainer">
        <Card
          title="CPL (avg)"
          color={{
            backGround:
              'linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)',
            boxShadow: '0px 10px 20px 0px #F9D59B',
          }}
          barValue={60}
          value={avgCPL.toFixed(2)}
          png={FaRegBuilding}
          series={[
            {
              name: 'CPL',
              data: cplByAccount,
            },
          ]}
          accounts={accounts}
          format="money"
        />
      </div>
    </div>
  );
};

export default Cards;
