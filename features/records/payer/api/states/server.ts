import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";
import type { StateItem, StateRequest } from "../../types";

/**
 * Fetch states list (server-side)
 *
 * @param request - Optional query parameters for filtering and pagination
 * @returns Promise with paginated states
 */
export async function getStatesServer(
  request?: StateRequest,
): Promise<ApiResponse<PaginatedResponse<StateItem>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<StateItem>>>(
    API_ENDPOINTS.states.dropdown,
    {
      params: request as Record<string, unknown>,
    },
  );
}
