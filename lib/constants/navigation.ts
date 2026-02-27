import type { IconSvgElement } from "@hugeicons/react";
import {
  DashboardCircleIcon,
  Task01Icon,
  Mail01Icon,
  Briefcase01Icon,
  Building01Icon,
  UserMultiple02Icon,
  CreditCardIcon,
  OfficeIcon,
  BookOpen01Icon,
  LibraryIcon,
  Folder01Icon,
  Database01Icon,
  ChartBarLineIcon,
  BarChartIcon,
  CheckmarkCircle02Icon,
  FileValidationIcon,
  UserIcon,
  Settings01Icon,
  GlobeIcon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import type { PermissionName, ResourceName } from "@/features/auth/types/permissions";
import type { CurrentUserResponse } from "@/features/auth/types";
import { RESOURCES, PERMISSIONS } from "@/features/auth/utils/permission-constants";
import {
  checkUserPermission,
  checkUserAnyPermission,
} from "@/features/auth/utils/permission-helpers";

export interface NavigationItem {
  id: string;
  label: string;
  icon: IconSvgElement;
  href: string;
  badge?: number;
  phase: 1 | 2;
  resource?: ResourceName;
  /**
   * Single permission — user must have this exact permission on `resource`.
   * Use `permissions` instead when any one of multiple permissions should grant access.
   */
  permission?: PermissionName;
  /**
   * Multiple permissions (OR) — user needs at least one of these on `resource`.
   * Takes precedence over `permission` when both are set.
   */
  permissions?: PermissionName[];
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
  collapsible: boolean;
  phase: 1 | 2;
  resource?: ResourceName;
  permission?: PermissionName;
}

export const appRoutes = {
  auth: {
    login: "/login",
  },
  myWork: {
    dashboard: "/my-work/dashboard",
    myTasks: "/my-work/my-tasks",
    caseInbox: "/my-work/case-inbox",
    emailInbox: "/my-work/email-inbox",
  },
  workQueues: {
    workOrders: "/work-queues/work-orders",
  },
  records: {
    clients: "/records/clients",
    providers: "/records/providers",
    payers: "/records/payers",
    businessEntities: "/records/business-entities",
    businessEntityDetails: (id: string, tab?: string) =>
      tab
        ? `/records/business-entities/${id}?tab=${tab}`
        : `/records/business-entities/${id}`,
  },
  knowledgeBase: {
    payerGuides: "/knowledge-base/payer-guides",
    stateBoards: "/knowledge-base/state-boards",
    documentTemplates: "/knowledge-base/document-templates",
    payerLibrary: "/knowledge-base/payer-library",
    schemaWorkspace: "/knowledge-base/schema-workspace",
  },
  analytics: {
    performance: "/analytics/performance",
    clientInsights: "/analytics/client-insights",
    ncqaCompliance: "/analytics/ncqa-compliance",
    complianceAudit: "/analytics/compliance-audit",
  },
  operations: {
    clientIntake: "/operations/client-intake",
    decisionQueue: "/operations/decision-queue",
    payerRequests: "/operations/payer-requests",
  },
  qualityControl: {
    qcDashboard: "/quality-control/qc-dashboard",
    auditQueue: "/quality-control/audit-queue",
    auditSheets: "/quality-control/audit-sheets",
    samplingConfig: "/quality-control/sampling-config",
    analystScorecard: "/quality-control/analyst-scorecard",
    trainingNeeds: "/quality-control/training-needs",
    firstPassRate: "/quality-control/first-pass-rate",
  },
  development: {
    portalPreview: "/development/portal-preview",
  },
  administration: {
    usersRoles: (tab: string) => `/administration/users-roles?tab=${tab}`,
    userDetails: (tab: string, id: string) => `/administration/users-roles/${id}?tab=${tab}`,
    addNewUserRole: (tab: string) => `/administration/users-roles/new?tab=${tab}`,
    settings: "/settings",
    portalConfig: "/administration/portal-config",
    billing: "/administration/billing",
  },
  settings: {
    workflow: {
      approvals: (tab: string) => `/settings/workflow/approvals?tab=${tab}`,
      waitReasons: "/settings/workflow/wait-reasons",
      workTypes: "/settings/workflow/work-types",
      newWorkType: "/settings/workflow/work-types/new",
      editWorkType: (id: string) => `/settings/workflow/work-types/${id}/edit`,
    },
  },
} as const;

export const navigationSections: NavigationSection[] = [
  {
    id: "mywork",
    label: "MY WORK",
    collapsible: false,
    phase: 1,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: DashboardCircleIcon,
        href: appRoutes.myWork.dashboard,
        phase: 1,
      },
      {
        id: "mytasks",
        label: "My Tasks",
        icon: Task01Icon,
        href: appRoutes.myWork.myTasks,
        badge: 0,
        phase: 1,
      },
      {
        id: "caseinbox",
        label: "Case Inbox",
        icon: Mail01Icon,
        href: appRoutes.myWork.caseInbox,
        phase: 1,
      },
      {
        id: "emailinbox",
        label: "Email Inbox",
        icon: Mail01Icon,
        href: appRoutes.myWork.emailInbox,
        badge: 0,
        phase: 1,
      },
    ],
  },
  {
    id: "workqueues",
    label: "WORK QUEUES",
    collapsible: false,
    phase: 1,
    items: [
      {
        id: "allwork",
        label: "All Work Orders",
        icon: Briefcase01Icon,
        href: appRoutes.workQueues.workOrders,
        badge: 0,
        phase: 1,
      },
    ],
  },
  {
    id: "records",
    label: "RECORDS",
    collapsible: false,
    phase: 1,
    items: [
      {
        id: "clients",
        label: "Clients",
        icon: Building01Icon,
        href: appRoutes.records.clients,
        badge: 5,
        phase: 1,
        resource: RESOURCES.CLIENTS,
        permissions: [
          PERMISSIONS.CLIENTS_VIEW_DETAILS, 
          PERMISSIONS.CLIENTS_VIEW_ALL,
          PERMISSIONS.CLIENTS_CREATE,
          PERMISSIONS.CLIENTS_UPDATE
        ],
      },
      {
        id: "providers",
        label: "Providers",
        icon: UserMultiple02Icon,
        href: appRoutes.records.providers,
        phase: 1,
        resource: RESOURCES.PROVIDERS,
        permission: PERMISSIONS.VIEW_ALL,
      },
      {
        id: "payers",
        label: "Payers",
        icon: CreditCardIcon,
        href: appRoutes.records.payers,
        phase: 1,
        resource: RESOURCES.PAYERS,
        permission: PERMISSIONS.VIEW_ALL,
      },
      {
        id: "businessentities",
        label: "Business Entities",
        icon: OfficeIcon,
        href: appRoutes.records.businessEntities,
        phase: 1,
        resource: RESOURCES.BUSINESS_ENTITIES,
        permission: PERMISSIONS.VIEW_ALL,
      },
    ],
  },
  {
    id: "knowledgebase",
    label: "KNOWLEDGE BASE",
    collapsible: false,
    phase: 1,
    items: [
      {
        id: "payerguides",
        label: "Payer Guides",
        icon: BookOpen01Icon,
        href: appRoutes.knowledgeBase.payerGuides,
        phase: 1,
      },
      {
        id: "stateboards",
        label: "State Board Directory",
        icon: LibraryIcon,
        href: appRoutes.knowledgeBase.stateBoards,
        phase: 2,
      },
      {
        id: "documenttemplates",
        label: "Document Templates",
        icon: Folder01Icon,
        href: appRoutes.knowledgeBase.documentTemplates,
        phase: 2,
      },
      {
        id: "payerlibrary",
        label: "Payer Library",
        icon: Database01Icon,
        href: appRoutes.knowledgeBase.payerLibrary,
        phase: 2,
      },
      {
        id: "schemaworkspace",
        label: "Schema Workspace",
        icon: Database01Icon,
        href: appRoutes.knowledgeBase.schemaWorkspace,
        phase: 2,
      },
    ],
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    collapsible: false,
    phase: 1,
    items: [
      {
        id: "performance",
        label: "Performance",
        icon: ChartBarLineIcon,
        href: appRoutes.analytics.performance,
        phase: 1,
      },
      {
        id: "clientinsights",
        label: "Client Insights",
        icon: BarChartIcon,
        href: appRoutes.analytics.clientInsights,
        phase: 1,
      },
      {
        id: "ncqacompliance",
        label: "NCQA Compliance",
        icon: CheckmarkCircle02Icon,
        href: appRoutes.analytics.ncqaCompliance,
        phase: 2,
      },
      {
        id: "complianceaudit",
        label: "Compliance & Audit",
        icon: FileValidationIcon,
        href: appRoutes.analytics.complianceAudit,
        phase: 2,
      },
    ],
  },
  {
    id: "operations",
    label: "OPERATIONS",
    collapsible: false,
    phase: 2,
    items: [
      {
        id: "clientintake",
        label: "Client Intake",
        icon: Building01Icon,
        href: appRoutes.operations.clientIntake,
        phase: 2,
      },
      {
        id: "decisionqueue",
        label: "Decision Queue",
        icon: Task01Icon,
        href: appRoutes.operations.decisionQueue,
        phase: 2,
      },
      {
        id: "payerrequests",
        label: "Payer Requests",
        icon: Mail01Icon,
        href: appRoutes.operations.payerRequests,
        phase: 2,
      },
    ],
  },
  {
    id: "qualitycontrol",
    label: "QUALITY CONTROL",
    collapsible: false,
    phase: 2,
    items: [
      {
        id: "qcdashboard",
        label: "QC Dashboard",
        icon: DashboardCircleIcon,
        href: appRoutes.qualityControl.qcDashboard,
        phase: 2,
      },
      {
        id: "auditqueue",
        label: "Audit Queue",
        icon: FileValidationIcon,
        href: appRoutes.qualityControl.auditQueue,
        phase: 2,
      },
      {
        id: "auditsheets",
        label: "Audit Sheets",
        icon: Folder01Icon,
        href: appRoutes.qualityControl.auditSheets,
        phase: 2,
      },
      {
        id: "samplingconfig",
        label: "Sampling Config",
        icon: Settings01Icon,
        href: appRoutes.qualityControl.samplingConfig,
        phase: 2,
      },
      {
        id: "analystscorecard",
        label: "Analyst Scorecard",
        icon: BarChartIcon,
        href: appRoutes.qualityControl.analystScorecard,
        phase: 2,
      },
      {
        id: "trainingneeds",
        label: "Training Needs",
        icon: BookOpen01Icon,
        href: appRoutes.qualityControl.trainingNeeds,
        phase: 2,
      },
      {
        id: "firstpassrate",
        label: "First Pass Rate",
        icon: ChartBarLineIcon,
        href: appRoutes.qualityControl.firstPassRate,
        phase: 1,
      },
    ],
  },
  {
    id: "development",
    label: "DEVELOPMENT",
    collapsible: false,
    phase: 1,
    items: [
      {
        id: "portalpreview",
        label: "Portal Preview",
        icon: GlobeIcon,
        href: appRoutes.development.portalPreview,
        phase: 1,
      },
    ],
  },
  {
    id: "administration",
    label: "ADMINISTRATION",
    collapsible: false,
    phase: 1,
    items: [
      {
        id: "usersroles",
        label: "Users & Roles",
        icon: UserIcon,
        href: appRoutes.administration.usersRoles("users"),
        phase: 1,
        resource: RESOURCES.USERS,
        permission: PERMISSIONS.USERS_VIEW_ALL,
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings01Icon,
        href: appRoutes.administration.settings,
        phase: 1,
        resource: RESOURCES.WORKFLOW_CONFIG,
        permissions: [
          PERMISSIONS.WORKFLOW_VIEW_WORK_TYPES,
          PERMISSIONS.WORKFLOW_MANAGE_WORK_TYPES,
          PERMISSIONS.WORKFLOW_VIEW_SLA_RULES,
          PERMISSIONS.WORKFLOW_MANAGE_SLA_RULES,
          PERMISSIONS.WORKFLOW_VIEW_TRIGGERS,
          PERMISSIONS.WORKFLOW_MANAGE_TRIGGERS,
          PERMISSIONS.WORKFLOW_VIEW_FOLLOWUPS,
          PERMISSIONS.WORKFLOW_MANAGE_FOLLOWUPS,
          PERMISSIONS.WORKFLOW_VIEW_WAIT_REASONS,
          PERMISSIONS.WORKFLOW_MANAGE_WAIT_REASONS,
          PERMISSIONS.WORKFLOW_VIEW_APPROVAL_WORKFLOWS,
          PERMISSIONS.WORKFLOW_MANAGE_APPROVAL_WORKFLOWS,
          PERMISSIONS.WORKFLOW_VIEW_ROUTING_RULES,
          PERMISSIONS.WORKFLOW_MANAGE_ROUTING_RULES,
          PERMISSIONS.WORKFLOW_VIEW_SKILLS,
          PERMISSIONS.WORKFLOW_MANAGE_SKILLS,
        ],
      },
      {
        id: "portalconfig",
        label: "Portal Configuration",
        icon: Settings01Icon,
        href: appRoutes.administration.portalConfig,
        phase: 2,
        resource: RESOURCES.SYSTEM_SETTINGS,
        permission: PERMISSIONS.SYSTEM_MANAGE_PORTAL,
      },
      {
        id: "billing",
        label: "Billing",
        icon: Invoice01Icon,
        href: appRoutes.administration.billing,
        phase: 2,
        resource: RESOURCES.SYSTEM_SETTINGS,
        permission: PERMISSIONS.SYSTEM_MANAGE_BILLING,
      },
    ],
  },
];

