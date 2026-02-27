/**
 * Work Types Type Definitions
 * 
 * Type definitions for work type management feature.
 */

import type { WorkTypeFormData as WorkTypeFormDataType } from '../validations/work-types-schemas';

/**
 * Re-export WorkTypeFormData from validation schemas
 */
export type { WorkTypeFormData } from '../validations/work-types-schemas';

/**
 * Gate Requirement Types
 */
export enum GateRequirementType {
  DOCUMENT = 'document',
  FIELD = 'field',
  VERIFICATION = 'verification',
  APPROVAL = 'approval',
}

/**
 * Stage Status Types
 */
export enum StageStatus {
  ACTIVE_WORK = 'activeWork',
  WAITING = 'waiting',
}

/**
 * Assignment Rule Types
 */
export enum AssignmentRule {
  CASE_OWNER = 'caseOwner',
  TEAM_LEAD = 'teamLead',
  SKILL_MATCHED = 'skillMatched',
  ROUND_ROBIN = 'roundRobin',
}

export const ASSIGNMENT_RULE_LABELS: Record<AssignmentRule, string> = {
  [AssignmentRule.CASE_OWNER]: 'Case Owner',
  [AssignmentRule.TEAM_LEAD]: 'Team Lead',
  [AssignmentRule.SKILL_MATCHED]: 'Skill Matched',
  [AssignmentRule.ROUND_ROBIN]: 'Round Robin',
};

/**
 * Approval Gate Types
 */
export enum ApprovalGate {
  STANDARD_TL_APPROVAL = 'standardTlApproval',
  MEDICARE_MEDICAID_REVIEW = 'medicareMedicaidReview',
  MANAGER_APPROVAL = 'managerApproval',
  NEW_CLIENT_REVIEW = 'newClientReview',
}

/**
 * Complexity Level Types
 */
export enum ComplexityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type CategoryType =
  | 'Credentialing'
  | 'Licensing'
  | 'Enrollment'
  | 'MPU'
  | 'Maintenance'
  | 'CAQH'
  | 'Portal'
  | 'Roster'
  | 'Contracting'
  | 'Other';

export type WorkTypeStatus = 'Active' | 'Inactive';

/**
 * Gate Requirement Interface
 */
export interface GateRequirement {
  id?: string;
  type: GateRequirementType;
  description: string;
  isRequired: boolean;
}

/**
 * Workflow Stage Interface (for form state)
 */
export interface WorkflowStage {
  id?: string;
  name: string;
  status: StageStatus;
  activeTime: number;
  waitTime: number;
  slaTarget: number;
  assignmentRule: AssignmentRule;
  waitReasonId?: string | null;
  followUpRuleId?: string | null;
  approvalGate?: ApprovalGate | null;
  overrideTimeoutThresholds: boolean;
  overrideWarningDays?: number;
  overrideCriticalDays?: number;
  skillIds: string[];
  skills?: (string | { id: string })[];
  gateRequirements: GateRequirement[];
}

export interface WorkTypeStage {
  id: string;
  name: string;
  order: number;
  estimatedDuration: string;
}

/**
 * Work type category reference from API
 */
export interface WorkTypeCategory {
  id: string;
  name: string;
}

/**
 * Work type from API
 */
