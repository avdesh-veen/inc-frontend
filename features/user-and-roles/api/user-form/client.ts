import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { Skill, User, UserSkillItem } from "../../types/user-tab";


export async function getSkillsListClient(request?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Skill>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<Skill>>>(
    API_ENDPOINTS.skills.list,
    { params: request },
  );
}

export async function getUserByIdClient(id: string): Promise<ApiResponse<User>> {
  return apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.users.byId(id),
  );
}

export async function getUserSkillsClient(userId: string): Promise<ApiResponse<UserSkillItem[]>> {
  return apiClient.get<ApiResponse<UserSkillItem[]>>(
    API_ENDPOINTS.users.skills(userId),
  );
}

export async function updateUserSkillsClient(
  userId: string,
  skillIds: string[],
): Promise<ApiResponse<void>> {
  return apiClient.patch<ApiResponse<void>>(
    API_ENDPOINTS.users.skills(userId),
    { skillIds },
  );
}