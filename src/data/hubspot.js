import axios from 'axios';

export const contactsData = async (since, until) => {
  const response = await axios.get(
    `/api/contacts-by-time-range?since=${since}&until=${until}`
  );
  return response.data;
};
