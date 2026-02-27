## Component Standards

### Component Structure

#### File Organization

- One component per file
- Co-locate related files (types, styles, tests)
- Use kebab-case for component file names: `user-profile.tsx` (component name in PascalCase: `UserProfile`)
- Use kebab-case for directories: `user-profile/`

#### Component Template

- Add `'use client'` directive only when needed
- Import types from React when extending component props
- Use `cn()` utility for conditional class merging
- Extend `ComponentProps` for HTML element props
- Provide sensible default values for optional props
- Spread remaining props to allow flexibility

### Server vs Client Components

#### Server Components (Default)

- Use Server Components by default
- No "use client" directive needed
- Can directly use async/await
- Can access server-side APIs
- Cannot use hooks or browser APIs

#### Client Components

- Add "use client" directive at top of file
- Use for interactivity, hooks, browser APIs
- Keep client boundaries minimal
- Pass Server Components as children

#### Composition Pattern

- Fetch data in Server Components
- Pass data as props to Client Components
- Keep Server Components at the top of the tree
- Minimize client component boundaries

### Component Patterns

#### Single Responsibility

- Each component should have one clear purpose
- Extract complex logic to custom hooks
- Keep components focused and testable

#### Composition over Configuration

- Prefer composition with children over many props
- Use compound components pattern (Card with CardHeader, CardContent, etc.)
- Avoid boolean flags for showing/hiding parts

#### Props Interface

- Define explicit prop interfaces
- Use TypeScript for type safety
- Extend HTML element props when appropriate
- Provide sensible defaults

#### Children Pattern

- Accept `React.ReactNode` for children prop
- Allow `className` prop for styling flexibility
- Use `cn()` utility to merge classes

### Component Organization

#### Component Categories

- **UI Components** (`components/ui/`) - shadcn/ui components
- **Feature Components** (`features/[feature]/components/`) - Feature-specific components
- **Layout Components** (`components/layout/`) - Layout-related components (sidebar, navbar, main wrapper)
- **Shared Components** (`components/shared/`) - Reusable across features

**IMPORTANT**: Layout components (sidebar, navbar, main content wrapper) are defined once in the application layout and should NOT be recreated in feature modules. Features should focus on their content components only.

#### Component Hierarchy

- Organize by feature when components are feature-specific
- Keep shared components at top level
- Group related components in subdirectories

### Hooks Usage

#### Custom Hooks

- Extract reusable logic to custom hooks
- Use `use` prefix: `useUserData`, `useAuth`
- Keep hooks focused on single concern
- Return objects, not arrays (for named destructuring)

#### Hook Order

1. Routing hooks (useRouter, usePathname)
2. Context hooks (useTheme, etc.)
3. State hooks (useState, useReducer)
4. TanStack Query hooks
5. Zustand hooks
6. Custom hooks
7. Derived state (useMemo)
8. Effects (useEffect) - **Use sparingly, prefer Server Components**
9. Event handlers

#### useEffect Guidelines

- **Avoid when possible**: Prefer Server Components and server functions over `useEffect`
- **Not for data fetching**: Use TanStack Query or Server Components instead
- **Valid use cases only**:
  - Browser API interactions (localStorage, window events)
  - Third-party library initialization
  - DOM measurements and animations
  - WebSocket connections
- **Keep effects minimal**: Extract complex logic to separate functions

### Performance Optimization

#### Memoization

- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Use `React.memo` for component memoization
- Only memoize when there's a performance benefit

#### Code Splitting

- Use `next/dynamic` for code splitting
- Provide loading component for dynamic imports
- Disable SSR when needed with `ssr: false`

### Error Handling

#### Error Boundaries

- Use error boundaries for component error handling
- Create error boundary components
- Provide fallback UI

#### Error States

- Handle loading, error, and empty states
- Use early returns for different states
- Provide meaningful error messages

### Accessibility

#### Semantic HTML

- Use semantic HTML elements
- Proper heading hierarchy (h1-h6)
- Use ARIA attributes when needed
- Associate labels with form inputs

#### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Provide visible focus indicators
- Handle keyboard events appropriately

### TypeScript Best Practices

#### Type Definitions

- Define prop types with interfaces
- Use `type` for unions and intersections
- Export types from component files
- Use generic types for reusable components

#### Type Safety

- Use strict typing for props
- Avoid `any` type
- Use proper null/undefined handling
- Leverage TypeScript's type inference

