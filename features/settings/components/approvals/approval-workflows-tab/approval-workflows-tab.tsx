"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, WorkflowSquare02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useApprovalWorkflows, useOpenAddWorkflowModal } from "@/features/settings/hooks/use-approval-workflows";
import { ApprovalWorkflowsList } from "./approval-workflows-list";
import {
  ApprovalTriggerEvents,
  ApprovalWaitReasonsAlert,
} from "./approval-trigger-events";
import { Spinner } from "@/components/ui/spinner";
import { GridPagination } from "@/components/shared/grid-pagination";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ApprovalWorkflowsRequest } from "@/features/settings/types/approvals/approval-workflows";

function ApprovalWorkflowAlert() {
  return (
    <Alert variant="primary">
      <AlertTitle className="flex items-center gap-1">
        <HugeiconsIcon
          icon={WorkflowSquare02Icon}
          className="h-5 w-5 text-primary"
        />
        <span className="font-semibold text-sm">
          Event-Driven Approval Workflows
        </span>
      </AlertTitle>
      <AlertDescription>
        Approval workflows are triggered by workflow events
        (gate.approval_required, stage.completed). Configure which events
        require approval and define the approval chain.
      </AlertDescription>
    </Alert>
  );
}

export function ApprovalWorkflowsTab(request: Readonly<ApprovalWorkflowsRequest>) {
  return (
    <div className="space-y-4">
      <ApprovalWorkflowAlert />
      <ConfiguredApprovalWorkflows {...request} />
      <ApprovalTriggerEvents />
      <ApprovalWaitReasonsAlert />
    </div>
  );
}

function EmptyWorkflowsList() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-2 py-8">
      <HugeiconsIcon
        icon={WorkflowSquare02Icon}
        className="size-12 text-muted-foreground/50"
      />
      <h3 className="text-sm font-medium">No approval workflows found</h3>
      <p className="text-xs text-muted-foreground text-center max-w-md">
        Create a new approval workflow to get started. You can add a new
        workflow by clicking the &quot;Add Workflow&quot; button above.
      </p>
    </div>
  );
}

function ConfiguredApprovalWorkflows(request: Readonly<ApprovalWorkflowsRequest>) {
  const { open } = useOpenAddWorkflowModal();
  const { data: workflowsData, isFetching } = useApprovalWorkflows(request);

  const workflows = workflowsData?.data?.items || [];
  const meta = workflowsData?.data?.meta;
  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle className="flex gap-2 items-center">
            Configured Approval Workflows
          </CardTitle>
        </div>
        <Button variant="default" size="sm" onClick={open}>
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
          <span className="text-sm font-medium">Add Workflow</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isFetching ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Spinner className="size-4" />
            </div>
          ) : null}

          {!isFetching && workflows.length > 0 ? (
            <ApprovalWorkflowsList workflows={workflows} />
          ) : null}

          {!isFetching && workflows.length === 0 ? (
            <EmptyWorkflowsList />
          ) : null}

          {meta && meta.totalItems > 0 ? (
            <GridPagination
              totalItems={meta.totalItems}
              currentPage={meta.currentPage}
              itemsPerPage={meta.itemsPerPage}
              totalPages={meta.totalPages}
              label="Workflows"
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
