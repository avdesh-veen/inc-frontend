## React Hook Form + Zod Standards

### Setup and Configuration

#### Form Provider Pattern

- Use `FormProvider` for complex forms with nested components
- Use individual `useForm` hooks for simple forms
- Always pair with Zod for validation using `zodResolver`

### Zod Schema Patterns

#### Basic Validation

- Use `z.string()` with `.min()`, `.max()`, `.trim()` for string validation
- Use `z.string().email()` for email validation
- Use `z.number()` with `.min()`, `.max()` for number validation
- Use `.optional()` for optional fields, `.nullable()` for nullable fields

#### Complex Schemas

- Use nested `z.object()` for nested object structures
- Use `z.array()` with validators for array fields
- Use `z.enum()` for union types with specific values
- Use `.refine()` for conditional validation logic
- Compose schemas by reusing smaller schemas

#### Custom Validations

- Use `.regex()` for pattern matching (passwords, zip codes, etc.)
- Use `.refine()` with async functions for server-side validation
- Provide clear, user-friendly error messages

### React Hook Form Patterns

#### Form Registration

- Use `register()` for basic input registration
- Pass validation options directly to `register()` when not using Zod
- Use `onChange` handlers within `register()` for custom logic

#### Controlled Components (shadcn/ui)

- Use `FormField`, `FormControl`, `FormItem`, `FormLabel`, `FormMessage` from shadcn/ui
- Use `render` prop pattern with `FormField` for controlled inputs
- Always pair with React Hook Form's `control` prop
- **Use Combobox for searchable dropdown fields** (see Combobox Integration below)

#### Form State Management

- Access `formState` for errors, isDirty, isValid, isSubmitting, touchedFields, dirtyFields
- Use `watch()` to watch field values
- Use `setValue()` to set field values programmatically
- Use `getValues()` to get current form values
- Use `reset()` to reset form to default values
- Use `trigger()` to manually trigger validation

### Advanced Patterns

#### Form with Server Actions

- Use `useActionState` hook with Server Actions
- Convert form data to `FormData` when needed
- Handle server-side errors appropriately

#### Dynamic Forms

- Use `useFieldArray` for dynamic form fields
- Manage array of fields with `append()`, `remove()`, and `update()`
- Use proper keys for array items

#### Form with TanStack Query (Add/Edit Modal Pattern)

Integrate forms with TanStack Query mutations using `mutateAsync`:

```typescript
const { mutateAsync: createEntity, isPending: isCreating } = useCreateEntity();
const { mutateAsync: updateEntity, isPending: isUpdating } = useUpdateEntity();
const isEditMode = !!entity;

const onSubmit = (data: FormValues) => {
  if (isEditMode) {
    const changedData = getChangedFields(data);
    if (Object.keys(changedData).length === 0) { handleClose(); return; }
    updateEntity({ id: entity.id, data: changedData }).then(() => handleClose());
  } else {
    createEntity(data).then(() => handleClose());
  }
};

const isPending = isEditMode ? isUpdating : isCreating;
```

**Key points:**
- Use `mutateAsync` (not `mutate`) to get Promise-based flow with `.then()`
- Destructure `isPending` from each mutation separately (`isCreating`, `isUpdating`)
- Errors propagate to the hook's `onError` callback automatically (toast handled there)
- No try/catch or inline error handling needed in the modal

#### Edit-Mode Form Pre-fill

Use `useEffect` to reset form values when the entity prop changes:

```typescript
useEffect(() => {
  if (entity) {
    form.reset({
      fieldA: entity.fieldA,
      fieldB: entity.fieldB,
      // map all entity fields to form shape
    });
  } else {
    form.reset(DEFAULT_VALUES);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [entity]);
```

**Key points:**
- Only depend on `entity` (not `form`) in the dependency array to avoid infinite loops
- Add the eslint-disable comment for `react-hooks/exhaustive-deps`
- Reset to `DEFAULT_VALUES` when `entity` is null (Add mode)

#### Edit-Mode Changed-Fields-Only Updates

When editing, compute a diff and only send changed fields to the API:

