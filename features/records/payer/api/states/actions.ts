"use server";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { StateItem, StateRequest } from "../../types";
import { getStatesServer } from "./server";

/**
 * Server action to fetch states list
 *
 * @param request - Optional query parameters for filtering and pagination
 * @returns Promise with paginated states
 */
export async function getStatesAction(
  request?: StateRequest,
): Promise<ApiResponse<PaginatedResponse<StateItem>>> {
  return getStatesServer(request);
}
