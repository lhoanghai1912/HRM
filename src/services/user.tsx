import { Platform } from 'react-native';
import apiClient from './apiClient';

interface UploadImageParams {
  uri: string;
  fileName?: string;
  type?: string;
}

export const getMe = async () => {
  try {
    const res = await apiClient.get('User/get-me');
    return res.data;
  } catch (error) {
    console.log('Error fetching getme:', error);
    throw error;
  }
};

export const employeeAvatar_Update = async (
  employeeId: string,
  image: UploadImageParams,
) => {
  try {
    // Tạo FormData

    const file = {
      uri:
        Platform.OS === 'android'
          ? image.uri
          : image.uri.replace('file://', ''),
      name: image.fileName || `image.${image.type?.split('/')[1] || 'jpg'}`,
      type: image.type || 'image/jpeg',
    };

    const formData = new FormData();
    formData.append('Files', {
      ...file,
    } as any); // Ép kiểu để TypeScript không báo lỗi

    // Gửi yêu cầu API
    const res = await apiClient.put(
      `Employee/upload-avatar?id=${employeeId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data; // Trả về dữ liệu từ API (ví dụ: URL của avatar mới)
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
};

export const employee_Update = async (
  employeeId: string,
  employeeData: any,
) => {
  try {
    const res = await apiClient.put(`Employee/${employeeId}`, employeeData);
    return res.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const password_Change = async (
  oldPassword: string,
  newPassword: string,
) => {
  try {
    const res = await apiClient.put(`User/change-password`, {
      oldPassword,
      newPassword,
    });
    return res.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
