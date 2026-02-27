/**
 * Client-side API functions and TanStack Query hooks for clients
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { Client, ClientListItem, ClientRequest } from "../../types";

/**
 * Fetch clients list (client-side)
 */
export async function getClientsListClient(request?: ClientRequest): Promise<ApiResponse<PaginatedResponse<ClientListItem>>> {
  const queryParams: Record<string, string> = {};
  
  if (request?.page) queryParams.page = String(request.page);
  if (request?.limit) queryParams.limit = String(request.limit);
  if (request?.search) queryParams.search = String(request.search);
  if (request?.type) queryParams.type = String(request.type);
  if (request?.accountTier) queryParams.accountTier = String(request.accountTier);
  if (request?.portalAccess) queryParams.portalAccess = String(request.portalAccess);
  if (request?.sort && request.sort !== '') queryParams.sort = String(request.sort);
  
  return await apiClient.get<ApiResponse<PaginatedResponse<ClientListItem>>>(
    API_ENDPOINTS.clients.list, 
    { params: queryParams }
  );
}

/**
 * Fetch client by ID (client-side)
 */
export async function getClientByIdClient(id: string): Promise<ApiResponse<Client>> {
  return await apiClient.get<ApiResponse<Client>>(API_ENDPOINTS.clients.detail(id));
}

/**
 * Fetch client statistics (client-side)
 * TODO: Implement actual API call
 */
async function getClientStatsClient(): Promise<{
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  avgHealthScore: number;
}> {
  // TODO: Replace with actual API call
  // const response = await apiClient.get(API_ENDPOINTS.clients.stats);
  
  return {
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    avgHealthScore: 0,
  };
}

/**
 * TanStack Query hook for clients list
 */
export function useClients(request?: ClientRequest) {
  return useQuery({
    queryKey: queryKeys.clients.list(request),
    queryFn: () => getClientsListClient(request),
  });
}

/**
 * TanStack Query hook for single client
 */
export function useClient(id: string) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => getClientByIdClient(id),
    enabled: !!id,
  });
}

/**
 * TanStack Query hook for client statistics
 */
export function useClientStats() {
  return useQuery({
    queryKey: queryKeys.clients.stats(),
    queryFn: () => getClientStatsClient(),
  });
}
