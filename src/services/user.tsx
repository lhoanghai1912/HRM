import apiClient from './apiClient';

export const getMe = async () => {
  try {
    const res = await apiClient.get('User/get-me');
    return res.data;
  } catch (error) {
    console.log('Error fetching getme:', error);
    throw error;
  }
};
