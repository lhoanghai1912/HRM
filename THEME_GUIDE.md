# Theme System Guide

## Overview

The HRM app implements a comprehensive theme system supporting **Light**, **Dark**, and **System** (auto) modes. The theme adapts colors dynamically throughout the app for a consistent user experience.

## Theme Architecture

### 1. **Theme Context** (`src/contexts/ThemeContext.tsx`)

- Provides theme state management
- Handles theme switching (light/dark/system)
- Persists user preference to AsyncStorage
- Exports color definitions for light and dark modes

### 2. **useColors Hook** (`src/hooks/useColors.ts`)

```typescript
import { useColors } from '../hooks/useColors';

const MyComponent = () => {
  const colors = useColors(); // Returns current theme colors

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
};
```

## Color Palette

### Light Theme Colors

```typescript
{
  // Brand
  primary: '#095286',      // Main brand blue
  secondary: '#598CD2',    // Secondary blue
  accent: '#FCA326',       // Orange accent

  // Backgrounds
  background: '#F5F5F5',   // App background
  surface: '#FFFFFF',      // Cards/surfaces
  card: '#FFFFFF',         // Card backgrounds

  // Text
  text: '#1A1A1A',         // Primary text
  textSecondary: '#666666', // Secondary text
  textTertiary: '#999999',  // Tertiary text
  textInverse: '#FFFFFF',   // Text on dark backgrounds

  // Semantic
  success: '#10B981',      // Green for success
  error: '#EF4444',        // Red for errors
  warning: '#F59E0B',      // Yellow for warnings
  info: '#3B82F6',         // Blue for info

  // Borders & Dividers
  border: '#E5E5E5',       // Light borders
  divider: '#F0F0F0',      // Divider lines

  // Interactive
  button: '#095286',       // Primary button
  buttonHover: '#073D63',  // Hover state
  buttonDisabled: '#D1D5DB', // Disabled state
  link: '#2563EB',         // Links

  // Gray scale (50-900)
  gray50-gray900...
}
```

### Dark Theme Colors

```typescript
{
  // Brand (lighter for dark mode)
  primary: '#3B82F6',
  secondary: '#60A5FA',
  accent: '#FBBF24',

  // Backgrounds (dark)
  background: '#0F0F0F',   // Very dark
  surface: '#1A1A1A',      // Dark surface
  card: '#1F1F1F',         // Card background

  // Text (light)
  text: '#F5F5F5',
  textSecondary: '#A3A3A3',
  textTertiary: '#737373',

  // Semantic (lighter versions)
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',

  // Rest of the palette...
}
```

## Usage Guidelines

### ✅ DO: Use Dynamic Theme Colors

```typescript
// Good: Colors adapt to theme
const MyScreen = () => {
  const colors = useColors();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Title</Text>
      <Button style={{ backgroundColor: colors.primary }} />
    </View>
  );
};
```

### ❌ DON'T: Use Static Colors

```typescript
// Bad: Colors don't adapt to theme
import { colors } from '../utils/color'; // Deprecated!

const MyScreen = () => {
  return (
    <View style={{ backgroundColor: colors.white }}>
      {' '}
      {/* Won't change with theme! */}
      <Text style={{ color: '#000000' }}>Title</Text>
    </View>
  );
};
```

## Migration Checklist

To migrate a screen to the new theme system:

1. **Import useColors hook**

   ```typescript
   import { useColors } from '../../hooks/useColors';
   ```

2. **Remove old color imports**

   ```typescript
   // Remove this:
   import { colors } from '../../utils/color';
   ```

3. **Use hook in component**

   ```typescript
   const MyComponent = () => {
     const colors = useColors();
     // Now use colors.primary, colors.text, etc.
   };
   ```

