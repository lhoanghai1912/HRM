// src/services/index.ts
// Service layer exports

// Class-based services (new pattern)
export { BaseService } from './BaseService';
export { EmployeeService, employeeServiceInstance } from './EmployeeService';
export {
  AttendanceService,
  attendanceServiceInstance,
} from './AttendanceService';

// Object-based services
export { authService } from './authService';
export { userService } from './userService';

// Re-export class as UserService for compatibility
export { userService as UserService } from './userService';

// Legacy services (for backward compatibility)
export * from './auth';
export * from './hr';
export * from './data';
export * from './user';
export * from './Shift';
export * from './application';
