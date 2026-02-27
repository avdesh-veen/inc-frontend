const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const API_ENDPOINTS = {
  settings: {
    followUpRules: {
      list: "/settings/workflow/follow-up-rules",
      create: "/settings/workflow/follow-up-rules",
      detail: (id: string) => `/settings/workflow/follow-up-rules/${id}`,
      update: (id: string) => `/settings/workflow/follow-up-rules/${id}`,
      delete: (id: string) => `/settings/workflow/follow-up-rules/${id}`,
      toggle: (id: string) => `/settings/workflow/follow-up-rules/${id}/status`,
      payersDropdown: "/settings/workflow/follow-up-rules/payers/dropdown",
      triggerEventsDropdown:
        "/settings/workflow/follow-up-rules/trigger-events/dropdown",
      statesDropdown: "/settings/workflow/follow-up-rules/states/dropdown",
      statistics: "/settings/workflow/follow-up-rules/statistics",
    },
    slaRules: {
      targets: {
        list: "/settings/workflow/sla-rules",
        create: "/settings/workflow/sla-rules",
        update: (id: string) => `/settings/workflow/sla-rules/${id}`,
        delete: (id: string) => `/settings/workflow/sla-rules/${id}`,
      },
      overrides: {
        list: "/settings/workflow/sla-rules/overrides",
        create: "/settings/workflow/sla-rules/overrides",
        update: (id: string) => `/settings/workflow/sla-rules/overrides/${id}`,
        delete: (id: string) => `/settings/workflow/sla-rules/overrides/${id}`,
      },
      clientsDropdown: "/settings/workflow/sla-rules/clients/dropdown",
      escalationRules: {
        get: "/settings/workflow/sla-rules/escalation-rules",
        update: (id: string) =>
          `/settings/workflow/sla-rules/escalation-rules/${id}`,
      },
      fprMetrics: {
        get: "/settings/workflow/sla-rules/fpr-metrics",
        update: (id: string) =>
          `/settings/workflow/sla-rules/fpr-metrics/${id}`,
      },
    },
  },
  health: {
    status: "/",
  },
  roles: {
    list: "/roles",
    detail: (id: string) => `/roles/${id}`,
    create: "/roles/create-role",
    update: (id: string) => `/roles/${id}`,
    resources: "/resources/all-with-permissions",
    categories: "/roles/categories",
  },
  users: {
    create: "/users",
    update: (id: string) => `/users/${id}`,
    list: "/users",
    stats: "/users/stats",
    leadsManagers: "/users/team-leads-managers",
    leadership: "/users/leadership",
    byId: (id: string) => `/users/${id}`,
    status: (id: string) => `/users/${id}/status`,
    skills: (id: string) => `/users/${id}/skills`,
    withSkills: "/users/with-skills",
  },
  skills: {
    list: "/skills",
    create: "/skills",
    detail: (id: string) => `/skills/${id}`,
    update: (id: string) => `/skills/${id}`,
    delete: (id: string) => `/skills/${id}`,
    categories: "/skill-categories",
    categoriesWithSkills: "/skills/categories-with-skills",
    skillCategories: "/skills/categories",
  },
  workLocations: {
    list: "/work-locations",
  },
  teams: {
    list: "/teams",
    stats: "/teams/stats",
    byId: (id: string) => `/teams/${id}`,
  },

  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    profile: "/auth/profile",
    rolePermission: "/auth/role-permission",
    refreshToken: "/auth/refresh-token",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
    validateResetToken: "/auth/validate-reset-token",
  },
  approvals: {
    workTypeRules: {
      get: "/settings/workflow/approvals/work-type-approval-rules",
      applyDefault:
        "/settings/workflow/approvals/work-type-approval-rules/apply-defaults",
      updateStatus: (id: string) =>
        `/settings/workflow/approvals/work-type-approval-rules/${id}/status`,
    },
    decisionQueue: {
      get: "/settings/workflow/approvals/decision-queue-config",
      update: (id: string) =>
        `/settings/workflow/approvals/decision-queue-config/${id}`,
    },
    defaultRouting: {
      get: "/settings/workflow/approvals/default-routing-configs",
      updateSla: `/settings/workflow/approvals/default-routing-configs/sla`,
    },
    workflows: {
      list: "/settings/workflow/approvals/workflows",
      detail: (id: string) => `/settings/workflow/approvals/workflows/${id}`,
      create: "/settings/workflow/approvals/workflows",
      update: (id: string) => `/settings/workflow/approvals/workflows/${id}`,
      delete: (id: string) => `/settings/workflow/approvals/workflows/${id}`,
    },
    decisionTable: {
      get: "/settings/workflow/approvals/routing-decision-rules",
      exportCsv: `/settings/workflow/approvals/routing-decision-rules/export/csv`,
    },
  },
  waitReasons: {
    list: "/wait-reasons",
    active: "/wait-reasons/active",
    create: "/wait-reasons",
    detail: (id: string) => `/wait-reasons/${id}`,
    update: (id: string) => `/wait-reasons/${id}`,
    delete: (id: string) => `/wait-reasons/${id}`,
  },
  triggerEvents: {
    list: "/settings/workflow/trigger-events",
    detail: (id: string) => `/settings/workflow/trigger-events/${id}`,
    create: "/settings/workflow/trigger-events",
    update: (id: string) => `/settings/workflow/trigger-events/${id}`,
    delete: (id: string) => `/settings/workflow/trigger-events/${id}`,
    toggle: (id: string) => `/settings/workflow/trigger-events/${id}/status`,
    stats: "/settings/workflow/trigger-events/statistics",
  },
  workCategories: {
    list: "/work-categories",
    detail: (id: string) => `/settings/workflow/work-categories/${id}`,
    create: "/work-categories",
    update: (id: string) => `/work-categories/${id}`,
    delete: (id: string) => `/work-categories/${id}`,
  },
  workTypes: {
    list: "/settings/workflow/worktypes",
    detail: (id: string) => `/settings/workflow/worktypes/${id}`,
    create: "/settings/workflow/worktypes",
    update: (id: string) => `/settings/workflow/worktypes/${id}`,
    delete: (id: string) => `/settings/workflow/worktypes/${id}`,
    toggle: (id: string) => `/settings/workflow/worktypes/${id}/status`,
    statistics: "/settings/workflow/worktypes/statistics",
    usageStatistics: (id: string) =>
      `/settings/workflow/worktypes/${id}/usage-statistics`,
    stages: {
      delete: (id: string) => `/settings/workflow/worktypes/stages/${id}`,
    },
    gateRequirements: {
      delete: (id: string) =>
        `/settings/workflow/worktypes/gate-requirements/${id}`,
    },
  },
  assignment: {
    modes: {
      list: "/settings/workflow/assignment/modes",
      update: (id: string) => `/settings/workflow/assignment/modes/${id}`,
    },
    configuration: "/settings/workflow/assignment/configuration",
    metrics: "/settings/workflow/assignment/statistics",
    routingRules: {
      list: "/settings/workflow/assignment/routing-rules",
      detail: (id: string) =>
        `/settings/workflow/assignment/routing-rules/${id}`,
      create: "/settings/workflow/assignment/routing-rules",
      update: (id: string) =>
        `/settings/workflow/assignment/routing-rules/${id}`,
      delete: (id: string) =>
        `/settings/workflow/assignment/routing-rules/${id}`,
    },
    skillSets: {
      list: "/skills/categories-with-skills",
    },
    capacity: {
      get: "/settings/workflow/assignment/capacities",
      update: (id: string) => `/settings/workflow/assignment/capacities/${id}`,
    },
  },
  clients: {
    list: "/clients",
    detail: (id: string) => `/clients/${id}`,
    create: "/clients",
    update: (id: string) => `/clients/${id}`,
    delete: (id: string) => `/clients/${id}`,
  },
  states: {
    dropdown: "/states",
  },  
  payers: {
    list: "/payers",
    detail: (id: string) => `/payers/${id}`,
    create: "/payers",
    update: (id: string) => `/payers/${id}`,
    delete: (id: string) => `/payers/${id}`,
    clientAffiliations: (id: string) => `/payers/${id}/client-affiliations`,
    contacts: (id: string) => `/payers/${id}/contacts`,
    contactById: (payerId: string, id: string) => `/payers/${payerId}/contacts/${id}`,
  }
} as const;

export function getEndpoint(endpoint: string): string {
  return `${BASE_URL}${endpoint}`;
}
