# Emerald Frontend Codebase Analysis
**For AI Coding Agent Briefing on Business Entities Feature**

---

## 1. ROUTING PATTERN

### Dynamic Routes Structure
The app uses **Next.js App Router** with route groups and dynamic segments.

```
/app/(core)/records/clients/          → List page
/app/(core)/records/clients/[id]/     → Detail page
```

**Key Files:**
- [app/(core)/records/clients/page.tsx](app/(core)/records/clients/page.tsx) - Clients list (server component)
- [app/(core)/records/clients/[id]/page.tsx](app/(core)/records/clients/[id]/page.tsx) - Client detail (server component)

### Tab Navigation Implementation
Tabs are managed via **URL searchParams** (`?tab=overview`):

```tsx
// Detail page passes activeTab from searchParams
interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

// Tab component pushes new URL when tab changes
const handleTabChange = (value: string) => {
  router.push(`/records/clients/${client.id}?tab=${value}`);
};
```

**File:** [client-detail-tabs.tsx](features/records/clients/components/detail/client-detail-tabs.tsx)

---

## 2. CLIENT MODULE PATTERN (Reference for Business Entities)

### Module Structure
```
features/records/clients/
├── api/
│   └── clients-tab/
│       ├── client.ts      (client-side API + TanStack Query hooks)
│       ├── server.ts      (server-side API calls)
│       └── actions.ts     (server actions)
├── components/
│   ├── client-detail/
│   │   ├── client-detail-boundary.tsx       (prefetch boundary)
│   │   └── client-detail-content.tsx        (client component)
│   ├── client-form/
│   │   └── client-form-modal.tsx            (form with validation)
│   ├── clients-tab/
│   │   ├── clients-tab.tsx                  (main tab component)
│   │   ├── clients-grid.tsx                 (data table)
│   │   ├── clients-filters.tsx              (filter UI)
│   │   ├── client-list-header.tsx           (header with create button)
│   │   └── clients-boundary.tsx             (prefetch boundary)
│   ├── detail/
│   │   ├── client-detail-header.tsx         (org name, status badge)
│   │   ├── client-metric-cards.tsx          (KPI cards)
│   │   ├── client-detail-tabs.tsx           (tab navigation)
│   │   └── tabs/
│   │       ├── client-overview-tab.tsx
│   │       ├── client-providers-tab.tsx
│   │       ├── client-business-entities-tab.tsx
│   │       └── ... (more tabs)
│   └── client-pagination.tsx
├── hooks/
│   ├── use-clients.ts               (TanStack Query hooks)
│   ├── use-client-store.ts          (Zustand for modal state)
│   └── index.ts
├── types/
│   └── index.ts                     (Client, ClientListItem, ClientRequest, etc.)
├── validations/
│   └── schemas.ts                   (Zod schemas for forms)
└── utils/
    └── helpers.ts
```

### Client List Page
**File:** [app/(core)/records/clients/page.tsx](app/(core)/records/clients/page.tsx)

Server component that:
1. Parses URL searchParams (search, type, accountTier, portalAccess, sort, page, limit)
2. Wraps list in `ClientsBoundary` for prefetching
3. Renders `ClientsTab` with filters

```tsx
<Suspense fallback={<ClientsLoadingSkeleton />}>
  <ClientsBoundary request={filters}>
    <ClientsTab {...filters} />
  </ClientsBoundary>
</Suspense>
```

### Client Detail Page
**File:** [app/(core)/records/clients/[id]/page.tsx](app/(core)/records/clients/[id]/page.tsx)

```tsx
export default async function ClientDetailPage({
  params,
  searchParams,
}: Readonly<ClientDetailPageProps>) {
  const { id: clientId } = await params;
  const { tab: activeTab = 'overview' } = await searchParams;

  return (
    <ClientDetailBoundary clientId={clientId}>
      <ClientDetailContent clientId={clientId} activeTab={activeTab} />
    </ClientDetailBoundary>
  );
}
```

### State Preservation Pattern
**URL Parameters** are used for all state:
- Search, filters, sorting → stored in query string
- Active tab → `?tab=name`
- Pagination → `?page=1&limit=25`
- **No sessionStorage or manual persistence**

**File:** [use-search-params.ts](hooks/use-search-params.ts)

