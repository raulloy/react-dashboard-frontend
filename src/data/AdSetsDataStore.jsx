import React, { createContext, useState, useEffect } from 'react';
import { adSetsData } from './facebook';
import { contactsData } from './hubspot';
import { accounts } from './data';

const AdSetsDataStoreContext = createContext();

const AdSetsDataStore = ({ children }) => {
  const [since, setSince] = useState('2023-04-15');
  const [until, setUntil] = useState('2023-04-30');

  const [selectedAccount, setSelectedAccount] = useState(accounts[0].id);
  const [campaignInsights, setCampaignInsights] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await adSetsData(
          selectedAccount,
          since,
          until
        );
        setCampaignInsights(campaignsResponse.data);

        // Fetch Contacts
        const contactsResponse = await contactsData(since, until);
        setContacts(contactsResponse);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [selectedAccount, since, until]);

  const store = {
    since,
    setSince,
    until,
    setUntil,
    selectedAccount,
    setSelectedAccount,
    campaignInsights,
    contacts,
  };

  return (
    <AdSetsDataStoreContext.Provider value={store}>
      {children}
    </AdSetsDataStoreContext.Provider>
  );
};

export { AdSetsDataStore, AdSetsDataStoreContext };
