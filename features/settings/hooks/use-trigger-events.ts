import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import {
  TriggerEvent,
  TriggerEventsStats,
} from "@/features/settings/types/trigger-events";
import {
  getTriggerEventsListClient,
  getTriggerEventStatsClient,
  getTriggerEventByIdClient,
} from "../api/trigger-events/client";
import { TriggerEventFormData } from "../validations/trigger-events-schemas";
import {
  createTriggerEventAction,
  updateTriggerEventAction,
  deleteTriggerEventAction,
  toggleTriggerEventStatusAction,
} from "../api/trigger-events/actions";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

/**
 * Hook to fetch trigger events list
 *
 * @returns Query hook with trigger events list data
 */
export function useTriggerEventsList(request?: Record<string, unknown>) {
  return useQuery<ApiResponse<PaginatedResponse<TriggerEvent>>, Error>({
    queryKey: queryKeys.triggerEvents.list(request),
    queryFn: () => getTriggerEventsListClient(request),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch trigger events statistics
 *
 * @returns Query hook with trigger events stats data
 */
export function useTriggerEventsStats() {
  return useQuery<ApiResponse<TriggerEventsStats>, Error>({
    queryKey: queryKeys.triggerEvents.stats(),
    queryFn: getTriggerEventStatsClient,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch single trigger event details
 *
 * @param id - Trigger event ID
 * @returns Query hook with trigger event detail data
 */
export function useTriggerEventDetail(id: string) {
  return useQuery<ApiResponse<TriggerEvent>, Error>({
    queryKey: queryKeys.triggerEvents.detail(id),
    queryFn: () => getTriggerEventByIdClient(id),
    enabled: !!id, // Only fetch when id is provided
  });
}

/**
 * Hook to create a new trigger event
 *
 * @returns Mutation hook for creating trigger event
 */
export function useCreateTriggerEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    TriggerEventFormData,
    unknown
  >({
    mutationFn: async (data: TriggerEventFormData) => {
      const result = await createTriggerEventAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch list and stats
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.triggerEvents.all, "list"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.triggerEvents.stats(),
      });
      toast({
        title: "Trigger event created successfully",
        description: "Trigger event has been created successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to create trigger event",
        description: error.message || "Failed to create trigger event",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing trigger event
 *
 * @returns Mutation hook for updating trigger event
 */
export function useUpdateTriggerEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    { id: string; data: Partial<TriggerEventFormData> },
    unknown
  >({
    mutationFn: async ({ id, data }) => {
      const result = await updateTriggerEventAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate list, stats, and the specific detail
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.triggerEvents.all, "list"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.triggerEvents.stats(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.triggerEvents.detail(variables.id),
      });
      toast({
        title: "Trigger event updated successfully",
        description: "Trigger event has been updated successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update trigger event",
        description: error.message || "Failed to update trigger event",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a trigger event
 *
 * @returns Mutation hook for deleting trigger event
 */
export function useDeleteTriggerEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    string,
    unknown
  >({
    mutationFn: async (eventId: string) => {
      const result = await deleteTriggerEventAction(eventId);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.triggerEvents.all, "list"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.triggerEvents.stats(),
      });
      toast({
        title: "Trigger event deleted successfully",
        description: "Trigger event has been deleted successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete trigger event",
        description: error.message || "Failed to delete trigger event",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to toggle trigger event active status
 *
 * @returns Mutation hook for toggling trigger event status
 */
export function useToggleTriggerEventStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    { id: string; isActive: boolean },
    unknown
  >({
    mutationFn: async ({ id, isActive }) => {
      const result = await toggleTriggerEventStatusAction(id, isActive);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: (_, { id: eventId, isActive }) => {
      // Invalidate queries to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.triggerEvents.all, "list"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.triggerEvents.stats(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.triggerEvents.detail(eventId),
      });

      const status = isActive ? "activated" : "deactivated";
      toast({
        title: `Trigger event ${status} successfully`,
        description: `Trigger event has been ${status} successfully`,
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update trigger event status",
        description: error.message || "Failed to update trigger event status",
        variant: "destructive",
      });
    },
  });
}
