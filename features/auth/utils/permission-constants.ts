import type { PermissionName, ResourceName } from "../types/permissions";

/**
 * Centralized resource name constants for RBAC.
 * Use these constants instead of string literals to prevent typos.
 */
export const RESOURCES = {
  PROVIDERS: "Providers",
  ENROLLMENTS: "Enrollments",
  TASKS: "Tasks",
  PAYERS: "Payers",
  BUSINESS_ENTITIES: "Business Entities",
  NOTES: "Notes",
  DASHBOARDS: "Dashboards",
  REVENUE_INSIGHTS: "Revenue Insights",
  REPORTS: "Reports",
  USERS: "Users",
  WORKFLOW_CONFIG: "Workflow Config",
  SYSTEM_SETTINGS: "System Settings",
  KNOWLEDGE_BASE: "Knowledge Base",
  CLIENTS: "Clients",
} as const satisfies Record<string, ResourceName>;

/**
 * Centralized permission code constants for RBAC.
 * Use these constants instead of string literals to prevent typos.
 */
export const PERMISSIONS = {
  // General permissions
  CREATE: "create",
  DELETE: "delete",
  UPDATE: "update",
  VIEW_ALL: "view_all",
  BULK: "bulk",
  CHANGE_STAGE: "change_stage",
  REASSIGN: "reassign",
  COMPLETE: "complete",
  MANAGE_SLA: "manage_sla",
  MANAGE: "manage",
  MANAGE_PLAYBOOKS: "manage_playbooks",
  LOG: "log",
  VIEW: "view",
  EDIT_OWN: "edit_own",
  MARK_INTERNAL: "mark_internal",

  // Dashboard permissions
  BILLING: "billing",
  EXECUTIVE: "executive",
  SCHEMA: "schema",
  VIEW_NEARING_BILLABLE: "view_nearing_billable",
  VIEW_REVENUE_FORECAST: "view_revenue_forecast",

  // Report permissions
  REPORTS_EXPORT: "reports.export",
  REPORTS_RUN: "reports.run",
  REPORTS_SCHEDULE: "reports.schedule",
  REPORTS_VIEW_AUDIT_LOGS: "reports.view_audit_logs",

  // User permissions
  USERS_ASSIGN_ROLES: "users.assign_roles",
  USERS_CREATE: "users.create",
  USERS_DEACTIVATE: "users.deactivate",
  USERS_RESET_PASSWORD: "users.reset_password",
  USERS_UPDATE: "users.update",
  USERS_VIEW_ALL: "users.view_all",

  // Workflow config permissions
  WORKFLOW_MANAGE_APPROVAL_WORKFLOWS: "workflow_config.manage_approval_workflows",
  WORKFLOW_MANAGE_FOLLOWUPS: "workflow_config.manage_followups",
  WORKFLOW_MANAGE_ROUTING_RULES: "workflow_config.manage_routing_rules",
  WORKFLOW_MANAGE_SKILLS: "workflow_config.manage_skills",
  WORKFLOW_MANAGE_SLA_RULES: "workflow_config.manage_sla_rules",
  WORKFLOW_MANAGE_TRIGGERS: "workflow_config.manage_triggers",
  WORKFLOW_MANAGE_WAIT_REASONS: "workflow_config.manage_wait_reasons",
  WORKFLOW_MANAGE_WORK_TYPES: "workflow_config.manage_work_types",
  WORKFLOW_VIEW_APPROVAL_WORKFLOWS: "workflow_config.view_approval_workflows",
  WORKFLOW_VIEW_FOLLOWUPS: "workflow_config.view_followups",
  WORKFLOW_VIEW_ROUTING_RULES: "workflow_config.view_routing_rules",
  WORKFLOW_VIEW_SKILLS: "workflow_config.view_skills",
  WORKFLOW_VIEW_SLA_RULES: "workflow_config.view_sla_rules",
  WORKFLOW_VIEW_TRIGGERS: "workflow_config.view_triggers",
  WORKFLOW_VIEW_WAIT_REASONS: "workflow_config.view_wait_reasons",
  WORKFLOW_VIEW_WORK_TYPES: "workflow_config.view_work_types",

  // System settings permissions
  SYSTEM_MANAGE_BILLING: "system_settings.manage_billing",
  SYSTEM_MANAGE_INTEGRATIONS: "system_settings.manage_integrations",
  SYSTEM_MANAGE_PORTAL: "system_settings.manage_portal",
  SYSTEM_MANAGE_SYSTEM: "system_settings.manage_system",

  // Knowledge base permissions
  KB_ACCESS_SCHEMA_WORKSPACE: "knowledge_base.access_schema_workspace",
  KB_EDIT_PAYER_GUIDES: "knowledge_base.edit_payer_guides",
  KB_EDIT_STATE_BOARDS: "knowledge_base.edit_state_boards",
  KB_MANAGE_DOC_TEMPLATES: "knowledge_base.manage_doc_templates",
  KB_VIEW_DOC_TEMPLATES: "knowledge_base.view_doc_templates",
  KB_VIEW_PAYER_GUIDES: "knowledge_base.view_payer_guides",
  KB_VIEW_STATE_BOARDS: "knowledge_base.view_state_boards",

  // Clients permissions
  CLIENTS_VIEW_DETAILS: "client.view_details",
  CLIENTS_CREATE: "client.create",
  CLIENTS_UPDATE: "client.update",
  CLIENTS_DELETE: "client.delete",
  CLIENTS_VIEW_ALL: "client.view_all",
} as const satisfies Record<string, PermissionName>;

/**
 * Helper type for getting permission values
 */
export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Helper type for getting resource values
 */
export type ResourceValue = (typeof RESOURCES)[keyof typeof RESOURCES];
