## Validation Best Practices (Next.js Frontend)

### Core Principles

- **Always Validate on Server**: Never trust client-side validation alone for security or data integrity. Client-side validation is for UX only.
- **Fail Early**: Validate input as early as possible and reject invalid data before processing.
- **Specific Error Messages**: Provide clear, field-specific error messages that help users correct their input.
- **Allowlists Over Blocklists**: When possible, define what is allowed rather than trying to block everything that's not.
- **Type and Format Validation**: Check data types, formats, ranges, and required fields systematically.
- **Consistent Validation**: Apply validation consistently across all entry points (forms, Server Actions, API routes).

### Next.js-Specific Validation Patterns

#### Server-Side Validation

**Server Actions** (Primary method for form submissions):

- Always validate in Server Actions using Zod schemas
- Validate before any business logic or database operations
- Return structured error responses: `{ success: false, error: string }` or `{ success: false, errors: Record<string, string> }`
- Use the same Zod schemas as client-side for consistency

```typescript
// app/actions/client-actions.ts
"use server";

import { z } from "zod";
import { clientSchema } from "@/lib/validations/client-schema";

export async function createClient(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
  };

  // Validate with Zod
  const result = clientSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Process validated data
  // ...
}
```

**API Routes** (`app/api/`):

- Validate request body/query parameters with Zod
- Return appropriate HTTP status codes (400 for validation errors)
- Use consistent error response format

**Server Components**:

- Validate data fetched from APIs before rendering
- Use TypeScript types and runtime validation when consuming external APIs

#### Client-Side Validation

**React Hook Form + Zod** (Primary method for forms):

- Use Zod schemas with `zodResolver` for form validation
- Provide immediate user feedback with `mode: 'onChange'` or `mode: 'onBlur'`
- Display field-level errors using `FormMessage` from shadcn/ui
- Handle form-level errors with `form.setError('root', { message })`

See `docs/standards/frontend/react-hook-form-zod.md` for detailed patterns.

**Client Components**:

- Validate user input before API calls (but don't rely on this for security)
- Use Zod schemas for type-safe validation
- Provide real-time feedback for better UX

### Validation Schema Organization

**Schema Location**:

- Define schemas in `lib/validations/[feature]/schemas.ts`
- Export types using `z.infer<typeof schema>`
- Reuse and compose schemas across client and server

**Schema Patterns**:

```typescript
// lib/validations/client-schema.ts
import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number")
    .optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
```

### Error Handling

**Server Actions**:

- Return structured error objects with field-level errors
- Map server validation errors to form fields using `form.setError()`
- Provide user-friendly error messages

**API Routes**:

- Return consistent error response format
- Include validation errors in response body
- Use appropriate HTTP status codes

**Client Components**:

- Display server errors alongside client-side validation
- Show field-level errors below inputs
- Show form-level errors at top of form
- Use `aria-invalid` and `aria-describedby` for accessibility

### Security Considerations

**Input Sanitization**:

- Sanitize user input to prevent XSS attacks
- Use Next.js built-in XSS protection (automatic for Server Components)
- Escape user-generated content when rendering
- Validate file uploads (type, size, content)

**Type Safety**:

- Use TypeScript strict mode
- Leverage Zod's type inference for runtime validation
- Never use `any` type for user input

### Business Rule Validation

**Where to Validate**:

- **Client-side**: For immediate feedback (UX)
- **Server Actions**: For all business rules (security and integrity)
- **Database**: Constraints as final layer of defense

**Examples**:

- Date ranges (start date before end date)
- Unique constraints (email, username)
- Business logic (sufficient balance, valid status transitions)

### Testing Validation

- Test Zod schemas with various inputs (valid and invalid)
- Test Server Actions with invalid data
- Test form validation with React Testing Library
- Test error message display
- Test accessibility of error messages

### Related Standards

- `docs/standards/frontend/react-hook-form-zod.md` - Form validation patterns
- `docs/standards/frontend/error-handling.md` - Error handling patterns
- `docs/standards/frontend/typescript.md` - Type safety practices
