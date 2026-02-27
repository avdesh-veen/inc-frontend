"use client";

import { UseFormReturn } from "react-hook-form";
import { ApprovalWorkflowFormSchema } from "@/features/settings/validations/approvals/approval-workflow";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

interface WorkflowApprovalChainSectionProps {
  form: UseFormReturn<ApprovalWorkflowFormSchema>;
}

interface Approver {
  id: string;
  role: string;
  description: string;
  icon: string;
}

const APPROVERS: Approver[] = [
  {
    id: "team_lead",
    role: "Team Lead",
    description: "Direct supervisor",
    icon: "👤",
  },
  {
    id: "manager",
    role: "Manager",
    description: "Department manager",
    icon: "👔",
  },
  {
    id: "director",
    role: "Director",
    description: "Department director",
    icon: "🎯",
  },
  {
    id: "compliance",
    role: "Compliance",
    description: "Compliance officer",
    icon: "📋",
  },
  {
    id: "client_cxo",
    role: "Client CXO",
    description: "Client executive (external)",
    icon: "🏢",
  },
];

export function WorkflowApprovalChainSection({
  form,
}: Readonly<WorkflowApprovalChainSectionProps>) {
  const selectedApprovers = form.watch("approvalChainSteps") || [];

  const handleApproverToggle = (approverId: string, approverRole: string) => {
    const currentSteps = form.getValues("approvalChainSteps") || [];
    const existingIndex = currentSteps.findIndex(
      (step) => step.approverRole === approverId
    );

    if (existingIndex >= 0) {
      const newSteps = currentSteps.filter((_, index) => index !== existingIndex);
      newSteps.forEach((step, index) => {
        step.stepOrder = index + 1;
      });
      form.setValue("approvalChainSteps", newSteps);
    } else {
      const newStep = {
        stepOrder: currentSteps.length + 1,
        approverRole: approverId,
        description: approverRole,
      };
      form.setValue("approvalChainSteps", [...currentSteps, newStep]);
    }
  };

  const isApproverSelected = (approverId: string) => {
    return selectedApprovers.some((step) => step.approverRole === approverId);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            2
          </div>
          <h3 className="text-md font-semibold">Approval Chain</h3>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Select approvers in order (all selected approvers must approve)
        </p>
      </div>

      <FormField
        control={form.control}
        name="approvalChainSteps"
        render={() => (
          <FormItem>
            <div className="space-y-3">
              {APPROVERS.map((approver) => (
                <ApproverItem
                  key={approver.id}
                  approver={approver}
                  isSelected={isApproverSelected(approver.id)}
                  onToggle={() => handleApproverToggle(approver.id, approver.role)}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedApprovers.length > 0 && (
        <Alert variant="primary" className="border-primary/30">
          <AlertDescription className="text-primary/90">
            <span className="font-medium">Chain Preview:</span> Selected
            approvers will be notified in sequence. If any rejects, the workflow
            returns for rework.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface ApproverItemProps {
  approver: Approver;
  isSelected: boolean;
  onToggle: () => void;
}

function ApproverItem({ approver, isSelected, onToggle }: Readonly<ApproverItemProps>) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
      <Checkbox checked={isSelected} onCheckedChange={onToggle} />
      <button
        type="button"
        className="flex items-start gap-3 flex-1 cursor-pointer text-left bg-transparent border-0 p-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={onToggle}
        aria-label={`Toggle ${approver.role} approval`}
      >
        <div className="text-2xl">{approver.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{approver.role}</div>
          <div className="text-xs text-muted-foreground">
            {approver.description}
          </div>
        </div>
      </button>
    </div>
  );
}
