"use server";

import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import { ResetPswRequest, ResetPswResponse } from "../../types";
import { logger } from "@/lib/logger";

/**
 * Reset password API call
 *
 * @param data - Reset password request payload with token and new password
 * @returns Promise with reset password response
 */
export async function resetPassword(
  data: ResetPswRequest,
): Promise<ApiResponse<ResetPswResponse>> {
  const endpoint = getEndpoint(API_ENDPOINTS.auth.resetPassword);

  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  logger("Reset password", { response });
  const responseData =
    (await response.json()) as ApiResponse<ResetPswResponse>;
  logger("Reset password", { responseData });
  return responseData;
}
