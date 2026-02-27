/**
 * Resources API Functions
 *
 * API functions for fetching resources and their permissions.
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Permission from API
 */
export interface PermissionFromAPI {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdAtUTC: number;
  updatedAtUTC: number;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

/**
 * Resource from API
 */
export interface ResourceFromAPI {
  id: string;
  resourceName: string;
  resourceCode: string;
  isActive: boolean;
  permissions: PermissionFromAPI[];
}

/**
 * API response for resources list
 */
export interface ResourcesAPIResponse {
  status: number;
  message: string;
  data: ResourceFromAPI[];
}

/**
 * Fetch all resources with their permissions
 */
export async function fetchResources(): Promise<ResourcesAPIResponse> {
  return apiClient.get<ResourcesAPIResponse>(API_ENDPOINTS.roles.resources);
}
