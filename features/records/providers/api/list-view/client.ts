/**
 * Provider List View - Client API
 * 
 * Client-side API functions for provider list.
 * These functions run in the browser and can be used with TanStack Query.
 * 
 * TODO: Replace mock data with actual API calls when backend is ready
 */

import { mockProviders, filterAndSortProviders, paginateProviders } from '@/lib/constants/mock-data/provider-data';
import type { ProviderListParams, ProviderListResponse } from '../../types';

/**
 * Fetch provider list from client
 * 
 * TODO: Replace with actual API call
 * Example:
 * import { apiClient } from '@/lib/api/client';
 * import { API_ENDPOINTS } from '@/lib/api/endpoints';
 * import type { ApiResponse, PaginatedResponse } from '@/lib/api/types';
 * 
 * return apiClient.get<ApiResponse<PaginatedResponse<Provider>>>(
 *   API_ENDPOINTS.providers.list,
 *   { params: request as Record<string, unknown> }
 * );
 */
export async function getProvidersListClient(
  params?: ProviderListParams
): Promise<ProviderListResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

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
    params?.page || 1,
    params?.limit || 25
  );

  return {
    providers,
    pagination,
  };
}

/**
 * Fetch provider statistics from client
 * 
 * TODO: Replace with actual API call
 * Example:
 * return apiClient.get<ApiResponse<ProviderStats>>(
 *   API_ENDPOINTS.providers.stats
 * );
 */
export async function getProvidersStatsClient() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

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
