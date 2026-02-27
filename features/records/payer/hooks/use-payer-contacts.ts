"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type {
  PayerContactItem,
  PayerContactDetail,
  PayerContactRequest,
  CreatePayerContactRequest,
  UpdatePayerContactRequest,
} from "../types";
import {
  getPayerContactsAction,
  getPayerContactByIdAction,
  createPayerContactAction,
  updatePayerContactAction,
  deletePayerContactAction,
} from "../api/contacts/actions";

/**
 * Hook to fetch paginated contacts for a payer
 */
export function usePayerContacts(
  payerId: string,
  request?: PayerContactRequest,
) {
  return useQuery<ApiResponse<PaginatedResponse<PayerContactItem>>, Error>({
    queryKey: queryKeys.payers.contacts(payerId, request),
    queryFn: () => getPayerContactsAction(payerId, request),
    enabled: !!payerId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single contact by ID for a payer
 */
export function usePayerContactById(payerId: string, id: string | null) {
  return useQuery<ApiResponse<PayerContactDetail>, Error>({
    queryKey: queryKeys.payers.contactDetail(payerId, id ?? ""),
    queryFn: () => getPayerContactByIdAction(payerId, id!),
    enabled: !!payerId && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a contact for a payer
 */
export function useCreatePayerContact(payerId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<PayerContactItem>,
    Error,
    CreatePayerContactRequest
  >({
    mutationFn: (data) => createPayerContactAction(payerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payers.contacts(payerId),
      });
      toast({
        title: "Contact created",
        description: "The contact has been added to this payer.",
      });
    },
    onError: (error) => {
      logger("Failed to create payer contact", {
        error: error.message,
        payerId,
      });
      toast({
        title: "Failed to create contact",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update a contact for a payer
 */
export function useUpdatePayerContact(payerId: string, contactId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<PayerContactItem>,
    Error,
    UpdatePayerContactRequest
  >({
    mutationFn: (data) => updatePayerContactAction(payerId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payers.contacts(payerId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payers.contactDetail(payerId, contactId),
      });
      toast({
        title: "Contact updated",
        description: "The contact has been saved successfully.",
      });
    },
    onError: (error) => {
      logger("Failed to update payer contact", {
        error: error.message,
        payerId,
        contactId,
      });
      toast({
        title: "Failed to update contact",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a contact for a payer
 */
export function useDeletePayerContact(payerId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: (contactId) => deletePayerContactAction(payerId, contactId),
    onSuccess: (_, contactId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payers.contacts(payerId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.payers.contactDetail(payerId, contactId),
      });
      toast({
        title: "Contact deleted",
        description: "The contact has been removed.",
      });
    },
    onError: (error) => {
      logger("Failed to delete payer contact", {
        error: error.message,
        payerId,
      });
      toast({
        title: "Failed to delete contact",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}
