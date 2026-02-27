import { RoleRequest } from "@/features/user-and-roles/types/role-tab";
import { UserRequest } from "@/features/user-and-roles/types/user-tab";
import { TeamRequest } from "@/features/user-and-roles/types/team-tab";
import type { FollowUpRulesRequest, UserWithSkillsRequest } from "@/features/settings/types";
import { WorkTypeRulesRequest } from "@/features/settings/types/approvals/work-type-rules";
import { ApprovalWorkflowsRequest } from "@/features/settings/types/approvals/approval-workflows";
import { ClientRequest } from "@/features/records/clients/types";
import type { PayerRequest, StateRequest, ClientAffiliationRequest, PayerContactRequest } from "@/features/records/payer/types";



export const usersRolesKeys = {
  all: ["users-roles"] as const,

  // Users
  users: {
    stats: () => [...usersRolesKeys.all, "users", "stats"] as const,
    list: (request?: UserRequest) =>
      [...usersRolesKeys.all, "users", request] as const,
    detail: (id: string) => [...usersRolesKeys.all, "users", id] as const,
    skills: (id: string) => [...usersRolesKeys.all, "users", id, "skills"] as const,
    leadership: (request?: { page?: number; limit?: number }) =>
      [...usersRolesKeys.all, "users", "leadership", request] as const,
  },

  // Roles
  roles: {
    list: (request?: RoleRequest) =>
      [...usersRolesKeys.all, "roles", request] as const,
    detail: (id: string) => [...usersRolesKeys.all, "roles", id] as const,
  },

  // Skills
  skills: {
    list: (request?: { page?: number; limit?: number }) =>
      [...usersRolesKeys.all, "skills", "list", request] as const,
  },

  // Teams
  teams: {
    leadsManagers: () => [...usersRolesKeys.all, "teams", "leadsManagers"] as const,
    stats: () => [...usersRolesKeys.all, "teams", "stats"] as const,
    list: (request?: TeamRequest) =>
      [...usersRolesKeys.all, "teams", request] as const,
    detail: (id: string) => [...usersRolesKeys.all, "teams", id] as const,
  },

  // Work Locations
  workLocations: {
    list: () => [...usersRolesKeys.all, "work-locations", "list"] as const,
  },
  // Role definitions
  roleDefinitions: () => [...usersRolesKeys.all, "role-definitions"] as const,
  externalRoles: () => [...usersRolesKeys.all, "external-roles"] as const,

  // Resources (for role permissions)
  resources: {
    list: () => [...usersRolesKeys.all, "resources", "list"] as const,
  },

  // Role Categories
  roleCategories: {
    list: (filters?: { page?: number; limit?: number; search?: string }) =>
      [...usersRolesKeys.all, "role-categories", filters] as const,
  },
} as const;

/**
 * Settings Query Keys
 */
export const settingsKeys = {
  all: ["settings"] as const,
  followUpRules: {
    list: (request?: FollowUpRulesRequest) =>
      [...settingsKeys.all, "follow-up-rules", request] as const,
    detail: (id: string) =>
      [...settingsKeys.all, "follow-up-rules", "detail", id] as const,
    payersDropdown: () =>
      [...settingsKeys.all, "follow-up-rules", "payers-dropdown"] as const,
    triggerEventsDropdown: () =>
      [...settingsKeys.all, "follow-up-rules", "trigger-events-dropdown"] as const,
    statesDropdown: () =>
      [...settingsKeys.all, "follow-up-rules", "states-dropdown"] as const,
    statistics: () =>
      [...settingsKeys.all, "follow-up-rules", "statistics"] as const,
  },
  skills: {
    list: (request?: { page?: number; limit?: number; search?: string }) =>
      [...settingsKeys.all, "skills", "list", request] as const,
    categories: () =>
      [...settingsKeys.all, "skills", "categories"] as const,
    skillCategories: () =>
      [...settingsKeys.all, "skills", "skill-categories"] as const,
    categoriesWithSkills: () =>
      [...settingsKeys.all, "skills", "categories-with-skills"] as const,
    usersWithSkills: (request?: UserWithSkillsRequest) =>
      [...settingsKeys.all, "skills", "users-with-skills", request] as const,
  },
  slaRules: {
    all: () => [...settingsKeys.all, "sla-rules"] as const,
    targets: {
      list: (request?: Record<string, unknown>) =>
        request
          ? ([...settingsKeys.all, "sla-rules", "targets", request] as const)
          : ([...settingsKeys.all, "sla-rules", "targets"] as const),
    },
    overrides: {
      list: (request?: Record<string, unknown>) =>
        request
          ? ([...settingsKeys.all, "sla-rules", "overrides", request] as const)
          : ([...settingsKeys.all, "sla-rules", "overrides"] as const),
    },
    clientsDropdown: () => [...settingsKeys.all, "sla-rules", "clients-dropdown"] as const,
    payersDropdown: () => [...settingsKeys.all, "sla-rules", "payers-dropdown"] as const,
    escalationRules: () => [...settingsKeys.all, "sla-rules", "escalation-rules"] as const,
    fprMetrics: () => [...settingsKeys.all, "sla-rules", "fpr-metrics"] as const,
  },
  approvals: {
    workTypeRules: (params?: WorkTypeRulesRequest) => [...settingsKeys.all, "approvals", "work-type-rules", params] as const,
    decisionQueue: () => [...settingsKeys.all, "approvals", "decision-queue"] as const,
    defaultRouting: () => [...settingsKeys.all, "approvals", "default-routing"] as const,
    workflows: (params?: ApprovalWorkflowsRequest) => [...settingsKeys.all, "approvals", "workflows", params] as const,
    workflowDetail: (id: string) => [...settingsKeys.all, "approvals", "workflows", "detail", id] as const,
    decisionTable: () => [...settingsKeys.all, "approvals", "decision-table"] as const,
  },
} as const;

