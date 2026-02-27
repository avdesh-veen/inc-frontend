/**
 * Provider List View - Server API
 * 
 * Server-side data fetching functions for provider list.
 * Uses 'server-only' to ensure this code only runs on the server.
 * 
 * TODO: Replace mock data with actual API calls when backend is ready
 */

import "server-only";

import { mockProviders, filterAndSortProviders, paginateProviders } from '@/lib/constants/mock-data/provider-data';
import type {  ProviderListParams, ProviderListResponse } from '../../types';

/**
 * Fetch provider list from server
 * 
 * TODO: Replace with actual API call
 * Example:
 * import { fetchServer } from '@/lib/api/server';
 * import { API_ENDPOINTS } from '@/lib/api/endpoints';
 * import type { ApiResponse, PaginatedResponse } from '@/lib/api/types';
 * 
 * return fetchServer.get<ApiResponse<PaginatedResponse<Provider>>>(
 *   API_ENDPOINTS.providers.list,
 *   { params: request as Record<string, unknown> }
 * );
 */
export async function getProvidersListServer(
  params?: ProviderListParams
): Promise<ProviderListResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Filter and sort using mock data
  const filteredProviders = filterAndSortProviders(mockProviders, {
    search: params?.search,
    alert: params?.alert,
    clientId: params?.clientId,
    departmentId: params?.departmentId,
    businessEntityId: params?.businessEntityId,
    status: params?.status,
    sortBy: params?.sortBy,
    sortOrder: params?.sortOrder,
  });

  // Paginate results
  const { providers, pagination } = paginateProviders(
    filteredProviders,
    params?.page ?? 1,
    params?.limit ?? 25
  );

  return {
    providers,
    pagination,
  };
}

/**
 * Fetch provider statistics from server
 * 
 * TODO: Replace with actual API call
 * Example:
 * return fetchServer.get<ApiResponse<ProviderStats>>(
 *   API_ENDPOINTS.providers.stats
 * );
 */
export async function getProvidersStatsServer() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Calculate stats from mock data
  const activeCount = mockProviders.filter(p => p.status === 'Active').length;
  const pendingCount = mockProviders.filter(p => p.status === 'Pending').length;
  const totalCount = mockProviders.length;

  return {
    active: activeCount,
    pending: pendingCount,
    total: totalCount,
  };
}
