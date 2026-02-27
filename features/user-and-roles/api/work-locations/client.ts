import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { WorkLocation } from "../../types/work-locations";

export async function getWorkLocationsListClient(): Promise<
  ApiResponse<PaginatedResponse<WorkLocation>>
> {
  return apiClient.get<ApiResponse<PaginatedResponse<WorkLocation>>>(
    API_ENDPOINTS.workLocations.list,
  );
}
