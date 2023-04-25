import React, { useContext } from 'react';
import { AccountsDataStoreContext } from '../../data/AccountsDataStore';
import { FaRegBuilding } from 'react-icons/fa';
import Card from '../Card/Card';
import './Cards.css';
import DateRangeInput from '../DatePickers/DateRangeInput';

const Cards = () => {
  const { since, setSince, until, setUntil, accountInsights } = useContext(
    AccountsDataStoreContext
  );

  const grandTotal = accountInsights.reduce((total, element) => {
    return total + parseFloat(element.spend);
  }, 0);

  const accounts = accountInsights.map((element) => element.account_name);
  const spendByAccount = accountInsights.map((element) => element.spend);

  return (
    <>
      <DateRangeInput
        since={since}
        setSince={setSince}
        until={until}
        setUntil={setUntil}
      />

      <div className="Cards">
        <div className="parentContainer">
          <Card
            title="Total Gastado"
            color={{
              backGround: 'linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)',
              boxShadow: '0px 10px 20px 0px #e0c6f5',
            }}
            barValue={60}
            value={grandTotal.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
            png={FaRegBuilding}
            series={[
              {
                name: 'Sales',
                data: spendByAccount,
              },
            ]}
            accounts={accounts}
          />
        </div>
      </div>
    </>
  );
};

export default Cards;
