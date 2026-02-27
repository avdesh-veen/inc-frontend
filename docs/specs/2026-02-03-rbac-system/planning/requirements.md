# RBAC System - Feature Requirements

## Overview

Implement a comprehensive Role-Based Access Control (RBAC) system that controls what users can see and do throughout the InCredibly platform based on their assigned roles and permissions. The system will integrate with the backend authentication API and provide permission-based UI rendering, route protection, and action authorization across all modules.

## Problem Statement

Currently, the platform lacks a centralized permission management system. While role definitions exist in the Users & Roles module, there is no implementation of:

- Permission-based UI rendering (navigation, buttons, features)
- Route protection based on user permissions
- Action authorization before API calls
- Resource-level permission checking
- Graceful handling of unauthorized access attempts
- Type-safe permission utilities for developers

This gap creates security risks and UX issues:

- Users may see features they cannot access
- No clear feedback when actions are unauthorized
- Inconsistent permission enforcement across modules
- Difficult for developers to implement permission checks
- No central source of truth for user permissions

## User Stories

### As a User:

- I want to see only the features I have access to so I'm not confused by unavailable options
- I want clear feedback when I try to access something I don't have permission for
- I want to be redirected to appropriate pages based on my role (e.g., analysts → inbox, admins → dashboard)

### As a Developer:

- I want type-safe permission checking utilities so I can easily implement access control
- I want a central permission context so I don't need to pass permissions through props
- I want clear patterns for protecting routes and components
- I want to check permissions before making API calls to avoid unnecessary requests

### As a Super Admin:

- I want to assign roles to users knowing the system will enforce those permissions
- I want to see audit logs of permission-denied attempts for security monitoring
- I want the system to prevent unauthorized access at multiple levels (UI, routes, API)

### As a Manager:

- I want team leads to see only their team's data
- I want analysts to see only cases assigned to them
- I want permissions to be enforced consistently across all features

## Feature Requirements

### 1. API Integration & Authentication

**Backend API Endpoint:**

- Endpoint: `/api/auth/me` or similar
- Returns user profile, role, and permissions
- Called after successful login
- Response cached for session duration

**API Response Structure:**

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

**Session Management:**

- Store permissions in memory (context)
- Refresh permissions when role changes
- Clear permissions on logout
- Handle session expiration gracefully

### 2. Resources & Permissions

**Supported Resources:**

1. **providers** - Provider management
   - `view_all` - View all providers in the system
   - `create` - Create new provider records
   - `update` - Edit existing provider information
   - `delete` - Remove provider records

2. **enrollments** - Enrollment case management
   - `view_all` - View all enrollment cases
   - `create` - Create new enrollment cases
   - `update` - Modify enrollment case data
   - `delete` - Remove enrollment cases
   - `change_stage` - Move cases between workflow stages
   - `reassign` - Reassign cases to different analysts
   - `bulk` - Perform bulk operations on multiple cases

3. **tasks** - Task management
   - `view_all` - View all tasks across the system
   - `create` - Create new tasks
   - `complete` - Mark tasks as complete
   - `reassign` - Reassign tasks to different users

4. **clients** - Client management
   - `view_all` - View all clients in the system
   - `view_details` - View detailed client information
   - `create` - Create new client records
   - `update` - Edit client information
   - `manage_sla` - Manage client SLA configurations

5. **users** - User administration
   - `view_all` - View all users in the system
   - `create` - Create new user accounts
   - `update` - Edit user information
   - `assign_roles` - Assign roles to users
   - `deactivate` - Deactivate user accounts
   - `reset_password` - Reset user passwords

**Permission Naming Convention:**

- Use lowercase with underscores
- Start with action verb (view, create, update, delete)
- Resource-specific actions clearly named (change_stage, reassign, manage_sla)

### 3. Permission Context Provider

**Implementation:**

- React Context API for global permission state
- Provider wraps entire application at root level
- Fetches permissions on mount and after login
- Provides permission utilities to all components

**Context Interface:**

```typescript
interface PermissionContext {
  user: User | null;
  permissions: RolePermissions[];
  loading: boolean;
  error: Error | null;
  hasPermission: (resource: string, permission: string) => boolean;
  hasAnyPermission: (resource: string, permissions: string[]) => boolean;
  hasAllPermissions: (resource: string, permissions: string[]) => boolean;
  canAccess: (resource: string) => boolean;
  refreshPermissions: () => Promise<void>;
}
```

**Permission Utility Functions:**

- `hasPermission(resource, permission)` - Check single permission
- `hasAnyPermission(resource, permissions[])` - Check if user has any listed permission
- `hasAllPermissions(resource, permissions[])` - Check if user has all listed permissions
- `canAccess(resource)` - Check if user can access resource (any permission)

### 4. Permission-Based UI Rendering

**Navigation Menu:**

- Hide navigation items user cannot access
- Example: Hide "Users & Roles" if user lacks `users.view_all`
- Show disabled state for partial permissions (can view but not edit)

