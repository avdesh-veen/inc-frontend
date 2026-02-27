## Test coverage best practices

- **Write Minimal Tests During Development**: Do NOT write tests for every change or intermediate step. Focus on completing the feature implementation first, then add strategic tests only at logical completion points
- **Test Only Core User Flows**: Write tests exclusively for critical paths and primary user workflows. Skip writing tests for non-critical utilities and secondary workflows until if/when you're instructed to do so.
- **Defer Edge Case Testing**: Do NOT test edge cases, error states, or validation logic unless they are business-critical. These can be addressed in dedicated testing phases, not during feature development.
- **Test Behavior, Not Implementation**: Focus tests on what the code does, not how it does it, to reduce brittleness
- **Clear Test Names**: Use descriptive names that explain what's being tested and the expected outcome
- **Mock External Dependencies**: Isolate units by mocking databases, APIs, file systems, and other external services
- **Fast Execution**: Keep unit tests fast (milliseconds) so developers run them frequently during development

## Test File Organization

### Test Location

- **Root `__tests__/` Folder**: All test files should be created in the root `__tests__/` folder
- **Modular Structure**: Organize tests in a modular structure that mirrors the feature organization
- **File Naming**: Use descriptive names that indicate what's being tested

Example structure:

```
__tests__/
├── features/
│   ├── clients/
│   │   ├── client-form.test.tsx
│   │   ├── client-table.test.tsx
│   │   └── client-detail.test.tsx
│   └── providers/
│       ├── provider-form.test.tsx
│       └── provider-table.test.tsx
├── components/
│   ├── ui/
│   │   └── button.test.tsx
│   └── shared/
│       └── data-table.test.tsx
└── accessibility.test.tsx
```

### Test Organization Guidelines

- Group tests by feature or component category
- Keep test structure parallel to source code structure
- Use clear, descriptive folder names
- Separate unit tests, integration tests, and e2e tests if needed
