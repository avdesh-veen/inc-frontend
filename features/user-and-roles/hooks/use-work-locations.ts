import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { WorkLocation } from "../types/work-locations";
import { getWorkLocationsListClient } from "../api/work-locations/client";

export function useWorkLocations() {
  return useQuery<ApiResponse<PaginatedResponse<WorkLocation>>, Error>({
    queryKey: queryKeys.usersRoles.workLocations.list(),
    queryFn: () => getWorkLocationsListClient(),
  });
}
