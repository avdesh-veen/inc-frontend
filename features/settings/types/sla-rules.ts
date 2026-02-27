/**
 * SLA Rules Module Type Definitions
 * 
 * Defines all TypeScript interfaces and types for the SLA rules feature.
 */

// ============================================================================
// SLA Targets
// ============================================================================

/**
 * SLA target category/type reference from API
 */
export interface SLATargetRef {
  id: string;
  name: string;
}

/**
 * SLA target structure (matches API response)
 */
export interface SLATarget {
  id: string;
  workTypeCategoryId: string;
  workTypeId: string | null;
  workTypeCategory: SLATargetRef;
  workType?: SLATargetRef | null;
  targetDays: number;
  warningDays: number;
  criticalDays: number;
  useBusiness: boolean;
  pauseSlaWhenHold: boolean;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * SLA target request parameters
 */
export interface SLATargetRequest extends Record<string, unknown> {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

/**
 * SLA target form data (for create/edit)
 */
export interface SLATargetFormData {
  workTypeCategoryId: string;
  workTypeId: string | null;
  targetDays: number;
  warningDays: number;
  criticalDays: number;
  useBusiness: boolean;
  pauseSlaWhenHold: boolean;
}

// ============================================================================
// SLA Overrides
// ============================================================================

/**
 * Named reference used in override response for workType, clients, payers
 */
export interface SLAOverrideRef {
  id: string;
  name: string;
}

/**
 * SLA override structure (matches API response)
 */
export interface SLAOverride {
  id: string;
  overrideTargetDays: number;
  overrideWarningDays: number;
  overrideCriticalDays: number;
  reason: string;
  workTypeId: string;
  workType: SLAOverrideRef;
  clientIds: string[];
  clients: SLAOverrideRef[];
  payerIds: string[];
  payers: SLAOverrideRef[];
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/**
 * SLA override request parameters
 */
export interface SLAOverrideRequest extends Record<string, unknown> {
  page?: number;
  limit?: number;
}

/**
 * SLA override form data (for create/edit)
 */
export interface SLAOverrideFormData {
  workTypeId: string;
  clientIds: string[];
  payerIds: string[];
  overrideTargetDays: number;
  overrideWarningDays: number;
  overrideCriticalDays: number;
  reason: string;
}

// ============================================================================
// Dropdown Items (for combobox selects)
// ============================================================================

export interface ClientDropdownItem {
  id: string;
  organizationName: string;
}

export interface PayerDropdownItem {
  id: string;
  name: string;
}

// ============================================================================
// Escalation Rules
// ============================================================================

/**
 * Escalation rules configuration
 */
export interface EscalationRules {
  id: string;
  name:string
  status:boolean;
  description:string;
}

/**
 * Escalation rule definition
 */
export interface EscalationRuleDefinition {
  key: keyof EscalationRules;
  trigger: string;
  action: string;
}

// ============================================================================
// First Pass Rate (FPR) Metrics
// ============================================================================

/**
 * FPR target rates structure
 */
export interface FPRTargetRates {
  documentVerification: number;
  applicationBuild: number;
  enrollmentSubmission: number;
  payerSubmission: number;
}

/**
 * FPR tracking dimensions
 */
export interface FPRTrackingDimensions {
  workType: boolean;
  analyst: boolean;
  client: boolean;
  payer: boolean;
  complexity: boolean;
  month: boolean;
  auditor: boolean;
  location: boolean;
}

/**
 * FPR current performance metrics
 */
export interface FPRCurrentPerformance {
  documentVerification: number;
  applicationBuild: number;
  enrollmentSubmission: number;
  payerSubmission: number;
  overall: number;
}

/**
 * FPR metrics configuration
 */
export interface FPRMetrics {
  id: string;

  documentVerificationFprTarget: number;
  applicationBuildFprTarget: number;
  payerSubmissionFprTarget: number;

  trackByAnalyst: boolean;
  trackByAuditor: boolean;
  trackByLocation: boolean;
  trackByClient: boolean;
  trackByWorkType: boolean;
  trackByPayer: boolean;

  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
  createdBy: string;
  updatedBy: string;
}

/**
 * FPR metrics form data (for updates)
 */
export interface FPRMetricsFormData {
  targetRates?: FPRTargetRates;
  trackingDimensions?: FPRTrackingDimensions;
}

// ============================================================================
// Dropdown Options
// ============================================================================

/**
 * Request type options for dropdowns
 */
export const REQUEST_TYPES = [
  'Hospital Credentialing - Initial',
  'Hospital Credentialing - Renewal',
  'State Board Initial Submission',
  'State License Renewal',
  'DEA Registration',
  'Payer Enrollment - Commercial',
  'Medicare Enrollment',
  'Medicaid Enrollment',
  'CAQH Profile Setup',
  'CAQH Profile Update',
] as const;

/**
 * Work category options for dropdowns
 */
export const WORK_CATEGORIES = [
  'Enrollment',
  'Credentialing',
  'Licensing',
  'CAQH',
] as const;

/**
 * Client options for dropdowns
 */
export const CLIENT_OPTIONS = [
  'Any Client',
  'Acme Healthcare',
  'Beta Medical Group',
  'Gamma Health Systems',
  'Delta Care Network',
] as const;

/**
 * Payer options for dropdowns
 */
export const PAYER_OPTIONS = [
  'Any Payer',
  'Aetna',
  'Blue Cross Blue Shield',
  'Cigna',
  'Humana',
  'UnitedHealthcare',
  'Medicare',
  'Medicaid',
] as const;

export interface FPRMetricsSectionProps {
  metrics?: FPRMetrics;
  isLoading?: boolean;
}

export interface LocalTargetRates {
  documentVerification: number;
  applicationBuild: number;
  payerSubmission: number;
}

export interface LocalTrackingDimensions {
  analyst: boolean;
  auditor: boolean;
  location: boolean;
  client: boolean;
  workType: boolean;
  payer: boolean;
}
