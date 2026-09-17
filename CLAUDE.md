# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server
bun dev

# Build
bun build

# Lint
bun lint

# Type-check (no emit)
bunx tsc --noEmit

# Run all tests
bun test

# Run a single test file
bun test tests/e2e-flow.test.ts

# Database migrations
bunx prisma migrate dev
bunx prisma generate

# Mock mode — UI/DB flows without live Meta credentials
MOCK_INSTAGRAM=true bun dev
```

Run after changes: `bunx tsc --noEmit` -> `bun lint` -> `bun test`.

## Architecture & Data Flow

Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, PostgreSQL + Prisma, Better Auth, Zod validation. Runtime: **bun**.

```
Browser / UI (app/ + components/)
  -> Server Route / Server Action (app/api/...)
  -> Session validation (lib/auth/session.ts)
  -> Multi-tenant ownership check (lib/security/ownership.ts)
  -> Instagram Service (lib/instagram/)
  -> Meta Graph API (or lib/instagram/mock.ts if MOCK_INSTAGRAM=true)
  -> Prisma Client (lib/db/client.ts)
  -> Normalized response (types/api.ts) -> UI
```

### Module Responsibilities

- **`app/`**: Next.js App Router pages and API routes. Route groups: `(auth)` for login/register, `dashboard` for main UI.
- **`components/`**: UI components split into `dashboard/` (layout, header, account switcher) and `instagram/` (media grid, insights cards, modal).
- **`lib/auth/`**: Better Auth setup (`server.ts`), client helpers (`client.ts`), and session validation (`session.ts`).
- **`lib/instagram/`**: Meta Graph API integration. `client.ts` (API calls), `oauth.ts` (token exchange & storage), `account.ts`, `media.ts`, `insights.ts`, and `mock.ts` (mock responses).
- **`lib/security/`**:
  - `encryption.ts`: AES-256-GCM token encryption/decryption via Node crypto (`TOKEN_ENCRYPTION_KEY`).
  - `ownership.ts`: Verifies `InstagramAccount.userId === session.userId`.
  - `oauth-state.ts`: Generates and validates signed OAuth state parameters.
  - `error-handler.ts`: Sanitizes errors to prevent credential leaks.
- **`lib/db/`**: Prisma singleton (`client.ts`).
- **`lib/validations/`**: Zod schemas for env vars, route params, and OAuth callbacks.
- **`prisma/schema.prisma`**: Better Auth tables (`User`, `Session`, `Account`, `Verification`) and domain models (`InstagramAccount`, `InstagramToken`, `InstagramMedia`, `InstagramInsight`).

## Strict Implementation Rules

1. **Multi-Account / Multi-Tenant Isolation**: Every `InstagramAccount` DB query must include `userId: session.userId`. Never query by `id` alone.
2. **Token Security**: Tokens are stored encrypted (AES-256-GCM) in `InstagramToken.encryptedAccessToken`. Never return decrypted tokens to the client or in API responses.
3. **API Errors**: Return standardized `{ error: { code: string, message: string } }` shapes. Never leak provider error bodies, stack traces, or secrets.
4. **Mock Mode**: `MOCK_INSTAGRAM=true` allows full flow testing without Meta API credentials. Ensure mock paths stay behind the same service interfaces.
5. **Meta Graph API**: Official OAuth and Graph API only. No scraping or unofficial endpoints.
