/**
 * Supported resource names in the RBAC system
 */
export type ResourceName =
  | "Providers"
  | "Enrollments"
  | "Tasks"
  | "Payers"
  | "Business Entities"
  | "Notes"
  | "Dashboards"
  | "Revenue Insights"
  | "Reports"
  | "Users"
  | "Workflow Config"
  | "System Settings"
  | "Knowledge Base"
  | "Clients";

/**
 * Supported permission names in the RBAC system
 */
export type PermissionName =
  | "create" // Create new records
  | "delete" // Remove records
  | "update" // Edit existing records
  | "view_all" // View all records of a resource
  | "bulk" // Perform bulk operations
  | "change_stage" // Change workflow stage
  | "reassign" // Reassign to different user
  | "complete" // Mark task as complete
  | "manage_sla" // Manage SLA configurations
  | "manage" // Create or edit entity
  | "manage_playbooks" // Manage payer playbooks
  | "log" // Log a communication
  | "view" // View records/details
  | "edit_own" // Edit own records
  | "mark_internal" // Mark as internal
  | "billing" // Access billing dashboard
  | "executive" // Access executive dashboard
  | "schema" // Access schema dashboard
  | "view_nearing_billable" // View near-billable items
  | "view_revenue_forecast" // View revenue forecast
  | "reports.export" // Export reports
  | "reports.run" // Run reports
  | "reports.schedule" // Schedule reports
  | "reports.view_audit_logs" // View report audit logs
  | "users.assign_roles" // Assign roles to users
  | "users.create" // Create users
  | "users.deactivate" // Deactivate user accounts
  | "users.reset_password" // Reset user passwords
  | "users.update" // Update user details
  | "users.view_all" // View all users
  | "workflow_config.manage_approval_workflows" // Manage approval workflows
  | "workflow_config.manage_followups" // Manage follow-up rules
  | "workflow_config.manage_routing_rules" // Manage routing rules
  | "workflow_config.manage_skills" // Manage skills
  | "workflow_config.manage_sla_rules" // Manage SLA rules
  | "workflow_config.manage_triggers" // Manage trigger events
  | "workflow_config.manage_wait_reasons" // Manage wait reasons
  | "workflow_config.manage_work_types" // Manage work types
  | "workflow_config.view_approval_workflows" // View approval workflows
  | "workflow_config.view_followups" // View follow-up rules
  | "workflow_config.view_routing_rules" // View routing rules
  | "workflow_config.view_skills" // View skills
  | "workflow_config.view_sla_rules" // View SLA rules
  | "workflow_config.view_triggers" // View triggers
  | "workflow_config.view_wait_reasons" // View wait reasons
  | "workflow_config.view_work_types" // View work types
  | "system_settings.manage_billing" // Manage billing & invoicing
  | "system_settings.manage_integrations" // Manage integrations
  | "system_settings.manage_portal" // Manage portal settings
  | "system_settings.manage_system" // Full system configuration
  | "knowledge_base.access_schema_workspace" // Access schema workspace
  | "knowledge_base.edit_payer_guides" // Edit payer guides
  | "knowledge_base.edit_state_boards" // Edit state boards
  | "knowledge_base.manage_doc_templates" // Manage document templates
  | "knowledge_base.view_doc_templates" // View document templates
  | "knowledge_base.view_payer_guides" // View payer guides
  | "knowledge_base.view_state_boards" // View state boards
  | "client.view_details" // View details of a record
  | "client.create" // Create a new client
  | "client.update" // Update a client
  | "client.delete" // Delete a client
  | "client.view_all" // View all clients
  | "client.view" // View a client

/**
 * Individual permission
 */
export interface Permission {
  id: string;
  name: string;
  code: PermissionName;
  description: string;
}

/**
 * Resource permission mapping
 */
export interface RolePermission {
  resourceId: string;
  resourceName: string;
  permissions: Permission[];
}
