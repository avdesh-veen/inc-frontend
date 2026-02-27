/**
 * Provider Management Types
 * 
 * Type definitions for the Provider Management feature.
 * Includes interfaces for providers, credentials, licenses, and related entities.
 */

/**
 * Provider type classification
 */
export enum ProviderType {
  PHYSICIAN = 'Physician',
  NURSE_PRACTITIONER = 'Nurse Practitioner',
  PHYSICIAN_ASSISTANT = 'Physician Assistant',
  DENTIST = 'Dentist',
  PODIATRIST = 'Podiatrist',
  PSYCHOLOGIST = 'Psychologist',
  CHIROPRACTOR = 'Chiropractor',
  OPTOMETRIST = 'Optometrist',
  OTHER = 'Other'
}

/**
 * Gender options
 */
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NON_BINARY = 'Non-Binary',
  PREFER_NOT_TO_SAY = 'Prefer not to say'
}

/**
 * Provider lifecycle status
 */
export enum ProviderStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending'
}

/**
 * State license information
 */
export interface StateLicense {
  id: string;
  state: string;
  licenseNumber: string;
  licenseType: string;
  issueDate: Date | null;
  expirationDate: Date | null;
  status: 'Active' | 'Expired' | 'Suspended';
}

/**
 * Provider practice location
 */
export interface ProviderLocation {
  id: string;
  locationName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  fax: string | null;
  isPrimary: boolean;
}

/**
 * Provider entity representing a healthcare provider
 */
export interface Provider {
  // Core identification
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  displayName: string;
  
  // Credentials
  credential: string;
  npi: string;
  deaNumber: string | null;
  taxId: string | null;
  ssn: string | null;
  
  // Provider Type & Demographics
  providerType: ProviderType;
  gender: Gender | null;
  dateOfBirth: Date | null;
  
  // Specialty & Practice
  primarySpecialty: string;
  secondarySpecialties: string[];
  boardCertifications: string[];
  
  // Communication
  email: string;
  phone: string | null;
  fax: string | null;
  
  // Status & Workflow
  status: ProviderStatus;
  
  // Relationships
  clientIds: string[];
  departmentId: string | null;
  businessEntityId: string | null;
  
  // Organizational
  organizationalAffiliations: string[];
  
  // State Licenses (multiple)
  stateLicenses: StateLicense[];
  
  // Locations (multiple)
  locations: ProviderLocation[];
  
  // CAQH (placeholder for future)
  caqhId: string | null;
  
  // Audit fields
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  
  // Computed/Display fields
  responsiveness?: number;
  nextLicenseExpiration?: Date;
  alertCount?: number;
}

/**
 * Request payload for creating a new provider
 */
export interface CreateProviderRequest {
  // Basic Information
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  credential: string;
  providerType: ProviderType;
  gender?: Gender;
  dateOfBirth?: Date;
  
  // Credentials
  npi: string;
  deaNumber?: string;
  taxId?: string;
  ssn?: string;
  
  // Specialty
  primarySpecialty: string;
  secondarySpecialties?: string[];
  boardCertifications?: string[];
  
  // Communication
  email: string;
  phone?: string;
  fax?: string;
  
  // Status
  status: ProviderStatus;
  
  // Relationships
  clientIds?: string[];
  departmentId?: string;
  businessEntityId?: string;
  organizationalAffiliations?: string[];
  
  // Licenses
  stateLicenses?: Omit<StateLicense, 'id'>[];
  
  // Locations
  locations?: Omit<ProviderLocation, 'id'>[];
  
  // CAQH
  caqhId?: string;
}

/**
 * Request payload for updating an existing provider
 */
export interface UpdateProviderRequest extends Partial<CreateProviderRequest> {
  id: string;
}

/**
 * Query parameters for provider list endpoint
 */
export interface ProviderListParams {
  search?: string;
  alert?: string;
  clientId?: string;
  departmentId?: string;
  businessEntityId?: string;
  status?: ProviderStatus;
  sortBy?: ProviderSortField;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Fields that can be sorted in provider list
 */
export type ProviderSortField =
  | 'displayName'
  | 'specialty'
  | 'department'
  | 'status'
  | 'licenseExpiration';

/**
 * Response from provider list endpoint
 */
export interface ProviderListResponse {
  providers: Provider[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Document uploaded for a provider
 */
export interface ProviderDocument {
  id: string;
  providerId: string;
  name: string;
  type: 'License' | 'Certification' | 'DEA' | 'CV/Resume' | 'Other';
  uploadedAt: Date;
  uploadedBy: string;
  size: number;
  url: string;
  fileType: 'pdf' | 'docx';
}

/**
 * Activity log entry for a provider
 */
export interface ProviderActivity {
  id: string;
  timestamp: Date;
  action: string;
  performedBy: string;
  details?: string;
  relatedEntityType?: 'credential' | 'document' | 'location' | 'client';
  relatedEntityId?: string;
}
