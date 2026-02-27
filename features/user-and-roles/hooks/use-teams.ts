import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { Team, TeamLeadManager, TeamRequest, TeamStats } from "../types/team-tab";
import {
  getTeamLeadsManagersClient,
  getTeamsListClient,
  getTeamsStatsClient,
} from "../api/team-tab/client";

export function useTeamList(request?: TeamRequest) {
  return useQuery<ApiResponse<PaginatedResponse<Team>>, Error>({
    queryKey: queryKeys.usersRoles.teams.list(request),
    queryFn: () => getTeamsListClient(request),
  });
}

export function useTeamStats() {
  return useQuery<ApiResponse<TeamStats>, Error>({
    queryKey: queryKeys.usersRoles.teams.stats(),
    queryFn: () => getTeamsStatsClient(),
  });
}

export function useTeamLeadsManagers() {
  return useQuery<ApiResponse<PaginatedResponse<TeamLeadManager>>, Error>({
    queryKey: queryKeys.usersRoles.teams.leadsManagers(),
    queryFn: () => getTeamLeadsManagersClient(),
  });
}