```typescript
const getChangedFields = (data: FormValues): Partial<FormValues> => {
  if (!entity) return data;
  const original: FormValues = { /* map entity to form shape */ };
  const changed: Partial<FormValues> = {};
  for (const key of Object.keys(data) as (keyof FormValues)[]) {
    const newVal = data[key];
    const oldVal = original[key];
    if (Array.isArray(newVal) && Array.isArray(oldVal)) {
      // Sort arrays before comparing to handle different ordering
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

If no fields changed, close the modal without making an API call.

#### Combobox Integration for Searchable Dropdowns

Use the Combobox component from `@/components/ui/combobox` for dropdown fields that need search and clear functionality:

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

interface OptionItem {
  value: string;
  label: string;
}

// Helper to find selected option from ID value
const findOption = (
  options: OptionItem[],
  value: string | undefined,
): OptionItem | null => {
  if (!value) return null;
  return options.find((opt) => opt.value === value) || null;
};

// Transform API data to options format
const options: OptionItem[] = apiData.map((item) => ({
  value: item.id,
  label: item.name,
}));

// Inside FormField render
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Field Label</FormLabel>
      <Combobox<OptionItem>
        items={options}
        itemToStringValue={(item) => item?.label ?? ""}
        value={findOption(options, field.value ?? "")}
        onValueChange={(item) => field.onChange(item?.value ?? "")}
        disabled={isLoading}
      >
        <ComboboxInput
          placeholder={isLoading ? "Loading..." : "Select..."}
          showClear={!!field.value}
          disabled={isLoading}
        />
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
      <FormMessage />
    </FormItem>
  )}
/>;
```

**Key Integration Points:**

- `value`: Use `findOption()` to convert form's ID value to option object. Pass `field.value ?? ""` so the combobox always receives a string (components typically normalize `""` to no selection internally).
- `onValueChange`: Extract `item?.value` (the ID) when setting form value. **Use empty string for cleared state:** `field.onChange(item?.value ?? "")` — do not use `null`. Zod schemas use `z.string()` or `z.string().optional()`; storing `null` when the user clears (via backspace or clear icon) causes "Invalid input: expected string, received null". Using `""` keeps backspace and clear icon behavior consistent and yields the correct validation message (e.g. "Role is required").
- `showClear`: Conditionally show based on `!!field.value`
- `disabled`: Disable during loading states
- `itemToStringValue`: Required for object items to enable search functionality

#### MultiSelectCombobox Integration (Array Fields)

For form fields with `z.array(z.string())` schema (multi-select), use `MultiSelectCombobox`:

```tsx
import { MultiSelectCombobox, type MultiSelectOption } from '@/components/shared/multi-select-combobox';

// Memoize options transformation
const options: MultiSelectOption[] = useMemo(
  () => items.map((item) => ({ value: item.id, label: item.name })),
  [items],
);

// Inside FormField for array field
<FormField
  control={form.control}
  name="itemIds" // z.array(z.string())
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Items</FormLabel>
      <FormControl>
        <MultiSelectCombobox
          options={options}
          value={field.value}       // string[] from form
          onChange={field.onChange}   // updates string[] directly
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

**Key points:**
- Use `fieldState` (not just `field`) from render to access `fieldState.error`
- `value` and `onChange` work directly with `string[]` — no transformation needed
- Use `useMemo` for the options array to avoid re-renders
- Use `error` prop for visual error state on validation failure

#### Cross-Field Validation with superRefine

When at least one of multiple array fields must be non-empty, use `superRefine` to show errors on all related fields:

```typescript
export const schema = z.object({
  fieldA: z.array(z.string()),
  fieldB: z.array(z.string()),
  // ... other fields
}).superRefine((data, ctx) => {
  if (data.fieldA.length === 0 && data.fieldB.length === 0) {
    const msg = 'At least one of Field A or Field B must be selected';
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['fieldA'] });
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: ['fieldB'] });
  }
});
```

### Error Handling

#### Field-Level Errors

- Errors are automatically displayed via `FormMessage` component
- Access errors via `formState.errors`
- Custom error messages come from Zod schemas

#### Form-Level Errors

- Use `form.setError('root', { message })` for form-level errors
- Handle async errors in `onSubmit` handler
- Display form-level errors appropriately

### Best Practices

#### Schema Organization

- Define schemas in separate files: `schemas/user-schema.ts`
- Export types using `z.infer<typeof schema>`
- Reuse and compose schemas across forms

#### Form Performance

- Use `mode: 'onChange'` for real-time validation
- Use `mode: 'onBlur'` for better performance
- Use `mode: 'onSubmit'` (default) for minimal validation

#### Accessibility

- Always associate labels with inputs using `FormLabel`
- Use `FormMessage` from shadcn/ui for error display
- Provide clear, actionable error messages
- Ensure keyboard navigation works properly

#### Type Safety

- Always type form data with `z.infer<typeof schema>`
- Use TypeScript strict mode
- Leverage Zod's type inference

### Testing

- Test form validation with various inputs
- Test error states and messages
- Test form submission and reset
- Test dynamic form fields
- Mock server actions/mutations in tests
