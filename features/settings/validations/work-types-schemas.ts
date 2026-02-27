/**
 * Work Types Validation Schemas
 * 
 * Zod schemas for work type form validation.
 */

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { GateRequirementType, StageStatus, AssignmentRule, ApprovalGate } from '../types/work-types';

/**
 * Gate Requirement Schema
 */
export const gateRequirementSchema = z.object({
  id: z.string().uuid('Invalid gate requirement ID').optional(),
  type: z.nativeEnum(GateRequirementType),
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long').trim(),
  isRequired: z.boolean(),
});

/**
 * Work Type Stage Schema
 */
export const workTypeStageSchema = z.object({
  id: z.string().uuid('Invalid stage ID').optional(),
  name: z.string().min(1, 'Stage name is required').max(50, 'Stage name must be less than 50 characters').trim(),
  status: z.nativeEnum(StageStatus),
  activeTime: z.number().int().min(1, 'Active time must be at least 1 minute'),
  waitTime: z.number().int().min(0, 'Wait time must be 0 or greater'),
  slaTarget: z.number().int().min(1, 'SLA target must be at least 1 hour'),
  assignmentRule: z.nativeEnum(AssignmentRule),
  overrideWarningDays: z.number().int().min(1, 'Warning days must be at least 1').optional(),
  overrideCriticalDays: z.number().int().min(1, 'Critical days must be at least 1').optional(),
  overrideTimeoutThresholds: z.boolean(),
  approvalGate: z.nativeEnum(ApprovalGate).optional().nullable(),
  followUpRuleId: z.string().uuid('Invalid follow-up rule ID').optional().nullable(),
  waitReasonId: z.string().uuid('Invalid wait reason ID').optional().nullable(),
  skillIds: z.array(z.string()).default([]),
  gateRequirements: z.array(gateRequirementSchema).default([]),
}).refine(
  (data) => {
    // If override thresholds is true, validate warning days < critical days
    if (data.overrideTimeoutThresholds && data.overrideWarningDays && data.overrideCriticalDays) {
      return data.overrideWarningDays < data.overrideCriticalDays;
    }
    return true;
  },
  {
    message: 'Warning days must be less than critical days',
    path: ['overrideCriticalDays'],
  }
);

/**
 * Work Type Form Schema
 */
export const workTypeSchema = z.object({
  name: z
    .string()
    .min(3, 'Work type name must be at least 3 characters')
    .max(50, 'Work type name must be less than 50 characters')
    .trim(),
  shortName: z
    .string()
    .max(15, 'Short name must be 15 characters or less')
    .min(1, 'Short name is required'),
  workCategoryId: z.string().min(1, 'Category is required').uuid('Invalid work category ID'),
  slaRuleId: z.string().optional().nullable(),
  description: z
    .string()
    .max(500, 'Description is too long')
    .trim()
    .optional()
    .or(z.literal('')),
  expectedDuration: z
    .number()
    .int('Duration must be a whole number')
    .min(0, 'Duration cannot be negative'),
  complexityLevel: z.enum(['low', 'medium', 'high'], {
    message: 'Complexity level must be low, medium, or high',
  }),
  isActive: z.boolean(),
  version: z.string().optional(),
  providerSignature: z.boolean().optional(),
  psvRequired: z.boolean().optional(),
  workflowStages: z
    .array(workTypeStageSchema)
    .min(1, 'At least one workflow stage is required')
    .refine(
      (stages) => {
        if (!stages || stages.length === 0) return true;
        const names = stages.map((s) => s.name.toLowerCase());
        return new Set(names).size === names.length;
      },
      {
        message: 'Stage names must be unique',
      }
    ),
});

/**
 * Infer TypeScript type from schema and override array fields
 */
export type WorkTypeFormData = Omit<z.infer<typeof workTypeSchema>, 'workflowStages'> & {
  workflowStages: (Omit<z.infer<typeof workTypeStageSchema>, 'skillIds' | 'gateRequirements'> & {
    skillIds: string[];
    gateRequirements: GateRequirementFormData[];
  })[];
};

/**
 * Work Type Stage Form Data
 */
export type WorkTypeStageFormData = Omit<z.infer<typeof workTypeStageSchema>, 'skillIds' | 'gateRequirements'> & {
  skillIds: string[];
  gateRequirements: GateRequirementFormData[];
};

/**
 * Gate Requirement Form Data
 */
export type GateRequirementFormData = z.infer<typeof gateRequirementSchema>;

/**
 * Default values for creating a new work type
 */
export const defaultWorkTypeValues: Partial<WorkTypeFormData> = {
  name: '',
  shortName: '',
  workCategoryId: '',
  slaRuleId: null,
  description: '',
  expectedDuration: 0,
  complexityLevel: 'medium',
  isActive: true,
  version: '1.0',
  providerSignature: false,
  psvRequired: false,
  workflowStages: [],
};

/**
 * Typed resolver for WorkTypeFormData
 * Wraps zodResolver with proper type assertions
 */
export const workTypeFormResolver: Resolver<WorkTypeFormData> = zodResolver(workTypeSchema) as Resolver<WorkTypeFormData>;

/**
 * Typed resolver for WorkTypeStageFormData
 * Wraps zodResolver with proper type assertions
 */
export const workTypeStageFormResolver: Resolver<WorkTypeStageFormData> = zodResolver(workTypeStageSchema) as Resolver<WorkTypeStageFormData>;
