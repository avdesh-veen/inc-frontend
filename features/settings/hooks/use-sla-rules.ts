/**
 * SLA Rules Custom Hooks
 * 
 * TanStack Query hooks for managing SLA rules data and mutations.
 * These hooks provide data fetching, caching, and mutation capabilities.
 * 
 * Pattern: Follows the same architecture as trigger-events and assignment hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { queryKeys } from '@/lib/queries/query-keys';
import type { ApiResponse, PaginatedResponse } from '@/lib/api/types';
import type {
  SLATarget,
  SLATargetRequest,
  SLAOverride,
  SLAOverrideRequest,
  EscalationRules,
  FPRMetrics,
  SLATargetFormData,
  SLAOverrideFormData,
  ClientDropdownItem,
  PayerDropdownItem,
} from '@/features/settings/types/sla-rules';

// Import client API functions
import {
  getSLATargetsClient,
  getSLAOverridesClient,
  getSLAClientsDropdownClient,
  getSLAPayersDropdownClient,
  getEscalationRulesClient,
  getFPRMetricsClient,
} from '@/features/settings/api/sla-rules/client';

// Import server actions
import {
  createSLATargetAction,
  updateSLATargetAction,
  deleteSLATargetAction,
  createSLAOverrideAction,
  updateSLAOverrideAction,
  deleteSLAOverrideAction,
  updateEscalationRulesAction,
  updateFPRMetricsAction,
} from '@/features/settings/api/sla-rules/actions';

// Export query keys for use in boundary components
export const slaRulesKeys = queryKeys.settings.slaRules;

// ============================================================================
// SLA Targets Hooks
// ============================================================================

/**
 * Hook to fetch SLA targets list with pagination
 * 
 * @param request - Optional request parameters for filtering, sorting, and pagination
 * @returns Query hook with paginated SLA targets data
 */
export function useSLATargets(request?: SLATargetRequest) {
  return useQuery<ApiResponse<PaginatedResponse<SLATarget>>, Error>({
    queryKey: slaRulesKeys.targets.list(request as Record<string, unknown>),
    queryFn: () => getSLATargetsClient(request),
  });
}

/**
 * Hook to create a new SLA target
 * 
 * @returns Mutation hook for creating SLA target
 */
