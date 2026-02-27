/**
 * Refresh Token Utility
 *
 * Handles token refresh logic with proper locking to prevent race conditions.
 * Ensures only one refresh request is made at a time, even with concurrent API calls.
 */

import { logger } from "../logger";

/**
 * Refresh token state management
 * Prevents multiple simultaneous refresh requests
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh the access token using the refresh token
 *
 * @returns Promise with new access token or null if refresh fails
 */
export async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    logger("Token refresh already in progress, waiting...");
    return refreshPromise;
  }

  // Set refreshing state
  isRefreshing = true;

  // Create new refresh promise
  refreshPromise = (async () => {
    try {
      logger("Attempting to refresh access token");

      // Call the refresh token API route
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        logger("Token refresh failed", { status: response.status });
        return null;
      }

      const data = await response.json();
      logger("Token refreshed successfully");

      return data.data?.accessToken || null;
    } catch (error) {
      logger("Token refresh error", { error: String(error) });
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

