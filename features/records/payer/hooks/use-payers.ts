import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { PayerListItem, PayerDetail, PayerRequest, CreatePayerRequest, UpdatePayerRequest } from "../types";
import { getPayersListClient } from "../api/payers/client";
import { getPayerByIdAction, createPayerAction, updatePayerAction, deletePayerAction } from "../api/payers/actions";

/**
 * Hook to fetch paginated payers list
 */
export function usePayersList(params?: PayerRequest) {
  return useQuery<ApiResponse<PaginatedResponse<PayerListItem>>, Error>({
    queryKey: queryKeys.payers.list(params),
    queryFn: () => getPayersListClient(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch a single payer by ID
 */
export function usePayerById(id?: string) {
  return useQuery<ApiResponse<PayerDetail>, Error>({
    queryKey: queryKeys.payers.detail(id ?? ""),
    queryFn: () => getPayerByIdAction(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new payer
 */
export function useCreatePayer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<PayerListItem>, Error, CreatePayerRequest>({
    mutationFn: createPayerAction,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payers.lists() });
      toast({
        title: "Payer created",
        description: `"${response.data?.name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      logger("Failed to create payer", { error: error.message });
      toast({
        title: "Failed to create payer",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing payer
 */
export function useUpdatePayer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<PayerListItem>,
    Error,
    { id: string; data: UpdatePayerRequest }
  >({
    mutationFn: ({ id, data }) => updatePayerAction(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.payers.detail(id) });
      toast({
        title: "Payer updated",
        description: `"${response.data?.name}" has been updated successfully.`,
      });
    },
    onError: (error, { id }) => {
      logger("Failed to update payer", { error: error.message, payerId: id });
      toast({
        title: "Failed to update payer",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a payer
 */
export function useDeletePayer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: deletePayerAction,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payers.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.payers.detail(id) });
      toast({
        title: "Payer deleted",
        description: "The payer has been removed successfully.",
      });
    },
    onError: (error, id) => {
      logger("Failed to delete payer", { error: error.message, payerId: id });
      toast({
        title: "Failed to delete payer",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}
