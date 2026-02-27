/**
 * Client Management Types
 * 
 * Type definitions for the Client Management feature.
 * Includes interfaces for clients, contacts, and related entities.
 */

/**
 * Contact information from API response
 */
export interface ContactResponse {
  id: string;
  contactType: 'primary' | 'billing';
  contactName: string;
  title: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Address information from API response
 */
export interface AddressResponse {
  streetAddress: string;
  city: string;
  stateId: string;
  zip: string;
  state: string;
  stateCode: string;
}

/**
 * Contact information for primary and billing contacts (legacy)
 */
export interface Contact {
  name: string;
  title: string | null;
  email: string;
  phone: string | null;
}

/**
 * Contact payload for API requests
 */
export interface ContactPayload {
  contactType: 'primary' | 'billing';
  contactName: string;
  title?: string | null;
  email: string;
  phone?: string | null;
}

/**
 * Address payload for API requests
 */
export interface AddressPayload {
  streetAddress: string;
  city: string;
  stateId: string;
  zip: string;
}

/**
 * Client organization entity (API response)
 */
export interface Client {
  id: string;
  organizationName: string;
  dbaName: string | null;
  type: string;
  taxId: string;
  npi: string | null;
  mainPhone: string | null;
  mainEmail: string | null;
  website: string | null;
  address: AddressResponse;
  accountTier: string;
  contractStartDate: string | null;
  contractEndDate: string | null;
  estAnnualRevenue: number | null;
  portalAccess: boolean;
  isActive: boolean;
  internalNotes: string | null;
  healthScore: number | null;
  accountManagerId: string | null;
  activityNote: string;
  contacts: ContactResponse[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * Client type based on organization size
 */
export enum ClientType {
  LARGE = 'Large',
  MID_SIZE = 'Mid-size',
  SMALL_GROUP = 'Small Group'
}

/**
 * Client tier levels for service classification
 */
export enum ClientTier {
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze'
}

/**
 * Client lifecycle status
 */
export enum ClientStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  ARCHIVED = 'Archived'
}

/**
 * Provider status
 */
export enum ProviderStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  INACTIVE = 'Inactive'
}

/**
 * Enrollment request type
 */
export enum EnrollmentType {
  INITIAL_ENROLLMENT = 'Initial Enrollment',
  ADD_LOCATION = 'Add Location',
  ADD_PAYER = 'Add Payer'
}

/**
 * Enrollment request status
 */
export enum EnrollmentStatus {
  IN_PROGRESS = 'In Progress',
  PENDING_PAYER = 'Pending Payer',
  SUBMITTED = 'Submitted',
  COMPLETED = 'Completed'
}

/**
 * Document type
 */
export enum DocumentType {
  CONTRACT = 'Contract',
  BAA = 'BAA',
  W9 = 'W-9',
  OTHER = 'Other'
}

/**
 * Portal user role
 */
export enum PortalUserRole {
  CLIENT_ADMIN = 'Client Admin',
  PROVIDER = 'Provider'
}

/**
 * Activity entity type
 */
export enum ActivityEntityType {
  PROVIDER = 'provider',
  ENROLLMENT = 'enrollment',
  DOCUMENT = 'document',
  USER = 'user'
}

/**
 * Request payload for creating a new client
 */
export interface CreateClientRequest {
  organizationName: string;
  dbaName?: string;
  type: string;
  taxId: string;
  npi?: string;
  mainPhone?: string;
  mainEmail?: string;
  website?: string;
  address: AddressPayload;
  accountTier: string;
  accountManagerId?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  portalAccess: boolean;
  isActive: boolean;
  internalNotes?: string;
  activityNote: string;
  contacts: ContactPayload[];
}

/**
 * Request payload for updating an existing client
 */
export interface UpdateClientRequest {
  organizationName?: string;
  dbaName?: string;
  type?: string;
  taxId?: string;
  npi?: string;
  mainPhone?: string;
  mainEmail?: string;
  website?: string;
  address?: AddressPayload;
  accountTier?: string;
  accountManagerId?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  portalAccess?: boolean;
  isActive?: boolean;
  internalNotes?: string;
  activityNote?: string;
  contacts?: ContactPayload[];
}

/**
 * Response from duplicate check endpoint
 */
export interface DuplicateCheckResponse {
  taxIdMatch: {
    exists: boolean;
    clientId?: string;
    clientName?: string;
  };
  nameMatch: {
    exists: boolean;
    clientId?: string;
    similarity?: number;
  };
}

/**
 * Query parameters for client list endpoint
 */
export interface ClientListParams {
  search?: string;
  type?: ClientType;
  tier?: ClientTier;
  portalStatus?: 'enabled' | 'disabled';
  sortBy?: ClientSortField;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Request parameters for client list (from URL search params)
 */
export interface ClientRequest {
  search?: string;
  type?: string;
  accountTier?: string;
  portalAccess?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Fields that can be sorted in client list
 */
export type ClientSortField = 
  | 'organizationName'
  | 'tier'
  | 'providerCount'
  | 'estimatedRevenue'
  | 'avgTat'
  | 'portalEnabled'
  | 'healthScore';

/**
 * API response for client list item (from backend)
 */
export interface ClientListItem {
  id: string;
  organizationName: string;
  dbaName: string | null;
  type: string;
  npi: string | null;
  state: {
    id: string;
    name: string;
    code: string;
  };
  accountTier: string;
  portalAccess: boolean;
  healthScore: number;
  avgTat: number;
  mainPhone: string | null;
  mainEmail: string | null;
}

/**
 * Provider associated with a client
 */
export interface ClientProvider {
  id: string;
  name: string;
  credential: string;
  specialty: string;
  status: ProviderStatus;
  responsiveness: number;
}

/**
 * Enrollment request for a client
 */
export interface ClientEnrollment {
  id: string;
  requestId: string;
  providerName: string;
  type: EnrollmentType;
  payers: string[];
  status: EnrollmentStatus;
  days: number;
}

/**
 * Document uploaded for a client
 */
export interface ClientDocument {
  id: string;
  name: string;
  type: DocumentType;
  uploadedAt: Date;
  uploadedBy: string;
  size: number;
  url: string;
}

/**
 * Portal user associated with a client
 */
export interface ClientPortalUser {
  id: string;
  name: string;
  email: string;
  businessEntity: string;
  role: PortalUserRole;
  lastLogin: Date | null;
  status: ClientStatus;
}

/**
 * Activity log entry for a client
 */
export interface ClientActivity {
  id: string;
  timestamp: Date;
  action: string;
  performedBy: string;
  details?: string;
  relatedEntityType?: ActivityEntityType;
  relatedEntityId?: string;
}

/**
 * Business entity linked to a client
 */
export interface ClientBusinessEntity {
  id: string;
  name: string;
  address: string;
  status: ClientStatus;
}

export enum ClientBillingContact {
  PRIMARY = 'primary',
  BILLING = 'billing',
}
