# Product Roadmap

## Phase 1: MVP

### Core Layout & Navigation

- App shell with fixed sidebar navigation (72 width, dark slate theme)
- Top navigation bar with user profile and notifications
- Glass morphism design system (backdrop blur, subtle borders)
- Dark/light theme switcher with persistent user preference
- Dark theme implementation with emerald/teal accent colors
- Light theme implementation with proper contrast and accessibility
- Theme toggle component in navigation bar or user menu
- System preference detection (prefers-color-scheme)
- Theme state management and localStorage persistence
- Responsive sidebar with collapsible menu groups
- Navigation menu items with active states and hover effects
- Brand header with logo and version display
- Phase badge system for feature visibility (Phase 1/Phase 2)
- Main content area with proper spacing and scroll handling
- Typography system using Inter font family
- Color palette setup (emerald-500 primary, teal accents, slate grays for dark, appropriate light mode colors)

### Users & Roles

- Users & Roles navigation and main screen
- Four-tab interface: Users, Role Definitions, External Roles, Teams
- **Users Tab:**
  - User list/grid view with search and filters
  - User type filter (Internal/External)
  - Role filter (All Roles dropdown)
  - User creation form with fields:
    - Basic info (name, email, avatar)
    - User type selection (Internal/External)
    - Role assignment
    - Scope/Client access configuration
    - Location assignment
    - Status (Active/Inactive)
  - User edit functionality
  - User detail view/modal
  - User deletion with confirmation
  - Bulk actions support (status changes)
  - User statistics cards (Total Users, Internal Users, External Clients, Active Users)
- **RBAC (Role-Based Access Control) Implementation:**
  - API integration for user authentication and permissions
  - API response structure includes:
    - User profile data (id, email, firstName)
    - Assigned role details (id, roleName, isInternal flag)
    - rolePermissions array organized by resource
    - Each resource contains:
      - resourceId and resourceName
      - permissions array with id, name, code, description
  - Resources covered:
    - providers (view_all, create, update, delete)
    - enrollments (view_all, create, update, delete, change_stage, reassign, bulk)
    - tasks (view_all, create, complete, reassign)
    - clients (view_all, view_details, create, update, manage_sla)
    - users (view_all, create, update, assign_roles, deactivate, reset_password)
  - Permission-based UI rendering (hide/show features based on user permissions)
  - Permission checks before API calls and user actions
  - Context provider for global access to user permissions
  - Permission utility functions for checking resource access
  - Integration with Settings Module for role configuration
- **Role Definitions Tab (Internal Roles):**
  - Pre-seeded internal role cards displayed in grid layout
  - Roles include:
    - Super Admin (Leadership, full platform control)
    - Manager/Director (Leadership, team oversight)
    - Team Lead (Leadership, assigned client access)
    - Case Analyst (Operations, customizable scope)
    - Verification Coordinator (Operations, document verification)
    - QC Analyst (Quality, audits and sampling)
    - Schema Analyst (Operations, payer playbooks)
  - Each role card displays:
    - Role name and category badge
    - Description
    - Permission summary (Full Access count, Limited count)
    - Scope restrictions (All Clients/Assigned Scope)
    - Customizable badge (where applicable)
  - Create custom role functionality
  - Role detail view showing full permission breakdown
  - Role edit capability for custom roles
- **External Roles Tab (Client Portal Roles):**
  - Pre-seeded external role cards displayed in grid layout
  - Roles include:
    - Client Admin (Client Leadership, full org access)
    - MSO Director (Client Leadership, multi-facility coordination)
    - Facility Manager (Client Operations, single/multi-facility)
    - CXO/Finance (Client Finance, financial oversight)
    - Recruiter (Client Operations, provider onboarding)
    - Provider (Self-Service, individual tracking)
  - Each role card displays:
    - Role name and category badge
    - Description
    - Typical user types
    - Permission level indicators
    - Scope restrictions (All Facilities/Assigned Only)
  - Read-only role display (pre-configured templates)
  - Role card organization by category
- **Teams Tab:**
  - Team management interface for organizing users into operational groups
  - Team list/grid view with search and filters
  - Team creation and editing capabilities
  - Each team card/row displays:
    - Team name and description
    - Team lead assignment
    - Member count with quick view
    - Associated clients/scope
    - Team type/category (Enrollment, Credentialing, Verification, Quality, etc.)
    - Status (Active/Inactive)
  - Team detail view showing:
    - Team overview (name, description, lead, type)
    - Team members list with roles and skills
    - Team capacity and workload metrics
    - Assigned clients and scope restrictions
    - Team performance indicators (optional)
  - Add/remove team members functionality
  - Assign team lead capability
  - Team-level skill requirements configuration
  - Bulk user assignment to teams
  - Team statistics cards (Total Teams, Total Members, Active Teams)

