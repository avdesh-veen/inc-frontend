/**
 * Assignment Module Custom Hooks
 * 
 * TanStack Query hooks for managing assignment data and mutations.
 * These hooks provide data fetching, caching, and mutation capabilities.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { queryKeys } from '@/lib/queries/query-keys';
import type {
  AssignmentModeConfig,
  AssignmentMetrics,
  RoutingRule,
  SkillSet,
  CapacitySettings,
  AssignmentRule,
} from '@/features/settings/types/assignment';
import type {
  RoutingRuleFormData,
  CapacitySettingsFormData,
} from '@/features/settings/validations/assignment-schemas';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';

// Import client API functions
import {
  getAssignmentModesClient,
  getAssignmentMetricsClient,
} from '@/features/settings/api/assignment/assignment-mode/client';
import {
  getCapacitySettingsClient,
} from '@/features/settings/api/assignment/capacity/client';
import {
  getRoutingRulesClient,
  createRoutingRuleClient,
  updateRoutingRuleClient,
  deleteRoutingRuleClient,
} from '@/features/settings/api/assignment/routing-rules/client';
import { getSkillSetsClient } from '@/features/settings/api/assignment/skill-sets/client';

// Import server actions
import { updateAssignmentModeAction } from '@/features/settings/api/assignment/assignment-mode/actions';
import { updateCapacitySettingsAction } from '@/features/settings/api/assignment/capacity/actions';

// Export query keys for use in boundary components
export const assignmentKeys = queryKeys.assignment;

// ============================================================================
// Assignment Mode Hooks
// ============================================================================

/**
 * Hook to fetch all assignment modes
 */
export function useAssignmentModes() {
  return useQuery<AssignmentModeConfig[], Error>({
    queryKey: assignmentKeys.modes.list(),
    queryFn: getAssignmentModesClient,
  });
}

/**
 * Hook to get the active assignment mode
 */
export function useActiveAssignmentMode() {
  const { data: modes, ...rest } = useAssignmentModes();
  
  // Find the active mode
  const activeMode = modes?.find((mode) => mode.isActive);
  
  return {
    data: activeMode,
    ...rest,
  };
}

/**
 * Hook to update assignment mode preferences
 */
export function useUpdateAssignmentMode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<AssignmentModeConfig>,
    Error,
    { 
      id: string; 
      data: {
        considerAnalystAvailability?: boolean;
        preferRecentTaskAnalyst?: boolean;
        autoReassignOnAbsence?: boolean;
        clientAffinityEnabled?: boolean;
        isActive?: boolean;
      }
    },
    unknown
  >({
    mutationFn: async ({ id, data }) => {
      return await updateAssignmentModeAction(id, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.modes.list(),
      });
      const message = Array.isArray(response.message) ? response.message.join(', ') : response.message;
      toast({
        title: 'Settings saved',
        description: message || 'Assignment mode updated successfully',
      });
    },
    onError: (error) => {
      logger('Error updating assignment mode:', { error: error.message });
      toast({
        title: 'Failed to save settings',
        description: error.message || 'Failed to update assignment mode',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// Assignment Metrics Hooks
// ============================================================================

/**
 * Hook to fetch assignment metrics
 */
export function useAssignmentMetrics() {
  return useQuery<AssignmentMetrics, Error>({
    queryKey: assignmentKeys.metrics(),
    queryFn: getAssignmentMetricsClient,
  });
}

// ============================================================================
// Routing Rules Hooks
// ============================================================================

/**
 * Hook to fetch routing rules list with pagination
 */
export function useRoutingRules({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  return useQuery<ApiResponse<PaginatedResponse<AssignmentRule>>, Error>({
    queryKey: [...assignmentKeys.routingRules.list(), { page, limit }],
    queryFn: () => getRoutingRulesClient({ page, limit }),
  });
}

/**
 * Hook to create a new routing rule
 */
export function useCreateRoutingRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<RoutingRule>, Error, RoutingRuleFormData, unknown>({
    mutationFn: createRoutingRuleClient,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.routingRules.list(),
      });
      const message = Array.isArray(response.message) ? response.message.join(', ') : response.message;
      toast({
        title: 'Rule created',
        description: message || 'Routing rule created successfully',
      });
    },
    onError: (error) => {
      logger('Error creating routing rule:', { error: error.message });
      toast({
        title: 'Failed to create rule',
        description: error.message || 'Failed to create routing rule',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update an existing routing rule
 */
export function useUpdateRoutingRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<RoutingRule>,
    Error,
    { id: string; data: RoutingRuleFormData },
    unknown
  >({
    mutationFn: async ({ id, data }) => {
      return await updateRoutingRuleClient(id, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.routingRules.list(),
      });
      const message = Array.isArray(response.message) ? response.message.join(', ') : response.message;
      toast({
        title: 'Rule updated',
        description: message || 'Routing rule updated successfully',
      });
    },
    onError: (error) => {
      logger('Error updating routing rule:', { error: error.message });
      toast({
        title: 'Failed to update rule',
        description: error.message || 'Failed to update routing rule',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a routing rule
 */
export function useDeleteRoutingRule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<null>, Error, string, { previousRules?: RoutingRule[] }>({
    mutationFn: deleteRoutingRuleClient,
    onMutate: async (ruleId) => {
      await queryClient.cancelQueries({
        queryKey: assignmentKeys.routingRules.list(),
      });

      const previousRules = queryClient.getQueryData<RoutingRule[]>(
        assignmentKeys.routingRules.list()
      );

      if (previousRules) {
        queryClient.setQueryData<RoutingRule[]>(
          assignmentKeys.routingRules.list(),
          previousRules.filter((rule) => rule.id !== ruleId)
        );
      }

      return { previousRules };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.routingRules.list(),
      });
      const message = Array.isArray(response.message) ? response.message.join(', ') : response.message;
      toast({
        title: 'Rule deleted',
        description: message || 'Routing rule deleted successfully',
      });
    },
    onError: (error, _, context) => {
      logger('Error deleting routing rule:', { error: error.message });
      if (context?.previousRules) {
        queryClient.setQueryData(assignmentKeys.routingRules.list(), context.previousRules);
      }
      toast({
        title: 'Failed to delete rule',
        description: error.message || 'Failed to delete routing rule',
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// Skill Sets Hooks
// ============================================================================

/**
 * Hook to fetch skill sets
 */

export function useSkillSets(request?: Record<string, unknown>) {
  return useQuery<ApiResponse<SkillSet[]>, Error>({
    queryKey: assignmentKeys.skillSets.list(),
    queryFn: () => getSkillSetsClient(request),
  });
}

// ============================================================================
// Capacity Settings Hooks
// ============================================================================

/**
 * Hook to fetch capacity settings
 */
export function useCapacitySettings() {
  return useQuery<CapacitySettings, Error>({
    queryKey: assignmentKeys.capacity(),
    queryFn: getCapacitySettingsClient,
  });
}

/**
 * Hook to update capacity settings
 */
export function useUpdateCapacitySettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<CapacitySettings>,
    Error,
    { id: string; data: CapacitySettingsFormData },
    unknown
  >({
    mutationFn: async ({ id, data }) => {
      return await updateCapacitySettingsAction(id, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.capacity(),
      });
      const message = Array.isArray(response.message) ? response.message.join(', ') : response.message;
      toast({
        title: 'Settings saved',
        description: message || 'Capacity settings updated successfully',
      });
    },
    onError: (error) => {
      logger('Error updating capacity settings:', { error: error.message });
      toast({
        title: 'Failed to save settings',
        description: error.message || 'Failed to update capacity settings',
        variant: 'destructive',
      });
    },
  });
}
