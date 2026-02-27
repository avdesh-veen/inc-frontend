## Coding style best practices

- **Consistent Naming Conventions**: Establish and follow naming conventions for variables, functions, classes, and files across the codebase
- **Automated Formatting**: Maintain consistent code style (indenting, line breaks, etc.)
- **Meaningful Names**: Choose descriptive names that reveal intent; avoid abbreviations and single-letter variables except in narrow contexts
- **Small, Focused Functions**: Keep functions small and focused on a single task for better readability and testability
- **Consistent Indentation**: Use consistent indentation (spaces or tabs) and configure your editor/linter to enforce it
- **Avoid Deeply Nested Functions (Max 4 Levels)**: Functions should not be nested more than 4 levels deep (SonarQube rule S2004). Deeply nested functions hurt readability and testability. When you encounter deep nesting:
  - Extract nested callbacks into named helper functions at module level
  - Use factory functions that return handlers instead of inline arrow functions
  - Common scenario: `FormField` render → `.map()` → `onCheckedChange` → `filter()` = 5 levels (too deep!)
  - Solution: Create a `createChangeHandler(value, id, onChange)` factory function outside the component
- **Remove Dead Code**: Always clean up unused code to maintain a clean codebase:
  - Remove unused imports immediately after editing a file
  - Delete unused variables, constants, and type definitions
  - Remove commented-out code blocks (use version control for history)
  - Delete unused functions, components, and files
  - Clean up unused dependencies from package.json
  - After any refactoring, verify no orphaned code remains
- **Prefer Optional Chaining**: Use optional chaining (`?.`) instead of manual null checks for cleaner, more readable code (SonarQube rule S6582). Example: `userData?.id` instead of `userData && userData.id`
- **No Array Index as React Keys (JSX list keys)**: JSX list components must not use array indexes as `key` (SonarQube rule S6479). Follow this every time you render lists. Array indices cause issues when items are reordered, added, or removed.
  - **Use a unique identifier**: The key must be a string or number that uniquely identifies the list item. The key must be unique among its siblings, not globally.
  - **Preferred keys**: If the data comes from a database, use database IDs — they are already unique and are the best option. Otherwise use a stable unique property (e.g. `item.id`, `item.name`, `item.email`) or generate a counter/UUID when creating the data.
  - **Static/placeholder lists**: For static lists with no data IDs (e.g. skeleton placeholders), use a constant array of stable string keys and map over it instead of `Array.from({ length: n }).map((_, i) => ... key={i})`. Example: `const ROW_KEYS = ['row-1', 'row-2', 'row-3'] as const;` then `ROW_KEYS.map((key) => <div key={key}>...</div>)`.
  - **Example**:
    ```jsx
    function Blog(props) {
      return (
        <ul>
          {props.posts.map((post) => (
            <li key={post.id}>
              {post.title}
            </li>
          ))}
        </ul>
      );
    }
    ```
- **Backward compatibility only when required:** Unless specifically instructed otherwise, assume you do not need to write additional code logic to handle backward compatibility.
- **DRY Principle**: Avoid duplication by extracting common logic into reusable functions or modules
- **Read-Only Component Props (React)**: All React component props MUST be wrapped with `Readonly<>` to prevent accidental mutations (SonarQube rule). This applies to:
  - New component development
  - Existing components during refactoring
  - Components discovered without `Readonly<>` wrapper
  - Example: `function MyComponent({ title }: Readonly<{ title: string }>)` instead of `function MyComponent({ title }: { title: string })`
