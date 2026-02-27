"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOpenAddWorkflowModal } from "@/features/settings/hooks/use-approval-workflows";
import type { ApprovalWorkflow } from "@/features/settings/types/approvals/approval-workflows";
import { Edit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ApprovalWorkflowsListProps {
  workflows: ApprovalWorkflow[];
}

export function ApprovalWorkflowsList({
  workflows,
}: Readonly<ApprovalWorkflowsListProps>) {
  const { setSelectedWorkflow, } = useOpenAddWorkflowModal();
  if (workflows.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No approval workflows found.
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Trigger Event</TableHead>
          <TableHead>Conditions</TableHead>
          <TableHead>Approval Chain</TableHead>
          <TableHead>SLA</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflows.map((workflow) => {
          const sla = workflow.slaHours ? `${workflow.slaHours} hours` : "N/A";
          const conditions = workflow.conditions.length > 100 ? `${workflow.conditions.substring(0, 97)}...` : workflow.conditions;
          return (
            <TableRow key={workflow.id}>
              <TableCell>{workflow.name}</TableCell>
              <TableCell>
                <Badge variant={"primaryLight"}>
                  {workflow.triggerEventName ?? "--"}
                </Badge>
              </TableCell>
              <TableCell>{conditions}</TableCell>
              <TableCell>
                {(workflow.approvalChainSteps ?? []).map((step) => (
                  <Badge variant={"primaryLight"} key={step.id}>
                    {step.approverRole}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>{sla}</TableCell>
              <TableCell>{workflow.usageCount}</TableCell>
              <TableCell>{workflow.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button variant={"ghost"} size={"icon"} onClick={() => setSelectedWorkflow(workflow.id)}>
                  <HugeiconsIcon icon={Edit01Icon} className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
