import "server-only";

import { PaginatedResponse, ApiResponse } from "@/lib/api/types";
import { User, UserRequest, UserStats } from "../../types/user-tab";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";

export async function getUsersListServer(
  request?: UserRequest,
): Promise<ApiResponse<PaginatedResponse<User>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<User>>>(
    API_ENDPOINTS.users.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

export async function getUsersStatsServer(): Promise<ApiResponse<UserStats>> {
  return fetchServer.get<ApiResponse<UserStats>>(API_ENDPOINTS.users.stats);
}

export async function getLeadershipUsersServer(
  request?: { page?: number; limit?: number },
): Promise<ApiResponse<PaginatedResponse<User>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<User>>>(
    API_ENDPOINTS.users.leadership,
    {
      params: request as Record<string, unknown>,
    },
  );
}
