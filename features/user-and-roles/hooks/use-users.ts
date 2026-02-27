import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type {
  User,
  UserRequest,
  UserStatus,
  UserStats,
  UserSkillItem,
} from "../types/user-tab";
import {
  getUsersListClient,
  getUsersStatsClient,
  getLeadershipUsersClient,
} from "../api/user-tab/client";
import {
  createUser,
  updateUser,
  updateUserStatus,
  updateUserSkillsAction,
} from "../api/user-form/actions";
import { logger } from "@/lib/logger";
import { UserFormValues } from "../validations/user-schema";
import { useToast } from "@/hooks/use-toast";
import { appRoutes } from "@/lib/constants/navigation";
import { useRouter } from "next/navigation";
import { getUserByIdClient, getUserSkillsClient } from "../api/user-form/client";

/**
 * Hook to fetch users list
 *
 * @returns Query hook with users list data
 */
export function useUserList(request?: UserRequest) {
  return useQuery<ApiResponse<PaginatedResponse<User>>, Error>({
    queryKey: queryKeys.usersRoles.users.list(request),
    queryFn: () => getUsersListClient(request),
  });
}

/**
 * Hook to fetch users stats
 *
 * @returns Query hook with users stats data
 */
export function useUserStats() {
  return useQuery<ApiResponse<UserStats>, Error>({
    queryKey: queryKeys.usersRoles.users.stats(),
    queryFn: () => getUsersStatsClient(),
  });
}

/**
 * Hook to fetch leadership users
 *
 * @returns Query hook with leadership users data
 */
export function useLeadershipUsers(request?: { page?: number; limit?: number }) {
  return useQuery<ApiResponse<PaginatedResponse<User>>, Error>({
    queryKey: queryKeys.usersRoles.users.leadership(request),
    queryFn: () => getLeadershipUsersClient(request),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new user
 *
 * @returns Mutation hook for creating a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation<ApiResponse<User | undefined>, Error, UserFormValues>({
    mutationFn: async (formData) => {
      const result = await createUser(formData);
      if (!result.status) {
        throw new Error(result.message as string);
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.stats(),
      });

      if (data?.data?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.usersRoles.users.detail(data.data.id),
        });
      }

      toast({
        title: "User created successfully",
        description: Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message,
      });
      router.push(appRoutes.administration.usersRoles("users"));
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation<
    ApiResponse<User | undefined>,
    Error,
    { id: string; formData: Partial<UserFormValues> }
  >({
    mutationFn: async ({ id, formData }) => {
      const result = await updateUser(id, formData);

      if (!result.status) {
        throw new Error(result.message as string);
      }

      return result;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.stats(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.detail(id),
      });
      toast({
        title: "User updated successfully",
        description: Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message,
      });
      router.push(appRoutes.administration.usersRoles("users"));
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to fetch a user by ID
 *
 * @param id - The ID of the user to fetch
 * @returns Query hook with user data
 */
export function useUserById(id?: string) {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: queryKeys.usersRoles.users.detail(id ?? ""),
    queryFn: () => getUserByIdClient(id ?? ""),
    enabled: !!id,
  });
}

export function useUserSkills(userId?: string) {
  return useQuery<ApiResponse<UserSkillItem[]>, Error>({
    queryKey: queryKeys.usersRoles.users.skills(userId ?? ""),
    queryFn: () => getUserSkillsClient(userId!),
    enabled: !!userId,
  });
}

export function useUpdateUserSkills() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, { userId: string; skillIds: string[] }>({
    mutationFn: async ({ userId, skillIds }) => {
      const result = await updateUserSkillsAction(userId, skillIds);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usersRoles.users.skills(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.usersRoles.users.detail(userId) });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.settings.all, "skills", "users-with-skills"] });
      toast({ title: "Skills updated successfully" });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({ title: "Failed to update skills", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation<
    ApiResponse<User | undefined>,
    Error,
    { id: string; formData: { status: UserStatus } }
  >({
    mutationFn: async ({ id, formData }) => {
      const result = await updateUserStatus(id, formData);
      if (!result.status) {
        throw new Error(result.message as string);
      }
      return result;
    },
    onSuccess: (data, { id, formData }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.stats(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersRoles.users.detail(id),
      });

      const label = formData.status === "active" ? "activated" : "deactivated";
      toast({
        title: `User ${label} successfully`,
        description: Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message,
      });
      router.push(appRoutes.administration.usersRoles("users"));
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Failed to update user status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
