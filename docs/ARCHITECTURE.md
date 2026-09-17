# Architecture

## High-level

Browser
  -> Next.js UI
  -> Next.js server routes/server actions
  -> Application services
  -> PostgreSQL/Prisma
  -> Meta/Instagram API

Meta OAuth:
Browser -> `/api/instagram/connect`
        -> Meta authorization
        -> `/api/instagram/callback`
        -> validate OAuth state
        -> exchange/obtain token server-side
        -> fetch/validate account
        -> persist account + token
        -> redirect to dashboard

## Layers

### UI
`app/` and `components/`
- Render dashboard.
- Never contain Meta secrets.
- Never call Meta API directly.

### Application services
`lib/instagram/`
- OAuth.
- Account retrieval.
- Media retrieval.
- Insights retrieval.
- Token lifecycle.
- API response normalization.

### Database
`lib/db/` + Prisma.
- Persist SaaS users.
- Persist connected Instagram accounts.
- Persist encrypted/safely stored token material.
- Persist optional synchronized media/insight snapshots.

### Security
`lib/security/`
- Authentication helpers.
- OAuth state validation.
- Token encryption/decryption if implemented.
- Ownership checks.

## Suggested structure

app/
  (auth)/
  dashboard/
  dashboard/accounts/
  dashboard/accounts/[id]/
  dashboard/accounts/[id]/media/
  dashboard/accounts/[id]/insights/
  api/
    instagram/
      connect/
      callback/
      accounts/
      accounts/[id]/
      accounts/[id]/media/
      accounts/[id]/insights/

components/
  ui/
  dashboard/
  instagram/

lib/
  auth/
  db/
  instagram/
    client.ts
    oauth.ts
    account.ts
    media.ts
    insights.ts
  security/
  validations/

prisma/
  schema.prisma

## Data flow
UI -> authenticated server operation -> ownership check -> service -> DB/API -> normalized response -> UI.

Do not scatter raw Meta fetch calls across React components.

## Multi-account isolation
Every InstagramAccount query must be scoped through the authenticated SaaS user. Never trust an account ID alone.

## Caching/sync
For MVP, use a simple database-backed approach. Avoid complex queues unless required. Design service boundaries so background sync can be added later.
