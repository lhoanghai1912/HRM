// src/types/user.ts
// User related types

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  department?: string;
  position?: string;
  role?: UserRole;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'employee' | 'guest';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserProfile extends User {
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationalId?: string;
  bankAccount?: string;
  bankName?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface UserState {
  userData: User | null;
  userId: string | null;
  token: string | null;
  verificationToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}
