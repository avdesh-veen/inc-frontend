import "server-only";

import { ApiResponse } from "@/lib/api/types";
import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CapacitySettings } from "@/features/settings/types/assignment";

/**
 * Fetch capacity settings from server
 * 
 * @returns Capacity settings data
 */
export async function getCapacitySettingsServer(): Promise<CapacitySettings> {
  const response = await fetchServer.get<ApiResponse<CapacitySettings>>(
    API_ENDPOINTS.assignment.capacity.get
  );
  return response.data;
}
