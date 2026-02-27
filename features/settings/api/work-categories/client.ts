import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import {
  WorkCategory,
  WorkCategoryRequest,
} from "@/features/settings/types/work-category";

/**
 * Fetch work categories from the client
 *
 * @param request - Query parameters for filtering and pagination
 * @returns Promise with work categories list
 */
export async function getWorkCategoriesClient(
  request?: WorkCategoryRequest,
): Promise<ApiResponse<PaginatedResponse<WorkCategory>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<WorkCategory>>>(
    API_ENDPOINTS.workCategories.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch all work categories without pagination
 *
 * @returns Promise with all work categories
 */
export async function getAllWorkCategoriesClient(): Promise<
  ApiResponse<WorkCategory[]>
> {
  return apiClient.get<ApiResponse<WorkCategory[]>>(
    API_ENDPOINTS.workCategories.list,
    {
      params: { allData: true },
    },
  );
}
