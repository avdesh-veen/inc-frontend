import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { getDecisionQueueClient, getDefaultRoutingClient } from '@/features/settings/api/approvals/decision-queue/client';
import type { DecisionQueue, DefaultRouting } from '@/features/settings/types/approvals/decision-queue';
import { ApiResponse } from '@/lib/api/types';
import { DecisionQueueFormSchema } from '../validations/approvals/decision-queue';
import { useToast } from '@/hooks/use-toast';
import { updateDecisionQueueAction, updateDefaultRoutingAction } from '../api/approvals/decision-queue/actions';
import { logger } from '@/lib/logger';
        
/**
 * Hook to fetch decision queue
 */
export function useDecisionQueue() {
  return useQuery<ApiResponse<DecisionQueue>, Error>({
    queryKey: queryKeys.settings.approvals.decisionQueue(),
    queryFn: getDecisionQueueClient,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch default routing
 */
export function useDefaultRouting() {
  return useQuery<ApiResponse<DefaultRouting[]>, Error>({
    queryKey: queryKeys.settings.approvals.defaultRouting(),
    queryFn: getDefaultRoutingClient,
  });
}

/**
 * Hook to update decision queue
 */
export function useUpdateDecisionQueue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<DecisionQueue | undefined>, Error, DecisionQueueFormSchema & { id: string }>({
    mutationFn: async (data: DecisionQueueFormSchema & { id: string }) => {
      const result = await updateDecisionQueueAction(data);
      if (!result.status) {
        throw new Error(result.message as string);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.approvals.decisionQueue(),
      });
      toast({
        title: 'Decision queue updated',
        description: Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message,
      });
    },
    onError: (error) => {
      logger('Error updating decision queue:', { error: error.message });
      toast({
        title: 'Failed to update decision queue',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update default routing
 */
export function useUpdateDefaultRouting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<DefaultRouting[] | undefined>, Error, { id: string, sla: number }[]>({
    mutationFn: async (data) => {
      const result = await updateDefaultRoutingAction(data);
      if (!result.status) {
        throw new Error(result.message as string);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.approvals.defaultRouting(),
      });
      toast({
        title: 'Default routing updated',
        description: Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message,
      });
    },
    onError: (error) => {
      logger('Error updating default routing:', { error: error.message });
      toast({
        title: 'Failed to update default routing',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}