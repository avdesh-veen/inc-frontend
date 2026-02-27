/**
 * Skill Form Validation Schema
 *
 * Zod schema and types for skill form validation.
 * Field names match the backend API.
 */

import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(100, "Skill name must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  categoryId: z.string().min(1, "Category is required"),
  minimumProficiency: z.enum(["trainee", "competent", "expert"]),
  requiresCertification: z.boolean(),
  certificationValidity: z.number().min(1).max(60).optional().nullable(),
  isActive: z.boolean(),
  skillWorkTypes: z.array(z.string()),
});

export type SkillFormData = z.infer<typeof skillSchema>;
