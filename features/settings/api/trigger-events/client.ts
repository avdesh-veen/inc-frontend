import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import {
  TriggerEvent,
  TriggerEventsStats,
  TriggerEventRequest,
} from "@/features/settings/types/trigger-events";

/**
 * Fetch all trigger events from the client
 *
 * @returns Promise with trigger events list
 */
export async function getTriggerEventsListClient(request?: TriggerEventRequest): Promise<
  ApiResponse<PaginatedResponse<TriggerEvent>>
> {
  return apiClient.get<ApiResponse<PaginatedResponse<TriggerEvent>>>(
    API_ENDPOINTS.triggerEvents.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch trigger events statistics from the client
 *
 * @returns Promise with trigger events stats
 */
export async function getTriggerEventStatsClient(): Promise<
  ApiResponse<TriggerEventsStats>
> {
  return apiClient.get<ApiResponse<TriggerEventsStats>>(
    API_ENDPOINTS.triggerEvents.stats,
  );
}

/**
 * Fetch a single trigger event by ID from the client
 *
 * @param id - Trigger event ID
 * @returns Promise with trigger event details
 */
export async function getTriggerEventByIdClient(
  id: string,
): Promise<ApiResponse<TriggerEvent>> {
  return apiClient.get<ApiResponse<TriggerEvent>>(
    API_ENDPOINTS.triggerEvents.detail(id),
  );
}
