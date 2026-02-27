import z from "zod";

export const approvalWorkflowFormSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  triggerEventId: z.uuid("Trigger event is required"),
  conditions: z.string(),
  slaHours: z.number().min(1, "SLA hours must be at least 1"),
  escalationTarget: z.string().min(1, "Escalation target is required"),
  isActive: z.boolean(),
  approvalChainSteps: z
    .array(
      z.object({
        stepOrder: z.number(),
        approverRole: z.string(),
        description: z.string(),
      }),
    )
    .min(1, "At least one approver must be selected"),
});

export type ApprovalWorkflowFormSchema = z.infer<
  typeof approvalWorkflowFormSchema
>;
