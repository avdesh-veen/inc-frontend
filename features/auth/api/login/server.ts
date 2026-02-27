import "server-only";

import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/constants/cookie-helper";
import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import { CurrentUserResponse } from "../../types";
import { logger } from "@/lib/logger";

/**
 * Get token from cookies
 *
 * @returns Promise with token
 */
export async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.AUTH_TOKEN)?.value || "";
}

/**
 * Get current user
 *
 * @returns Promise with current user data
 */
export async function getCurrentUser(): Promise<
  ApiResponse<CurrentUserResponse | null>
> {
  const endpoint = getEndpoint(API_ENDPOINTS.auth.rolePermission);
  const token = await getToken();

  try {
    const response = await fetch(endpoint, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = (await response.json()) as ApiResponse<CurrentUserResponse>;
    return data;
  } catch (error) {
    logger("Error getting current user", { error });
    return {
      status: false,
      statusCode: 503,
      message: "Failed to fetch current user",
      data: null,
    };
  }
}
