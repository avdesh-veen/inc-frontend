import { PaginatedResponse, ApiResponse } from "@/lib/api/types";
import { Team, TeamLeadManager, TeamRequest, TeamStats } from "../../types/team-tab";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";

/** API response shape: totalTeams, totalMembers, averageTeamSize, activeTeams */
interface TeamStatsApi {
  totalTeams?: number;
  totalMembers?: number;
  averageTeamSize?: number;
  activeTeams?: number;
}

function mapStatsApiToTeamStats(data: TeamStatsApi | null): TeamStats {
  if (!data) return { total: 0, totalMembers: 0, avgTeamSize: 0, active: 0 };
  return {
    total: data.totalTeams ?? 0,
    totalMembers: data.totalMembers ?? 0,
    avgTeamSize: data.averageTeamSize ?? 0,
    active: data.activeTeams ?? 0,
  };
}

export async function getTeamsListClient(
  request?: TeamRequest,
): Promise<ApiResponse<PaginatedResponse<Team>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<Team>>>(
    API_ENDPOINTS.teams.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

export async function getTeamsStatsClient(): Promise<ApiResponse<TeamStats>> {
  const res = await apiClient.get<ApiResponse<TeamStatsApi>>(
    API_ENDPOINTS.teams.stats
  );
  return { ...res, data: mapStatsApiToTeamStats(res.data) };
}

export async function getTeamLeadsManagersClient(): Promise<ApiResponse<PaginatedResponse<TeamLeadManager>>> {
  return apiClient.get<ApiResponse<PaginatedResponse<TeamLeadManager>>>(
    API_ENDPOINTS.users.leadsManagers,
  );
}