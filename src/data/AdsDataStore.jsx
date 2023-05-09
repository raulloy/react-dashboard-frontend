import React, { createContext, useState, useEffect } from 'react';
import { adsData } from './facebook';
import { contactsData } from './hubspot';
import { accounts } from './data';

const AdsDataStoreContext = createContext();

const AdsDataStore = ({ children }) => {
  const [since, setSince] = useState(
    localStorage.getItem('since') || '2023-04-15'
  );
  const [until, setUntil] = useState(
    localStorage.getItem('until') || '2023-04-30'
  );

  const [selectedAccount, setSelectedAccount] = useState(
    localStorage.getItem('selectedAccount') || accounts[0].id
  );

  const [campaignInsights, setCampaignInsights] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Campaign Insights
        const campaignsResponse = await adsData(selectedAccount, since, until);
        setCampaignInsights(
          campaignsResponse.data.filter((element) => element !== null)
        );

        // Fetch Contacts
        const contactsResponse = await contactsData(since, until);
        setContacts(contactsResponse);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    // Save variable values to local storage
    localStorage.setItem('since', since);
    localStorage.setItem('until', until);
    localStorage.setItem('selectedAccount', selectedAccount);
  }, [since, until, selectedAccount]);

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
    <AdsDataStoreContext.Provider value={store}>
      {children}
    </AdsDataStoreContext.Provider>
  );
};

export { AdsDataStore, AdsDataStoreContext };
