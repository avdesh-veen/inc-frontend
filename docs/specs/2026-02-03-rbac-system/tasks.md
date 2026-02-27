# RBAC System - Implementation Tasks

**Spec:** `docs/specs/2026-02-03-rbac-system/spec.md`  
**Total Estimated Duration:** 10-12 days  
**Implementation Approach:** Frontend-only with mock data

---

## Phase 1: Foundation (Days 1-3)

**Objective:** Set up type system, mock data, and permission context infrastructure

### Task 1.1: Create Type System

**Estimated Time:** 2 hours  
**Priority:** Critical  
**Dependencies:** None

**Description:**
Create comprehensive TypeScript type definitions for the RBAC system including resources, permissions, users, roles, and permission matrices.

**Files to Create:**

- `features/auth/types/permissions.ts`

**Implementation Details:**

- Define `ResourceName` type (providers, enrollments, tasks, clients, users)
- Define `PermissionName` type (view_all, create, update, delete, etc.)
- Define `User` interface with role and permissions
- Define `UserRole` interface
- Define `RolePermission` interface
- Define `Permission` interface
- Define `ResourcePermissionMatrix` type for type-safe permission mapping

**Acceptance Criteria:**

- [x] All resource types defined
- [x] All permission types defined
- [x] User and role interfaces complete
- [x] Type-safe permission matrix defined
- [x] No TypeScript errors
- [x] Proper JSDoc comments for all types

---

### Task 1.2: Create Permission Constants

**Estimated Time:** 1 hour  
**Priority:** Critical  
**Dependencies:** Task 1.1

**Description:**
Create centralized constants for all resources and permissions to prevent typos and ensure consistency across the application.

**Files to Create:**

- `features/auth/utils/permission-constants.ts`

**Implementation Details:**

- Create `RESOURCES` constant object with all resource names
- Create `PERMISSIONS` constant object with all permission names
- Create `RESOURCE_PERMISSIONS` mapping of resources to their valid permissions
- Create `RESOURCE_LABELS` for display names
- Create `PERMISSION_LABELS` for display names

**Acceptance Criteria:**

- [x] All resources defined as constants
- [x] All permissions defined as constants
- [x] Resource-to-permission mapping complete
- [x] Constants use `as const` for type safety
- [x] Proper JSDoc comments

---

### Task 1.3: Create Permission Helper Functions

**Estimated Time:** 2 hours  
**Priority:** Critical  
**Dependencies:** Task 1.1, Task 1.2

**Description:**
Create standalone utility functions for permission checking that can be used throughout the application.

**Files to Create:**

- `features/auth/utils/permission-helpers.ts`

**Implementation Details:**

- `checkPermission(user, resource, permission)` - Check single permission
- `getPermissions(user, resource)` - Get all permissions for resource
- `hasRole(user, roleName)` - Check if user has specific role
- `isInternalUser(user)` - Check if user is internal vs external
- `formatPermissions(permissions)` - Format permissions for display
- `hasAnyPermission(user, resource, permissions[])` - Check any permission
- `hasAllPermissions(user, resource, permissions[])` - Check all permissions
- `canAccessResource(user, resource)` - Check if user can access resource

**Acceptance Criteria:**

- [x] All helper functions implemented
- [x] Functions handle null/undefined users gracefully
- [x] Functions are pure (no side effects)
- [x] Proper TypeScript types for all parameters
- [x] JSDoc comments with examples
- [x] Edge cases handled (empty permissions, invalid resources)

---

### Task 1.4: Create Mock RBAC Data

**Estimated Time:** 3 hours  
**Priority:** Critical  
**Dependencies:** Task 1.1

**Description:**
Create comprehensive mock data for 5 user roles with varying permission levels for development and testing.

**Files to Create:**

- `lib/constants/mock-data/rbac-data.ts`

**Implementation Details:**

- Create `MOCK_SUPER_ADMIN` with all permissions on all resources
- Create `MOCK_MANAGER` with most permissions except user management
- Create `MOCK_TEAM_LEAD` with limited operational permissions
- Create `MOCK_ANALYST` with minimal permissions for assigned tasks
- Create `MOCK_EXTERNAL_CLIENT` with client-scoped permissions only
- Create `getMockUserByRole()` helper function
- Create `DEFAULT_MOCK_USER` constant (Super Admin for development)

**Mock User Details:**

**Super Admin:**

- All permissions on providers, enrollments, tasks, clients, users
- Full CRUD on all resources
- Admin-level permissions (assign_roles, deactivate, etc.)

**Manager:**

- Providers: view, create, update (no delete)
- Enrollments: view, create, update, change_stage, reassign
- Tasks: view, create, reassign
- Clients: view, view_details, update
- Users: none

**Team Lead:**

- Providers: view, create
- Enrollments: view, update, reassign
- Tasks: view, create
- Clients: view, view_details

**Analyst:**

- Providers: view
- Enrollments: view, update
- Tasks: view
- Clients: view

**External Client:**

- Providers: view (organization scoped)
- Enrollments: view (organization scoped)

**Acceptance Criteria:**

- [x] 5 complete mock user objects created
- [x] Each user has realistic permission sets
- [x] Helper function to get user by role type
- [x] Default mock user defined
- [x] All permission objects properly structured
- [x] Matches API response structure from spec

