import "server-only";

import { PaginatedResponse, ApiResponse } from "@/lib/api/types";
import {
  Team,
  TeamRequest,
  TeamStats,
  CreateTeamPayload,
  UpdateTeamPayload,
  TeamLeadManager,
} from "../../types/team-tab";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";

export async function getTeamsListServer(
  request?: TeamRequest,
): Promise<ApiResponse<PaginatedResponse<Team>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<Team>>>(
    API_ENDPOINTS.teams.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

export async function getTeamLeadsManagersServer(): Promise<ApiResponse<PaginatedResponse<TeamLeadManager>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<TeamLeadManager>>>(
    API_ENDPOINTS.users.leadsManagers,
  );
}

/** API response shape: totalTeams, totalMembers, averageTeamSize, activeTeams */
interface TeamStatsApi {
  totalTeams?: number;
  totalMembers?: number;
  averageTeamSize?: number;
  activeTeams?: number;
}

function mapStatsApiToTeamStats(data: TeamStatsApi | null): TeamStats | null {
  if (!data) return null;
  return {
    total: data.totalTeams ?? 0,
    totalMembers: data.totalMembers ?? 0,
    avgTeamSize: data.averageTeamSize ?? 0,
    active: data.activeTeams ?? 0,
  };
}

export async function getTeamsStatsServer(): Promise<ApiResponse<TeamStats>> {
  const res = await fetchServer.get<ApiResponse<TeamStatsApi>>(
    API_ENDPOINTS.teams.stats
  );
  const mapped = mapStatsApiToTeamStats(res.data);
  return {
    ...res,
    data: mapped ?? { total: 0, totalMembers: 0, avgTeamSize: 0, active: 0 },
  };
}

export async function createTeamServer(
  payload: CreateTeamPayload
): Promise<ApiResponse<Team>> {
  const res = await fetchServer.post<ApiResponse<Team>>(
    API_ENDPOINTS.teams.list,
    payload as unknown as BodyInit
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = (res as ApiResponse<Team>).message;
    const msg =
      typeof raw === "string"
        ? raw
        : Array.isArray(raw)
          ? raw.join(", ")
          : "Create team failed";
    throw new Error(msg);
  }
  return res as ApiResponse<Team>;
}

export async function updateTeamServer(
  teamId: string,
  payload: Partial<UpdateTeamPayload>,
): Promise<ApiResponse<Team>> {
  const res = await fetchServer.patch<ApiResponse<Team>>(
    API_ENDPOINTS.teams.byId(teamId),
    payload as unknown as BodyInit
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = (res as ApiResponse<Team>).message;
    const msg =
      typeof raw === "string"
        ? raw
        : Array.isArray(raw)
          ? raw.join(", ")
          : "Update team failed";
    throw new Error(msg);
  }
  return res as ApiResponse<Team>;
}

