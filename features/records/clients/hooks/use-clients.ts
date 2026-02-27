/**
 * Client Hooks
 * 
 * TanStack Query hooks for client data fetching and mutations.
 * Follows the standard pattern used across the application.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import { Client, ClientListItem, ClientRequest, CreateClientRequest, UpdateClientRequest } from "../types";
import { getClientsListClient, getClientByIdClient } from "../api/clients-tab/client";
import { createClientAction, updateClientAction, deleteClientAction } from "../api/clients-tab/actions";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to fetch clients list
 * 
 * @param params - Filter and pagination parameters
 * @returns Query hook with clients list data
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useClientsList({
 *   search: "healthcare",
 *   accountTier: "gold",
 *   page: 1,
 *   limit: 25
 * });
 * ```
 */
export function useClientsList(params?: ClientRequest) {
  return useQuery<ApiResponse<PaginatedResponse<ClientListItem>>, Error>({
    queryKey: queryKeys.clients.list(params),
    queryFn: () => getClientsListClient(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single client by ID
 * 
 * @param id - Client ID
 * @returns Query hook with client detail data
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useClientById("client-id");
 * ```
 */
export function useClientById(id?: string) {
  return useQuery<ApiResponse<Client>, Error>({
    queryKey: queryKeys.clients.detail(id ?? ""),
    queryFn: () => getClientByIdClient(id ?? ""),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch client statistics
 * 
 * @returns Query hook with client stats data
 * 
 * @example
 * ```tsx
 * const { data } = useClientStats();
 * // data: { totalClients, activeClients, totalRevenue, avgHealthScore }
 * ```
 */
export function useClientStats() {
  return useQuery<{
    totalClients: number;
    activeClients: number;
    totalRevenue: number;
    avgHealthScore: number;
  }, Error>({
    queryKey: queryKeys.clients.stats(),
    queryFn: async () => {
      // TODO: Implement getClientStatsClient in client.ts
      throw new Error("Not implemented yet");
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to create a new client
 * 
 * @returns Mutation hook for creating a client
 * 
 * @example
 * ```tsx
 * const createClient = useCreateClient();
 * 
 * createClient.mutate(payload);
 * ```
 */
export function useCreateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<{ id: string } | undefined>,
    Error,
    CreateClientRequest
  >({
    mutationFn: async (data) => {
      const result = await createClientAction(data);
      if (!result.status) {
        throw new Error(result.message as string);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.lists(),
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.stats(),
      });
      
      toast({
        title: "Client created successfully",
        description: "The client has been added to your records.",
      });
      
    },
    onError: (error) => {
      toast({
        title: "Failed to create client",
        description: error.message || "An error occurred while creating the client.",
        variant: "destructive",
      });
      logger("Failed to create client", { error });
    },
  });
}

/**
 * Hook to update an existing client
 * 
 * @returns Mutation hook for updating a client
 * 
 * @example
 * ```tsx
 * const updateClient = useUpdateClient();
 * 
 * updateClient.mutate({
 *   id: "client-id",
 *   data: { accountTier: "platinum" }
 * });
 * ```
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<unknown | undefined>,
    Error,
    { id: string; data: UpdateClientRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const result = await updateClientAction(id, data);
      if (!result.status) {
        throw new Error(result.message as string);
      }
      return result;
    },
    onSuccess: (_data, { id }) => {
      // Invalidate all client lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.lists(),
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.detail(id),
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.stats(),
      });
      
      toast({
        title: "Client updated successfully",
        description: "The client information has been updated.",
      });
      
      logger("Client updated successfully", { clientId: id });
    },
    onError: (error, { id }) => {
      toast({
        title: "Failed to update client",
        description: error.message || "An error occurred while updating the client.",
        variant: "destructive",
      });
      logger("Failed to update client", { error, clientId: id });
    },
  });
}

/**
 * Hook to delete a client
 * 
 * @returns Mutation hook for deleting a client
 * 
 * @example
 * ```tsx
 * const deleteClient = useDeleteClient();
 * 
 * deleteClient.mutate("client-id");
 * ```
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<unknown | undefined>, Error, string>({
    mutationFn: async (id) => {
      const result = await deleteClientAction(id);
      if (!result.status) {
        throw new Error(result.message as string);
      }
      return result;
    },
    onSuccess: (_data, id) => {
      // Invalidate all client lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.lists(),
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.detail(id),
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.stats(),
      });
      
      toast({
        title: "Client deleted successfully",
        description: "The client has been removed from your records.",
      });
      
    },
    onError: (error, id) => {
      toast({
        title: "Failed to delete client",
        description: error.message || "An error occurred while deleting the client.",
        variant: "destructive",
      });
      logger("Failed to delete client", { error, clientId: id });
    },
  });
}
