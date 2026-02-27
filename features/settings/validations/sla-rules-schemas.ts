/**
 * SLA Rules Validation Schemas
 * 
 * Zod validation schemas for SLA rules forms.
 */

import { z } from 'zod';

// ============================================================================
// SLA Target Schema
// ============================================================================

/**
 * SLA target creation/edit schema.
 * Work Category (workTypeCategoryId) is required. Request Type (workTypeId) is optional.
 */
export const slaTargetSchema = z
  .object({
    workTypeCategoryId: z.string().min(1, 'Work category is required'),
    workTypeId: z.string(),
    targetDays: z
      .number()
      .min(1, 'Target days must be at least 1')
      .max(365, 'Target days cannot exceed 365'),
    warningDays: z
      .number()
      .min(1, 'Warning days must be at least 1')
      .max(365, 'Warning days cannot exceed 365'),
    criticalDays: z
      .number()
      .min(1, 'Critical days must be at least 1')
      .max(365, 'Critical days cannot exceed 365'),
    useBusiness: z.boolean(),
    pauseSlaWhenHold: z.boolean(),
  })
  .refine(
    (data) => data.warningDays < data.targetDays,
    {
      message: 'Warning days must be less than target days',
      path: ['warningDays'],
    }
  )
  .refine(
    (data) => data.criticalDays < data.targetDays,
    {
      message: 'Critical days must be less than target days',
      path: ['criticalDays'],
    }
  )
  .refine(
    (data) => data.warningDays < data.criticalDays,
    {
      message: 'Warning days must be less than critical days',
      path: ['warningDays'],
    }
  );

/**
 * Infer SLA target form type from schema
 */
export type SLATargetFormValues = z.infer<typeof slaTargetSchema>;

// ============================================================================
// SLA Override Schema
// ============================================================================

/**
 * SLA override creation/edit schema
 */
export const slaOverrideSchema = z.object({
  workTypeId: z.string().min(1, 'Request type is required'),
  clientIds: z.array(z.string()),
  payerIds: z.array(z.string()),
  overrideTargetDays: z
    .number()
    .min(1, 'Override target must be at least 1')
    .max(365, 'Override target cannot exceed 365'),
  overrideWarningDays: z
    .number()
    .min(1, 'Warning days must be at least 1')
    .max(365, 'Warning days cannot exceed 365'),
  overrideCriticalDays: z
    .number()
    .min(1, 'Critical days must be at least 1')
    .max(365, 'Critical days cannot exceed 365'),
  reason: z
    .string()
    .min(3, 'Reason must be at least 3 characters')
    .max(250, 'Reason cannot exceed 250 characters'),
}).superRefine((data, ctx) => {
  if (data.clientIds.length === 0 && data.payerIds.length === 0) {
    const msg = 'At least one client or payer must be selected';
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['clientIds'] });
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['payerIds'] });
  }
}).refine(
  (data) => data.overrideWarningDays < data.overrideTargetDays,
  {
    message: 'Warning days must be less than target days',
    path: ['overrideWarningDays'],
  }
).refine(
  (data) => data.overrideCriticalDays < data.overrideTargetDays,
  {
    message: 'Critical days must be less than target days',
    path: ['overrideCriticalDays'],
  }
).refine(
  (data) => data.overrideWarningDays < data.overrideCriticalDays,
  {
    message: 'Warning days must be less than critical days',
    path: ['overrideWarningDays'],
  }
);

/**
 * Infer SLA override form type from schema
 */
export type SLAOverrideFormValues = z.infer<typeof slaOverrideSchema>;

// ============================================================================
// Escalation Rules Schema
// ============================================================================

/**
 * Escalation rules update schema
 */
export const escalationRulesSchema = z.object({
  autoEscalateAtWarning: z.boolean(),
  autoEscalateAtCritical: z.boolean(),
  notifyManager: z.boolean(),
  notifyClient: z.boolean(),
});

/**
 * Infer escalation rules form type from schema
 */
export type EscalationRulesFormValues = z.infer<typeof escalationRulesSchema>;

// ============================================================================
// FPR Metrics Schema
// ============================================================================

/**
 * FPR target rates schema
 */
export const fprTargetRatesSchema = z.object({
  documentVerification: z
    .number()
    .min(0, 'Rate must be at least 0%')
    .max(100, 'Rate cannot exceed 100%'),
  applicationBuild: z
    .number()
    .min(0, 'Rate must be at least 0%')
    .max(100, 'Rate cannot exceed 100%'),
  enrollmentSubmission: z
    .number()
    .min(0, 'Rate must be at least 0%')
    .max(100, 'Rate cannot exceed 100%'),
  payerSubmission: z
    .number()
    .min(0, 'Rate must be at least 0%')
    .max(100, 'Rate cannot exceed 100%'),
});

/**
 * FPR tracking dimensions schema
 */
export const fprTrackingDimensionsSchema = z.object({
  workType: z.boolean(),
  analyst: z.boolean(),
  client: z.boolean(),
  payer: z.boolean(),
  complexity: z.boolean(),
  month: z.boolean(),
  auditor: z.boolean(),
  location: z.boolean(),
});

/**
 * FPR metrics update schema
 */
export const fprMetricsSchema = z.object({
  targetRates: fprTargetRatesSchema.optional(),
  trackingDimensions: fprTrackingDimensionsSchema.optional(),
});

/**
 * Infer FPR metrics form type from schema
 */
export type FPRMetricsFormValues = z.infer<typeof fprMetricsSchema>;
