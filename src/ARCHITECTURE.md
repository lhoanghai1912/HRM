# HRM Project Architecture

## Project Structure

```
src/
├── api/                    # API client configuration
│   ├── client.ts           # Axios instance with interceptors
│   └── index.ts            # API exports
│
├── assets/                 # Static assets
│   ├── fonts/              # Custom fonts
│   ├── icons/              # Icon assets
│   └── images/             # Image assets
│
├── components/             # Reusable UI components
│   ├── hooks/              # Component-specific hooks
│   └── modal/              # Modal components
│
├── config/                 # App configuration
│   ├── api.ts              # API endpoints & config
│   ├── app.ts              # App settings
│   ├── storage.ts          # AsyncStorage keys
│   └── index.ts            # Config exports
│
├── constants/              # App constants
│   ├── colors.ts           # Color palette
│   ├── dimensions.ts       # Spacing, sizing
│   ├── screens.ts          # Screen names
│   └── index.ts            # Constants exports
│
├── contexts/               # React Contexts
│   ├── ThemeContext.tsx    # Light/Dark theme
│   ├── LanguageContext.tsx # i18n context
│   └── index.tsx           # Context exports
│
├── hooks/                  # Custom React hooks
│   ├── useAsyncStorage.ts  # AsyncStorage hook
│   ├── useDebounce.ts      # Debounce hook
│   ├── useKeyboard.ts      # Keyboard hook
│   └── index.ts            # Hook exports
│
├── language/               # Internationalization
│   ├── index.tsx           # i18n configuration
│   └── Resource/           # Translation files
│
├── navigation/             # React Navigation
│   ├── AppNavigator.tsx    # Root navigator
│   ├── AuthNavigator.tsx   # Auth stack
│   ├── HomeNavigator.tsx   # Home navigator
│   ├── DrawerNavigator.tsx # Drawer navigator
│   ├── Tab.tsx             # Tab navigators
│   └── ScreenName.tsx      # Screen name constants
│
├── screens/                # App screens
│   ├── AuthStack/          # Auth screens
│   ├── HomeStack/          # Main app screens
│   ├── Examples/           # Example implementations
│   └── Splash/             # Splash screen
│
├── services/               # API service layer
│   ├── authService.ts      # Auth business logic
│   ├── userService.ts      # User business logic
│   └── index.ts            # Service exports
│
├── store/                  # Redux store
│   ├── index.tsx           # Store configuration
│   ├── hooks.tsx           # Typed Redux hooks
│   ├── slices/             # Redux slices with thunks
│   │   ├── authSlice.ts    # Auth state & thunks
│   │   └── loadingSlice.ts # Loading state
│   ├── reducers/           # Legacy reducers
│   └── actions/            # Legacy actions
│
├── types/                  # TypeScript types
│   ├── api.ts              # API types
│   ├── auth.ts             # Auth types
│   ├── common.ts           # Common types
│   ├── navigation.ts       # Navigation types
│   ├── user.ts             # User types
│   └── index.ts            # Type exports
│
├── utils/                  # Utility functions
│   ├── color.tsx           # Color utilities
│   ├── spacing.tsx         # Spacing utilities
│   └── fontSize.tsx        # Font utilities
│
└── App.tsx                 # App entry point
```

## Architecture Patterns

### 1. Three-Tier Data Fetching

```
Component → Redux Thunk → Service Layer → API Client
```

**API Client** (`src/api/client.ts`):

- Centralized Axios instance
- Request interceptor: Auto-attach Bearer token
- Response interceptor: Global error handling with Toast

**Service Layer** (`src/services/`):

- Business logic facade
- Handles AsyncStorage operations
- Isolates components from API implementation

**Redux Thunks** (`src/store/slices/`):

- `createAsyncThunk` for async operations
- Manages loading/error states
- Components dispatch thunks

### 2. Typed Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';

const dispatch = useAppDispatch();
const token = useAppSelector(state => state.auth.token);
```

### 3. Theme System

```typescript
import { useTheme, useThemedColors } from '../contexts';

// Full theme context
const { theme, isDark, colors, toggleTheme } = useTheme();

// Just colors
const colors = useThemedColors();
```

### 4. Navigation Structure

```
RootNavigator (checks auth)
├── AuthNavigator (not authenticated)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
│
└── HomeNavigator (authenticated)
    └── DrawerNavigator
        ├── Home
        └── BottomTabNavigator
            ├── AttendanceTab
            ├── EmployeeTab
            └── PayrollTab
```

## Usage Examples

### Using Redux Thunks

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginThunk, clearError } from '../store/slices';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(loginThunk({ username, password }));
    if (loginThunk.fulfilled.match(result)) {
      // Login successful
    }
  };
};
```

### Using Theme

```typescript
import { useThemedColors } from '../contexts';

const MyComponent = () => {
  const colors = useThemedColors();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
};
```

### Using Service Layer

```typescript
import { authService } from '../services';

// In a thunk or component
const token = await authService.getToken();
const user = await authService.getUserData();
await authService.logout();
```

## Best Practices

1. **Always use typed hooks**: `useAppDispatch`, `useAppSelector`
2. **Use theme colors**: `useThemedColors()` for consistent theming
3. **Dispatch thunks for API calls**: Don't call APIs directly in components
4. **Use service layer**: For business logic and storage operations
5. **Define types**: Add all types to `src/types/`
6. **Use constants**: Screen names, colors, dimensions from `src/constants/`
