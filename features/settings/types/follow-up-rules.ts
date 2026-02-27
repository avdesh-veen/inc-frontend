export interface FollowUpRulesStats {
  totalRules: number;
  active: number;
  categories: number;
  avgChaseTimeDays: number;
}

export type FollowUpRuleCategory =
  | "Enrollment"
  | "All"
  | "Licensing"
  | "Credentialing";

export type FollowUpRulePriority = "low" | "medium" | "high" | "critical";

export interface FollowUpRuleCategoryItem {
  name: string;
  code?: string;
}

export interface FollowUpRule {
  id: string;
  name: string;
  category: FollowUpRuleCategoryItem[];
  triggerEvent: string;
  days: string;
  priority: FollowUpRulePriority;
  escalateTo: string | null;
  active: boolean;
}

export interface FollowUpRuleApiItem {
  id: string;
  name: string;
  description?: string;
  triggerEvent?: { id: string; name: string; code?: string };
  triggerEventId: string;
  isActive: boolean;
  escalateTo: string | null;
  workCategories?: Array<{ workCategory?: { name: string; code?: string } }>;
  chaseTouches?: Array<{
    daysOffset: number;
    priority?: string;
    assignmentTarget?: string;
    taskName?: string;
  }>;
}

export interface FollowUpRulesRequest {
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
  allData?: boolean;
  taskType?: string;
}

export interface FollowUpRulesSearchParams {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
  allData?: string;
  taskType?: string;
}

export interface FollowUpRuleDropdownItem {
  id: string;
  name: string;
}

export interface FollowUpRulesStatistics {
  totalRulesCount?: number;
  activeRulesCount?: number;
  categoriesCount?: number;
  avgChaseTime?: number;
}

export interface FollowUpRulesContentProps {
  request: FollowUpRulesRequest;
}

export interface FollowUpRulesListProps {
  rules: FollowUpRule[];
  meta?: import("@/lib/api/types").PaginationMeta | null;
  onPageChange?: (page: number) => void;
}

export interface FollowUpRulesStatsCardProps {
  stats: FollowUpRulesStats;
  isLoading?: boolean;
}

export interface ChaseTouch {
  daysAfterTrigger: number;
  channel: string;
  priority: string;
  assignTo: string;
  taskName: string;
}

export function defaultChaseTouch(): ChaseTouch {
  return {
    daysAfterTrigger: 9,
    channel: "email",
    priority: "medium",
    assignTo: "case_owner",
    taskName: "",
  };
}

export interface CreateFollowUpRuleChaseTouchPayload {
  daysOffset: number;
  channel: string;
  touchNumber: number;
  priority: string;
  assignmentTarget: string;
  taskName: string;
}

export interface CreateFollowUpRulePayerOverridePayload {
  payerId: string;
  overrideDays: number;
  overrideChannel: string;
  reason: string;
}

export interface CreateFollowUpRulePayload {
  name: string;
  description: string;
  triggerEventId: string;
  isActive: boolean;
  autoEscalation: boolean;
  escalateAfter: number;
  escalateTo: string;
  requiresApprovalToClose: boolean;
  autoCloseOnNoResponse: boolean;
  autoCloseDays: number;
  autoCloseAfterMaxAttempts: number;
  filterByPayerType: string;
  stateId: string | null;
  taskType: string;
  taskEstMinutes: number;
  taskNameVar: string;
  taskCreationNotification: boolean;
  escalationNotification: boolean;
  clientContactNotification: boolean;
  workCategoryIds: string[];
  payerOverrides: CreateFollowUpRulePayerOverridePayload[];
  chaseTouches: CreateFollowUpRuleChaseTouchPayload[];
}

export type FollowUpRuleDetail = Partial<CreateFollowUpRulePayload> & {
  workCategories?: Array<{ workCategory?: { id?: string; name?: string; code?: string } }>;
};
