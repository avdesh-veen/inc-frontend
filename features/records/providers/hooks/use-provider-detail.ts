/**
 * Provider Detail Hook
 * 
 * TanStack Query hook for fetching provider detail data.
 * Uses the API layer for data fetching.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  getProviderDetailClient, 
  getProviderActivityClient, 
  getProviderDocumentsClient 
} from '../api/detail-view/client';

// Query keys for provider detail
export const providerDetailKeys = {
  all: ['providers', 'detail'] as const,
  byId: (id: string) => [...providerDetailKeys.all, id] as const,
  activity: (id: string) => [...providerDetailKeys.byId(id), 'activity'] as const,
  documents: (id: string) => [...providerDetailKeys.byId(id), 'documents'] as const,
};

/**
 * Hook to fetch provider detail by ID
 */
export function useProviderDetail(id: string) {
  return useQuery({
    queryKey: providerDetailKeys.byId(id),
    queryFn: () => getProviderDetailClient(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch provider activity logs
 */
export function useProviderActivity(id: string) {
  return useQuery({
    queryKey: providerDetailKeys.activity(id),
    queryFn: () => getProviderActivityClient(id),
    enabled: !!id,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch provider documents
 */
export function useProviderDocuments(id: string) {
  return useQuery({
    queryKey: providerDetailKeys.documents(id),
    queryFn: () => getProviderDocumentsClient(id),
    enabled: !!id,
    staleTime: 30000, // 30 seconds
  });
}
