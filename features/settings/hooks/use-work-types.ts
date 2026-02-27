
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { WorkType, WorkTypeFormData, WorkTypeStatistics, WorkTypeUsageStatistics } from "../types/work-types";
import {
  getWorkTypesClient,
  getWorkTypeByIdClient,
  getWorkTypeStatisticsClient,
  getWorkTypeUsageStatisticsClient,
  type WorkTypeRequest,
} from "../api/work-types/client";
import {
  createWorkTypeAction,
  updateWorkTypeAction,
  deleteWorkTypeAction,
  toggleWorkTypeStatusAction,
  deleteWorkflowStageAction,
  deleteGateRequirementAction,
} from "../api/work-types/actions";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

/**
 * Hook to fetch work types list with pagination
 *
 * @param request - Optional request parameters for filtering, sorting, and pagination
 * @returns Query result with paginated work types list
 */
export function useWorkTypes(request?: WorkTypeRequest) {
  const params: WorkTypeRequest = {
    ...request,
    page: request?.page ?? 1,
    limit: request?.limit ?? 10,
  };
  return useQuery<ApiResponse<PaginatedResponse<WorkType>>, Error>({
    queryKey: queryKeys.workTypes.list(params as Record<string, unknown>),
    queryFn: () => getWorkTypesClient(params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch single work type by ID
 *
 * @param id - Work type ID
 * @returns Query result with work type details
 */
export function useWorkType(id: string) {
  return useQuery<ApiResponse<WorkType>, Error>({
    queryKey: queryKeys.workTypes.detail(id),
    queryFn: () => getWorkTypeByIdClient(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new work type
 *
 * @returns Mutation hook for creating work type
 */
export function useCreateWorkType() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    WorkTypeFormData,
    unknown
  >({
    mutationFn: async (data: WorkTypeFormData) => {
      const result = await createWorkTypeAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.statistics(),
      });
      toast({
        title: "Work type created successfully",
        description: "Work type has been created successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to create work type",
        description: error.message || "Failed to create work type",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing work type
 *
 * @returns Mutation hook for updating work type
 */
export function useUpdateWorkType() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    { id: string; data: Partial<WorkTypeFormData> },
    unknown
  >({
    mutationFn: async ({ id, data }) => {
      const result = await updateWorkTypeAction(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.statistics(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.detail(variables.id),
      });
      toast({
        title: "Work type updated successfully",
        description: "Work type has been updated successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update work type",
        description: error.message || "Failed to update work type",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a work type
 *
 * @returns Mutation hook for deleting work type
 */
export function useDeleteWorkType() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    string,
    unknown
  >({
    mutationFn: async (id: string) => {
      const result = await deleteWorkTypeAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.statistics(),
      });
      toast({
        title: "Work type deleted successfully",
        description: "Work type has been deleted successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete work type",
        description: error.message || "Failed to delete work type",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to toggle work type active status
 *
 * @returns Mutation hook for toggling work type status
 */
export function useToggleWorkTypeStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    { id: string; isActive: boolean },
    unknown
  >({
    mutationFn: async ({ id, isActive }) => {
      const result = await toggleWorkTypeStatusAction(id, isActive);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: (_, { id, isActive }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.statistics(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.detail(id),
      });

      const status = isActive ? "activated" : "deactivated";
      toast({
        title: `Work type ${status} successfully`,
        description: `Work type has been ${status} successfully`,
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update work type status",
        description: error.message || "Failed to update work type status",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a workflow stage
 *
 * @returns Mutation hook for deleting workflow stage
 */
export function useDeleteWorkflowStage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    string,
    unknown
  >({
    mutationFn: async (id: string) => {
      const result = await deleteWorkflowStageAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.lists(),
      });
      toast({
        title: "Workflow stage deleted successfully",
        description: "Workflow stage has been deleted successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete workflow stage",
        description: error.message || "Failed to delete workflow stage",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a gate requirement
 *
 * @returns Mutation hook for deleting gate requirement
 */
export function useDeleteGateRequirement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    void,
    Error,
    string,
    unknown
  >({
    mutationFn: async (id: string) => {
      const result = await deleteGateRequirementAction(id);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workTypes.lists(),
      });
      toast({
        title: "Gate requirement deleted successfully",
        description: "Gate requirement has been deleted successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete gate requirement",
        description: error.message || "Failed to delete gate requirement",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to fetch overall work types statistics
 * 
 * Returns statistical data including total work types count (non-deleted),
 * active work types count, total work categories count (non-deleted),
 * and average expected duration across all work types.
 *
 * @returns Query result with work types statistics
 */
export function useWorkTypeStatistics() {
  return useQuery<ApiResponse<WorkTypeStatistics>, Error>({
    queryKey: queryKeys.workTypes.statistics(),
    queryFn: () => getWorkTypeStatisticsClient(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch usage statistics for a specific work type
 * 
 * Returns usage statistics for a specific work type including times used in workflows,
 * average actual duration, efficiency percentage, expected duration, and complexity level.
 * 
 * Note: Times used, average duration, and efficiency metrics will be calculated
 * after case workflow implementation.
 *
 * @param id - Work type ID
 * @param enabled - Whether the query should run (default: true if id exists)
 * @returns Query result with work type usage statistics
 */
export function useWorkTypeUsageStatistics(id: string, enabled = true) {
  return useQuery<ApiResponse<WorkTypeUsageStatistics>, Error>({
    queryKey: [...queryKeys.workTypes.all, "usage-statistics", id],
    queryFn: () => getWorkTypeUsageStatisticsClient(id),
    enabled: !!id && enabled,
  });
}

/**
 * Helper to find work type by ID from cached data
 */
export function findWorkType(
  workTypes: WorkType[],
  id: string
): WorkType | undefined {
  return workTypes.find((wt) => wt.id === id);
}

