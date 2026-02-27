"use server";

import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import { ForgotPswRequest, ForgotPswResponse } from "../../types";
import { logger } from "@/lib/logger";

/**
 * Get current user
 *
 * @returns Promise with current user data
 */
export async function forgotPassword(
  data: ForgotPswRequest,
): Promise<ApiResponse<ForgotPswResponse>> {
  const endpoint = getEndpoint(API_ENDPOINTS.auth.forgotPassword);

  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData =
    (await response.json()) as ApiResponse<ForgotPswResponse>;
  logger("Forgot password", { responseData });
  return responseData;
}
