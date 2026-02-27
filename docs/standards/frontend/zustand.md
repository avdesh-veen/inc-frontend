## Zustand State Management Standards

### Store Structure

#### Store Organization

- Create stores in `stores/` directory
- One store per domain/feature
- Use TypeScript for type safety
- Export typed hooks for consumption
- Define interfaces for store state and actions

### Middleware Usage

#### DevTools Middleware

- Always use `devtools` middleware in development
- Provide meaningful store names for debugging
- Wrap with `__DEV__` check if needed

#### Persist Middleware

- Use for state that should survive page reloads
- Configure storage (localStorage, sessionStorage, or custom)
- Use `partialize` to persist only specific fields
- Set appropriate storage key names

#### Immer Middleware (Optional)

- Use `immer` middleware for complex state updates
- Simplifies immutable updates with mutable syntax

### Selectors and Performance

#### Selective Subscriptions

- Always use selectors to prevent unnecessary re-renders
- Subscribe only to specific fields, not entire store
- Use function selectors: `useStore((state) => state.field)`

#### Computed Values

- Use selectors for computed/derived values
- Calculate values in selectors rather than storing them

#### Shallow Comparison

- Use `shallow` from `zustand/shallow` for object comparisons
- Prevents re-renders when object reference changes but values don't

### State Management Guidelines

#### When to Use Zustand

- **UI Component State**: Sidebar open/closed, modal visibility, drawer state
- **Component Selections**: Selected items, active tabs, expanded sections
- **Temporary UI State**: Temporary selections, UI preferences
- **Global UI Controls**: Theme preferences, sidebar collapsed state

**⚠️ IMPORTANT**: DO NOT use Zustand for data storage, filtering, or sorting logic. These will be handled by API implementation later.

#### When NOT to Use Zustand

- **Server State**: Use TanStack Query instead - DO NOT store fetched data in Zustand
- **Data Filtering/Sorting**: Will be handled by API parameters - DO NOT implement in Zustand
- **Form State**: Use React Hook Form
- **URL State**: Use Next.js router or search params
- **Component-local State**: Use `useState` for truly local state
- **Data Storage**: Never use Zustand as a data cache or storage layer

#### Zustand Usage Policy

Zustand stores should ONLY be used for:

1. **Modal/Dialog State**: Opening and closing modals, dialogs, drawers
2. **UI Component State**: Sidebar visibility, panel expansion, tab selection
3. **Temporary Selections**: Selected rows in a table (for UI actions, not data filtering)
4. **Global UI Preferences**: Theme, language, layout preferences

Zustand stores should NEVER be used for:

1. **Data Storage**: Fetched data from APIs
2. **Filtering Logic**: Filter states that affect data queries
3. **Sorting Logic**: Sort states that affect data queries
4. **Pagination State**: Page numbers, page sizes (use URL params instead)
5. **Search State**: Search queries (use URL params instead)

### Modal and Sidebar Control Pattern

#### Feature-Level Store for Modals

Create Zustand stores at the feature level to control modals and sidebars:

```typescript
// features/clients/hooks/use-client-store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ClientStore {
  // Modal states
  isFormModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // Sidebar states
  isDetailSidebarOpen: boolean;

  // Actions
  openFormModal: () => void;
  closeFormModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  openDetailSidebar: () => void;
  closeDetailSidebar: () => void;
}

export const useClientStore = create<ClientStore>()(
  devtools(
    (set) => ({
      isFormModalOpen: false,
      isDeleteModalOpen: false,
      isDetailSidebarOpen: false,

      openFormModal: () => set({ isFormModalOpen: true }),
      closeFormModal: () => set({ isFormModalOpen: false }),
      openDeleteModal: () => set({ isDeleteModalOpen: true }),
      closeDeleteModal: () => set({ isDeleteModalOpen: false }),
      openDetailSidebar: () => set({ isDetailSidebarOpen: true }),
      closeDetailSidebar: () => set({ isDetailSidebarOpen: false }),
    }),
    { name: "client-store" },
  ),
);
```

#### Import Modals Once in Layout

```typescript
// app/(core)/clients/layout.tsx
import { ClientFormModal } from '@/features/clients/components/client-form-modal';
import { ClientDeleteModal } from '@/features/clients/components/client-delete-modal';

export default function ClientsLayout({ children }) {
  return (
    <>
      {children}
      <ClientFormModal />
      <ClientDeleteModal />
    </>
  );
}
```

### Store Composition

#### Combining Stores

- Keep stores independent
- Use selectors to combine data from multiple stores
- Avoid cross-store dependencies

#### Store Slicing (Advanced)

- Use `slice` pattern for large stores
- Create separate slice functions for different concerns
- Compose slices in main store

### TypeScript Best Practices

#### Type Safety

- Always define interfaces for store state
- Use `create<T>()()` syntax for better type inference
- Export types for use in components
- Type all actions and state properties

#### Type Guards

- Use type guards for runtime type checking when needed

### Testing

- Test stores in isolation
- Mock stores in component tests
- Test state transitions and actions
- Test middleware behavior (persist, devtools)

### Migration from Other State Managers

- Keep stores small and focused
- Migrate incrementally
- Use selectors to maintain component compatibility
