import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  SkillApiItem,
  SkillCategory,
  SkillsRequest,
  CategoryWithSkills,
  UserWithSkillsItem,
  UserWithSkillsRequest,
} from "../../types";

export async function getSkillByIdClient(id: string): Promise<ApiResponse<SkillApiItem>> {
  return apiClient.get<ApiResponse<SkillApiItem>>(API_ENDPOINTS.skills.detail(id));
}

export async function getSkillsListClient(
  request?: SkillsRequest,
): Promise<ApiResponse<PaginatedResponse<SkillApiItem>>> {
  const params =
    request && Object.keys(request).length > 0
      ? (request as Record<string, unknown>)
      : undefined;

  return apiClient.get<ApiResponse<PaginatedResponse<SkillApiItem>>>(
    API_ENDPOINTS.skills.list,
    params ? { params } : {},
  );
}

export async function getSkillCategoriesClient(): Promise<ApiResponse<SkillCategory[]>> {
  return apiClient.get<ApiResponse<SkillCategory[]>>(
    API_ENDPOINTS.skills.categories,
  );
}

export async function getSkillCategoriesDropdownClient(): Promise<ApiResponse<PaginatedResponse<SkillCategory>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<SkillCategory>>>(
    API_ENDPOINTS.skills.skillCategories,
  );
}

export async function getCategoriesWithSkillsClient(): Promise<ApiResponse<CategoryWithSkills[]>> {
  return apiClient.get<ApiResponse<CategoryWithSkills[]>>(
    API_ENDPOINTS.skills.categoriesWithSkills,
  );
}

export async function getUsersWithSkillsClient(
  request?: UserWithSkillsRequest,
): Promise<ApiResponse<PaginatedResponse<UserWithSkillsItem>>> {
  const params =
    request && Object.keys(request).length > 0
      ? (request as Record<string, unknown>)
      : undefined;

  return apiClient.get<ApiResponse<PaginatedResponse<UserWithSkillsItem>>>(
    API_ENDPOINTS.users.withSkills,
    params ? { params } : {},
  );
}
