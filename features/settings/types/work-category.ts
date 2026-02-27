/**
 * Work Category Type Definitions
 *
 * Type definitions for work categories API.
 */

/**
 * Work type in category
 */
export interface CategoryWorkType {
  id: string;
  name: string;
  shortName?: string;
  isActive?: boolean;
}

/**
 * Work category model
 */
export interface WorkCategory {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  isActive: boolean;
  color: string;
  workTypes: CategoryWorkType[];
  createdAt: string;
  updatedAt: string;
  createdAtUTC: number;
  updatedAtUTC: number;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

/**
 * Work category request parameters
 */
export interface WorkCategoryRequest extends Record<string, unknown> {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  allData?: boolean;
}
