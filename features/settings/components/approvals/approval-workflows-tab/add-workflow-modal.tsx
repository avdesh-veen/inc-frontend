"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WorkflowAdd } from "./workflow-add";
import {
  useApprovalWorkflow,
  useOpenAddWorkflowModal,
} from "@/features/settings/hooks/use-approval-workflows";
import { Spinner } from "@/components/ui/spinner";

export function AddWorkflowModal() {
  const { isOpen, open, close, selectedWorkflow } = useOpenAddWorkflowModal();
  const { data: workflow, isFetching } = useApprovalWorkflow(selectedWorkflow);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => (isOpen ? open() : close())}
    >
      <DialogContent className="max-w-2xl lg:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {selectedWorkflow
              ? "Edit Approval Workflow"
              : "Create Approval Workflow"}
          </DialogTitle>
          <DialogDescription>
            Define approval routing and escalation rules
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto pr-4">
          {isFetching ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Spinner className="size-4" />
            </div>
          ) : (
            <WorkflowAdd selectedWorkflow={workflow?.data} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