4. **Update static styles**

   ```typescript
   // Before
   const styles = StyleSheet.create({
     container: {
       backgroundColor: colors.white, // Static!
     }
   });

   // After
   const styles = StyleSheet.create({
     container: {
       // Remove backgroundColor from here
     }
   });

   // Apply dynamically in JSX
   <View style={[styles.container, {backgroundColor: colors.background}]}>
   ```

## Theme Switching UI

Theme can be changed from Profile screen:

- **Light Mode**: Bright, clean interface
- **Dark Mode**: Eye-friendly dark interface
- **System**: Follows device settings

Implementation in Profile screen:

```typescript
<TouchableOpacity onPress={() => setThemeModalVisible(true)}>
  <View style={styles.themeRow}>
    <Text style={{color: colors.text}}>{t('profile.theme')}</Text>
    <Text style={{color: colors.textSecondary}}>{currentThemeText}</Text>
  </View>
</TouchableOpacity>

<ThemeSelector
  visible={themeModalVisible}
  onClose={() => setThemeModalVisible(false)}
/>
```

## Semantic Color Usage

Use semantic colors for specific purposes:

- **success**: Successful operations, confirmations, positive states
- **error**: Errors, failures, destructive actions
- **warning**: Warnings, cautions, important notices
- **info**: Informational messages, tips, help text

```typescript
<Text style={{color: colors.success}}>✓ Saved successfully</Text>
<Text style={{color: colors.error}}>✗ Failed to save</Text>
<Text style={{color: colors.warning}}>⚠ Warning message</Text>
<Text style={{color: colors.info}}>ℹ Info message</Text>
```

## Common Patterns

### Screen Container

```typescript
<View style={[styles.container, {backgroundColor: colors.background}]}>
```

### Card/Surface

```typescript
<View style={[styles.card, {backgroundColor: colors.surface}]}>
```

### Primary Text

```typescript
<Text style={[styles.title, {color: colors.text}]}>
```

### Secondary Text

```typescript
<Text style={[styles.subtitle, {color: colors.textSecondary}]}>
```

### Borders

```typescript
<View style={{borderColor: colors.border, borderWidth: 1}}>
```

### Buttons

```typescript
<TouchableOpacity style={{ backgroundColor: colors.primary }}>
  <Text style={{ color: colors.buttonText }}>Button</Text>
</TouchableOpacity>
```

## Already Migrated Screens

✅ Completed:

- Login
- Register
- ForgotPassword
- Home
- Profile
- Menu
- ChangePassword
- Noti
- PayRoll
- QuickPin
- OrgStruct
- User modal
- ThemeSelector modal

🔄 Partial (using components):

- Screens using Navbar component (auto-themed)
- Screens using CustomHeader (may need update)

⏳ Pending Migration:

- Employee Drawer screens
- Attendance Drawer screens
- AddForm, AddEmployee
- Other utility screens

## Testing Theme

1. Open app
2. Navigate to Profile
3. Tap on Theme option
4. Select different theme modes
5. Navigate through app to verify colors update correctly
6. Check both light and dark modes for:
   - Text readability
   - Contrast ratios
   - Visual consistency
   - Interactive element visibility

## Best Practices

1. **Always use useColors hook** - Never import static colors
2. **Apply colors inline** - Use `{backgroundColor: colors.surface}` in JSX
3. **Test both themes** - Verify your UI in light and dark mode
4. **Use semantic colors** - Use `colors.error` not `colors.red` for errors
5. **Maintain contrast** - Ensure text is readable on all backgrounds
6. **Update StyleSheets** - Remove static color values from StyleSheet.create()

## Accessibility

The theme system ensures:

- High contrast ratios for text readability
- WCAG 2.1 AA compliance (aim for AAA where possible)
- Consistent color usage across the app
- Support for system-level dark mode preference

## Future Enhancements

Potential improvements:

- Custom theme colors (user-defined)
- More theme variants (high contrast, colorblind modes)
- Per-screen theme overrides
- Animated theme transitions
- Theme-aware images/icons
