"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import {
  getSkillByIdClient,
  getSkillsListClient,
  getSkillCategoriesClient,
  getSkillCategoriesDropdownClient,
  getCategoriesWithSkillsClient,
  getUsersWithSkillsClient,
} from "../api/skills/client";
import { createSkillAction, deleteSkillAction, updateSkillAction } from "../api/skills/actions";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";
import type {
  SkillApiItem,
  SkillCategory,
  SkillsRequest,
  CreateSkillPayload,
  UpdateSkillPayload,
  CategoryWithSkills,
  UserWithSkillsItem,
  UserWithSkillsRequest,
} from "../types";

export function useSettingsSkills(request?: SkillsRequest) {
  return useQuery<ApiResponse<PaginatedResponse<SkillApiItem>>, Error>({
    queryKey: queryKeys.settings.skills.list(request),
    queryFn: () => getSkillsListClient(request),
  });
}

export function useSkillCategories() {
  return useQuery<ApiResponse<SkillCategory[]>, Error>({
    queryKey: queryKeys.settings.skills.categories(),
    queryFn: () => getSkillCategoriesClient(),
  });
}

export function useSkillCategoriesDropdown() {
  return useQuery<ApiResponse<PaginatedResponse<SkillCategory>>, Error>({
    queryKey: queryKeys.settings.skills.skillCategories(),
    queryFn: () => getSkillCategoriesDropdownClient(),
  });
}

export function useCategoriesWithSkills() {
  return useQuery<ApiResponse<CategoryWithSkills[]>, Error>({
    queryKey: queryKeys.settings.skills.categoriesWithSkills(),
    queryFn: () => getCategoriesWithSkillsClient(),
  });
}

export function useUsersWithSkills(request?: UserWithSkillsRequest) {
  return useQuery<ApiResponse<PaginatedResponse<UserWithSkillsItem>>, Error>({
    queryKey: queryKeys.settings.skills.usersWithSkills(request),
    queryFn: () => getUsersWithSkillsClient(request),
  });
}

export function useSkillDetail(id?: string) {
  return useQuery<ApiResponse<SkillApiItem>, Error>({
    queryKey: [...queryKeys.settings.skills.list(), "detail", id],
    queryFn: () => getSkillByIdClient(id!),
    enabled: !!id,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, CreateSkillPayload>({
    mutationFn: async (payload) => {
      const result = await createSkillAction(payload);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.skills.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.skills.categoriesWithSkills(),
      });
      toast({
        title: "Skill created successfully",
        description: "Skill has been created successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to create skill",
        description: error.message || "Failed to create skill",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, { id: string } & UpdateSkillPayload>({
    mutationFn: async ({ id, ...payload }) => {
      const result = await updateSkillAction(id, payload);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.skills.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.skills.categoriesWithSkills(),
      });
      toast({
        title: "Skill updated successfully",
        description: "The skill has been updated successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update skill",
        description: error.message || "Failed to update skill",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const result = await deleteSkillAction(id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.skills.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.skills.categoriesWithSkills(),
      });
      toast({
        title: "Skill deleted successfully",
        description: "The skill has been deleted successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete skill",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    },
  });
}
