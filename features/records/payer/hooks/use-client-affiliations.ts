"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type {
  ClientAffiliation,
  ClientAffiliationRequest,
  CreateClientAffiliationRequest,
} from "../types";
import {
  getClientAffiliationsAction,
  createClientAffiliationAction,
} from "../api/client-affiliations/actions";

/**
 * Hook to fetch paginated client affiliations for a payer
 */
export function useClientAffiliations(
  payerId: string,
  request?: ClientAffiliationRequest,
) {
  return useQuery<ApiResponse<PaginatedResponse<ClientAffiliation>>, Error>({
    queryKey: queryKeys.payers.clientAffiliations(payerId, request),
    queryFn: () => getClientAffiliationsAction(payerId, request),
    enabled: !!payerId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a client affiliation for a payer
 */
export function useCreateClientAffiliation(payerId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<ClientAffiliation>,
    Error,
    CreateClientAffiliationRequest
  >({
    mutationFn: (data) => createClientAffiliationAction(payerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payers.clientAffiliations(payerId),
      });
      toast({
        title: "Client affiliation created",
        description: "The client has been affiliated with this payer.",
      });
    },
    onError: (error) => {
      logger("Failed to create client affiliation", {
        error: error.message,
        payerId,
      });
      toast({
        title: "Failed to create affiliation",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}
