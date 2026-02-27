/**
 * Client Helper Functions
 * 
 * Shared utility functions for client-related components.
 * Pure functions with no side effects.
 */

import { 
  ClientTier, 
  ClientStatus, 
  ProviderStatus, 
  EnrollmentType, 
  EnrollmentStatus, 
  DocumentType 
} from '@/features/records/clients/types';

/**
 * Get initials from name for avatar display
 * @param name - Full name or organization name
 * @returns Two-letter initials in uppercase
 */
export function getClientInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get avatar background color based on name
 * @param name - Full name or organization name
 * @returns Tailwind CSS classes for avatar color
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Format currency for display
 * @param amount - Amount in dollars
 * @returns Formatted currency string (e.g., "$2.5M", "$150K")
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

/**
 * Get tier label for display
 * @param tier - Client tier value
 * @returns Display label for the tier
 */
export function getTierLabel(tier: string): string {
  const tierLower = tier.toLowerCase();
  switch (tierLower) {
    case ClientTier.PLATINUM:
      return 'Platinum';
    case ClientTier.DIAMOND:
      return 'Diamond';
    case ClientTier.GOLD:
      return 'Gold';
    case ClientTier.SILVER:
      return 'Silver';
    case ClientTier.BRONZE:
      return 'Bronze';
    default:
      return tier;
  }
}

/**
 * Get tier badge color classes
 * @param tier - Client tier
 * @returns Tailwind CSS classes for badge styling
 */
export function getTierBadgeClass(tier: string): string {
  const tierLower = tier.toLowerCase();
  switch (tierLower) {
    case ClientTier.PLATINUM:
      return 'font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400';
    case ClientTier.DIAMOND:
      return 'font-bold bg-gradient-to-r from-sky-400/20 to-purple-400/20 text-sky-300 border border-sky-400';
    case ClientTier.GOLD:
      return 'font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500';
    case ClientTier.SILVER:
      return 'font-bold bg-slate-400/20 text-slate-300 border border-slate-400';
    case ClientTier.BRONZE:
      return 'bg-amber-700/20 text-amber-500 border-amber-600';
    default:
      return 'bg-gray-700/20 text-gray-400 border-gray-600';
  }
}

/**
 * Get general status badge color classes
 * @param status - Status string (Active/Inactive/Pending)
 * @returns Tailwind CSS classes for badge styling
 */
export function getStatusBadgeClass(status: string | boolean): string {
  if (typeof status === 'boolean') {
    return status
      ? 'border-emerald-500/30 text-emerald-400'
      : 'border-slate-500/30 text-slate-400';
  }
  
  switch (status) {
    case ClientStatus.ACTIVE:
    case ProviderStatus.ACTIVE:
      return 'border-emerald-500/30 text-emerald-400';
    case ClientStatus.PENDING:
    case ProviderStatus.PENDING:
      return 'border-amber-500/30 text-amber-300';
    case ClientStatus.INACTIVE:
    case ProviderStatus.INACTIVE:
      return 'border-slate-500/30 text-slate-400';
    default:
      return 'border-slate-500/30 text-slate-400';
  }
}

/**
 * Get enrollment type badge color classes
 * @param type - Enrollment type
 * @returns Tailwind CSS classes for badge styling
 */
export function getEnrollmentTypeBadgeClass(type: string): string {
  switch (type) {
    case EnrollmentType.INITIAL_ENROLLMENT:
      return 'border-blue-500/30 text-blue-300';
    case EnrollmentType.ADD_LOCATION:
      return 'border-purple-500/30 text-purple-300';
    case EnrollmentType.ADD_PAYER:
      return 'border-emerald-500/30 text-emerald-300';
    default:
      return 'border-slate-500/30 text-slate-400';
  }
}

/**
 * Get enrollment status badge color classes
 * @param status - Enrollment status
 * @returns Tailwind CSS classes for badge styling
 */
