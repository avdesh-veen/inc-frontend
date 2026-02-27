/**
 * Provider Form Validation Schema
 * 
 * Zod validation schema for provider form.
 */

import { z } from 'zod';
import { ProviderType, ProviderStatus, Gender } from '@/features/records/providers/types';

export const providerFormSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  suffix: z.string().optional(),
  credential: z.string().min(1, 'Credential is required'),
  providerType: z.nativeEnum(ProviderType, { message: 'Provider type is required' }),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z.date().optional(),

  // Credentials
  npi: z.string().min(10, 'NPI must be 10 digits').max(10, 'NPI must be 10 digits'),
  deaNumber: z.string().optional(),
  taxId: z.string().optional(),
  ssn: z.string().optional(),
  caqhId: z.string().optional(),

  // State Licenses
  stateLicenses: z.array(
    z.object({
      state: z.string().min(2, 'State is required'),
      licenseNumber: z.string().min(1, 'License number is required'),
      licenseType: z.string().min(1, 'License type is required'),
      issueDate: z.date().optional(),
      expirationDate: z.date().optional(),
      status: z.enum(['Active', 'Expired', 'Suspended']).default('Active'),
    })
  ).optional(),

  // Specialty
  primarySpecialty: z.string().min(1, 'Primary specialty is required'),
  secondarySpecialties: z.array(z.string()).optional(),
  boardCertifications: z.array(z.string()).optional(),

  // Communication
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  fax: z.string().optional(),

  // Relationships
  clientIds: z.array(z.string()).optional(),
  departmentId: z.string().optional(),
  businessEntityId: z.string().optional(),
  organizationalAffiliations: z.string().optional(),

  // Locations
  locations: z.array(
    z.object({
      locationName: z.string().min(1, 'Location name is required'),
      addressLine1: z.string().min(1, 'Address is required'),
      addressLine2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(2, 'State is required'),
      zip: z.string().min(5, 'ZIP code is required'),
      phone: z.string().optional(),
      fax: z.string().optional(),
      isPrimary: z.boolean().default(false),
    })
  ).min(1, 'At least one location is required'),

  // Status
  status: z.nativeEnum(ProviderStatus, { message: 'Status is required' }),
}).refine(
  (data) => {
    // Ensure at least one location is marked as primary
    if (data.locations && data.locations.length > 0) {
      return data.locations.some((location) => location.isPrimary);
    }
    return true;
  },
  {
    message: 'At least one location must be marked as primary',
    path: ['locations'],
  }
);

export type ProviderFormValues = z.infer<typeof providerFormSchema>;