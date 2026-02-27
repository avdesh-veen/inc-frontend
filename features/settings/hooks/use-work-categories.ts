/**
 * Work Categories Hook
 *
 * Hook for fetching and managing work categories from the API.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import {
  WorkCategory,
  WorkCategoryRequest,
} from "@/features/settings/types/work-category";
import {
  getWorkCategoriesClient,
  getAllWorkCategoriesClient,
} from "../api/work-categories/client";
import { 
  createWorkCategoryAction,
  deleteWorkCategoryAction 
} from "../api/work-categories/actions";
import type { WorkCategoryFormData } from "../validations/work-category-schemas";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to fetch work categories with pagination
 *
 * @param request - Query parameters for filtering and pagination
 * @returns Query result with paginated work categories
 */
export function useWorkCategories(request?: WorkCategoryRequest) {
  return useQuery<ApiResponse<PaginatedResponse<WorkCategory>>, Error>({
    queryKey: queryKeys.workCategories.list(request as Record<string, unknown>),
    queryFn: () => getWorkCategoriesClient(request),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all work categories without pagination
 *
 * @returns Query result with all work categories
 */
export function useAllWorkCategories() {
  return useQuery<ApiResponse<WorkCategory[]>, Error>({
    queryKey: queryKeys.workCategories.allData(),
    queryFn: getAllWorkCategoriesClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Helper to find work category by ID
 */
export function findWorkCategory(
  categories: WorkCategory[],
  id: string,
): WorkCategory | undefined {
  return categories.find((cat) => cat.id === id);
}

/**
 * Helper to find multiple work categories by IDs
 */
export function findWorkCategories(
  categories: WorkCategory[],
  ids: string[],
): WorkCategory[] {
  return ids
    .map((id) => findWorkCategory(categories, id))
    .filter((cat): cat is WorkCategory => cat !== undefined);
}

/**
 * Hook to create a new work category
 *
 * @returns Mutation result for creating work category
 */
export function useCreateWorkCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<WorkCategory | undefined>, Error, WorkCategoryFormData>({
    mutationFn: async (data: WorkCategoryFormData) => {
      const result = await createWorkCategoryAction(data);
      if (!result.status) {
        const message = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "Failed to create category";
        throw new Error(message);
      }
      return result;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.workCategories.all,
        refetchType: 'all'
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.statistics(),
        refetchType: 'all'
      });
      
      toast({
        title: "Category created successfully",
        description: `"${response.data?.name}" has been added to work categories.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to create category",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a work category
 *
 * @returns Mutation result for deleting work category
 */
export function useDeleteWorkCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id: string) => {
      const result = await deleteWorkCategoryAction(id);
      if (!result.status) {
        const message = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message || "Failed to delete category";
        throw new Error(message);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.workCategories.all,
        refetchType: 'all'
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.statistics(),
        refetchType: 'all'
      });
      
      toast({
        title: "Category deleted successfully",
        description: "The work category has been removed.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete category",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}
