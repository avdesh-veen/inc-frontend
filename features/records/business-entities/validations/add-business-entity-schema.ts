import { z } from "zod";

const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
const URL_PATTERN = /^https?:\/\/.+/;
const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;
const NPI_PATTERN = /^\d{10}$/;

export const addBusinessEntitySchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  entityName: z.string().min(1, "Entity name is required"),
  dba: z.string().optional().or(z.literal("")),
  entityType: z.string().min(1, "Please select an entity type"),
  taxId: z.string().min(1, "Tax ID is required"),
  npi2: z
    .string()
    .regex(NPI_PATTERN, "NPI-2 must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "pending", "inactive"]),
  phone: z
    .string()
    .regex(PHONE_PATTERN, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  fax: z
    .string()
    .regex(PHONE_PATTERN, "Invalid fax format")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .regex(URL_PATTERN, "Website must be a valid URL starting with http:// or https://")
    .optional()
    .or(z.literal("")),
  contactName: z.string().optional().or(z.literal("")),
  contactTitle: z.string().optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zip: z
    .string()
    .regex(ZIP_PATTERN, "ZIP code must be 5 or 9 digits (e.g., 12345 or 12345-6789)")
    .optional()
    .or(z.literal("")),
  activityNote: z.string().min(1, "Activity note is required for audit trail"),
});

export type AddBusinessEntityFormValues = z.infer<typeof addBusinessEntitySchema>;

export const addBusinessEntityDefaultValues: AddBusinessEntityFormValues = {
  clientId: "",
  entityName: "",
  dba: "",
  entityType: "",
  taxId: "",
  npi2: "",
  status: "active",
  phone: "",
  fax: "",
  email: "",
  website: "",
  contactName: "",
  contactTitle: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  activityNote: "",
};
