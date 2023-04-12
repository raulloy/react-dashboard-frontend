import axios from 'axios';

export const accountsData = async (since, until) => {
  const response = await axios.get(
    `https://www.dashboard-aws.net/api/account-insights?since=${since}&until=${until}`
  );
  return response.data;
};

export const campaignsData = async (selectedAccount, since, until) => {
  const response = await axios.get(
    `https://www.dashboard-aws.net/api/campaign-insights/${selectedAccount}?since=${since}&until=${until}`
  );
  return response.data;
};
