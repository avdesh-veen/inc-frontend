import { z } from "zod";
import { triggerEventTypeSchema } from "@/features/settings/types/trigger-events";

export const triggerEventFormSchema = z.object({
    code: z.string()
      .min(1, 'Event code is required')
      .max(100, 'Event code must be less than 100 characters')
      .regex(/^[a-z_]+$/, 'Code must be lowercase letters and underscores only'),
    name: z.string()
      .min(2, 'Event name must be at least 2 characters')
      .max(200, 'Event name must be less than 200 characters'),
    description: z.string().max(100, 'Description must be less than 100 characters'),
    type: triggerEventTypeSchema,
    firedBy: z.string().max(200, 'Fired by must be less than 200 characters'),
    isActive: z.boolean(),
    daysBeforeExpiry: z.number().int().min(1).max(365).optional(),
    workCategoryIds: z.array(z.string().uuid())
      .min(1, 'At least one work category is required')
      .max(10, 'Maximum 10 work categories allowed'),
  }).refine(
    (data) => {
      // daysBeforeExpiry is required only when type is 'scheduled'
      if (data.type === 'scheduled') {
        return data.daysBeforeExpiry !== undefined && data.daysBeforeExpiry !== null;
      }
      return true;
    },
    {
      message: 'Days before expiry is required for scheduled events',
      path: ['daysBeforeExpiry'],
    }
  );

export type TriggerEventFormData = z.infer<typeof triggerEventFormSchema>;
