import "server-only";

import { fetchServer } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { Client, ClientListItem, ClientRequest } from "../../types";

/**
 * Get clients list with filters
 */
export async function getClientsListServer(
  request?: ClientRequest,
): Promise<ApiResponse<PaginatedResponse<ClientListItem>>> {
  const queryParams: Record<string, string> = {};

  if (request?.page) queryParams.page = String(request.page);
  if (request?.limit) queryParams.limit = String(request.limit);
  if (request?.search) queryParams.search = String(request.search);
  if (request?.type) queryParams.type = String(request.type);
  if (request?.accountTier)
    queryParams.accountTier = String(request.accountTier);
  if (request?.portalAccess)
    queryParams.portalAccess = String(request.portalAccess);
  if (request?.sort && request.sort !== "")
    queryParams.sort = String(request.sort);

  // Include additional data for providers and estimated revenue
  if (!queryParams.include) {
    queryParams.include = "providers,estimatedRevenue";
  } else {
    queryParams.include += ",providers,estimatedRevenue";
  }

  return await fetchServer.get<ApiResponse<PaginatedResponse<ClientListItem>>>(
    API_ENDPOINTS.clients.list,
    { params: queryParams },
  );
}

/**
 * Get client by ID
 */
export async function getClientByIdServer(
  id: string,
): Promise<ApiResponse<Client>> {
  return await fetchServer.get<ApiResponse<Client>>(
    API_ENDPOINTS.clients.detail(id),
  );
}

/**
 * Get client statistics
 * TODO: Implement actual API call to fetch client stats
 */
// export async function getClientStatsServer(): Promise<{
//   totalClients: number;
//   activeClients: number;
//   totalRevenue: number;
//   avgHealthScore: number;
// }> {
//   // TODO: Replace with actual API call
//   // const response = await fetchServer.get(API_ENDPOINTS.clients.stats);

//   const { MOCK_CLIENTS } = await import("@/lib/constants/mock-data/client-data");

//   return {
//     totalClients: MOCK_CLIENTS.length,
//     activeClients: MOCK_CLIENTS.filter(c => c.s === "Active").length,
//     totalRevenue: MOCK_CLIENTS.reduce((sum, c) => sum + c.estimatedRevenue, 0),
//     avgHealthScore: Math.round(
//       MOCK_CLIENTS.reduce((sum, c) => sum + c.healthScore, 0) / MOCK_CLIENTS.length
//     ),
//   };
// }
