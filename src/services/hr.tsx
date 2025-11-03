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

export const employee_GetAll = async (params: GetAllParams) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value !== undefined && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

    const res = await apiClient.get(`Employee?${queryString}`);
    console.log('employee_GetAll res:', res.data);

    return res.data;
  } catch (error) {
    console.log('Error fetching employee_GetAll:', error);
    throw error;
  }
};

export const contract_GetAll = async (params: GetAllParams) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value !== undefined && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

    const res = await apiClient.get(`Contract?${queryString}`);
    console.log('contract_GetAll res:', res.data);

    return res.data;
  } catch (error) {
    console.log('Error fetching employee_GetAll:', error);
    throw error;
  }
};
