import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { StateDropdownItem } from "@/features/shared/types/states";

export async function getStatesDropdownServer(): Promise<
  ApiResponse<PaginatedResponse<StateDropdownItem>>
> {
  return fetchServer.get<ApiResponse<PaginatedResponse<StateDropdownItem>>>(
    API_ENDPOINTS.states.dropdown,
    { params: { page: 1, limit: 100 } },
  );
}
