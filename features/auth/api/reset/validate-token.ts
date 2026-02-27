"use server";

import { API_ENDPOINTS, getEndpoint } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import {
  ValidateResetTokenRequest,
  ValidateResetTokenResponse,
} from "../../types";
import { logger } from "@/lib/logger";

/**
 * Validate reset password token API call
 *
 * @param data - Request payload with token
 * @returns Promise with validation response
 */
export async function validateResetToken(
  data: ValidateResetTokenRequest,
): Promise<ApiResponse<ValidateResetTokenResponse>> {
  const endpoint = getEndpoint(API_ENDPOINTS.auth.validateResetToken);

  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  logger("Validate reset token", { response });
  const responseData =
    (await response.json()) as ApiResponse<ValidateResetTokenResponse>;
  logger("Validate reset token", { responseData });
  return responseData;
}