---

### Task 1.5: Implement Permission Context

**Estimated Time:** 3 hours  
**Priority:** Critical  
**Dependencies:** Task 1.1, Task 1.3, Task 1.4

**Description:**
Create React Context provider that loads mock user data and provides permission state and utilities globally.

**Files to Create:**

- `features/auth/context/permission-context.tsx`

**Implementation Details:**

- Create `PermissionContext` with React.createContext
- Create `PermissionProvider` component
- Load `DEFAULT_MOCK_USER` on mount with simulated delay
- Implement `hasPermission(resource, permission)` utility
- Implement `hasAnyPermission(resource, permissions[])` utility
- Implement `hasAllPermissions(resource, permissions[])` utility
- Implement `canAccess(resource)` utility
- Implement `getResourcePermissions(resource)` utility
- Provide `user`, `permissions`, `loading` state
- Memoize all utility functions with useCallback
- Memoize context value with useMemo
- Export `usePermissionContext()` hook

**Acceptance Criteria:**

- [x] Context provider loads mock user data
- [x] Loading state handled properly
- [x] All utility functions implemented
- [x] Functions properly memoized
- [x] Context value properly memoized
- [x] Hook throws error if used outside provider
- [x] Proper TypeScript types for context value

---

### Task 1.6: Integrate PermissionProvider into App

**Estimated Time:** 30 minutes  
**Priority:** Critical  
**Dependencies:** Task 1.5

**Description:**
Integrate the PermissionProvider at the root of the application so permission context is available to all components.

**Files to Modify:**

- `app/providers.tsx`

**Implementation Details:**

- Import `PermissionProvider` from context
- Wrap children with `PermissionProvider` inside `QueryClientProvider`
- Ensure proper nesting order (QueryClient → Permission → children)

**Acceptance Criteria:**

- [x] PermissionProvider integrated at root level
- [x] Proper provider nesting
- [x] No TypeScript errors
- [x] App still renders correctly
- [x] Permission context accessible in all client components

---

### Task 1.7: Create usePermissions Hook

**Estimated Time:** 30 minutes  
**Priority:** Critical  
**Dependencies:** Task 1.5

**Description:**
Create a simple hook to access the permission context with better naming.

**Files to Create:**

- `features/auth/hooks/use-permissions.ts`

**Implementation Details:**

- Import `usePermissionContext` from context
- Export `usePermissions` hook that returns context
- Add JSDoc with usage examples

**Acceptance Criteria:**

- [x] Hook exports permission context
- [x] Proper TypeScript types
- [x] JSDoc with examples
- [x] Hook can be imported and used

---

### Task 1.8: Create useHasPermission Hook

**Estimated Time:** 1 hour  
**Priority:** Critical  
**Dependencies:** Task 1.7

**Description:**
Create a memoized hook to check if user has a specific permission on a resource.

**Files to Create:**

- `features/auth/hooks/use-has-permission.ts`

**Implementation Details:**

- Import `usePermissions` hook
- Accept `resource` and `permission` parameters
- Use `useMemo` to memoize permission check
- Return boolean result
- Add JSDoc with usage examples

**Acceptance Criteria:**

- [x] Hook properly memoized
- [x] Returns boolean
- [x] Proper TypeScript types with ResourceName and PermissionName
- [x] JSDoc with examples
- [x] Re-memoizes when resource or permission changes

---

### Task 1.9: Create useCanAccess Hook

**Estimated Time:** 1 hour  
**Priority:** Critical  
**Dependencies:** Task 1.7

**Description:**
Create a memoized hook to check if user can access a resource (has any permission for it).

**Files to Create:**

- `features/auth/hooks/use-can-access.ts`

**Implementation Details:**

- Import `usePermissions` hook
- Accept `resource` parameter
- Use `useMemo` to memoize access check
- Return boolean result
- Add JSDoc with usage examples

**Acceptance Criteria:**

- [x] Hook properly memoized
- [x] Returns boolean
- [x] Proper TypeScript types with ResourceName
- [x] JSDoc with examples
- [x] Re-memoizes when resource changes

---

### Task 1.10: Create useRequirePermission Hook

**Estimated Time:** 2 hours  
**Priority:** Critical  
**Dependencies:** Task 1.7

**Description:**
Create a hook for protecting routes/components that redirects unauthorized users and shows toast notification.

**Files to Create:**

- `features/auth/hooks/use-require-permission.ts`

**Implementation Details:**

