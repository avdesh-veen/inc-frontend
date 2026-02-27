## Naming and Code Conventions

### File Naming

#### Files and Directories

- **Components**: kebab-case for file name - `user-profile.tsx`, `product-card.tsx` (component name in PascalCase: `UserProfile`, `ProductCard`)
- **Hooks**: kebab-case for file name - `use-user-data.ts`, `use-auth.ts` (hook name in camelCase: `useUserData`, `useAuth`)
- **Utilities**: kebab-case for file name - `format-date.ts`, `validate-email.ts` (function name in camelCase: `formatDate`, `validateEmail`)
- **Types**: kebab-case for file name - `user.ts`, `api-response.ts` (type name in PascalCase: `User`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE - `API_BASE_URL.ts`, `MAX_ITEMS.ts`
- **Directories**: kebab-case - `user-profile/`, `api-client/`
- **Config files**: kebab-case - `next.config.js`, `tailwind.config.ts`

#### Special Files (Next.js)

- `page.tsx` - Route pages
- `layout.tsx` - Layouts
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI
- `route.ts` - API route handlers
- `template.tsx` - Template components

### Naming Conventions

#### Variables and Functions

- **Variables**: camelCase - `userName`, `isLoading`, `productList`
- **Functions**: camelCase - `getUserData()`, `handleSubmit()`, `formatDate()`
- **Constants**: UPPER_SNAKE_CASE - `MAX_RETRIES`, `API_TIMEOUT`
- **Booleans**: Prefix with `is`, `has`, `should`, `can` - `isLoading`, `hasPermission`, `shouldValidate`
- **Event handlers**: Prefix with `handle` - `handleClick()`, `handleSubmit()`
- **Async functions**: Can use `async` prefix - `async fetchUser()` or just `fetchUser()`

#### Components and Types

- **Components**: PascalCase - `UserProfile`, `ProductCard`
- **Interfaces**: PascalCase - `UserProps`, `ApiResponse<T>`
- **Types**: PascalCase - `UserStatus`, `FormData`
- **Enums**: PascalCase - `UserRole`, `OrderStatus`

#### Hooks

- **Custom hooks**: camelCase with `use` prefix - `useUser()`, `useAuth()`, `useLocalStorage()`
- **Hook files**: kebab-case - `use-user.ts`, `use-auth.ts`, `use-local-storage.ts`

### Import Organization

#### No Duplicate Module Imports (Mandatory)

- **Do not import from the same module more than once.** Consolidate all symbols from a given module into a single import statement (SonarQube / linter enforced).
- Use exactly one `import` or `import type` per module; combine all needed named imports from that module in one statement.
- This rule is mandatory and must be followed strictly.

```typescript
// ✅ Correct: single import per module
import { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type { User, UserRequest, UserStatus } from "../types/user-tab";

// ❌ Wrong: same module imported multiple times
import { ApiResponse } from "@/lib/api/types";
import { PaginatedResponse } from "@/lib/api/types";
import { User, UserRequest } from "../types/user-tab";
import type { UserStatus } from "../types/user-tab";
```

#### Import Order

1. React and Next.js imports
2. External library imports (alphabetically)
3. Internal absolute imports from `@/` (alphabetically)
4. Relative imports (by depth, then alphabetically)
5. Type-only imports (using `type` keyword)

#### Import Example

```typescript
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 2. External libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, Task01Icon } from "@hugeicons/core-free-icons";

// 3. Internal absolute imports
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/features/user/store/use-user-store";
import { cn } from "@/lib/utils";

// 4. Relative imports
import { UserCard } from "./user-card";
import { UserList } from "../user-list";

// 5. Type imports
import type { User } from "@/features/user/types";
import type { ComponentProps } from "react";
```

#### Import Aliases

- Use `@/` for root directory imports
- Configure in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./*"]
      }
    }
  }
  ```

### Code Organization

#### Component Structure

```typescript
// 1. Imports
import { ... } from '...';

// 2. Type definitions
interface ComponentProps { ... }

// 3. Component
export function Component({ ... }: ComponentProps) {
  // 4. Hooks (in order)
  // 5. Derived state
  // 6. Effects
  // 7. Event handlers
  // 8. Render
  return (...);
}
```

#### Function Organization

- Pure functions first
- Helper functions before main function
- Export at the end of file or inline

### TypeScript Conventions

#### Type Definitions

- Use `interface` for object shapes and component props
- Use `type` for unions, intersections, and primitives
- Prefer union types over enums when possible
- Avoid `any` - use `unknown` or proper types

#### Type Examples

```typescript
// Interface for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Type for unions
type Status = "pending" | "active" | "inactive";

// Type for intersections
type AdminUser = User & { role: "admin" };

// Generic types
interface ApiResponse<T> {
  data: T;
  status: number;
}
```

#### Type Exports

- Export types from dedicated files: `@features/user/types/user.ts`
- Use `export type` for type-only exports
- Re-export types from index files when needed

### Constants and Configuration

#### Constants Organization

```typescript
// constants/api.ts
export const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL,
export const API_TIMEOUT = 5000;
export const MAX_RETRIES = 3;

// constants/query-keys.ts
export const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
} as const;
```

### Comments and Documentation

#### Code Comments

- Use comments to explain "why", not "what"
- Keep comments up to date with code
- Remove commented-out code before committing

#### JSDoc Comments

```typescript
/**
 * Fetches user data from the API
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to user data
 * @throws {Error} When user is not found
 */
async function fetchUser(userId: string): Promise<User> {
  // Implementation
}
```

### Formatting

#### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (or double quotes consistently)
- Use semicolons (or no semicolons consistently)
- Trailing commas in multi-line objects/arrays
- Maximum line length: 100 characters

#### Prettier Configuration

- Use Prettier for code formatting
- Configure via `.prettierrc` or `prettier.config.js`
- Format on save in editor

### Git Conventions

#### Commit Messages

- Use conventional commits format
- Prefix with type: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Keep messages concise and descriptive

#### Branch Naming

- Use kebab-case: `feature/user-authentication`
- Prefix with type: `feature/`, `fix/`, `refactor/`

### Environment Variables

#### Naming

- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Use uppercase with underscores: `NEXT_PUBLIC_API_BASE_URL`
- Document in `.env.example`

#### Usage

```typescript
// Server-side
const apiKey = process.env.API_KEY;

// Client-side (must have NEXT_PUBLIC_ prefix)
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### Best Practices

#### Consistency

- Follow established patterns consistently
- Use team-agreed conventions
- Update conventions as needed

#### Readability

- Write self-documenting code
- Use descriptive names
- Keep functions small and focused
- Avoid deep nesting

#### Maintainability

- Keep code DRY (Don't Repeat Yourself)
- Extract reusable logic
- Document complex logic
- Keep dependencies up to date

#### API Implementation Guidelines

- **⚠️ CRITICAL**: Do NOT implement any API route handlers (`app/api/*/route.ts`) or backend API implementations unless explicitly requested by the user
- This codebase is frontend-only and focuses on UI components, data fetching from external APIs, and client-side logic
- Use mock data for all features during development (see Mock Data Strategy in architecture.md)
- API integration will be added in a separate phase when explicitly requested

#### Icon Usage Guidelines

- **Use Hugeicons**: Always use Hugeicons for all icon needs
- **Import Method**: Import icons using the official method from Hugeicons documentation

  ```typescript
  import { HugeiconsIcon } from '@hugeicons/react';
  import { Home01Icon, Task01Icon, MinusSignIcon } from '@hugeicons/core-free-icons';

  // Usage
  <HugeiconsIcon
    icon={Home01Icon}
    className="w-5 h-5"
    strokeWidth={1.5}
    aria-hidden="true"
  />
  ```

- **Accessibility**: Always include `aria-hidden="true"` for decorative icons
- **Consistency**: Use consistent sizing (typically `w-5 h-5`) and stroke width (`strokeWidth={1.5}`)

#### React Hooks Best Practices

- **Avoid useEffect**: Minimize use of `useEffect` as much as possible
- **Prefer Server Components**: Use Server Components for data fetching instead of `useEffect` in Client Components
- **Use Server Functions**: For data queries, use server functions instead of client-side effects
- **When useEffect is Acceptable**:
  - Browser API interactions (localStorage, window events)
  - Third-party library initialization
  - DOM measurements and animations
  - WebSocket connections
- **Not for Data Fetching**: Never use `useEffect` for data fetching - use TanStack Query or Server Components instead