/**
 * Filter navigation sections to show only Phase 1 items
 */
export function getPhase1Navigation(): NavigationSection[] {
  return navigationSections
    .filter((section) => {
      const hasPhase1Items = section.items.some((item) => item.phase === 1);
      return hasPhase1Items;
    })
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.phase === 1),
    }));
}

/**
 * Get all navigation items as a flat array
 */
export function getAllNavigationItems(): NavigationItem[] {
  return navigationSections.flatMap((section) => section.items);
}

/**
 * Find navigation item by href
 */
export function findNavigationItemByHref(
  href: string,
): NavigationItem | undefined {
  return getAllNavigationItems().find((item) => item.href === href);
}

/**
 * Find parent section for a navigation item
 */
export function findParentSection(
  itemId: string,
): NavigationSection | undefined {
  return navigationSections.find((section) =>
    section.items.some((item) => item.id === itemId),
  );
}

/**
 * Check if user has permission to access a navigation item.
 *
 * - No resource defined → always visible (public item)
 * - `permissions` array → visible if user has ANY one of them on `resource`
 * - `permission` string → visible if user has that exact permission on `resource`
 */
export function hasPermission(
  user: CurrentUserResponse | null,
  item: NavigationItem,
): boolean {
  if (!item.resource) return true;

  if (item.permissions && item.permissions.length > 0) {
    return checkUserAnyPermission(user, item.resource, item.permissions);
  }

  if (item.permission) {
    return checkUserPermission(user, item.resource, item.permission);
  }

  return true;
}
