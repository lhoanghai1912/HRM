# HRM App Architecture

## Tổng quan

Ứng dụng HRM (Human Resource Management) được xây dựng theo kiến trúc production-grade với các pattern chuẩn cho React Native + TypeScript.

## Cấu trúc thư mục

```
src/
├── api/                    # API Client và interceptors
│   ├── client.ts          # Axios instance với token management
│   └── index.ts           # API exports
│
├── components/            # UI Components dùng chung
│   ├── AppButton.tsx
│   ├── AppInput.tsx
│   ├── CustomHeader.tsx
│   ├── Loading.tsx
│   ├── hooks/             # Component-specific hooks
│   └── modal/             # Modal components
│
├── config/                # Configuration tập trung
│   ├── api.ts             # API config (baseURL, endpoints, timeouts)
│   ├── app.ts             # App config (version, features)
│   ├── storage.ts         # Storage keys
│   ├── toast.ts           # Toast configuration
│   └── index.ts           # Config exports
│
├── constants/             # Hằng số
│   ├── colors.ts          # Color palette
│   ├── dimensions.ts      # Spacing, font sizes
│   ├── screens.ts         # Screen names
│   └── index.ts           # Constants exports
│
├── contexts/              # React Contexts
│   ├── ThemeContext.tsx   # Theme provider + useTheme, useThemedColors
│   ├── LanguageContext.tsx # Language provider
│   └── index.ts           # Context exports
│
├── hooks/                 # Custom React Hooks
│   ├── useDebounce.ts
│   ├── useAsyncStorage.ts
│   ├── useKeyboard.ts
│   └── index.ts
│
├── navigators/            # Navigation (4-layer pattern)
│   ├── RootNavigator.tsx  # Root: Auth/Main
│   ├── AuthStack.tsx      # Auth screens
│   ├── MainDrawer.tsx     # Drawer navigation
│   ├── MainTabs.tsx       # Bottom tabs
│   ├── NavigationService.ts # Navigation utils
│   ├── stacks/            # Stack-per-Tab navigators
│   │   ├── HomeStack.tsx
│   │   ├── AttendanceStack.tsx
│   │   ├── EmployeeStack.tsx
│   │   ├── PayrollStack.tsx
│   │   └── ProfileStack.tsx
│   └── index.ts
│
├── screens/               # Screen components
│   ├── AuthStack/         # Login, Register, ForgotPassword
│   ├── HomeStack/         # Home screens
│   └── Splash/            # Splash screen
│
├── services/              # Service Layer (3-tier data fetching)
│   ├── BaseService.ts     # Base class với common CRUD operations
│   ├── authService.ts     # Authentication service
│   ├── userService.ts     # User profile service
│   ├── EmployeeService.ts # Employee CRUD service (class)
│   ├── AttendanceService.ts # Attendance service (class)
│   └── index.ts           # Service exports
│
├── store/                 # Redux Store
│   ├── index.tsx          # Store configuration
│   ├── hooks.tsx          # Typed hooks (useAppDispatch, useAppSelector)
│   └── slices/            # Redux Toolkit slices (modular structure)
│       ├── index.ts       # Centralized exports
│       ├── loadingSlice.ts # Global loading state
│       ├── auth/          # Auth module
│       │   ├── index.ts
│       │   ├── authTypes.ts    # Auth state & types
│       │   ├── authThunks.ts   # Auth async thunks
│       │   └── authSlice.ts    # Auth reducers
│       ├── user/          # User module
│       │   ├── index.ts
│       │   ├── userTypes.ts
│       │   ├── userThunks.ts
│       │   └── userSlice.ts
│       ├── employee/      # Employee module
│       │   ├── index.ts
│       │   ├── employeeTypes.ts
│       │   ├── employeeThunks.ts
│       │   └── employeeSlice.ts
│       └── attendance/    # Attendance module
│           ├── index.ts
│           ├── attendanceTypes.ts
│           ├── attendanceThunks.ts
│           └── attendanceSlice.ts
│
├── types/                 # TypeScript types
│   ├── api.ts             # API response types
│   ├── auth.ts            # Auth types
│   ├── user.ts            # User types
│   ├── navigation.ts      # Navigation types
│   ├── common.ts          # Common types
│   └── index.ts
│
├── utils/                 # Utility functions
│   ├── color.tsx
│   ├── constants.tsx
│   ├── helper.tsx
│   └── form.tsx
│
├── validation/            # Form validation
│   ├── authValidation.ts  # Auth form validation
│   ├── commonValidation.ts # Common validators
│   ├── formValidation.ts  # Form validation utilities
│   └── index.ts
│
└── App.tsx                # App entry point
```

