## shadcn/ui Styling Standards

### Component Structure

- Components live in `components/ui/` directory
- Each component is a client component by default
- Components are copyable and customizable
- Built on Radix UI primitives for accessibility

### Component Usage Patterns

#### Basic Component Import

- Import components from `@/components/ui/`
- Use named exports for component parts (CardHeader, CardTitle, etc.)
- Import only needed components

#### Component Composition

- Compose complex UIs from simple components
- Use compound components pattern (Card with CardHeader, CardContent, etc.)
- Maintain consistent component structure

### Theming and Customization

#### CSS Variables

- Use CSS variables for theming defined in `globals.css`
- Customize colors, spacing, and other design tokens
- Support light and dark modes via CSS variables

#### Component Variants

- Use `class-variance-authority` (cva) for component variants
- Define variants in component files
- Use `cn()` utility for conditional class merging

### Common Components

#### Button

- Use variants: default, destructive, outline, secondary, ghost, link
- Use sizes: default, sm, lg, icon
- Choose appropriate variant and size for context

#### Form Components

- Use Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
- Pair with React Hook Form using `control` prop
- Use Input, Textarea, Select components for form fields
- **Use Combobox for searchable dropdowns** (preferred over Select for lists with many options)

#### Dialog and Modal

- Use Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
- Use `asChild` prop with DialogTrigger for custom triggers
- Provide DialogTitle and DialogDescription for accessibility

#### Data Display

- Use Table components for tabular data
- Use Badge for status indicators
- Use Avatar for user images
- Compose with proper semantic structure

### Styling Best Practices

#### Tailwind CSS Usage

- Use Tailwind utility classes for styling
- Follow mobile-first responsive design
- Use `cn()` utility for conditional classes
- Leverage Tailwind's design tokens

#### Class Organization

- Use `cn()` utility for conditional class merging
- Allow `className` prop override
- Keep base classes separate from conditional classes

#### Responsive Design

- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Mobile-first approach
- Test on multiple screen sizes

#### Dark Mode

- Use `dark:` prefix for dark mode styles
- Leverage CSS variables for theme switching
- Test both light and dark modes

### Component Customization

#### Extending Components

- Copy component to `components/ui/` and customize
- Maintain component API consistency
- Document customizations

#### Creating Custom Components

- Build on shadcn/ui components when possible
- Follow shadcn/ui patterns and structure
- Use Radix UI primitives for complex components
- Ensure accessibility compliance

### Accessibility

#### ARIA Attributes

- shadcn/ui components include proper ARIA attributes
- Don't override accessibility features
- Test with screen readers

#### Keyboard Navigation

- All interactive components support keyboard navigation
- Focus management is handled by Radix UI primitives
- Maintain focus indicators

### Performance

#### Component Loading

- Import only needed components
- Use dynamic imports for heavy components
- Leverage Next.js code splitting

#### CSS Optimization

- Tailwind purges unused styles in production
- Use Tailwind's JIT mode
- Minimize custom CSS

### Best Practices

#### Component Selection

- Use shadcn/ui components as base
- Customize when needed, don't recreate
- Follow design system patterns

#### Consistency

- Use consistent spacing (Tailwind scale)
- Maintain consistent color usage
- Follow typography scale

#### Composition

- Compose complex UIs from simple components
- Use compound components pattern
- Keep components focused and reusable

### Integration with Forms

#### React Hook Form Integration

- Use Form components from shadcn/ui
- Pair with Zod validation
- Leverage FormField for controlled inputs

#### Combobox for Searchable Dropdowns

Use the Combobox component for dropdown fields that require search functionality. This is the preferred pattern for dropdowns with many options (e.g., roles, teams, users).

**Basic Usage with Simple String Items:**

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const;

export function BasicCombobox() {
  return (
    <Combobox items={frameworks} defaultValue={frameworks[0]}>
      <ComboboxInput placeholder="Select a framework" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
```

**Usage with Custom Object Items (Recommended for API Data):**

```tsx
interface OptionItem {
  value: string;
  label: string;
}

const options: OptionItem[] = [
  { value: "uuid-1", label: "Option 1" },
  { value: "uuid-2", label: "Option 2" },
]

<Combobox<OptionItem>
  items={options}
  itemToStringValue={(item) => item?.label ?? ''}
  value={findOption(options, selectedValue)}
  onValueChange={(item) => onChange(item?.value ?? '')}
>
  <ComboboxInput placeholder="Select option" showClear={!!selectedValue} />
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

**Integration with React Hook Form:**

```tsx
<FormField
  control={form.control}
  name="roleId"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>
        Role <span className="text-destructive">*</span>
      </FormLabel>
      <Combobox<OptionItem>
        items={roleOptions}
        itemToStringValue={(item) => item?.label ?? ""}
        value={findOption(roleOptions, field.value ?? "")}
        onValueChange={(item) => field.onChange(item?.value ?? "")}
        disabled={isLoading}
      >
        <ComboboxInput
          placeholder={isLoading ? "Loading..." : "Select role"}
          showClear={!!field.value}
          disabled={isLoading}
        />
        <ComboboxContent>
          <ComboboxEmpty>No roles found</ComboboxEmpty>
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
/>
```

**Key Props:**

- `items`: Array of items to display in the dropdown
- `itemToStringValue`: Function to convert item to searchable string (required for object items)
- `value`: Currently selected item (for controlled components)
- `onValueChange`: Callback when selection changes
- `disabled`: Disable the combobox
- `showClear`: Show clear button on ComboboxInput when a value is selected

**Form + validation (cleared state):** When used with React Hook Form and Zod, pass `value={field.value ?? ""}` and use `field.onChange(item?.value ?? "")` in `onValueChange`. Store the cleared state as empty string `""`, not `null`, so that backspace and the clear icon behave the same and Zod does not throw "expected string, received null" on submit.

**Helper Function for Finding Selected Option:**

```tsx
const findOption = (
  options: OptionItem[],
  value: string | undefined,
): OptionItem | null => {
  if (!value) return null;
  return options.find((opt) => opt.value === value) || null;
};
```

**When to Use Combobox vs Select:**

- **Use Combobox** for: Lists with 5+ options, searchable requirements, clearable requirements, API-driven data
- **Use Select** for: Small static lists (2-4 options), simple status/type fields, no search needed

#### Form Layout

- Use Card for form containers
- Use proper spacing with `space-y-*` utilities
- Group related fields visually

### Testing

- Test component rendering
- Test accessibility features
- Test responsive behavior
- Test dark mode variants
- Test form integration
