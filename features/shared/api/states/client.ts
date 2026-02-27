import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { StateDropdownItem } from "@/features/shared/types/states";

export async function getStatesDropdownClient(): Promise<
  ApiResponse<PaginatedResponse<StateDropdownItem>>
> {
  return apiClient.get<ApiResponse<PaginatedResponse<StateDropdownItem>>>(
    API_ENDPOINTS.states.dropdown,
    { params: { page: 1, limit: 100 } },
  );
}
