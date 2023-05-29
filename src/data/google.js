import axios from 'axios';

export const googleCampaignsData = async (since, until) => {
  const response = await axios.get(
    `https://google-ads-api.onrender.com/api/google-campaigns?since=${since}&until=${until}`
  );
  return response.data;
};