export function useCreateSLATarget() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<SLATarget | undefined>, Error, SLATargetFormData>({
    mutationFn: async (formData) => {
      const result = await createSLATargetAction(formData);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(', ') : result.message
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.targets.list(),
      });
      toast({
        title: 'SLA target created successfully',
        description: Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message,
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: 'Failed to create SLA target',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an existing SLA target
 * 
 * @returns Mutation hook for updating SLA target
 */
export function useUpdateSLATarget() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<SLATarget | undefined>, Error, { id: string; data: Partial<SLATarget> }>({
    mutationFn: async ({ id, data }) => {
      const result = await updateSLATargetAction(id, data);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(', ') : result.message
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.targets.list(),
      });
      toast({
        title: 'SLA target updated successfully',
        description: Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message,
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: 'Failed to update SLA target',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete an SLA target
 * 
 * @returns Mutation hook for deleting SLA target
 */
export function useDeleteSLATarget() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (targetId: string) => {
      const result = await deleteSLATargetAction(targetId);
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to delete SLA target');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.targets.list(),
      });
      toast({
        title: 'SLA target deleted',
        description: 'SLA target has been deleted successfully',
      });
    },
    onError: (error) => {
      logger('Error deleting SLA target:', { error: error.message });
      toast({
        title: 'Failed to delete SLA target',
        description: error.message ?? 'Failed to delete SLA target',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// SLA Overrides Hooks
// ============================================================================

/**
 * Hook to fetch SLA overrides list with pagination
 * 
 * @param request - Optional request parameters for pagination
 * @returns Query hook with paginated SLA overrides data
 */
export function useSLAOverrides(request?: SLAOverrideRequest) {
  return useQuery<ApiResponse<PaginatedResponse<SLAOverride>>, Error>({
    queryKey: slaRulesKeys.overrides.list(request as Record<string, unknown>),
    queryFn: () => getSLAOverridesClient(request),
  });
}

/**
 * Hook to fetch clients dropdown for SLA overrides
 */
export function useSLAClientsDropdown() {
  return useQuery<ApiResponse<PaginatedResponse<ClientDropdownItem>>, Error>({
    queryKey: slaRulesKeys.clientsDropdown(),
    queryFn: getSLAClientsDropdownClient,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch payers dropdown for SLA overrides
 */
export function useSLAPayersDropdown() {
  return useQuery<ApiResponse<PaginatedResponse<PayerDropdownItem>>, Error>({
    queryKey: slaRulesKeys.payersDropdown(),
    queryFn: getSLAPayersDropdownClient,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new SLA override
 * 
 * @returns Mutation hook for creating SLA override
 */
export function useCreateSLAOverride() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<SLAOverride | undefined>, Error, SLAOverrideFormData>({
    mutationFn: async (formData) => {
      const result = await createSLAOverrideAction(formData);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(', ') : result.message
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.overrides.list(),
      });
      toast({
        title: 'SLA override created successfully',
        description: Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message,
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: 'Failed to create SLA override',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an existing SLA override
 * 
 * @returns Mutation hook for updating SLA override
 */
export function useUpdateSLAOverride() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<SLAOverride | undefined>, Error, { id: string; data: Partial<SLAOverride> }>({
    mutationFn: async ({ id, data }) => {
      const result = await updateSLAOverrideAction(id, data);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(', ') : result.message
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.overrides.list(),
      });
      toast({
        title: 'SLA override updated successfully',
        description: Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message,
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: 'Failed to update SLA override',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete an SLA override
 * 
 * @returns Mutation hook for deleting SLA override
 */
export function useDeleteSLAOverride() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (overrideId: string) => {
      const result = await deleteSLAOverrideAction(overrideId);
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to delete SLA override');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.overrides.list(),
      });
      toast({
        title: 'SLA override deleted',
        description: 'SLA override has been deleted successfully',
      });
    },
    onError: (error) => {
      logger('Error deleting SLA override:', { error: error.message });
      toast({
        title: 'Failed to delete SLA override',
        description: error.message ?? 'Failed to delete SLA override',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// Escalation Rules Hooks
// ============================================================================

/**
 * Hook to fetch escalation rules
 * 
 * @returns Query hook with escalation rules data
 */
export function useEscalationRules() {
  return useQuery<EscalationRules[], Error>({
    queryKey: slaRulesKeys.escalationRules(),
    queryFn: getEscalationRulesClient,
  });
}

/**
 * Hook to update escalation rules
 * 
 * @returns Mutation hook for updating escalation rules
 */
export function useUpdateEscalationRules() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    { id: string; status: boolean },
    unknown
  >({
    mutationFn: async (data: { id: string; status: boolean }) => {
      const result = await updateEscalationRulesAction(data.id, data.status);
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to update escalation rules');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.escalationRules(),
      });
      toast({
        title: 'Escalation rules updated',
        description: 'Escalation rules have been updated successfully',
      });
    },
    onError: (error) => {
      logger('Error updating escalation rules:', { error: error.message });
      toast({
        title: 'Failed to update escalation rules',
        description: error.message ?? 'Failed to update escalation rules',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// FPR Metrics Hooks
// ============================================================================

/**
 * Hook to fetch FPR metrics
 * 
 * @returns Query hook with FPR metrics data
 */
export function useFPRMetrics() {
  return useQuery<FPRMetrics, Error>({
    queryKey: slaRulesKeys.fprMetrics(),
    queryFn: getFPRMetricsClient,
  });
}

/**
 * Hook to update FPR metrics
 * 
 * @returns Mutation hook for updating FPR metrics
 */
export function useUpdateFPRMetrics() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    { id: string; data: Partial<FPRMetrics> },
    unknown
  >({
    mutationFn: async ({ id, data }) => {
      const result = await updateFPRMetricsAction(id, data);
      if (!result.success) {
        throw new Error(result.error ?? 'Failed to update FPR metrics');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: slaRulesKeys.fprMetrics(),
      });
      toast({
        title: 'FPR metrics updated',
        description: 'FPR metrics have been updated successfully',
      });
    },
    onError: (error) => {
      logger('Error updating FPR metrics:', { error: error.message });
      toast({
        title: 'Failed to update FPR metrics',
        description: error.message ?? 'Failed to update FPR metrics',
        variant: 'destructive',
      });
    },
  });
}
