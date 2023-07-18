import axios from 'axios';

export const accountsData = async (since, until) => {
  const response = await axios.get(
    `/api/account-insights?since=${since}&until=${until}`
  );
  return response.data;
};

export const campaignsData = async (selectedAccount, since, until) => {
  const response = await axios.get(
    `/api/campaign-insights/${selectedAccount}?since=${since}&until=${until}`
  );
  return response.data;
};

export const adSetsData = async (selectedAccount, since, until) => {
  const response = await axios.get(
    `/api/adsets-insights/${selectedAccount}?since=${since}&until=${until}`
  );
  return response.data;
};

export const adsData = async (selectedAccount, since, until) => {
  const response = await axios.get(
    `/api/ads-insights/${selectedAccount}?since=${since}&until=${until}`
  );
  return response.data;
};
