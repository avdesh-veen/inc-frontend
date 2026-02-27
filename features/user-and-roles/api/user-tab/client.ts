import { PaginatedResponse, ApiResponse } from "@/lib/api/types";
import { User, UserRequest, UserStats } from "../../types/user-tab";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";

export async function getUsersListClient(
  request?: UserRequest,
): Promise<ApiResponse<PaginatedResponse<User>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<User>>>(
    API_ENDPOINTS.users.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

export async function getUsersStatsClient(): Promise<ApiResponse<UserStats>> {
  return apiClient.get<ApiResponse<UserStats>>(API_ENDPOINTS.users.stats);
}

export async function getLeadershipUsersClient(
  request?: { page?: number; limit?: number },
): Promise<ApiResponse<PaginatedResponse<User>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<User>>>(
    API_ENDPOINTS.users.leadership,
    {
      params: request as Record<string, unknown>,
    },
  );
}