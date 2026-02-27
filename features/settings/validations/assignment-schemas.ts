/**
 * Assignment Module Validation Schemas
 * 
 * Zod schemas for validating assignment-related forms and data.
 */

import { z } from 'zod';
import {
  PayerType,
  ClientTier,
  RoutingAssignmentMode,
  RoutingSkills,
  MinProficiency,
} from '@/features/settings/types/assignment';

// ============================================================================
// Assignment Mode Schema
// ============================================================================

export const assignmentModeSchema = z.enum([
  'roundRobin',
  'loadBalance',
  'manual',
]);

// ============================================================================
// Assignment Mode Update Schema
// ============================================================================

/**
 * Schema for updating assignment mode preferences via PATCH API
 * Matches the API request body exactly
 */
export const assignmentModeUpdateSchema = z.object({
  considerAnalystAvailability: z.boolean().optional(),
  preferRecentTaskAnalyst: z.boolean().optional(),
  autoReassignOnAbsence: z.boolean().optional(),
  clientAffinityEnabled: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type AssignmentModeUpdateFormData = z.infer<typeof assignmentModeUpdateSchema>;

/**
 * Extended schema for the form that includes type selection
 */
export const assignmentModeFormSchema = z.object({
  type: assignmentModeSchema,
  considerAnalystAvailability: z.boolean(),
  preferRecentTaskAnalyst: z.boolean(),
  autoReassignOnAbsence: z.boolean(),
  clientAffinityEnabled: z.boolean(),
});

export type AssignmentModeFormData = z.infer<typeof assignmentModeFormSchema>;

// ============================================================================
// Legacy Assignment Preferences Schema (kept for backward compatibility)
// ============================================================================

export const assignmentPreferencesSchema = z.object({
  respectWorkload: z.boolean(),
  respectSkillLevel: z.boolean(),
  allowReassignment: z.boolean(),
  considerAvailability: z.boolean(),
  prioritizeExperience: z.boolean(),
  balanceTeamLoad: z.boolean(),
  preferRecentRelated: z.boolean(),
  autoReassignOnAbsence: z.boolean(),
  enableClientAffinity: z.boolean(),
});

// ============================================================================
// Legacy Assignment Configuration Schema
// ============================================================================

export const assignmentConfigurationSchema = z.object({
  mode: assignmentModeSchema,
  preferences: assignmentPreferencesSchema,
});

export type AssignmentConfigurationFormData = z.infer<typeof assignmentConfigurationSchema>;

// ============================================================================
// Routing Rule Schema
// ============================================================================

export const routingRuleSchema = z.object({
  rulePriority: z
    .number()
    .min(1, 'Priority must be at least 1')
    .max(99, 'Priority must be at most 99'),
  workCategory: z.string().uuid('Invalid work category').nullable().optional(),
  payerType: z.nativeEnum(PayerType, {
    message: 'Payer type is required',
  }),
  clientTier: z.nativeEnum(ClientTier, {
    message: 'Client tier is required',
  }),
  isUrgent: z.boolean(),
  routingSkills: z.nativeEnum(RoutingSkills, {
    message: 'Routing skills are required',
  }),
  minProficiency: z.nativeEnum(MinProficiency, {
    message: 'Minimum proficiency is required',
  }),
  assignmentMode: z.nativeEnum(RoutingAssignmentMode, {
    message: 'Assignment mode is required',
  }),
  isActive: z.boolean(),
});

export type RoutingRuleFormData = z.infer<typeof routingRuleSchema>;

// ============================================================================
// Capacity Settings Schema
// ============================================================================

export const capacitySettingsSchema = z.object({
  maxTasksAllowed: z
    .number()
    .min(5, 'Maximum tasks allowed must be at least 5')
    .max(50, 'Maximum tasks allowed must be at most 50'),
  maxActiveTasksPerAnalyst: z
    .number()
    .min(1, 'Max active tasks per analyst must be at least 1')
    .max(30, 'Max active tasks per analyst must be at most 30'),
  warningThresholdPercent: z
    .number()
    .min(50, 'Warning threshold must be at least 50%')
    .max(100, 'Warning threshold must be at most 100%'),
  enableForecastingAlerts: z.boolean(),
  forecastHorizonDays: z
    .number()
    .min(1, 'Forecast horizon must be at least 1 day')
    .max(30, 'Forecast horizon must be at most 30 days'),
});

export type CapacitySettingsFormData = z.infer<typeof capacitySettingsSchema>;
