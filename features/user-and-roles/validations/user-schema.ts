import { z } from "zod";

import { BG_CHECK_STATUS_VALUES } from "../types/user-tab";

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or fewer"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or fewer"),
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email address is required"),
  roleId: z.string().min(1, "Role is required"),
  workLocationId: z.string().min(1, "Work location is required"),

  status: z.enum(["active", "inactive", "on_leave"], {
    message: "Status is required",
  }),
  teamId: z.string().optional(),
  supervisorId: z.string().optional(),
  offshoreRestriction: z.boolean(),
  userSkills: z.array(z.string()),

  ndaSignDate: z.string().optional(),
  bgCheckDate: z.string().optional(),
  bgCheckStatus: z.enum(["", ...BG_CHECK_STATUS_VALUES]).optional(),
  hipaaTrainingDate: z.string().optional(),
  hipaaTrainingExpiry: z.string().optional(),
  securityAwarenessDate: z.string().optional(),
  lastComplianceReviewDate: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
