// src/services/userService.ts
// User service layer - business logic for user operations

import { api } from '../api/client';
import { apiConfig } from '../config/api';
import { User, UpdateProfileRequest } from '../types/user';

/**
 * User Service
 * Handles all user-related API calls
 */
export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return api.get<User>(apiConfig.endpoints.user.profile);
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return api.put<User>(apiConfig.endpoints.user.updateProfile, data);
  },

  /**
   * Change user password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    return api.post(apiConfig.endpoints.user.changePassword, {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(imageUri: string): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    return api.post('/User/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default userService;
