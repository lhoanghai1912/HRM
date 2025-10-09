import apiClient from './apiClient';

export const employee_Create = async (employeeData: any) => {
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

export const employee_Get = async (id: any) => {
  try {
    const res = await apiClient.get(`Employee/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