Example usage:
```tsx
const { updateParams } = useSearchParamsManager();
updateParams({ sort: newSort }); // Updates URL, triggers re-fetch
```

### Edit Modal Implementation
**File:** [client-form-modal.tsx](features/records/clients/components/client-form/client-form-modal.tsx)

- Uses **Zustand store** for modal state: `isFormModalOpen`, `editingClientId`
- `useClientStore` manages UI state only (NOT data)
- Form validates with Zod schema: `createClientSchema`
- Modal opens from header: `ClientListHeader` has "Create Client" button
- Edit triggered by: `useClientStore().openFormModal(clientId)`

**Store file:** [use-client-store.ts](features/records/clients/hooks/use-client-store.ts)

---

## 3. EXISTING COMPONENTS

### UI Component Library Location
**Path:** `components/ui/`

All are shadcn/ui components imported from Radix UI primitives:

| Component | File | Usage |
|-----------|------|-------|
| **Modal/Dialog** | `dialog.tsx` | Forms, confirmations |
| **Sheet** | `sheet.tsx` | Side panels |
| **Drawer** | `drawer.tsx` | Mobile-friendly side panels |
| **Tabs** | `tabs.tsx` | Tab navigation (like detail page tabs) |
| **Badge** | `badge.tsx` | Status, tier, type labels |
| **Card** | `card.tsx` | Container for grouped content |
| **Button** | `button.tsx` | Primary, secondary, ghost, destructive |
| **Table** | `table.tsx` | Data tables |
| **Alert** | `alert.tsx` | Error/warning messages |
| **Alert Dialog** | `alert-dialog.tsx` | Delete confirmations |
| **Delete Modal** | `delete-modal.tsx` | Pre-built delete modal |
| **Confirm Modal** | `confirm-modal.tsx` | Pre-built confirmation |
| **Form** | `form.tsx` | React Hook Form wrapper |
| **Input** | `input.tsx` | Text input |
| **Select** | `select.tsx` | Dropdown select |
| **Combobox** | `combobox.tsx` | Searchable select |
| **Checkbox** | `checkbox.tsx` | Checkboxes |
| **Date Picker** | `date-picker.tsx` | Calendar date input |
| **Textarea** | `textarea.tsx` | Multi-line text |
| **Pagination** | `pagination.tsx` | Pagination controls |
| **Skeleton** | `skeleton.tsx` | Loading placeholder |
| **Spinner** | `spinner.tsx` | Loading indicator |
| **Toast** | `sonner.tsx` | Toast notifications (Sonner) |
| **Tooltip** | `tooltip.tsx` | Hover tooltips |
| **Progress** | `progress.tsx` | Progress bars |
| **Avatar** | `avatar.tsx` | User/org avatars |

### Shared Components
**Path:** `components/shared/`

| Component | File | Purpose |
|-----------|------|---------|
| `PageHeader` | `page-header.tsx` | Page title + breadcrumb |
| `BackButton` | `back-button.tsx` | Back navigation |
| `GridPagination` | `grid-pagination.tsx` | Pagination for grids |
| `TablePagination` | `table-pagination.tsx` | Pagination for tables |
| `DebouncedSearchInput` | `debounced-search-input.tsx` | Search with debounce |
| `MultiSelectCombobox` | `multi-select-combobox.tsx` | Multi-select dropdown |
| `ConfirmDialog` | `confirm-dialog.tsx` | Confirmation dialog |
| `ErrorPage` | `error-page.tsx` | Error boundary component |
| `LoadingContent` | `loading-content.tsx` | Loading skeleton |

### Import Examples
```tsx
// UI Components
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Shared Components
import { PageHeader } from '@/components/shared/page-header';
import { TablePagination } from '@/components/shared/table-pagination';
```

---

## 4. API LAYER

### API Structure
**HTTP Client:** Centralized `apiClient` wrapper around native `fetch`

**Files:**
- [lib/api/client.ts](lib/api/client.ts) - Client-side API wrapper
- [lib/api/server.ts](lib/api/server.ts) - Server-side API wrapper (uses `fetchServer`)
- [lib/api/endpoints.ts](lib/api/endpoints.ts) - Endpoint constants
- [lib/api/types.ts](lib/api/types.ts) - API response types

