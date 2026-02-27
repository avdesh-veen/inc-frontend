import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";
import { WorkLocation } from "../../types/work-locations";

export async function getWorkLocationsListServer(): Promise<ApiResponse<PaginatedResponse<WorkLocation>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<WorkLocation>>>(
    API_ENDPOINTS.workLocations.list,
  );
}
