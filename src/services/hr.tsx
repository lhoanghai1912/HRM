import apiClient from './apiClient';

export const create_employee = async (employeeData: any) => {
  try {
    const res = await apiClient.post('Employee', employeeData);
    console.log('res', res);

    return res.data;
  } catch (error) {
    throw error;
  }
};
