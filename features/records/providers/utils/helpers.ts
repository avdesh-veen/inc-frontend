/**
 * Provider utility functions
 * 
 * Shared helper functions for provider components.
 */

import { CLIENT_NAMES, DEPARTMENT_NAMES } from '../constants';

/**
 * Gets the client name for a given client ID
 * @param clientId - The unique identifier of the client
 * @returns The client name or 'Unknown Client' if not found
 */
export function getClientName(clientId: string): string {
  return CLIENT_NAMES[clientId] || 'Unknown Client';
}

/**
 * Gets the department name for a given department ID
 * @param departmentId - The unique identifier of the department
 * @returns The department name, the departmentId itself if not found, or '—' if null
 */
export function getDepartmentName(departmentId: string | null): string {
  if (!departmentId) return '—';
  return DEPARTMENT_NAMES[departmentId] || departmentId;
}

/**
 * Gets the progress bar color class based on responsiveness score
 * @param score - The responsiveness score (0-100)
 * @returns Tailwind CSS class for progress bar color
 */
export function getResponsivenessColorClass(score: number): string {
  if (score >= 90) return '[&>div]:bg-emerald-500';
  if (score >= 70) return '[&>div]:bg-yellow-500';
  return '[&>div]:bg-orange-500';
}
