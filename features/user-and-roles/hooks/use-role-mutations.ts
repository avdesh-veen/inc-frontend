/**
 * Role Mutation Hooks
 *
 * Custom hooks using TanStack Query for role CRUD operations.
 * Uses server actions for API calls instead of client-side HTTP requests.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/lib/api/types";
import type {
  RoleDetailAPIResponse,
  RoleFromAPI,
  CreateRolePayload,
  UpdateRolePayload,
} from "../api/roles-tab/roles-api";
import { createRoleAction, updateRoleAction } from "../api/roles-tab/actions";
import { getRoleDetailClient } from "../api/roles-tab/client";

/**
 * Hook to fetch role detail by ID
 * Returns full role details with permissions for editing
 */
export function useRoleDetail(id: string | null) {
  return useQuery<RoleDetailAPIResponse, Error>({
    queryKey: queryKeys.usersRoles.roles.detail(id ?? ""),
    queryFn: () => getRoleDetailClient(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to create a new role
 * Uses server action for API call
 */
export function useCreateRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<RoleFromAPI | undefined>,
    Error,
    CreateRolePayload
  >({
    mutationFn: async (data) => {
      const result = await createRoleAction(data);
      if (!result.status) {
        const message = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "Failed to create role";
        throw new Error(message);
      }
      return result;
    },
    onSuccess: (response) => {
      // Invalidate roles dropdown queries
      queryClient.invalidateQueries({
        queryKey: ["roles", "dropdown"],
      });

      // Invalidate all role list queries (matches any filter combination)
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.usersRoles.all, "roles"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.roleDefinitions(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.externalRoles(),
      });

      // Set the new role in cache if available
      if (response.data) {
        queryClient.setQueryData(
          queryKeys.usersRoles.roles.detail(response.data.id),
          response.data
        );
      }

      toast({
        title: "Role created successfully",
        description:
          typeof response.message === "string"
            ? response.message
            : "The role has been created.",
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Failed to create role",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing role
 * Uses server action for PATCH /roles/:id endpoint
 */
export function useUpdateRoleById() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<RoleFromAPI | undefined>,
    Error,
    { id: string; data: Partial<UpdateRolePayload> }
  >({
    mutationFn: async ({ id, data }) => {
      const result = await updateRoleAction(id, data);
      if (!result.status) {
        const message = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "Failed to update role";
        throw new Error(message);
      }
      return result;
    },
    onSuccess: (response, { id }) => {
      // Invalidate role detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.roles.detail(id),
      });

      // Invalidate roles dropdown queries
      queryClient.invalidateQueries({
        queryKey: ["roles", "dropdown"],
      });

      // Invalidate all role list queries (matches any filter combination)
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.usersRoles.all, "roles"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.roleDefinitions(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.externalRoles(),
      });

      // Set the updated role in cache if available
      if (response.data) {
        queryClient.setQueryData(
          queryKeys.usersRoles.roles.detail(response.data.id),
          response.data
        );
      }

      toast({
        title: "Role updated successfully",
        description:
          typeof response.message === "string"
            ? response.message
            : "The role has been updated.",
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
