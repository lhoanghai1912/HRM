// src/services/authService.ts
// Authentication service layer - business logic for auth operations

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';
import { apiConfig } from '../config/api';
import { storageKeys } from '../config/storage';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserData,
} from '../types/auth';

/**
 * Authentication Service
 * Handles all authentication-related API calls and storage operations
 */
export const authService = {
  /**
   * Login user and store credentials
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      apiConfig.endpoints.auth.login,
      credentials,
    );

    // Store auth data
    if (response.token) {
      await this.storeAuthData(response.token, response.user);
    }

    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<any> {
    return api.post(apiConfig.endpoints.auth.register, data);
  },

  /**
   * Logout user and clear stored credentials
   */
  async logout(): Promise<void> {
    try {
      // Optionally call logout API
      // await api.post(apiConfig.endpoints.auth.logout);
    } catch (error) {
      // Continue with local logout even if API fails
      console.error('Logout API error:', error);
    }

    // Clear local storage
    await this.clearAuthData();
  },

  /**
   * Send OTP to email for password reset
   */
  async sendOtp(email: string): Promise<any> {
    return api.post(apiConfig.endpoints.auth.sendOtp, { email });
  },

  /**
   * Verify OTP and optionally set new password
   */
  async verifyOtp(
    email: string,
    otpCode: string,
    newPassword?: string,
  ): Promise<any> {
    return api.post(apiConfig.endpoints.auth.verifyOtp, {
      email,
      otpCode,
      newPassword,
    });
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(
        storageKeys.REFRESH_TOKEN,
      );
      if (!refreshToken) {
        return null;
      }

      const response = await api.post<{ token: string }>(
        apiConfig.endpoints.auth.refreshToken,
        { refreshToken },
      );

      if (response.token) {
        await AsyncStorage.setItem(storageKeys.AUTH_TOKEN, response.token);
        return response.token;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.clearAuthData();
      return null;
    }
  },

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(storageKeys.AUTH_TOKEN);
  },

  /**
   * Get stored user data
   */
  async getUserData(): Promise<UserData | null> {
    try {
      const data = await AsyncStorage.getItem(storageKeys.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },

  /**
   * Store authentication data
   */
  async storeAuthData(
    token: string,
    user?: UserData,
    refreshToken?: string,
  ): Promise<void> {
    const operations: [string, string][] = [[storageKeys.AUTH_TOKEN, token]];

    if (user) {
      operations.push([storageKeys.USER_DATA, JSON.stringify(user)]);
    }

    if (refreshToken) {
      operations.push([storageKeys.REFRESH_TOKEN, refreshToken]);
    }

    await AsyncStorage.multiSet(operations);
  },

  /**
   * Clear all authentication data
   */
  async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove([
      storageKeys.AUTH_TOKEN,
      storageKeys.REFRESH_TOKEN,
      storageKeys.USER_DATA,
    ]);
  },

  /**
   * Update stored user data
   */
  async updateUserData(updates: Partial<UserData>): Promise<void> {
    const currentData = await this.getUserData();
    if (currentData) {
      const updatedData = { ...currentData, ...updates };
      await AsyncStorage.setItem(
        storageKeys.USER_DATA,
        JSON.stringify(updatedData),
      );
    }
  },
};

export default authService;
