/**
 * Auth feature type definitions.
 * Comprehensive types for authentication, users, sessions, and permissions.
 */

import { RolePermission } from "./permissions";

/**
 * Re-export form data types from validation schemas
 */
export type {
  LoginFormData,
  ForgotPswFormData,
  ResetPswFormData,
} from "@/features/auth/validations/schemas";

/**
 * User type definition
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Login API request payload
 * Note: Tokens always have fixed 10-day expiry
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login API response
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiry: number;
  user: User;
}

/**
 * Current user API response
 */
export interface CurrentUserResponse extends User {
  roleId: string;
  roleName: string;
  roleCode: string;
  rolePermissions: RolePermission[];
}

/**
 * Forgot password API request payload
 */
export interface ForgotPswRequest {
  email: string;
}

/**
 * Forgot password API response
 */
export interface ForgotPswResponse {
  message: string;
}

/**
 * Reset password API request payload
 */
export interface ResetPswRequest {
  token: string;
  password: string;
}

/**
 * Reset password API response
 */
export interface ResetPswResponse {
  message: string;
}

/**
 * Validate reset token API request payload
 */
export interface ValidateResetTokenRequest {
  token: string;
}

/**
 * Validate reset token API response
 */
export interface ValidateResetTokenResponse {
  valid: boolean;
  message?: string;
}
