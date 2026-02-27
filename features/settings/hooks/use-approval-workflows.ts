import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/query-keys";
import { ApiResponse } from "@/lib/api/types";
import {
  ApprovalWorkflow,
  ApprovalWorkflowsRequest,
  ApprovalWorkflowsResponse,
  CreateApprovalWorkflowRequest,
  UpdateApprovalWorkflowRequest,
  DeleteApprovalWorkflowRequest,
} from "../types/approvals/approval-workflows";
import {
  getApprovalWorkflowsClient,
  getApprovalWorkflowClient,
  deleteApprovalWorkflowClient,
} from "../api/approvals/workflows/client";
import {
  createApprovalWorkflowAction,
  updateApprovalWorkflowAction,
} from "../api/approvals/workflows/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/constants/navigation";
import { logger } from "@/lib/logger";
import { create } from "zustand";

/** Fetches approval workflows list, optionally filtered by request params. */
export function useApprovalWorkflows(request?: ApprovalWorkflowsRequest) {
  return useQuery<ApiResponse<ApprovalWorkflowsResponse>, Error>({
    queryKey: queryKeys.settings.approvals.workflows(request),
    queryFn: () => getApprovalWorkflowsClient(request),
  });
}

/** Fetches a single approval workflow by id. Query runs only when id is truthy. */
export function useApprovalWorkflow(id: string | null) {
  return useQuery<ApiResponse<ApprovalWorkflow> | undefined, Error>({
    queryKey: queryKeys.settings.approvals.workflowDetail(id ?? ""),
    queryFn: () => getApprovalWorkflowClient(id!),
    enabled: !!id,
  });
}

/** Mutation to create an approval workflow. Invalidates workflows cache, shows toast, and redirects to approvals list. */
export function useCreateApprovalWorkflow() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation<
    ApiResponse<ApprovalWorkflow | undefined>,
    Error,
    CreateApprovalWorkflowRequest
  >({
    mutationFn: async (request) => {
      const result = await createApprovalWorkflowAction(request);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(", ") : result.message,
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("workflows"),
      });
      toast({
        title: "Workflow created",
        description: Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message,
      });
      router.push(appRoutes.settings.workflow.approvals("approvals"));
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Error creating workflow",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/** Mutation to update an approval workflow. Invalidates workflows cache and shows toast. */
export function useUpdateApprovalWorkflow() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    ApiResponse<ApprovalWorkflow | undefined>,
    Error,
    UpdateApprovalWorkflowRequest
  >({
    mutationFn: async (request) => {
      const result = await updateApprovalWorkflowAction(request);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(", ") : result.message,
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("workflows"),
      });
      toast({
        title: "Workflow updated",
        description: Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message,
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({
        title: "Error updating workflow",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/** Mutation to delete an approval workflow. Invalidates workflows cache and shows toast. */
export function useDeleteApprovalWorkflow() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<void>, Error, DeleteApprovalWorkflowRequest>({
    mutationFn: deleteApprovalWorkflowClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("workflows"),
      });
      toast({
        title: "Workflow deleted",
        description: "Approval workflow has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting workflow",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

/** Zustand store for add-workflow modal: open state and selected workflow (opening with a workflow pre-selected). */
export const useOpenAddWorkflowModal = create<{
  isOpen: boolean;
  open: () => void;
  close: () => void;

  selectedWorkflow: string | null;
  setSelectedWorkflow: (workflow: string | null) => void;
}>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, selectedWorkflow: null }),

  selectedWorkflow: null,
  setSelectedWorkflow: (workflow) => set({ selectedWorkflow: workflow, isOpen: true }),
}));