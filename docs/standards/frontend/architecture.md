## Next.js App Router Architecture

### Directory Structure

- **app/** - App Router directory with route segments, layouts, and special files
- **features/** - feature specific components, hooks, stores, providers, utils, query/mutation hooks, test files. It includes files which are independent of other features.
- **components/** - Reusable React components specific to application or shared across modules
- **lib/** - Utility functions, helpers, and shared business logic (if any)
- **hooks/** - Custom React hooks shared across the application
- **public/** - Static assets

### App Router Patterns

#### Route Segments

- Use folder-based routing in `app/` directory
- Each route folder must contain a `page.tsx` file
- Use `layout.tsx` for shared layouts at any level
- Use `loading.tsx` for route-level loading states
- Use `error.tsx` for route-level error boundaries
- Use `not-found.tsx` for 404 pages

#### Server vs Client Components

- **Default to Server Components** - Components are server components by default
- **Use "use client" directive** only when needed for:
  - Interactivity (onClick, onChange, etc.)
  - Browser-only APIs (localStorage, window, etc.)
  - React hooks (useState, useEffect, etc.)
  - Context providers
- **Keep Server Components at the top** - Minimize client component boundaries
- **Composition pattern** - Pass Server Components as children to Client Components

#### Data Fetching Strategy

- **Server Components**: Use async/await directly in Server Components
- **Client Components**: Use TanStack Query for client-side data fetching
- **Server Actions**: Use for mutations and form submissions
- **Server Functions**: Use for data-query and fetching data
- **IMPORTANT**: Do NOT implement any API route handlers (`app/api/*/route.ts`) or backend API implementations unless explicitly requested by the user. This codebase is frontend-only.

### API Implementation Policy

**⚠️ CRITICAL: Skip API Implementation Until Explicitly Defined**

- **DO NOT** implement any API integration, API calls, or backend communication unless explicitly requested by the user
- **DO NOT** create API route handlers in `app/api/` directory
- **DO NOT** implement actual HTTP requests using axios, fetch, or any HTTP client
- **DO** use mock data for all features during initial development
- **DO** prepare feature-specific mock data in `lib/constants/mock-data/[feature-name].ts`
- **DO** structure code to make API integration easy when the time comes

This policy ensures frontend development can proceed independently without backend dependencies. API implementation will be added in a separate phase when explicitly requested.

### Mock Data Strategy

When building features without API implementation:

1. **Create Mock Data Files**: Place mock data in `lib/constants/mock-data/[feature-name].ts`
2. **Match Real Data Structure**: Ensure mock data matches the expected API response structure
3. **Realistic Data**: Use realistic, representative data for better testing
4. **Easy Swap**: Structure code so mock data can be easily replaced with API calls later
5. **Type Safety**: Define types that work for both mock and real data

Example mock data structure:

```typescript
// lib/constants/mock-data/clients.ts
import type { Client } from "@/features/clients/types";

export const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    // ... other fields
  },
];
```

### Layout Hierarchy

- Root layout (`app/layout.tsx`) - Wraps entire application
- Route group layouts - Shared layouts for route groups
- Nested layouts - Layouts that apply to specific route segments
- Template layouts - For animations and transitions

**IMPORTANT**: The main application layout (sidebar, navbar, main content wrapper) is defined once in the root or route group layout. DO NOT recreate layout components in every feature module. Features should only contain their content components, not layout wrappers.

### File Naming Conventions

- `page.tsx` - Route pages
- `layout.tsx` - Layouts
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI
- `route.ts` - Route handlers (API routes)
- `template.tsx` - Template components

### Code Organization

- **Colocation**: Keep related files close together
- **Feature-based structure**: Group by feature when appropriate
- **Shared components**: Place in `components/ui/` or `components/shared/`
- **Business logic**: Extract to custom hooks or server actions

### Performance Patterns

- **Streaming**: Use Suspense boundaries for progressive rendering
- **Parallel data fetching**: Fetch data in parallel when possible
- **Route prefetching**: Leverage Next.js automatic prefetching
- **Dynamic imports**: Use `next/dynamic` for code splitting
- **Image optimization**: Always use `next/image` component
- **Avoid useEffect**: Prefer Server Components and server functions over `useEffect` for data fetching and side effects when possible

### Metadata and SEO

- Export `metadata` object from layouts and pages
- Use `generateMetadata` for dynamic metadata
- Implement proper Open Graph and Twitter Card metadata
- Use `next/head` only in client components when needed
