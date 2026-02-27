# Folder Structure Guide

## Table of Contents

1. [Root Directory Structure](#1-root-directory-structure)
2. [Source Directory Organization](#2-source-directory-organization)
3. [App Router Structure](#3-app-router-structure)
4. [Feature Module Pattern](#4-feature-module-pattern)
5. [Configuration Directories](#5-configuration-directories)
6. [Shared Resources](#6-shared-resources)
7. [File Naming Conventions](#7-file-naming-conventions)
8. [Module Responsibilities](#8-module-responsibilities)

---

## 1. Root Directory Structure

```
incredibly/
├── app/                          # Next.js App Router (routes, layouts, pages)
├── features/                     # Feature modules (see Module Structure section)
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Overall application layout eg. navbar, sidebar
│   ├── provider/                 # Application level providers eg. theme-provider
│   └── shared/                   # Shared components across features
├── lib/                          # Utility functions and helpers
│   ├── api/                      # Application level api setup using axios, includes api client, api endpoints
│   ├── query-client/             # Application level tanstack query client which uses api client
│   ├── constants/                # Application level magic strings, route constants, query constants, mock data, query parameters
│   └── utils                     # Utility functions
│   └── date-helpers              # Date helpers
├── hooks/                        # Application level custom react hooks
├── public/                       # Static assets
├── docs/                         # Project documentation
│   ├── components/               # Module-wise component level documentation
│   ├── product/                  # Product documentation
│   └── standards/                # Coding standards
├── .next/                        # Next.js build output (generated)
├── node_modules/                 # Dependencies (generated)
├── .husky/                       # Git hooks configuration
│   └── pre-commit                # Pre-commit hook script
├── package.json                  # Project dependencies & scripts
├── pnpm-lock.yaml                # Dependency lock file
├── pnpm-workspace.yaml           # pnpm workspace configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── components.json               # shadcn/ui configuration
├── .prettierrc                   # Prettier configuration (if exists)
├── .gitignore                    # Git ignore patterns
├── .env.local                    # Local environment variables (git-ignored)
├── .env.example                  # Environment variable template
└── README.md                     # Project overview
```

### Purpose of Root Files

| File/Directory       | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `app/`               | Next.js App Router with routes, layouts, and pages |
| `components/`        | React components organized by type                 |
| `lib/`               | Utility functions and shared logic                 |
| `features/`          | Feature specific modules                           |
| `hooks/`             | Custom React hooks                                 |
| `public/`            | Static assets served as-is (images, fonts, etc.)   |
| `docs/`              | Project documentation                              |
| `.next/`             | Next.js build output (created by `next build`)     |
| `.husky/`            | Git pre-commit hooks for code quality              |
| `package.json`       | Dependencies, scripts, project metadata            |
| `next.config.ts`     | Next.js framework configuration                    |
| `tsconfig.json`      | TypeScript compiler settings                       |
| `tailwind.config.ts` | Tailwind CSS customization                         |
| `components.json`    | shadcn/ui component configuration                  |
| `eslint.config.mjs`  | Linting rules and plugins                          |

---

## 2. Source Directory Organization

```
app/                              # Next.js App Router
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Home page
├── globals.css                   # Global styles
├── loading.tsx                   # Root loading UI
├── error.tsx                     # Root error boundary
├── not-found.tsx                 # Root 404 page
├── (auth)/                       # Route group for auth pages
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (dashboard)/                  # Route group for dashboard
│   ├── layout.tsx                # Dashboard layout
│   ├── dashboard/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── [dynamic]/                    # Dynamic route segments
    └── page.tsx

components/
├── ui/                           # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── layout/                       # Overall application layout eg. navbar, sidebar
│   ├── sidebar/
│   │   ├── app-sidebar.tsx
│   ├── top-nav/
│   │   ├── top-nav.tsx
│   └── main-content.tsx
└── providers/                    # App level global-providers
    └── theme-provider.tsx

lib/
├── utils.ts                      # Utility functions (cn, etc.)
├── api/                          # API client and endpoints
│   ├── client.ts                 # API client setup using axios
│   └── endpoints.ts              # Centralized endpoint URLs
├── constants/                    # Application constants
│   ├── app-constants.ts
│   ├── route-constants.ts
│   ├── mock-data/                # Mock data for every feature
│   └── query-keys.ts             # TanStack Query keys
└── date-helpers.ts               # helper functions using date-fns

hooks/
└── use-[utility].ts              # Utility hooks (debounce, etc.)

features/                         # Feature modules (see Module Structure section)
└── [feature]/                    # Folder for every feature
    ├── components/               # Feature-specific components
    ├── api/                      # Feature-specific api queries and mutations
    ├── pages/                    # Feature-specific page for list
    ├── hooks/                    # Feature-specific hooks and zustand stores
    ├── validations/              # Feature-specific zod schemas
    ├── utils/                    # Feature-specific utility functions and pure business logic fns
    └── types/                    # Feature-specific type definitions
```

### Directory Responsibilities

#### `/app/`

- **Next.js App Router** - Contains all routes, layouts, and pages
- Uses file-based routing with special files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)
- Route groups `(group-name)` for organizing routes without affecting URL structure
- Dynamic routes `[param]` for parameterized routes
- **⚠️ CRITICAL**: API routes in `app/api/` should NOT be implemented unless explicitly requested. This codebase is frontend-only.

**Layout Usage**: The main application layout (sidebar, navbar, main content wrapper) is implemented once in the root or route group layout. DO NOT recreate these layout components in every feature module.

#### `/components/ui/`

- **shadcn/ui components** - Pre-built, accessible UI components
- Copy and customize from shadcn/ui library
- Built on Radix UI primitives
- Examples: Button, Input, Card, Dialog, Select

#### `/components/layout/`

- **Application-specific layouts** - Components tied to layout of the application
- Used once in the app layout definition
- Defines the sidebar and navbar of the application

#### `/components/providers/`

- **React context providers**
- Theme providers and other application level providers needed
- Feature-specific context providers only if needed

#### `/lib/`

- **Utility functions and business logic**
- `utils.ts` - General utilities (cn, formatters, validators)
- `api/` - API client setup and endpoint definitions
- `constants/` - Application-wide constants for magic strings, route constants, mock data and query keys
- `constants/mock-data/` - **Feature-specific mock data files** (see Mock Data Strategy)
- `date-helpers.ts` - helper functions using date-fns

**Mock Data Strategy**: When no API implementation is specified, always create mock data in `lib/constants/mock-data/[feature-name].ts` following the expected data structure. This allows features to be built and tested without backend dependencies.

#### `/hooks/`

- **Custom React hooks**
- UIncludes only utility hooks (e.g., `use-debounce.ts`, `use-local-storage.ts`)
- Shared across components but not global state (use Zustand for that)

#### `/features/`

- Feature-based modules (self-contained features)
- Each module follows the **Module Structure Pattern** (see below)

---

## 3. Module Structure Pattern

Each feature module in `/src/modules/` follows this **consistent structure**:

```
module-name/
├── api/
│   └── module-create.tsx               # RTK Query service definition for create and edit
│   └── module-list.tsx                # RTK Query service definition for listing
│   └── module-details.tsx               # RTK Query service definition for details page
│   └── ...
├── components/                   # Module-specific components
│   ├── component-a.tsx
│   └── component-b.tsx
├── pages/                        # Page-level components (lazy loaded)
│   └── module-list/
│   └── module-create/
│   └── module-details/
│   └── ...
├── hooks/                        # Custom hooks (optional)
│   └── use-*.ts
├── utils/                        # Custom business logic (optional)
│   └── specific-logic.ts
├── validations/                  # Feature-specific Zod schemas
│   └── schemas.ts
└── types/                        # TypeScript types (optional)
    └── index.ts
```

---

## 4. App Router Structure

### Special Files in App Router

Next.js App Router uses special file names for routing and layout:

| File Name       | Purpose                                | Example Location                      |
| --------------- | -------------------------------------- | ------------------------------------- |
| `page.tsx`      | Route page component                   | `app/my-work/dashboard/page.tsx`      |
| `layout.tsx`    | Shared layout for route segment        | `app/(dashboard)/layout.tsx`          |
| `loading.tsx`   | Loading UI for route segment           | `app/my-work/dashboard/loading.tsx`   |
| `error.tsx`     | Error boundary for route segment       | `app/my-work/dashboard/error.tsx`     |
| `not-found.tsx` | 404 page for route segment             | `app/my-work/dashboard/not-found.tsx` |
| `route.ts`      | API route handler                      | `app/api/users/route.ts`              |
| `template.tsx`  | Template component (re-renders on nav) | `app/my-work/dashboard/template.tsx`  |
| `default.tsx`   | Default route for parallel routes      | `app/@analytics/default.tsx`          |

### Route Organization Patterns

#### Pattern 1: Flat Structure (Simple Apps)

```
app/
├── page.tsx                      # Home: /
├── user-roles/
│   └── page.tsx                 # user and roles: /user-roles
├── dashboard/
│   └── page.tsx                 # Dashboard: /my-work/dashboard
└── settings/
    └── page.tsx                 # Settings: /settings
```

#### Pattern 2: Route Groups (Organized)

```
app/
├── (core)/                 # Route group for core application (no URL segment)
│   ├── page.tsx                 # Home: /
│   ├── about/
│   │   └── page.tsx            # About: /about
│   ├── settings/
│   │   └── page.tsx            # Settings: /settings
│   └── contact/
│       └── page.tsx            # Contact: /contact
└── (auth)/                 # Route group for authentication
    ├── layout.tsx               # Dashboard layout
    ├── login/
    │   └── page.tsx            # Dashboard: /my-work/dashboard
    └── forget-password/
        └── page.tsx            # Forget-password: /forget-password
```

#### Pattern 3: Nested Routes

```
app/
└── (core)/
    ├── layout.tsx               # Layout for /*
    ├── page.tsx                 # Main page: /
    ├── dashboard/
    │   ├── page.tsx            # Dashboard: /clients
    ├── clients/
    │   ├── page.tsx            # Clients list: /clients
    │   └── [id]/
    │       └── page.tsx        # Client detail: /clients/[id]
    └── providers/
        ├── page.tsx            # Providers list: /providers
        └── [id]/
            └── page.tsx        # Provider detail: /providers/[id]
```

### Server vs Client Components

#### Server Components (Default)

```typescript
// app/my-work/dashboard/page.tsx
// No "use client" directive - this is a Server Component

export default async function DashboardPage() {
  // Can use async/await directly
  const data = await fetchData();

  return <Dashboard data={data} />;
}
```

**Use Server Components for:**

- Data fetching
- Accessing backend resources
- Keeping sensitive information on server
- Large dependencies (reduces client bundle)

#### Client Components

```typescript
// components/features/clients/client-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function ClientForm() {
  // Can use hooks, browser APIs, event handlers
  const [isOpen, setIsOpen] = useState(false);

  return <form>...</form>;
}
```

**Use Client Components for:**

- Interactivity (onClick, onChange, etc.)
- Browser-only APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Context providers

---

## 5. Feature Module Pattern

For most of the features, organize code in a feature-based structure:

```
feature-name/
├── components/                   # Feature-specific components
│   ├── feature-table.tsx
│   ├── feature-card.tsx
│   └── feature-form.tsx
├── lib/                          # Feature-specific utilities
│   ├── api.ts                    # API functions for this feature
│   └── utils.ts                  # Feature-specific utilities
├── hooks/                        # Feature-specific hooks
│   └── use-feature.ts
├── pages/                        # Page-level components (lazy loaded)
│   └── module-list/
│   └── module-create/
│   └── module-details/
│   └── ...
├── api/                          # Feature-specific api queries and mutations
│   └── feature-list.ts
│   └── feature-create.ts
│   └── feature-detail.ts
├── types/                        # Feature-specific types
│   └── index.ts
└── validations/                  # Feature-specific Zod schemas
    └── schemas.ts
```

### Feature Module Example: Clients

```
clients/
├── components/
│   ├── client-table.tsx           # Client listing component
│   ├── client-card.tsx           # Individual client card
│   ├── client-form.tsx           # Create/edit client form
│   └── client-detail.tsx         # Client detail view
├── lib/
│   ├── api.ts                    # fetchClients, createClient, etc.
│   └── utils.ts                  # Client-specific utilities
├── hooks/
│   ├── use-clients.ts            # TanStack Query hooks
│   └── use-client-form.ts        # Form management hook
├── pages/                        # Page-level components (lazy loaded)
│   └── client-list/              # Client listing page using table components
│   └── client-create/            # Create modals or sidebars
│   └── client-details/           # Detail page with layout definition using components
├── types/
│   └── index.ts                  # Client, ClientFormData types
└── validations/
    └── schemas.ts                # Zod schemas for client forms
```

### Where Features Live

Co-located at the root folder (Recommended)\*\*

```
features/
    ├── clients/                  # All client feature code
    │   ├── components/
    │   ├── api/
    │   ├── pages/
    │   ├── hooks/
    │   ├── validations/
    │   ├── utils/
    │   └── types/
    └── providers/                # All provider feature code
        ├── components/
        ├── lib/
        └── hooks/
```

**Recommendation**: Use Co-located at the root folder for better discoverability and simpler imports.

---

## 6. Configuration Directories

### `/lib/api/`

#### `client.ts`

Includes Centralized Axios API client setup

#### `endpoints.ts`

```typescript
// Centralized endpoint registry
export const apiEndpoints = {
  clients: {
    list: "/api/clients",
    detail: (id: string) => `/api/clients/${id}`,
    create: "/api/clients",
    update: (id: string) => `/api/clients/${id}`,
    delete: (id: string) => `/api/clients/${id}`,
  },
  providers: {
    list: "/api/providers",
    // ...
  },
};
```

### `/lib/constants/`

#### `app-constants.ts`

```typescript
export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const CACHE_TIME = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 15, // 15 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
};
```

#### `query-keys.ts`

```typescript
// TanStack Query key factory
export const queryKeys = {
  clients: {
    all: ["clients"] as const,
    lists: () => [...queryKeys.clients.all, "list"] as const,
    list: (filters: ClientFilters) =>
      [...queryKeys.clients.lists(), filters] as const,
    details: () => [...queryKeys.clients.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.clients.details(), id] as const,
  },
  providers: {
    all: ["providers"] as const,
    // ...
  },
} as const;
```

#### `mock-data/`

Includes module/feature specific mock data

---

## 7. Shared Resources

### `/components/layout/`

**Purpose**: Reusable components used across root layout ONLY or for loading, empty state or error handling

#### Examples

- `header.tsx` - Main navigation header
- `footer.tsx` - Site footer
- `sidebar.tsx` - Sidebar navigation
- `loading-spinner.tsx` - Loading indicator
- `empty-state.tsx` - Empty state display
- `error-message.tsx` - Error display component

**When to add here**:

- Component defines a particular layout that can be used all across the application for consistency
- Component has no feature-specific logic
- Component is generic and reusable

**When NOT to add here**:

- Component is feature-specific
- Component has business logic tied to one feature
- Component imports from a specific feature

### `/hooks/`

**Purpose**: Shared custom hooks

#### Examples

```typescript
// hooks/use-debounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  // Debounce implementation
}

// hooks/use-local-storage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Local storage hook
}
```

**When to add here**:

- Hook is used across multiple features
- Hook is a utility (debounce, throttle, etc.)
- Hook doesn't depend on specific feature logic

### `/lib/utils.ts`

**Purpose**: Pure utility functions

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  // Email validation
}
```

---

## 8. File Naming Conventions

### Naming Rules

| Type                | Convention                    | Examples                                |
| ------------------- | ----------------------------- | --------------------------------------- |
| **Components**      | `kebab-case.tsx`              | `user-profile.tsx`, `client-card.tsx`   |
| **Component Names** | `PascalCase`                  | `UserProfile`, `ClientCard`             |
| **Hooks**           | `use-*.ts`                    | `use-client-list.ts`, `use-debounce.ts` |
| **Types**           | `kebab-case.ts` or `index.ts` | `client-types.ts`, `index.ts`           |
| **Utilities**       | `kebab-case.ts`               | `utils.ts`, `date-helpers.ts`           |
| **Constants**       | `kebab-case.ts`               | `app-constants.ts`, `query-keys.ts`     |
| **Pages**           | `page.tsx`                    | `app/my-work/dashboard/page.tsx`        |
| **Layouts**         | `layout.tsx`                  | `app/(dashboard)/layout.tsx`            |
| **API Routes**      | `route.ts`                    | `app/api/clients/route.ts`              |
| **Server Actions**  | `actions.ts`                  | `lib/actions/client-actions.ts`         |

### Examples

```
✅ CORRECT
features/
  clients/
    components/
      client-list.tsx          # Component export: ClientList
      client-card.tsx         # Component export: ClientCard
  hooks/
    use-client-list.ts            # Hook export: useClientList
    use-debounce.ts               # Hook export: useDebounce

components/layout/*
    top-nav/header.tsx                   # Component export: Header
    sidebar/app-sidebar.tsx              # Component export: Sidebar

❌ INCORRECT
components/          # Should not be inside components
  features/
    clients/
      components/
        ClientList.tsx          # Should be kebab-case
        ClientCard.tsx          # Should be kebab-case
  shared/
    Header.tsx                  # Should be kebab-case
hooks/
  useClientList.ts              # Should be kebab-case
lib/
  api/
    clientApi.ts                # Should be kebab-case
```

---

## 9. Module Responsibilities

### When to Create a Feature Module

Create a feature module when:

- ✅ Feature represents a distinct business capability
- ✅ Feature has its own API endpoints
- ✅ Feature has multiple related components
- ✅ Feature has its own data fetching logic
- ✅ Feature has complex state management needs

**Examples**: Client management, Provider management, Case management, Dashboard

### When NOT to Create a Feature Module

Do NOT create a feature module when:

- ❌ Feature is a single component used in one place
- ❌ Feature is a utility or helper function
- ❌ Feature is purely presentational with no data fetching

**Instead**: Add to `components/shared/` or `lib/utils.ts`

### Feature Independence

Each feature should:

- ✅ Be self-contained with minimal external dependencies
- ✅ Import from `@/lib`, `@/hooks`, `@/types`, `@/components/shared`, `@/components/ui`
- ✅ Export hooks from its own `hooks/` directory
- ✅ Export hooks from its own `components/` directory
- ✅ Export hooks from its own `api/` directory
- ✅ Export hooks from its own `pages/` directory
- ✅ Export hooks from its own `validations/` directory
- ✅ Export hooks from its own `utils/` directory only if needed
- ✅ Have its own types in `types/index.ts`

Each feature should NOT:

- ❌ Import components from other features (use `shared/` instead)
- ❌ Import hooks from other features (duplicate if needed, or move to shared)
- ❌ Have circular dependencies

### Server vs Client Component Guidelines

**Default to Server Components**:

- Data fetching pages
- Static content
- Layout components (unless they need interactivity)

**Use Client Components for**:

- Interactive UI (buttons, forms, modals)
- Components using hooks (useState, useEffect, etc.)
- Components using browser APIs
- Context providers
- TanStack Query hooks (in client components)

**Composition Pattern**:

```typescript
// Server Component (app/my-work/dashboard/page.tsx)
export default async function DashboardPage() {
  const data = await fetchData(); // Server-side fetch

  return (
    <div>
      <ServerContent data={data} />
      <ClientInteractiveComponent />
    </div>
  );
}

// Client Component (components/features/my-work/dashboard/interactive.tsx)
'use client';

export function ClientInteractiveComponent() {
  const [state, setState] = useState();
  // Interactive logic
}
```

---

## Best Practices

### File Organization

1. **Keep files focused**: Each file should have a single responsibility
2. **Group related files**: Keep components, hooks, and types for a feature together
3. **Use index files sparingly**: Only for type exports and API function exports
4. **Avoid deep nesting**: Max 3-4 levels deep in any directory

## Quick Reference

### Adding a Component

**UI component (shadcn/ui)**:

```bash
npx shadcn@latest add button
# Adds to components/ui/button.tsx
```

**Shared component**:

```bash
touch components/shared/my-component.tsx
```

**Feature component**:

```bash
touch components/features/[feature]/components/my-component.tsx
```

### Adding a Hook

**Shared hook**:

```bash
touch hooks/use-my-hook.ts
```

**Feature hook**:

```bash
touch components/features/[feature]/hooks/use-my-hook.ts
```

### Adding a Utility

```bash
# Add to existing utils.ts or create new file
touch lib/my-util.ts
```

### Creating a New Feature

```bash
mkdir -p components/features/my-feature/{components,utils,api,pages,hooks,types,validations,types}
touch components/features/my-feature/lib/api.ts
touch components/features/my-feature/types/index.ts
touch components/features/my-feature/validations/schemas.ts
```

### Creating a New Route

```bash
# Simple route
mkdir -p app/my-route
touch app/my-route/page.tsx

# Route with layout
mkdir -p app/my-route
touch app/my-route/layout.tsx
touch app/my-route/page.tsx

# Dynamic route
mkdir -p app/my-route/\[id\]
touch app/my-route/\[id\]/page.tsx
```

---

## Reference

For more details on Next.js App Router patterns, see:

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Routing](https://nextjs.org/docs/app/building-your-application/routing)

For project-specific architecture patterns, see:

- `docs/standards/frontend/architecture.md` - Next.js App Router architecture
- `docs/standards/frontend/components.md` - Component standards
- `docs/standards/frontend/conventions.md` - Naming and code conventions