### Fetch Methods
```typescript
import { apiClient } from "@/lib/api/client";
import { fetchServer } from "@/lib/api/server";

// Client-side (uses client.ts)
const response = await apiClient.get<ApiResponse<T>>(endpoint, { params });

// Server-side (uses server.ts)
const response = await fetchServer.get<ApiResponse<T>>(endpoint, { params });
```

### Authentication
**Token Management:**
- Cookies are automatically sent with requests
- Token refresh on 401: `refreshAccessToken()` from [lib/api/refresh-token.ts](lib/api/refresh-token.ts)
- Automatic retry after token refresh

```typescript
// In apiClient.request() - handles 401 automatically
if (response.status === 401 && !isRetry) {
  const newToken = await refreshAccessToken();
  if (newToken) {
    return this.request<T, Body>(endpoint, config, true);
  }
}
```

### TanStack Query Implementation

**Client Fetch:** [features/records/clients/api/clients-tab/client.ts](features/records/clients/api/clients-tab/client.ts)

```typescript
export async function getClientsListClient(request?: ClientRequest): Promise<ApiResponse<PaginatedResponse<ClientListItem>>> {
  const queryParams: Record<string, string> = {};
  
  if (request?.page) queryParams.page = String(request.page);
  if (request?.search) queryParams.search = String(request.search);
  if (request?.sort) queryParams.sort = String(request.sort);
  
  return await apiClient.get<ApiResponse<PaginatedResponse<ClientListItem>>>(
    API_ENDPOINTS.clients.list, 
    { params: queryParams }
  );
}

export function useClients(request?: ClientRequest) {
  return useQuery({
    queryKey: queryKeys.clients.list(request),
    queryFn: () => getClientsListClient(request),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

### Server Fetch
[features/records/clients/api/clients-tab/server.ts](features/records/clients/api/clients-tab/server.ts) - Same pattern but uses `fetchServer`

Used in Server Components and `ClientsBoundary` for prefetching.

### Query Keys
**File:** [lib/queries/query-keys.ts](lib/queries/query-keys.ts)

```typescript
export const queryKeys = {
  clients: {
    list: (request?: ClientRequest) => [..., "clients", "list", request],
    detail: (id: string) => [..., "clients", "detail", id],
    stats: () => [..., "clients", "stats"],
  },
  // ... more modules
};
```

### API Endpoints
**File:** [lib/api/endpoints.ts](lib/api/endpoints.ts)

```typescript
export const API_ENDPOINTS = {
  clients: {
    list: "/clients",
    detail: (id: string) => `/clients/${id}`,
    stats: "/clients/stats",
  },
  // ... 200+ endpoints
};
```

---

## 5. FORM PATTERN

### Form Stack
- **React Hook Form** for form state management
- **Zod** for schema validation + runtime type checking
- **@hookform/resolvers/zod** to bridge them

### Validation Schema Example
**File:** [features/records/clients/validations/schemas.ts](features/records/clients/validations/schemas.ts)

```typescript
import { z } from 'zod';

// Validation helpers
const TAX_ID_PATTERN = /^\d{2}-\d{7}$/;
const isValidTaxIdPrefix = (taxId: string): boolean => {
  // Custom validation logic
};

// Reusable contact schema
export const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().regex(PHONE_PATTERN).optional(),
});

// Main client schema
export const createClientSchema = z.object({
  organizationName: z.string().min(2).max(200),
  type: z.nativeEnum(ClientType),
  taxId: z.string()
    .regex(TAX_ID_PATTERN)
    .refine((val) => isValidTaxIdPrefix(val), { message: "..." }),
  mainEmail: z.string().email().optional().or(z.literal('')),
  primaryContact: contactSchema,
  billingContact: optionalContactSchema,
  // ... 20+ more fields
}).refine(
  (data) => {
    // Cross-field validation: end date > start date
    if (data.contractStartDate && data.contractEndDate) {
      return data.contractEndDate > data.contractStartDate;
    }
    return true;
  },
  { message: "Contract end date must be after start date" }
);

