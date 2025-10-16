import apiClient from './apiClient';

export const getEarly_LateApplications = async params => {
  try {
    const response = await apiClient.get('TimeAdjustmentRequest', { params });
    console.log('Response from getEarly_LateApplications:', response);
    return response.data; // Trả về { result: [...], page, pageSize, total }
  } catch (error) {
    console.error('Error fetching Early_Late applications:', error);
    throw error;
  }
};

export const getDetail_Early_LateApplications = async (id: string) => {
  try {
    const response = await apiClient.get(`TimeAdjustmentRequest/${id}`);
    console.log('Response from getEarly_LateApplications:', response);
    return response.data; // Trả về { result: [...], page, pageSize, total }
  } catch (error) {
    console.error('Error fetching Early_Late applications:', error);
    throw error;
  }
};
