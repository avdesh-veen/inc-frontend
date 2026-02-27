/**
 * Auth feature validation schemas.
 * Zod schemas for login, password reset, and authentication forms.
 */

import { z } from "zod";

/**
 * Login form validation schema
 * Note: rememberMe is deprecated and will be removed
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(64, "Password must be less than 64 characters"),
});

/**
 * Forgot password form validation schema
 */
export const forgotPswSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

/**
 * Reset password form validation schema
 */
export const resetPswSchema = z
  .object({
    newPassword: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * TypeScript types inferred from schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPswFormData = z.infer<typeof forgotPswSchema>;
export type ResetPswFormData = z.infer<typeof resetPswSchema>;
