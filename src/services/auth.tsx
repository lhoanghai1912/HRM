import apiClient from './apiClient';

export const login = async (username: string, password: string) => {
  try {
    const res = await apiClient.post('Auth/login', {
      username,
      password,
    });
    console.log('res', res);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const res = await apiClient.post('Auth/register', {
      username,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtp = async (email: string) => {
  try {
    const res = await apiClient.post('Auth/send-otp-to-email', { email });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const forgot_pw = async (
  email: string,
  otpCode: string,
  newPassword?: string,
) => {
  try {
    const res = await apiClient.post('Auth/verify-otp', {
      email,
      otpCode,
      newPassword,
    });
    console.log('Response from forgot_pw:', res);
    return res.data;
  } catch (error) {
    throw error;
  }
};
