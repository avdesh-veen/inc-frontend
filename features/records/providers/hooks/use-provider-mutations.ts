/**
 * Provider Mutations Hook
 * 
 * TanStack Query mutations for creating, updating, and deleting providers.
 * Uses server actions for mutations.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  createProviderAction, 
  updateProviderAction, 
  deleteProviderAction 
} from '../api/detail-view/actions';
import type { CreateProviderRequest, UpdateProviderRequest } from '../types';
import { providerListKeys } from './use-provider-list';
import { providerDetailKeys } from './use-provider-detail';

/**
 * Hook for creating a new provider
 */
export function useCreateProvider() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateProviderRequest) => createProviderAction(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate provider list to refetch
        queryClient.invalidateQueries({ queryKey: providerListKeys.all });
        toast.success(result.message || 'Provider created successfully');
        
        // Navigate to the new provider's detail page if we have the ID
        if (result.data?.id) {
          router.push(`/records/providers/${result.data.id}`);
        }
      } else {
        toast.error(result.message || 'Failed to create provider');
      }
    },
    onError: (error) => {
      console.error('Error creating provider:', error);
      toast.error('An unexpected error occurred while creating the provider');
    },
  });
}

/**
 * Hook for updating an existing provider
 */
export function useUpdateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateProviderRequest> }) => 
      updateProviderAction(id, data),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidate both list and detail queries
        queryClient.invalidateQueries({ queryKey: providerListKeys.all });
        queryClient.invalidateQueries({ queryKey: providerDetailKeys.byId(variables.id) });
        toast.success(result.message || 'Provider updated successfully');
      } else {
        toast.error(result.message || 'Failed to update provider');
      }
    },
    onError: (error) => {
      console.error('Error updating provider:', error);
      toast.error('An unexpected error occurred while updating the provider');
    },
  });
}

/**
 * Hook for deleting a provider
 */
export function useDeleteProvider() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteProviderAction(id),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate provider list to refetch
        queryClient.invalidateQueries({ queryKey: providerListKeys.all });
        toast.success(result.message || 'Provider deleted successfully');
        
        // Navigate back to providers list
        router.push('/records/providers');
      } else {
        toast.error(result.message || 'Failed to delete provider');
      }
    },
    onError: (error) => {
      console.error('Error deleting provider:', error);
      toast.error('An unexpected error occurred while deleting the provider');
    },
  });
}