#### Read-Only Props (MANDATORY)

All component props MUST be wrapped with `Readonly<>` to prevent accidental mutations (SonarQube enforced).

```typescript
// ✅ Correct
function Card({ title }: Readonly<{ title: string }>) { ... }
function Card({ title }: Readonly<CardProps>) { ... }

// ❌ Wrong
function Card({ title }: { title: string }) { ... }
```

**Apply when:** Writing new components, refactoring, or fixing components missing `Readonly<>`

### Data Tables and Grids Pattern

**⚠️ CRITICAL: Never use plain `<div>` and `<span>` elements to create table-like layouts**

#### Use shadcn/ui Table Components

Always use the proper shadcn/ui Table components for displaying tabular data. This ensures semantic HTML, accessibility, and consistent styling.

**Required Components:**

- `Table` - Main table wrapper
- `TableHeader` - Table header section
- `TableBody` - Table body section
- `TableRow` - Table row
- `TableHead` - Header cell
- `TableCell` - Data cell
- `TableCaption` - Optional table caption for accessibility

#### Table Implementation Guidelines

1. **Import Components**: Import all required Table components from `@/components/ui/table`
2. **Wrap in Border Container**: Use `<div className="rounded-md border">` to wrap the table
3. **Structure**: Always follow Table → TableHeader → TableBody structure
4. **Headers**: Use `TableHead` for all column headers in `TableHeader`
5. **Data Rows**: Map data in `TableBody` using `TableRow` and `TableCell`
6. **Empty State**: Show centered message in a single `TableRow` with `colSpan` when no data
7. **Row Keys**: Always provide unique `key` prop for mapped rows

#### Pagination Pattern

1. **Import Components**: Import Pagination components from `@/components/ui/pagination`
2. **Required Components**: Use `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`
3. **Disable States**: Disable Previous on first page and Next on last page using `aria-disabled` and opacity classes
4. **Active State**: Use `isActive` prop on `PaginationLink` for current page
5. **Click Handlers**: Implement `onPageChange` callback for page navigation

#### Advanced Table Features

**Sortable Columns:**

- Use Button with `variant="ghost"` inside `TableHead`
- Include sort icon (ArrowUpDown from lucide-react or Hugeicons)
- Implement `handleSort` function for column sorting

**Selectable Rows:**

- Add Checkbox component in first `TableCell` of each row
- Track selected rows in state
- Provide descriptive `aria-label` for accessibility

**Empty State:**

- Use single `TableRow` with `colSpan` matching total columns
- Center content with flex layout
- Include helpful message and optional action button

#### Table Best Practices

1. **Semantic HTML**: Always use proper table elements via shadcn/ui components
2. **Accessibility**:
   - Use `TableCaption` for screen readers
   - Provide `aria-label` for action buttons
   - Use proper heading scope
3. **Responsive Design**: Wrap tables in scrollable containers for mobile
4. **Loading States**: Show skeleton loaders during data fetching
5. **Empty States**: Always handle empty data gracefully
6. **Row Keys**: Always provide unique `key` prop for rows

**❌ NEVER DO THIS:**

```typescript
// DON'T use div/span for tables
<div className="grid grid-cols-4">
  <span>Header 1</span>
  <span>Header 2</span>
</div>
```

**✅ ALWAYS DO THIS:**

```typescript
// DO use proper Table components
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header 1</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell 1</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Forms Pattern

**⚠️ CRITICAL: Always use React Hook Form with shadcn/ui Form components**

#### Required Form Components

Use shadcn/ui form components for all form implementations:

- `Form` - Form wrapper with React Hook Form context
- `FormField` - Individual field wrapper with validation
- `FormItem` - Field container
- `FormLabel` - Field label
- `FormControl` - Input control wrapper
- `FormDescription` - Optional field description
- `FormMessage` - Validation error message

#### Form Implementation Guidelines

1. **Add 'use client' Directive**: Forms require client-side interactivity
2. **Define Zod Schema**: Create validation schema in `features/[feature]/validations/schemas.ts`
3. **Infer Types**: Use `z.infer<typeof schema>` for TypeScript types
4. **Initialize useForm**: Use `useForm` hook with `zodResolver` and default values
5. **Wrap with Form Component**: Spread form props to `<Form {...form}>`
6. **Use FormField Pattern**: Each field uses `FormField` with render prop pattern
7. **Spread Field Props**: Always spread `{...field}` to input components
8. **Handle Submission**: Use `form.handleSubmit(onSubmit)` on form element

#### Common Form Input Types

**Text Input:**

- Use `Input` component from shadcn/ui
- Wrap in `FormControl` inside `FormField` render function
- Add `FormLabel`, `FormDescription` (optional), and `FormMessage`

**Select Dropdown:**

- Use `Select` component with `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- Use `onValueChange={field.onChange}` and `defaultValue={field.value}`
- Wrap `SelectTrigger` in `FormControl`

