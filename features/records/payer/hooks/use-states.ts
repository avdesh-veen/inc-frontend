"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { StateItem, StateRequest } from "../types";
import { getStatesAction } from "../api/states/actions";

/**
 * Hook to fetch paginated states list
 *
 * Uses a server action as the query function so the fetch always
 * occurs on the server, never directly from the browser.
 *
 * @param request - Optional query parameters (page, limit, search)
 * @returns TanStack Query result with paginated states
 */
export function useStatesList(request?: StateRequest) {
  return useQuery<ApiResponse<PaginatedResponse<StateItem>>, Error>({
    queryKey: queryKeys.states.list(request),
    queryFn: () => getStatesAction(request),
    staleTime: 1000 * 60 * 10,
  });
}
