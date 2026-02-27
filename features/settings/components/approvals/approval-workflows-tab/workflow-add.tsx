"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  ApprovalWorkflowFormSchema,
  approvalWorkflowFormSchema,
} from "@/features/settings/validations/approvals/approval-workflow";
import {
  WorkflowIdentitySection,
  WorkflowApprovalChainSection,
  WorkflowSLASection,
} from "./workflow-form";
import {
  useCreateApprovalWorkflow,
  useOpenAddWorkflowModal,
  useUpdateApprovalWorkflow,
} from "@/features/settings/hooks/use-approval-workflows";
import { ApprovalWorkflow } from "@/features/settings/types/approvals/approval-workflows";
import { logger } from "@/lib/logger";

export function WorkflowAdd({
  selectedWorkflow,
}: {
  selectedWorkflow?: ApprovalWorkflow;
}) {
  const { close } = useOpenAddWorkflowModal();
  const { mutateAsync: createApprovalWorkflow, isPending } =
    useCreateApprovalWorkflow();
  const { mutateAsync: updateApprovalWorkflow, isPending: isUpdating } =
    useUpdateApprovalWorkflow();
  const form = useForm<ApprovalWorkflowFormSchema>({
    resolver: zodResolver(approvalWorkflowFormSchema),
    values: {
      name: selectedWorkflow?.name ?? "",
      triggerEventId: selectedWorkflow?.triggerEventId ?? "",
      conditions: selectedWorkflow?.conditions ?? "",
      slaHours: selectedWorkflow?.slaHours ?? 2,
      escalationTarget: selectedWorkflow?.escalationTarget ?? "none",
      isActive: true,
      approvalChainSteps: selectedWorkflow?.approvalChainSteps ?? [],
    },
  });

  const getSubmitLabel = () => {
    if (isPending) return "Creating workflow...";
    if (isUpdating) return "Updating workflow...";
    if (selectedWorkflow) return "Update Workflow";
    return "Create Workflow";
  };

  const onSubmit = async (data: ApprovalWorkflowFormSchema) => {
    try {
      if (selectedWorkflow) {
        await updateApprovalWorkflow({
          id: selectedWorkflow.id,
          ...data,
        });
      } else {
        await createApprovalWorkflow(data);
      }
      close();
      form.reset();
      form.clearErrors();
    } catch (error) {
      logger(String(error), { error });
    }
  };

  return (
    <div className="overflow-x-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 rounded-lg">
              <WorkflowIdentitySection form={form} />
            </div>

            <div className="lg:col-span-1 rounded-lg">
              <WorkflowApprovalChainSection form={form} />
            </div>

            <div className="lg:col-span-1 rounded-lg">
              <WorkflowSLASection form={form} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending || isUpdating}
              onClick={() => {
                close();
                form.reset();
                form.clearErrors();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUpdating}>
              {getSubmitLabel()}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
