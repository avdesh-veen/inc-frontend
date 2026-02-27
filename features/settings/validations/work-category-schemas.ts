/**
 * Work Category Validation Schemas
 * 
 * Zod schemas for work category form validation.
 */

import { z } from 'zod';

/**
 * Work Category Form Schema
 */
export const workCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'Category name is required and must be at least 3 characters')
    .max(50, 'Category name must be less than 50 characters')
    .trim(),
  color: z
    .string()
    .min(1, 'Color is required')
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'),
});

/**
 * Infer TypeScript type from schema
 */
export type WorkCategoryFormData = z.infer<typeof workCategorySchema>;

/**
 * Default values for creating a new work category
 */
export const defaultWorkCategoryValues: WorkCategoryFormData = {
  name: '',
  color: '#8B5CF6',
};
