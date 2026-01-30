// src/types/auth.ts
// Authentication related types

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: UserData;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user?: UserData;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
  newPassword?: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  user: UserData | null;
  error: string | null;
}