export interface WorkType {
  id: string;
  name: string;
  shortName: string;
  workCategoryId: string;
  category: WorkTypeCategory;
  slaRuleId?: string | null;
  complexityLevel: ComplexityLevel;
  providerSignature: boolean;
  psvRequired: boolean;
  isActive: boolean;
  expectedDuration: number;
  requiredSkills?: string[];
  stages?: WorkTypeStage[];
  description?: string;
  workflowStages?: WorkflowStage[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Category color mapping
 */
export const CATEGORY_COLORS: Record<CategoryType, string> = {
  Credentialing: 'violet',
  Licensing: 'blue',
  Enrollment: 'emerald',
  MPU: 'cyan',
  Maintenance: 'amber',
  CAQH: 'teal',
  Portal: 'indigo',
  Roster: 'rose',
  Contracting: 'fuchsia',
  Other: 'slate',
};

/**
 * All categories in display order
 */
export const ALL_CATEGORIES: CategoryType[] = [
  'Credentialing',
  'Licensing',
  'Enrollment',
  'MPU',
  'Maintenance',
  'CAQH',
  'Portal',
  'Roster',
  'Contracting',
  'Other',
];

/**
 * Complexity levels
 */
export const COMPLEXITY_LEVELS: ComplexityLevel[] = [
  ComplexityLevel.LOW,
  ComplexityLevel.MEDIUM,
  ComplexityLevel.HIGH
];

/**
 * Complexity level display names
 */
export const COMPLEXITY_LEVEL_DISPLAY: Record<ComplexityLevel, string> = {
  [ComplexityLevel.LOW]: 'low',
  [ComplexityLevel.MEDIUM]: 'medium',
  [ComplexityLevel.HIGH]: 'high',
};

/**
 * Status options for work types
 */
export const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
] as const;

/**
 * Billing SKUs
 */
export const BILLING_SKUS = [
  'CRED-NEW', 'CRED-HMO', 'CRED-RECRED', 'DEMO-CHANGE', 'EFT-CHANGE',
  'CAQH-BUILD', 'CAQH-MAINT', 'OON-ENROLL', 'NPI-REG', 'APPEAL',
  'CVO', 'PORTAL-MAINT'
];

/**
 * Stage type options
 */
export const STAGE_TYPES = [
  { value: StageStatus.ACTIVE_WORK, label: 'Active Work' },
  { value: StageStatus.WAITING, label: 'Waiting' }
] as const;

/**
 * Assignment rule options
 */
export const ASSIGNMENT_RULES = [
  { value: AssignmentRule.CASE_OWNER, label: 'Case Owner' },
  { value: AssignmentRule.SKILL_MATCHED, label: 'Skill Matched' },
  { value: AssignmentRule.TEAM_LEAD, label: 'Team Lead' },
  { value: AssignmentRule.ROUND_ROBIN, label: 'Round Robin' }
] as const;

/**
 * Approval gate options
 */
export const APPROVAL_GATES = [
  { value: ApprovalGate.STANDARD_TL_APPROVAL, label: 'Team Lead Approval' },
  { value: ApprovalGate.MEDICARE_MEDICAID_REVIEW, label: 'Medicare/Medicaid Review' },
  { value: ApprovalGate.MANAGER_APPROVAL, label: 'Manager Approval' },
  { value: ApprovalGate.NEW_CLIENT_REVIEW, label: 'New Client Review' }
] as const;

/**
 * Gate requirement type options
 */
export const GATE_REQUIREMENT_TYPES = [
  { value: GateRequirementType.DOCUMENT, label: 'Document' },
  { value: GateRequirementType.FIELD, label: 'Field' },
  { value: GateRequirementType.APPROVAL, label: 'Approval' },
  { value: GateRequirementType.VERIFICATION, label: 'Verification' },
] as const;


export const AVAILABLE_SKILLS = [
  { id: 'skill-1', name: 'State Licensing' },
  { id: 'skill-2', name: 'Hospital Credentialing' },
  { id: 'skill-3', name: 'DEA Processing' },
  { id: 'skill-4', name: 'Privileging' },
  { id: 'skill-5', name: 'Document Verification' },
  { id: 'skill-6', name: 'Committee Coordination' },
  { id: 'skill-7', name: 'Payer Enrollment' },
  { id: 'skill-8', name: 'CAQH Navigation' },
  { id: 'skill-9', name: 'CAQH Profile Management' },
  { id: 'skill-10', name: 'Quality Auditing' },
];

/**
 * Component Props Types
 */
export interface WorkTypeFormPageProps {
  workType?: WorkType;
  onClose: () => void;
  onSave?: (workType: WorkType) => void;
}

export interface WorkTypeMetricsProps {
  workTypes: WorkType[];
  selectedCategory: CategoryType | null;
}

export interface CategoryGridProps {
  workTypes: WorkType[];
  selectedCategory: CategoryType | null;
  onCategorySelect: (category: CategoryType | null) => void;
}

export interface WorkTypesTableProps {
  workTypes: WorkType[];
  selectedCategory: CategoryType | null;
  onCreate: () => void;
  onEdit: (workType: WorkType) => void;
  onDuplicate: (workType: WorkType) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (id: string) => void;
  onCategoryChange: (category: CategoryType | null) => void;
}

export interface WorkTypeFormProps {
  workType?: WorkType;
  onSubmit: (data: WorkTypeFormDataType) => void;
  onCancel: () => void;
}

/**
 * Work Type Statistics Types
 */

// Overall work types statistics
export interface WorkTypeStatistics {
  totalWorkTypes: number;
  activeWorkTypes: number;
  workTypeCategoriesCount: number;
  averageDuration: number;
}

// Individual work type usage statistics
export interface WorkTypeUsageStatistics {
  workTypeId: string;
  workTypeName: string;
  timesUsed: number;
  averageDuration: number; // in minutes
  efficiencyPercentage: number;
  expectedDuration: number; // in minutes
  complexityLevel: 'low' | 'medium' | 'high'; // 'low' | 'medium' | 'high'
}
