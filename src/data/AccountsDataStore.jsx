import React, { createContext, useState, useEffect } from 'react';
import { accountsData } from './facebook';

const AccountsDataStoreContext = createContext();

const AccountsDataStore = ({ children }) => {
  const [since, setSince] = useState('2023-04-15');
  const [until, setUntil] = useState('2023-04-30');

  const [accountInsights, setAccountInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Account Insights
        const accountsResponse = await accountsData(since, until);

        setAccountInsights(accountsResponse);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [since, until]);

  // useEffect(() => {
  //   console.log('since:', since);
  //   console.log('until:', until);
  // }, [since, until]);

  const store = {
    since,
    setSince,
    until,
    setUntil,
    accountInsights,
  };

  return (
    <AccountsDataStoreContext.Provider value={store}>
      {children}
    </AccountsDataStoreContext.Provider>
  );
};

export { AccountsDataStore, AccountsDataStoreContext };
