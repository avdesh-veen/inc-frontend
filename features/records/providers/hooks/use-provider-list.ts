/**
 * Provider List Hook
 * 
 * TanStack Query hook for fetching provider list data.
 * Uses the API layer for data fetching.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getProvidersListClient, getProvidersStatsClient } from '../api/list-view/client';
import type { ProviderListParams } from '../types';

// Query keys for provider list
export const providerListKeys = {
  all: ['providers', 'list'] as const,
  filtered: (params: ProviderListParams) => [...providerListKeys.all, params] as const,
  stats: () => ['providers', 'stats'] as const,
};

/**
 * Hook to fetch provider list with filters and pagination
 */
export function useProviderList(params?: ProviderListParams) {
  return useQuery({
    queryKey: providerListKeys.filtered(params || {}),
    queryFn: () => getProvidersListClient(params),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch provider statistics
 */
export function useProviderStats() {
  return useQuery({
    queryKey: providerListKeys.stats(),
    queryFn: () => getProvidersStatsClient(),
    staleTime: 60000, // 1 minute
  });
}
