# AI Coding Rules for This Repository

Read this file before proposing or writing code in this repository.

---

## Rule 1 — Architecture Alignment
1. **Never Reintroduce Meta OAuth**: Do not add Meta App OAuth, Facebook login dialogs, Graph API tokens, or Better Auth back into this codebase. Public scraping via `lib/instagram/scraper.ts` is the architectural standard.
2. **Database Caching First**: Never perform outbound scraping on normal page loads (`/`). Page views must read cached records from `prisma` / `memoryStore`. Scraping must remain confined to explicit sync actions.

## Rule 2 — UI & React Best Practices
1. **English Interface**: All user-facing text, error messages, badges, and labels must be written in English.
2. **React Key Uniqueness**: Always use compound keys for rendered media lists:
   ```tsx
   key={`${account.id}_${post.instagramMediaId || post.id}`}
   ```
3. **No Unrequested Abstractions**: Keep code minimal, clean, and dependency-free. Do not add heavy npm libraries for scraping.

## Rule 3 — Port Constraints
- The Next.js dev server runs on **port 3000**.
- **Do not kill, touch, or bind to port 20128** (reserved by host system `9router`).

## Rule 4 — Quality Gate
Before reporting a task complete, verify that:
1. `bunx tsc --noEmit` passes with 0 errors.
2. `bun lint` passes with 0 errors.
3. `bun test` passes with 0 failures.
