// src/store/slices/auth/authThunks.ts
// Authentication async thunks

import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../../../config/storage';
import { LoginRequest, LoginResponse, UserData } from './authTypes';
import * as authService from '../../../services/auth';

/**
 * Login thunk - handles user authentication
 */
export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(
      credentials.username,
      credentials.password,
    );

    // API trả về: { success, data: { accessToken, user } }
    const token = response.data?.accessToken;
    const user = response.data?.user;

    if (!token) {
      return rejectWithValue('Token không hợp lệ');
    }

    // Save token to AsyncStorage
    await AsyncStorage.setItem(storageKeys.AUTH_TOKEN, token);
    if (user) {
      await AsyncStorage.setItem(storageKeys.USER_DATA, JSON.stringify(user));
    }

    // Trả về đúng format LoginResponse
    return {
      token,
      user,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Đăng nhập thất bại';
    return rejectWithValue(message);
  }
});

/**
 * Register thunk - handles user registration
 */
export const registerThunk = createAsyncThunk<
  any,
  { username: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await authService.register(
      data.username,
      data.email,
      data.password,
    );
    return response;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Đăng ký thất bại';
    return rejectWithValue(message);
  }
});

/**
 * Logout thunk - clears authentication data
 */
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.multiRemove([
      storageKeys.AUTH_TOKEN,
      storageKeys.REFRESH_TOKEN,
      storageKeys.USER_DATA,
    ]);
  } catch (error: any) {
    return rejectWithValue('Đăng xuất thất bại');
  }
});

/**
 * Restore auth thunk - checks for existing session on app start
 */
export const restoreAuthThunk = createAsyncThunk<
  { token: string; user: UserData | null } | null,
  void,
  { rejectValue: string }
>('auth/restore', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem(storageKeys.AUTH_TOKEN);
    const userDataString = await AsyncStorage.getItem(storageKeys.USER_DATA);

    if (!token) {
      return null;
    }

    const user = userDataString ? JSON.parse(userDataString) : null;
    return { token, user };
  } catch (error: any) {
    return rejectWithValue('Không thể khôi phục phiên đăng nhập');
  }
});

/**
 * Forgot password thunk
 */
export const forgotPasswordThunk = createAsyncThunk<
  any,
  { email: string; otpCode: string; newPassword?: string },
  { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await authService.forgot_pw(
      data.email,
      data.otpCode,
      data.newPassword,
    );
    return response;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Thao tác thất bại';
    return rejectWithValue(message);
  }
});

/**
 * Send OTP thunk
 */
export const sendOtpThunk = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    const response = await authService.sendOtp(email);
    return response;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Gửi OTP thất bại';
    return rejectWithValue(message);
  }
});
