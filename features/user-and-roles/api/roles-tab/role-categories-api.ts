/**
 * Role Categories API Functions
 *
 * API functions for fetching role categories.
 */

import { apiClient } from "@/lib/api/client";

/**
 * Role Category from API
 */
export interface RoleCategoryFromAPI {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API response for role categories list
 */
export interface RoleCategoriesAPIResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    items: RoleCategoryFromAPI[];
  };
}

/**
 * Role categories filter options
 */
export interface RoleCategoriesFilters {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Fetch all role categories
 * @param filters - Optional filters for role categories
 */
export async function fetchRoleCategories(
  filters?: RoleCategoriesFilters
): Promise<RoleCategoriesAPIResponse> {
  return apiClient.get<RoleCategoriesAPIResponse>("/roles/categories", {
    params: filters as Record<string, unknown>,
  });
}
