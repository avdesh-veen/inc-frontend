"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
} from "../types";
import { ApiResponse } from "@/lib/api/types";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { loginUser, logoutUser, getCurrentUser } from "../api/login/client";
import { broadcastLogin, broadcastLogout } from "../components/cross-tab-auth-sync";

/**
 * Hook to handle user login
 *
 * On success:
 * - Stores auth token in cookies (with appropriate expiry based on rememberMe)
 * - Sets user and session data in cache
 * - Invalidates auth queries to trigger refetch
 *
 * @returns Mutation hook for login operation
 */
export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<LoginResponse>, Error, LoginRequest>({
    mutationFn: (credentials) => loginUser(credentials),
    onSuccess: (response) => {
      if (!response.status) {
        toast({
          title: "Login failed",
          description: Array.isArray(response.message)
            ? response.message.join(", ")
            : response.message,
          variant: "destructive",
        });
        return;
      } else {
        // Clear the entire cache so no stale data from a previous user's
        // session (permissions, lists, etc.) can bleed into the new session.
        queryClient.clear();

        broadcastLogin();
        router.refresh();
        toast({
          title: "Login successful",
          description: Array.isArray(response.message)
            ? response.message.join(", ")
            : response.message,
        });
      }
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to handle user logout
 *
 * On success:
 * - Cancels all in-flight queries (prevents API calls from completing after logout)
 * - Removes auth token from cookies
 * - Clears all queries from cache (fresh state)
 * - Removes user and session data
 *
 * @returns Mutation hook for logout operation
 */
export function useLogout() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, void>({
    mutationFn: async () => {
      // 1. Cancel all in-flight queries immediately
      await queryClient.cancelQueries();

      // 2. Clear all queries to prevent any stale data or re-fetches
      queryClient.clear();

      // 3. Call logout API and remove token on success
      return await logoutUser();
    },
    onSuccess: (response) => {
      if (!response.status) {
        toast({
          title: "Logout failed",
          description: Array.isArray(response.message)
            ? response.message.join(", ")
            : response.message,
          variant: "destructive",
        });
      } else {
        broadcastLogout();
        router.refresh();
        toast({
          title: "Logout successful",
          description: "You are now logged out",
        });
      }
    },
    onError: () => {
      queryClient.clear();
    },
  });
}

/**
 * Hook to fetch current user
 *
 * @returns Query hook with current user data
 */
export function useCurrentUser() {
  return useQuery<ApiResponse<CurrentUserResponse>, Error>({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: getCurrentUser,
  });
}