export type CreateClientFormData = z.infer<typeof createClientSchema>;
```

### Modal Form Example
**File:** [features/records/clients/components/client-form/client-form-modal.tsx](features/records/clients/components/client-form/client-form-modal.tsx)

```tsx
export function ClientFormModal() {
  const { isFormModalOpen, editingClientId, closeFormModal } = useClientStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with Zod schema
  const form = useForm({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      organizationName: '',
      type: ClientType.LARGE,
      taxId: '',
      mainEmail: '',
      primaryContact: { name: '', email: '' },
      // ... more fields
    },
  });

  const onSubmit = async (data: CreateClientFormData) => {
    try {
      setIsSubmitting(true);
      // TODO: Call API to create/update client
      await createClient(data);
      toast.success('Client created successfully');
      closeFormModal();
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.list() });
    } catch (error) {
      toast.error('Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isFormModalOpen} onOpenChange={closeFormModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingClientId ? 'Edit' : 'Create'} Client</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Organization Name Field */}
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Select Field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger />
                    </FormControl>
                    <SelectContent>
                      {Object.values(ClientType).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field with Mask */}
            <FormField
              control={form.control}
              name="mainPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Phone</FormLabel>
                  <FormControl>
                    <MaskedInput 
                      mask="(999) 999-9999"
                      placeholder="(123) 456-7890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nested Contact Object */}
            <fieldset className="space-y-4 border p-4 rounded">
              <legend className="font-semibold">Primary Contact</legend>
              <FormField
                control={form.control}
                name="primaryContact.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primaryContact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <DialogFooter>
              <Button variant="outline" onClick={closeFormModal}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### Key Form Features
✅ **Real-time validation** - Shows errors as user types
✅ **Custom validators** - Cross-field validation, regex patterns
✅ **Nested objects** - `primaryContact.name` path syntax
✅ **Conditional fields** - `optional().or(z.literal(''))`
✅ **Type-safe** - TypeScript inference from Zod schema
✅ **Field-level components** - `FormField` wrapper with `render` pattern

---

## 6. FOLDER STRUCTURE

### Top-Level
```
emerald_frontend/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Auth pages (login, forgot password)
│   ├── (core)/                   # Protected routes group
│   │   └── records/
│   │       ├── clients/          # CLIENT LIST & DETAIL PAGES
│   │       ├── business-entities/ # BUSINESS ENTITIES PAGES (USE AS MODEL)
│   │       ├── payers/
│   │       └── providers/
│   └── api/                      # API routes
├── features/                     # Feature modules (by domain)
│   ├── records/
│   │   ├── clients/              # CLIENT MODULE (USE AS REFERENCE)
│   │   ├── business-entities/    # BUSINESS ENTITIES MODULE
│   │   ├── payer/
│   │   └── ...
│   ├── settings/
│   ├── user-and-roles/
│   └── health/
├── components/                   # Shared React components
│   ├── ui/                       # shadcn/ui components (50+ components)
│   ├── shared/                   # Reusable components (pagination, search, etc)
│   ├── layout/                   # Layout components (sidebar, header)
│   └── providers/                # Context providers (QueryClientProvider, ThemeProvider)
├── hooks/                        # Custom hooks
│   ├── use-search-params.ts      # Search params management
│   ├── use-toast.ts              # Toast notifications
│   ├── use-mobile.ts             # Responsive hooks
│   └── ...
├── lib/                          # Core utilities & setup
│   ├── api/                      # API client, endpoints, types
│   ├── queries/                  # TanStack Query keys
│   ├── constants/                # App constants, mock data
│   ├── error/                    # Error handling
│   ├── helpers/                  # Utility functions
│   └── logger.ts                 # Logging utility
├── types/                        # Global type definitions
├── public/                       # Static assets
├── docs/                         # Documentation
└── devOps/                       # Docker, deployment configs
```

### Feature Module Structure (Standard Pattern)
Every feature in `features/` follows this structure:

```
features/records/clients/
├── api/
│   ├── clients-tab/
│   │   ├── client.ts            # Client-side API + hooks
│   │   ├── server.ts            # Server-side API
│   │   └── actions.ts           # Server actions
│   └── ... (more API groups)
├── components/
│   ├── client-detail/           # Detail page components
│   ├── client-form/             # Form components
│   ├── clients-tab/             # List page components
│   ├── detail/                  # Shared detail components
│   └── ... (more component groups)
├── hooks/
│   ├── use-client-store.ts      # Zustand stores
│   ├── use-clients.ts           # TanStack Query hooks
│   └── index.ts                 # Exports
├── types/
│   └── index.ts                 # TypeScript interfaces
├── validations/
│   └── schemas.ts               # Zod schemas
├── utils/
│   └── helpers.ts               # Utility functions
└── index.ts                     # Module exports
```

### App Routes Structure
```
app/(core)/records/
├── clients/
│   ├── page.tsx                 # /records/clients → List
│   ├── not-found.tsx            # 404 page
│   └── [id]/
│       ├── page.tsx             # /records/clients/[id] → Detail
│       └── not-found.tsx        # 404 page
├── business-entities/           # Same pattern as clients
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── payers/
└── providers/
```

### Naming Conventions

**Files:**
- Page files: `page.tsx` (routes)
- Components: `component-name.tsx` (PascalCase)
- Hooks: `use-hook-name.ts` (camelCase)
- Types: `index.ts` (centralized)
- Schemas: `schemas.ts`
- API functions: `client.ts`, `server.ts` (for client-side and server-side)
- Stores: `use-store-name.ts`

**Folders:**
- kebab-case: `client-detail`, `clients-tab`, `follow-up-rules`
- Feature folders: Feature domain name

**Functions:**
- Components: `PascalCase` (e.g., `ClientDetailTabs`)
- Hooks: `use` prefix (e.g., `useClients`)
- Utilities: `camelCase` (e.g., `getTierBadgeClass`)

---

## 7. KEY ARCHITECTURAL PATTERNS

### Server vs Client Components
```
app/(core)/records/clients/page.tsx        → Server Component
  └─ features/.../clients-boundary.tsx    → Server Component (prefetch)
      └─ features/.../clients-tab.tsx     → Client Component ("use client")
          ├─ ClientListHeader              → Client Component
          ├─ ClientsFilters                → Client Component
          └─ ClientsGrid                   → Client Component
```

**Rule:** Keep data fetching in Server Components, rendering in Client Components.

### Data Flow
1. Server component receives searchParams
2. Passes to `ClientsBoundary` (prefetches data)
3. `ClientsTab` renders with TanStack Query (uses prefetched data)
4. User actions (sort, filter) → Update URL params
5. URL change → Server component re-executes → New data → UI updates

### State Management
- **URL**: Filters, sorting, pagination, active tab
- **TanStack Query**: API response caching
- **Zustand** (`useClientStore`): Modal open/close state ONLY
- **React Hook Form**: Form state during editing
- **No Redux, no Context API for data**

### Prefetching Pattern
```tsx
// Server component (boundary)
export async function ClientsBoundary({ request }: Props) {
  const data = await getClientsListServer(request); // Prefetch
  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.clients.list(request),
    data
  );
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientsTab {...request} /> {/* Uses prefetched data */}
    </HydrationBoundary>
  );
}
```

---

## 8. TOAST NOTIFICATIONS

**Library:** Sonner

```tsx
import { toast } from 'sonner';

// Usage
toast.success('Client created successfully');
toast.error('Failed to create client');
toast.loading('Saving...');
toast.promise(promise, {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed',
});
```

---

## 9. DEVELOPMENT SETUP

### Scripts
```bash
pnpm dev              # Development server (localhost:3000)
pnpm build            # Production build
pnpm start            # Production server
pnpm lint             # ESLint check
pnpm lint:fix         # Fix linting issues
pnpm typecheck        # TypeScript check (tsc --noEmit)
pnpm test             # Jest tests
pnpm test:watch      # Jest watch mode
```

### Environment Variables
```
NEXT_PUBLIC_API_URL=<backend-api-url>
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Package Manager
- **pnpm** (monorepo-capable)
- **pnpm-workspace.yaml** present (monorepo setup)

---

## 10. CRITICAL PATTERNS FOR BUSINESS ENTITIES FEATURE

### Following the Client Module Pattern:
1. ✅ Create `features/records/business-entities/` folder
2. ✅ Create `api/` with `client.ts`, `server.ts` using TanStack Query
3. ✅ Create `components/` with list grid, detail tabs, form modal
4. ✅ Create `hooks/` with `useBusinessEntities()`, `useBusinessEntityStore()`
5. ✅ Create `types/index.ts` with TypeScript interfaces
6. ✅ Create `validations/schemas.ts` with Zod schemas
7. ✅ Use URL params for state (NOT sessionStorage)
8. ✅ Use Zustand ONLY for modal open/close state
9. ✅ Render lists with `clients-grid` pattern
10. ✅ Detail page with tabs using `?tab=` URL params
11. ✅ Forms with React Hook Form + Zod validation
12. ✅ Modals for create/edit using Dialog component

### Copy From Clients:
- Form modal structure: `client-form-modal.tsx`
- Detail page layout: `client-detail-tabs.tsx`
- List page: `clients-grid.tsx` with sorting/pagination
- API setup: `api/clients-tab/client.ts` pattern
- Validation: `validations/schemas.ts` pattern

---

## 11. COMPONENT USAGE EXAMPLES

### Badge with Status
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant={getStatusVariant(status)}>
  {status}
</Badge>
```

### Data Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs value={activeTab} onValueChange={handleTabChange}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Modal Form Dialog
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Form Title</DialogTitle>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

---

## 12. API REQUEST EXAMPLE (Complete Flow)

### Step 1: Define Schema
```typescript
// features/records/clients/validations/schemas.ts
export const createClientSchema = z.object({
  organizationName: z.string().min(2),
  email: z.string().email(),
  // ...
});
```

### Step 2: Create Types
```typescript
// features/records/clients/types/index.ts
export interface ClientListItem {
  id: string;
  organizationName: string;
  type: ClientType;
  // ...
}

export interface ClientRequest {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
```

### Step 3: API Functions
```typescript
// features/records/clients/api/clients-tab/client.ts
export async function getClientsListClient(request?: ClientRequest) {
  const queryParams = { ...request };
  return await apiClient.get<ApiResponse<PaginatedResponse<ClientListItem>>>(
    API_ENDPOINTS.clients.list,
    { params: queryParams }
  );
}

export function useClients(request?: ClientRequest) {
  return useQuery({
    queryKey: queryKeys.clients.list(request),
    queryFn: () => getClientsListClient(request),
    staleTime: 1000 * 60 * 5,
  });
}
```

### Step 4: Use in Component
```typescript
// components/clients-tab/clients-grid.tsx
export function ClientsGrid(request?: ClientRequest) {
  const { data: clientsResponse, isLoading } = useClients(request);
  
  return (
    <Table>
      <TableBody>
        {clientsResponse?.data?.items.map(client => (
          <TableRow key={client.id}>
            <TableCell>{client.organizationName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## 13. IMPORTANT FILES FOR REFERENCE

| Task | Reference Files |
|------|-----------------|
| Create a new feature module | [features/records/clients/](features/records/clients/) |
| List page with filtering/sorting | [app/(core)/records/clients/page.tsx](app/(core)/records/clients/page.tsx), [clients-grid.tsx](features/records/clients/components/clients-tab/clients-grid.tsx) |
| Detail page with tabs | [app/(core)/records/clients/[id]/page.tsx](app/(core)/records/clients/[id]/page.tsx), [client-detail-tabs.tsx](features/records/clients/components/detail/client-detail-tabs.tsx) |
| Form modal with validation | [client-form-modal.tsx](features/records/clients/components/client-form/client-form-modal.tsx) |
| Zod validation schemas | [features/records/clients/validations/schemas.ts](features/records/clients/validations/schemas.ts) |
| TanStack Query setup | [features/records/clients/api/clients-tab/client.ts](features/records/clients/api/clients-tab/client.ts) |
| Zustand store | [use-client-store.ts](features/records/clients/hooks/use-client-store.ts) |
| Query keys | [lib/queries/query-keys.ts](lib/queries/query-keys.ts) |
| API endpoints | [lib/api/endpoints.ts](lib/api/endpoints.ts) |
| API client setup | [lib/api/client.ts](lib/api/client.ts) |
| Shared UI components | [components/ui/](components/ui/) |
| Shared utility components | [components/shared/](components/shared/) |

---

## 14. READY FOR AI AGENT BRIEFING

This analysis provides:
✅ Complete folder structure with exact paths
✅ Real code examples from the Client module
✅ API layer understanding (TanStack Query + Zod)
✅ Form validation patterns
✅ Component library (50+ UI components available)
✅ State management approach (URL params + Zustand)
✅ Tab navigation pattern
✅ Modal/form implementation
✅ Server/client component strategy
✅ File naming conventions

**Use the Client module as a 1:1 reference for implementing Business Entities feature.**
