import React, { useContext } from 'react';
import { AdsDataStoreContext } from '../../data/AdsDataStore';
import { FaRegBuilding } from 'react-icons/fa';
import Card from '../Card/Card';
import './Cards.css';

const AdsCards = () => {
  const { campaignInsights } = useContext(AdsDataStoreContext);

  const campaignsData = campaignInsights
    .filter((element) => element.adsets !== undefined)
    .map((element) => element.adsets.data)
    .flat()
    .filter((element) => element.ads?.data[0]?.insights?.data[0]?.spend > 0);
  // console.log(campaignsData.map((element) => element.adsets.data).flat());

  // Calculate Grand Total Spend
  const grandTotalSpend = campaignsData
    .map((element) => element.ads.data)
    .flat()
    .map((element) => parseFloat(element.insights?.data[0]?.spend || 0))
    .reduce((total, spend) => total + spend, 0);

  // Calculate the Average CPC
  const { totalCPC, totalCampaigns } = campaignsData
    .map((element) => element.ads.data)
    .flat()
    .reduce(
      (accumulator, current) => {
        const cpc = parseFloat(current.insights?.data[0]?.cpc || 0);
        return {
          totalCPC: accumulator.totalCPC + cpc,
          totalCampaigns: accumulator.totalCampaigns + 1,
        };
      },
      { totalCPC: 0, totalCampaigns: 0 }
    );

  const avgCPC = totalCPC / totalCampaigns;

  // Calculate the Average CPL
  const costPerLeadArray = campaignsData
    .map((element) => element.ads.data)
    .flat()
    .map((element) => {
      const insightsData = element.insights?.data[0];
      const leadAction = insightsData?.actions?.find(
        (element) => element.action_type === 'lead'
      );

      if (leadAction) {
        const spend = parseFloat(insightsData?.spend || 0);
        const value = parseFloat(leadAction.value);
        return spend / value;
      }

      return 0;
    });

  const totalCostPerLead = costPerLeadArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const avgCPL = totalCostPerLead / costPerLeadArray.length;

  const accounts = campaignsData
    .map((element) => element.ads.data)
    .flat()
    .map((element) => element?.name);
  const spendByAccount = campaignsData
    .map((element) => element.ads.data)
    .flat()
    .map((element) => element.insights?.data[0]?.spend);
  const cpcByAccount = campaignsData
    .map((element) => element.ads.data)
    .flat()
    .map((element) => element.insights?.data[0]?.cpc);
  const cplByAccount = campaignsData
    .map((element) => element.ads.data)
    .flat()
    .map(
      (element) =>
        parseFloat(element.insights?.data[0]?.spend || 0) /
        parseFloat(
          (
            element.insights?.data[0]?.actions?.find(
              (element) => element.action_type === 'lead'
            ) || {}
          ).value
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
        />
      </div>
    </div>
  );
};

export default AdsCards;

// const accountInsights = [
//   {
//     account_id: '930432200705578',
//     account_name: 'HU LOMAS DE LA PLATA',
//     spend: '25320.21',
//     cpc: '1.276349',
//     ctr: '0.93048',
//     status: 'ACTIVE'
//   },
//   {
//     account_id: '177341126950476',
//     account_name: 'TRES LAGOS LIFESTYLE',
//     spend: '17290.45',
//     cpc: '2.158069',
//     ctr: '1.475996',
//     status: 'PAUSED'
//   },
//   {
//     account_id: '562909907769407',
//     account_name: 'HU AQUASOL',
//     spend: '17495.12',
//     cpc: '7.693544',
//     ctr: '2.149298',
//     status: 'ACTIVE'
//   },
// ];
