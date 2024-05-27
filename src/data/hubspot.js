import axios from 'axios';

export const contactsData = async (since, until) => {
  const response = await axios.get(
    `https://gim-dashboard.hogaresunion.com/api/contacts-by-time-range?since=${since}&until=${until}`
  );
  return response.data;
};
