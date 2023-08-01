import React, { createContext, useState, useEffect } from 'react';
import { campaignsDataByMonth } from './facebook';
import { accounts } from './data';
import { contactsData } from './hubspot';

const CampaignsByMonthDataStoreContext = createContext();

const CampaignsByMonthDataStore = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(
    localStorage.getItem('selectedAccount') || accounts[0].id
  );

  const [campaignInsights, setCampaignInsights] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await campaignsDataByMonth(selectedAccount);
        setCampaignInsights(
          campaignsResponse.map((element) => element.data[0])
        );

        // Fetch Contacts
        const contactsResponse = await contactsData('2023-04-01', '2023-06-30');
        setContacts(contactsResponse);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    localStorage.setItem('selectedAccount', selectedAccount);
  }, [selectedAccount]);

  const store = {
    selectedAccount,
    setSelectedAccount,
    campaignInsights,
    contacts,
  };

  return (
    <CampaignsByMonthDataStoreContext.Provider value={store}>
      {children}
    </CampaignsByMonthDataStoreContext.Provider>
  );
};

export { CampaignsByMonthDataStore, CampaignsByMonthDataStoreContext };