## Architecture Patterns

### 1. 4-Layer Navigation

```
RootNavigator
├── AuthStack (unauthenticated)
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen
│
└── MainDrawer (authenticated)
    └── MainTabs
        ├── HomeStack
        │   ├── HomeScreen
        │   ├── NotificationsScreen
        │   └── NewsDetailScreen
        │
        ├── AttendanceStack
        │   ├── AttendanceScreen
        │   ├── CheckInOutScreen
        │   └── LeaveRequestScreen
        │
        ├── EmployeeStack
        │   ├── EmployeeListScreen
        │   └── EmployeeDetailScreen
        │
        ├── PayrollStack
        │   ├── PayrollScreen
        │   └── PayslipDetailScreen
        │
        └── ProfileStack
            ├── ProfileScreen
            └── SettingsScreen
```

### 2. 3-Tier Data Fetching

```
┌─────────────────────────────────────────────────────────────┐
│  COMPONENTS (UI Layer)                                       │
│  - Sử dụng useAppSelector để lấy state                       │
│  - Sử dụng useAppDispatch để dispatch thunks                 │
│  - Render UI based on loadingState, error, data             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  REDUX SLICES (State Layer)                                  │
│  - createAsyncThunk cho async operations                     │
│  - extraReducers xử lý pending/fulfilled/rejected           │
│  - Centralized state management                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICES (Data Layer)                                       │
│  - BaseService class với common CRUD operations             │
│  - Singleton instances cho mỗi service                      │
│  - Gọi API thông qua api client                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  API CLIENT (Transport Layer)                                │
│  - Axios instance với request/response interceptors         │
│  - Tự động attach token                                      │
│  - Global error handling                                     │
└─────────────────────────────────────────────────────────────┘
```

### 3. Modular Slice Pattern

Mỗi Redux module được tổ chức trong một thư mục riêng với 4 file:

```
slices/
└── employee/
    ├── index.ts           # Exports tất cả
    ├── employeeTypes.ts   # Types & interfaces
    ├── employeeThunks.ts  # Async thunks
    └── employeeSlice.ts   # Slice với reducers
```

**employeeTypes.ts** - Định nghĩa types:

```typescript
export interface Employee {
  id: string;
  fullName: string;
  // ...
}

export interface EmployeeState {
  employees: Employee[];
  loadingState: LoadingState;
  error: string | null;
}
```

**employeeThunks.ts** - Async operations:

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { employeeServiceInstance } from '../../../services';

export const fetchEmployeesThunk = createAsyncThunk<
  PaginatedResponse<Employee>,
  PaginatedRequest,
  { rejectValue: string }
>('employee/fetchEmployees', async (params, { rejectWithValue }) => {
  try {
    return await employeeServiceInstance.getEmployees(params);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch');
  }
});
```

**employeeSlice.ts** - Slice definition:

```typescript
import { createSlice } from '@reduxjs/toolkit';
import { EmployeeState } from './employeeTypes';
import { fetchEmployeesThunk } from './employeeThunks';

const initialState: EmployeeState = {
  /* ... */
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    /* sync actions */
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEmployeesThunk.pending, state => {
        /* ... */
      })
      .addCase(fetchEmployeesThunk.fulfilled, (state, action) => {
        /* ... */
      })
      .addCase(fetchEmployeesThunk.rejected, (state, action) => {
        /* ... */
      });
  },
});

export const employeeReducer = employeeSlice.reducer;
```

**index.ts** - Centralized exports:

```typescript
export * from './employeeTypes';
export * from './employeeThunks';
export * from './employeeSlice';
```

**Benefits:**

- ✅ Clear separation of concerns (types, thunks, reducers)
- ✅ Easy to find and navigate code
- ✅ Smaller, more focused files
- ✅ Better for team collaboration
- ✅ Scalable structure

### 4. Redux Slice Pattern (Legacy - for reference)

```typescript
// Example: employeeSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { employeeServiceInstance } from '../../services';

// 1. Define types
interface EmployeeState {
  employees: Employee[];
  loadingState: LoadingState;
  error: string | null;
}

// 2. Initial state
const initialState: EmployeeState = {
  employees: [],
  loadingState: 'idle',
  error: null,
};

// 3. Create async thunks
export const fetchEmployeesThunk = createAsyncThunk<
  PaginatedResponse<Employee>,
  PaginatedRequest,
  { rejectValue: string }
>('employee/fetchEmployees', async (params, { rejectWithValue }) => {
  try {
    return await employeeServiceInstance.getEmployees(params);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch employees');
  }
});

