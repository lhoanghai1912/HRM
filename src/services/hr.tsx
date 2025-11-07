import { GetAllParams } from '../utils/form';
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

// Sửa: employee_GetAll sử dụng POST với body structure mới
export const employee_GetAll = async (payload: any) => {
  try {
    console.log('employee_GetAll payload:', payload);

    // Payload đã có structure đúng từ usePaginatedList:
    // {
    //   paramQuery: { page, pageSize, filter, search, orderBy, sortOrder },
    //   ...otherFields
    // }

    const res = await apiClient.post('Employee/All', payload);
    console.log('employee_GetAll res:', res.data);

    return res.data;
  } catch (error) {
    console.log('Error fetching employee_GetAll:', error);
    throw error;
  }
};

// Sửa: contract_GetAll sử dụng POST với body structure mới
export const contract_GetAll = async (payload: any) => {
  try {
    console.log('contract_GetAll payload:', payload);

    const res = await apiClient.post('Contract/All', payload);
    console.log('contract_GetAll res:', res.data);

    return res.data;
  } catch (error) {
    console.log('Error fetching contract_GetAll:', error);
    throw error;
  }
};
