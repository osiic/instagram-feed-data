<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions for AI Agents

## Project Scope
This project is an **Instagram Multi-Account Public Profile & Feed Scraper** built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Bun.

## Critical Rules for Agents
1. **No Meta OAuth**: Do not write, suggest, or add Meta App OAuth, Facebook login dialogs, or Graph API credentials. Public scraping via `lib/instagram/scraper.ts` is the official mechanism.
2. **Port Isolation**: The app runs on port `3000`. Do NOT kill or bind to port `20128` (reserved by host system `9router`).
3. **Database Caching**: Page requests (`/`) must ONLY read from the database/store. Scraping is restricted to `POST /api/instagram/accounts` and `POST /api/instagram/accounts/sync-all`.
4. **UI Conventions**:
   - Language: Full English.
   - Primary action buttons: "Add Account", "Sync All", "Sync".
   - Key generation: Every post element rendered in `.map()` must use a unique key: `${account.id}_${post.instagramMediaId || post.id}`.
5. **Quality Gate**: Run `bunx tsc --noEmit && bun lint && bun test` before reporting work as complete.
