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

export const orgStruct_get = async () => {
  try {
    const res = await apiClient.get('OrgStruct');

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const OrlLevel_get = async () => {
  try {
    const res = await apiClient.get('OrlLevel');

    return res.data;
  } catch (error) {
    throw error;
  }
};
