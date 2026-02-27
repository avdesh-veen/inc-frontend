import "server-only";

import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchServer } from "@/lib/api/server";
import {
  TriggerEvent,
  TriggerEventRequest,
  TriggerEventsStats,
} from "@/features/settings/types/trigger-events";
import { TriggerEventFormData } from "@/features/settings/validations/trigger-events-schemas";

/**
 * Fetch all trigger events from the server
 *
 * @returns Promise with trigger events list
 */
export async function getTriggerEventsListServer(
  request?: TriggerEventRequest,
): Promise<ApiResponse<PaginatedResponse<TriggerEvent>>> {
  return fetchServer.get<ApiResponse<PaginatedResponse<TriggerEvent>>>(
    API_ENDPOINTS.triggerEvents.list,
    {
      params: request as Record<string, unknown>,
    },
  );
}

/**
 * Fetch trigger events for assignment routing display
 * Returns only active events for the routing rules page
 *
 * @returns Promise with active trigger events
 */
export async function getAssignmentTriggerEventsServer(): Promise<TriggerEvent[]> {
  const response = await fetchServer.get<ApiResponse<PaginatedResponse<TriggerEvent>>>(
    API_ENDPOINTS.triggerEvents.list,
    {
      params: {
        page: 1,
        limit: 50,
        isActive: true,
      } as Record<string, unknown>,
    },
  );
  
  return response.data?.items || [];
}

export async function getTriggerEventsStatsServer(): Promise<ApiResponse<TriggerEventsStats>> {
  return fetchServer.get<ApiResponse<TriggerEventsStats>>(API_ENDPOINTS.triggerEvents.stats);
}

/**
 * Fetch a single trigger event by ID from the server
 *
 * @param id - Trigger event ID
 * @returns Promise with trigger event details
 */
export async function getTriggerEventByIdServer(
  id: string,
): Promise<ApiResponse<TriggerEvent>> {
  return fetchServer.get<ApiResponse<TriggerEvent>>(
    API_ENDPOINTS.triggerEvents.detail(id),
  );
}

/**
 * Create a new trigger event on the server
 *
 * @param data - Trigger event form data
 * @returns Promise with created trigger event
 */
export async function createTriggerEventServer(
  data: TriggerEventFormData,
): Promise<ApiResponse<TriggerEvent>> {
  const res = await fetchServer.post<ApiResponse<TriggerEvent>>(
    API_ENDPOINTS.triggerEvents.create,
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Create trigger event failed";
    }
    throw new Error(msg);
  }
  return res;
}

/**
 * Update an existing trigger event on the server
 *
 * @param id - Trigger event ID
 * @param data - Partial trigger event form data
 * @returns Promise with updated trigger event
 */
export async function updateTriggerEventServer(
  id: string,
  data: Partial<TriggerEventFormData>,
): Promise<ApiResponse<TriggerEvent>> {
  const res = await fetchServer.patch<ApiResponse<TriggerEvent>>(
    API_ENDPOINTS.triggerEvents.update(id),
    data as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Update trigger event failed";
    }
    throw new Error(msg);
  }
  return res;
}

/**
 * Delete a trigger event on the server
 *
 * @param id - Trigger event ID
 * @returns Promise with deletion confirmation
 */
export async function deleteTriggerEventServer(
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchServer.delete<ApiResponse<{ success: boolean }>>(
    API_ENDPOINTS.triggerEvents.delete(id),
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Delete trigger event failed";
    }
    throw new Error(msg);
  }
  return res as ApiResponse<{ success: boolean }>;
}

/**
 * Toggle trigger event active status on the server
 *
 * @param id - Trigger event ID
 * @param isActive - New active status
 * @returns Promise with updated trigger event
 */
export async function toggleTriggerEventStatusServer(
  id: string,
  isActive: boolean,
): Promise<ApiResponse<TriggerEvent>> {
  const res = await fetchServer.patch<ApiResponse<TriggerEvent>>(
    API_ENDPOINTS.triggerEvents.toggle(id),
    { isActive } as unknown as BodyInit,
  );
  if (res && typeof res === "object" && "status" in res && res.status === false) {
    const raw = res.message;
    let msg: string;
    if (typeof raw === "string") {
      msg = raw;
    } else if (Array.isArray(raw)) {
      msg = raw.join(", ");
    } else {
      msg = "Toggle trigger event status failed";
    }
    throw new Error(msg);
  }
  return res;
}