// 4. Create slice with extraReducers
const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    // Sync reducers here
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEmployeesThunk.pending, state => {
        state.loadingState = 'loading';
      })
      .addCase(fetchEmployeesThunk.fulfilled, (state, action) => {
        state.loadingState = 'succeeded';
        state.employees = action.payload.data;
      })
      .addCase(fetchEmployeesThunk.rejected, (state, action) => {
        state.loadingState = 'failed';
        state.error = action.payload || 'Unknown error';
      });
  },
});
```

### 4. Service Class Pattern

```typescript
// BaseService.ts
export class BaseService {
  protected prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  protected async get<T>(endpoint: string, params?: any): Promise<T> {
    return api.get<T>(`/${this.prefix}${endpoint}`, params);
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return api.post<T>(`/${this.prefix}${endpoint}`, data);
  }

  // ... other CRUD methods
}

// EmployeeService.ts
export class EmployeeService extends BaseService {
  constructor() {
    super('Employee');
  }

  async getEmployees(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<Employee>> {
    return this.getPaginated<Employee>('/list', params);
  }
}

export const employeeServiceInstance = new EmployeeService();
```

### 5. Typed Redux Hooks

```typescript
// store/hooks.tsx
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 6. Theme Context Pattern

```typescript
// contexts/ThemeContext.tsx
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  // ... more colors
}

export const useTheme = () => useContext(ThemeContext);
export const useThemedColors = (): ThemeColors => {
  const { colors } = useTheme();
  return colors;
};
```

## Usage Examples

### Fetching Data in a Screen

```typescript
import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchEmployeesThunk,
  selectEmployees,
  selectLoadingState,
} from '../../store/slices';

const EmployeeListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const loadingState = useAppSelector(selectLoadingState);

  useEffect(() => {
    dispatch(fetchEmployeesThunk({ page: 1, pageSize: 20 }));
  }, [dispatch]);

  if (loadingState === 'loading') {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={employees}
      renderItem={({ item }) => <EmployeeCard employee={item} />}
      keyExtractor={item => item.id}
    />
  );
};
```

### Using Theme Colors

```typescript
import { useThemedColors } from '../../contexts';

const MyComponent: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
};
```

### Form Validation

```typescript
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from '../../validation';

const validateForm = (data: FormData): ValidationErrors => {
  return {
    email: validateEmail(data.email),
    phone: validatePhone(data.phone),
    name: validateRequired('Name')(data.name),
  };
};
```

## API Configuration

### Endpoints

API endpoints được định nghĩa tập trung trong `src/config/api.ts`:

```typescript
export const apiConfig = {
  baseURL: 'https://api.example.com',
  timeout: 30000,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh',
    },
    user: {
      profile: '/user/profile',
      updateProfile: '/user/update',
    },
    // ... more endpoints
  },
};
```

### Storage Keys

Storage keys được định nghĩa trong `src/config/storage.ts`:

```typescript
export const StorageKeys = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME_MODE: 'themeMode',
  LANGUAGE: 'language',
};
```

## Migration Notes

### Từ Legacy Pattern sang New Pattern

1. **Redux Actions/Reducers → Redux Toolkit Slices**

   - Thay thế action creators + reducers riêng biệt bằng `createSlice`
   - Sử dụng `createAsyncThunk` cho async operations
   - Sử dụng `extraReducers` để handle thunk states

2. **Direct API Calls → Service Layer**

   - Wrap API calls trong service classes/objects
   - Sử dụng singleton instances
   - Centralize error handling

3. **Inline Styles → Theme Context**

   - Sử dụng `useThemedColors()` cho dynamic colors
   - Define color palette trong `ThemeContext`

4. **String Screen Names → Constants**
   - Import từ `constants/screens.ts`
   - Type-safe navigation

## Best Practices

1. **Always use typed hooks**: `useAppDispatch`, `useAppSelector`
2. **Never call services directly in components**: Go through Redux thunks
3. **Handle all loading states**: `idle` | `loading` | `succeeded` | `failed`
4. **Centralize configuration**: API URLs, storage keys, timeouts
5. **Use singleton service instances**: Avoid creating new instances
6. **Validate forms before submission**: Use validation utilities
7. **Use theme colors for styling**: Support light/dark mode

## Dependencies

- **React Native**: 0.80.1
- **TypeScript**: 5.0.4
- **Redux Toolkit**: For state management
- **React Navigation**: 7.x for navigation
- **Axios**: For HTTP requests
- **i18next**: For internationalization
- **AsyncStorage**: For local storage