/**
 * Authentication Query Keys
 */
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
  currentServerUser: () => [...authKeys.all, "current-server-user"], // Not read-only

  // Password reset operations
  passwordReset: {
    verify: (token: string) =>
      [...authKeys.all, "password-reset", "verify", token] as const,
  },
} as const;

/**
 * Trigger Events Query Keys
 */
export const waitReasonsKeys = {
  all: ["wait-reasons"] as const,
  list: (request?: Record<string, unknown>) =>
    [...waitReasonsKeys.all, "list", request] as const,
  active: () => [...waitReasonsKeys.all, "active"] as const,
  detail: (id: string) => [...waitReasonsKeys.all, "detail", id] as const,
} as const;

export const triggerEventsKeys = {
  all: ["trigger-events"] as const,
  list: (request?: Record<string, unknown>) => [...triggerEventsKeys.all, "list", request] as const,
  stats: () => [...triggerEventsKeys.all, "stats"] as const,
  detail: (id: string) => [...triggerEventsKeys.all, "detail", id] as const,
} as const;

/**
 * Work Categories Query Keys
 */
export const workCategoriesKeys = {
  all: ["work-categories"] as const,
  list: (request?: Record<string, unknown>) =>
    [...workCategoriesKeys.all, "list", request] as const,
  allData: () => [...workCategoriesKeys.all, "all-data"] as const,
  detail: (id: string) => [...workCategoriesKeys.all, "detail", id] as const,
} as const;

/**
 * Work Types Query Keys
 */
export const workTypesKeys = {
  all: ["work-types"] as const,
  lists: () => [...workTypesKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...workTypesKeys.lists(), filters] as const,
  details: () => [...workTypesKeys.all, "detail"] as const,
  detail: (id: string) => [...workTypesKeys.details(), id] as const,
  statistics: () => [...workTypesKeys.all, "statistics"] as const,
} as const;

/**
 * Assignment Query Keys
 */
export const assignmentKeys = {
  all: ["assignment"] as const,
  
  // Assignment Modes
  modes: {
    list: () => [...assignmentKeys.all, "modes", "list"] as const,
    detail: (id: string) => [...assignmentKeys.all, "modes", id] as const,
  },
  
  // Configuration (legacy)
  configuration: () => [...assignmentKeys.all, "configuration"] as const,
  
  // Metrics
  metrics: () => [...assignmentKeys.all, "metrics"] as const,
  
  // Routing Rules
  routingRules: {
    list: () => [...assignmentKeys.all, "routing-rules", "list"] as const,
    detail: (id: string) => [...assignmentKeys.all, "routing-rules", id] as const,
  },
  
  // Skill Sets
  skillSets: {
    list: () => [...assignmentKeys.all, "skill-sets", "list"] as const,
  },
  
  // Capacity Settings
  capacity: () => [...assignmentKeys.all, "capacity"] as const,
} as const;

/**
 * Payers Query Keys
 */
export const payersKeys = {
  all: ["payers"] as const,
  lists: () => [...payersKeys.all, "list"] as const,
  list: (request?: PayerRequest) => [...payersKeys.lists(), request] as const,
  details: () => [...payersKeys.all, "detail"] as const,
  detail: (id: string) => [...payersKeys.details(), id] as const,
  stats: () => [...payersKeys.all, "stats"] as const,
  clientAffiliations: (payerId: string, request?: ClientAffiliationRequest) =>
    [...payersKeys.all, "client-affiliations", payerId, request] as const,
  contacts: (payerId: string, request?: PayerContactRequest) =>
    [...payersKeys.all, "contacts", payerId, request] as const,
  contactDetail: (payerId: string, id: string) =>
    [...payersKeys.all, "contacts", payerId, id] as const,
} as const;

/**
 * States Query Keys
 */
export const statesKeys = {
  all: ["states"] as const,
  lists: () => [...statesKeys.all, "list"] as const,
  list: (request?: StateRequest) => [...statesKeys.lists(), request] as const,
} as const;

/**
 * Clients Query Keys
 */
export const clientsKeys = {
  all: ["clients"] as const,
  lists: () => [...clientsKeys.all, "list"] as const,
  list: (request?: ClientRequest) =>
    [...clientsKeys.lists(), request] as const,
  details: () => [...clientsKeys.all, "detail"] as const,
  detail: (id: string) => [...clientsKeys.details(), id] as const,
  stats: () => [...clientsKeys.all, "stats"] as const,
} as const;

/**
 * Combined query keys object
 * Import this for easy access to all query keys
 */
export const queryKeys = {
  usersRoles: usersRolesKeys,
  auth: authKeys,
  settings: settingsKeys,
  waitReasons: waitReasonsKeys,
  triggerEvents: triggerEventsKeys,
  workCategories: workCategoriesKeys,
  workTypes: workTypesKeys,
  assignment: assignmentKeys,
  clients: clientsKeys,
  payers: payersKeys,
  states: statesKeys,
} as const;

/**
 * Type-safe query key helpers
 */

/**
 * Get query key as string for debugging
 */
export function getQueryKeyString(queryKey: readonly unknown[]): string {
  return JSON.stringify(queryKey);
}
