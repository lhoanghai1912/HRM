// src/validation/authValidation.ts
// Authentication form validation rules

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email không được để trống' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email không hợp lệ' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Mật khẩu không được để trống' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }

  if (password.length > 50) {
    return { isValid: false, error: 'Mật khẩu không được quá 50 ký tự' };
  }

  // Optional: Check for strong password
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return { isValid: true, error: null };
};

/**
 * Validate password confirmation
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return { isValid: false, error: 'Xác nhận mật khẩu không được để trống' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Mật khẩu xác nhận không khớp' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate username
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Tên đăng nhập không được để trống' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Tên đăng nhập phải có ít nhất 3 ký tự' };
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Tên đăng nhập không được quá 30 ký tự' };
  }

  // Only allow alphanumeric and underscore
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error: 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate OTP code
 */
export const validateOtp = (otp: string): ValidationResult => {
  if (!otp || otp.trim().length === 0) {
    return { isValid: false, error: 'Mã OTP không được để trống' };
  }

  if (!/^\d{4,6}$/.test(otp)) {
    return { isValid: false, error: 'Mã OTP phải là 4-6 chữ số' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate login form
 */
export const validateLoginForm = (
  username: string,
  password: string,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const usernameResult = validateUsername(username);
  if (!usernameResult.isValid && usernameResult.error) {
    errors.username = usernameResult.error;
  }

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid && passwordResult.error) {
    errors.password = passwordResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate registration form
 */
export const validateRegisterForm = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const usernameResult = validateUsername(username);
  if (!usernameResult.isValid && usernameResult.error) {
    errors.username = usernameResult.error;
  }

  const emailResult = validateEmail(email);
  if (!emailResult.isValid && emailResult.error) {
    errors.email = emailResult.error;
  }

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid && passwordResult.error) {
    errors.password = passwordResult.error;
  }

  const confirmResult = validateConfirmPassword(password, confirmPassword);
  if (!confirmResult.isValid && confirmResult.error) {
    errors.confirmPassword = confirmResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
