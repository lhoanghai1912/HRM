// src/store/slices/auth/authTypes.ts
// Authentication types

export interface UserData {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserData;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  user: UserData | null;
  error: string | null;
}
