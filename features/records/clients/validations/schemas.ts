/**
 * Client Management Validation Schemas
 * 
 * Zod schemas for validating client data in forms and API requests.
 * Implements all validation rules from the specification.
 */

import { z } from 'zod';
import { ClientType, ClientTier, ClientStatus } from '@/features/records/clients/types';

/**
 * Regex patterns for validation
 */
const TAX_ID_PATTERN = /^\d{2}-\d{7}$/;
const NPI_PATTERN = /^\d{10}$/;
const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;
const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
const URL_PATTERN = /^https?:\/\/.+/;

/**
 * Validates Tax ID first two digits (01-99, excluding 00, 07, 08, 09)
 */
const isValidTaxIdPrefix = (taxId: string): boolean => {
  const prefix = taxId.substring(0, 2);
  const prefixNum = parseInt(prefix, 10);
  
  if (prefixNum === 0 || prefixNum === 7 || prefixNum === 8 || prefixNum === 9) {
    return false;
  }
  
  return prefixNum >= 1 && prefixNum <= 99;
};

/**
 * Contact schema for API payload
 */
export const contactSchema = z.object({
  contactType: z.enum(['primary', 'billing']),
  contactName: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be at most 50 characters'),
  title: z.string().max(100, 'Title must be at most 100 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(PHONE_PATTERN, 'Invalid phone format').optional().or(z.literal(''))
});

/**
 * Optional billing contact schema (allows empty fields)
 */
export const billingContactSchema = z.object({
  contactType: z.enum(['primary', 'billing']),
  contactName: z.string()
    .refine(
      (val) => !val || val === '' || val.length >= 3,
      { message: 'Name must be at least 3 characters' }
    )
    .refine(
      (val) => !val || val === '' || val.length <= 50,
      { message: 'Name must be at most 50 characters' }
    )
    .optional()
    .or(z.literal('')),
  title: z.string().max(100, 'Title must be at most 100 characters').optional().or(z.literal('')),
  email: z.string()
    .refine(
      (val) => !val || val === '' || z.string().email().safeParse(val).success,
      { message: 'Invalid email format' }
    )
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .refine(
      (val) => !val || val === '' || PHONE_PATTERN.test(val),
      { message: 'Invalid phone format' }
    )
    .optional()
    .or(z.literal(''))
}).refine(
  (data) => {
    // If any billing contact field is filled, email must be provided
    const hasAnyField = data.contactName || data.title || data.phone;
    if (hasAnyField && !data.email) {
      return false;
    }
    return true;
  },
  {
    message: 'Email is required when billing contact information is provided',
    path: ['email']
  }
);

/**
 * Address schema for API payload
 */
export const addressSchema = z.object({
  streetAddress: z.string()
    .min(1, 'Street address is required')
    .max(500, 'Street address must be at most 500 characters'),
  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City must be at most 100 characters'),
  stateId: z.string().uuid('Invalid state ID'),
  zip: z.string()
    .regex(ZIP_PATTERN, 'ZIP code must be 5 or 9 digits (e.g., 12345 or 12345-6789)')
});

/**
 * Base client schema without refinements (for partial operations)
 */
const baseClientSchema = z.object({
  organizationName: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be at most 100 characters'),
  dbaName: z.string().max(200).optional().or(z.literal('')),
  type: z.enum(['large', 'midSize', 'smallGroup'], {
    message: 'Please select a valid client type',
  }),
  taxId: z.string()
    .regex(TAX_ID_PATTERN, 'Tax ID must be in format XX-XXXXXXX')
    .length(10, 'Tax ID must be exactly 10 characters (XX-XXXXXXX)')
    .refine((val) => isValidTaxIdPrefix(val), {
      message: 'Tax ID first two digits must be 01-99 (excluding 00, 07, 08, 09)',
    }),
  npi: z.string()
    .regex(NPI_PATTERN, 'NPI must be exactly 10 digits'),
  mainPhone: z.string()
    .regex(PHONE_PATTERN, 'Invalid phone format')
    .optional()
    .or(z.literal('')),
  mainEmail: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url({
      protocol: /^https?$/, // Restricts to 'http:' or 'https:' protocols
      hostname: z.regexes.domain, // Ensures a valid domain name format
    })
    .optional()
    .or(z.literal('')),
  address: addressSchema,
  accountTier: z.enum(['platinum', 'diamond', 'gold', 'silver', 'bronze'], {
    message: 'Please select a valid tier',
  }),
  accountManagerId: z.string().uuid('Invalid account manager'),
  contractStartDate: z.string().optional().or(z.literal('')),
  contractEndDate: z.string().optional().or(z.literal('')),
  portalAccess: z.boolean().default(false),
  isActive: z.boolean().default(true),
  internalNotes: z.string()
    .max(2000, 'Internal notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  activityNote: z.string()
    .min(1, 'Activity note is required for audit trail')
    .max(1000, 'Activity note must be at most 1000 characters'),
  contacts: z.array(
    z.object({
      contactType: z.enum(['primary', 'billing']),
      contactName: z.string(),
      title: z.string().optional().or(z.literal('')),
      email: z.string(),
      phone: z.string().optional().or(z.literal(''))
    })
  ).min(1, 'At least one contact is required')
  .superRefine((contacts, ctx) => {
    contacts.forEach((contact, index) => {
      if (contact.contactType === 'primary') {
        // Primary contact validations
        if (!contact.contactName || contact.contactName.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Name must be at least 3 characters',
            path: [index, 'contactName']
          });
        }
        if (contact.contactName && contact.contactName.length > 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Name must be at most 50 characters',
            path: [index, 'contactName']
          });
        }
        if (!contact.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Email is required',
            path: [index, 'email']
          });
        } else if (!z.string().email().safeParse(contact.email).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid email format',
            path: [index, 'email']
          });
        }
        if (contact.phone && !PHONE_PATTERN.test(contact.phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone format',
            path: [index, 'phone']
          });
        }
        if (contact.title && contact.title.length > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Title must be at most 100 characters',
            path: [index, 'title']
          });
        }
      } else if (contact.contactType === 'billing') {
        // Billing contact validations (optional but validated when provided)
        const hasAnyField = contact.contactName || contact.title || contact.phone || contact.email;
        
        if (contact.contactName && contact.contactName.length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Name must be at least 3 characters',
            path: [index, 'contactName']
          });
        }
        if (contact.contactName && contact.contactName.length > 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Name must be at most 50 characters',
            path: [index, 'contactName']
          });
        }
        if (contact.email && !z.string().email().safeParse(contact.email).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid email format',
            path: [index, 'email']
          });
        }
        if (contact.phone && !PHONE_PATTERN.test(contact.phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone format',
            path: [index, 'phone']
          });
        }
        if (contact.title && contact.title.length > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Title must be at most 100 characters',
            path: [index, 'title']
          });
        }
        
        // If any billing field is filled, email is required
        if (hasAnyField && !contact.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Email is required when billing contact information is provided',
            path: [index, 'email']
          });
        }
      }
    });
  })
});

