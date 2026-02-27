## TanStack Query (React Query) Standards

### Setup and Configuration

#### QueryClient Provider

- Wrap application in `QueryClientProvider` at root layout
- Configure default options for all queries (staleTime, gcTime, retry, refetchOnWindowFocus, refetchOnReconnect)
- Set appropriate defaults based on application needs

### Query Key Management

#### Centralized Query Keys

- Create a constants file for all query keys in `lib/queries/query-keys.ts`
- Use hierarchical key structure (all → lists → list → details → detail)
- Include all parameters that affect the query in the key
- Use `as const` for type safety

#### Query Key Factory Pattern

Define query key factories that accept optional request params for pagination/filtering:

```typescript
// lib/queries/query-keys.ts
export const queryKeys = {
  feature: {
    all: () => ['feature'] as const,
    list: (request?: Record<string, unknown>) =>
      request ? [...queryKeys.feature.all(), 'list', request] as const
              : [...queryKeys.feature.all(), 'list'] as const,
    detail: (id: string) => [...queryKeys.feature.all(), 'detail', id] as const,
    dropdownA: () => [...queryKeys.feature.all(), 'dropdownA'] as const,
  },
};
```

**Key points:**
- `list()` without args returns base key — used for `invalidateQueries` to invalidate all pages
- `list({ page: 1, limit: 10 })` returns specific key — used for `prefetchQuery` and `useQuery`
- Dropdown keys are separate since they have different staleTime and don't paginate the same way

### Query Hooks

#### Best Practices

- Always use custom hooks - Never use `useQuery` directly in components
- Type safety - Properly type query functions and responses
- Error handling - Handle errors at the hook level or component level
- Loading states - Use `isLoading` for initial load, `isFetching` for background refetch
- Placeholder data - Use `placeholderData` for optimistic UI updates
- Conditional fetching - Use `enabled` option for dependent queries

### Mutation Hooks

#### Create/Update Mutation Pattern (ApiResponse)

Mutations for create and update operations should follow this pattern:

```typescript
export function useCreateEntity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<ApiResponse<Entity | undefined>, Error, EntityFormData>({
    mutationFn: async (formData) => {
      const result = await createEntityAction(formData);
      if (!result.status) {
        throw new Error(
          Array.isArray(result.message) ? result.message.join(', ') : result.message
        );
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: featureKeys.list() }); // no params = invalidate all pages
      toast({
        title: 'Entity created successfully',
        description: Array.isArray(data.message) ? data.message.join(', ') : data.message,
      });
    },
    onError: (error) => {
      logger(String(error), { error });
      toast({ title: 'Failed to create entity', description: error.message, variant: 'destructive' });
    },
  });
}
```

**Key points:**
- Return type is `ApiResponse<Entity | undefined>` — preserves API message for display
- `mutationFn` checks `result.status` and throws with API message on failure
- `onSuccess` uses `data.message` from API response for the toast
- `onError` uses `error.message` (which was set from `result.message`) for the error toast
- Invalidate with base key `list()` (no params) to invalidate all paginated pages
- Modal uses `mutateAsync` + `.then(() => handleClose())` — errors propagate to hook's `onError`

#### Delete Mutation Pattern (ActionResult)

Delete operations use the simpler `ActionResult` pattern since they don't return entity data:

```typescript
export function useDeleteEntity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const result = await deleteEntityAction(id);
      if (!result.success) throw new Error(result.error ?? 'Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKeys.list() });
      toast({ title: 'Entity deleted', description: 'Entity has been deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    },
  });
}
```

#### Mutation Best Practices

- Optimistic updates - Use `onMutate` for optimistic UI updates
- Error rollback - Use `onError` to rollback optimistic updates
- Cache invalidation - Invalidate related queries after mutations
- Selective updates - Prefer `setQueryData` over `invalidateQueries` when possible
- Handle errors - Use `onError` callback for error handling (toast, logging, etc.)

### Advanced Patterns

#### Infinite Queries

- Use `useInfiniteQuery` for paginated data
- Configure `getNextPageParam` to determine next page
- Set `initialPageParam` for first page

#### Parallel Queries

- Use `useQueries` for dynamic parallel queries
- Use multiple `useQuery` hooks for static parallel queries

#### Dependent Queries

- Use `enabled` option to make queries dependent on other queries
- Ensure parent query data exists before enabling dependent query

### Error Handling

#### Query Error Handling

- Use `error` object from query hooks
- Implement error boundaries for critical errors
- Show user-friendly error messages
- Provide retry mechanisms

#### Global Error Handling

- Configure `onError` in QueryClient for global error handling
- Use React Error Boundaries for component-level errors

### Performance Optimization

#### Query Options

- **staleTime**: How long data is considered fresh
- **gcTime**: How long unused data stays in cache (formerly cacheTime)
- **refetchOnWindowFocus**: Control refetching on window focus
- **refetchOnReconnect**: Refetch when network reconnects

#### Selective Refetching

- Use `refetchType` to control what gets refetched
- Use `queryClient.refetchQueries()` for manual refetching

### Server Components Integration

#### Prefetching in Server Components (Boundary Pattern)

Every feature page that fetches data must use a **Boundary** server component to prefetch data before hydrating client components.

```typescript
// features/[feature]/components/feature-boundary.tsx
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';
import { getEntitiesServer } from '@/features/[feature]/api/server';
import { getDropdownServer } from '@/features/[feature]/api/server';

const DEFAULT_REQUEST = { page: 1, limit: 10 };
const DROPDOWN_REQUEST = { page: 1, limit: 100 };

export async function FeatureBoundary({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  await Promise.all([
    // Prefetch main paginated list
    queryClient.prefetchQuery({
      queryKey: queryKeys.feature.list(DEFAULT_REQUEST),
      queryFn: () => getEntitiesServer(DEFAULT_REQUEST),
    }),
    // Prefetch dropdown data used in modals (fetch all with high limit)
    queryClient.prefetchQuery({
      queryKey: queryKeys.feature.dropdownA(),
      queryFn: () => getDropdownServer(DROPDOWN_REQUEST),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
```

**Key points:**
- Boundary is a **Server Component** (no `'use client'`)
- Use `Promise.all` to prefetch all queries in parallel
- Paginated lists use default `{ page: 1, limit: 10 }`
- Dropdown data for modals uses `{ page: 1, limit: 100 }` to fetch all options
- Client-side hooks will pick up pre-filled cache automatically (same query key)

#### Dual API Layer (Server + Client)

Each feature needs **two** fetch files with matching functions:

| File | Used by | Runs on |
|------|---------|---------|
| `api/[feature]/server.ts` | Boundary prefetch | Server (uses `fetchServer`) |
| `api/[feature]/client.ts` | TanStack Query hooks | Client (uses `fetchClient`) |

Both return the same `ApiResponse<PaginatedResponse<Entity>>` type. The query key must match between prefetch and hook so the cache is shared.

### Testing

- Mock QueryClient in tests
- Use `@tanstack/react-query-testing` utilities
- Test loading, success, and error states
