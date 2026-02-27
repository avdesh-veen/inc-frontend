import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";
import type { WorkCategory, WorkCategoryRequest } from "../../types/work-category";

/**
 * Fetch all work categories without pagination (server-side)
 * 
 * @returns Promise with all work categories
 */
export async function getAllWorkCategoriesServer(): Promise<ApiResponse<WorkCategory[]>> {
  return fetchServer.get<ApiResponse<WorkCategory[]>>(
    API_ENDPOINTS.workCategories.list,
    {
      params: { allData: true },
    }
  );
}

/**
 * Fetch work categories with pagination (server-side)
 * 
 * @param request - Query parameters for filtering and pagination
 * @returns Promise with paginated work categories
 */
export async function getWorkCategoriesServer(request?: WorkCategoryRequest): Promise<ApiResponse<PaginatedResponse<WorkCategory>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<WorkCategory>>>(
    API_ENDPOINTS.workCategories.list,
    {
      params: request as Record<string, unknown>,
    }
  );
}

/**
 * Fetch work categories with pagination (server-side)
 * 
 * @param request - Query parameters for filtering and pagination
 * @returns Promise with paginated work categories
 */
export async function getWorkCategoriesListServer(
  request?: WorkCategoryRequest,
): Promise<ApiResponse<PaginatedResponse<WorkCategory>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<WorkCategory>>>(
    API_ENDPOINTS.workCategories.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch single work category by ID (server-side)
 * 
 * @param id - Work category ID
 * @returns Promise with work category details
 */
export async function getWorkCategoryByIdServer(
  id: string
): Promise<ApiResponse<WorkCategory>> {
  return fetchServer.get<ApiResponse<WorkCategory>>(
    API_ENDPOINTS.workCategories.detail(id)
  );
}
