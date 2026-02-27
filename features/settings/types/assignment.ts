/**
 * Assignment Module Type Definitions
 * 
 * Defines all TypeScript interfaces and types for the assignment feature.
 */

import { WorkCategory } from "./work-category";

// ============================================================================
// Assignment Modes
// ============================================================================

/**
 * Assignment mode types from API
 */
export type AssignmentMode = 'roundRobin' | 'loadBalance' | 'manual';

/**
 * Assignment mode option for display
 */
export interface AssignmentModeOption {
  id: AssignmentMode;
  name: string;
  description: string;
}

/**
 * Assignment mode configuration from API
 */
export interface AssignmentModeConfig {
  id: string;
  type: AssignmentMode;
  considerAnalystAvailability: boolean;
  preferRecentTaskAnalyst: boolean;
  autoReassignOnAbsence: boolean;
  clientAffinityEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================================
// Assignment Configuration (Legacy - kept for backward compatibility)
// ============================================================================

/**
 * Assignment preferences structure
 */
export interface AssignmentPreferences {
  respectWorkload: boolean;
  respectSkillLevel: boolean;
  allowReassignment: boolean;
  considerAvailability: boolean;
  prioritizeExperience: boolean;
  balanceTeamLoad: boolean;
  preferRecentRelated: boolean;
  autoReassignOnAbsence: boolean;
  enableClientAffinity: boolean;
}

/**
 * Assignment configuration (legacy)
 */
export interface AssignmentConfiguration {
  id: string;
  mode: AssignmentMode;
  preferences: AssignmentPreferences;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================================================
// Assignment Metrics
// ============================================================================

/**
 * Assignment metrics data
 */
export interface AssignmentMetrics {
  activeAnalystCount: number;
  avgCapacityPercentage: number;
  autoAssignment: number;
  skillSetsCount: number;
}

// ============================================================================
// Routing Rules (DMN)
// ============================================================================

/**
 * Enum for payer type in routing rules
 */
export enum PayerType {
  ANY = 'any',
  COMMERCIAL = 'commercial',
  MEDICARE = 'medicare',
  MEDICAID = 'medicaid',
  MANAGED_CARE = 'managedCare',
}

/**
 * Enum for client tier
 */
export enum ClientTier {
  ANY = 'any',
  PLATINUM = 'platinum',
  GOLD = 'gold',
  SILVER = 'silver',
  STANDARD = 'standard',
}

/**
 * Enum for assignment mode in routing rules
 */
export enum RoutingAssignmentMode {
  SKILL_MATCHED = 'skillMatched',
  DEDICATED = 'dedicated',
  LOAD_BALANCED = 'loadBalanced',
  LEAST_BUSY = 'leastBusy',
}

/**
 * Enum for routing skills
 */
export enum RoutingSkills {
  WORK_TYPE_SKILL = 'workTypeSkill',
  DEDICATED_TEAM = 'dedicatedTeam',
  MEDICARE_ENROLL = 'medicareEnroll',
  MEDICAID_ENROLL = 'medicaidEnroll',
  STATE_LICENSING = 'stateLicensing',
  ANY = 'any',
}

/**
 * Enum for minimum proficiency level
 */
export enum MinProficiency {
  TRAINEE = 'trainee',
  COMPETENT = 'competent',
  EXPERT = 'expert',
}

/**
 * Routing rule status
 */
export type RoutingRuleStatus = 'Active' | 'Inactive';

/**
 * Routing rule structure
 */
export interface RoutingRule {
  id: string;
  rulePriority: number;
  workCategory?: string | null; // UUID - optional for "any"
  payerType: PayerType;
  clientTier: ClientTier;
  isUrgent: boolean;
  routingSkills: RoutingSkills;
  minProficiency: MinProficiency;
  assignmentMode: RoutingAssignmentMode;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type AssignmentRule = {
  createdAt: string;
  updatedAt: string;
  createdAtUTC: number;
  updatedAtUTC: number;
  deletedAt: string | null;
  id: string;
  createdBy: string;
  updatedBy: string;
  rulePriority: number;
  workCategory: WorkCategory | null;
  payerType: PayerType;          
  clientTier: ClientTier;  
  isActive: boolean;
  assignmentMode: RoutingAssignmentMode;    
  routingSkills: RoutingSkills;      // e.g., "dedicatedTeam"
  minProficiency: MinProficiency; 
  isUrgent: boolean;  
};

/**
 * Routing rule form data (for create/edit)
 */
export interface RoutingRuleFormData {
  rulePriority: number;
  workCategory?: string | null; // UUID - optional for "any", null for any
  payerType: PayerType;
  clientTier: ClientTier;
  isUrgent: boolean;
  routingSkills: RoutingSkills;
  minProficiency: MinProficiency;
  assignmentMode: RoutingAssignmentMode;
  isActive: boolean;
}

/**
 * Routing rule condition options
 */
export interface RoutingRuleOptions {
  workTypes: string[];
  payerTypes: PayerType[];
  clientTiers: ClientTier[];
  isUrgentOptions: string[];
  requiredSkills: RoutingSkills[];
  minProficiencyLevels: Array<{ name: MinProficiency; level: number }>;
  assignmentModes: Array<{ id: RoutingAssignmentMode; desc: string }>;
}

// ============================================================================
// Trigger Events
// ============================================================================

/**
 * Assignment trigger event
 */
export interface AssignmentTriggerEvent {
  id: string;
  event: string;
  description: string;
}

// ============================================================================
// Skill Sets
// ============================================================================

/**
 * Individual skill within a skill set
 */
export interface Skill {
  createdAtUTC: number;
  updatedAtUTC: number;
  id: string;
  name: string;
  description: string;
  requiresCertification: boolean;
  certificationValidity: number;
  minimumProficiency: string;
  isActive: boolean;
}

/**
 * Skill set structure
 */
export interface SkillSet {
  createdAtUTC: number;
  updatedAtUTC: number;
  id: string;
  name: string;
  code: string;
  icon: string | null;
  description: string;
  isActive: boolean;
  color: string | null;
  skills: Skill[];
}

// ============================================================================
// Capacity Settings
// ============================================================================

/**
 * Capacity settings structure (matches API response)
 */
export interface CapacitySettings {
  id: string;
  maxTasksAllowed: number;
  maxActiveTasksPerAnalyst: number;
  warningThresholdPercent: number;
  enableForecastingAlerts: boolean;
  forecastHorizonDays: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
}
