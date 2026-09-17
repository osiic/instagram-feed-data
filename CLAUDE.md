# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Instagram Multi-Account Public Profile & Feed Scraper application.
Users can track any public Instagram account by entering their `@username` (e.g. `cristiano`, `jokowi`, `baron_nduts`).
The app uses a **Database-First Caching** approach:
- Loading the dashboard/home page reads **100% directly from the database** (instant response, zero Instagram requests, zero rate limiting).
- Scraping only occurs when the user submits a new username or clicks **"Sync"** / **"Sync All"**.
- No Meta OAuth, no Facebook login, no API keys, and no Better Auth are required.

## Commands

```bash
# Start dev server (always use port 3000)
bun dev -- --port 3000

# Build production bundle
bunx next build

# Lint check
bun lint

# Type-check (no emit)
bunx tsc --noEmit

# Run unit tests
bun test
```

Always verify changes with: `bunx tsc --noEmit` -> `bun lint` -> `bun test`.

## Environment & Port Constraints

- **Port 3000**: Dedicated to this Next.js project.
- **Port 20128**: Strictly reserved for the host system's `9router`. **NEVER kill, touch, or bind to port 20128.**
- **PostgreSQL**: Port 5432. An in-memory store fallback (`lib/db/memory-store.ts`) is automatically available if PostgreSQL is inactive during local testing.

## Architecture & Data Flow

```
Browser / Client (app/page.tsx)
  -> Home Page: Reads cached accounts & media directly from Prisma / memoryStore (Fast DB Read)
  -> Add / Sync Account: POST /api/instagram/accounts { username }
  -> Sync All Accounts: POST /api/instagram/accounts/sync-all
  -> Scraper Service: lib/instagram/scraper.ts (Native server-side fetch with desktop browser headers)
  -> Database Upsert: Prisma instagramAccount & instagramMedia
  -> Delete Account: POST /api/instagram/accounts/[id]
```

## Key Files & Modules

- **`app/page.tsx`**: Unified single-page UI (English) featuring the Add Account form, Sync All action, multi-account profile summary cards, stats, and recent 12-post grid feeds.
- **`lib/instagram/scraper.ts`**: Pure TypeScript scraper without external npm dependencies. Extracts user profiles (`xig_user_by_username` / OpenGraph meta) and recent timeline posts (`polaris_ordered_timeline_connection`).
- **`app/api/instagram/accounts/route.ts`**: Handles adding new accounts and syncing existing ones.
- **`app/api/instagram/accounts/sync-all/route.ts`**: Triggers batch re-syncing of all connected accounts.
- **`app/api/instagram/accounts/[id]/route.ts`**: Handles account deletion and cascades related media removal.
- **`lib/db/client.ts` & `lib/db/memory-store.ts`**: Prisma client wrapper with transparent in-memory fallback for local development.
- **`feature-get-instagram-data/`**: Standalone documentation and ready-to-copy package for porting this feature into a 3-slot dedicated dashboard (`@baron_nduts`, `@baron_nduts_bbq`, `@baron_nduts.cottage`).

## Strict Implementation Rules

1. **Do Not Reintroduce Meta OAuth**: Meta Graph API/OAuth is permanently deprecated in this repository due to Meta Developer Portal review restrictions.
2. **Database Caching First**: Never trigger live scraping on regular page loads (`app/page.tsx`). Always read from database/store and only scrape on explicit sync actions.
3. **Unique React Keys**: Ensure post items in grids use compound unique keys (`${account.id}_${post.instagramMediaId || post.id}`) to prevent React reconciliation warnings.
4. **Desktop User-Agent**: When fetching Instagram HTML, always send standard modern Chrome Desktop headers to receive the SSR JSON payload containing timeline posts.
