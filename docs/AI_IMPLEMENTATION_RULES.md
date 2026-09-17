# AI Vibe Coding Rules

Read this file before modifying the codebase.

## Rule 1 — Read context first
Read:
- PRD.md
- MVP_SCOPE.md
- ARCHITECTURE.md
- DATABASE.md
- API.md
- SECURITY.md

Then inspect the existing repository.

## Rule 2 — Do not rewrite working code unnecessarily
Prefer small, targeted changes.

## Rule 3 — Preserve architecture
Do not move provider logic into React components.
Do not bypass ownership checks.
Do not introduce a second ORM or second database layer.

## Rule 4 — Verify provider capabilities
If an Instagram/Meta feature is not available for the selected API/account type, do not fake it. Mark it unavailable and explain the limitation.

## Rule 5 — Mock mode
Keep `MOCK_INSTAGRAM=true` useful for local development. Mock mode must be explicit and disabled in production.

## Rule 6 — After each phase
Run:
- typecheck
- lint
- tests where present
- build when practical

Fix errors before moving on.

## Rule 7 — Explain meaningful decisions
When a requirement is ambiguous, choose the smallest reasonable implementation and document the assumption.

## Rule 8 — No scope creep
Do not build scheduling, publishing, teams, billing, inbox, or advanced analytics unless explicitly requested.

## Rule 9 — UI quality
Mobile-first, accessible, consistent, simple SaaS visual hierarchy.

## Rule 10 — Security is non-negotiable
Never expose secrets or tokens. Always enforce authenticated ownership.
