import { GetAllParams } from '../utils/form';
import apiClient from './apiClient';

export const getAllDetailShifts = async (params: GetAllParams) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value !== undefined && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

    const res = await apiClient.get(`ShiftDetail?${queryString}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching getAllDetailShifts:', error);
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

export const GetAllShifts = async (params: GetAllParams) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value !== undefined && value !== null,
      ),
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

    const res = await apiClient.get(`Shift?${queryString}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching GetAllShifts:', error);
    throw error;
  }
};
