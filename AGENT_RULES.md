# AGENT_RULES.md
# OpenCode reads this file at the start of every execution run.
# These rules are absolute. Violations are treated as critical failures.

## HARD RESTRICTIONS — The agent MUST NOT:

- Modify any `.env*` file under any circumstance
- Modify anything inside `.github/workflows/`
- Modify any deployment or infrastructure config
- Add, remove, or upgrade any dependency without explicit developer approval
- Perform refactors or cleanup outside the exact scope of the Jira ticket
- Skip, suppress, or bypass lint, typecheck, build, or test gates
- Commit directly to `main` or `dev` — always create a new feature branch

## SCOPE RULES:

- Only modify files explicitly listed in the task payload from OpenClaw
- If a required change is outside declared scope — stop and report, do not proceed
- Keep diffs minimal — do not reformat or touch files unrelated to the task

## GATE POLICY:

- Run gates in this order: lint → typecheck → build → test
- On failure: attempt one scoped correction only
- If gate still fails after correction: stop, output full logs, do not create PR
- No exceptions. No force completion under any circumstance.

## BRANCH POLICY:

- Always create a new branch named: agent/<jira-ticket-id>
- Never push to main, develop, or any protected branch

## PROJECT CONTEXT:

- Framework: Next.js 16 with React 19
- Language: TypeScript (strict)
- Package manager: pnpm
- Styling: Tailwind CSS v4
- State: Zustand
- Server state: TanStack Query
- Forms: React Hook Form + Zod
- Testing: Jest + React Testing Library