**Buttons & Actions:**

- Hide action buttons user cannot perform
- Example: Hide "Create Provider" if user lacks `providers.create`
- Disable buttons with tooltip explaining missing permission
- Show lock icon for locked features

**Conditional Content:**

- Hide sections/tabs user cannot access
- Example: Hide "Settings" tab if user is not admin
- Show permission-denied placeholder for restricted content

**Component Patterns:**

```typescript
// Example: Conditional rendering
{hasPermission('providers', 'create') && (
  <Button onClick={handleCreate}>Create Provider</Button>
)}

// Example: Permission wrapper component
<PermissionGuard resource="providers" permission="update">
  <EditProviderForm />
</PermissionGuard>

// Example: Hook usage
const { hasPermission } = usePermissions();
const canEdit = hasPermission('providers', 'update');
```

### 5. Route Protection

**Protected Routes:**

- Middleware checks permissions before rendering route
- Redirect unauthorized users to appropriate page
- Show 403 Forbidden page for permission-denied
- Track unauthorized access attempts for security

**Route Protection Patterns:**

```typescript
// Page-level protection
export default function ProvidersPage() {
  useRequirePermission('providers', 'view_all');
  // ... page content
}

// Layout-level protection
export default function SettingsLayout({ children }) {
  useRequirePermission('users', 'view_all');
  return <div>{children}</div>;
}
```

**Redirect Logic:**

- Unauthorized users redirected to home/my-work/dashboard
- External users redirected to client portal
- Show toast notification explaining why redirected

### 6. Permission-Denied Handling

**Error Messages:**

- Clear, user-friendly messages
- Explain why access was denied
- Suggest who to contact for access
- No technical jargon

**UI States:**

- 403 Forbidden page for protected routes
- Permission-denied placeholder for sections
- Disabled state for unauthorized actions
- Toast notifications for action attempts

**Example Messages:**

- "You don't have permission to view this page. Contact your manager to request access."
- "Creating providers requires additional permissions. Speak with your team lead."
- "This feature is restricted to administrators."

### 7. Permission Integration with Modules

**All Feature Modules Must:**

- Check permissions before rendering UI elements
- Protect routes that require specific permissions
- Check permissions before API calls
- Show permission-denied states appropriately
- Use permission utilities consistently

**Module-Specific Integrations:**

**Settings Module:**

- Entire module requires `users.view_all` permission
- Sub-tabs may require additional permissions
- Workflow configuration requires admin permissions
- Show read-only view for users with view-only access

**Users & Roles Module:**

- View users: `users.view_all`
- Create users: `users.create`
- Edit users: `users.update`
- Assign roles: `users.assign_roles`
- Deactivate users: `users.deactivate`

**Providers Module:**

- View list: `providers.view_all`
- Create provider: `providers.create`
- Edit provider: `providers.update`
- Delete provider: `providers.delete`

**Enrollments Module:**

- View enrollments: `enrollments.view_all`
- Create enrollment: `enrollments.create`
- Update enrollment: `enrollments.update`
- Change stage: `enrollments.change_stage`
- Reassign: `enrollments.reassign`
- Bulk actions: `enrollments.bulk`

**Tasks Module:**

- View all tasks: `tasks.view_all`
- Create task: `tasks.create`
- Complete task: `tasks.complete`
- Reassign task: `tasks.reassign`

**Clients Module:**

- View list: `clients.view_all`
- View details: `clients.view_details`
- Create client: `clients.create`
- Edit client: `clients.update`
- Manage SLA: `clients.manage_sla`

### 8. Developer Experience

**TypeScript Types:**

- Type-safe resource names
- Type-safe permission names
- Autocomplete for permission checks
- Compile-time validation

**Type Definitions:**

```typescript
type ResourceName = "providers" | "enrollments" | "tasks" | "clients" | "users";

type PermissionName =
  | "view_all"
  | "create"
  | "update"
  | "delete"
  | "change_stage"
  | "reassign"
  | "bulk"
  | "complete"
  | "view_details"
  | "manage_sla"
  | "assign_roles"
  | "deactivate"
  | "reset_password";
```

**Constants:**

- Central constants file for all resources
- Central constants file for all permissions
- Prevents typos and ensures consistency

**Utility Hooks:**

- `usePermissions()` - Access permission context
- `useRequirePermission(resource, permission)` - Protect components
- `useHasPermission(resource, permission)` - Check permission
- `useCanAccess(resource)` - Check resource access

**Helper Functions:**

- `checkPermission(user, resource, permission)` - Standalone check
- `getPermissions(user, resource)` - Get all permissions for resource
- `hasRole(user, roleName)` - Check if user has specific role

### 9. Security Considerations

**Frontend vs Backend:**

- Frontend permission checks are for UX only
- Backend must validate all permissions on API calls
- Never trust frontend permission state
- Frontend optimizations reduce unnecessary API calls

**Logging & Monitoring:**

- Log permission check failures
- Track unauthorized access attempts
- Monitor for suspicious patterns
- Alert on repeated permission-denied events

