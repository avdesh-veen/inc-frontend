import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { Skill, User } from "../../types/user-tab";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";

export async function getSkillsListServer(request?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Skill>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<Skill>>>(
    API_ENDPOINTS.skills.list,
    { params: request },
  );
}

export async function getUserByIdServer(id: string): Promise<ApiResponse<User>> {
  return fetchServer.get<ApiResponse<User>>(
    API_ENDPOINTS.users.byId(id),
  );
}

export async function updateUserSkillsServer(
  userId: string,
  skillIds: string[],
): Promise<ApiResponse<void>> {
  const response = await fetchServer.patch<ApiResponse<void>, { skillIds: string[] }>(
    API_ENDPOINTS.users.skills(userId),
    { skillIds },
  );
  const res = response as { status?: boolean; message?: string } & ApiResponse<void>;
  if (res && res.status === false) {
    const message = res.message ?? "Failed to update user skills";
    throw new Error(message);
  }
  return response;
}