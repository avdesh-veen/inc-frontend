import { type LoginRequest } from "../../types";

/**
 * Logout user
 *
 * @returns Promise with logout response
 */
export async function logoutUser() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  return res.json();
}

/**
 * Login user
 *
 * @param credentials - Login request credentials
 * @returns Promise with login response
 */
export async function loginUser(credentials: LoginRequest) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  return res.json();
}

/**
 * Get current user
 *
 * @returns Promise with current user data
 */
export async function getCurrentUser() {
  const res = await fetch("/api/auth/get-current-user", {
    credentials: "include",
  });
  return res.json();
}
