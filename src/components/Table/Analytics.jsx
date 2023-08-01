import React, { useContext } from 'react';
import { accounts } from '../../data/data';
import DesarrolloDropdown from '../DatePickers/DesarrolloDropdown';
import LineChart from '../LineChart/LineChart';
import { CampaignsByMonthDataStoreContext } from '../../data/CampaignsByMonthDataStore';

const Analytics = () => {
  const { selectedAccount, setSelectedAccount } = useContext(
    CampaignsByMonthDataStoreContext
  );

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '10px' }}>
          <DesarrolloDropdown
            accounts={accounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
          />
        </div>
      </div>

      <LineChart />
    </div>
  );
};

export default Analytics;
