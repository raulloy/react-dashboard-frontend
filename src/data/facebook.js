import axios from 'axios';

export const accountsData = async (since, until) => {
  const response = await axios.get(
    `https://gim-dashboard.hogaresunion.com/api/account-insights?since=${since}&until=${until}`
  );
  return response.data;
};

export const campaignsData = async (selectedAccount, since, until) => {
  const response = await axios.get(
    `https://gim-dashboard.hogaresunion.com/api/campaign-insights/${selectedAccount}?since=${since}&until=${until}`
  );
  return response.data;
};

export const campaignsDataByMonth = async (selectedAccount) => {
  const response = await axios.get(
    `https://gim-dashboard.hogaresunion.com/api/account-insights-by-month/${selectedAccount}`
  );
  return response.data;
};

export const adSetsData = async (selectedAccount, since, until) => {
  const response = await axios.get(
    `https://gim-dashboard.hogaresunion.com/api/adsets-insights/${selectedAccount}?since=${since}&until=${until}`
  );
  return response.data;
};

export const adsData = async (selectedAccount, since, until) => {
  const response = await axios.get(
    `https://gim-dashboard.hogaresunion.com/api/ads-insights/${selectedAccount}?since=${since}&until=${until}`
  );
  return response.data;
};