### RBAC (Role-Based Access Control) System

**Complexity: High** | **Priority: Critical**

The RBAC system is foundational to InCredibly's security and user management architecture. It controls what users can see and do throughout the platform based on their assigned roles and permissions.

#### RBAC Architecture & Implementation

**API Integration:**

- Backend API endpoint provides user authentication and permission data
- API response structure:
  ```typescript
  {
    id: string; // User unique identifier
    email: string; // User email
    firstName: string; // User first name
    role: {
      id: string; // Role unique identifier
      roleName: string; // Role display name (e.g., "Super Admin")
      isInternal: boolean; // Internal vs External role flag
      rolePermissions: Array<{
        resourceId: string; // Resource unique identifier
        resourceName: string; // Resource name (e.g., "providers", "enrollments")
        permissions: Array<{
          id: string; // Permission unique identifier
          name: string; // Permission name (e.g., "view_all", "create")
          code: string; // Permission code for system use
          description: string; // Human-readable description
        }>;
      }>;
    }
  }
  ```

**Resources & Permissions:**

The system supports granular permissions across these core resources:

1. **Providers Resource:**
   - `view_all` - View all providers in the system
   - `create` - Create new provider records
   - `update` - Edit existing provider information
   - `delete` - Remove provider records

2. **Enrollments Resource:**
   - `view_all` - View all enrollment cases
   - `create` - Create new enrollment cases
   - `update` - Modify enrollment case data
   - `delete` - Remove enrollment cases
   - `change_stage` - Move cases between workflow stages
   - `reassign` - Reassign cases to different analysts
   - `bulk` - Perform bulk operations on multiple cases

3. **Tasks Resource:**
   - `view_all` - View all tasks across the system
   - `create` - Create new tasks
   - `complete` - Mark tasks as complete
   - `reassign` - Reassign tasks to different users

4. **Clients Resource:**
   - `view_all` - View all clients in the system
   - `view_details` - View detailed client information
   - `create` - Create new client records
   - `update` - Edit client information
   - `manage_sla` - Manage client SLA configurations

5. **Users Resource:**
   - `view_all` - View all users in the system
   - `create` - Create new user accounts
   - `update` - Edit user information
   - `assign_roles` - Assign roles to users
   - `deactivate` - Deactivate user accounts
   - `reset_password` - Reset user passwords

**Frontend Implementation:**

**Permission Context Provider:**

- Global context provider wrapping the application
- Provides current user's role and permissions to all components
- Implements permission checking utilities:
  - `hasPermission(resource, permission)` - Check single permission
  - `hasAnyPermission(resource, permissions[])` - Check if user has any of the listed permissions
  - `hasAllPermissions(resource, permissions[])` - Check if user has all listed permissions
  - `canAccess(resource)` - Check if user can access resource at all

**Permission-Based UI Rendering:**

- Conditional rendering of navigation items based on permissions
- Hide/show buttons and actions based on user permissions
- Disable features user doesn't have access to (vs removing entirely)
- Show permission-denied messages where appropriate
- Protect routes with permission checks (redirect if unauthorized)

**Permission Guards:**

- Higher-order components (HOCs) for wrapping protected components
- Route-level guards in Next.js middleware or page components
- API call guards (check permission before making request)
- Form action guards (disable submit if user lacks permission)

**Permission Utilities:**

- TypeScript types for type-safe permission checking
- Constants file for all resource names and permission names
- Helper functions for common permission patterns
- Permission matrix display for debugging (dev mode only)

**Integration Points:**

- Settings Module: Permission checks for configuration changes
- Users & Roles: Permission-based access to user management
- Providers Module: Resource-level permissions for provider CRUD
- Enrollments Module: Stage transitions and reassignment permissions
- Tasks Module: Task creation and completion permissions
- Clients Module: Client management and SLA configuration permissions

**Security Considerations:**

- Never rely solely on frontend permission checks for security
- Backend must validate all permissions on API calls
- Frontend permissions are for UX optimization only
- Log permission check failures for security monitoring
- Implement rate limiting on permission check endpoints

**Error Handling:**

- Graceful degradation when permission API is unavailable
- Clear error messages for permission-denied scenarios
- Fallback UI for users with no permissions
- Redirect to appropriate pages based on role (e.g., analysts → inbox, admins → dashboard)

**Testing:**

- Unit tests for permission utility functions
- Integration tests for permission context provider
- Component tests with mocked permission states
- E2E tests for critical permission-protected workflows
- Test all role types (Super Admin, Manager, Analyst, etc.)
- Test permission boundary cases (no permissions, partial permissions)

---
