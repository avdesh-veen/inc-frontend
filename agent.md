# Agent Task

## Ticket ID
[PASTE TICKET ID HERE]

## Task
[PASTE FULL JIRA TICKET CONTENT HERE]

## Instructions
1. Read codex.md for project rules and patterns
2. Read AGENT_RULES.md for hard restrictions
3. Create branch: agent/[TICKET-ID]
4. Implement the full ticket
5. Run all gates: pnpm lint → pnpm typecheck → pnpm build → pnpm test
6. Fix any gate failures (one attempt each)
7. Output PR description when complete