**Textarea:**

- Use `Textarea` component for multi-line input
- Add `className="resize-none"` to prevent resizing if needed

**Combobox (Searchable Select) - Preferred for Dropdowns:**

- Use `Combobox` component for searchable dropdowns with many options
- Import from `@/components/ui/combobox`: `Combobox`, `ComboboxInput`, `ComboboxContent`, `ComboboxList`, `ComboboxItem`, `ComboboxEmpty`
- Use `items` prop with array of options
- Use `itemToStringValue` for object items to enable search
- Use `value` and `onValueChange` for controlled behavior
- Use `showClear` prop on `ComboboxInput` to enable clear button
- **Form + validation:** When wiring to React Hook Form, use `value={field.value ?? ""}` and `onValueChange={(item) => field.onChange(item?.value ?? "")}` so the cleared state (backspace or clear icon) is stored as empty string, not `null`. This avoids Zod errors like "expected string, received null" and keeps validation messages correct (e.g. "Role is required").

```tsx
<Combobox<OptionItem>
  items={options}
  itemToStringValue={(item) => item?.label ?? ""}
  value={findOption(options, field.value ?? "")}
  onValueChange={(item) => field.onChange(item?.value ?? "")}
>
  <ComboboxInput placeholder="Select..." showClear={!!field.value} />
  <ComboboxContent>
    <ComboboxEmpty>No results found</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item.value} value={item}>
          {item.label}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

**Multi-Select Combobox (for array fields like `clientIds`, `payerIds`):**

Use `MultiSelectCombobox` from `@/components/shared/multi-select-combobox` for fields that accept multiple selections:

```tsx
import { MultiSelectCombobox, type MultiSelectOption } from '@/components/shared/multi-select-combobox';

// Transform API data to MultiSelectOption format
const options: MultiSelectOption[] = useMemo(
  () => items.map((item) => ({ value: item.id, label: item.name })),
  [items],
);

// Inside FormField render for an array field (e.g. z.array(z.string()))
<FormField
  control={form.control}
  name="itemIds"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Items</FormLabel>
      <FormControl>
        <MultiSelectCombobox
          options={options}
          value={field.value}
          onChange={field.onChange}
          placeholder={isLoading ? 'Loading...' : 'Select items...'}
          emptyMessage={isLoading ? 'Loading...' : 'No items found'}
          disabled={isLoading}
          error={!!fieldState.error}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**When to use Combobox vs MultiSelectCombobox vs Select:**

- Use **Combobox** for: Single-select with 5+ options, searchable, clearable, API-driven data
- Use **MultiSelectCombobox** for: Multi-select array fields (chips display), API-driven data
- Use **Select** for: Small static lists (2-4 options), simple status/enum fields

**Checkbox:**

- Use `Checkbox` component with `checked` and `onCheckedChange`
- Use flex layout: `className="flex flex-row items-start space-x-3 space-y-0"`
- Place label and description in separate div

**Radio Group:**

- Use `RadioGroup` with multiple `RadioGroupItem` components
- Each option wrapped in `FormItem` with flex layout
- Use `onValueChange` for RadioGroup and `value` for individual items

**Date Picker:**

- Use `Calendar` component inside `Popover`
- Trigger with Button styled as input
- Use `format` from date-fns to display selected date
- Handle `onSelect` to update field value

#### Form Best Practices

1. **Zod Validation**: Always define schemas in feature's `validations/schemas.ts`
2. **Type Safety**: Use `z.infer<typeof schema>` for form value types
3. **Default Values**: Always provide default values to prevent uncontrolled inputs
4. **Loading States**: Disable submit button with `disabled={form.formState.isSubmitting}`
5. **Error Handling**: Display form-level errors above the form
6. **Accessibility**:
   - Use proper labels for all inputs
   - Provide helpful error messages via `FormMessage`
   - Use `FormDescription` for additional context
