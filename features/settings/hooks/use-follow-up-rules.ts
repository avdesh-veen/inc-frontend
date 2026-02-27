"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import {
  getFollowUpRulesClient,
  getFollowUpRuleClient,
  getFollowUpRulesPayersDropdownClient,
  getFollowUpRulesTriggerEventsDropdownClient,
  getFollowUpRulesStatesDropdownClient,
  getFollowUpRulesStatisticsClient,
} from "../api/follow-up-rules/client";
import {
  createFollowUpRuleAction,
  updateFollowUpRuleAction,
  deleteFollowUpRuleAction,
  toggleFollowUpRuleStatusAction,
} from "../api/follow-up-rules/actions";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import type {
  FollowUpRule,
  FollowUpRulesRequest,
  FollowUpRuleDetail,
  CreateFollowUpRulePayload,
  FollowUpRuleDropdownItem,
  FollowUpRulesStatistics,
} from "@/features/settings/types";

export function useFollowUpRules(request?: FollowUpRulesRequest) {
  return useQuery<
    ApiResponse<PaginatedResponse<FollowUpRule>>,
    Error
  >({
    queryKey: queryKeys.settings.followUpRules.list(request),
    queryFn: () => getFollowUpRulesClient(request),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFollowUpRule(id: string | null) {
  return useQuery<
    ApiResponse<FollowUpRuleDetail & { id: string }>,
    Error
  >({
    queryKey: queryKeys.settings.followUpRules.detail(id ?? ""),
    queryFn: () => getFollowUpRuleClient(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateFollowUpRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<{ success: true }, Error, CreateFollowUpRulePayload>({
    mutationFn: async (payload) => {
      const result = await createFollowUpRuleAction(payload);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.settings.all, "follow-up-rules"],
      });
      toast({
        title: "Follow-up rule created successfully",
        description: "Follow-up rule has been created successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to create follow-up rule",
        description: error.message || "Failed to create follow-up rule",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFollowUpRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    { success: true },
    Error,
    { id: string; payload: CreateFollowUpRulePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const result = await updateFollowUpRuleAction(id, payload);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.settings.all, "follow-up-rules"],
      });
      toast({
        title: "Follow-up rule updated successfully",
        description: "Follow-up rule has been updated successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update follow-up rule",
        description: error.message || "Failed to update follow-up rule",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteFollowUpRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<{ success: true }, Error, string>({
    mutationFn: async (id) => {
      const result = await deleteFollowUpRuleAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.settings.all, "follow-up-rules"],
      });
      toast({
        title: "Follow-up rule deleted successfully",
        description: "Follow-up rule has been deleted successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete follow-up rule",
        description: error.message || "Failed to delete follow-up rule",
        variant: "destructive",
      });
    },
  });
}

export function useToggleFollowUpRuleStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    { success: true },
    Error,
    { id: string; isActive: boolean }
  >({
    mutationFn: async ({ id, isActive }) => {
      const result = await toggleFollowUpRuleStatusAction(id, isActive);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.settings.all, "follow-up-rules"],
      });
      const status = isActive ? "activated" : "deactivated";
      toast({
        title: `Follow-up rule ${status} successfully`,
        description: `Follow-up rule has been ${status} successfully`,
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update follow-up rule status",
        description: error.message || "Failed to update follow-up rule status",
        variant: "destructive",
      });
    },
  });
}

function normalizeDropdownData(
  data: FollowUpRuleDropdownItem[] | { items?: FollowUpRuleDropdownItem[] } | undefined,
): FollowUpRuleDropdownItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return (data as { items?: FollowUpRuleDropdownItem[] }).items ?? [];
}

export function useFollowUpRulesPayersDropdown() {
  return useQuery<ApiResponse<FollowUpRuleDropdownItem[]>, Error>({
    queryKey: queryKeys.settings.followUpRules.payersDropdown(),
    queryFn: getFollowUpRulesPayersDropdownClient,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFollowUpRulesTriggerEventsDropdown() {
  return useQuery<ApiResponse<FollowUpRuleDropdownItem[]>, Error>({
    queryKey: queryKeys.settings.followUpRules.triggerEventsDropdown(),
    queryFn: getFollowUpRulesTriggerEventsDropdownClient,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFollowUpRulesStatesDropdown() {
  return useQuery<ApiResponse<FollowUpRuleDropdownItem[]>, Error>({
    queryKey: queryKeys.settings.followUpRules.statesDropdown(),
    queryFn: getFollowUpRulesStatesDropdownClient,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFollowUpRulesStatistics() {
  return useQuery<ApiResponse<FollowUpRulesStatistics>, Error>({
    queryKey: queryKeys.settings.followUpRules.statistics(),
    queryFn: getFollowUpRulesStatisticsClient,
    staleTime: 60 * 1000,
  });
}

export function useFollowUpRulesPayersOptions() {
  const query = useFollowUpRulesPayersDropdown();
  const raw = query.data?.data;
  const options = normalizeDropdownData(raw);
  return { ...query, options };
}

export function useFollowUpRulesTriggerEventsOptions() {
  const query = useFollowUpRulesTriggerEventsDropdown();
  const raw = query.data?.data;
  const options = normalizeDropdownData(raw);
  return { ...query, options };
}

export function useFollowUpRulesStatesOptions() {
  const query = useFollowUpRulesStatesDropdown();
  const raw = query.data?.data;
  const options = normalizeDropdownData(raw);
  return { ...query, options };
}
