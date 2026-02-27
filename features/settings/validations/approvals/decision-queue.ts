import z from "zod";

export const decisionQueueFormSchema = z.object({
  enableDecisionQueue: z.boolean(),
  businessHoursStart: z.string(),
  businessHoursEnd: z.string(),
  autoEscalateAfterSlaBreachHours: z.number(),
  maxReturnsBeforeEscalation: z.number(),
});

export type DecisionQueueFormSchema = z.infer<typeof decisionQueueFormSchema>;
