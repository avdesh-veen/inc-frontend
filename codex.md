# Codex Agent Instructions
# This file is read by Codex at the start of every session.

## Project
- Name: InCredibly Platform
- Framework: Next.js 16 App Router
- Language: TypeScript (strict)
- Package manager: pnpm
- Styling: Tailwind CSS v4
- State: Zustand (modal open/close only)
- Server state: TanStack Query
- Forms: React Hook Form + Zod
- Toast: Sonner
- UI: shadcn/ui (components/ui/)
- Icons: @hugeicons/react

## Rules (from AGENT_RULES.md — non-negotiable)
- NEVER modify .env* files
- NEVER modify .github/workflows/
- NEVER modify deployment or infrastructure config
- NEVER add, remove, or upgrade any dependency
- NEVER refactor code outside ticket scope
- NEVER commit to main or develop
- ALWAYS create branch: agent/<ticket-id>
- ALWAYS run gates in order: pnpm lint → pnpm typecheck → pnpm build → pnpm test
- If a gate fails: attempt one fix. If still failing — stop and report.
- Keep diffs minimal — only touch files required by the ticket

## Reference Module
- Always mirror the Client module pattern exactly
- Client module lives at: features/records/clients/
- Copy its folder structure, naming conventions, API layer, 
  state management, form validation, and component usage

## Folder Structure
- Features: features/records/<feature-name>/
- Routes: app/(core)/records/<feature-name>/
- UI components: components/ui/
- Shared components: components/shared/
- API client: lib/api/client.ts
- API endpoints: lib/api/endpoints.ts
- Query keys: lib/queries/query-keys.ts

## API Pattern
- Client-side: apiClient from @/lib/api/client
- Server-side: fetchServer from @/lib/api/server
- Auth: handled automatically via cookies
- Response type: ApiResponse<T> or ApiResponse<PaginatedResponse<T>>

## State Pattern
- URL params for: filters, sorting, pagination, active tab
- Zustand for: modal open/close state ONLY
- TanStack Query for: all server data

## Gate Commands
- pnpm lint
- pnpm typecheck
- pnpm build
- pnpm test

## After completing every task:
1. Run all 4 gates in order
2. Fix any failures (one attempt per gate)
3. Report gate results
4. Output a PR description with:
   - What was done
   - Files changed
   - How to test
   - Any TODOs or risks