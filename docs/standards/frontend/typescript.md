## TypeScript Standards

### Configuration

#### Strict Mode

- Always enable strict mode in `tsconfig.json`
- Enable `noUncheckedIndexedAccess` for safer array/object access
- Enable `noImplicitReturns` to catch missing return statements
- Enable `noFallthroughCasesInSwitch` to prevent switch fallthrough bugs

### Type Definitions

#### Interfaces vs Types

- **Use `interface`** for:
  - Object shapes
  - Component props
  - Extendable types
  - Public APIs

- **Use `type`** for:
  - Unions and intersections
  - Primitives
  - Mapped types
  - Utility types

### Type Safety

#### Avoid `any`

- Never use `any` type
- Use `unknown` for truly unknown types
- Use proper types or generics
- Use type guards to narrow unknown types

#### Type Assertions

- Avoid type assertions when possible
- Use type guards instead
- If needed, use `as` with caution and proper validation

#### Nullish Coalescing vs Logical OR

- Prefer using the nullish coalescing operator (`??`) instead of logical or (`||`), as it is a safer operator.
- `??` only falls back when the left-hand side is `null` or `undefined`; `||` also falls back for other falsy values (`""`, `0`, `false`), which can hide bugs.

### Generic Types

#### Generic Functions

- Use generics for reusable functions
- Add constraints when needed with `extends`
- Leverage TypeScript's type inference

#### Generic Components

- Use generics for reusable components
- Type props with generic parameters
- Maintain type safety throughout component tree

### Utility Types

#### Common Utility Types

- `Partial<T>` - Make all properties optional
- `Required<T>` - Make all properties required
- `Pick<T, K>` - Select specific properties
- `Omit<T, K>` - Exclude specific properties
- `Record<K, V>` - Create object type with key-value pairs
- `Readonly<T>` - Make all properties readonly

### React TypeScript Patterns

#### Component Props

- Define interfaces for component props
- Extend HTML element props when appropriate
- Use generic types for reusable components
- **MANDATORY: Mark the props of the component as read-only.** Always use the `Readonly<>` wrapper (SonarQube enforced).

**Read-Only Props (mandatory):**

Wrap all component props with `Readonly<>` to prevent accidental mutations. This rule is mandatory for all components.

```typescript
// ✅ Correct: Props wrapped with Readonly
function MyComponent({ title }: Readonly<{ title: string }>) { ... }
function MyComponent({ title }: Readonly<MyComponentProps>) { ... }

// ❌ Wrong: Missing Readonly wrapper
function MyComponent({ title }: { title: string }) { ... }
```

**Apply when:** Writing new components, refactoring, or encountering components without `Readonly<>`

#### Hooks Typing

- Type `useState` with explicit type or inferred from initial value
- Type `useRef` with element type or value type
- Type `useCallback` and `useMemo` return values
- Use proper dependency arrays

#### Event Handlers

- Type form events: `React.FormEvent<HTMLFormElement>`
- Type input events: `React.ChangeEvent<HTMLInputElement>`
- Type click events: `React.MouseEvent<HTMLButtonElement>`
- Use appropriate event types for different interactions

### API and Data Types

#### API Response Types

- Define generic `ApiResponse<T>` interface
- Create `PaginatedResponse<T>` for paginated data
- Define `ApiError` interface for error responses
- Type all API request and response payloads

#### Zod Schema Types

- Use `z.infer<typeof schema>` to infer types from Zod schemas
- Leverage Zod's type inference for form data
- Keep schemas and types in sync

### Type Guards

#### Custom Type Guards

- Create type guard functions for runtime type checking
- Use `data is Type` return type annotation
- Narrow types safely in conditional blocks

### Module Organization

#### Type Exports

- Export types from dedicated files: `types/user.ts`
- Use `export type` for type-only exports
- Re-export types from index files when needed
- Group related types together

### Best Practices

#### Type Narrowing

- Use type guards for runtime type checking
- Leverage TypeScript's control flow analysis
- Use discriminated unions for complex states

#### Discriminated Unions

- Use discriminated unions for state management
- Include discriminant property (e.g., `status: 'loading' | 'success' | 'error'`)
- Type narrow in switch statements

#### Avoid Type Assertions

- Prefer type guards over assertions
- Use proper typing instead of `as`
- Let TypeScript infer types when possible

#### Type Documentation

- Document complex types with JSDoc
- Use descriptive type names
- Group related types together

### Testing Types

- Use TypeScript in tests
- Test type safety, not just runtime behavior
- Use `@ts-expect-error` for intentional type errors in tests
