import axios from 'axios';

export const googleCampaignsData = async (accountID, since, until) => {
  const response = await axios.get(
    `https://google-ads-api.onrender.com/api/google-campaigns/${accountID}?since=${since}&until=${until}`
  );
  return response.data;
};

export const googleAdGroupsData = async (accountID, since, until) => {
  const response = await axios.get(
    `https://google-ads-api.onrender.com/api/google-ad_groups/${accountID}?since=${since}&until=${until}`
  );
  return response.data;
};

export const googleAdsData = async (accountID, since, until) => {
  const response = await axios.get(
    `https://google-ads-api.onrender.com/api/google-ads/${accountID}?since=${since}&until=${until}`
  );
  return response.data;
};
