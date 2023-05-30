import React, { createContext, useState, useEffect } from 'react';
import { accountsData } from './facebook';
import { contactsData } from './hubspot';

const AccountsDataStoreContext = createContext();

const AccountsDataStore = ({ children }) => {
  const [since, setSince] = useState(
    localStorage.getItem('since') || '2023-04-15'
  );
  const [until, setUntil] = useState(
    localStorage.getItem('until') || '2023-04-30'
  );

  const [accountInsights, setAccountInsights] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Account Insights
        const accountsResponse = await accountsData(since, until);
        setAccountInsights(
          accountsResponse.filter((element) => element !== null)
        );

        // Fetch Contacts
        const contactsResponse = await contactsData(since, until);
        setContacts(contactsResponse);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    // Save since and until values to local storage
    localStorage.setItem('since', since);
    localStorage.setItem('until', until);
  }, [since, until]);

  const store = {
    since,
    setSince,
    until,
    setUntil,
    accountInsights,
    contacts,
  };

  return (
    <AccountsDataStoreContext.Provider value={store}>
      {children}
    </AccountsDataStoreContext.Provider>
  );
};

export { AccountsDataStore, AccountsDataStoreContext };
