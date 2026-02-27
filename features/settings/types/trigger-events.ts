
// ============================================================================
// Trigger Events
// ============================================================================

/**
 * Trigger event types (matching HTML reference)
 * 
 */

import { WorkCategory } from "@/features/settings/types/work-category";
import { z } from "zod";
export type TriggerEventType = 'system' | 'manual' | 'scheduled';

/**
 * Trigger event categories (work categories)
 */
export type TriggerEventCategory = 'All' | 'Enrollment' | 'Credentialing' | 'Licensing' | 'CAQH';

/**
 * Work category embedded in trigger event response
 */
export interface TriggerEventWorkCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
  color?: string;
  icon?: string;
  workCategory: WorkCategory | null;
}

/**
 * Trigger event definition (matching HTML reference)
 */
export interface TriggerEvent {
  id: string;
  code: string; // Lowercase with underscores (e.g., 'provider_called_back')
  name: string;
  description: string;
  type: TriggerEventType; // system, manual, or scheduled
  category?: TriggerEventCategory; // Work category (legacy field)
  firedBy: string; // What action/process fires this event
  isActive: boolean;
  rulesCount?: number; // Number of follow-up rules using this event
  daysBeforeExpiry?: number; // For scheduled events only
  workCategoryIds?: string[]; // Array of work category UUIDs
  workCategories?: TriggerEventWorkCategory[]; // Populated work categories from API
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
  triggerEventWorkCategories?: TriggerEventWorkCategory[];
}

/**
 * Legacy Trigger Types (for backward compatibility)
 */
export type TriggerType = 'Automated' | 'Manual' | 'Scheduled';
export type TriggerCategory = 'Status Change' | 'Field Update' | 'Scheduled' | 'External';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export const triggerEventTypeSchema = z.enum(['system', 'manual', 'scheduled']);


/**
 * Legacy Trigger Action types (for backward compatibility)
 */
export type TriggerActionType = 'notification' | 'status_update' | 'assignment' | 'email';

export interface TriggerAction {
  id: string;
  type: TriggerActionType;
  parameters: Record<string, unknown>;
}

export interface TriggerEventConfiguration {
  scheduleExpression?: string;
  statusTriggers?: string[];
  fieldPaths?: string[];
}

/**
 * Trigger Events Statistics
 */
export interface TriggerEventsStats {
  totalEvents: number;
  systemEvents: number;
  manualEvents: number;
  scheduledEvents: number;
  withRulesEvents: number;
}

/**
 * Trigger Event Request Parameters
 */
export interface TriggerEventRequest {
  page?: number;
  limit?: number;
  type?: TriggerEventType;
  category?: TriggerEventCategory;
  isActive?: boolean;
  search?: string;
  allData?: boolean;
}