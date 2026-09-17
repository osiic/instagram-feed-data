# Instagram Manager MVP

Mobile-first SaaS dashboard for connecting multiple Instagram Professional/Business accounts through official Meta OAuth and viewing profile, media, and available insights.

## Stack
- Next.js + TypeScript + App Router
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- Zod
- Server-side Meta/Instagram integration

## Context files
Read `docs/PRD.md`, `docs/MVP_SCOPE.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/API.md`, and `docs/SECURITY.md` before implementing.

## Core rule
Do not implement Instagram username/password login or scraping. Use official Meta/Instagram OAuth and APIs only.

## Development
Use `MOCK_INSTAGRAM=true` to develop UI/database flows without live Meta credentials. Never enable mock mode in production.
