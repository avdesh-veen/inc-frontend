import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { WaitReason } from "@/features/settings/types/wait-reasons";
import type {
  CreateWaitReasonPayload,
  UpdateWaitReasonPayload,
} from "@/features/settings/types/wait-reasons-api";
import {
  getWaitReasonsClient,
  getActiveWaitReasonsClient,
  type WaitReasonsRequest,
} from "@/features/settings/api/wait-reasons/client";
import {
  createWaitReasonAction,
  updateWaitReasonAction,
  deleteWaitReasonAction,
} from "@/features/settings/api/wait-reasons/actions";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

export function useWaitReasons(request?: WaitReasonsRequest) {
  return useQuery<ApiResponse<PaginatedResponse<WaitReason>>, Error>({
    queryKey: queryKeys.waitReasons.list(request),
    queryFn: () => getWaitReasonsClient(request),
  });
}

export function useActiveWaitReasons() {
  return useQuery<ApiResponse<WaitReason[]>, Error>({
    queryKey: queryKeys.waitReasons.active(),
    queryFn: getActiveWaitReasonsClient,
  });
}

export function useCreateWaitReason() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: CreateWaitReasonPayload) => {
      const result = await createWaitReasonAction(payload);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waitReasons.all });
      toast({
        title: "Wait reason created successfully",
        description: "Wait reason has been created successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to create wait reason",
        description: error.message ?? "Failed to create wait reason",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateWaitReason() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateWaitReasonPayload;
    }) => {
      const result = await updateWaitReasonAction(id, data);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waitReasons.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.waitReasons.detail(id),
      });
      toast({
        title: "Wait reason updated successfully",
        description: "Wait reason has been updated successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to update wait reason",
        description: error.message ?? "Failed to update wait reason",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteWaitReason() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteWaitReasonAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.waitReasons.all });
      toast({
        title: "Wait reason deleted successfully",
        description: "Wait reason has been deleted successfully",
      });
    },
    onError: (error) => {
      logger(String(error), { error: error.message });
      toast({
        title: "Failed to delete wait reason",
        description: error.message ?? "Failed to delete wait reason",
        variant: "destructive",
      });
    },
  });
}
