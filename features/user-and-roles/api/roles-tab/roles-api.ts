/**
 * Roles API Functions
 *
 * API functions for role operations.
 */

import { apiClient } from "@/lib/api/client";

/**
 * Permission detail from role API response
 */
export interface RolePermissionDetail {
  id: string;
  name: string;
  code: string;
}

/**
 * Resource permission from role detail API response
 */
export interface RoleResourcePermission {
  resourceId: string;
  resourceName: string;
  resourceCode: string;
  permissions: RolePermissionDetail[];
}

/**
 * Role detail from API response (GET /roles/:id)
 */
export interface RoleDetailFromAPI {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  isInternal: boolean;
  isActive: boolean;
  order: number;
  roleCategoryId: string;
  categoryName: string;
  permissions: RoleResourcePermission[];
}

/**
 * API response for role detail
 */
export interface RoleDetailAPIResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: RoleDetailFromAPI;
}

/**
 * Fetch role detail by ID
 * Returns full role details with permissions for editing
 */
export async function fetchRoleDetailById(
  id: string
): Promise<RoleDetailAPIResponse> {
  return apiClient.get<RoleDetailAPIResponse>(`/roles/${id}`);
}

/**
 * Role creation payload
 */
export interface CreateRolePayload {
  roleName: string;
  roleCategoryId: string;
  description?: string;
  permissions: Array<{
    moduleId: string;
    permissions: string[];
  }>;
}

/**
 * Role from API (simplified)
 */
export interface RoleFromAPI {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  isInternal: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  completeResourcePermissionCount?: number;
  limitedResourcePermissionCount?: number;
}

/**
 * Role creation response
 */
export interface CreateRoleResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: RoleFromAPI;
}

/**
 * Create new role
 */
export async function createRole(
  data: CreateRolePayload
): Promise<CreateRoleResponse> {
  return apiClient.post<CreateRoleResponse>("/roles/create-role", data);
}

/**
 * Role update payload (full). Use Partial<UpdateRolePayload> for PATCH to send only changed fields.
 */
export interface UpdateRolePayload {
  roleName: string;
  description?: string;
  isInternal: boolean;
  isActive: boolean;
  roleCategoryId: string;
  permissions: Array<{
    moduleId: string;
    permissions: string[];
  }>;
}

/**
 * Role update response
 */
export interface UpdateRoleResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: RoleFromAPI;
}

/**
 * Update existing role. Accepts partial payload; only provided fields are updated.
 */
export async function updateRoleById(
  id: string,
  data: Partial<UpdateRolePayload>,
): Promise<UpdateRoleResponse> {
  return apiClient.patch<UpdateRoleResponse>(`/roles/${id}`, data);
}