7. **Reset Functionality**: Provide reset button with `form.reset()`
8. **Validation**: Use `resolver: zodResolver(schema)` for automatic validation

**❌ NEVER DO THIS:**

```typescript
// DON'T use plain HTML inputs
<input type="text" onChange={(e) => setName(e.target.value)} />
```

**✅ ALWAYS DO THIS:**

```typescript
// DO use FormField with shadcn/ui components
<FormField control={form.control} name="name" render={({ field }) => (
  <FormItem>
    <FormLabel>Name</FormLabel>
    <FormControl><Input {...field} /></FormControl>
    <FormMessage />
  </FormItem>
)} />
```

#### Form Layout Patterns

**Two-column Responsive Layout:**

- Use `grid grid-cols-1 md:grid-cols-2` for responsive columns
- Add `gap-6` for spacing between fields
- Full-width fields outside the grid for addresses, descriptions

**Section Grouping:**

- Group related fields under section headings (`<h3>`)
- Use `space-y-4` or `space-y-6` for vertical spacing
- Separate sections with `space-y-8` on form container

**Button Placement:**

- Place action buttons at the end of form
- Use `flex justify-end gap-2` for right-aligned buttons
- Include Cancel/Reset and Submit buttons

### Modal Pattern (Add/Edit)

#### Props-Controlled Modal with Local State

Modals are controlled via **local `useState`** in the parent Section component — not Zustand. The same modal component handles both Add and Edit modes.

#### Modal Props Interface

```typescript
interface AddEntityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: Entity | null; // null = Add mode, object = Edit mode
}
```

#### Parent Section State Management

```typescript
const [modalOpen, setModalOpen] = useState(false);
const [editingEntity, setEditingEntity] = useState<Entity | null>(null);

const handleAdd = () => {
  setEditingEntity(null);
  setModalOpen(true);
};

const handleEdit = (entity: Entity) => {
  setEditingEntity(entity);
  setModalOpen(true);
};

const handleModalChange = (open: boolean) => {
  setModalOpen(open);
  if (!open) setEditingEntity(null);
};

// In JSX:
<AddEntityModal open={modalOpen} onOpenChange={handleModalChange} entity={editingEntity} />
```

#### Modal Internal Pattern

```typescript
export function AddEntityModal({ open, onOpenChange, entity }: Readonly<AddEntityModalProps>) {
  const { mutateAsync: createEntity, isPending: isCreating } = useCreateEntity();
  const { mutateAsync: updateEntity, isPending: isUpdating } = useUpdateEntity();
  const isEditMode = !!entity;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (entity) {
      form.reset({ /* map entity fields to form values */ });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const onSubmit = (data: FormValues) => {
    if (isEditMode) {
      const changedData = getChangedFields(data);
      if (Object.keys(changedData).length === 0) { handleClose(); return; }
      updateEntity({ id: entity.id, data: changedData }).then(() => handleClose());
    } else {
      createEntity(data).then(() => handleClose());
    }
  };

  const handleClose = () => { form.reset(DEFAULT_VALUES); onOpenChange(false); };
  const isPending = isEditMode ? isUpdating : isCreating;
  // ... render Dialog with dynamic title, submit button text
}
```

#### Edit-Mode Changed-Fields-Only Updates

When editing, only send fields that actually changed to the API:

```typescript
const getChangedFields = (data: FormValues): Partial<FormValues> => {
  if (!entity) return data;
  const original: FormValues = { /* map entity to form shape */ };
  const changed: Partial<FormValues> = {};
  for (const key of Object.keys(data) as (keyof FormValues)[]) {
    const newVal = data[key];
    const oldVal = original[key];
    if (Array.isArray(newVal) && Array.isArray(oldVal)) {
      if (JSON.stringify([...newVal].sort()) !== JSON.stringify([...oldVal].sort())) {
        (changed as Record<string, unknown>)[key] = newVal;
      }
    } else if (newVal !== oldVal) {
      (changed as Record<string, unknown>)[key] = newVal;
    }
  }
  return changed;
};
```

### CRUD Feature Implementation Pattern

#### Full Feature Flow (Boundary → Content → Section → Modal)

This is the standard architecture for any feature that lists, paginates, creates, edits, and deletes entities.

**1. Page (`app/(core)/[feature]/page.tsx`)**

