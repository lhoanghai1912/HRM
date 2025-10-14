import apiClient from './apiClient';

export const getAllShifts = async () => {
  try {
    const res = await apiClient.get('ShiftDetail');
    return res.data;
  } catch (error) {
    console.log('Error fetching getAllShifts:', error);
    throw error;
  }
};

export const getDetailShift = async (id: number) => {
  try {
    const res = await apiClient.get(`ShiftDetail/${id}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching getDetailShift:', error);
    throw error;
  }
};
