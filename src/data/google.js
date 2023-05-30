import axios from 'axios';

export const googleCampaignsData = async (since, until) => {
  const response = await axios.get(
    `https://google-ads-api.onrender.com/api/google-campaigns?since=${since}&until=${until}`
  );
  return response.data;
};

export const googleAdGroupsData = async (since, until) => {
  const response = await axios.get(
    `https://google-ads-api.onrender.com/api/google-ad_groups?since=${since}&until=${until}`
  );
  return response.data;
};
