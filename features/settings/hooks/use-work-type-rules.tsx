import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import {
  ApplyDefaultWorkTypeRulesRequest,
  ApplyDefaultWorkTypeRulesResponse,
  UpdateWorkTypeRulesStatusResponse,
  WorkTypeRulesRequest,
  WorkTypeRulesResponse,
} from "../types/approvals/work-type-rules";
import {
  applyDefaultWorkTypeRulesClient,
  getWorkTypeRulesClient,
} from "../api/approvals/work-type-rules/client";
import { updateWorkTypeRulesStatusAction } from "../api/approvals/work-type-rules/actions";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

export function useWorkTypeRules(request?: WorkTypeRulesRequest) {
  return useQuery<ApiResponse<PaginatedResponse<WorkTypeRulesResponse>>, Error>(
    {
      queryKey: queryKeys.settings.approvals.workTypeRules(request),
      queryFn: () => getWorkTypeRulesClient(request),
    },
  );
}

export function useApplyDefaultWorkTypeRules(
  request?: ApplyDefaultWorkTypeRulesRequest,
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<ApiResponse<ApplyDefaultWorkTypeRulesResponse>, Error>({
    mutationFn: () => applyDefaultWorkTypeRulesClient(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("work-type-rules"),
      });
      toast({
        title: "Default work type rules applied",
        description: `${data.data.created} work type rules created, ${data.data.updated} work type rules updated, ${data.data.skipped} work type rules skipped`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error applying default work type rules",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateWorkTypeRulesStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<
    ApiResponse<UpdateWorkTypeRulesStatusResponse | undefined>,
    Error,
    { id: string; isActive: boolean }
  >({
    mutationFn: async ({ id, isActive }) => {
      const result = await updateWorkTypeRulesStatusAction(id, isActive);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(", ") : result.message,
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("work-type-rules"),
      });
      toast({
        title: "Work type rules status updated",
        description: `Work type rules status updated to ${data.data?.isActive ? "active" : "inactive"}`,
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Error updating work type rules status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
