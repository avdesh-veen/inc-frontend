# RBAC System - Technical Specification

**Version:** 2.0  
**Date:** February 3, 2026  
**Status:** Ready for Implementation  
**Scope:** Frontend-only with Mock Data

---

## Table of Contents

1. [Overview](#overview)
2. [Scope & Approach](#scope--approach)
3. [Architecture](#architecture)
4. [Type System](#type-system)
5. [Mock Data Structure](#mock-data-structure)
6. [Permission Context](#permission-context)
7. [Hooks & Utilities](#hooks--utilities)
8. [UI Components](#ui-components)
9. [Navigation Integration](#navigation-integration)
10. [Route Protection](#route-protection)
11. [Module Integration](#module-integration)
12. [UI/UX Specifications](#uiux-specifications)
13. [Implementation Plan](#implementation-plan)
14. [Developer Guidelines](#developer-guidelines)

---

## Overview

### Purpose

Implement a comprehensive Role-Based Access Control (RBAC) system that controls what users can see and do throughout the InCredibly platform based on their assigned roles and permissions.

### Goals

- **Security:** Prevent unauthorized access to features, routes, and actions
- **UX:** Show users only what they can access, reducing confusion
- **Developer Experience:** Provide type-safe, easy-to-use permission utilities
- **Performance:** Efficient permission checking with minimal overhead
- **Consistency:** Uniform permission enforcement across all modules

### Key Features

1. Permission-based UI rendering (hide/disable elements)
2. Route protection with automatic redirects
3. Permission context available throughout app
4. Type-safe permission utilities
5. Mock data for development and testing
6. Graceful permission-denied handling

### Visual Reference

The RBAC system changes the navigation sidebar based on user roles:

**Super Admin View:**

- Full navigation access including Administration section
- Users & Roles visible
- Settings visible
- All operational sections visible
- Role badge: "Super Admin"

**Case Analyst View:**

- Limited navigation (operational focus only)
- No Administration section
- Clients, Providers, Payers, Business Entities visible
- Knowledge Base section visible
- Role badge: "Case Analyst"

See: `planning/visuals/admin-role-rbac.png` and `analyst-role-rbac.png`

---

## Scope & Approach

### Implementation Scope

This specification covers **frontend-only implementation** using **mock data**. No backend API integration is required at this stage.

**In Scope:**

- ✅ Type system and constants
- ✅ Permission helper functions
- ✅ Mock RBAC data (5 user roles)
- ✅ Permission context provider
- ✅ Core permission hooks
- ✅ UI components (guards, 403 pages, placeholders)
- ✅ Navigation integration
- ✅ Route protection
- ✅ Module integration (action-level permissions)

**Out of Scope (Deferred):**

- ❌ Real API integration
- ❌ Comprehensive testing suite
- ❌ Full documentation
- ❌ Production deployment

### Mock Data Approach

Instead of integrating with a backend API, the system will use predefined mock data representing different user roles and their permissions. This allows for:

1. **Rapid Development:** No waiting for backend API
2. **Easy Testing:** Switch between user roles instantly
3. **Predictable Behavior:** Consistent test scenarios
4. **Future Migration:** Easy to swap mock data for real API later

### Implementation Timeline

**Estimated Duration:** 10-12 days

- **Phase 1:** Foundation (Days 1-3)
- **Phase 2:** UI Components (Days 4-5)
- **Phase 3:** Navigation Integration (Days 6-7)
- **Phase 4:** Route Protection (Days 8-9)
- **Phase 5:** Module Integration (Days 10-12)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Root                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           PermissionProvider (Context)                 │  │
│  │  - Loads mock user data                               │  │
│  │  - Provides permission state & utilities globally     │  │
│  │  - Handles loading states                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│          ┌────────────────┼────────────────┐                │
│          ▼                ▼                ▼                │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│    │  Routes  │    │   UI     │    │  Actions │           │
│    │ Protected│    │ Elements │    │ Protected│           │
│    └──────────┘    └──────────┘    └──────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Component Flow

```
App Load → Load Mock User → Store in Context →
  → Protect Routes → Render UI → Check Actions
```

### File Structure

```
features/auth/
├── types/
│   └── permissions.ts                    # TypeScript types
├── utils/
│   ├── permission-constants.ts           # Resource & permission constants
│   └── permission-helpers.ts             # Utility functions
├── context/
│   └── permission-context.tsx            # Permission provider & context
├── hooks/
│   ├── use-permissions.ts                # Access permission context
│   ├── use-has-permission.ts             # Single permission check
│   ├── use-can-access.ts                 # Resource access check
│   └── use-require-permission.ts         # Route/component protection
├── components/
│   ├── permission-guard.tsx              # Wrapper component for protection
│   ├── permission-denied-page.tsx        # 403 Forbidden page
│   └── permission-denied-placeholder.tsx # Inline denied state
└── api/
    └── auth-api.ts                       # Mock data loader

lib/constants/mock-data/
└── rbac-data.ts                          # Mock user data
```

---

## Type System

### Core Types

```typescript
// features/auth/types/permissions.ts

/**
 * Supported resource names in the RBAC system
 */
export type ResourceName =
  | "providers"
  | "enrollments"
  | "tasks"
  | "clients"
  | "users";

/**
 * Supported permission names in the RBAC system
 */
export type PermissionName =
  | "view_all" // View all records of a resource
  | "create" // Create new records
  | "update" // Edit existing records
  | "delete" // Remove records
  | "change_stage" // Change workflow stage (enrollments)
  | "reassign" // Reassign to different user
  | "bulk" // Perform bulk operations
  | "complete" // Mark as complete (tasks)
  | "view_details" // View detailed information
  | "manage_sla" // Manage SLA configurations
  | "assign_roles" // Assign roles to users
  | "deactivate" // Deactivate user accounts
  | "reset_password"; // Reset user passwords

/**
 * User permission data structure
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
}

/**
 * User role with permissions
 */
export interface UserRole {
  id: string;
  roleName: string;
  isInternal: boolean;
  rolePermissions: RolePermission[];
}

/**
 * Resource permission mapping
 */
export interface RolePermission {
  resourceId: string;
  resourceName: ResourceName;
  permissions: Permission[];
}

/**
 * Individual permission
 */
export interface Permission {
  id: string;
  name: PermissionName;
  code: string;
  description: string;
}

/**
 * Type-safe mapping of resources to their allowed permissions
 */
export type ResourcePermissionMatrix = {
  providers: "view_all" | "create" | "update" | "delete";
  enrollments:
    | "view_all"
    | "create"
    | "update"
    | "delete"
    | "change_stage"
    | "reassign"
    | "bulk";
  tasks: "view_all" | "create" | "complete" | "reassign";
  clients: "view_all" | "view_details" | "create" | "update" | "manage_sla";
  users:
    | "view_all"
    | "create"
    | "update"
    | "assign_roles"
    | "deactivate"
    | "reset_password";
};
```

### Permission Constants

```typescript
// features/auth/utils/permission-constants.ts

/**
 * All supported resources in the system
 */
export const RESOURCES: Record<string, ResourceName> = {
  PROVIDERS: "providers",
  ENROLLMENTS: "enrollments",
  TASKS: "tasks",
  CLIENTS: "clients",
  USERS: "users",
} as const;

/**
 * All supported permissions in the system
 */
export const PERMISSIONS: Record<string, PermissionName> = {
  VIEW_ALL: "view_all",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  CHANGE_STAGE: "change_stage",
  REASSIGN: "reassign",
  BULK: "bulk",
  COMPLETE: "complete",
  VIEW_DETAILS: "view_details",
  MANAGE_SLA: "manage_sla",
  ASSIGN_ROLES: "assign_roles",
  DEACTIVATE: "deactivate",
  RESET_PASSWORD: "reset_password",
} as const;

/**
 * Mapping of resources to their valid permissions
 */
export const RESOURCE_PERMISSIONS: Record<ResourceName, PermissionName[]> = {
  providers: ["view_all", "create", "update", "delete"],
  enrollments: [
    "view_all",
    "create",
    "update",
    "delete",
    "change_stage",
    "reassign",
    "bulk",
  ],
  tasks: ["view_all", "create", "complete", "reassign"],
  clients: ["view_all", "view_details", "create", "update", "manage_sla"],
  users: [
    "view_all",
    "create",
    "update",
    "assign_roles",
    "deactivate",
    "reset_password",
  ],
} as const;
```

---

## Mock Data Structure

### Mock User Roles

The system includes 5 predefined user roles with different permission levels:

#### 1. Super Admin

**Role:** Full system access  
**Permissions:** All permissions on all resources  
**Use Case:** System administrators, platform owners

#### 2. Manager

**Role:** Management-level access  
**Permissions:** Most permissions except user management  
**Use Case:** Department managers, team managers

#### 3. Team Lead

**Role:** Team-level access  
**Permissions:** Limited operational permissions  
**Use Case:** Team leads, senior analysts

#### 4. Case Analyst

**Role:** Operational access  
**Permissions:** Minimal permissions for assigned tasks  
**Use Case:** Case analysts, data entry staff

#### 5. External Client

**Role:** Client portal access  
**Permissions:** Client-scoped permissions only  
**Use Case:** External client users

### Mock Data Implementation

```typescript
// lib/constants/mock-data/rbac-data.ts

import { User } from "@/features/auth/types/permissions";

/**
 * Mock Super Admin User - Has all permissions on all resources
 */
export const MOCK_SUPER_ADMIN: User = {
  id: "admin-001",
  email: "superadmin@incredibly.com",
  firstName: "Super",
  lastName: "Admin",
  role: {
    id: "role-admin",
    roleName: "Super Admin",
    isInternal: true,
    rolePermissions: [
      {
        resourceId: "res-providers",
        resourceName: "providers",
        permissions: [
          {
            id: "perm-001",
            name: "view_all",
            code: "PROVIDERS_VIEW_ALL",
            description: "View all providers in the system",
          },
          {
            id: "perm-002",
            name: "create",
            code: "PROVIDERS_CREATE",
            description: "Create new provider records",
          },
          {
            id: "perm-003",
            name: "update",
            code: "PROVIDERS_UPDATE",
            description: "Update provider records",
          },
          {
            id: "perm-004",
            name: "delete",
            code: "PROVIDERS_DELETE",
            description: "Delete provider records",
          },
        ],
      },
      // ... more resources with full permissions
    ],
  },
};

/**
 * Mock Manager User - Has most permissions except user management
 */
export const MOCK_MANAGER: User = {
  id: "manager-001",
  email: "manager@incredibly.com",
  firstName: "Maria",
  lastName: "Manager",
  role: {
    id: "role-manager",
    roleName: "Manager",
    isInternal: true,
    rolePermissions: [
      // Providers: view, create, update (no delete)
      // Enrollments: view, create, update, change_stage, reassign
      // Tasks: view, create, reassign
      // Clients: view, view_details, update
      // Users: none
    ],
  },
};

/**
 * Mock Team Lead User - Has limited operational permissions
 */
export const MOCK_TEAM_LEAD: User = {
  id: "lead-001",
  email: "teamlead@incredibly.com",
  firstName: "Tom",
  lastName: "Lead",
  role: {
    id: "role-teamlead",
    roleName: "Team Lead",
    isInternal: true,
    rolePermissions: [
      // Providers: view, create
      // Enrollments: view, update, reassign
      // Clients: view, view_details
    ],
  },
};

/**
 * Mock Case Analyst User - Has minimal permissions for assigned tasks
 */
export const MOCK_ANALYST: User = {
  id: "analyst-001",
  email: "analyst@incredibly.com",
  firstName: "Alice",
  lastName: "Analyst",
  role: {
    id: "role-analyst",
    roleName: "Case Analyst",
    isInternal: true,
    rolePermissions: [
      // Providers: view
      // Enrollments: view, update
      // Clients: view
    ],
  },
};

/**
 * Mock External Client User - Has client-scoped permissions only
 */
export const MOCK_EXTERNAL_CLIENT: User = {
  id: "external-001",
  email: "client@externalcompany.com",
  firstName: "External",
  lastName: "Client",
  role: {
    id: "role-external",
    roleName: "Client User",
    isInternal: false,
    rolePermissions: [
      // Providers: view (organization scoped)
      // Enrollments: view (organization scoped)
    ],
  },
};

/**
 * Helper function to get mock user by role type
 */
export function getMockUserByRole(
  roleType:
    | "superAdmin"
    | "manager"
    | "teamLead"
    | "analyst"
    | "externalClient",
): User {
  const users = {
    superAdmin: MOCK_SUPER_ADMIN,
    manager: MOCK_MANAGER,
    teamLead: MOCK_TEAM_LEAD,
    analyst: MOCK_ANALYST,
    externalClient: MOCK_EXTERNAL_CLIENT,
  };
  return users[roleType];
}

/**
 * Default mock user for development (Super Admin for full access)
 */
export const DEFAULT_MOCK_USER = MOCK_SUPER_ADMIN;
```

### Switching Mock Users

To test different permission scenarios, developers can change the default user:

```typescript
// In lib/constants/mock-data/rbac-data.ts
export const DEFAULT_MOCK_USER = MOCK_ANALYST; // Change this line
```

Or use the helper function:

```typescript
import { getMockUserByRole } from "@/lib/constants/mock-data/rbac-data";
const user = getMockUserByRole("analyst");
```

---

## Permission Context

### Context Definition

```typescript
// features/auth/context/permission-context.tsx

'use client';

import { createContext, useContext, ReactNode, useMemo, useCallback, useState, useEffect } from 'react';
import { User, RolePermission, ResourceName, PermissionName } from '../types/permissions';
import { DEFAULT_MOCK_USER } from '@/lib/constants/mock-data/rbac-data';

/**
 * Permission context value interface
 */
interface PermissionContextValue {
  // State
  user: User | null;
  permissions: RolePermission[];
  loading: boolean;

  // Utility functions
  hasPermission: (resource: ResourceName, permission: PermissionName) => boolean;
  hasAnyPermission: (resource: ResourceName, permissions: PermissionName[]) => boolean;
  hasAllPermissions: (resource: ResourceName, permissions: PermissionName[]) => boolean;
  canAccess: (resource: ResourceName) => boolean;
  getResourcePermissions: (resource: ResourceName) => PermissionName[];
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

/**
 * Hook to access permission context
 */
export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within PermissionProvider');
  }
  return context;
}

/**
 * Permission Provider Component
 */
export function PermissionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load mock user on mount
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setUser(DEFAULT_MOCK_USER);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Check if user has a specific permission for a resource
   */
  const hasPermission = useCallback(
    (resource: ResourceName, permission: PermissionName): boolean => {
      if (!user?.role?.rolePermissions) return false;

      const resourcePermission = user.role.rolePermissions.find(
        (rp) => rp.resourceName === resource
      );

      if (!resourcePermission) return false;

      return resourcePermission.permissions.some((p) => p.name === permission);
    },
    [user]
  );

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (resource: ResourceName, permissions: PermissionName[]): boolean => {
      return permissions.some((permission) => hasPermission(resource, permission));
    },
    [hasPermission]
  );

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useCallback(
    (resource: ResourceName, permissions: PermissionName[]): boolean => {
      return permissions.every((permission) => hasPermission(resource, permission));
    },
    [hasPermission]
  );

  /**
   * Check if user can access a resource (has any permission for it)
   */
  const canAccess = useCallback(
    (resource: ResourceName): boolean => {
      if (!user?.role?.rolePermissions) return false;

      const resourcePermission = user.role.rolePermissions.find(
        (rp) => rp.resourceName === resource
      );

      return resourcePermission !== undefined && resourcePermission.permissions.length > 0;
    },
    [user]
  );

  /**
   * Get all permissions for a specific resource
   */
  const getResourcePermissions = useCallback(
    (resource: ResourceName): PermissionName[] => {
      if (!user?.role?.rolePermissions) return [];

      const resourcePermission = user.role.rolePermissions.find(
        (rp) => rp.resourceName === resource
      );

      return resourcePermission?.permissions.map((p) => p.name) || [];
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      permissions: user?.role?.rolePermissions || [],
      loading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccess,
      getResourcePermissions,
    }),
    [user, loading, hasPermission, hasAnyPermission, hasAllPermissions, canAccess, getResourcePermissions]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}
```

### Provider Integration

```typescript
// app/providers.tsx

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queries/query-client-config';
import { PermissionProvider } from '@/features/auth/context/permission-context';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PermissionProvider>
        {children}
      </PermissionProvider>
    </QueryClientProvider>
  );
}
```

---

## Hooks & Utilities

### usePermissions Hook

```typescript
// features/auth/hooks/use-permissions.ts

import { usePermissionContext } from "../context/permission-context";

/**
 * Hook to access permission context and utilities
 *
 * @example
 * const { hasPermission, user } = usePermissions();
 * const canCreate = hasPermission('providers', 'create');
 */
export function usePermissions() {
  return usePermissionContext();
}
```

### useHasPermission Hook

```typescript
// features/auth/hooks/use-has-permission.ts

import { useMemo } from "react";
import { usePermissions } from "./use-permissions";
import { ResourceName, PermissionName } from "../types/permissions";

/**
 * Check if user has a specific permission (memoized)
 *
 * @example
 * const canCreate = useHasPermission('providers', 'create');
 */
export function useHasPermission(
  resource: ResourceName,
  permission: PermissionName,
): boolean {
  const { hasPermission } = usePermissions();

  return useMemo(
    () => hasPermission(resource, permission),
    [hasPermission, resource, permission],
  );
}
```

### useCanAccess Hook

```typescript
// features/auth/hooks/use-can-access.ts

import { useMemo } from "react";
import { usePermissions } from "./use-permissions";
import { ResourceName } from "../types/permissions";

/**
 * Check if user can access a resource (any permission)
 *
 * @example
 * const canAccessProviders = useCanAccess('providers');
 */
export function useCanAccess(resource: ResourceName): boolean {
  const { canAccess } = usePermissions();

  return useMemo(() => canAccess(resource), [canAccess, resource]);
}
```

### useRequirePermission Hook

```typescript
// features/auth/hooks/use-require-permission.ts

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePermissions } from "./use-permissions";
import { ResourceName, PermissionName } from "../types/permissions";

/**
 * Protect a component/page by requiring a specific permission
 * Redirects to home if permission is denied
 *
 * @example
 * export default function ProvidersPage() {
 *   useRequirePermission('providers', 'view_all');
 *   return <div>Protected content</div>;
 * }
 */
export function useRequirePermission(
  resource: ResourceName,
  permission: PermissionName,
  redirectTo: string = "/",
) {
  const { hasPermission, loading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!hasPermission(resource, permission)) {
      toast.error("Access Denied", {
        description: "You don't have permission to view this page.",
      });
      router.replace(redirectTo);
    }
  }, [hasPermission, loading, resource, permission, redirectTo, router]);
}
```

### Permission Helper Functions

```typescript
// features/auth/utils/permission-helpers.ts

import { User, ResourceName, PermissionName } from "../types/permissions";

/**
 * Check if user has a specific permission (standalone function)
 */
export function checkPermission(
  user: User | null,
  resource: ResourceName,
  permission: PermissionName,
): boolean {
  if (!user?.role?.rolePermissions) return false;

  const resourcePermission = user.role.rolePermissions.find(
    (rp) => rp.resourceName === resource,
  );

  if (!resourcePermission) return false;

  return resourcePermission.permissions.some((p) => p.name === permission);
}

/**
 * Get all permissions for a specific resource
 */
export function getPermissions(
  user: User | null,
  resource: ResourceName,
): PermissionName[] {
  if (!user?.role?.rolePermissions) return [];

  const resourcePermission = user.role.rolePermissions.find(
    (rp) => rp.resourceName === resource,
  );

  return resourcePermission?.permissions.map((p) => p.name) || [];
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
  return user?.role?.roleName === roleName;
}

/**
 * Check if user is an internal user (vs external)
 */
export function isInternalUser(user: User | null): boolean {
  return user?.role?.isInternal === true;
}
```

---

## UI Components

### PermissionGuard Component

```typescript
// features/auth/components/permission-guard.tsx

import { ReactNode } from 'react';
import { useHasPermission } from '../hooks/use-has-permission';
import { ResourceName, PermissionName } from '../types/permissions';
import { PermissionDeniedPlaceholder } from './permission-denied-placeholder';

interface PermissionGuardProps {
  resource: ResourceName;
  permission: PermissionName;
  children: ReactNode;
  fallback?: ReactNode;
  showDenied?: boolean;
}

/**
 * Wrapper component that protects content based on permissions
 *
 * @example
 * <PermissionGuard resource="providers" permission="create">
 *   <CreateProviderButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  resource,
  permission,
  children,
  fallback = null,
  showDenied = false,
}: PermissionGuardProps) {
  const hasPermission = useHasPermission(resource, permission);

  if (!hasPermission) {
    if (showDenied) {
      return <PermissionDeniedPlaceholder />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

### PermissionDeniedPlaceholder Component

```typescript
// features/auth/components/permission-denied-placeholder.tsx

import { Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PermissionDeniedPlaceholderProps {
  title?: string;
  message?: string;
}

/**
 * Inline placeholder shown when content is permission-restricted
 */
export function PermissionDeniedPlaceholder({
  title = 'Access Restricted',
  message = "You don't have permission to view this content.",
}: PermissionDeniedPlaceholderProps) {
  return (
    <Alert className="border-muted">
      <Lock className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        {message}
      </AlertDescription>
    </Alert>
  );
}
```

### PermissionDeniedPage Component

```typescript
// features/auth/components/permission-denied-page.tsx

import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

/**
 * Full 403 Forbidden page
 */
export function PermissionDeniedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">403 - Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            If you believe you should have access, please contact your manager or system administrator.
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push('/')} variant="default">
              Go to Home
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Navigation Integration

### Navigation Constants with Permissions

```typescript
// lib/constants/navigation.ts

import {
  ResourceName,
  PermissionName,
} from "@/features/auth/types/permissions";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  resource?: ResourceName;
  permission?: PermissionName;
  section?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/my-work/dashboard",
    icon: LayoutDashboard,
    // No permission required - everyone can access
  },
  {
    label: "Clients",
    href: "/records/clients",
    icon: Building2,
    resource: "clients",
    permission: "view_all",
  },
  {
    label: "Providers",
    href: "/records/providers",
    icon: UserRound,
    resource: "providers",
    permission: "view_all",
  },
  {
    label: "Payers",
    href: "/records/payers",
    icon: Building,
    resource: "clients", // Using clients as proxy for payers
    permission: "view_all",
  },
  {
    label: "Business Entities",
    href: "/records/business-entities",
    icon: Building2,
    resource: "clients", // Using clients as proxy
    permission: "view_all",
  },
  {
    label: "Users & Roles",
    href: "/administration/users-roles",
    icon: Users,
    resource: "users",
    permission: "view_all",
    section: "Administration",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    resource: "users",
    permission: "view_all",
    section: "Administration",
  },
];
```

### Sidebar with Permission Filtering

```typescript
// components/layout/sidebar.tsx

import { NAVIGATION_ITEMS } from '@/lib/constants/navigation';
import { usePermissions } from '@/features/auth/hooks/use-permissions';

export function Sidebar() {
  const { hasPermission } = usePermissions();

  // Filter navigation items based on permissions
  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    // If no permission required, always show
    if (!item.resource || !item.permission) return true;

    // Check if user has required permission
    return hasPermission(item.resource, item.permission);
  });

  // Group items by section
  const sections = visibleItems.reduce((acc, item) => {
    const section = item.section || 'main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <nav className="space-y-2">
      {/* Main navigation items */}
      {sections.main?.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}

      {/* Administration section (if user has access) */}
      {sections.Administration && sections.Administration.length > 0 && (
        <>
          <NavSection>Administration</NavSection>
          {sections.Administration.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </>
      )}
    </nav>
  );
}
```

---

## Route Protection

### Page-Level Protection

```typescript
// app/(core)/records/providers/page.tsx

'use client';

import { useRequirePermission } from '@/features/auth/hooks/use-require-permission';

export default function ProvidersPage() {
  // Protect entire page - redirects if no permission
  useRequirePermission('providers', 'view_all');

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### Layout-Level Protection

```typescript
// app/(core)/settings/layout.tsx

'use client';

import { useRequirePermission } from '@/features/auth/hooks/use-require-permission';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect entire section - all child pages require this permission
  useRequirePermission('users', 'view_all');

  return (
    <div className="container mx-auto py-6">
      {children}
    </div>
  );
}
```

### Routes to Protect

**Critical Routes:**

1. `/settings/*` - Requires `users.view_all`
2. `/administration/users-roles` - Requires `users.view_all`
3. `/records/providers/*` - Requires `providers.view_all`
4. `/records/clients/*` - Requires `clients.view_all`
5. `/records/payers/*` - Requires appropriate permission
6. `/records/business-entities/*` - Requires appropriate permission

---

## Module Integration

### Action-Level Permission Checks

#### Providers Module Example

```typescript
// features/providers/components/provider-actions.tsx

import { useHasPermission } from '@/features/auth/hooks/use-has-permission';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ProviderActions() {
  const canCreate = useHasPermission('providers', 'create');
  const canUpdate = useHasPermission('providers', 'update');
  const canDelete = useHasPermission('providers', 'delete');

  return (
    <div className="flex gap-2">
      {/* Hide button if no permission */}
      {canCreate && (
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Create Provider
        </Button>
      )}

      {/* Disable button with tooltip if no permission */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={!canUpdate}
            onClick={handleEdit}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </TooltipTrigger>
        {!canUpdate && (
          <TooltipContent>
            You don't have permission to edit providers
          </TooltipContent>
        )}
      </Tooltip>

      {canDelete && (
        <Button variant="destructive" onClick={handleDelete}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      )}
    </div>
  );
}
```

#### Users & Roles Module Example

```typescript
// app/(core)/administration/users-roles/page.tsx

'use client';

import { useRequirePermission } from '@/features/auth/hooks/use-require-permission';
import { useHasPermission } from '@/features/auth/hooks/use-has-permission';

export default function UsersRolesPage() {
  // Protect page
  useRequirePermission('users', 'view_all');

  // Check specific action permissions
  const canCreate = useHasPermission('users', 'create');
  const canAssignRoles = useHasPermission('users', 'assign_roles');
  const canDeactivate = useHasPermission('users', 'deactivate');

  return (
    <div>
      <UsersList
        canCreate={canCreate}
        canAssignRoles={canAssignRoles}
        canDeactivate={canDeactivate}
      />
    </div>
  );
}
```

### Modules to Integrate

1. **Settings Module** - Already protected at layout level
2. **Users & Roles Module** - CRUD operations
3. **Providers Module** - CRUD operations
4. **Clients Module** - CRUD + SLA management
5. **Payers Module** - CRUD operations
6. **Business Entities Module** - CRUD operations

---

## UI/UX Specifications

### Design Principles

1. **Hide over Disable:** Prefer hiding elements users can't access
2. **Clear Feedback:** Explain why access is denied
3. **Consistent Patterns:** Use same permission-denied states everywhere
4. **Graceful Degradation:** Show partial content if user has partial permissions
5. **No Technical Jargon:** Use user-friendly language

### Permission-Denied States

#### 1. Hidden Element (Preferred)

```tsx
{
  canCreate && <Button>Create</Button>;
}
```

**When to use:** Most cases where user shouldn't see the feature

#### 2. Disabled Button with Tooltip

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

**When to use:** Feature is visible but contextually unavailable

#### 3. Permission-Denied Placeholder

```tsx
<PermissionGuard resource="providers" permission="view_all" showDenied>
  <ProviderDetails />
</PermissionGuard>
```

**When to use:** Section of page user tried to access but can't

#### 4. 403 Forbidden Page

Automatically shown when `useRequirePermission` hook redirects

**When to use:** Entire page/route is permission-restricted

### User Messages

**Navigation/Page Access:**

> "You don't have permission to view this page. Contact your manager to request access."

**Action Buttons:**

> "You don't have permission to [action] [resource]."

**Settings/Admin:**

> "This feature is restricted to administrators."

---

## Implementation Plan

### Phase 1: Foundation (Days 1-3)

**Objective:** Set up type system, mock data, and permission context

**Tasks:**

1. Create type definitions (`features/auth/types/permissions.ts`)
2. Create permission constants (`features/auth/utils/permission-constants.ts`)
3. Create permission helpers (`features/auth/utils/permission-helpers.ts`)
4. Create mock RBAC data (`lib/constants/mock-data/rbac-data.ts`)
5. Implement permission context (`features/auth/context/permission-context.tsx`)
6. Integrate PermissionProvider into app (`app/providers.tsx`)
7. Create core permission hooks:
   - `use-permissions.ts`
   - `use-has-permission.ts`
   - `use-can-access.ts`
   - `use-require-permission.ts`

**Deliverables:**

- Type system complete
- Mock data with 5 user roles
- Permission context working
- Hooks available for use

---

### Phase 2: UI Components (Days 4-5)

**Objective:** Build reusable permission components

**Tasks:**

1. Create `PermissionGuard` component
2. Create `PermissionDeniedPlaceholder` component
3. Create `PermissionDeniedPage` component (403)
4. Verify toast notifications work (already in `useRequirePermission`)
5. Test components with different mock users
6. Ensure dark mode support

**Deliverables:**

- 3 reusable components
- Components follow app theme
- Dark mode support
- Accessible

---

### Phase 3: Navigation Integration (Days 6-7)

**Objective:** Filter navigation by permissions

**Tasks:**

1. Update navigation constants with permission metadata
2. Update main sidebar to filter by permissions
3. Update settings sidebar protection
4. Test with all mock users:
   - MOCK_SUPER_ADMIN (should see all items)
   - MOCK_ANALYST (should see limited items)
   - MOCK_MANAGER (should see subset)

**Deliverables:**

- Navigation filters correctly
- Different users see different menus
- Administration section hidden for non-admins
- No console errors

---

### Phase 4: Route Protection (Days 8-9)

**Objective:** Protect all routes with permissions

**Tasks:**

1. Protect Settings module (layout level)
2. Protect Users & Roles page
3. Protect Providers module pages
4. Protect Clients module pages
5. Protect other module pages (Payers, Business Entities, etc.)
6. Test redirects with different mock users
7. Verify toast notifications appear

**Deliverables:**

- All critical routes protected
- Unauthorized users redirected to home
- Toast notifications shown
- No infinite redirect loops

---

### Phase 5: Module Integration (Days 10-12)

**Objective:** Add permission checks to all actions

**Tasks:**

1. **Settings Module** - Verify layout protection sufficient
2. **Users & Roles Module:**
   - Check `users.create` for "Create User" button
   - Check `users.update` for edit actions
   - Check `users.assign_roles` for role assignment
   - Check `users.deactivate` for deactivate actions
3. **Providers Module:**
   - Check `providers.create` for "Create Provider" button
   - Check `providers.update` for edit actions
   - Check `providers.delete` for delete actions
4. **Clients Module:**
   - Check `clients.create` for "Create Client" button
   - Check `clients.update` for edit actions
   - Check `clients.manage_sla` for SLA management
5. **Other Modules** - Apply similar patterns
6. Test with all mock users

**Deliverables:**

- All module actions respect permissions
- Buttons hidden or disabled appropriately
- Tooltips explain missing permissions
- Works with all mock users

---

## Developer Guidelines

### How to Add Permission Checks

#### 1. Protect a Page

```typescript
import { useRequirePermission } from '@/features/auth/hooks/use-require-permission';

export default function MyPage() {
  useRequirePermission('resource', 'permission');
  return <div>Protected page</div>;
}
```

#### 2. Conditionally Render a Button

```typescript
import { useHasPermission } from '@/features/auth/hooks/use-has-permission';

export function MyComponent() {
  const canCreate = useHasPermission('providers', 'create');

  return (
    <div>
      {canCreate && <Button>Create</Button>}
    </div>
  );
}
```

#### 3. Disable a Button with Tooltip

```typescript
import { useHasPermission } from '@/features/auth/hooks/use-has-permission';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function MyComponent() {
  const canEdit = useHasPermission('providers', 'update');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button disabled={!canEdit}>Edit</Button>
      </TooltipTrigger>
      {!canEdit && (
        <TooltipContent>
          You don't have permission to edit
        </TooltipContent>
      )}
    </Tooltip>
  );
}
```

#### 4. Protect a Section with Guard

```typescript
import { PermissionGuard } from '@/features/auth/components/permission-guard';

export function MyComponent() {
  return (
    <PermissionGuard resource="providers" permission="update">
      <EditForm />
    </PermissionGuard>
  );
}
```

### Best Practices

**Do:**

- ✅ Check permissions before rendering UI elements
- ✅ Use type-safe resource and permission names
- ✅ Hide elements when possible, disable when necessary
- ✅ Provide clear feedback for permission errors
- ✅ Test with different mock users

**Don't:**

- ❌ Show disabled features without explanation
- ❌ Make unnecessary permission checks in tight loops
- ❌ Hardcode role names (use permissions instead)
- ❌ Use technical jargon in error messages

### Testing with Mock Users

To test as different users:

1. Open `lib/constants/mock-data/rbac-data.ts`
2. Change `DEFAULT_MOCK_USER` to desired role:
   ```typescript
   export const DEFAULT_MOCK_USER = MOCK_ANALYST;
   ```
3. Refresh the application
4. You'll now see the UI as that user role

### Common Patterns

#### Pattern 1: Page with Actions

```typescript
export default function ResourcePage() {
  useRequirePermission('resource', 'view_all');

  const canCreate = useHasPermission('resource', 'create');
  const canUpdate = useHasPermission('resource', 'update');
  const canDelete = useHasPermission('resource', 'delete');

  return (
    <div>
      <PageHeader>
        {canCreate && <CreateButton />}
      </PageHeader>
      <ResourceList
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </div>
  );
}
```

#### Pattern 2: Conditional Navigation

```typescript
export function Navigation() {
  const canAccessUsers = useHasPermission('users', 'view_all');
  const canAccessProviders = useCanAccess('providers');

  return (
    <nav>
      {canAccessProviders && <NavItem href="/providers">Providers</NavItem>}
      {canAccessUsers && <NavItem href="/users">Users</NavItem>}
    </nav>
  );
}
```

#### Pattern 3: Action Menu

```typescript
export function ActionMenu({ item }) {
  const canEdit = useHasPermission('resource', 'update');
  const canDelete = useHasPermission('resource', 'delete');

  return (
    <DropdownMenu>
      <DropdownMenuContent>
        {canEdit && <DropdownMenuItem>Edit</DropdownMenuItem>}
        {canDelete && <DropdownMenuItem>Delete</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Success Criteria

### Phase 1-5 Complete When:

✅ All type definitions created  
✅ Mock data with 5 user roles working  
✅ Permission context providing utilities  
✅ All hooks implemented  
✅ All UI components working  
✅ Navigation filters by permissions  
✅ All routes protected  
✅ All modules check permissions  
✅ Can switch mock users and see different UI  
✅ Permission-denied states display correctly  
✅ No console errors  
✅ Dark mode support  
✅ Accessible (keyboard navigation, ARIA labels)

---

## Appendix

### Resource-Permission Matrix

| Resource      | Permissions                                                                    | Description                |
| ------------- | ------------------------------------------------------------------------------ | -------------------------- |
| `providers`   | `view_all`, `create`, `update`, `delete`                                       | Provider management        |
| `enrollments` | `view_all`, `create`, `update`, `delete`, `change_stage`, `reassign`, `bulk`   | Enrollment case management |
| `tasks`       | `view_all`, `create`, `complete`, `reassign`                                   | Task management            |
| `clients`     | `view_all`, `view_details`, `create`, `update`, `manage_sla`                   | Client management          |
| `users`       | `view_all`, `create`, `update`, `assign_roles`, `deactivate`, `reset_password` | User administration        |

### Mock User Comparison

| Feature          | Super Admin | Manager | Team Lead | Analyst | External    |
| ---------------- | ----------- | ------- | --------- | ------- | ----------- |
| View Providers   | ✅          | ✅      | ✅        | ✅      | ✅ (scoped) |
| Create Providers | ✅          | ✅      | ✅        | ❌      | ❌          |
| Delete Providers | ✅          | ❌      | ❌        | ❌      | ❌          |
| View Users       | ✅          | ❌      | ❌        | ❌      | ❌          |
| Manage Roles     | ✅          | ❌      | ❌        | ❌      | ❌          |
| Access Settings  | ✅          | ❌      | ❌        | ❌      | ❌          |

---

**Document Status:** Ready for Implementation  
**Last Updated:** February 3, 2026  
**Next Step:** Begin Phase 1 Implementation
