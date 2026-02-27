## Next.js Fetch API Standards

### Fetch Configuration

#### Base Fetch Setup

- Use Next.js built-in `fetch` API (extends Web Fetch API)
- Leverage Next.js automatic request deduplication
- Use native `fetch` in Server Components and Server Actions
- Configure caching and revalidation strategies via `next` option

### Caching Strategies

#### Static Data (ISR)

- Use `next: { revalidate: number }` for time-based revalidation
- Set appropriate revalidation time based on data freshness needs

#### Dynamic Data (No Cache)

- Use `cache: 'no-store'` for always-fresh data
- Use for mutations and real-time data

#### On-Demand Revalidation

- Use `next: { tags: ['tag-name'] }` for tagged caching
- Use `revalidateTag()` from `next/cache` to invalidate specific tags
- Use in Server Actions or API routes

#### Time-Based Revalidation

- Set `next: { revalidate: seconds }` for time-based cache invalidation
- Balance between freshness and performance

### Fetch Options

#### Request Configuration

- Configure method (GET, POST, PUT, DELETE, PATCH)
- Set appropriate headers (Content-Type, Authorization, etc.)
- Include body for POST/PUT/PATCH requests
- Configure cache and revalidation options

#### Common Patterns

- GET requests: Include caching strategy, set appropriate headers
- POST/PUT/DELETE requests: Use `cache: 'no-store'` for mutations
- Always check `response.ok` before processing response
- Handle errors appropriately

### Error Handling

#### Standard Error Handling

- Always check `response.ok` before processing
- Throw errors with meaningful messages
- Handle network errors with try-catch
- Log errors for debugging

#### Typed Error Responses

- Define `ApiError` interface for error responses
- Parse error responses from API
- Provide user-friendly error messages

### API Client Pattern

#### Centralized API Client

- Create centralized API client in `lib/api/client.ts`
- Use environment variables for API base URL
- Support query parameters via URLSearchParams
- Provide typed methods (get, post, put, delete)
- Handle errors consistently

### Server Components Usage

#### Direct Fetch in Server Components

- Use async/await directly in Server Components
- Configure appropriate caching strategies
- Handle errors with error boundaries

#### Parallel Data Fetching

- Use `Promise.all()` for parallel data fetching
- Fetch independent data sources simultaneously
- Improve page load performance

### Server Actions Usage

#### Fetch in Server Actions

- Use `'use server'` directive
- Fetch data and perform mutations
- Use `revalidateTag()` or `revalidatePath()` after mutations
- Return appropriate responses

### Route Handlers (API Routes)

#### Creating API Routes

- **IMPORTANT**: Do NOT implement any API route handlers (`app/api/*/route.ts`) unless explicitly requested by the user
- This codebase is frontend-only and should consume external backend APIs
- If API routes are needed for specific purposes (e.g., proxying, server-side operations), wait for explicit user instruction
- When implementing (only if requested):
  - Create route handlers in `app/api/[route]/route.ts`
  - Export named functions: GET, POST, PUT, DELETE
  - Use `NextRequest` and `NextResponse` types
  - Return JSON responses with appropriate status codes

### Best Practices

#### Type Safety

- Always type API responses with TypeScript interfaces
- Use generic types for reusable API functions
- Validate responses at runtime when needed

#### Environment Variables

- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Store API URLs and keys in environment variables
- Use different values for development/production

#### Request Deduplication

- Next.js automatically deduplicates identical requests
- Leverage this for parallel data fetching
- Be aware of caching implications

#### Error Boundaries

- Use error boundaries for fetch errors in Server Components
- Handle errors gracefully with fallback UI
- Log errors for debugging

#### Performance

- Use appropriate caching strategies
- Implement request deduplication awareness
- Use streaming for large responses when possible
- Consider using `AbortController` for timeouts

### Integration with TanStack Query

#### Server-Side Prefetching

- Use `queryClient.prefetchQuery()` in Server Components
- Wrap client components with `HydrationBoundary` and `dehydrate` state
- Prefetch data that will be needed by client components

### Testing

- Mock `fetch` in tests
- Test error handling scenarios
- Test caching behavior
- Test revalidation logic
