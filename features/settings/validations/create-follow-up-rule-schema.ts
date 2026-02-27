import { z } from "zod";

const chaseTouchSchema = z.object({
  daysAfterTrigger: z
    .number({ error: "Days must be a number" })
    .int("Days must be a whole number")
    .min(1, "Days must be at least 1")
    .max(365, "Days must be at most 365"),
  channel: z.string().min(1, "Channel is required"),
  priority: z.string().min(1, "Priority is required"),
  assignTo: z.string().min(1, "Assign to is required"),
  taskName: z
    .string()
    .min(1, "Task name is required")
    .max(100, "Task name must be at most 100 characters"),
});

export const createFollowUpRuleFormSchema = z.object({
  name: z
    .string()
    .min(3, "Rule name must be at least 3 characters")
    .max(100, "Rule name must be at most 100 characters"),
  description: z.string().max(250, "Description must be at most 250 characters"),
  categories: z.array(z.string()),
  active: z.boolean(),
  triggerEvent: z.string().min(1, "Trigger event is required"),
  payerType: z.string(),
  state: z.string(),
  touches: z
    .array(chaseTouchSchema)
    .min(1, "At least one chase touch is required"),
  taskType: z.string().min(1, "Task type is required"),
  estMins: z
    .number({ error: "Est. minutes must be a number" })
    .int("Est. minutes must be a whole number")
    .min(1, "Est. minutes must be at least 1")
    .max(1440, "Est. minutes must be at most 1440"),
  escalationEnabled: z.boolean(),
  escalateAfter: z.string(),
  escalateTo: z.string(),
  requiresApproval: z.boolean(),
  autoCloseEnabled: z.boolean(),
  autoCloseDays: z
    .number({ error: "After days must be a number" })
    .int("After days must be a whole number")
    .min(1, "After days must be at least 1")
    .max(365, "After days must be at most 365"),
  maxAttempts: z
    .number({ error: "Max attempts must be a number" })
    .int("Max attempts must be a whole number")
    .min(1, "Max attempts must be at least 1")
    .max(20, "Max attempts must be at most 20"),
  payerOverrides: z.array(
    z.object({
      payerId: z.string().min(1),
      overrideDays: z.number().min(1).max(90),
      overrideChannel: z.string(),
      reason: z.string(),
    }),
  ),
  notifyOnCreate: z.boolean(),
  notifyOnEscalation: z.boolean(),
  notifyClient: z.boolean(),
});

export type CreateFollowUpRuleFormInput = z.infer<typeof createFollowUpRuleFormSchema>;