export function getEnrollmentStatusBadgeClass(status: string): string {
  switch (status) {
    case EnrollmentStatus.IN_PROGRESS:
      return 'border-blue-500/30 text-blue-300';
    case EnrollmentStatus.PENDING_PAYER:
      return 'border-amber-500/30 text-amber-300';
    case EnrollmentStatus.SUBMITTED:
      return 'border-emerald-500/30 text-emerald-300';
    case EnrollmentStatus.COMPLETED:
      return 'border-slate-500/30 text-slate-400';
    default:
      return 'border-slate-500/30 text-slate-400';
  }
}

/**
 * Get document type badge color classes
 * @param type - Document type
 * @returns Tailwind CSS classes for badge styling
 */
export function getDocumentTypeBadgeClass(type: string): string {
  switch (type) {
    case DocumentType.CONTRACT:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case DocumentType.BAA:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case DocumentType.W9:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case DocumentType.OTHER:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

/**
 * Get activity type badge color classes
 * @param action - Activity action
 * @returns Tailwind CSS classes for badge styling
 */
export function getActivityBadgeClass(action: string): string {
  if (action.toLowerCase().includes('created')) {
    return 'border-emerald-500/30 text-emerald-300';
  }
  if (action.toLowerCase().includes('updated') || action.toLowerCase().includes('added')) {
    return 'border-blue-500/30 text-blue-300';
  }
  if (action.toLowerCase().includes('deleted') || action.toLowerCase().includes('removed')) {
    return 'border-red-500/30 text-red-300';
  }
  if (action.toLowerCase().includes('uploaded') || action.toLowerCase().includes('submitted')) {
    return 'border-purple-500/30 text-purple-300';
  }
  return 'border-slate-500/30 text-slate-400';
}

/**
 * Format Tax ID with hyphen
 * @param taxId - Tax ID string
 * @returns Formatted Tax ID (e.g., "12-3456789")
 */
export function formatTaxId(taxId: string): string {
  const clean = taxId.replace(/-/g, '');
  
  if (clean.length >= 2) {
    return `${clean.slice(0, 2)}-${clean.slice(2)}`;
  }
  
  return clean;
}

/**
 * Get health score color class based on score value
 * @param score - Health score (0-100)
 * @returns Tailwind CSS classes for progress bar color
 */
export function getHealthScoreColorClass(score: number): string {
  if (score >= 90) return '[&>div]:bg-emerald-500';
  if (score >= 70) return '[&>div]:bg-green-500';
  if (score >= 40) return '[&>div]:bg-yellow-500';
  return '[&>div]:bg-orange-500';
}

/**
 * Get health score color for text
 * @param score - Health score (0-100)
 * @returns Tailwind CSS classes for text color
 */
export function getHealthScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-500 dark:text-emerald-400';
  if (score >= 70) return 'text-green-500 dark:text-green-400';
  if (score >= 40) return 'text-yellow-500 dark:text-yellow-400';
  return 'text-orange-500 dark:text-orange-400';
}

/**
 * Get responsiveness score color class
 * @param score - Responsiveness score (0-100)
 * @returns Tailwind CSS classes for progress bar color
 */
export function getResponsivenessColorClass(score: number): string {
  if (score >= 90) return '[&>div]:bg-emerald-500';
  if (score >= 70) return '[&>div]:bg-green-500';
  if (score >= 40) return '[&>div]:bg-yellow-500';
  return '[&>div]:bg-orange-500';
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "2.5 MB", "150 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

/**
 * Format phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number (e.g., "(555) 123-4567")
 */
export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  
  if (clean.length === 10) {
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
  }
  
  return phone;
}

/**
 * Format date for display
 * @param date - Date object or null
 * @returns Formatted date string
 */
export function formatDate(date: Date | null): string {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date for display (short format)
 * @param date - Date object or null
 * @returns Formatted date string (MM/DD/YYYY)
 */
export function formatDateShort(date: Date | null): string {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format timestamp for display
 * @param date - Date object
 * @returns Formatted timestamp string with time
 */
export function formatTimestamp(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format payers list with overflow indicator
 * @param payers - Array of payer names
 * @returns Formatted payers string
 */
export function formatPayers(payers: string[]): string {
  if (payers.length <= 2) {
    return payers.join(', ');
  }
  return `${payers.slice(0, 2).join(', ')} +${payers.length - 2}`;
}