```typescript
export default function FeaturePage() {
  return (
    <FeatureBoundary>
      <FeatureContent />
    </FeatureBoundary>
  );
}
```

**2. Boundary (Server Component — prefetch data)**

```typescript
// features/[feature]/components/feature-boundary.tsx
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/query-keys';

const DEFAULT_REQUEST = { page: 1, limit: 10 };

export async function FeatureBoundary({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.feature.list(DEFAULT_REQUEST),
      queryFn: () => getEntitiesServer(DEFAULT_REQUEST),
    }),
    // Prefetch dropdown data used in modals (page: 1, limit: 100)
    queryClient.prefetchQuery({
      queryKey: queryKeys.feature.dropdownA(),
      queryFn: getDropdownAServer,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
```

**3. Content (Client Component — state & data orchestration)**

```typescript
// features/[feature]/components/feature-content.tsx
'use client';

export function FeatureContent() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isFetching, isPending } = useEntities({ page, limit });

  const entities = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  return (
    <FeatureSection
      entities={entities}
      isLoading={isFetching && !isPending}
      meta={meta}
      onPageChange={setPage}
    />
  );
}
```

**4. Section (Table, Pagination, Modal host)**

```typescript
// features/[feature]/components/feature-section.tsx
'use client';

export function FeatureSection({ entities, isLoading, meta, onPageChange }: Readonly<Props>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);

  // ... handleAdd, handleEdit, handleModalChange

  return (
    <div>
      {/* Header with Add button */}
      {/* Table with loading overlay */}
      <div className="relative">
        {isLoading && <LoadingOverlay />}
        <Table className="table-fixed w-full">
          <TableHeader><HeaderRow /></TableHeader>
          <TableBody>
            {entities.map((e) => <EntityRow key={e.id} entity={e} onEdit={handleEdit} />)}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {meta && meta.totalPages > 1 && <EntityPagination meta={meta} onPageChange={onPageChange} />}
      {/* Modal */}
      <AddEntityModal open={modalOpen} onOpenChange={handleModalChange} entity={editingEntity} />
    </div>
  );
}
```

**5. Code-Split Sub-Components**

Split the table into focused sub-components within the same file:
- `HeaderRow` — defines column widths and headers
- `EntityRow` — renders one data row with edit/delete actions
- `EntityPagination` — pagination controls with page numbers

**6. Skeleton Loading**

Create a skeleton component in `feature-skeletons.tsx` matching the table structure. Show it when data is not yet available (`!entities.length && isLoading`). For subsequent page fetches, use a loading overlay (blur + spinner) over the existing table.

#### API Layer Structure

For each feature, create these files:

| File | Purpose |
|------|---------|
| `features/[feature]/types/[feature].ts` | TypeScript interfaces for API response, form data, dropdown items |
| `features/[feature]/validations/schemas.ts` | Zod schemas with `z.infer` type exports |
| `features/[feature]/api/[feature]/client.ts` | Client-side fetch functions (used by TanStack Query hooks) |
| `features/[feature]/api/[feature]/server.ts` | Server-side fetch functions (used by Boundary prefetch) |
| `features/[feature]/api/[feature]/actions.ts` | Server actions for mutations (create, update, delete) |
| `features/[feature]/hooks/use-[feature].ts` | TanStack Query hooks (useQuery, useMutation) |
| `lib/api/endpoints.ts` | API endpoint URL constants |
| `lib/queries/query-keys.ts` | Query key factories |

### Icon Usage

#### Hugeicons Standard

- **Always use Hugeicons**: Use Hugeicons for all icon needs across the application
- **Import Method**:
  - Import `HugeiconsIcon` from `@hugeicons/react`
  - Import specific icons from `@hugeicons/core-free-icons`
- **Component Props**:
  - `icon={IconName}` - Pass the imported icon
  - `className="w-5 h-5"` - Standard sizing (adjust as needed)
  - `strokeWidth={1.5}` - Consistent stroke width
  - `aria-hidden="true"` - For decorative icons
- **Accessibility**: Always include `aria-hidden="true"` for decorative icons
- **Consistency**: Use consistent sizing (`w-5 h-5`) and stroke width (`1.5`) across the application

### Testing

- Test component rendering
- Test user interactions
- Test error states
- Test accessibility
- Use React Testing Library
- Mock external dependencies
- **Test Location**: Create tests in root `__tests__/` folder in modular structure
