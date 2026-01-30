// src/store/slices/user/userTypes.ts
// User types

import { LoadingState } from '../../../types/api';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  department?: string;
  position?: string;
  role?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  department?: string;
  position?: string;
}

export interface UserState {
  profile: User | null;
  loadingState: LoadingState;
  error: string | null;
}