/**
 * Schema for creating a new client (API payload format)
 */
export const createClientSchema = baseClientSchema.refine(
  (data) => {
    // Validate that contract end date is after start date
    if (data.contractStartDate && data.contractEndDate) {
      return new Date(data.contractEndDate) > new Date(data.contractStartDate);
    }
    return true;
  },
  {
    message: 'Contract end date must be after start date',
    path: ['contractEndDate']
  }
);

/**
 * Schema for updating an existing client (API payload format)
 */
export const updateClientSchema = baseClientSchema.partial().extend({
  activityNote: z.string().max(1000).optional()
}).refine(
  (data) => {
    // Validate that contract end date is after start date
    if (data.contractStartDate && data.contractEndDate) {
      return new Date(data.contractEndDate) > new Date(data.contractStartDate);
    }
    return true;
  },
  {
    message: 'Contract end date must be after start date',
    path: ['contractEndDate']
  }
);

/**
 * Schema for duplicate check request
 */
export const duplicateCheckSchema = z.object({
  taxId: z.string()
    .regex(TAX_ID_PATTERN, 'Tax ID must be in format XX-XXXXXXX')
    .refine((val) => isValidTaxIdPrefix(val), {
      message: 'Tax ID first two digits must be 01-99 (excluding 00, 07, 08, 09)',
    }),
  organizationName: z.string().min(2).max(200)
});

/**
 * Schema for status change request
 */
export const statusChangeSchema = z.object({
  status: z.nativeEnum(ClientStatus),
  activityNote: z.string().min(1, 'Activity note is required for status changes')
});

/**
 * Schema for document upload
 */
export const documentUploadSchema = z.object({
  type: z.enum(['Contract', 'BAA', 'W-9', 'Other'], {
    message: 'Please select a valid document type',
  }),
  file: z.instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= 25 * 1024 * 1024, 'File size must be less than 25MB')
    .refine(
      (file) => {
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/png',
          'image/jpeg'
        ];
        return validTypes.includes(file.type);
      },
      'File must be PDF, DOC, DOCX, XLS, XLSX, PNG, or JPG'
    )
});

/**
 * Schema for client list query parameters
 */
export const clientListParamsSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(ClientType).optional(),
  tier: z.nativeEnum(ClientTier).optional(),
  portalStatus: z.enum(['enabled', 'disabled']).optional(),
  sortBy: z.enum([
    'organizationName',
    'tier',
    'providerCount',
    'estimatedRevenue',
    'avgTat',
    'portalEnabled',
    'healthScore'
  ]).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(25)
});

/**
 * Type inference helpers
 */
export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type DuplicateCheckData = z.infer<typeof duplicateCheckSchema>;
export type StatusChangeData = z.infer<typeof statusChangeSchema>;
export type DocumentUploadData = z.infer<typeof documentUploadSchema>;
export type ClientListParams = z.infer<typeof clientListParamsSchema>;