**Session Security:**

- Permissions cleared on logout
- Permissions refreshed on role change
- Handle session expiration gracefully
- Validate permissions on critical actions

### 10. Testing Strategy

**Unit Tests:**

- Test permission utility functions
- Test permission context provider
- Test permission hooks
- Mock API responses

**Integration Tests:**

- Test route protection
- Test UI rendering based on permissions
- Test permission context integration
- Test error handling

**Component Tests:**

- Test components with different permission states
- Test permission guards
- Test conditional rendering
- Test disabled states

**E2E Tests:**

- Test full user flows with different roles
- Test permission-denied scenarios
- Test route redirects
- Test critical permission-protected workflows

**Test Coverage Requirements:**

- 100% coverage for permission utilities
- 90%+ coverage for permission context
- All critical routes tested with permission scenarios
- All role types tested (Super Admin, Manager, Analyst, etc.)

## Technical Considerations

### State Management

**Permission Storage:**

- React Context for permission state
- TanStack Query for API fetching
- Session storage for persistence (optional)
- Clear on logout

**Performance:**

- Memoize permission checks
- Cache permission results
- Optimize re-renders with React.memo
- Avoid unnecessary permission context reads

### Component Architecture

**Suggested File Structure:**

```
features/auth/
├── context/
│   ├── permission-context.tsx       # Permission context provider
│   └── auth-context.tsx             # Auth context (existing)
├── hooks/
│   ├── use-permissions.ts           # Permission hooks
│   ├── use-require-permission.ts    # Route protection hook
│   └── use-has-permission.ts        # Permission check hook
├── components/
│   ├── permission-guard.tsx         # Permission wrapper component
│   └── permission-denied.tsx        # 403 page
├── utils/
│   ├── permission-helpers.ts        # Permission utility functions
│   └── permission-constants.ts      # Resource/permission constants
└── types/
    └── permissions.ts               # TypeScript types
```

### Mock Data

**Development Mode:**

- Mock RBAC API response for development
- Multiple user role scenarios for testing
- Simulate different permission combinations
- Toggle mock users in dev environment

**Mock Data Location:**

- `lib/constants/mock-data/rbac-data.ts` (already exists)
- Add more role variations:
  - Super Admin (all permissions)
  - Manager (subset of permissions)
  - Team Lead (limited permissions)
  - Analyst (minimal permissions)
  - External Client User (client-scoped permissions)

### API Integration

**Error Handling:**

- Handle 401 Unauthorized (session expired)
- Handle 403 Forbidden (permission denied)
- Handle 500 Server Error (graceful degradation)
- Retry failed permission fetches

**Loading States:**

- Show loading indicator during permission fetch
- Prevent access during loading
- Skeleton UI for protected content
- Progressive enhancement

## UI/UX Considerations

### Visual Design

**Permission-Denied States:**

- Consistent styling across all denied states
- Lock icon for locked features
- Gray out disabled actions
- Clear visual hierarchy

**Feedback:**

- Toast notifications for permission errors
- Tooltips explaining missing permissions
- Help text for requesting access
- Clear CTAs for next steps

### User Experience

**Intuitive Access Control:**

- Hide rather than disable when possible
- Show disabled with explanation when needed
- Redirect to appropriate pages by role
- Minimize permission-denied encounters

**Progressive Disclosure:**

- Show basic info, hide advanced features
- Gradually reveal features as permissions increase
- Avoid overwhelming users with locked features

## Success Metrics

- Zero unauthorized access to protected features
- < 1% permission-denied error rate for authorized users
- 100% of navigation items permission-protected
- 100% of CRUD actions permission-protected
- < 100ms permission check performance
- Developer satisfaction with permission utilities

## Future Enhancements (Phase 2)

- Dynamic permission updates (without re-login)
- Temporary permission grants (time-limited access)
- Permission delegation (managers grant temporary access)
- Advanced audit logging UI
- Permission inheritance (role hierarchies)
- Data-level permissions (row-level security)
- Field-level permissions (hide specific form fields)
- Permission request workflow (users request access)

## Dependencies

- Backend API must provide RBAC endpoint
- Auth context must handle login/logout
- All feature modules must integrate permission checks
- TypeScript for type-safe permission checking

## Risks and Mitigation

**Risk:** Frontend permission checks bypassed via browser dev tools
**Mitigation:** Backend validates all permissions; frontend is UX optimization only

**Risk:** Performance degradation from excessive permission checks
**Mitigation:** Memoize checks, cache results, optimize context reads

**Risk:** Inconsistent permission enforcement across modules
**Mitigation:** Centralized utilities, code review checklist, E2E tests

**Risk:** Permissions not refreshed when role changes
**Mitigation:** Implement permission refresh mechanism, track role change events

**Risk:** Confusing UX with too many permission-denied messages
**Mitigation:** Hide rather than disable, clear feedback, minimize denied states

## Open Questions

(To be answered during requirements gathering)
