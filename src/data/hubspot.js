import axios from 'axios';

export const contactsData = async (since, until) => {
  const response = await axios.get(
    `https://www.dashboard-aws.net/api/contacts-by-time-range?since=${since}&until=${until}`
  );
  return response.data;
};
