

import {
  PayerType,
  ClientTier,
  RoutingAssignmentMode,
  RoutingSkills,
  MinProficiency,
} from '@/features/settings/types/assignment';

/**
 * Get display label for Payer Type (for table display)
 */
export const getPayerTypeLabel = (value: PayerType): string => {
  if (value === PayerType.ANY) return '*';
  const labels: Record<PayerType, string> = {
    [PayerType.ANY]: '*',
    [PayerType.COMMERCIAL]: 'Commercial',
    [PayerType.MEDICARE]: 'Medicare',
    [PayerType.MEDICAID]: 'Medicaid',
    [PayerType.MANAGED_CARE]: 'Managed Care',
  };
  return labels[value];
};

/**
 * Get display label for Payer Type (for dropdown display)
 */
export const getPayerTypeDropdownLabel = (value: PayerType): string => {
  const labels: Record<PayerType, string> = {
    [PayerType.ANY]: '* (Any)',
    [PayerType.COMMERCIAL]: 'Commercial',
    [PayerType.MEDICARE]: 'Medicare',
    [PayerType.MEDICAID]: 'Medicaid',
    [PayerType.MANAGED_CARE]: 'Managed Care',
  };
  return labels[value];
};

/**
 * Get display label for Client Tier (for table display)
 */
export const getClientTierLabel = (value: ClientTier): string => {
  if (value === ClientTier.ANY) return '*';
  const labels: Record<ClientTier, string> = {
    [ClientTier.ANY]: '*',
    [ClientTier.PLATINUM]: 'Platinum',
    [ClientTier.GOLD]: 'Gold',
    [ClientTier.SILVER]: 'Silver',
    [ClientTier.STANDARD]: 'Standard',
  };
  return labels[value];
};


export const getClientTierDropdownLabel = (value: ClientTier): string => {
  const labels: Record<ClientTier, string> = {
    [ClientTier.ANY]: '* (Any)',
    [ClientTier.PLATINUM]: 'Platinum',
    [ClientTier.GOLD]: 'Gold',
    [ClientTier.SILVER]: 'Silver',
    [ClientTier.STANDARD]: 'Standard',
  };
  return labels[value];
};

/**
 * Get display label for Routing Skills
 */
export const getRoutingSkillsLabel = (value: RoutingSkills): string => {
  const labels: Record<RoutingSkills, string> = {
    [RoutingSkills.WORK_TYPE_SKILL]: 'Work Type Skill',
    [RoutingSkills.DEDICATED_TEAM]: 'Dedicated Team',
    [RoutingSkills.MEDICARE_ENROLL]: 'Medicare Enrollment',
    [RoutingSkills.MEDICAID_ENROLL]: 'Medicaid Enrollment',
    [RoutingSkills.STATE_LICENSING]: 'State Licensing',
    [RoutingSkills.ANY]: 'Any',
  };
  return labels[value];
};

/**
 * Get display label for Minimum Proficiency
 */
export const getMinProficiencyLabel = (value: MinProficiency): string => {
  const labels: Record<MinProficiency, string> = {
    [MinProficiency.TRAINEE]: 'Trainee',
    [MinProficiency.COMPETENT]: 'Competent',
    [MinProficiency.EXPERT]: 'Expert',
  };
  return labels[value];
};

/**
 * Get display label for Assignment Mode
 */
export const getAssignmentModeLabel = (value: RoutingAssignmentMode): string => {
  const labels: Record<RoutingAssignmentMode, string> = {
    [RoutingAssignmentMode.SKILL_MATCHED]: 'Skill Match',
    [RoutingAssignmentMode.DEDICATED]: 'Dedicated',
    [RoutingAssignmentMode.LOAD_BALANCED]: 'Load Balanced',
    [RoutingAssignmentMode.LEAST_BUSY]: 'Least Busy',
  };
  return labels[value];
};

/**
 * Color mapping for Assignment Modes
 */
export const ASSIGNMENT_MODE_COLORS: Record<string, string> = {
  'Dedicated': 'text-violet-400',
  'Skill Match': 'text-emerald-400',
  'Least Busy': 'text-amber-400',
  'Load Balanced': 'text-blue-400',
};