- Import `usePermissions`, `useRouter` from next/navigation, `toast` from sonner
- Accept `resource`, `permission`, and optional `redirectTo` parameters
- Use `useEffect` to check permission after loading
- Redirect to `redirectTo` (default '/') if no permission
- Show toast error message when redirecting
- Handle loading state properly (don't redirect while loading)

**Acceptance Criteria:**

- [x] Hook redirects unauthorized users
- [x] Toast notification shown on redirect
- [x] Loading state handled properly
- [x] No redirect during loading
- [x] Proper TypeScript types
- [x] JSDoc with usage examples
- [x] Optional redirectTo parameter works

---

### Phase 1 Deliverables Checklist:

- [x] Type system complete and type-safe
- [x] Permission constants centralized
- [x] Helper functions implemented and tested
- [x] Mock data with 5 user roles created
- [x] Permission context provider working
- [x] PermissionProvider integrated at app root
- [x] All 4 core hooks implemented
- [x] No TypeScript errors
- [x] Can switch mock users by changing DEFAULT_MOCK_USER

---

## Phase 2: UI Components (Days 4-5)

**Objective:** Build reusable permission-aware UI components

### Task 2.1: Create PermissionGuard Component

**Estimated Time:** 2 hours  
**Priority:** High  
**Dependencies:** Phase 1 complete

**Description:**
Create a wrapper component that conditionally renders children based on permissions.

**Files to Create:**

- `features/auth/components/permission-guard.tsx`

**Implementation Details:**

- Accept `resource`, `permission`, `children`, `fallback`, `showDenied` props
- Use `useHasPermission` hook to check permission
- Render children if permission granted
- Render fallback or PermissionDeniedPlaceholder if denied
- Support optional `showDenied` prop to show denied state
- Proper TypeScript types for all props

**Acceptance Criteria:**

- [x] Component renders children when permission granted
- [x] Component renders fallback when permission denied
- [x] Component shows denied placeholder when showDenied=true
- [x] Proper TypeScript types
- [x] JSDoc with usage examples
- [x] Works with all mock users

---

### Task 2.2: Create PermissionDeniedPlaceholder Component

**Estimated Time:** 1.5 hours  
**Priority:** High  
**Dependencies:** None

**Description:**
Create an inline placeholder component shown when content is permission-restricted.

**Files to Create:**

- `features/auth/components/permission-denied-placeholder.tsx`

**Implementation Details:**

- Use shadcn/ui Alert component
- Show Lock icon from lucide-react
- Accept optional `title` and `message` props
- Default title: "Access Restricted"
- Default message: "You don't have permission to view this content."
- Use muted styling (border-muted, text-muted-foreground)
- Support dark mode

**Acceptance Criteria:**

- [x] Component renders Alert with Lock icon
- [x] Custom title and message props work
- [x] Default values shown when props not provided
- [x] Proper styling with theme colors
- [x] Dark mode support
- [x] Accessible (proper ARIA labels)

---

### Task 2.3: Create PermissionDeniedPage Component

**Estimated Time:** 2 hours  
**Priority:** High  
**Dependencies:** None

**Description:**
Create a full 403 Forbidden page for permission-denied route access.

**Files to Create:**

- `features/auth/components/permission-denied-page.tsx`

**Implementation Details:**

- Center content vertically and horizontally
- Show large Lock icon in circular muted background
- Show "403 - Access Denied" heading
- Show descriptive message
- Show help text about contacting manager/admin
- Include "Go to Home" button (navigates to '/')
- Include "Go Back" button (uses router.back())
- Use shadcn/ui Button component
- Support dark mode
- Responsive design

**Acceptance Criteria:**

- [x] Page properly centered
- [x] Lock icon displayed prominently
- [x] Clear heading and message
- [x] Both buttons work correctly
- [x] Proper styling with theme colors
- [x] Dark mode support
- [x] Responsive on mobile and desktop
- [x] Accessible (keyboard navigation, ARIA labels)

---

### Task 2.4: Test Components with Mock Users

**Estimated Time:** 2 hours  
**Priority:** Medium  
**Dependencies:** Task 2.1, Task 2.2, Task 2.3

**Description:**
Manually test all permission components with different mock users to ensure they work correctly.

**Testing Scenarios:**

1. Test PermissionGuard with Super Admin (should show children)
2. Test PermissionGuard with Analyst (should show fallback/denied)
3. Test PermissionDeniedPlaceholder rendering
4. Test PermissionDeniedPage navigation buttons
5. Test dark mode for all components
6. Test responsive design on mobile

**Acceptance Criteria:**

- [x] PermissionGuard works with all mock users
- [x] PermissionDeniedPlaceholder displays correctly
- [x] PermissionDeniedPage buttons navigate correctly
- [x] All components support dark mode
- [x] All components are responsive
- [x] No console errors or warnings

---

### Task 2.5: Verify Toast Notifications

**Estimated Time:** 1 hour  
**Priority:** Medium  
**Dependencies:** Task 1.10

**Description:**
Verify that toast notifications from useRequirePermission hook work correctly.

**Testing Scenarios:**

1. Create test page with useRequirePermission
2. Access page as unauthorized user
3. Verify toast appears with correct message
4. Verify redirect happens after toast
5. Test with different permission requirements

**Acceptance Criteria:**

- [x] Toast appears when permission denied
- [x] Toast message is clear and user-friendly
- [x] Redirect happens after toast shown
- [x] Toast styling matches app theme
- [x] No duplicate toasts shown

---

### Phase 2 Deliverables Checklist:

- [x] PermissionGuard component working
- [x] PermissionDeniedPlaceholder component working
- [x] PermissionDeniedPage component working
- [x] All components tested with mock users
- [x] Dark mode support verified
- [x] Responsive design verified
- [x] Toast notifications working
- [x] No console errors

---

## Phase 3: Navigation Integration (Days 6-7)

**Objective:** Filter navigation menu items based on user permissions

### Task 3.1: Update Navigation Constants with Permissions

**Estimated Time:** 2 hours  
**Priority:** Critical  
**Dependencies:** Phase 1 complete

**Description:**
Add permission metadata to navigation items so they can be filtered based on user permissions.

**Files to Modify:**

- `lib/constants/navigation.ts`

**Implementation Details:**

- Import `ResourceName` and `PermissionName` types
- Update `NavigationItem` interface to include optional `resource` and `permission` fields
- Add optional `section` field for grouping (e.g., "Administration")
- Add permission metadata to each navigation item:
  - Dashboard: No permission required
  - Clients: `clients.view_all`
  - Providers: `providers.view_all`
  - Payers: `clients.view_all` (using clients as proxy)
  - Business Entities: `clients.view_all` (using clients as proxy)
  - Users & Roles: `users.view_all`, section: "Administration"
  - Settings: `users.view_all`, section: "Administration"

**Acceptance Criteria:**

- [x] NavigationItem interface updated with permission fields
- [x] All navigation items have permission metadata
- [x] Administration items grouped with section field
- [x] Dashboard has no permission requirement
- [x] Proper TypeScript types
- [x] No breaking changes to existing navigation

---

### Task 3.2: Update Main Sidebar with Permission Filtering

**Estimated Time:** 3 hours  
**Priority:** Critical  
**Dependencies:** Task 3.1

**Description:**
Update the main application sidebar to filter navigation items based on user permissions.

**Files to Modify:**

- `components/layout/sidebar.tsx` (or equivalent main sidebar component)

**Implementation Details:**

- Import `usePermissions` hook
- Filter `NAVIGATION_ITEMS` based on permissions:
  - If item has no resource/permission, always show
  - If item has resource/permission, check with `hasPermission()`
- Group filtered items by section (main vs Administration)
- Render main navigation items
- Conditionally render Administration section if user has access
- Maintain existing sidebar styling and behavior

**Acceptance Criteria:**

- [x] Sidebar filters items based on permissions
- [x] Items without permissions always visible
- [x] Items with permissions only visible if user has permission
- [x] Administration section only visible if user has admin permissions
- [x] Sidebar maintains existing styling
- [x] No layout shifts or visual bugs
- [x] Works with all mock users

---

### Task 3.3: Update Settings Sidebar Protection

**Estimated Time:** 2 hours  
**Priority:** High  
**Dependencies:** Task 3.1

**Description:**
Update the settings sidebar to filter workflow settings items based on permissions.

**Files to Modify:**

- `features/settings/components/settings-sidebar.tsx`

**Implementation Details:**

- Import `usePermissions` hook
- Add permission checks for settings navigation items
- Filter items based on `users.view_all` permission
- Maintain existing settings sidebar styling
- Handle case where user has no settings access

**Acceptance Criteria:**

- [x] Settings sidebar filters items by permission
- [x] Only users with `users.view_all` see settings items
- [x] Sidebar maintains existing styling
- [x] No layout issues
- [x] Works with all mock users

---

### Task 3.4: Test Navigation with All Mock Users

**Estimated Time:** 2 hours  
**Priority:** High  
**Dependencies:** Task 3.2, Task 3.3

**Description:**
Systematically test navigation filtering with all 5 mock user roles.

**Testing Scenarios:**

**Super Admin:**

- [x] Sees all navigation items
- [x] Sees Administration section
- [x] Sees Users & Roles
- [x] Sees Settings
- [x] Sees all operational items (Clients, Providers, etc.)

**Manager:**

- [x] Sees operational items
- [x] Does NOT see Administration section
- [x] Does NOT see Users & Roles
- [x] Does NOT see Settings

**Team Lead:**

- [x] Sees limited operational items
- [x] Does NOT see Administration section

**Analyst:**

- [x] Sees minimal operational items
- [x] Does NOT see Administration section

**External Client:**

- [x] Sees only client-scoped items
- [x] Does NOT see Administration section

**Acceptance Criteria:**

- [x] All mock users see correct navigation items
- [x] No console errors for any user
- [x] Navigation updates immediately when switching users
- [x] No visual glitches or layout issues

---

### Phase 3 Deliverables Checklist:

- [x] Navigation constants updated with permissions
- [x] Main sidebar filters by permissions
- [x] Settings sidebar filters by permissions
- [x] All mock users tested
- [x] Administration section hidden for non-admins
- [x] No console errors
- [x] Navigation updates correctly

---

## Phase 4: Route Protection (Days 8-9)

**Objective:** Protect all critical routes with permission checks

### Task 4.1: Protect Settings Layout

**Estimated Time:** 1 hour  
**Priority:** Critical  
**Dependencies:** Phase 1 complete

**Description:**
Add layout-level protection to the entire Settings module requiring `users.view_all` permission.

**Files to Modify:**

- `app/(core)/settings/layout.tsx`

**Implementation Details:**

- Add 'use client' directive
- Import `useRequirePermission` hook
- Add `useRequirePermission('users', 'view_all')` at top of component
- Ensure layout still renders children correctly
- Test redirect behavior for unauthorized users

**Acceptance Criteria:**

- [x] Layout requires `users.view_all` permission
- [x] Unauthorized users redirected to home
- [x] Toast notification shown on redirect
- [x] Authorized users can access normally
- [x] No infinite redirect loops
- [x] Works with all mock users

---

### Task 4.2: Protect Users & Roles Page

**Estimated Time:** 1 hour  
**Priority:** Critical  
**Dependencies:** Phase 1 complete

**Description:**
Add page-level protection to Users & Roles page requiring `users.view_all` permission.

**Files to Modify:**

- `app/(core)/administration/users-roles/page.tsx`

**Implementation Details:**

- Add 'use client' directive if not present
- Import `useRequirePermission` hook
- Add `useRequirePermission('users', 'view_all')` at top of component
- Test redirect behavior for unauthorized users

**Acceptance Criteria:**

- [x] Page requires `users.view_all` permission
- [x] Unauthorized users redirected to home
- [x] Toast notification shown on redirect
- [x] Authorized users can access normally
- [x] Works with all mock users

---

### Task 4.3: Protect Providers Module Pages

**Estimated Time:** 2 hours  
**Priority:** Critical  
**Dependencies:** Phase 1 complete

**Description:**
Add protection to all Providers module pages requiring `providers.view_all` permission.

**Files to Modify:**

- `app/(core)/records/providers/page.tsx` (list page)
- `app/(core)/records/providers/[id]/page.tsx` (detail page, if exists)
- `app/(core)/records/providers/new/page.tsx` (create page, if exists)

**Implementation Details:**

- Add 'use client' directive to each page
- Import `useRequirePermission` hook
- Add `useRequirePermission('providers', 'view_all')` to each page
- Test redirect behavior for unauthorized users

**Acceptance Criteria:**

- [x] All provider pages require `providers.view_all`
- [x] Unauthorized users redirected to home
- [x] Toast notifications shown
- [x] Authorized users can access normally
- [x] Works with all mock users

---

### Task 4.4: Protect Clients Module Pages

**Estimated Time:** 2 hours  
**Priority:** Critical  
**Dependencies:** Phase 1 complete

**Description:**
Add protection to all Clients module pages requiring `clients.view_all` permission.

**Files to Modify:**

- `app/(core)/records/clients/page.tsx` (list page)
- `app/(core)/records/clients/[id]/page.tsx` (detail page, if exists)
- `app/(core)/records/clients/new/page.tsx` (create page, if exists)

**Implementation Details:**

- Add 'use client' directive to each page
- Import `useRequirePermission` hook
- Add `useRequirePermission('clients', 'view_all')` to each page
- Test redirect behavior for unauthorized users

**Acceptance Criteria:**

- [x] All client pages require `clients.view_all`
- [x] Unauthorized users redirected to home
- [x] Toast notifications shown
- [x] Authorized users can access normally
- [x] Works with all mock users

---

### Task 4.5: Protect Other Module Pages

**Estimated Time:** 3 hours  
**Priority:** High  
**Dependencies:** Phase 1 complete

**Description:**
Add protection to Payers, Business Entities, and other module pages.

**Files to Modify:**

- `app/(core)/records/payers/page.tsx`
- `app/(core)/records/payers/[id]/page.tsx` (if exists)
- `app/(core)/records/business-entities/page.tsx`
- `app/(core)/records/business-entities/[id]/page.tsx` (if exists)

**Implementation Details:**

- Add 'use client' directive to each page
- Import `useRequirePermission` hook
- Add appropriate permission checks:
  - Payers: `clients.view_all` (using clients as proxy)
  - Business Entities: `clients.view_all` (using clients as proxy)
- Test redirect behavior for unauthorized users

**Acceptance Criteria:**

- [x] All pages have appropriate permission requirements
- [x] Unauthorized users redirected to home
- [x] Toast notifications shown
- [x] Authorized users can access normally
- [x] Works with all mock users

---

### Task 4.6: Test Route Protection with All Mock Users

**Estimated Time:** 2 hours  
**Priority:** Critical  
**Dependencies:** Task 4.1, 4.2, 4.3, 4.4, 4.5

**Description:**
Systematically test route protection with all 5 mock user roles.

**Testing Scenarios:**

**For Each Protected Route:**

1. Test as Super Admin (should access)
2. Test as Manager (should access or deny based on permission)
3. Test as Team Lead (should access or deny based on permission)
4. Test as Analyst (should access or deny based on permission)
5. Test as External Client (should deny)

**Routes to Test:**

- `/settings/*`
- `/administration/users-roles`
- `/records/providers`
- `/records/clients`
- `/records/payers`
- `/records/business-entities`

**Acceptance Criteria:**

- [x] All routes properly protected
- [x] Correct users can access each route
- [x] Unauthorized users redirected to home
- [x] Toast notifications appear for all denied access
- [x] No infinite redirect loops
- [x] No console errors

---

### Task 4.7: Verify No Infinite Redirect Loops

**Estimated Time:** 1 hour  
**Priority:** Critical  
**Dependencies:** Task 4.6

**Description:**
Verify that route protection doesn't cause infinite redirect loops, especially on the home page.

**Testing Scenarios:**

1. Ensure home page ('/') has no permission requirements
2. Test redirect from protected page to home
3. Test redirect with custom redirectTo parameter
4. Verify loading state prevents premature redirects

**Acceptance Criteria:**

- [x] No infinite redirect loops
- [x] Home page accessible to all users
- [x] Redirects work correctly
- [x] Loading state handled properly
- [x] No console errors or warnings

---

### Phase 4 Deliverables Checklist:

- [x] Settings layout protected
- [x] Users & Roles page protected
- [x] All Providers pages protected
- [x] All Clients pages protected
- [x] All other module pages protected
- [x] All routes tested with all mock users
- [x] Toast notifications working
- [x] No infinite redirect loops
- [x] No console errors

---

## Phase 5: Module Integration (Days 10-12)

**Objective:** Add action-level permission checks to all module actions

### Task 5.1: Verify Settings Module Protection

**Estimated Time:** 1 hour  
**Priority:** Medium  
**Dependencies:** Task 4.1

**Description:**
Verify that layout-level protection is sufficient for Settings module and no additional action-level checks are needed.

**Testing Scenarios:**

1. Access settings as Super Admin
2. Verify all settings tabs accessible
3. Verify all workflow settings accessible
4. Confirm layout protection is sufficient

**Acceptance Criteria:**

- [x] Settings module fully protected by layout
- [x] No additional action checks needed
- [x] All settings features work for authorized users

---

### Task 5.2: Integrate Permissions in Users & Roles Module

**Estimated Time:** 4 hours  
**Priority:** Critical  
**Dependencies:** Phase 2 complete

**Description:**
Add action-level permission checks to Users & Roles module for create, update, assign roles, and deactivate actions.

**Files to Modify:**

- `app/(core)/administration/users-roles/page.tsx`
- `features/users-roles/components/*` (any components with actions)

**Implementation Details:**

- Import `useHasPermission` hook
- Check `users.create` for "Create User" button
- Check `users.update` for edit actions
- Check `users.assign_roles` for role assignment UI
- Check `users.deactivate` for deactivate actions
- Hide buttons/actions when permission not granted
- Add tooltips for disabled actions explaining missing permission

**Acceptance Criteria:**

- [x] Create User button only visible with `users.create`
- [x] Edit actions only visible with `users.update`
- [x] Role assignment only visible with `users.assign_roles`
- [x] Deactivate actions only visible with `users.deactivate`
- [x] Tooltips explain missing permissions
- [x] Works with all mock users
- [x] No console errors

---

### Task 5.3: Integrate Permissions in Providers Module

**Estimated Time:** 4 hours  
**Priority:** Critical  
**Dependencies:** Phase 2 complete

**Description:**
Add action-level permission checks to Providers module for create, update, and delete actions.

**Files to Modify:**

- `app/(core)/records/providers/page.tsx`
- `features/providers/components/provider-list.tsx` (or equivalent)
- `features/providers/components/provider-actions.tsx` (or equivalent)

**Implementation Details:**

- Import `useHasPermission` hook
- Check `providers.create` for "Create Provider" button
- Check `providers.update` for edit actions
- Check `providers.delete` for delete actions
- Hide/disable buttons based on permissions
- Add tooltips for disabled actions
- Consider using PermissionGuard for action buttons

**Acceptance Criteria:**

- [x] Create Provider button only visible with `providers.create`
- [x] Edit actions only visible with `providers.update`
- [x] Delete actions only visible with `providers.delete`
- [x] Tooltips explain missing permissions
- [x] Works with all mock users
- [x] No console errors

---

### Task 5.4: Integrate Permissions in Clients Module

**Estimated Time:** 4 hours  
**Priority:** Critical  
**Dependencies:** Phase 2 complete

**Description:**
Add action-level permission checks to Clients module for create, update, and SLA management actions.

**Files to Modify:**

- `app/(core)/records/clients/page.tsx`
- `features/clients/components/client-list.tsx` (or equivalent)
- `features/clients/components/client-actions.tsx` (or equivalent)
- `features/clients/components/client-sla-form.tsx` (or equivalent)

**Implementation Details:**

- Import `useHasPermission` hook
- Check `clients.create` for "Create Client" button
- Check `clients.update` for edit actions
- Check `clients.manage_sla` for SLA management UI
- Hide/disable buttons based on permissions
- Add tooltips for disabled actions
- Protect SLA form with PermissionGuard if needed

**Acceptance Criteria:**

- [x] Create Client button only visible with `clients.create`
- [x] Edit actions only visible with `clients.update`
- [x] SLA management only visible with `clients.manage_sla`
- [x] Tooltips explain missing permissions
- [x] Works with all mock users
- [x] No console errors

---

### Task 5.5: Integrate Permissions in Payers Module

**Estimated Time:** 3 hours  
**Priority:** High  
**Dependencies:** Phase 2 complete

**Description:**
Add action-level permission checks to Payers module for CRUD operations.

**Files to Modify:**

- `app/(core)/records/payers/page.tsx`
- `features/payers/components/*` (any components with actions)

**Implementation Details:**

- Import `useHasPermission` hook
- Check `clients.create` for "Create Payer" button (using clients as proxy)
- Check `clients.update` for edit actions
- Hide/disable buttons based on permissions
- Add tooltips for disabled actions

**Acceptance Criteria:**

- [x] Create Payer button only visible with permission
- [x] Edit actions only visible with permission
- [x] Tooltips explain missing permissions
- [x] Works with all mock users
- [x] No console errors

---

### Task 5.6: Integrate Permissions in Business Entities Module

**Estimated Time:** 3 hours  
**Priority:** High  
**Dependencies:** Phase 2 complete

**Description:**
Add action-level permission checks to Business Entities module for CRUD operations.

**Files to Modify:**

- `app/(core)/records/business-entities/page.tsx`
- `features/business-entities/components/*` (any components with actions)

**Implementation Details:**

- Import `useHasPermission` hook
- Check `clients.create` for "Create Business Entity" button (using clients as proxy)
- Check `clients.update` for edit actions
- Hide/disable buttons based on permissions
- Add tooltips for disabled actions

**Acceptance Criteria:**

- [x] Create Business Entity button only visible with permission
- [x] Edit actions only visible with permission
- [x] Tooltips explain missing permissions
- [x] Works with all mock users
- [x] No console errors

---

### Task 5.7: Test All Modules with All Mock Users

**Estimated Time:** 3 hours  
**Priority:** Critical  
**Dependencies:** Task 5.2, 5.3, 5.4, 5.5, 5.6

**Description:**
Systematically test all module integrations with all 5 mock user roles.

**Testing Matrix:**

| Module            | Super Admin | Manager       | Team Lead   | Analyst   | External  |
| ----------------- | ----------- | ------------- | ----------- | --------- | --------- |
| Settings          | Full Access | No Access     | No Access   | No Access | No Access |
| Users & Roles     | Full CRUD   | No Access     | No Access   | No Access | No Access |
| Providers         | Full CRUD   | Create/Update | Create Only | View Only | View Only |
| Clients           | Full CRUD   | View/Update   | View Only   | View Only | View Only |
| Payers            | Full CRUD   | View/Update   | View Only   | View Only | No Access |
| Business Entities | Full CRUD   | View/Update   | View Only   | View Only | No Access |

**Testing Scenarios:**

1. Switch to each mock user
2. Navigate to each module
3. Verify correct buttons visible/hidden
4. Verify correct actions enabled/disabled
5. Verify tooltips show for disabled actions
6. Test actual action execution (if possible)

**Acceptance Criteria:**

- [x] All modules respect permissions correctly
- [x] Buttons hidden/disabled appropriately for each user
- [x] Tooltips explain missing permissions
- [x] No console errors for any user
- [x] UI updates immediately when switching users

---

### Task 5.8: Add Permission Tooltips

**Estimated Time:** 2 hours  
**Priority:** Medium  
**Dependencies:** Task 5.7

**Description:**
Ensure all disabled actions have tooltips explaining why the action is unavailable.

**Files to Modify:**

- Any component files with disabled actions

**Implementation Details:**

- Use shadcn/ui Tooltip component
- Wrap disabled buttons with Tooltip
- Show tooltip only when action is disabled
- Use clear, user-friendly messages
- Examples:
  - "You don't have permission to create providers"
  - "You don't have permission to edit clients"
  - "You don't have permission to manage SLA settings"

**Acceptance Criteria:**

- [x] All disabled actions have tooltips
- [x] Tooltip messages are clear and user-friendly
- [x] Tooltips only show when action is disabled
- [x] Tooltips work on hover and focus (accessibility)
- [x] Tooltips match app theme

---

### Phase 5 Deliverables Checklist:

- [x] Settings module verified protected
- [x] Users & Roles module integrated
- [x] Providers module integrated
- [x] Clients module integrated
- [x] Payers module integrated
- [x] Business Entities module integrated
- [x] All modules tested with all mock users
- [x] Permission tooltips added
- [x] No console errors
- [x] All actions respect permissions

---

## Final Verification & Testing

### Task 6.1: End-to-End Testing with All Mock Users

**Estimated Time:** 3 hours  
**Priority:** Critical  
**Dependencies:** All phases complete

**Description:**
Perform comprehensive end-to-end testing with all 5 mock users.

**Testing Checklist:**

**Super Admin:**

- [x] Can access all navigation items
- [x] Can access all routes
- [x] Can perform all actions
- [x] Sees no permission-denied states

**Manager:**

- [x] Cannot access Settings or Users & Roles
- [x] Can access operational modules
- [x] Can create/update providers and clients
- [x] Cannot delete providers

**Team Lead:**

- [x] Cannot access Settings or Users & Roles
- [x] Can access limited operational modules
- [x] Can create providers
- [x] Cannot delete or manage advanced features

**Analyst:**

- [x] Cannot access Settings or Users & Roles
- [x] Can access minimal operational modules
- [x] Can only view most resources
- [x] Can update enrollments

**External Client:**

- [x] Cannot access Settings or Users & Roles
- [x] Can only view client-scoped resources
- [x] Cannot perform any create/update/delete actions

**Acceptance Criteria:**

- [x] All user scenarios work correctly
- [x] No console errors for any user
- [x] All permission checks work as expected
- [x] Toast notifications appear appropriately
- [x] Navigation updates correctly
- [x] Routes redirect correctly

---

### Task 6.2: Verify Dark Mode Support

**Estimated Time:** 1 hour  
**Priority:** Medium  
**Dependencies:** All phases complete

**Description:**
Verify all RBAC components support dark mode properly.

**Components to Test:**

- [x] PermissionGuard (no visual component)
- [x] PermissionDeniedPlaceholder
- [x] PermissionDeniedPage
- [x] Toast notifications
- [x] Tooltips

**Acceptance Criteria:**

- [x] All components render correctly in dark mode
- [x] Colors are appropriate for dark theme
- [x] No contrast issues
- [x] Icons visible in dark mode

---

### Task 6.3: Verify Accessibility

**Estimated Time:** 2 hours  
**Priority:** High  
**Dependencies:** All phases complete

**Description:**
Verify all RBAC components are accessible.

**Accessibility Checklist:**

- [x] Keyboard navigation works for all interactive elements
- [x] Focus indicators visible
- [x] ARIA labels present where needed
- [x] Screen reader friendly
- [x] Tooltips accessible (hover and focus)
- [x] Buttons have proper labels
- [x] Error messages announced to screen readers

**Acceptance Criteria:**

- [x] All components keyboard accessible
- [x] Focus management works correctly
- [x] ARIA labels appropriate
- [x] Screen reader testing passed
- [x] No accessibility warnings in dev tools

---

### Task 6.4: Performance Verification

**Estimated Time:** 1 hour  
**Priority:** Medium  
**Dependencies:** All phases complete

**Description:**
Verify permission checks don't cause performance issues.

**Performance Checks:**

- [x] Permission context doesn't cause unnecessary re-renders
- [x] Memoization working correctly
- [x] Navigation filtering is fast
- [x] No lag when switching between pages
- [x] No lag when checking multiple permissions

**Acceptance Criteria:**

- [x] No performance degradation
- [x] Permission checks < 1ms
- [x] No unnecessary re-renders
- [x] Smooth navigation transitions

---

### Task 6.5: Documentation Review

**Estimated Time:** 2 hours  
**Priority:** Medium  
**Dependencies:** All phases complete

**Description:**
Review and verify all code has proper documentation.

**Documentation Checklist:**

- [x] All types have JSDoc comments
- [x] All hooks have JSDoc with examples
- [x] All components have JSDoc with examples
- [x] All utility functions have JSDoc
- [x] Complex logic has inline comments
- [x] README updated (if needed)

**Acceptance Criteria:**

- [x] All public APIs documented
- [x] Examples provided for common use cases
- [x] Complex logic explained
- [x] No undocumented exports

---

### Task 6.6: Create Developer Quick Reference

**Estimated Time:** 2 hours  
**Priority:** Low  
**Dependencies:** All phases complete

**Description:**
Create a quick reference guide for developers on how to use the RBAC system.

**Quick Reference Should Include:**

- How to protect a page
- How to conditionally render a button
- How to disable a button with tooltip
- How to use PermissionGuard
- How to switch mock users for testing
- Common patterns and examples

**File to Create:**

- `docs/specs/2026-02-03-rbac-system/DEVELOPER_GUIDE.md`

**Acceptance Criteria:**

- [x] Quick reference created
- [x] All common patterns documented
- [x] Code examples provided
- [x] Easy to understand for new developers

---

## Success Criteria (All Phases)

### Functional Requirements:

- [x] All type definitions created and type-safe
- [x] Mock data with 5 user roles working
- [x] Permission context providing utilities globally
- [x] All 4 core hooks implemented and working
- [x] All 3 UI components working
- [x] Navigation filters by permissions
- [x] All critical routes protected
- [x] All modules check permissions for actions
- [x] Can switch mock users and see different UI
- [x] Permission-denied states display correctly

### Quality Requirements:

- [x] No TypeScript errors
- [x] No console errors or warnings
- [x] Dark mode support for all components
- [x] Accessible (keyboard navigation, ARIA labels)
- [x] Responsive design on mobile and desktop
- [x] Performance is acceptable (no lag)
- [x] All code properly documented

### Testing Requirements:

- [x] All mock users tested in all modules
- [x] All routes tested with all mock users
- [x] All actions tested with all mock users
- [x] Toast notifications working correctly
- [x] Tooltips working correctly
- [x] No infinite redirect loops

---

## Notes

### Switching Mock Users for Testing:

To test different permission scenarios, edit `lib/constants/mock-data/rbac-data.ts`:

```typescript
// Change this line to switch users:
export const DEFAULT_MOCK_USER = MOCK_ANALYST; // or MOCK_MANAGER, MOCK_TEAM_LEAD, etc.
```

Then refresh the application to see the UI as that user.

### Common Patterns:

**Protect a Page:**

```typescript
useRequirePermission("providers", "view_all");
```

**Conditionally Render Button:**

```typescript
{canCreate && <Button>Create</Button>}
```

**Disable Button with Tooltip:**

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button disabled={!canEdit}>Edit</Button>
  </TooltipTrigger>
  {!canEdit && (
    <TooltipContent>You don't have permission to edit</TooltipContent>
  )}
</Tooltip>
```

**Use Permission Guard:**

```tsx
<PermissionGuard resource="providers" permission="update">
  <EditForm />
</PermissionGuard>
```

---

**Total Tasks:** 45  
**Estimated Total Time:** 10-12 days  
**Status:** Ready for Implementation
