// src/store/slices/user/userThunks.ts
// User async thunks

import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../../services/userService';
import { User, UpdateProfileRequest } from './userTypes';

/**
 * Fetch user profile thunk
 */
export const fetchProfileThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getProfile();
    return response;
  } catch (error: any) {
    const message = error.message || 'Không thể tải thông tin người dùng';
    return rejectWithValue(message);
  }
});

/**
 * Update user profile thunk
 */
export const updateProfileThunk = createAsyncThunk<
  User,
  UpdateProfileRequest,
  { rejectValue: string }
>('user/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await userService.updateProfile(data);
    return response;
  } catch (error: any) {
    const message = error.message || 'Cập nhật thông tin thất bại';
    return rejectWithValue(message);
  }
});

/**
 * Change password thunk
 */
export const changePasswordThunk = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      await userService.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      const message = error.message || 'Đổi mật khẩu thất bại';
      return rejectWithValue(message);
    }
  },
);

/**
 * Upload avatar thunk
 */
export const uploadAvatarThunk = createAsyncThunk<
  { avatarUrl: string },
  string,
  { rejectValue: string }
>('user/uploadAvatar', async (imageUri, { rejectWithValue }) => {
  try {
    const response = await userService.uploadAvatar(imageUri);
    return response;
  } catch (error: any) {
    const message = error.message || 'Tải ảnh lên thất bại';
    return rejectWithValue(message);
  }
});
