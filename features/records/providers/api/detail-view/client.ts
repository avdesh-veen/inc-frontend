/**
 * Provider Detail View - Client API
 * 
 * Client-side API functions for provider detail.
 * These functions run in the browser and can be used with TanStack Query.
 * 
 * TODO: Replace mock data with actual API calls when backend is ready
 */

import { getProviderById } from '@/lib/constants/mock-data/provider-data';
import type { Provider } from '../../types';

/**
 * Fetch provider detail by ID from client
 * 
 * TODO: Replace with actual API call
 * Example:
 * import { apiClient } from '@/lib/api/client';
 * import { API_ENDPOINTS } from '@/lib/api/endpoints';
 * import type { ApiResponse } from '@/lib/api/types';
 * 
 * return apiClient.get<ApiResponse<Provider>>(
 *   API_ENDPOINTS.providers.detail(id)
 * );
 */
export async function getProviderDetailClient(id: string): Promise<Provider | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Get provider from mock data
  return getProviderById(id) || null;
}

/**
 * Fetch provider activity logs from client
 * 
 * TODO: Replace with actual API call
 * Example:
 * return apiClient.get<ApiResponse<ProviderActivity[]>>(
 *   API_ENDPOINTS.providers.activity(id)
 * );
 */
export async function getProviderActivityClient(_id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Return mock activity data
  return [];
}

/**
 * Fetch provider documents from client
 * 
 * TODO: Replace with actual API call
 * Example:
 * return apiClient.get<ApiResponse<ProviderDocument[]>>(
 *   API_ENDPOINTS.providers.documents(id)
 * );
 */
export async function getProviderDocumentsClient(_id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Return mock documents data
  return [];
}
