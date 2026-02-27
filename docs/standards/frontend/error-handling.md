## Error Handling Standards

### Error Boundaries

#### React Error Boundaries

- Implement error boundaries at route level
- Use error boundaries for component tree isolation
- Provide fallback UI for errors
- Log errors for debugging
- Create reusable error boundary components
- Use `componentDidCatch` for error logging

#### Next.js Error Handling

- Use `error.tsx` files for route-level error boundaries
- Use `not-found.tsx` for 404 errors
- Handle errors in Server Components and Server Actions
- Use `reset()` function to retry failed operations
- Access error details via error prop in error.tsx

### API Error Handling

#### Fetch Error Handling

- Always check `response.ok` before processing responses
- Create custom `ApiError` class extending Error
- Include status code and error code in error objects
- Parse error responses from API
- Throw typed errors for better error handling
- Handle network errors separately from API errors

#### Error Response Structure

- Standardize error response format from API
- Include error message, status code, and optional error code
- Handle different HTTP status codes appropriately
- Provide fallback error messages when API doesn't return errors

### TanStack Query Error Handling

#### Query Error Handling

- Access errors via `error` object from query hooks
- Use `isError` to check for error state
- Handle errors at component level with conditional rendering
- Don't retry on 4xx client errors (400-499)
- Retry on 5xx server errors and network failures
- Configure retry logic with `retry` option in query config

#### Mutation Error Handling

- Handle errors in `onError` callback
- Use `error` object from mutation hooks
- Display error messages to users
- Rollback optimistic updates on error
- Provide retry mechanism for failed mutations

#### Error Display Patterns

- Show loading state with `isLoading`
- Show error state with `isError` and error message
- Show empty state when no data
- Use early returns for different states
- Provide retry buttons for failed queries

### Form Error Handling

#### React Hook Form Errors

- Use `formState.errors` to access field errors
- Use `form.setError()` for form-level and field-level errors
- Display errors using `FormMessage` component from shadcn/ui
- Set errors from API responses in `onSubmit` handler
- Map API error codes to specific form fields
- Use `aria-invalid` and `aria-describedby` for accessibility

#### Error Display

- Show field-level errors below input fields
- Show form-level errors at top of form
- Use `role="alert"` for error messages
- Provide clear, actionable error messages
- Associate errors with inputs using `aria-describedby`

#### Server-Side Validation Errors

- Handle validation errors from server actions
- Map server errors to form fields
- Display server errors alongside client-side validation
- Provide user-friendly error messages

### Server Action Error Handling

#### Create/Update Actions — Return `ApiResponse<T>`

For **create** and **update** actions, return `ApiResponse<Entity | undefined>` to preserve the API's status, message, and data for display in the UI:

```typescript
// features/[feature]/api/[feature]/actions.ts
'use server';

export async function createEntityAction(
  formData: EntityFormData
): Promise<ApiResponse<Entity | undefined>> {
  try {
    const response = await fetchServer.post<ApiResponse<Entity>, EntityFormData>(
      API_ENDPOINTS.feature.create,
      formData,
    );

    if (!response.status) {
      return {
        status: false,
        message: typeof response.message === 'string'
          ? response.message
          : response.message.join(', '),
        statusCode: response.statusCode,
        data: response.data,
      };
    }

    return {
      status: true,
      message: response.message,
      statusCode: response.statusCode,
      data: response.data,
    };
  } catch (error) {
    logger(String(error), { error });
    if (error instanceof Error) {
      return { status: false, message: error.message, statusCode: 500, data: undefined };
    }
    return { status: false, message: 'Failed to create entity', statusCode: 500, data: undefined };
  }
}
```

**Key points:**
- Return type is `ApiResponse<Entity | undefined>` — not `ActionResult`
- Check `response.status` from the API, return structured response on failure
- Handle `message` as both `string` and `string[]` (API may return array of validation errors)
- Log errors server-side via `logger`
- Mutation hooks check `result.status` and throw with `result.message` so `onError` receives it

#### Delete Actions — Return `ActionResult`

For **delete** actions, use the simpler `ActionResult` pattern since there's no entity data to return:

```typescript
type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

export async function deleteEntityAction(id: string): Promise<ActionResult> {
  try {
    await fetchServer.delete(API_ENDPOINTS.feature.delete(id));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete entity',
    };
  }
}
```

#### Client-Side Handling

- For create/update: Mutation hooks check `result.status`, throw `Error(result.message)` → `onError` shows toast
- For create/update: `onSuccess` receives `ApiResponse` with `data.message` → shows success toast
- For delete: Mutation hooks check `result.success`, throw `Error(result.error)` → `onError` shows toast
- Modal uses `mutateAsync` + `.then(() => handleClose())` — errors propagate to hook's `onError` automatically

### Error Logging

#### Error Reporting Service

- Use error reporting service (Sentry, LogRocket, etc.)
- Log errors with context information
- Include user information when appropriate
- Don't log sensitive information (passwords, tokens, etc.)
- Log errors differently in development vs production

#### Logging Best Practices

- Log to console in development environment
- Send to error reporting service in production
- Include stack traces and error context
- Add breadcrumbs for error tracking
- Set appropriate error severity levels

#### Context Information

- Include request details (URL, method, headers)
- Include user information (ID, role, if available)
- Include component/page information
- Include relevant state information
- Exclude sensitive data

### Retry Mechanisms

#### Retry Strategies

- Provide retry buttons for failed operations
- Implement exponential backoff for automatic retries
- Show retry status to users
- Limit maximum retry attempts
- Don't retry on client errors (4xx)

#### TanStack Query Retry

- Configure `retry` option in query/mutation config
- Use function for conditional retry logic
- Set maximum retry count
- Use exponential backoff for retries
- Disable retry for specific error types

#### Manual Retry

- Provide retry button in error UI
- Allow users to manually retry failed operations
- Reset error state on retry
- Show retry in progress state

### User-Friendly Error Messages

#### Error Message Guidelines

- Use clear, actionable error messages
- Avoid technical jargon
- Provide next steps when possible
- Don't expose sensitive information
- Use consistent error message format

#### Message Examples

- Bad: "Error 500: Internal server error"
- Good: "Something went wrong. Please try again in a moment."
- Bad: "ValidationError: email field is required"
- Good: "Please enter your email address"

### Error Recovery

#### Recovery Strategies

- Provide fallback UI for errors
- Allow users to retry failed operations
- Save user input to prevent data loss
- Provide alternative paths when possible
- Clear error state after successful retry

### Best Practices

#### Error Handling Strategy

- Handle errors at the appropriate level
- Don't swallow errors silently
- Provide fallback UI for all error states
- Log errors for debugging
- Show user-friendly messages
- Test error scenarios

#### Error Prevention

- Validate input on client and server
- Use TypeScript for type safety
- Handle edge cases proactively
- Test error scenarios
- Use proper error types

#### Error Testing

- Test error boundaries
- Test API error handling
- Test form validation errors
- Test network failures
- Test error recovery mechanisms
- Test retry logic
