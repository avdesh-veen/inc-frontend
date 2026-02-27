/**
 * Provider Detail View - Server API
 * 
 * Server-side data fetching functions for provider detail.
 * Uses 'server-only' to ensure this code only runs on the server.
 * 
 * TODO: Replace mock data with actual API calls when backend is ready
 */

import "server-only";

import { getProviderById } from '@/lib/constants/mock-data/provider-data';
import type { Provider } from '../../types';

/**
 * Fetch provider detail by ID from server
 * 
 * TODO: Replace with actual API call
 * Example:
 * import { fetchServer } from '@/lib/api/server';
 * import { API_ENDPOINTS } from '@/lib/api/endpoints';
 * import type { ApiResponse } from '@/lib/api/types';
 * 
 * return fetchServer.get<ApiResponse<Provider>>(
 *   API_ENDPOINTS.providers.detail(id)
 * );
 */
export async function getProviderDetailServer(id: string): Promise<Provider | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get provider from mock data
  return getProviderById(id) || null;
}

/**
 * Fetch provider activity logs from server
 * 
 * TODO: Replace with actual API call
 * Example:
 * return fetchServer.get<ApiResponse<ProviderActivity[]>>(
 *   API_ENDPOINTS.providers.activity(id)
 * );
 */
export async function getProviderActivityServer(_id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Return mock activity data
  return [];
}

/**
 * Fetch provider documents from server
 * 
 * TODO: Replace with actual API call
 * Example:
 * return fetchServer.get<ApiResponse<ProviderDocument[]>>(
 *   API_ENDPOINTS.providers.documents(id)
 * );
 */
export async function getProviderDocumentsServer(_id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Return mock documents data
  return [];
}
